import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Star, Scissors, Flower } from 'lucide-react';
import HowItWorks from '../components/HowItWorks';
import SEO from '../components/SEO';

const flowerPetals = [
  { top: '15%', left: '20%', duration: 12 },
  { top: '70%', left: '15%', duration: 15 },
  { top: '35%', left: '85%', duration: 18 },
  { top: '80%', left: '75%', duration: 21 },
  { top: '25%', left: '55%', duration: 24 },
  { top: '60%', left: '40%', duration: 27 },
];

// High-quality embroidery placeholders
const sampleServices = [
  {
    title: 'Bridal Blouse Embroidery',
    image: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=600&q=80',
    desc: 'Intricate and regal zardosi, gold thread, and beadwork tailored for your auspicious wedding day.'
  },
  {
    title: 'Blouse Embroidery',
    image: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=600&q=80',
    desc: 'Stunning designer computer embroidery for regular and party-wear blouses.'
  },
  {
    title: 'Logo Embroidery',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    desc: 'Crisp, professional digital logo stitching for uniforms, corporate identities, and branding.'
  }
];

const galleryPeek = [
  'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=500&h=600&q=80',
  'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=500&h=400&q=80',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&h=500&q=80',
  'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=500&h=600&q=80',
  'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=500&h=400&q=80',
  'https://images.unsplash.com/photo-1572087552449-d82167336021?auto=format&fit=crop&w=500&h=500&q=80'
];

