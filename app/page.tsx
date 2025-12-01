"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { BlogSection } from "./components/blog-section";
import { OptimizedParticleSystem } from "./components/optimized-particle-system";
import { MagneticCard } from "./components/magnetic-card";
import { TypewriterText } from "./components/typewriter-text";

type NavItem = {
  id: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "oss", label: "Open Source" },
  { id: "saas", label: "Products" },
  { id: "experience", label: "Experience" },
  { id: "certs", label: "Certificates" },
  { id: "blog", label: "DevBlog" },
  { id: "hobbies", label: "Hobbies" },
  { id: "contact", label: "Contact" },
];

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(id);
          });
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.2, 0.6, 1] }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);
  return active;
}

function GlowBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -top-40 -left-40 h-[40rem] w-[40rem] rounded-full bg-fuchsia-600/20 blur-3xl animate-float-slow gpu-accelerated" />
      <div className="absolute top-1/3 -right-40 h-[35rem] w-[35rem] rounded-full bg-cyan-500/20 blur-3xl animate-[float-slow_7s_ease-in-out_infinite] gpu-accelerated" />
      <div className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-emerald-500/10 blur-3xl animate-[float-slow_8s_ease-in-out_infinite] gpu-accelerated" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04),rgba(0,0,0,0))]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_0%,rgba(0,0,0,0.25)_100%)]" />
      <div className="absolute inset-0 opacity-20 animate-hue gpu-accelerated"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0px, transparent 2px, rgba(255,255,255,0.06) 3px, transparent 4px)",
        }}
      />
    </div>
  );
}

function MagneticButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - (rect.left + rect.width / 2);
      const my = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${mx * 0.1}px, ${my * 0.1}px) scale(1.05)`;
    };
    const reset = () => {
      if (el) el.style.transform = "translate(0px, 0px) scale(1)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", reset);
    };
  }, []);
  return (
    <button
      ref={ref}
      {...props}
      className={`group relative overflow-hidden rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm text-white/90 backdrop-blur-strong smooth-transition hover:bg-white/10 hover-lift gpu-accelerated ${props.className ?? ""}`}
    >
      <span className="relative z-10">{props.children}</span>
      <span className="absolute inset-0 translate-y-10 bg-gradient-to-r from-fuchsia-600/20 via-cyan-500/20 to-emerald-500/20 opacity-0 smooth-transition group-hover:translate-y-0 group-hover:opacity-100" />
    </button>
  );
}

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <section 
      ref={ref}
      id={id} 
      className={`scroll-mt-24 py-16 sm:py-24 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl animate-gradient-shift bg-gradient-to-r from-white via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-sm text-neutral-300">{subtitle}</p>
          ) : null}
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-strong">
          {children}
        </div>
      </div>
    </section>
  );
}

