/**
 * Huddlekit-Feedback-Widget – nur im Feedback-Modus.
 *
 * Der Feedback-Modus wird im <head>-Skript (layout.tsx, FEEDBACK_ERKENNEN) erkannt und als Klasse
 * «feedback-modus» auf <html> gesetzt. Erst dann wird der Huddlekit-Lader eingebunden – als letztes
 * Element vor </body>. Normale Besucher laden nichts von Huddlekit.
 *
 * Im Feedback-Modus sind weiches Scrollen, eigener Mauszeiger und Intro aus,
 * damit Elemente sauber markiert werden können (Buehne.tsx, Zeiger.tsx).
 */
const HUDDLEKIT_SRC = "https://app.huddlekit.com/sdk/huddlekit.js";
const HUDDLEKIT_KEY = "pk_live_k9Z5SV-YuN3j3iJiOwjM";

/** Gleiche Bedingungen wie im Huddlekit-Lader selbst, plus Merker für die laufende Sitzung. */
export const FEEDBACK_ERKENNEN = `var fb=false;try{var q=new URLSearchParams(location.search);fb=['huddlekit','huddlekit_auth','hk_comment'].some(function(k){return q.has(k)});
if(!fb&&sessionStorage.getItem('tl-feedback')==='1')fb=true;
if(!fb&&sessionStorage.getItem('huddlekit_guest_access')==='true')fb=true;
for(var i=0;!fb&&i<localStorage.length;i++){if((localStorage.key(i)||'').indexOf('huddlekit_widget_auth')===0)fb=true}
if(fb)sessionStorage.setItem('tl-feedback','1')}catch(e){}`;

// Lader nur einmal einfügen: weder doppeltes <script> noch zweiter Start des Laders
const LADEN = `(function(){var d=document;if(!d.documentElement.classList.contains('feedback-modus'))return;
if(window.__HUDDLEKIT_LOADER__||d.querySelector('script[src="${HUDDLEKIT_SRC}"]'))return;
try{var u=new URL(location.href);if(!['huddlekit','huddlekit_auth','hk_comment'].some(function(k){return u.searchParams.has(k)})){u.searchParams.set('huddlekit','');history.replaceState(history.state,'',u.toString().replace('huddlekit=','huddlekit'))}}catch(e){}
var s=d.createElement('script');s.src='${HUDDLEKIT_SRC}';s.setAttribute('data-project-key','${HUDDLEKIT_KEY}');s.async=true;d.body.appendChild(s)})()`;

export default function Feedback() {
  return <script id="huddlekit-laden" dangerouslySetInnerHTML={{ __html: LADEN }} />;
}

export const istFeedbackModus = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains("feedback-modus");
