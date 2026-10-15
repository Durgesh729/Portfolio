import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import gsap from "gsap";

interface GSAPAuditEntry {
  type: 'Tween' | 'Timeline';
  targets: string[];
  duration: number;
  paused: boolean;
  isActive: boolean;
  vars: Record<string, string | number | boolean>;
  progress: number;
}

interface GSAPAuditSummary {
  totalChildren: number;
  activeCount: number;
  pausedCount: number;
  results: GSAPAuditEntry[];
}

interface WindowWithAudit extends Window {
  auditGSAP: () => GSAPAuditSummary;
}

if (import.meta.env.DEV) {
  (window as WindowWithAudit).auditGSAP = () => {
    const children = gsap.globalTimeline.getChildren(true, true, true);
    const activeCount = children.filter((c) => c.isActive()).length;
    const pausedCount = children.filter((c) => c.paused()).length;
    const results = children.map((c) => {
      const isTween = !(c instanceof gsap.core.Timeline);
      const asTween = c as gsap.core.Tween;
      const targets = isTween && typeof asTween.targets === "function" ? (asTween.targets() as Element[]) : [];

      const safeVars: Record<string, string | number | boolean> = {};
      if (c.vars) {
        for (const key of Object.keys(c.vars)) {
          const val = (c.vars as Record<string, unknown>)[key];
          if (typeof val === "number" || typeof val === "string" || typeof val === "boolean") {
            safeVars[key] = val;
          } else if (key === "ease") {
            safeVars[key] = typeof val === "function" ? ((val as { name?: string }).name || "customEase") : String(val);
          } else {
            safeVars[key] = `[${typeof val}]`;
          }
        }
      }

      return {
        type: (isTween ? "Tween" : "Timeline") as "Tween" | "Timeline",
        targets: targets.map((t: Element) => {
          if (!t) return "null";
          return t.tagName + (t.className ? "." + t.className.replace(/\s+/g, ".") : "");
        }),
        duration: c.duration(),
        paused: c.paused(),
        isActive: c.isActive(),
        vars: safeVars,
        progress: c.progress(),
      };
    });
    const summary: GSAPAuditSummary = {
      totalChildren: children.length,
      activeCount,
      pausedCount,
      results,
    };
    console.log(summary);
    return summary;
  };
}

createRoot(document.getElementById("root")!).render(<App />);

