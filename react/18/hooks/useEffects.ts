/**
 * useEffects hook — plays GSAP animations when effects fire.
 *
 * Components call useEffects(effects).
 * Returns a ref and trigger function.
 */
import { useRef, useCallback } from "react";
import gsap from "gsap";
import type { Effect } from "safecomponents";

function createOverlay(target: HTMLElement, color: string, dur: number, delay: number): gsap.core.Timeline {
  const overlay = document.createElement("div");
  overlay.style.cssText = `position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:99;background:${color};opacity:0`;
  target.style.position = "relative";
  target.style.overflow = "hidden";
  target.appendChild(overlay);
  return gsap.timeline()
    .to(overlay, { opacity: 1, duration: dur * 0.3, delay, ease: "power2.out" })
    .to(overlay, { opacity: 0, duration: dur * 0.7, ease: "power2.inOut", onComplete: () => overlay.remove() });
}

/** Play a named effect on a DOM element. */
function playEffect(el: HTMLElement, effect: Effect): gsap.core.Tween | gsap.core.Timeline | null {
  const dur = (effect.duration ?? 600) / 1000;
  const delay = (effect.delay ?? 0) / 1000;
  const target = el.querySelector("[data-component]") as HTMLElement ?? el;

  switch (effect.effect) {
    case "increment": {
      const fieldEl = effect.field
        ? target.querySelector(`[data-field="${effect.field}"]`) ?? target
        : target;
      const text = fieldEl.textContent ?? "0";
      const endVal = parseFloat(text.replace(/[^0-9.\-]/g, "")) || 0;
      const obj = { val: 0 };
      return gsap.to(obj, {
        val: endVal, duration: dur, delay, ease: "power2.out",
        onUpdate: () => { fieldEl.textContent = Math.round(obj.val).toLocaleString(); },
      });
    }

    case "pulse":
      return gsap.timeline()
        .to(target, { scale: 1.08, duration: dur * 0.4, delay, ease: "power2.out" })
        .to(target, { scale: 1, duration: dur * 0.6, ease: "elastic.out(1, 0.5)" });

    case "highlight":
      return createOverlay(target, "color-mix(in srgb, var(--sd-accent) 25%, transparent)", dur, delay);

    case "shake":
      return gsap.timeline({ delay })
        .to(target, { x: -6, duration: dur * 0.1 })
        .to(target, { x: 6, duration: dur * 0.1 })
        .to(target, { x: -4, duration: dur * 0.1 })
        .to(target, { x: 4, duration: dur * 0.1 })
        .to(target, { x: 0, duration: dur * 0.1 });

    case "flash-green":
      return createOverlay(target, "color-mix(in srgb, var(--sd-success) 30%, transparent)", dur, delay);

    case "flash-red":
      return createOverlay(target, "color-mix(in srgb, var(--sd-danger) 30%, transparent)", dur, delay);

    case "confetti": {
      const confettiColors = ["var(--sd-accent)", "var(--sd-success)", "var(--sd-warning)", "var(--sd-danger)", "var(--sd-chart-3, #bc8cff)"];
      const tl = gsap.timeline({ delay });
      target.style.overflow = "visible";
      target.style.position = "relative";
      for (let i = 0; i < 12; i++) {
        const particle = document.createElement("div");
        particle.style.cssText = `position:absolute;width:6px;height:6px;border-radius:50%;pointer-events:none;z-index:99;background:${confettiColors[i%5]}`;
        target.appendChild(particle);
        const angle = (i / 12) * Math.PI * 2;
        const dist = 30 + Math.random() * 40;
        const cx = target.offsetWidth / 2;
        const cy = target.offsetHeight / 2;
        tl.fromTo(particle,
          { x: cx, y: cy, opacity: 1, scale: 1 },
          { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist - 20, opacity: 0, scale: 0,
            duration: dur * 0.8, ease: "power2.out", onComplete: () => particle.remove() },
          0);
      }
      return tl;
    }

    case "strikethrough": {
      const line = document.createElement("div");
      line.style.cssText = "position:absolute;top:50%;left:0;width:0;height:2px;background:var(--sd-text);pointer-events:none;z-index:99";
      target.style.position = "relative";
      target.appendChild(line);
      return gsap.to(line, { width: "100%", duration: dur, delay, ease: "power2.inOut",
        onComplete: () => { gsap.to(line, { opacity: 0, duration: 0.3, delay: 0.5, onComplete: () => line.remove() }); }
      });
    }

    default:
      return null;
  }
}

/**
 * Hook: returns a ref callback and a trigger function.
 */
export function useEffects(effects?: Record<string, Effect>) {
  const elRef = useRef<HTMLElement | null>(null);

  const trigger = useCallback((eventKey: string) => {
    if (!elRef.current || !effects) return;
    const effect = effects[eventKey];
    if (!effect) return;
    playEffect(elRef.current, effect);
  }, [effects]);

  const setRef = useCallback((el: HTMLElement | null) => {
    elRef.current = el;
  }, []);

  return { ref: setRef, trigger };
}

export { playEffect };
