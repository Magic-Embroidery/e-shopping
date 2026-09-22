import { motion } from 'framer-motion';
import { MessageSquare, Scissors, ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';
import SEO from '../components/SEO';

const fullServices = [
  {
    title: 'Bridal Blouse Embroidery',
    image: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=800&q=80',
    desc: 'Make your wedding day look unforgettable. We craft majestic zardosi, micro-bead embroidery, cut-work borders, and stone layouts with high-precision digital styling tailored to fit your custom measurements.',
    priceText: 'Custom pricing based on density',
    features: ['Rich Gold Beadwork', 'Traditional & Modern Motifs', 'Exquisite Back-neck detailing'],
    icon: <Sparkles className="w-5 h-5" />
  },
  {
    title: 'Blouse Embroidery',
    image: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=800&q=80',
    desc: 'Premium computer embroidery designs for daily wear, parties, and festive occasions. Choose from hundreds of floral patterns, geometric styles, and neck borders to give your sarees an instant fashion lift.',
    priceText: 'Affordable, quick turnaround',
    features: ['Precision computer stitching', 'Smooth silk thread lines', 'Wide catalog selection'],
    icon: <Scissors className="w-5 h-5" />
  },
  {
    title: 'Saree & Kurthi Embroidery',
    image: 'https://images.unsplash.com/photo-1572087552449-d82167336021?auto=format&fit=crop&w=800&q=80',
    desc: 'Drape yourself in beauty. We stitch grand borders, scattered small buttis, and beautiful pallu motifs directly onto georgette, silk, organza, or cotton sarees, as well as bespoke kurthi patterns.',
    priceText: 'Customized borders',
    features: ['Butti borders', 'Heavy pallu designs', 'Double-thread borders'],
    icon: <Heart className="w-5 h-5" />
  },
  {
    title: 'Logo Embroidery',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    desc: 'Promote your brand professionally. We stitch highly durable, neat digital logos onto shirts, t-shirts, caps, aprons, and uniforms for corporates, institutions, and schools.',
    priceText: 'Bulk orders welcome',
    features: ['Exact vector color match', 'High-density backing', 'High wash resistance'],
    icon: <Award className="w-5 h-5" />
  },
  {
    title: 'Initial & Name Embroidery',
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80',
    desc: 'Perfect for custom corporate gifting or personalized belongings. We stitch monogram letters, full names, and signatures in stunning calligraphic fonts on handkerchiefs, shirts, lab coats, and custom accessories.',
    priceText: 'Fast 24-48h delivery',
    features: ['Beautiful font sizing', 'Perfect letter spacing', 'Personalized monograms'],
    icon: <ShieldCheck className="w-5 h-5" />
  },
  {
    title: 'Burka Alteration & Embroidery',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
    desc: 'Graceful, elegant embroidery detailing on sleeves, cuffs, and front borders for abayas and burkas. We also offer precise length and fit alterations with strong matching seams.',
    priceText: 'Elegant, matching threads',
    features: ['Sleeve borders', 'Sober patterns', 'Premium alterations'],
    icon: <Scissors className="w-5 h-5" />
  }
];

export default function Services() {
  const getWhatsAppLink = (serviceName) => {
    const text = `Hello Magic Embroidery! 🧵 I am interested in ordering the "${serviceName}" service. Please let me know how to proceed.`;
    return `https://wa.me/919994546013?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="w-full pt-24 pb-20">
      <SEO 
        title="Our Tailory Specialties" 
        description="Browse our digital tailoring embroidery options in Selaiyur, Chennai. We offer custom bridal blouse work, saree embroidery, professional uniform logo stitching, calligraphic initials, and abaya alterations." 
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-widest text-brand-primary font-bold">Our Catalog</span>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-brand-secondary mt-2 mb-4 leading-tight">
            Our Digital Embroidery Services
          </h1>
          <p className="font-body text-base text-brand-textDark/80 font-medium">
            We provide a diverse range of computer-stitched tailory services with flawless finishes. Select a service to place an order directly on WhatsApp.
          </p>
        </div>

        {/* Services List */}
        <div className="flex flex-col gap-16">
          {fullServices.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className={`flex flex-col lg:flex-row gap-10 items-center bg-brand-white border border-brand-accent/25 rounded-[3rem] p-6 lg:p-8 shadow-sm hover:shadow-xl transition-all duration-300 ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              
              {/* Service Hero Image */}
              <div className="w-full lg:w-1/2 aspect-[4/3] rounded-[2rem] overflow-hidden shadow-inner border border-brand-accent/20 relative group">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-brand-white/90 backdrop-blur-sm p-3 rounded-2xl text-brand-primary flex items-center justify-center shadow-lg border border-brand-accent/20">
                  {service.icon}
                </div>
              </div>

              {/* Service Info Content */}
              <div className="w-full lg:w-1/2 flex flex-col gap-4">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-secondary">
                  {service.title}
                </h2>
                <p className="font-body text-sm sm:text-base leading-relaxed text-brand-textDark/80 font-medium">
                  {service.desc}
                </p>

                {/* Features Check List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {service.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-brand-textDark/90 text-sm font-semibold">
                      <div className="bg-brand-primary/10 p-1 rounded-full text-brand-primary">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-brand-accent/20 my-2 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-textDark/60 leading-none">Pricing Mode</span>
                    <span className="text-sm font-bold text-brand-primary mt-1">{service.priceText}</span>
                  </div>
                  <a
                    href={getWhatsAppLink(service.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/95 text-brand-white font-body font-bold text-sm px-6 py-3 rounded-full transition-transform hover:scale-105 shadow-md shadow-brand-primary/20"
                  >
                    <MessageSquare className="w-4 h-4 fill-brand-white" />
                    Order This on WhatsApp
                  </a>
                </div>

              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
