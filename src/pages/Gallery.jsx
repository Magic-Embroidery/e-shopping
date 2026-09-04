import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Image as ImageIcon, Loader } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import SEO from '../components/SEO';

// High-quality static mock database in case Supabase is offline/unconfigured
const mockGallery = [
  { id: 1, image_url: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=500&h=650&q=80', category: 'Bridal', caption: 'Classic Ruby Red Zardosi Bridal Back-neck' },
  { id: 2, image_url: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=500&h=400&q=80', category: 'Blouse', caption: 'Emerald Green Floral Sleeve Pattern' },
  { id: 3, image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&h=500&q=80', category: 'Logo', caption: 'Premium Golden Corporate Crest Monogram' },
  { id: 4, image_url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=500&h=650&q=80', category: 'Name', caption: 'Elegant Script Name Handkerchief Monogram' },
  { id: 5, image_url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=500&h=400&q=80', category: 'Saree', caption: 'Sophisticated Sleeve Motif for Organza Sarees' },
  { id: 6, image_url: 'https://images.unsplash.com/photo-1572087552449-d82167336021?auto=format&fit=crop&w=500&h=500&q=80', category: 'Saree', caption: 'Delicate Double-bordered Zari Saree Pallu' },
  { id: 7, image_url: 'https://images.unsplash.com/photo-1590075865003-e48277adc558?auto=format&fit=crop&w=500&h=600&q=80', category: 'Bridal', caption: 'Royal Peacock Motif Bridal Blouse' },
  { id: 8, image_url: 'https://images.unsplash.com/photo-1558244661-d248897f7bc4?auto=format&fit=crop&w=500&h=400&q=80', category: 'Blouse', caption: 'Minimal geometric neck embroidery' }
];

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedIdx, setSelectedIdx] = useState(null);

  const categories = ['All', 'Blouse', 'Bridal', 'Saree', 'Logo', 'Name'];

  useEffect(() => {
    async function fetchGallery() {
      setLoading(true);
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          if (data && data.length > 0) {
            setItems(data);
          } else {
            setItems(mockGallery); // Fallback if database table is empty
          }
        } catch (err) {
          console.warn("Supabase fetch failed, falling back to mock database:", err);
          setItems(mockGallery);
        }
      } else {
        // Offline / Unconfigured fallback
        setItems(mockGallery);
      }
      setLoading(false);
    }
    fetchGallery();
  }, []);

  // Filter gallery items
  const filteredItems = activeTab === 'All' 
    ? items 
    : items.filter(item => item.category.toLowerCase() === activeTab.toLowerCase());

  // Lightbox navigation
  const openLightbox = (idx) => setSelectedIdx(idx);
  const closeLightbox = () => setSelectedIdx(null);
  
  const showPrev = (e) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const showNext = (e) => {
    e.stopPropagation();
    setSelectedIdx((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full pt-24 pb-20">
      <SEO 
        title="Design Portfolio Gallery" 
        description="Explore Magic Embroidery's extensive digital embroidery design gallery. View precision computer blouse designs, bridal zardosi, sarees buttis, and custom initials." 
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-brand-primary font-bold">Showcase Portfolio</span>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-brand-secondary mt-2 mb-4 leading-tight">
            Our Digital Gallery
          </h1>
          <p className="font-body text-base text-brand-textDark/80 font-medium">
            Explore our curated catalog of custom-stitched patterns. Click any image to view in detail.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`font-body text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 ${
                activeTab === cat
                  ? 'bg-brand-primary text-brand-white shadow-md shadow-brand-primary/20 scale-105'
                  : 'bg-brand-cardBg text-brand-textDark hover:bg-brand-accent/25'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Skeleton Loader State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-brand-cardBg rounded-[2rem] border border-brand-accent/20 h-72 flex flex-col gap-4 p-4">
                <div className="bg-brand-accent/30 rounded-[1.5rem] w-full h-4/5" />
                <div className="h-4 bg-brand-accent/30 rounded w-2/3 self-start" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          /* Empty State */
          <div className="text-center max-w-md mx-auto py-12 p-8 bg-brand-cardBg/60 rounded-[2.5rem] border border-brand-accent/20">
            <ImageIcon className="w-12 h-12 text-brand-primary mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-brand-secondary mb-2">No Designs Found</h3>
            <p className="font-body text-sm text-brand-textDark/80 font-medium mb-6">
              We haven't uploaded images to the "{activeTab}" category yet! Looking for custom work?
            </p>
            <a 
              href="https://wa.me/919994546013" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-brand-primary text-brand-white font-body font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full shadow-lg"
            >
              Request Custom Design
            </a>
          </div>
        ) : (
          /* Masonry Grid */
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layoutId={`gallery-card-${item.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => openLightbox(idx)}
                className="break-inside-avoid bg-brand-white border border-brand-accent/25 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group relative cursor-pointer"
              >
                <div className="w-full h-auto overflow-hidden relative">
                  <img 
                    src={item.image_url} 
                    alt={item.caption || item.category} 
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Category Tag Overlay */}
                  <span className="absolute top-3 left-3 bg-brand-white/90 backdrop-blur-sm border border-brand-accent/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
                {item.caption && (
                  <div className="p-4 border-t border-brand-accent/15 bg-brand-white">
                    <p className="font-body text-xs font-semibold text-brand-textDark/85 leading-relaxed">
                      {item.caption}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* 7. CUSTOM FULL-SCREEN LIGHTBOX */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-textDark/95 backdrop-blur-sm p-4"
          >
            {/* Close Button */}
            <button 
              onClick={closeLightbox} 
              className="absolute top-4 right-4 bg-brand-white/10 hover:bg-brand-white/20 text-brand-white p-3 rounded-full transition-colors z-50"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Nav Button */}
            <button
              onClick={showPrev}
              className="absolute left-4 bg-brand-white/10 hover:bg-brand-white/20 text-brand-white p-3 rounded-full transition-colors z-50 hidden sm:block"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Core Image Showcase Wrapper */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[80vh] flex flex-col items-center justify-center z-40 bg-brand-cardBg rounded-[2rem] overflow-hidden p-2 sm:p-4 border border-brand-accent/20"
            >
              <img 
                src={filteredItems[selectedIdx].image_url} 
                alt="Selected Embroidery Detail" 
                className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-inner"
              />
              
              {/* Caption details below lightbox */}
              <div className="w-full text-center py-4 px-2">
                <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-brand-primary/20">
                  {filteredItems[selectedIdx].category}
                </span>
                {filteredItems[selectedIdx].caption && (
                  <p className="font-heading text-sm sm:text-base font-semibold text-brand-secondary mt-2">
                    {filteredItems[selectedIdx].caption}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Right Nav Button */}
            <button
              onClick={showNext}
              className="absolute right-4 bg-brand-white/10 hover:bg-brand-white/20 text-brand-white p-3 rounded-full transition-colors z-50 hidden sm:block"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
