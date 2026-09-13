import { Phone, MapPin, MessageCircle, Star, Shield, Zap, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

const Instagram = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const coreValues = [
  {
    icon: <Sparkles className="w-6 h-6 text-brand-primary" />,
    title: 'Quality Thread & Fabric',
    description: 'We strictly source vibrant, durable, non-fading silk and zari threads to ensure stitches that stand the test of time.'
  },
  {
    icon: <Zap className="w-6 h-6 text-brand-primary" />,
    title: 'Digital Precision',
    description: 'Computer-aided embroidery software mapping guarantees that every needle stich matches your catalog design to the millimeter.'
  },
  {
    icon: <Shield className="w-6 h-6 text-brand-primary" />,
    title: 'Secure Courier Delivery',
    description: 'Your finished garments are packaged cleanly and delivered to your doorstep via reliable courier services throughout Chennai.'
  },
  {
    icon: <Star className="w-6 h-6 text-brand-primary" />,
    title: 'Affordable Pricing',
    description: 'High-end custom tailory details at competitive rates. Transparent pricing with direct consultations.'
  }
];

export default function About() {
  return (
    <div className="w-full pt-24 pb-20">
      <SEO 
        title="About Us" 
        description="Learn more about Magic Embroidery — It's Digital in Selaiyur, Chennai. Discover our standard of computer precision tailoring, core brand story, and active location coordinates." 
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Row 1: Intro Story and Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          
          {/* Brand Story */}
          <div className="flex flex-col gap-5">
            <span className="text-xs uppercase tracking-widest text-brand-primary font-bold self-start">Our Story</span>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-brand-secondary leading-tight">
              Magic Embroidery — It's Digital
            </h1>
            <p className="font-body text-base leading-relaxed text-brand-textDark/80 font-medium">
              Nestled in the bustling heart of **Selaiyur, Chennai**, Magic Embroidery stands as a beacon of high-quality digital tailory. Our mission is simple: to combine traditional South Indian aesthetic designs with state-of-the-art computer embroidery precision.
            </p>
            <p className="font-body text-base leading-relaxed text-brand-textDark/80 font-medium">
              We specialize in custom bridal blouse stitchings, silk sarees borders, abaya sleevings, custom initials, and high-density branding logos. Our digital systems minimize manual stitch imperfections, giving you crisp borders, glowing buttis, and durable lettering that look stunning and wash beautifully.
            </p>
          </div>

          {/* Quick Contact Info Card */}
          <div className="bg-brand-white border border-brand-accent/25 rounded-[3rem] p-8 shadow-xl flex flex-col gap-6 relative">
            <div className="absolute top-0 left-8 right-8 h-0.5 bg-brand-primary" />
            
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-brand-secondary">
              Contact Details
            </h3>

            <div className="flex flex-col gap-4">
              {/* Phone */}
              <a 
                href="tel:+919994546013" 
                className="flex items-center gap-4 text-brand-textDark hover:text-brand-primary transition-colors font-body text-sm font-semibold"
              >
                <div className="bg-brand-primary/10 p-3 rounded-2xl text-brand-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-brand-textDark/50 font-bold uppercase tracking-wider">Call Directly</span>
                  <span className="text-sm font-bold mt-0.5">99945 46013</span>
                </div>
              </a>

              {/* WhatsApp */}
              <a 
                href="https://wa.me/919994546013" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-4 text-brand-textDark hover:text-brand-primary transition-colors font-body text-sm font-semibold"
              >
                <div className="bg-green-500/10 p-3 rounded-2xl text-green-600">
                  <MessageCircle className="w-5 h-5 fill-green-500/10" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-brand-textDark/50 font-bold uppercase tracking-wider">Chat on WhatsApp</span>
                  <span className="text-sm font-bold mt-0.5">Send a message now</span>
                </div>
              </a>

              {/* Instagram */}
              <a 
                href="https://instagram.com/magicembroidery_digital" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-4 text-brand-textDark hover:text-brand-primary transition-colors font-body text-sm font-semibold"
              >
                <div className="bg-pink-500/10 p-3 rounded-2xl text-pink-600">
                  <Instagram className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-brand-textDark/50 font-bold uppercase tracking-wider">Follow Instagram</span>
                  <span className="text-sm font-bold mt-0.5">@magicembroidery_digital</span>
                </div>
              </a>

              {/* Address */}
              <div className="flex items-center gap-4 text-brand-textDark font-body text-sm font-semibold">
                <div className="bg-brand-secondary/10 p-3 rounded-2xl text-brand-secondary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-brand-textDark/50 font-bold uppercase tracking-wider">Our Shop Location</span>
                  <span className="text-sm font-bold mt-0.5">Selaiyur, Chennai 600073</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Row 2: Why Choose Us (4 Pillar Cards) */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-brand-primary font-bold">Why Choose Us</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-brand-secondary mt-1">Our Standard of Quality</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => (
              <div 
                key={idx} 
                className="bg-brand-cardBg/55 border border-brand-accent/20 rounded-[2rem] p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col gap-4 text-center sm:text-left"
              >
                <div className="bg-brand-primary/10 p-3 rounded-2xl self-center sm:self-start text-brand-primary">
                  {val.icon}
                </div>
                <h4 className="font-heading text-lg font-bold text-brand-secondary">
                  {val.title}
                </h4>
                <p className="font-body text-xs leading-relaxed text-brand-textDark/85 font-medium">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Google Maps Embed */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-brand-primary font-bold">Find Us</span>
            <h2 className="text-3xl font-heading font-bold text-brand-secondary mt-1">Locate Our Shop</h2>
          </div>

          <div className="aspect-[21/9] xs:aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden border-2 border-brand-accent/25 shadow-2xl relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.317585098906!2d80.1260714757303!3d12.920803115933614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525f385c5dfc6d%3A0xc6cbef77ef1e88ec!2sSelaiyur%2C%20East%20Tambaram%2C%20Tambaram%2C%20Chennai%2C%20Tamil%20Nadu%20600073!5e0!3m2!1sen!2sin!4v1716499876251!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Magic Embroidery Selaiyur Location Map"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
