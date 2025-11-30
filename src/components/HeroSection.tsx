import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeroSectionProps {
  onNavigate?: (page: 'home' | 'products' | 'about' | 'contact') => void;
}

type SlideKey = 'purpose' | 'products' | 'people';

export default function HeroSection({ onNavigate }: HeroSectionProps = {}) {
  const [activeSlide, setActiveSlide] = useState<SlideKey>('purpose');
  const [_previousSlide, setPreviousSlide] = useState<SlideKey | null>(null);

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
  }> = {
    purpose: {
      label: 'GUIDED BY OUR',
      title: 'Purpose',
      description: 'As a global import-export merchant we help connect businesses worldwide, working to create fair and sustainable value through quality products and reliable partnerships for the benefit of current and future generations.',
      buttonText: 'DISCOVER WHO WE ARE',
      onButtonClick: () => onNavigate?.('about'),
      backgroundImage: '/hero/purpose.jpg'
    },
    products: {
      label: 'PASSIONATE ABOUT OUR',
      title: 'Products',
      description: 'We offer a curated selection of premium products carefully sourced from sustainable suppliers around the world. Each item represents our commitment to quality, ethics, and environmental responsibility.',
      buttonText: 'EXPLORE ALL PRODUCTS',
      onButtonClick: () => onNavigate?.('products'),
      backgroundImage: '/hero/product.png'
    },
    people: {
      label: 'INSPIRED BY OUR',
      title: 'People',
      description: 'Our diverse team of professionals brings expertise from across the globe. We are united by a shared vision of creating sustainable value and meaningful partnerships with our clients and suppliers.',
      buttonText: 'MEET OUR TEAM',
      onButtonClick: () => onNavigate?.('about'),
      backgroundImage: '/hero/people.webp'
    }
  };

  const slideOrder: SlideKey[] = ['purpose', 'products', 'people'];

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
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [activeSlide]);

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden"
    >
      {/* Background images with smooth crossfade */}
      {slideOrder.map((slideKey) => {
        const slide = slides[slideKey];
        return (
          <div
            key={slideKey}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url('${slide.backgroundImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: slideKey === activeSlide ? 1 : 0,
              zIndex: slideKey === activeSlide ? 1 : 0,
            }}
          />
        );
      })}
      <div className="absolute inset-0 bg-black/20 z-10"></div>

      <div className="relative h-screen flex items-center z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="relative">
            {slideOrder.map((slideKey) => {
              const slide = slides[slideKey];
              const isActive = slideKey === activeSlide;
              const currentIndex = slideOrder.indexOf(activeSlide);
              const slideIndex = slideOrder.indexOf(slideKey);
              
              return (
                <div
                  key={slideKey}
                  className={`text-white space-y-6 transition-all duration-1000 ease-in-out ${
                    isActive ? 'relative' : 'absolute inset-0 pointer-events-none'
                  }`}
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive 
                      ? 'translateX(0) translateY(0)' 
                      : slideIndex < currentIndex 
                        ? 'translateX(-30px) translateY(10px)' 
                        : 'translateX(30px) translateY(10px)',
                  }}
                >
                  <p className="text-sm md:text-base font-medium tracking-wider uppercase">
                    {slide.label}
                  </p>
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold leading-none">
                    {slide.title}
                  </h1>
                  <p className="text-base md:text-lg leading-relaxed max-w-2xl">
                    {slide.description}
                  </p>
                  <button
                    onClick={slide.onButtonClick}
                    className="inline-flex items-center gap-3 mt-8 text-sm md:text-base font-semibold uppercase tracking-wider hover:gap-5 transition-all duration-300 group"
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
          className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/20 hover:border-white/50 transition-all duration-300 group"
          aria-label="Previous slide"
        >
          <ChevronLeft size={28} className="text-white group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/20 hover:border-white/50 transition-all duration-300 group"
          aria-label="Next slide"
        >
          <ChevronRight size={28} className="text-white group-hover:scale-110 transition-transform" />
        </button>

        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
          {slideOrder.map((slideKey) => (
            <button
              key={slideKey}
              onClick={() => {
                setPreviousSlide(activeSlide);
                setActiveSlide(slideKey);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                slideKey === activeSlide
                  ? 'bg-white w-8'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to ${slideKey} slide`}
            />
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <button
            onClick={handleScrollDown}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all duration-300 animate-bounce"
            aria-label="Scroll down"
          >
            <ChevronDown size={24} className="text-white" />
          </button>
        </div>

        <div className="absolute bottom-6 left-6 md:left-12 z-30">
          <p className="text-white/60 text-xs md:text-sm">
            premium-exports.com
          </p>
        </div>
      </div>
    </section>
  );
}