function SkillRadarChart({ skills }: { skills: Array<{ name: string; level: number; color: string }> }) {
  const size = 200;
  const center = size / 2;
  const levels = 5;
  
  return (
    <div className="relative inline-block">
      <svg width={size} height={size} className="transform-gpu gpu-accelerated">
        {/* Grid circles */}
        {Array.from({ length: levels }).map((_, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={(center - 20) * ((i + 1) / levels)}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            className="animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
        
        {/* Skill polygon */}
        <polygon
          points={skills.map((skill, i) => {
            const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
            const radius = (center - 20) * (skill.level / 100);
            const x = center + Math.cos(angle) * radius;
            const y = center + Math.sin(angle) * radius;
            return `${x},${y}`;
          }).join(' ')}
          fill="rgba(217, 70, 239, 0.2)"
          stroke="rgba(217, 70, 239, 0.8)"
          strokeWidth="2"
          className="animate-grow gpu-accelerated"
          style={{ '--tw-grow-width': '100%' } as React.CSSProperties}
        />
        
        {/* Labels */}
        {skills.map((skill, i) => {
          const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
          const labelRadius = center - 10;
          const x = center + Math.cos(angle) * labelRadius;
          const y = center + Math.sin(angle) * labelRadius;
          
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-neutral-300 text-xs animate-fade-in-up"
              style={{ animationDelay: `${500 + i * 100}ms` }}
            >
              {skill.name}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function ProjectCard({ project, index }: { project: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <MagneticCard key={index} intensity={0.08} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
      <div 
        className="group overflow-hidden rounded-xl border border-white/10 bg-neutral-900/60 transform-gpu smooth-transition hover:scale-105 hover:border-fuchsia-500/30 hover:shadow-lg hover:shadow-fuchsia-500/20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-40 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br from-fuchsia-600/30 via-cyan-500/20 to-emerald-500/20 smooth-transition ${isHovered ? 'scale-110 rotate-3' : 'scale-100 rotate-0'}`} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-6xl smooth-transition ${isHovered ? 'scale-125 opacity-100' : 'scale-100 opacity-50'}`}>
              ✦
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="font-medium text-white group-hover:text-fuchsia-300 smooth-transition">
            {project.title}
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-neutral-300">
            {project.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-300">
            {project.tech.map((t: string) => (
              <span key={t} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 smooth-transition hover:border-fuchsia-500/30 hover:bg-fuchsia-500/10">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <MagneticButton className="text-xs">Demo</MagneticButton>
            <MagneticButton className="text-xs">Code</MagneticButton>
          </div>
        </div>
      </div>
    </MagneticCard>
  );
}

export default function Home() {
  const active = useActiveSection(NAV_ITEMS.map((n) => n.id));
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const handleScrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Trigger initial animations
    setTimeout(() => setIsLoaded(true), 100);
  }, []);
  
  const heroBadge = useMemo(
    () => (
      <div className={`inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 animate-pulse-glow backdrop-blur-strong ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(16,185,129,0.6)]" />
        Open to impact-driven roles
      </div>
    ),
    [isLoaded]
  );
  
  const skills = [
    { name: "Frontend", level: 90, color: "from-fuchsia-500 to-pink-500" },
    { name: "Backend", level: 88, color: "from-cyan-400 to-sky-500" },
    { name: "DevOps", level: 72, color: "from-emerald-400 to-lime-400" },
    { name: "Security", level: 65, color: "from-red-400 to-orange-400" },
    { name: "Mobile", level: 78, color: "from-purple-400 to-indigo-400" },
    { name: "AI/ML", level: 60, color: "from-yellow-400 to-amber-400" },
  ];
  
  const projects = Array.from({ length: 6 }, (_, i) => ({
    title: `Project Title ${i + 1}`,
    description: "Brief description of the project highlighting impact and tech choices.",
    tech: ["TS", "React", "Node"]
  }));
  
  return (
    <div className="relative min-h-screen">
      <OptimizedParticleSystem />
      <GlowBackground />
      
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-neutral-900">
        <div 
          className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 smooth-transition gpu-accelerated"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      {/* Top Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-strong supports-[backdrop-filter]:bg-neutral-950/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 overflow-hidden rounded-md animate-pulse-glow gpu-accelerated">
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500 to-cyan-400 opacity-90" />
              <div className="absolute inset-0 mix-blend-overlay"
                   style={{ backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35) 0 20%, transparent 21%)" }} />
            </div>
            <span className="font-semibold tracking-tight">Your Name</span>
          </div>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScrollTo(item.id)}
                className={`rounded-full px-3 py-1.5 text-xs smooth-transition hover-lift ${
                  active === item.id
                    ? "bg-white/15 text-white scale-105 animate-pulse-glow"
                    : "text-white/70 hover:bg-white/10 hover:text-white hover:scale-105"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="md:hidden">
            <MagneticButton onClick={() => handleScrollTo("contact")}>
              Contact
            </MagneticButton>
          </div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </header>

      {/* Hero */}
      <section id="hero" className="relative mx-auto grid max-w-6xl scroll-mt-24 grid-cols-1 items-center gap-8 px-4 py-16 sm:py-24 md:grid-cols-2">
        <div className="relative z-10">
          {heroBadge}
          <h1 className={`mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl bg-gradient-to-r from-white via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent animate-gradient-shift ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
            <TypewriterText text="I craft resilient, elegant systems with a taste for the edge cases." speed={50} />
          </h1>
          <p className={`mt-4 max-w-xl text-neutral-300 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>
            Developer, builder, and design-minded engineer. I fuse performance, accessibility,
            and creative polish to ship unforgettable products.
          </p>
          <div className={`mt-6 flex flex-wrap gap-3 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '600ms' }}>
            <MagneticButton onClick={() => handleScrollTo("projects")}>
              View Projects
            </MagneticButton>
            <MagneticButton onClick={() => handleScrollTo("blog")}>
              Read DevBlog
            </MagneticButton>
          </div>
          <div className={`mt-8 flex items-center gap-4 text-xs text-neutral-300 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '800ms' }}>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Performance-first
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              Accessible
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-fuchsia-400 animate-pulse" />
              Delightful UX
            </span>
          </div>
        </div>
        <div className="relative perspective-1000">
          <MagneticCard intensity={0.05} className="animate-scale-in" style={{ animationDelay: '400ms' }}>
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-0.5 backdrop-blur-strong transform-gpu smooth-transition hover:rotate-3 hover:scale-105">
              <div className="absolute inset-0 animate-hue opacity-30 gpu-accelerated"
                   style={{ backgroundImage: "conic-gradient(from 180deg at 50% 50%, rgba(217,70,239,0.25), rgba(34,211,238,0.25), rgba(16,185,129,0.25), rgba(217,70,239,0.25))" }} />
              <div className="relative z-10 grid h-full grid-cols-3 grid-rows-3 gap-1 p-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="group relative overflow-hidden rounded-lg border border-white/10 bg-neutral-900/60 transform-gpu smooth-transition hover:scale-110 hover:rotate-12"
                  >
                    <div className="absolute -inset-10 rotate-45 bg-gradient-to-tr from-fuchsia-500/10 via-cyan-400/10 to-emerald-400/10 smooth-transition group-hover:scale-110" />
                    <div className="relative z-10 flex h-full items-center justify-center text-xs text-neutral-300 smooth-transition group-hover:text-white">
                      ✦
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
            </div>
          </MagneticCard>
        </div>
      </section>

      {/* Enhanced Sections */}
      <Section id="about" title="About Me" subtitle="A story-first snapshot of who I am.">
        <p className="text-neutral-300">
          Replace this with your story: motivations, values, strengths, and the way you approach hard problems.
        </p>
      </Section>

      <Section id="education" title="Education">
        <div className="grid gap-4 sm:grid-cols-2">
          <MagneticCard intensity={0.05}>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 transform-gpu smooth-transition hover:scale-105 hover:border-fuchsia-500/30 hover:shadow-lg hover:shadow-fuchsia-500/20">
              <div className="text-sm text-neutral-400">Year – Year</div>
              <div className="mt-1 font-medium">Your University</div>
              <div className="text-sm text-neutral-300">Degree • Focus</div>
            </div>
          </MagneticCard>
          <MagneticCard intensity={0.05}>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 transform-gpu smooth-transition hover:scale-105 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="text-sm text-neutral-400">Year – Year</div>
              <div className="mt-1 font-medium">Relevant Program</div>
              <div className="text-sm text-neutral-300">Coursework • Honors</div>
            </div>
          </MagneticCard>
        </div>
      </Section>

      <Section id="skills" title="Languages & Skills" subtitle="Interactive visuals to showcase your toolkit.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4">
            <div className="mb-3 text-sm text-neutral-300">Skill Radar</div>
            <div className="flex justify-center">
              <SkillRadarChart skills={skills} />
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4">
            <div className="mb-3 text-sm text-neutral-300">Animated Bars</div>
            <div className="space-y-3">
              {skills.slice(0, 4).map((skill, i) => (
                <div key={skill.name} style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="mb-1 flex justify-between text-xs text-neutral-300">
                    <span>{skill.name}</span><span>{skill.level}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded bg-white/10">
                    <div
                      className={`h-full w-0 animate-grow bg-gradient-to-r ${skill.color} gpu-accelerated`}
                      style={{ animationDelay: `${200 + i * 100}ms`, '--tw-grow-width': `${skill.level}%` } as React.CSSProperties}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section id="projects" title="Projects I Built" subtitle="Visual, categorized work.">
        <div className="mb-4 flex flex-wrap gap-2 text-xs text-neutral-300">
          {["Full-stack", "APIs", "Security", "Flutter", "Automation"].map((c) => (
            <span key={c} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 smooth-transition hover:border-fuchsia-500/30 hover:bg-fuchsia-500/10 hover-lift">
              {c}
            </span>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} />
          ))}
        </div>
      </Section>

      <Section id="blog" title="DevBlog / Developer Journal" subtitle="Tags, categories, search, and code highlighting.">
        <BlogSection />
      </Section>

      <Section id="contact" title="Social & Contact">
        <div className="flex flex-wrap items-center gap-3">
          {["GitHub", "LinkedIn", "X", "Email"].map((s) => (
            <MagneticButton key={s}>{s}</MagneticButton>
          ))}
        </div>
      </Section>

      <footer className="mx-auto max-w-6xl px-4 pb-10 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} Your Name — Crafted with care.
      </footer>
    </div>
  );
}
