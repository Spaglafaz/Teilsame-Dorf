import Animationen from "@/components/Animationen";

// template.tsx wird bei jedem Seitenwechsel neu eingehängt – ideal für Eintritts-Animationen.
export default function Template({ children }: { children: React.ReactNode }) {
  return <Animationen>{children}</Animationen>;
}
