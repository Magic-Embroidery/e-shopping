import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, Truck } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: '1. Choose Your Design',
      description: 'Pick from our exquisite collection in the designs catalog or upload your custom design photo.'
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: '2. Place Order via WhatsApp',
      description: 'Fill our quick order form, upload your reference image, and send it directly to our WhatsApp to finalize details.'
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: '3. Secure Courier Delivery',
      description: 'Once stitched with high-precision digital machines, your gorgeous finished embroidery is dispatched securely to your doorstep.'
    }
  ];

  return (
    <section className="py-20 bg-brand-white relative overflow-hidden">
      {/* Decorative embroidery dots in background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#C0305A_1.5px,transparent_1.5px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-brand-primary font-bold">Simple Process</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-secondary mt-2 mb-4 leading-tight">
            How It Works
          </h2>
          <p className="font-body text-base text-brand-textDark/80 font-medium">
            Three simple steps to transform your fabric into a digital masterpiece.
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          
          {/* Animated Connecting Thread Line (Visible only on md screens and above) */}
          <div className="hidden md:block absolute top-[28%] left-[15%] right-[15%] h-[2px] z-0 pointer-events-none">
            <svg className="w-full h-10 overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path
                d="M0,10 Q250,-20 500,10 T1000,10"
                stroke="#C0305A"
                strokeWidth="2.5"
                strokeDasharray="8,6"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
              />
              {/* Floating Needle at the end of the line */}
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 2, duration: 0.5 }}
              >
                <text x="96%" y="-10" fontSize="24" className="rotate-45">🪡</text>
              </motion.g>
            </svg>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="flex flex-col items-center text-center p-6 bg-brand-cardBg/60 rounded-3xl border border-brand-accent/20 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                {/* Icon Wrapper */}
                <div className="w-14 h-14 rounded-2xl bg-brand-primary flex items-center justify-center text-brand-white mb-6 shadow-md shadow-brand-primary/20 group-hover:rotate-12 transition-transform duration-300">
                  {step.icon}
                </div>
                
                {/* Title */}
                <h3 className="font-heading text-lg sm:text-xl font-bold text-brand-secondary mb-3">
                  {step.title}
                </h3>
                
                {/* Description */}
                <p className="font-body text-sm leading-relaxed text-brand-textDark/80 font-medium">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