const testimonials = [
  {
    name: 'Priyanka Sharma',
    role: 'Chennai Bride',
    stars: 5,
    text: 'My bridal blouse was absolutely breathtaking! The precision of the zardosi digital embroidery is phenomenal. Everyone at my wedding asked where I got it stitched. Highly recommended!'
  },
  {
    name: 'Aishwarya Rajesh',
    role: 'Fashion Designer',
    stars: 5,
    text: 'As a designer, I need a reliable digital partner who understands exact spacing and neat finishes. Magic Embroidery delivers top-tier professional results every single time.'
  },
  {
    name: 'Meena Srinivasan',
    role: 'Local Resident',
    stars: 5,
    text: 'Stitched beautiful custom names on a set of handkerchiefs and got it delivered within 2 days! Excellent communication on WhatsApp and very affordable rates.'
  }
];

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-scroll testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full pt-16">
      <SEO 
        title="Selaiyur's Premier Digital Tailor Shop" 
        description="Welcome to Magic Embroidery — It's Digital in Selaiyur, Chennai. We provide precision computer embroidery for bridal blouses, saree work, name monograms, and custom logo stitching." 
      />
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center bg-[radial-gradient(#C0305A_0.8px,transparent_0.8px)] [background-size:24px_24px] overflow-hidden py-12 md:py-20">
        
        {/* Flower Petal CSS Floating elements in Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {flowerPetals.map((petal, i) => (
            <motion.div
              key={i}
              className="absolute text-brand-primary/10"
              style={{
                top: petal.top,
                left: petal.left,
              }}
              animate={{
                y: [0, 40, 0],
                x: [0, 20, 0],
                rotate: [0, 360, 0]
              }}
              transition={{
                duration: petal.duration,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Flower className="w-8 h-8 fill-brand-primary/5" />
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content Column */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col text-center lg:text-left gap-6"
            >
              <div className="inline-flex items-center gap-2 bg-brand-primary/15 text-brand-primary px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest self-center lg:self-start border border-brand-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                Selaiyur's Premier Tailor Shop
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-brand-secondary leading-[1.1] mb-2">
                We Stitch <br />
                <span className="text-brand-primary">Digital Perfection</span>
              </h1>
              <p className="font-body text-base sm:text-lg text-brand-textDark/80 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Custom designer bridal blouse zardosi, computer logo stitching, name embroidery, and saree patterns tailored with high-precision digital machines.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mt-4">
                <Link 
                  to="/order" 
                  className="w-full sm:w-auto text-center bg-brand-primary hover:bg-brand-primary/95 text-brand-white font-body font-bold px-8 py-4 rounded-full shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/35 transition-all hover:scale-105"
                >
                  Order on WhatsApp
                </Link>
                <Link 
                  to="/gallery" 
                  className="w-full sm:w-auto text-center border border-brand-primary hover:bg-brand-accent/20 text-brand-primary font-body font-bold px-8 py-4 rounded-full transition-all hover:scale-105"
                >
                  View Our Work
                </Link>
              </div>
            </motion.div>

            {/* Right Illustration Column */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center relative"
            >
              {/* Soft decorative background circles */}
              <div className="absolute inset-0 bg-brand-accent/20 filter blur-3xl rounded-full w-72 h-72 m-auto -z-10" />
              <div className="relative animate-float p-6 bg-brand-cardBg/90 border-2 border-brand-accent/35 rounded-[3rem] shadow-2xl w-full max-w-[450px]">
                <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-inner border border-brand-accent/20">
                  <img 
                    src="https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=650&q=80" 
                    alt="Digital Sewing Machine Embroidery" 
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                  />
                </div>
                {/* Float Badge overlay */}
                <div className="absolute -bottom-4 -left-4 bg-brand-white border border-brand-accent/30 rounded-2xl p-4 shadow-xl flex items-center gap-3">
                  <div className="bg-brand-primary/10 p-2.5 rounded-xl text-brand-primary">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-brand-primary leading-none uppercase tracking-wide">Digital Precision</span>
                    <span className="text-[10px] text-brand-textDark/60 mt-1 font-bold">100% Reliable Threading</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. INFINITE TICKER MARQUEE RIBBON */}
      <section className="bg-brand-secondary py-4 overflow-hidden border-y-2 border-brand-primary/20 shadow-md">
        <div className="w-full flex">
          <div className="animate-marquee flex gap-12 font-heading text-brand-white font-bold text-sm tracking-widest uppercase">
            <span>Blouse Embroidery •</span>
            <span>Bridal Work •</span>
            <span>Logo Embroidery •</span>
            <span>Saree Work •</span>
            <span>Name Embroidery •</span>
            <span>Burka Alterations •</span>
            {/* Second set to enable infinite loops */}
            <span>Blouse Embroidery •</span>
            <span>Bridal Work •</span>
            <span>Logo Embroidery •</span>
            <span>Saree Work •</span>
            <span>Name Embroidery •</span>
            <span>Burka Alterations •</span>
          </div>
        </div>
      </section>

      {/* 3. DETAILED SERVICES PEEK GRID */}
      <section className="py-20 bg-brand-cardBg/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-brand-primary font-bold">Premium Services</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-secondary mt-2 mb-4 leading-tight">
              Featured Specialties
            </h2>
            <p className="font-body text-base text-brand-textDark/80 font-medium">
              Explore our primary digital embroidery categories. Handcrafted details stitched using computer precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sampleServices.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-brand-white border border-brand-accent/25 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-brand-secondary mb-2 group-hover:text-brand-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="font-body text-sm text-brand-textDark/80 font-medium leading-relaxed mb-4">
                    {service.desc}
                  </p>
                  <Link 
                    to="/order" 
                    className="inline-flex items-center gap-1.5 text-brand-primary text-xs uppercase font-bold tracking-widest group-hover:gap-2.5 transition-all"
                  >
                    Order Now <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/services" 
              className="inline-flex items-center gap-2 bg-brand-secondary hover:bg-brand-secondary/95 text-brand-white font-body text-sm font-bold px-6 py-3 rounded-full shadow-lg transition-transform hover:scale-105"
            >
              See All 6 Services
            </Link>
          </div>

        </div>
      </section>

      {/* 4. CONNECTING PIPELINE */}
      <HowItWorks />

      {/* 5. GALLERY PORTFOLIO PEEK */}
      <section className="py-20 bg-brand-cardBg/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-16">
            <div className="text-center sm:text-left max-w-xl">
              <span className="text-xs uppercase tracking-widest text-brand-primary font-bold">Stunning Gallery</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-secondary mt-2 leading-tight">
                Our Latest Designs
              </h2>
            </div>
            <Link 
              to="/gallery" 
              className="bg-brand-primary hover:bg-brand-primary/95 text-brand-white font-body font-bold text-sm px-6 py-3.5 rounded-full transition-transform hover:scale-105"
            >
              View Full Gallery
            </Link>
          </div>

          {/* Masonry Columns */}
          <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
            {galleryPeek.map((image, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="break-inside-avoid rounded-3xl overflow-hidden shadow-sm hover:shadow-lg border border-brand-accent/20 group relative cursor-pointer"
              >
                <img 
                  src={image} 
                  alt="Embroidery Work Showcase" 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-brand-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-brand-white text-brand-secondary text-xs uppercase font-bold tracking-widest px-4 py-2 rounded-full shadow-lg">
                    Zoom
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. TESTIMONIALS SLIDER CAROUSEL */}
      <section className="py-20 bg-brand-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          
          <div className="mb-8">
            <span className="text-xs uppercase tracking-widest text-brand-primary font-bold">Testimonials</span>
            <h2 className="text-3xl font-bold text-brand-secondary mt-1">What Our Clients Say</h2>
          </div>

          <div className="relative min-h-[220px] flex items-center justify-center">
            {testimonials.map((review, idx) => (
              idx === activeTestimonial && (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center max-w-2xl mx-auto"
                >
                  <div className="flex gap-1 text-yellow-500 mb-4">
                    {[...Array(review.stars)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="font-heading text-lg sm:text-xl md:text-2xl italic leading-relaxed text-brand-secondary/90 mb-6 px-4">
                    "{review.text}"
                  </p>
                  <span className="font-body font-bold text-sm text-brand-primary uppercase tracking-wider">{review.name}</span>
                  <span className="text-xs text-brand-textDark/60 mt-1 font-semibold">{review.role}</span>
                </motion.div>
              )
            ))}
          </div>

          {/* Carousel dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === activeTestimonial ? 'bg-brand-primary w-6' : 'bg-brand-accent'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 7. INSTAGRAM SOCIAL CALLOUT */}
      <section className="bg-brand-primary text-brand-white py-16 text-center relative overflow-hidden">
        {/* Soft floating background circles */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-white/5 rounded-full filter blur-2xl" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-white/5 rounded-full filter blur-2xl" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 flex flex-col items-center gap-6">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-brand-white">
            Follow Our Digital Craft
          </h2>
          <p className="font-body text-base max-w-xl font-medium leading-relaxed opacity-90">
            See active updates, client designs, reels, and fresh zardosi stitch layouts daily on our Instagram page.
          </p>
          <a
            href="https://instagram.com/magicembroidery_digital"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-white text-brand-primary hover:bg-brand-accent/20 hover:text-brand-white border border-transparent hover:border-brand-white font-body font-bold text-sm px-8 py-4 rounded-full transition-all hover:scale-105 shadow-xl shadow-brand-primary/30"
          >
            Follow us @magicembroidery_digital
          </a>
        </div>
      </section>

    </div>
  );
}
