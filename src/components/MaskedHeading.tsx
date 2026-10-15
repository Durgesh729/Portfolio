'use client';

import { useState, useCallback, useEffect, useId, useMemo, useRef } from 'react';
import type { CSSProperties, ElementType } from 'react';
import { gsap } from 'gsap';

import './MaskedHeading.css';

const clamp = (v: number, a: number, b: number): number => (v < a ? a : v > b ? b : v);

type Reveal = 'rise' | 'wipe' | 'fade' | 'none';
type Trigger = 'view' | 'mount' | 'hover';

export interface MaskedHeadingProps {
  text?: string;
  tag?: ElementType;
  mediaType?: 'image' | 'video';
  src?: string;
  poster?: string;
  fillScale?: number;
  parallax?: number;
  drift?: number;
  brightness?: number;
  saturation?: number;
  grayscale?: boolean;
  reveal?: Reveal;
  duration?: number;
  stagger?: number;
  trigger?: Trigger;
  align?: 'left' | 'center' | 'right';
  weight?: number;
  tracking?: number;
  lineHeight?: number;
  textScale?: number;
  underline?: boolean;
  className?: string;
  style?: CSSProperties;
  isHovered?: boolean;
  onHoverChange?: (hovered: boolean) => void;
  onClick?: (e?: React.MouseEvent<HTMLElement>) => void;
  [key: string]: unknown;
}

