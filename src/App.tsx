/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { 
  Droplets, 
  Waves, 
  Sun, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ArrowRight,
  Menu,
  X,
  Award,
  Zap,
  Target,
  Heart,
  Search,
  RotateCw
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { pb, getPbImageUrl } from './lib/pb';
import { usePbCollection } from './lib/usePb';

// --- Constants ---

const NAV_ITEMS = [
  { name: 'Home', id: 'home' },
  { name: 'About', id: 'about' },
  { name: 'Director', id: 'director' },
  { name: 'Services', id: 'services' },
  { name: 'Gallery', id: 'gallery' },
  { name: 'Why Us', id: 'why-us' },
  { name: 'Clients', id: 'clients' },
  { name: 'Values', id: 'values' },
  { name: 'Contact', id: 'contact' },
];

// --- Components ---

const ScrollProgressBar = () => {
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollWidth(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[60] pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-brand-aqua to-brand-gold transition-all duration-100 ease-linear"
        style={{ width: `${scrollWidth}%` }}
      />
    </div>
  );
};

const SideRail = ({ activeId }: { activeId: string }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-6">
      {/* Rail line */}
      <div className="absolute top-0 bottom-0 w-[2px] bg-white/20 -z-10" />
      
      {/* Dots */}
      {NAV_ITEMS.map((item) => {
        const isActive = activeId === item.id;
        return (
          <div 
            key={item.id}
            className="relative group cursor-pointer"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => {
              const el = document.getElementById(item.id);
              if (el) {
                const offset = 80;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = el.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;
                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth"
                });
              }
            }}
          >
            {/* Tooltip */}
            <AnimatePresence>
              {hoveredId === item.id && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-brand-blue/90 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap pointer-events-none"
                >
                  {item.name}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dot */}
            <div 
              className={`transition-all duration-500 rounded-full flex items-center justify-center ${
                isActive 
                  ? 'w-3 h-3 bg-brand-aqua shadow-[0_0_15px_rgba(0,194,199,0.8)] rail-dot-pulse' 
                  : 'w-1.5 h-1.5 bg-white/40 group-hover:bg-white'
              }`}
            />
          </div>
        );
      })}
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('home');
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );

    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // Sync indicator position
  useEffect(() => {
    const activeLink = document.querySelector(`nav [data-id="${activeId}"]`);
    if (activeLink) {
      const { offsetLeft, offsetWidth } = activeLink as HTMLElement;
      setIndicatorStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
        transform: 'scaleX(1)'
      });
    } else {
      setIndicatorStyle({ transform: 'scaleX(0)' });
    }
  }, [activeId]);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <ScrollProgressBar />
      <SideRail activeId={activeId} />
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'nav-frosted py-3' : 'bg-transparent py-4 lg:py-5'}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 flex justify-between items-center">
          <a 
            href="#home" 
            onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
            className="flex items-center gap-2 sm:gap-3 group"
          >
            <AnimatePresence>
              {isScrolled && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-brand-aqua shrink-0"
                >
                  <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex flex-col leading-none">
              <span className={`font-display font-black tracking-tight text-white uppercase transition-all duration-300 ${isScrolled ? 'text-base sm:text-lg' : 'text-lg sm:text-[2rem]'}`}>
                SPRINGFINE
              </span>
              <span className={`font-display font-black tracking-tight text-white uppercase transition-all duration-300 ${isScrolled ? 'text-base sm:text-lg' : 'text-lg sm:text-[2rem]'} ${isScrolled ? 'hidden md:block' : 'hidden sm:block'}`}>
                HYDROSOLUTIONS
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-7 relative">
            {NAV_ITEMS.map((item) => (
              <button 
                key={item.id}
                data-id={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-[12px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 relative py-2 ${
                  activeId === item.id ? 'text-white' : 'text-white/65 hover:text-white'
                } hover:[text-shadow:0_0_10px_rgba(0,194,199,0.4)]`}
              >
                {item.name}
              </button>
            ))}
            
            {/* Sliding Indicator */}
            <div className="nav-link-underline" style={indicatorStyle} />
            
            <button 
              onClick={() => scrollToSection('contact')}
              className="ml-3 xl:ml-4 px-5 xl:px-6 py-2.5 bg-brand-aqua text-white text-[11px] font-black uppercase tracking-[0.16em] hover:bg-white hover:text-brand-blue transition-all duration-300"
            >
              Get Quote
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden text-white w-10 h-10 flex items-center justify-center relative z-[60]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[9px]' : ''}`} />
              <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 w-full min-h-screen bg-brand-blue/95 backdrop-blur-xl pt-28 pb-10 px-6 sm:px-10 flex flex-col items-center space-y-6 lg:hidden"
            >
              {NAV_ITEMS.map((item, idx) => (
                <button 
                  key={item.id} 
                  onClick={() => scrollToSection(item.id)}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  className={`text-base sm:text-lg font-bold uppercase tracking-[0.12em] sm:tracking-[0.2em] w-full text-center py-4 stagger-fade-in ${
                    activeId === item.id ? 'text-brand-aqua border-l-4 border-brand-aqua' : 'text-white/70'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <button 
                onClick={() => scrollToSection('contact')}
                className="w-full py-5 bg-brand-aqua text-white text-xs font-black uppercase tracking-[0.18em] sm:tracking-[0.3em] mt-10"
              >
                Get a Free Quote
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

const Hero = () => {
  const { data } = usePbCollection<any>('hero');
  const content = data[0] || {
    headline: 'SAVING WATER, SAVING EARTH.',
    subheadline: 'Innovative borehole drilling and water systems enhancing access to safe water in Kitale and beyond.',
    tagline: 'Save Water, Save Earth',
    cta_label: 'Get a Free Quote',
    badge1: 'EST. 2018',
    badge2: '500+ PROJECTS',
    background: '',
    rig_image: ''
  };

  const bgUrl = content.background ? getPbImageUrl(content, content.background) : "/well.png";
  const rigUrl = content.rig_image ? getPbImageUrl(content, content.rig_image, '800x0') : "/bore.jpeg";

  return (
    <section id="home" className="relative min-h-[100svh] md:min-h-[700px] w-full overflow-hidden flex items-center bg-brand-blue border-4 md:border-8 border-brand-blue pt-28 sm:pt-32 lg:pt-36 pb-10 sm:pb-14">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/95 via-brand-blue/85 to-brand-aqua/25 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-blue/40 z-10" />
        <img 
          src={bgUrl} 
          alt="Springfine Hydrosolutions Drilling" 
          className="w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-7">
            <span className="h-px w-12 bg-brand-gold"></span>
            <span className="text-brand-aqua text-[10px] font-black uppercase tracking-[0.12em] sm:tracking-[0.2em] md:tracking-[0.4em]">{content.tagline}</span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-display text-white mb-7 leading-[0.95] lg:leading-[0.9] font-black">
            {content.headline.includes(',') ? content.headline.split(',')[0] + ',' : content.headline}<br />
            <span className="text-brand-gold">{content.headline.includes(',') ? content.headline.split(',')[1] : ''}</span>
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-md mb-9 sm:mb-10 leading-relaxed font-medium">
            {content.subheadline}
          </p>
          <div className="flex flex-wrap gap-4">
             <div className="px-6 py-3 bg-white/5 backdrop-blur-md border border-brand-aqua/30 text-[11px] font-black tracking-[0.2em] uppercase text-brand-aqua flex items-center gap-2 shadow-[0_0_20px_rgba(0,194,199,0.1)]">
                <div className="w-1.5 h-1.5 bg-brand-aqua rounded-full animate-pulse" />
                {content.badge1}
             </div>
             <div className="px-6 py-3 bg-white/5 backdrop-blur-md border border-brand-gold/30 text-[11px] font-black tracking-[0.2em] uppercase text-brand-gold flex items-center gap-2 shadow-[0_0_20px_rgba(230,168,23,0.1)]">
                <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse" />
                {content.badge2}
             </div>
          </div>
          <div className="mt-10 sm:mt-12">
            <a href="#contact" className="btn-primary inline-block px-12 py-4">
              {content.cta_label}
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1 }}
          className="hidden lg:block relative"
        >
           <div className="relative aspect-square border-4 border-white/10 p-4">
              <div className="absolute inset-0 border-4 border-brand-aqua translate-x-4 -translate-y-4 -z-10" />
              <img src={rigUrl} className="w-full h-full object-cover transition-all duration-700" alt="rig" />
              <div className="absolute -bottom-8 -left-8 bg-brand-gold p-10 border-l-8 border-brand-blue">
                 <Droplets className="w-12 h-12 text-brand-blue" />
              </div>
           </div>
        </motion.div>
      </div>
    </section>
  );
};

const WaveDivider = ({ flip = false, bgClass = "bg-brand-blue" }: { flip?: boolean, bgClass?: string }) => (
  <div className={`w-full overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''} ${bgClass}`}>
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block h-12 w-full lg:h-20">
      <path 
        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
        className="fill-brand-aqua opacity-10 animate-wave-slow"
      ></path>
      <path 
        d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
        className="fill-brand-aqua opacity-20 animate-wave"
      ></path>
    </svg>
  </div>
);

const StatItem = ({ target, suffix, label }: { target: number, suffix: string, label: string, key?: any }) => {
  const [count, setCount] = useState(0);
  
  return (
    <motion.div 
      onViewportEnter={() => {
        let start = 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);
      }}
      viewport={{ once: true }}
      className="text-center p-8 border-r border-white/5 last:border-r-0"
    >
      <div className="text-5xl md:text-6xl font-display font-black text-brand-gold mb-3">
        {count}{suffix}
      </div>
      <div className="text-[10px] uppercase font-black tracking-[0.4em] text-white/50">
        {label}
      </div>
    </motion.div>
  );
};

const StatsSection = () => {
  const { data } = usePbCollection<any>('stats', { sort: 'order' });

  const stats = data.length > 0 ? data : [
    { value: 500, suffix: "+", label: "Boreholes Drilled" },
    { value: 15, suffix: "+", label: "Years Experience" },
    { value: 8, suffix: "", label: "Counties Served" },
    { value: 98, suffix: "%", label: "Client Satisfaction" },
  ];

  return (
    <div className="bg-brand-blue overflow-hidden">
      <WaveDivider />
      <section className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 py-10 lg:py-20">
        {stats.map((stat, idx) => (
          <StatItem 
            key={idx} 
            target={stat.value} 
            suffix={stat.suffix} 
            label={stat.label} 
          />
        ))}
      </section>
      <WaveDivider flip />
    </div>
  );
};

const About = () => {
  return (
    <section id="about" className="section-padding bg-brand-blue text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative order-2 lg:order-1"
        >
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
              <div className="bg-brand-aqua p-10 flex flex-col justify-center border-l-8 border-brand-gold">
                <h3 className="text-brand-blue text-xs font-black uppercase tracking-[0.3em] mb-4">Our Mission</h3>
                <p className="text-brand-blue text-sm leading-relaxed font-bold italic">
                  Deliver reliable and affordable borehole drilling services that enhance communities' access to safe and sustainable water.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                 <div className="bg-white/5 border border-white/10 p-6 flex flex-col justify-center items-center text-center">
                    <span className="text-brand-gold text-3xl font-black mb-2">24/7</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Support</span>
                 </div>
                 <div className="bg-white/5 border border-white/10 p-6 flex flex-col justify-center items-center text-center">
                    <span className="text-brand-aqua text-3xl font-black mb-2">100%</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Safety</span>
                 </div>
              </div>
           </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8 order-1 lg:order-2"
        >
          <div className="flex items-center gap-4">
            <span className="text-xs font-black uppercase tracking-[0.4em] text-brand-aqua">Who We Are</span>
            <span className="h-px flex-grow bg-white/20"></span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-display font-black leading-tight">
            EMPOWERING<br />
            <span className="text-brand-aqua">COMMUNITIES.</span>
          </h2>
          <p className="text-white/60 leading-relaxed text-lg font-medium">
            Springfine Hydrosolutions is Kitale's most trusted partner in innovative water solutions. We specialized in precision borehole drilling and sustainable irrigation infrastructures.
          </p>
          <div className="pt-6">
             <button className="btn-primary px-12">Learn More</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Director = () => {
  const { data } = usePbCollection<any>('director');
  
  const content = data[0] || {
    name: 'John Atura',
    title: 'Founder & Managing Director',
    bio: 'Dedicated to providing sustainable water solutions to communities across Kenya. With a passion for engineering and environmental stewardship, he leads Springfine Hydrosolutions with a commitment to excellence and integrity.',
    quote: 'Water is not just a resource; it is the foundation of life and community development.',
    credentials: 'NEMA Certified,WRMA Licensed,15+ Years Experience',
    photo: ''
  };

  // Build photo URL directly — check record has collectionId (full PB record)
  const photoUrl = (content.photo && content.collectionId && content.id)
    ? getPbImageUrl(content, content.photo, '800x0')
    : '/bore.jpeg';
  const credentialsList = content.credentials ? content.credentials.split(',') : [];

  return (
    <section id="director" className="section-padding bg-brand-blue relative overflow-hidden">
      {/* Background geometric slice */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-aqua/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        
        {/* Photo Column */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative aspect-[3/4] w-full max-w-md mx-auto group">
            {/* HUD corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-aqua z-10" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand-aqua z-10" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand-aqua z-10" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-aqua z-10" />
            
            {/* Image */}
            <div className="w-full h-full border border-white/10 overflow-hidden bg-brand-blue/50 backdrop-blur-sm p-3">
              <img src={photoUrl} alt={content.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
              
              {/* Scan line */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-aqua/20 to-transparent h-[10%] w-full animate-scan pointer-events-none" />
            </div>

            {/* Gold Accent */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-gold -z-10" />
          </div>
        </motion.div>

        {/* Text Column */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-7 space-y-10"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-brand-gold text-2xl">◈</span>
              <span className="text-brand-aqua font-mono uppercase tracking-[0.4em] text-sm">Director</span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-display italic font-black text-white leading-none break-words">
              {content.name.split(' ').map((part: string, i: number) => (
                <span key={i} className="block">{part.toUpperCase()}</span>
              ))}
            </h2>
            <div className="h-px w-24 bg-brand-aqua/50" />
            <p className="text-brand-aqua font-mono uppercase tracking-[0.3em] text-xs pt-2">
              ──── {content.title} ────
            </p>
          </div>

          <div className="border-l-4 border-brand-gold pl-6 py-2">
            <p className="text-2xl md:text-3xl font-display italic text-white/80 leading-snug">
              "{content.quote}"
            </p>
          </div>

          <p className="text-white/60 leading-relaxed font-medium">
            {content.bio}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            {credentialsList.map((cred: string, i: number) => (
              <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <div className="w-2 h-2 rounded-full bg-brand-aqua" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/80">{cred.trim()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Services = () => {
  const { data } = usePbCollection<any>('services', { sort: 'order' });

  const iconMap: any = {
    Search: <Search className="w-10 h-10" />,
    Droplets: <Droplets className="w-10 h-10" />,
    Zap: <Zap className="w-10 h-10" />,
    ShieldCheck: <ShieldCheck className="w-10 h-10" />,
    RotateCw: <RotateCw className="w-10 h-10" />,
    Waves: <Waves className="w-10 h-10" />
  };

  const services = data.length > 0 ? data.map(s => ({
    ...s,
    icon: iconMap[s.icon_name] || <Droplets className="w-10 h-10" />
  })) : [
    { 
      title: "Groundwater Exploration", 
      desc: "Hydrogeological surveys to identify the best drilling sites", 
      icon: <Search className="w-10 h-10" />,
      label: "Specialized" 
    },
    { 
      title: "Borehole Drilling", 
      desc: "Professional drilling up to deep aquifer levels using modern rigs", 
      icon: <Droplets className="w-10 h-10" />,
      label: "Primary" 
    },
    { 
      title: "Pump Installation", 
      desc: "Solar and electric pump systems for reliable water supply", 
      icon: <Zap className="w-10 h-10" />,
      label: "Secondary" 
    },
    { 
      title: "Water Quality Testing", 
      desc: "Laboratory analysis to ensure safe, clean water", 
      icon: <ShieldCheck className="w-10 h-10" />,
      label: "Standard" 
    },
    { 
      title: "Borehole Rehabilitation", 
      desc: "Restoration of old or underperforming boreholes", 
      icon: <RotateCw className="w-10 h-10" />,
      label: "Maintenance" 
    },
    { 
      title: "Piping & Distribution", 
      desc: "End-to-end water reticulation system installation", 
      icon: <Waves className="w-10 h-10" />,
      label: "Standard" 
    }
  ];

  return (
    <section id="services" className="section-padding bg-brand-blue border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-10 mb-16">
          <div className="h-px bg-white/20 flex-grow" />
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-brand-aqua">Our Expert Services</h2>
          <div className="h-px bg-white/20 flex-grow" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                boxShadow: "0 0 40px rgba(0, 194, 199, 0.2)",
                borderColor: "rgba(0, 194, 199, 0.4)",
                y: -5
              }}
              className="group bg-white/5 p-10 border border-white/10 transition-all flex flex-col justify-between"
            >
              <div className="w-14 h-14 bg-brand-aqua/10 text-brand-aqua flex items-center justify-center mb-10 group-hover:bg-brand-aqua group-hover:text-white transition-all duration-500">
                {service.icon}
              </div>
              <div className="space-y-4">
                <span className="text-brand-aqua text-[10px] font-black uppercase tracking-widest">{service.badge || service.label}</span>
                <h3 className="text-2xl font-display font-bold text-white group-hover:text-brand-gold transition-colors">{service.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{service.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const GALLERY_IMAGES = [
  { url: "/well.png", title: "Heavy Duty Drilling", desc: "Precision rig setup in challenging terrain." },
  { url: "/bore.jpeg", title: "High Pressure Strike", desc: "Successful aquifer penetration at 150m." },
  { url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2000", title: "Solar Pump System", desc: "Sustainable water distribution solution." },
  { url: "https://images.unsplash.com/photo-1581094288338-2314dddb7ec3?auto=format&fit=crop&q=80&w=2000", title: "Site Surveying", desc: "Hydrogeological mapping and analysis." },
  { url: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=2000", title: "Industrial Infrastructure", desc: "Large scale water distribution network." }
];

const Gallery = () => {
  const { data } = usePbCollection<any>('gallery', { sort: 'order' });
  const [index, setIndex] = useState(0);

  const images = data.length > 0 ? data.map(img => ({
    url: getPbImageUrl(img, img.image, '1200x0'),
    title: img.title,
    desc: img.desc
  })) : GALLERY_IMAGES;

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section id="gallery" className="section-padding bg-brand-blue overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-xs font-black uppercase tracking-[0.4em] text-brand-aqua mb-4">Visual Records</span>
          <h2 className="text-4xl md:text-5xl font-display font-black text-white uppercase italic tracking-tighter">THE FIELD ARCHIVE.</h2>
        </div>

        <div className="relative h-[400px] md:h-[600px] flex items-center justify-center perspective-1500">
          <AnimatePresence initial={false}>
            {images.map((img, i) => {
              const offset = (i - index + images.length) % images.length;
              const isCenter = offset === 0;
              
              // Simple circular indexing for variable items
              let position = offset;
              if (position > images.length / 2) position -= images.length;

              const isVisible = Math.abs(position) <= 2;
              if (!isVisible) return null;

              let x = 0;
              let rotateY = 0;
              let z = 0;
              let opacity = 0;
              let scale = 0.8;

              if (position === 0) { // Center
                x = 0;
                z = 200;
                opacity = 1;
                scale = 1;
              } else if (position === 1) { // Right 1
                x = "45%";
                rotateY = -45;
                z = 0;
                opacity = 0.6;
              } else if (position === 2) { // Right 2
                x = "80%";
                rotateY = -60;
                z = -200;
                opacity = 0.2;
              } else if (position === -1) { // Left 1
                x = "-45%";
                rotateY = 45;
                z = 0;
                opacity = 0.6;
              } else if (position === -2) { // Left 2
                x = "-80%";
                rotateY = 60;
                z = -200;
                opacity = 0.2;
              }

              return (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{ 
                    x, 
                    rotateY, 
                    z, 
                    opacity, 
                    scale,
                    filter: position === 0 ? "grayscale(0%)" : "grayscale(100%) brightness(50%)",
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  className="absolute w-[300px] md:w-[600px] aspect-video cursor-pointer"
                  onClick={() => setIndex(i)}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="relative w-full h-full border border-white/10 p-2 bg-brand-blue/50 backdrop-blur-sm overflow-hidden group">
                    {/* HUD Corners */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-aqua opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand-aqua opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand-aqua opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-aqua opacity-50 group-hover:opacity-100 transition-opacity" />
                    
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                    
                    {/* Caption Overlay */}
                    {position === 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-6 left-6 right-6 bg-brand-blue/80 backdrop-blur-xl p-6 border-l-4 border-brand-gold shadow-2xl"
                      >
                        <h3 className="text-brand-aqua text-xs font-black uppercase tracking-[0.3em] mb-2">{img.title}</h3>
                        <p className="text-white/60 text-[10px] uppercase font-bold leading-relaxed tracking-wider">{img.desc}</p>
                      </motion.div>
                    )}

                    {/* Scan line effect */}
                    {position === 0 && (
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-aqua/10 to-transparent h-[10%] w-full animate-scan pointer-events-none" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-12 mt-12">
          <button onClick={prev} className="text-white/50 hover:text-brand-aqua transition-all p-4 group">
             <ArrowRight className="w-8 h-8 rotate-180 group-hover:-translate-x-2 transition-transform" />
          </button>
          <div className="flex gap-4">
             {images.map((_, i) => (
               <button 
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1 transition-all duration-500 rounded-full ${index === i ? 'w-12 bg-brand-aqua' : 'w-4 bg-white/10'}`}
               />
             ))}
          </div>
          <button onClick={next} className="text-white/50 hover:text-brand-aqua transition-all p-4 group">
             <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

const WhyChooseUs = () => {
  return (
    <section id="why-us" className="bg-white py-0 border-y-8 border-brand-blue">
       <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
          <div className="lg:w-1/2 p-10 md:p-14 lg:p-32 space-y-10 lg:space-y-12 text-brand-blue">
            <h2 className="text-5xl font-display font-black leading-tight">
              Trusted by<br />Industry Leaders
            </h2>
            <div className="grid grid-cols-2 gap-6 md:gap-10 opacity-30 grayscale saturate-0">
               <div className="font-black italic text-lg uppercase tracking-tighter">RESIDENTIAL</div>
               <div className="font-black italic text-lg uppercase tracking-tighter">SCHOOLS</div>
               <div className="font-black italic text-lg uppercase tracking-tighter">NGOS</div>
               <div className="font-black italic text-lg uppercase tracking-tighter">AGRICULTURAL</div>
            </div>
          </div>
          <div className="lg:w-1/2 bg-brand-aqua p-10 md:p-14 lg:p-32 lg:border-l-8 border-brand-blue flex flex-col justify-center">
             <div className="space-y-8 text-brand-blue">
                <div className="flex items-center gap-6">
                   <ShieldCheck className="w-10 h-10" />
                   <div className="space-y-1">
                      <p className="text-xl font-black uppercase tracking-tight">Guaranteed Quality</p>
                      <p className="text-xs font-bold opacity-60">High standards in every project</p>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <Target className="w-10 h-10" />
                   <div className="space-y-1">
                      <p className="text-xl font-black uppercase tracking-tight">Precision Surveys</p>
                      <p className="text-xs font-bold opacity-60">Advanced mapping technologies</p>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <Award className="w-10 h-10" />
                   <div className="space-y-1">
                      <p className="text-xl font-black uppercase tracking-tight">Certified Excellence</p>
                      <p className="text-xs font-bold opacity-60">NEMA and WRMA compliance</p>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </section>
  );
};

const CLIENT_NAMES = [
  { name: "Kitale Water Authority", variant: "engraved" },
  { name: "TransNzoia County", variant: "bold" },
  { name: "AgroServe Kenya Ltd", variant: "code" },
  { name: "Western Seeds Co.", variant: "engraved" },
  { name: "Hope Springs NGO", variant: "bold" },
  { name: "Rift Valley Farms", variant: "code" },
  { name: "Meru Highlands Resort", variant: "engraved" }
];

const ClientToken = ({ client }: { client: { name: string, variant: string } }) => {
  const styles = {
    engraved: "font-display italic text-3xl md:text-5xl text-white/90",
    code: "font-mono uppercase tracking-[0.4em] text-xl md:text-3xl text-brand-aqua/80",
    bold: "font-sans font-black uppercase tracking-tighter text-3xl md:text-5xl text-white/60"
  };

  return (
    <span className={`inline-block px-12 transition-all duration-500 hover:scale-110 hover:text-brand-aqua cursor-pointer hover:[text-shadow:0_0_30px_rgba(0,194,199,0.5)] ${styles[client.variant as keyof typeof styles]}`}>
      {client.name}
    </span>
  );
};

const Clients = () => {
  const { data } = usePbCollection<any>('clients', { sort: 'order' });
  const clientsList = data.length > 0 ? data : CLIENT_NAMES;
  const doubleClients = [...clientsList, ...clientsList];

  return (
    <section id="clients" className="py-24 bg-brand-blue border-y border-brand-aqua/15 overflow-hidden">
      <div className="flex flex-col items-center text-center mb-16 px-6">
        <span className="text-xs font-black uppercase tracking-[0.4em] text-brand-aqua mb-4">Our Track Record</span>
        <h2 className="text-4xl md:text-5xl font-display font-black text-white italic tracking-tighter uppercase">THE ROSTER.</h2>
      </div>

      <div className="space-y-12">
        {/* Row 1: Right to Left */}
        <div className="flex group whitespace-nowrap overflow-hidden">
          <div className="flex animate-marquee-left group-hover:paused py-4">
            {doubleClients.map((client, i) => (
              <div key={i} className="flex items-center">
                <ClientToken client={client} />
                <span className="text-brand-gold text-2xl mx-4">◈</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Left to Right */}
        <div className="flex group whitespace-nowrap overflow-hidden">
          <div className="flex animate-marquee-right group-hover:paused py-4">
            {doubleClients.map((client, i) => (
              <div key={i} className="flex items-center">
                <ClientToken client={client} />
                <span className="text-brand-gold text-2xl mx-4">◈</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Values = () => {
  return (
    <section id="values" className="section-padding bg-brand-blue overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-aqua/5 -skew-x-12 translate-x-1/2" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-end mb-16 md:mb-20">
           <div className="flex-1 space-y-6">
             <span className="text-brand-gold text-xs font-black uppercase tracking-[0.4em]">Core Values</span>
             <h2 className="text-5xl font-display font-black text-white leading-none">THE SPRINGFINE<br /><span className="text-brand-aqua italic tracking-tighter">STANDARD.</span></h2>
           </div>
           <p className="flex-1 text-white/50 font-medium leading-relaxed max-w-md">Our principles drive every decision we make, ensuring that every borehole we drill serves generations to come.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: "Integrity", desc: "Honesty in every survey and transparency in every quote." },
             { title: "Precision", desc: "Using advanced tech for accurate site location." },
             { title: "Stewardship", desc: "Protecting our groundwater resources for the future." }
           ].map((val, i) => (
             <div key={i} className="p-10 border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all">
               <div className="w-12 h-1 top-0 left-0 bg-brand-gold mb-8" />
               <h3 className="text-2xl font-display font-bold text-white mb-4 uppercase">{val.title}</h3>
               <p className="text-white/40 text-sm leading-relaxed">{val.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="section-padding bg-[#F0F6FF] text-brand-blue overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="space-y-16">
          <div className="space-y-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-tight">
              GET YOUR<br />PROJECTS<br /><span className="text-brand-aqua italic tracking-tighter">STARTED.</span>
            </h2>
            <p className="text-brand-blue/60 text-base max-w-sm font-medium">Reach out to our Kitale office for a technical consultation and site assessment.</p>
          </div>

          <div className="space-y-8 pt-10 border-t border-brand-blue/10">
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-full bg-brand-blue/5 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold tracking-wide">P.O. Box 262-30200, Kitale, Kenya</span>
            </div>
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-full bg-brand-blue/5 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold tracking-wide">0706 594 256</span>
            </div>
            <div className="flex items-center gap-6 group">
              <div className="w-12 h-12 rounded-full bg-brand-blue/5 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold tracking-wide">kwangila57@gmail.com</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-2 relative shadow-2xl overflow-hidden group">
           <div className="absolute top-0 right-0 w-20 h-20 bg-brand-aqua/5 group-hover:scale-150 transition-transform duration-700 -z-0" />
           <div className="bg-gray-50/50 p-12 h-full flex flex-col justify-center relative z-10">
              <h3 className="text-2xl font-display font-black mb-8">Enquiry Form</h3>
              <form className="space-y-6">
                 <div>
                   <label className="text-[10px] font-black tracking-widest uppercase mb-1 block opacity-50">Full Name</label>
                   <input type="text" placeholder="Your Name" className="w-full bg-white border-b-2 border-brand-blue/10 py-4 text-sm font-bold focus:border-brand-aqua focus:outline-none transition-colors" />
                 </div>
                 <div>
                   <label className="text-[10px] font-black tracking-widest uppercase mb-1 block opacity-50">Phone Number</label>
                   <input type="tel" placeholder="07XX XXX XXX" className="w-full bg-white border-b-2 border-brand-blue/10 py-4 text-sm font-bold focus:border-brand-aqua focus:outline-none transition-colors" />
                 </div>
                 <div>
                   <label className="text-[10px] font-black tracking-widest uppercase mb-1 block opacity-50">Service Needed</label>
                   <select className="w-full bg-white border-b-2 border-brand-blue/10 py-4 text-sm font-bold focus:border-brand-aqua focus:outline-none transition-colors appearance-none cursor-pointer">
                      <option>Borehole Drilling</option>
                      <option>Pump Installation</option>
                      <option>Water Testing</option>
                      <option>Rehabilitation</option>
                      <option>Piping & Distribution</option>
                   </select>
                 </div>
                 <div>
                   <label className="text-[10px] font-black tracking-widest uppercase mb-1 block opacity-50">Your Message</label>
                   <textarea placeholder="Describe your project..." className="w-full bg-white border-b-2 border-brand-blue/10 py-4 text-sm font-bold focus:border-brand-aqua focus:outline-none transition-colors h-24 resize-none"></textarea>
                 </div>
                 <button className="w-full py-5 bg-brand-aqua text-white text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.3em] hover:bg-brand-blue transition-all duration-300 shadow-lg shadow-brand-aqua/20 mt-6">
                   Submit Request
                 </button>
              </form>
           </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#0A1F3D] pt-20 relative overflow-hidden">
      {/* Animated Ripple Effect */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <WaveDivider bgClass="bg-transparent" />
        <div className="absolute bottom-0 w-full rotate-180">
          <WaveDivider bgClass="bg-transparent" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 text-white/70">
          <div className="space-y-6">
             <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-aqua rounded-full flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-display font-black tracking-tighter text-white uppercase">
                SPRINGFINE
              </span>
            </div>
            <p className="text-sm font-bold tracking-[0.2em] text-brand-aqua uppercase">Save Water, Save Earth</p>
            <p className="text-sm leading-relaxed max-w-xs">
              Providing innovative and sustainable water solutions across Kitale and the Rift Valley.
            </p>
          </div>

          <div>
             <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white mb-8">Quick Links</h4>
             <ul className="space-y-4">
                {['About', 'Services', 'Why Us', 'Contact'].map(link => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-sm hover:text-brand-aqua transition-colors font-bold uppercase tracking-widest">{link}</a>
                  </li>
                ))}
             </ul>
          </div>

          <div>
             <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white mb-8">Services</h4>
             <ul className="space-y-4 text-sm font-bold uppercase tracking-widest">
                <li className="hover:text-brand-aqua transition-colors cursor-pointer">Groundwater Exploration</li>
                <li className="hover:text-brand-aqua transition-colors cursor-pointer">Borehole Drilling</li>
                <li className="hover:text-brand-aqua transition-colors cursor-pointer">Pump Installation</li>
                <li className="hover:text-brand-aqua transition-colors cursor-pointer">Water Testing</li>
             </ul>
          </div>

          <div>
             <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white mb-8">Get In Touch</h4>
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <Phone className="w-4 h-4 text-brand-gold" />
                   <span className="text-sm font-bold">0706 594 256</span>
                </div>
                <div className="flex items-center gap-3">
                   <Mail className="w-4 h-4 text-brand-gold" />
                   <span className="text-sm font-bold">kwangila57@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                   <MapPin className="w-4 h-4 text-brand-gold" />
                   <span className="text-sm font-bold">Kitale, Kenya</span>
                </div>
             </div>
          </div>
        </div>

        <div className="border-t border-white/5 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[10px] uppercase font-black tracking-[0.2em] md:tracking-[0.4em] text-white/30 text-center md:text-left">
             © 2025 Springfine Hydrosolutions. All Rights Reserved.
           </p>
           <div className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-8 text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-white/30">
              <span className="hover:text-brand-aqua cursor-pointer transition-colors">Integrity</span>
              <span className="hover:text-brand-aqua cursor-pointer transition-colors">Quality</span>
              <span className="hover:text-brand-aqua cursor-pointer transition-colors">Sustainability</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

const Loader = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<'loading' | 'filling' | 'complete'>('loading');

  useEffect(() => {
    // Phase 2: Water Fill Start (at ~3s mark when burst happens in CSS)
    const fillTimer = setTimeout(() => setPhase('filling'), 3000);
    
    // Phase 3: Final Fade/Exit (at ~4.5s mark)
    const completeTimer = setTimeout(() => {
      setPhase('complete');
      setTimeout(onComplete, 1000); // Give time for exit animation
    }, 4500);

    return () => {
      clearTimeout(fillTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div id="loader" className={`fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center ${phase === 'complete' ? 'loader-fade-out' : ''}`}>
      {/* Geological Background */}
      <div className="absolute inset-0 earth-strata" />
      
      {/* Earth Layer Labels */}
      <div className="absolute inset-x-0 inset-y-0 pointer-events-none opacity-20 flex flex-col text-white text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[1em] px-6 sm:px-10">
        <div className="h-1/4 flex items-center">Topsoil</div>
        <div className="h-1/4 flex items-center">Clay</div>
        <div className="h-1/4 flex items-center">Rock</div>
        <div className="h-1/4 flex items-center">Aquifer</div>
      </div>

      {/* The Drill Bit */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 drill-descend z-20">
        <div className="drill-vibration">
          <svg width="60" height="120" viewBox="0 0 60 120" fill="none">
             <path d="M30 120L10 80H50L30 120Z" fill="#333" />
             <rect x="25" y="0" width="10" height="80" fill="#444" />
             <circle cx="30" cy="110" r="10" stroke="#00C2C7" strokeWidth="1" className="animate-ping opacity-50" />
          </svg>
        </div>
      </div>

      {/* Water Burst Particles */}
      <div className="absolute left-1/2 top-[75vh] -translate-x-1/2 z-30 pointer-events-none">
        <div className="water-burst">
           <svg width="100" height="100" viewBox="0 0 100 100">
             <circle cx="50" cy="50" r="20" fill="#00C2C7" />
           </svg>
        </div>
      </div>

      {/* Water Fill Effect */}
      <div className="absolute inset-0 z-40 water-fill flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={phase === 'filling' ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Droplets className="w-12 h-12 text-brand-aqua" />
            <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tighter uppercase">SPRINGFINE</h1>
          </div>
          <p className="text-brand-aqua font-black uppercase tracking-[0.2em] sm:tracking-[0.5em] text-xs">Save Water, Save Earth</p>
        </motion.div>
      </div>
    </div>
  );
};

const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/254706594256"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[55] w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-[#25D366]/40 transition-shadow lg:bottom-12 lg:right-12 group"
      title="Chat with support"
    >
      <svg
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="currentColor"
        className="relative left-[1.5px] top-[0.5px]"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
      {/* Label Tooltip */}
      <span className="absolute right-20 bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-x-4 group-hover:translate-x-0 border border-white/10 shadow-xl">
        Chat with Support
      </span>
    </motion.a>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen">
      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}>
        <Navbar />
        <Hero />
        <StatsSection />
        <About />
        <Director />
        <Services />
        <Gallery />
        <WhyChooseUs />
        <Clients />
        <Values />
        <Contact />
        <Footer />
        <WhatsAppButton />
      </div>
    </div>
  );
}
