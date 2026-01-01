import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeroSectionProps {
  onNavigate?: (page: 'home' | 'products' | 'about' | 'contact') => void;
}

type SlideKey = 'welcome' | 'why' | 'products' | 'global';

export default function HeroSection({ onNavigate }: HeroSectionProps = {}) {
  const [activeSlide, setActiveSlide] = useState<SlideKey>('welcome');
  const [_previousSlide, setPreviousSlide] = useState<SlideKey | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  const slides: Record<SlideKey, {
    label: string;
    title: string;
    description: string;
    buttonText: string;
    onButtonClick: () => void;
    backgroundImage: string;
    backgroundPosition: string;
    mobileBackgroundPosition?: string;
  }> = {
    welcome: {
      label: 'WELCOME TO',
      title: 'Amritva Overseas',
      description: 'Your trusted partner in global trade. We connect markets with quality imports and exports, ensuring reliability, integrity, and long-term partnerships.',
      buttonText: 'LEARN MORE',
      onButtonClick: () => onNavigate?.('about'),
      backgroundImage: '/hero/welcome.avif',
      backgroundPosition: 'center',
      mobileBackgroundPosition: 'center top'
    },
    why: {
      label: 'WHY CHOOSE US',
      title: 'Why Choose Us',
      description: 'We prioritize transparent communication, consistent quality, and on-time delivery so you can scale confidently with a partner who is invested in your success.',
      buttonText: 'OUR ADVANTAGE',
      onButtonClick: () => onNavigate?.('about'),
      backgroundImage: '/hero/why%20choose%20us.avif',
      backgroundPosition: 'center',
      mobileBackgroundPosition: 'center center'
    },
    products: {
      label: 'OUR PRODUCT RANGE',
      title: 'Our Products',
      description: 'Explore a curated portfolio sourced from vetted suppliers worldwide, selected for their quality, sustainability, and value.',
      buttonText: 'EXPLORE PRODUCTS',
      onButtonClick: () => onNavigate?.('products'),
      backgroundImage: '/hero/product.avif',
      backgroundPosition: 'right center',
      mobileBackgroundPosition: '70% center'
    },
    global: {
      label: 'GLOBAL CONNECTION',
      title: 'Global Connection',
      description: 'With a worldwide network and logistics expertise, we bridge continents to deliver dependable trade solutions wherever you operate.',
      buttonText: 'CONTACT US',
      onButtonClick: () => onNavigate?.('contact'),
      backgroundImage: '/hero/global%20connection.avif',
      backgroundPosition: 'center',
      mobileBackgroundPosition: 'center center'
    }
  };

  const slideOrder: SlideKey[] = ['welcome', 'why', 'products', 'global'];

  const nextSlide = () => {
    const currentIndex = slideOrder.indexOf(activeSlide);
    const nextIndex = (currentIndex + 1) % slideOrder.length;
    setPreviousSlide(activeSlide);
    setActiveSlide(slideOrder[nextIndex]);
  };

  const goToPrevSlide = () => {
    const currentIndex = slideOrder.indexOf(activeSlide);
    const prevIndex = (currentIndex - 1 + slideOrder.length) % slideOrder.length;
    setPreviousSlide(activeSlide);
    setActiveSlide(slideOrder[prevIndex]);
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [activeSlide, isPaused]);

  return (
    <section
      id="home"
      className="relative min-h-[70vh] md:min-h-screen overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onTouchCancel={() => setIsPaused(false)}
    >
      {/* Background images with smooth crossfade */}
      {slideOrder.map((slideKey) => {
        const slide = slides[slideKey];
        return (
          <div
            key={slideKey}
            className="absolute inset-0"
            style={{
              backgroundImage: `url('${slide.backgroundImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: isMobile && slide.mobileBackgroundPosition
                ? slide.mobileBackgroundPosition
                : slide.backgroundPosition,
              backgroundRepeat: 'no-repeat',
              opacity: slideKey === activeSlide ? 1 : 0,
              zIndex: slideKey === activeSlide ? 1 : 0,
              transition: 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'opacity',
            }}
          />
        );
      })}
      <div className="absolute inset-0 bg-black/20 z-10"></div>

      <div className="relative h-[70vh] md:h-screen flex items-center z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          {/* Fixed height container to maintain consistent text position */}
          <div className="relative h-[320px] md:h-[350px] lg:h-[400px]">
            {slideOrder.map((slideKey) => {
              const slide = slides[slideKey];
              const isActive = slideKey === activeSlide;

              return (
                <div
                  key={slideKey}
                  className={`text-white absolute top-0 left-0 right-0 ${isActive ? '' : 'pointer-events-none'}`}
                  style={{
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: 'opacity',
                  }}
                >
                  <p className="text-xs md:text-sm lg:text-base font-medium tracking-wider uppercase mb-3 md:mb-4">
                    {slide.label}
                  </p>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold leading-tight md:leading-none mb-4 md:mb-6">
                    {slide.title}
                  </h1>
                  <p className="text-sm md:text-base lg:text-lg leading-relaxed max-w-2xl h-[84px] md:h-[72px] lg:h-[80px]">
                    {slide.description}
                  </p>
                  <button
                    onClick={slide.onButtonClick}
                    className="inline-flex items-center gap-2 md:gap-3 mt-4 md:mt-6 text-xs md:text-sm lg:text-base font-semibold uppercase tracking-wider hover:gap-3 md:hover:gap-5 transition-all duration-300 group w-fit"
                  >
                    {slide.buttonText}
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={goToPrevSlide}
          className="absolute left-3 md:left-6 lg:left-12 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/20 hover:border-white/50 transition-all duration-300 group"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} className="md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 md:right-6 lg:right-12 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/20 hover:border-white/50 transition-all duration-300 group"
          aria-label="Next slide"
        >
          <ChevronRight size={20} className="md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" />
        </button>

        <div className="absolute bottom-16 md:bottom-20 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
          {slideOrder.map((slideKey) => (
            <button
              key={slideKey}
              onClick={() => {
                setPreviousSlide(activeSlide);
                setActiveSlide(slideKey);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${slideKey === activeSlide
                ? 'bg-white w-6 md:w-8'
                : 'bg-white/40 hover:bg-white/60 w-2'
                }`}
              aria-label={`Go to ${slideKey} slide`}
            />
          ))}
        </div>

        <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <button
            onClick={handleScrollDown}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-300 animate-bounce"
            aria-label="Scroll down"
          >
            <ChevronDown size={20} className="md:w-6 md:h-6 text-white" />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 md:left-6 lg:left-12 z-30">
          <p className="text-white/60 text-xs md:text-sm">
            Amritva Overseas
          </p>
        </div>
      </div>
    </section>
  );
}