const MaskedHeading: React.FC<MaskedHeadingProps> = ({
  text = 'Designed in the details',
  tag = 'h2',
  mediaType = 'image',
  src = '',
  poster = '',
  fillScale = 1.25,
  parallax = 26,
  drift = 18,
  brightness = 1,
  saturation = 1,
  grayscale = false,
  reveal = 'rise',
  duration = 1.1,
  stagger = 0.09,
  trigger = 'view',
  align = 'center',
  weight = 700,
  tracking = -0.03,
  lineHeight = 1.06,
  textScale = 0.115,
  underline = true,
  className = '',
  style,
  isHovered,
  onHoverChange,
  ...rest
}: MaskedHeadingProps) => {
  const [isWordHovered, setIsWordHovered] = useState(false);
  const isEffectiveHovered = isHovered !== undefined ? isHovered : isWordHovered;

  const rootRef = useRef<HTMLElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const revealRef = useRef<HTMLSpanElement | null>(null);
  const mediaRef = useRef<HTMLSpanElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const underlineRef = useRef<HTMLSpanElement | null>(null);
  const hitboxRef = useRef<HTMLSpanElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const baseRefs = useRef<(HTMLElement | null)[]>([]);
  const glyphRefs = useRef<(SVGTextElement | null)[]>([]);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const offsetRef = useRef<{ x: number; y: number; tx: number; ty: number }>({ x: 0, y: 0, tx: 0, ty: 0 });

  const clipId = `mh-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const words = useMemo(() => String(text).split(/\s+/).filter(Boolean), [text]);

  const settingsRef = useRef<{
    fillScale: number;
    parallax: number;
    drift: number;
    brightness: number;
    saturation: number;
    grayscale: boolean;
    textScale: number;
  }>({ fillScale: 1, parallax: 0, drift: 0, brightness: 1, saturation: 1, grayscale: false, textScale: 0.115 });
  settingsRef.current = { fillScale, parallax, drift, brightness, saturation, grayscale, textScale };

  const place = useCallback(() => {
    const root = rootRef.current;
    const media = mediaRef.current;
    if (!root || !media) return;
    const s = settingsRef.current;
    const W = root.clientWidth;
    const H = root.clientHeight;
    const off = offsetRef.current;

    const maxX = Math.max(0, ((s.fillScale - 1) / 2) * W);
    const maxY = Math.max(0, ((s.fillScale - 1) / 2) * H);

    media.style.transform = `translate3d(${clamp(off.x, -maxX, maxX).toFixed(2)}px, ${clamp(off.y, -maxY, maxY).toFixed(2)}px, 0) scale(${s.fillScale})`;
    media.style.filter = `brightness(${s.brightness}) saturate(${s.saturation})${s.grayscale ? ' grayscale(1)' : ''}`;
  }, []);

  const sync = useCallback(() => {
    const root = rootRef.current;
    const measure = measureRef.current;
    if (!root || !measure) return;
    const s = settingsRef.current;

    const containerW =
      root.closest<HTMLElement>('.memories-heading-wrap')?.clientWidth ||
      root.parentElement?.clientWidth ||
      root.clientWidth;

    root.style.fontSize = `${clamp(containerW * s.textScale, 20, 200).toFixed(1)}px`;

    const cs = window.getComputedStyle(measure);
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < wordRefs.current.length; i += 1) {
      const box = wordRefs.current[i];
      const base = baseRefs.current[i];
      const glyph = glyphRefs.current[i];
      if (!box || !base || !glyph) continue;
      glyph.setAttribute('x', `${box.offsetLeft}`);
      glyph.setAttribute('y', `${base.offsetTop}`);
      glyph.style.fontFamily = cs.fontFamily;
      glyph.style.fontSize = cs.fontSize;
      glyph.style.fontWeight = cs.fontWeight;
      glyph.style.fontStyle = cs.fontStyle;
      glyph.style.letterSpacing = cs.letterSpacing;

      const left = box.offsetLeft;
      const right = left + box.offsetWidth;
      const top = box.offsetTop;
      const bottom = box.offsetTop + box.offsetHeight;
      if (left < minX) minX = left;
      if (right > maxX) maxX = right;
      if (top < minY) minY = top;
      if (bottom > maxY) maxY = bottom;
    }

    if (underlineRef.current && minX < Infinity && maxX > -Infinity) {
      underlineRef.current.style.left = `${minX}px`;
      underlineRef.current.style.width = `${Math.max(0, maxX - minX)}px`;
      underlineRef.current.style.top = `${maxY + 6}px`;
    }

    if (hitboxRef.current && minX < Infinity && maxX > -Infinity) {
      hitboxRef.current.style.left = `${minX}px`;
      hitboxRef.current.style.top = `${minY}px`;
      hitboxRef.current.style.width = `${Math.max(0, maxX - minX)}px`;
      hitboxRef.current.style.height = `${Math.max(0, maxY - minY + 12)}px`;
    }

    place();
  }, [place]);

  useEffect(() => {
    if (mediaType === 'video' && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [mediaType, src]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(root);
    if (root.parentElement) {
      ro.observe(root.parentElement);
    }
    const wrap = root.closest<HTMLElement>('.memories-heading-wrap');
    if (wrap && wrap !== root.parentElement) {
      ro.observe(wrap);
    }
    window.addEventListener('resize', sync);
    if (document.fonts?.ready) document.fonts.ready.then(sync).catch(() => {});

    let raf = 0;
    let last = performance.now();
    let clock = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;
      const s = settingsRef.current;
      const off = offsetRef.current;

      const dx = Math.sin(clock * 0.21) * s.drift;
      const dy = Math.cos(clock * 0.17) * s.drift * 0.6;

      const ease = 1 - Math.exp(-dt / 0.18);
      off.x += (off.tx + dx - off.x) * ease;
      off.y += (off.ty + dy - off.y) * ease;

      place();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const s = settingsRef.current;
      if (s.parallax <= 0) return;
      const r = root.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / (r.width || 1)) * 2 - 1;
      const ny = ((e.clientY - r.top) / (r.height || 1)) * 2 - 1;
      offsetRef.current.tx = clamp(nx, -1, 1) * -s.parallax;
      offsetRef.current.ty = clamp(ny, -1, 1) * -s.parallax;
    };

    const onLeave = () => {
      offsetRef.current.tx = 0;
      offsetRef.current.ty = 0;
    };

    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', sync);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, [place, sync]);

  useEffect(() => {
    sync();
  }, [sync, words, tag, align, weight, tracking, lineHeight, textScale]);

  useEffect(() => {
    const root = rootRef.current;
    const layer = revealRef.current;
    if (!root || !layer) return;
    const glyphs = glyphRefs.current.filter(Boolean);
    if (!glyphs.length) return;

    const riseDistance = () => (parseFloat(window.getComputedStyle(root).fontSize) || 48) * 1.15;

    const settle = () => {
      gsap.set(glyphs, { y: 0 });
      gsap.set(layer, { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' });
    };

    const rest = () => {
      if (reveal === 'rise') {
        gsap.set(glyphs, { y: riseDistance() });
      } else if (reveal === 'wipe') {
        gsap.set(layer, { clipPath: 'inset(0% 100% 0% 0%)' });
      } else if (reveal === 'fade') {
        gsap.set(layer, { opacity: 0, scale: 1.08 });
      }
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reveal === 'none' || reduce) {
      settle();
      return;
    }

    const play = () => {
      tweenRef.current?.kill();
      if (reveal === 'rise') {
        gsap.set(layer, { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' });
        tweenRef.current = gsap.fromTo(
          glyphs,
          { y: riseDistance() },
          { y: 0, duration, stagger, ease: 'power4.out', overwrite: 'auto' }
        );
      } else if (reveal === 'wipe') {
        gsap.set(glyphs, { y: 0 });
        const state = { p: 100 };
        tweenRef.current = gsap.to(state, {
          p: 0,
          duration,
          ease: 'power3.inOut',
          overwrite: 'auto',
          onUpdate: () => {
            layer.style.clipPath = `inset(0% ${state.p}% 0% 0%)`;
          }
        });
      } else {
        gsap.set(glyphs, { y: 0 });
        tweenRef.current = gsap.fromTo(
          layer,
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration, ease: 'power3.out', overwrite: 'auto' }
        );
      }
    };

    if (trigger === 'hover') {
      settle();
      root.addEventListener('pointerenter', play);
      return () => {
        root.removeEventListener('pointerenter', play);
        tweenRef.current?.kill();
      };
    }

    if (trigger === 'view') {
      settle();
      rest();
      const io = new IntersectionObserver(
        entries => {
          if (entries.some(e => e.isIntersecting)) {
            play();
            io.disconnect();
          }
        },
        { threshold: 0.25 }
      );
      io.observe(root);
      return () => {
        io.disconnect();
        tweenRef.current?.kill();
      };
    }

    play();
    return () => tweenRef.current?.kill();
  }, [reveal, trigger, duration, stagger, words]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const TagAny = tag as any;
  const isInteractive = Boolean(rest.onClick);

  return (
    <TagAny
      ref={rootRef}
      className={`masked-heading ${isEffectiveHovered ? 'masked-heading--word-hovered' : ''} ${isInteractive ? 'masked-heading--interactive' : ''} ${className}`.trim()}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onMouseEnter={() => {
        setIsWordHovered(true);
        onHoverChange?.(true);
      }}
      onMouseLeave={() => {
        setIsWordHovered(false);
        onHoverChange?.(false);
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          (rest.onClick as (e: unknown) => void)?.(e);
        }
      }}
      style={{
        textAlign: align,
        fontWeight: weight,
        letterSpacing: `${tracking}em`,
        lineHeight,
        ...style
      }}
      {...rest}
    >
      <span ref={measureRef} className="masked-heading__measure">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            ref={(el: HTMLSpanElement | null) => {
              wordRefs.current[i] = el;
            }}
            className="masked-heading__word"
          >
            {word}
            <i
              ref={(el: HTMLElement | null) => {
                baseRefs.current[i] = el;
              }}
              className="masked-heading__baseline"
            />
          </span>
        ))}
      </span>

      <svg className="masked-heading__defs" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            {words.map((word, i) => (
              <text
                key={`${word}-${i}`}
                ref={(el: SVGTextElement | null) => {
                  glyphRefs.current[i] = el;
                }}
              >
                {word}
              </text>
            ))}
          </clipPath>
        </defs>
      </svg>

      <span ref={revealRef} className="masked-heading__reveal">
        <span className="masked-heading__clip" style={{ clipPath: `url(#${clipId})` }}>
          <span ref={mediaRef} className="masked-heading__media">
            {mediaType === 'video' ? (
              <video
                ref={videoRef}
                className="masked-heading__source"
                src={src}
                poster={poster}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img className="masked-heading__source" src={src} alt="" draggable={false} />
            )}
          </span>
        </span>
      </span>

      {underline && (
        <span ref={underlineRef} className="masked-heading__underline-bar" aria-hidden="true">
          <span className="masked-heading__underline-line" />
        </span>
      )}

      {/* Interactive hitbox covering strictly the words */}
      <span
        ref={hitboxRef}
        className="masked-heading__hitbox"
        onMouseEnter={() => {
          setIsWordHovered(true);
          onHoverChange?.(true);
        }}
        onMouseLeave={() => {
          setIsWordHovered(false);
          onHoverChange?.(false);
        }}
        onClick={(e) => {
          if (rest.onClick) {
            (rest.onClick as (e: unknown) => void)(e);
          }
        }}
        aria-hidden="true"
      />
    </TagAny>
  );
};

export default MaskedHeading;
