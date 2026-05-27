import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import "./ChromaGrid.css";

export interface ChromaItem {
  image: string;
  title: string;
  subtitle: string;
  description: string;
  location?: string;
  borderColor?: string;
  gradient?: string;

}

export interface ChromaGridProps {
  items?: ChromaItem[];
  className?: string;
  radius?: number;
  columns?: number;
  rows?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}

type SetterFn = (v: number | string) => void;

export const ChromaGrid: React.FC<ChromaGridProps> = ({
  items,
  className = "",
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<SetterFn | null>(null);
  const setY = useRef<SetterFn | null>(null);
  const pos = useRef({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState({
    show: false,
    content: "",
    x: 0,
    y: 0,
  });

  const demo: ChromaItem[] = [
    {
      image: "/assets/testimonials/HARIHAR.png",
      title: "Harihar Patra",
      subtitle: "Owner, Patra Tours & Travels",
      description: "Our social media was directionless until Illusory took over. They didn’t just manage pages — they gave our travel brand a voice, rhythm, and personality. What impressed me most was their consistency and control — even under tight deadlines, they delivered with excellence.",
      borderColor: "#4F46E5",
      gradient: "linear-gradient(145deg, #4F46E5, #000)",
    },
    {
      image: "/assets/testimonials/ADNAN (ADDY).png",
      title: "Adnan Ali",
      subtitle: "Founder, Addy Meals & Addy Fitness",
      description: "What set Illusory apart was how deeply they understood the soul of my brand. They didn’t just deliver designs — they created a visual language that matched my energy and vision.",
      borderColor: "#10B981",
      gradient: "linear-gradient(210deg, #10B981, #000)",
    },
    {
      image: "/assets/testimonials/NAGESH (MCO).png",
      title: "Nagesh Ranjan Mohanty",
      subtitle: "Marketing Head, My City Odisha",
      description: "With Illusory, we don’t just outsource tasks — we gain a full-fledged marketing partner. From high-quality site shoots to strategic digital campaigns, they take complete ownership of our real estate projects. Illusory blends creative firepower with sharp sales strategy. Unlike most agencies, they don’t just push content — they focus on conversions. Every piece, from walkthrough videos to landing pages and lead-gen visuals, is clean, targeted, and aligned with buyer behavior. They know how to drive attention and build trust. Every phase, from awareness to deal closure, feels handled with business-minded clarity. Their work helps transform leads into buyers. That’s rare.",
      borderColor: "#F59E0B",
      gradient: "linear-gradient(165deg, #F59E0B, #000)",
    },
    {
      image: "/assets/testimonials/SAILESH(CORPORATE CHEETAHS).png",
      title: "Shailesh Kumar Sinha",
      subtitle: "Co-Founder, Corporate Cheetahs",
      description: "Illusory treated our cricket team like a startup brand. The energy they brought into building our identity — from logo to jerseys to digital buzz — was unmatched. They made our team look premium and professional, yet rooted in team spirit. Their strength? Bringing emotion into branding. They understood the pride, competitiveness, and joy we wanted to show, and channeled it into every asset. It wasn’t just branding; it was culture-building.",
      borderColor: "#EF4444",
      gradient: "linear-gradient(195deg, #EF4444, #000)",
    },
    {
      image: "/assets/testimonials/SANSKAR(RAJ ELECTRONICS).png",
      title: "Siddharth Sanskar",
      subtitle: "Owner, Raj Electronics",
      description: "I needed a team that got retail — fast-paced, visually noisy, and fiercely competitive. Illusory didn’t just understand it; they thrived in it. From day one, they captured the energy of our space and translated it into visuals that cut through the clutter. Their turnaround time is impressive, and what truly sets them apart is how consistently fresh and on-brand their ideas are. They keep reinventing without losing our voice. The balance between trend-savvy design and customer-centric messaging was spot-on. They brought visual discipline to our marketing and it paid off.",
      borderColor: "#8B5CF6",
      gradient: "linear-gradient(225deg, #8B5CF6, #000)",
    },
    {
      image: "/assets/testimonials/SASWAT.png",
      title: "Saswat Panda",
      subtitle: "Founder, Puraane Sikke",
      description: "I came with a niche concept and left with a brand identity that people instantly connect with. Illusory embraced the uniqueness of Puraane Sikke and amplified it through timeless design. They didn’t overcomplicate it — they refined it. Their strength lies in minimalism with meaning. Every poster and visual they created held emotional and cultural relevance, making my brand instantly recognizable. They're storytellers disguised as designers.",
      borderColor: "#06B6D4",
      gradient: "linear-gradient(135deg, #06B6D4, #000)",
    },
  ];
  const data = items?.length ? items : demo;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px") as SetterFn;
    setY.current = gsap.quickSetter(el, "--y", "px") as SetterFn;
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e: React.PointerEvent) => {
    const r = rootRef.current!.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };



  const handleCardMove: React.MouseEventHandler<HTMLElement> = (e) => {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };



  const showTooltip = (e: React.MouseEvent, content: string) => {
    setTooltip({
      show: true,
      content,
      x: e.clientX + 10,
      y: e.clientY + 10,
    });
  };

  const hideTooltip = () => {
    setTooltip({ ...tooltip, show: false });
  };
  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={
        {
          "--r": `${radius}px`,
          "--cols": columns,
          "--rows": rows,
        } as React.CSSProperties
      }
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {data.map((c, i) => (
        <article
          key={i}
          className="chroma-card"
          onMouseMove={handleCardMove}

          style={
            {
              "--card-border": c.borderColor || "transparent",
              "--card-gradient": c.gradient,

            } as React.CSSProperties
          }
        >
          <div className="chroma-img-wrapper">
            <img src={c.image} alt={c.title} loading="lazy" />
          </div>
          <footer className="chroma-info">
            <h3 className="name">{c.title}</h3>
            <p className="role">{c.subtitle}</p>
            <p className="line-clamp-3 description-tooltip"
              onMouseEnter={(e) => showTooltip(e, c.description)}
              onMouseLeave={hideTooltip}
              onMouseMove={(e) => {
                setTooltip(prev => ({
                  ...prev,
                  x: e.clientX + 10,
                  y: e.clientY + 10
                }));
              }}>{c.description}</p>
          </footer>
        </article>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
      {tooltip.show && (
        <div
          className="bg-neutral-800 max-w-md p-4 rounded-xl"
          style={{
            position: 'fixed',
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            zIndex: 1000,
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default ChromaGrid;
