import { Globe, Users, TrendingUp, Award, CheckCircle2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const stats = [
  {
    icon: Globe,
    value: 8,
    suffix: '+',
    label: 'Countries',
    description: 'Trusted by partners across continents',
  },
  {
    icon: Users,
    value: 125,
    suffix: '+',
    label: 'Expert Professionals',
    description: 'Dedicated team ensuring quality',
  },
  {
    icon: TrendingUp,
    value: 20,
    suffix: '+',
    label: 'Annual Trade',
    description: 'Consistent growth and reliability',
  },
  {
    icon: Award,
    value: 3,
    suffix: '+',
    label: 'Years of Experience',
    description: 'Legacy of trust and integrity',
  },
];

const features = [
  'Premium Quality Assurance',
  'Global Logistics Network',
  'Sustainable Sourcing',
  '24/7 Customer Support',
];

// Animated counter component
function AnimatedCounter({ value, suffix, duration = 2000 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, value, duration]);

  return (
    <div ref={ref} className="text-3xl font-bold text-white mb-2">
      {count}{suffix}
    </div>
  );
}

export default function TrustSection() {
  return (
    <section className="py-24 overflow-hidden relative">

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-16 items-start">

          {/* Text Content */}
          <div className="flex-1">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-sm">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6 leading-tight text-white">
              Excellence in Every <span className="text-blue-400">Shipment</span>
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-xl">
              We connect the world through quality trade. With unmatched expertise and a commitment to sustainability, we ensure your business moves forward without barriers.
            </p>

            <ul className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="text-blue-400 flex-shrink-0" size={20} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats Grid */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="group bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/15"
                  >
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-blue-500/30">
                      <Icon className="text-blue-300" size={24} />
                    </div>
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    <h3 className="text-lg font-semibold text-blue-100 mb-2">{stat.label}</h3>
                    <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{stat.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
