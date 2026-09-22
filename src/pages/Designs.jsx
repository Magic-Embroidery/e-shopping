import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search, 
  Sparkles, 
  ShoppingBag, 
  Tag, 
  Layers, 
  Clock, 
  Scissors, 
  CheckCircle2, 
  Upload, 
  RefreshCw,
  MessageCircle,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { fetchAllDesigns, createDesign } from '../lib/designsData';

export default function Designs() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Admin upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newDesignNumber, setNewDesignNumber] = useState('');
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Blouse');
  const [newDescription, setNewDescription] = useState('');
  const [newFabric, setNewFabric] = useState('Raw Silk, Brocade & Cotton');
  const [newWorkType, setNewWorkType] = useState('Digital Zardosi & Thread');
  const [newNeckStyle, setNewNeckStyle] = useState('Deep U-Neck / Custom');
  const [newTurnaround, setNewTurnaround] = useState('2 - 3 Days');
  const [newImageFile, setNewImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const categories = ['All', 'Blouse', 'Bridal', 'Saree and Kurthi', 'Logo', 'Name'];

  // Check if admin is authenticated
  useEffect(() => {
    const checkAdmin = async () => {
      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAdmin(true);
          return;
        }
      }
      if (typeof window !== 'undefined') {
        const mockAdmin = localStorage.getItem('mockAdminSession');
        if (mockAdmin) {
          setIsAdmin(true);
        }
      }
    };
    checkAdmin();
  }, []);

  // Fetch designs on mount
  useEffect(() => {
    async function loadDesigns() {
      setLoading(true);
      try {
        const data = await fetchAllDesigns();
        setDesigns(data);
      } catch (err) {
        console.error('Failed to load designs:', err);
        toast.error('Could not load designs catalog.');
      } finally {
        setLoading(false);
      }
    }
    loadDesigns();
  }, []);

  // Filtered designs based on category and search query
  const filteredDesigns = designs.filter((item) => {
    const itemCat = (item.category || '').toLowerCase();
    const activeCat = activeCategory.toLowerCase();

    const matchesCategory = activeCategory === 'All'
      ? true
      : activeCat === 'saree and kurthi'
        ? (itemCat === 'saree and kurthi' || itemCat === 'saree' || itemCat.includes('kurth') || itemCat.includes('kurt'))
        : itemCat === activeCat;
    
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      (item.design_number && item.design_number.toLowerCase().includes(query)) ||
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query)) ||
      (item.price && item.price.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  // Handle image selection for admin upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    setNewImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Handle Admin Design Upload
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!newImageFile) {
      toast.error('Please choose a design photo');
      return;
    }
    if (!newName.trim()) {
      toast.error('Please enter a design name');
      return;
    }

    setUploading(true);
    try {
      const cleanNum = newDesignNumber.trim().replace(/^(?:#\s*)?(?:ME-?)+/i, '').replace(/^ME/i, '');
      const designNo = cleanNum ? `ME-${cleanNum.toUpperCase()}` : `ME-${Math.floor(100 + Math.random() * 900)}`;

      const created = await createDesign({
        design_number: designNo,
        name: newName.trim(),
        price: newPrice.trim(),
        category: newCategory,
        description: newDescription.trim() || 'Custom high-precision digital embroidery design.',
        properties: {
          fabric: newFabric.trim() || 'Silk & Cotton Blends',
          work_type: newWorkType.trim() || 'Digital Zari & Thread',
          neck_style: newNeckStyle.trim() || 'Custom Neck Pattern',
          stitch_density: 'High Density (50,000+ Stitches)',
          turnaround: newTurnaround.trim() || '2 - 3 Days'
        },
        imageFile: newImageFile
      });

      setDesigns((prev) => [created, ...prev]);
      toast.success(`Design ${created.design_number} added successfully!`);

      // Reset form & close modal
      setNewDesignNumber('');
      setNewName('');
      setNewPrice('');
      setNewCategory('Blouse');
      setNewDescription('');
      setNewImageFile(null);
      setImagePreview(null);
      setShowUploadModal(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload design.');
    } finally {
      setUploading(false);
    }
  };

  // Lightbox / Property modal navigation
  const currentIndex = selectedDesign 
    ? filteredDesigns.findIndex((d) => d.id === selectedDesign.id)
    : -1;

  const showPreviousDesign = (e) => {
    e?.stopPropagation();
    if (currentIndex > 0) {
      setSelectedDesign(filteredDesigns[currentIndex - 1]);
    } else {
      setSelectedDesign(filteredDesigns[filteredDesigns.length - 1]);
    }
  };

  const showNextDesign = (e) => {
    e?.stopPropagation();
    if (currentIndex < filteredDesigns.length - 1) {
      setSelectedDesign(filteredDesigns[currentIndex + 1]);
    } else {
      setSelectedDesign(filteredDesigns[0]);
    }
  };

  // WhatsApp Order Link Generator for a selected design
  const getWhatsAppOrderUrl = (design) => {
    const text = 
      `Hello Magic Embroidery! 🧵\n\n` +
      `I am interested in ordering this design from your catalog:\n` +
      `✨ *Design Code:* ${design.design_number}\n` +
      `🏷️ *Design Name:* ${design.name}\n` +
      `💰 *Price:* ${design.price}\n` +
      `🧵 *Category:* ${design.category}\n` +
      (design.image_url ? `🖼️ *Photo Reference:* ${design.image_url}\n\n` : '\n') +
      `Could you please let me know the availability, fabric requirements, and tailoring timeline? Thank you!`;

    return `https://wa.me/919994546013?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="w-full pt-24 pb-20 min-h-screen">
      <SEO 
        title="Exclusive Digital Embroidery Designs" 
        description="Browse our digital embroidery designs catalog. View unique design codes, prices, zardosi neck patterns, blouse sleeves, and saree borders. Order directly via WhatsApp." 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-brand-primary/15 text-brand-primary px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest mb-3 border border-brand-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Digital Catalog
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-brand-secondary leading-tight">
            Our Embroidery Designs
          </h1>
          <p className="font-body text-base text-brand-textDark/80 font-medium mt-3">
            Browse our exclusive collection with unique design numbers and transparent pricing. Click on any design to inspect the complete pattern specifications and order directly on WhatsApp.
          </p>

          {/* Admin Upload Button Prompt (if logged in) */}
          {isAdmin && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  setNewDesignNumber(`ME-${100 + designs.length + 1}`);
                  setShowUploadModal(true);
                }}
                className="bg-brand-primary hover:bg-brand-primary/95 text-brand-white font-body font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Admin: Upload New Design
              </button>
            </div>
          )}
        </div>

        {/* Search Bar & Category Filters Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-body text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-brand-primary text-brand-white shadow-md shadow-brand-primary/20 scale-105'
                    : 'bg-brand-cardBg text-brand-textDark hover:bg-brand-accent/25 border border-brand-accent/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-brand-textDark/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by ME-No or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-cardBg border border-brand-accent/30 rounded-full pl-10 pr-4 py-2 text-xs font-semibold text-brand-textDark focus:outline-none focus:border-brand-primary shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-textDark/40 hover:text-brand-textDark"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-brand-cardBg rounded-[2rem] border border-brand-accent/20 h-80 flex flex-col gap-4 p-4">
                <div className="bg-brand-accent/30 rounded-[1.5rem] w-full h-48" />
                <div className="h-4 bg-brand-accent/30 rounded w-1/3" />
                <div className="h-4 bg-brand-accent/30 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredDesigns.length === 0 ? (
          /* Empty Catalog State */
          <div className="text-center max-w-md mx-auto py-16 p-8 bg-brand-cardBg/70 rounded-[2.5rem] border border-brand-accent/25 shadow-sm">
            <ShoppingBag className="w-12 h-12 text-brand-primary mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-brand-secondary mb-2">No Matching Designs Found</h3>
            <p className="font-body text-sm text-brand-textDark/80 font-medium mb-6">
              {searchQuery 
                ? `No designs matching "${searchQuery}". Try a different keyword.` 
                : `We don't have designs in "${activeCategory}" yet. Have a custom idea?`}
            </p>
            <a 
              href="https://wa.me/919994546013" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-brand-primary text-brand-white font-body font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full shadow-lg inline-flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <MessageCircle className="w-4 h-4" /> Request Custom Design
            </a>
          </div>
        ) : (
          /* Designs Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredDesigns.map((design) => (
              <motion.div
                key={design.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedDesign(design)}
                className="bg-brand-white border border-brand-accent/25 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group flex flex-col cursor-pointer relative"
              >
                {/* Photo & Overlays */}
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-brand-cardBg">
                  <img 
                    src={design.image_url} 
                    alt={design.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Unique Design Number Tag */}
                  <span className="absolute top-3 left-3 bg-brand-secondary text-brand-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    #{design.design_number.replace(/^#/, '')}
                  </span>
                  {/* Category Pill */}
                  <span className="absolute top-3 right-3 bg-brand-white/90 backdrop-blur-md text-brand-primary border border-brand-accent/20 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    {design.category === 'Saree' ? 'Saree and Kurthi' : design.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-grow justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-base font-bold text-brand-secondary group-hover:text-brand-primary transition-colors line-clamp-1">
                      {design.name}
                    </h3>
                    <p className="font-body text-xs text-brand-textDark/70 line-clamp-2 mt-1 leading-relaxed">
                      {design.description}
                    </p>
                  </div>

                  {/* Price and Details Action Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-brand-accent/15 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-brand-textDark/60 font-bold">Price</span>
                      <span className="font-heading text-lg font-bold text-brand-primary">
                        {design.price}
                      </span>
                    </div>
                    
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-secondary group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all">
                      <Eye className="w-3.5 h-3.5 text-brand-primary" /> View Details
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* FULL DESIGN & PROPERTIES MODAL */}
      <AnimatePresence>
        {selectedDesign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDesign(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-textDark/90 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedDesign(null)} 
              className="fixed top-4 right-4 bg-brand-white/10 hover:bg-brand-white/20 text-brand-white p-3 rounded-full transition-colors z-50 shadow-lg"
              aria-label="Close Design Details"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Previous Design Arrow */}
            <button
              onClick={showPreviousDesign}
              className="fixed left-4 top-1/2 -translate-y-1/2 bg-brand-white/10 hover:bg-brand-white/25 text-brand-white p-3.5 rounded-full transition-colors z-50 hidden lg:flex items-center justify-center shadow-lg"
              aria-label="Previous Design"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Design Arrow */}
            <button
              onClick={showNextDesign}
              className="fixed right-4 top-1/2 -translate-y-1/2 bg-brand-white/10 hover:bg-brand-white/25 text-brand-white p-3.5 rounded-full transition-colors z-50 hidden lg:flex items-center justify-center shadow-lg"
              aria-label="Next Design"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Core Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-brand-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-brand-accent/25 my-auto flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Left Column: Full Design Photo Display */}
              <div className="w-full md:w-1/2 bg-brand-cardBg relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
                <div className="w-full h-full max-h-[400px] md:max-h-[600px] rounded-3xl overflow-hidden shadow-md border border-brand-accent/20 relative">
                  <img 
                    src={selectedDesign.image_url} 
                    alt={selectedDesign.name} 
                    className="w-full h-full object-contain md:object-cover"
                  />
                  {/* Floating Number Overlay */}
                  <span className="absolute top-4 left-4 bg-brand-secondary/90 text-brand-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md backdrop-blur-sm">
                    #{selectedDesign.design_number.replace(/^#/, '')}
                  </span>
                </div>
              </div>

              {/* Right Column: Properties & Specifications Panel */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
                <div className="flex flex-col gap-4">
                  {/* Category & Design Number Row */}
                  <div className="flex items-center justify-between">
                    <span className="bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-brand-primary/20">
                      {selectedDesign.category === 'Saree' ? 'Saree and Kurthi' : selectedDesign.category} Embroidery
                    </span>
                    <span className="text-xs font-bold text-brand-textDark/60 tracking-wider">
                      Item ID: {selectedDesign.design_number.replace(/^#/, '')}
                    </span>
                  </div>

                  {/* Design Title */}
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-secondary leading-tight">
                    {selectedDesign.name}
                  </h2>

                  {/* Price Banner */}
                  <div className="bg-brand-cardBg border border-brand-accent/25 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-brand-textDark/60">Price</span>
                      <span className="font-heading text-2xl sm:text-3xl font-bold text-brand-primary">
                        {selectedDesign.price}
                      </span>
                    </div>
                    <Tag className="w-6 h-6 text-brand-primary/60" />
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-textDark mb-1.5">Description</h4>
                    <p className="font-body text-xs sm:text-sm leading-relaxed text-brand-textDark/80 font-medium">
                      {selectedDesign.description}
                    </p>
                  </div>

                  {/* Detailed Design Properties Sheet */}
                  <div className="border-t border-brand-accent/20 pt-4 flex flex-col gap-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-textDark mb-1">Design Properties</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {/* Fabric */}
                      <div className="bg-brand-cardBg/70 rounded-xl p-2.5 border border-brand-accent/20 flex flex-col gap-0.5">
                        <span className="text-[10px] text-brand-textDark/60 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Layers className="w-3 h-3 text-brand-primary" /> Fabric Compatibility
                        </span>
                        <span className="font-semibold text-brand-secondary truncate">
                          {selectedDesign.properties?.fabric || 'Raw Silk, Silk Blends'}
                        </span>
                      </div>

                      {/* Work Type */}
                      <div className="bg-brand-cardBg/70 rounded-xl p-2.5 border border-brand-accent/20 flex flex-col gap-0.5">
                        <span className="text-[10px] text-brand-textDark/60 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Scissors className="w-3 h-3 text-brand-primary" /> Stitching Technique
                        </span>
                        <span className="font-semibold text-brand-secondary truncate">
                          {selectedDesign.properties?.work_type || 'Digital Zardosi & Cord'}
                        </span>
                      </div>

                      {/* Neck Style / Placement */}
                      <div className="bg-brand-cardBg/70 rounded-xl p-2.5 border border-brand-accent/20 flex flex-col gap-0.5">
                        <span className="text-[10px] text-brand-textDark/60 font-bold uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-brand-primary" /> Placement / Style
                        </span>
                        <span className="font-semibold text-brand-secondary truncate">
                          {selectedDesign.properties?.neck_style || 'Custom Neck & Sleeves'}
                        </span>
                      </div>

                      {/* Turnaround */}
                      <div className="bg-brand-cardBg/70 rounded-xl p-2.5 border border-brand-accent/20 flex flex-col gap-0.5">
                        <span className="text-[10px] text-brand-textDark/60 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brand-primary" /> Completion Time
                        </span>
                        <span className="font-semibold text-brand-secondary truncate">
                          {selectedDesign.properties?.turnaround || '2 - 3 Days'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Order Action */}
                <div className="pt-6 border-t border-brand-accent/20 mt-4 flex flex-col gap-2">
                  <a
                    href={getWhatsAppOrderUrl(selectedDesign)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-body font-bold text-sm py-4 rounded-full shadow-lg shadow-green-600/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" /> Order Design #{selectedDesign.design_number.replace(/^#/, '')} on WhatsApp
                  </a>
                  <p className="text-[11px] text-center text-brand-textDark/60 font-medium">
                    Pre-fills Design #{selectedDesign.design_number.replace(/^#/, '')} ({selectedDesign.price}) directly into our WhatsApp chat.
                  </p>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADMIN UPLOAD DESIGN MODAL */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUploadModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-textDark/85 backdrop-blur-sm p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-brand-white w-full max-w-2xl rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-brand-accent/25 relative my-auto max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowUploadModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-brand-cardBg text-brand-textDark"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="bg-brand-primary/10 p-2.5 rounded-2xl text-brand-primary">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-brand-secondary">
                    Upload New Design
                  </h3>
                  <p className="text-xs text-brand-textDark/60 font-medium">
                    Add a new unique digital design with pricing and property specifications.
                  </p>
                </div>
              </div>

              <form onSubmit={handleUploadSubmit} className="flex flex-col gap-4">
                
                {/* Row 1: Design Code & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider">
                      Unique Design Number
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. ME-109"
                      value={newDesignNumber}
                      onChange={(e) => setNewDesignNumber(e.target.value)}
                      required
                      className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider">
                      Price (₹)
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. ₹1,800 or 1800"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      required
                      className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                {/* Row 2: Design Name & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider">
                      Design Name
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. Royal Peacock Zardosi Back"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                      className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary"
                    >
                      <option value="Blouse">Blouse</option>
                      <option value="Bridal">Bridal</option>
                      <option value="Saree and Kurthi">Saree and Kurthi</option>
                      <option value="Logo">Logo</option>
                      <option value="Name">Name</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider">
                    Design Description
                  </label>
                  <textarea 
                    rows="2"
                    placeholder="Describe the motifs, zari type, and aesthetic details..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    required
                    className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary resize-none"
                  />
                </div>

                {/* Properties Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-brand-textDark uppercase tracking-wider">Fabric</label>
                    <input 
                      type="text"
                      value={newFabric}
                      onChange={(e) => setNewFabric(e.target.value)}
                      className="bg-brand-cardBg border border-brand-accent/35 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-brand-textDark uppercase tracking-wider">Work Type</label>
                    <input 
                      type="text"
                      value={newWorkType}
                      onChange={(e) => setNewWorkType(e.target.value)}
                      className="bg-brand-cardBg border border-brand-accent/35 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-brand-textDark uppercase tracking-wider">Neck Style</label>
                    <input 
                      type="text"
                      value={newNeckStyle}
                      onChange={(e) => setNewNeckStyle(e.target.value)}
                      className="bg-brand-cardBg border border-brand-accent/35 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-brand-textDark uppercase tracking-wider">Turnaround</label>
                    <input 
                      type="text"
                      value={newTurnaround}
                      onChange={(e) => setNewTurnaround(e.target.value)}
                      className="bg-brand-cardBg border border-brand-accent/35 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Photo Upload Zone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider">
                    Design Photo
                  </label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                    className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl p-3 font-body text-xs font-semibold"
                  />
                  {imagePreview && (
                    <div className="mt-2 w-28 h-28 rounded-2xl overflow-hidden border border-brand-accent/30 shadow-inner">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-brand-primary hover:bg-brand-primary/95 text-brand-white font-body font-bold text-sm py-4 rounded-full shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform mt-2"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Uploading Design to Catalog...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Publish Design to Catalog
                    </>
                  )}
                </button>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
