<?php
/**
 * Formular-Versand für www.teilsame-lungern-dorf.ch (Kontakt und Teilenregister).
 * Läuft auf jedem Webhosting mit PHP und mail() (z. B. hosttech/Plesk).
 * Vor der Aufschaltung: Adressen unten prüfen und einen Testversand machen.
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

const ABSENDER = 'info@teilsame-lungern-dorf.ch';   // muss eine Adresse der eigenen Domain sein
const STANDARD = 'info@teilsame-lungern-dorf.ch';
const ZIELE = [
    'allgemein'      => 'praesident@teilsame-lungern-dorf.ch',
    'garten'         => 'gartenverwalter@teilsame-lungern-dorf.ch',
    'alpen'          => 'info@teilsame-lungern-dorf.ch',
    'teilenregister' => 'aktuar@teilsame-lungern-dorf.ch',
    'finanzen'       => 'info@teilsame-lungern-dorf.ch',
];
const MAX_BYTES = 8 * 1024 * 1024;
const ERLAUBT = ['application/pdf' => 'pdf', 'image/jpeg' => 'jpg', 'image/png' => 'png'];

function antwort(bool $ok, int $code = 200, string $meldung = ''): void {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'meldung' => $meldung]);
    exit;
}

function feld(string $name, int $max = 2000): string {
    $w = isset($_POST[$name]) ? trim((string) $_POST[$name]) : '';
    $w = str_replace(["\r\n", "\r"], "\n", $w);
    return mb_substr($w, 0, $max);
}

function zeile(string $w): string {
    // keine Zeilenumbrüche in Kopfzeilen (Header-Injection verhindern)
    return trim(preg_replace('/[\r\n]+/', ' ', $w));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') antwort(false, 405);

// Spam-Schutz: verstecktes Feld muss leer sein
if (feld('website') !== '') antwort(true);

$art = feld('formular', 30);
if (!in_array($art, ['kontakt', 'teilenregister'], true)) antwort(false, 400, 'Unbekanntes Formular');
if (feld('datenschutz') === '') antwort(false, 422, 'Einwilligung fehlt');

$email = zeile(feld('email', 200));
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) antwort(false, 422, 'E-Mail ungültig');

if ($art === 'kontakt') {
    $pflicht = ['name', 'email', 'anliegen', 'nachricht'];
    $anliegen = feld('anliegen', 30);
    $an = ZIELE[$anliegen] ?? STANDARD;
    $betreff = 'Kontaktformular: ' . zeile(feld('name', 120));
    $felder = ['Name' => 'name', 'E-Mail' => 'email', 'Telefon' => 'telefon', 'Anliegen' => 'anliegen', 'Nachricht' => 'nachricht'];
} else {
    $pflicht = ['vorname', 'nachname', 'geburtsdatum', 'adresse', 'vater', 'mutter', 'gesuch'];
    $an = ZIELE['teilenregister'];
    $betreff = 'Teilenregister: ' . zeile(feld('vorname', 80) . ' ' . feld('nachname', 80));
    $felder = [
        'Vorname' => 'vorname', 'Nachname' => 'nachname', 'Familienname (ledig)' => 'ledigname', 'Geburtsdatum' => 'geburtsdatum',
        'Adresse' => 'adresse', 'Vater' => 'vater', 'Mutter' => 'mutter', 'E-Mail' => 'email', 'Telefon' => 'telefon',
        'Ehepartner/in' => 'partner', 'Ich ersuche um' => 'gesuch', 'Bemerkungen' => 'bemerkungen',
    ];
}
foreach ($pflicht as $p) {
    if (feld($p) === '') antwort(false, 422, 'Pflichtfeld fehlt');
}

$text = "Neue Anfrage über www.teilsame-lungern-dorf.ch\n\n";
foreach ($felder as $label => $name) {
    $w = feld($name);
    if ($w !== '') $text .= $label . ":\n" . $w . "\n\n";
}
$text .= "Datenschutz-Einwilligung: erteilt\nGesendet: " . date('d.m.Y H:i') . "\n";

// Anhänge (nur Teilenregister)
$anhaenge = [];
if ($art === 'teilenregister' && !empty($_FILES['unterlagen']) && is_array($_FILES['unterlagen']['name'])) {
    $total = 0;
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    foreach ($_FILES['unterlagen']['name'] as $i => $name) {
        if ($_FILES['unterlagen']['error'][$i] === UPLOAD_ERR_NO_FILE) continue;
        if ($_FILES['unterlagen']['error'][$i] !== UPLOAD_ERR_OK) antwort(false, 422, 'Upload fehlgeschlagen');
        $tmp = $_FILES['unterlagen']['tmp_name'][$i];
        $mime = $finfo->file($tmp);
        if (!isset(ERLAUBT[$mime])) antwort(false, 422, 'Dateityp nicht erlaubt');
        $total += filesize($tmp);
        if ($total > MAX_BYTES) antwort(false, 413, 'Dateien zu gross');
        $sauber = preg_replace('/[^A-Za-z0-9._-]/', '_', basename($name));
        $anhaenge[] = ['name' => $sauber, 'mime' => $mime, 'daten' => file_get_contents($tmp)];
    }
}

$grenze = 'tld-' . bin2hex(random_bytes(12));
$kopf = [
    'From: Teilsame Lungern-Dorf <' . ABSENDER . '>',
    'MIME-Version: 1.0',
    'Content-Type: multipart/mixed; boundary="' . $grenze . '"',
];
if ($email !== '') $kopf[] = 'Reply-To: ' . $email;

$inhalt = "--$grenze\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
    . chunk_split(base64_encode($text)) . "\r\n";
foreach ($anhaenge as $a) {
    $inhalt .= "--$grenze\r\nContent-Type: {$a['mime']}; name=\"{$a['name']}\"\r\n"
        . "Content-Disposition: attachment; filename=\"{$a['name']}\"\r\nContent-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($a['daten'])) . "\r\n";
}
$inhalt .= "--$grenze--";

$betreffKodiert = '=?UTF-8?B?' . base64_encode(zeile($betreff)) . '?=';
$ok = mail($an, $betreffKodiert, $inhalt, implode("\r\n", $kopf), '-f' . ABSENDER);

antwort($ok, $ok ? 200 : 500);
