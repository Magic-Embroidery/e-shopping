import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { 
  Upload, 
  User, 
  Phone, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Send, 
  RefreshCw, 
  Scissors, 
  CheckCircle2, 
  Layers, 
  MessageSquare,
  Palette
} from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import SEO from '../components/SEO';

const garmentOptions = [
  'Bridal Blouse Embroidery',
  'Regular / Party Blouse',
  'Saree Border & Buttis',
  'Corporate / Uniform Logo',
  'Name & Monogram Lettering',
  'Burka / Abaya Embroidery',
  'Kurti / Suit Neck & Sleeves',
  'Other Custom Embroidery'
];

function generateFileName(originalName) {
  const fileExt = originalName.split('.').pop();
  return `custom-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
}

export default function CustomDesign() {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      garmentType: 'Bridal Blouse Embroidery',
      fabricDetails: '',
      description: '',
      deliveryDate: '',
      address: ''
    }
  });

  // Handle local file picking & preview
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, JPEG).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File exceeds 10MB. Please choose a smaller image.');
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Submit and redirect to WhatsApp
  const handleCustomOrderSubmit = async (data) => {
    if (!selectedFile) {
      toast.error('Please upload your custom design reference image.');
      return;
    }

    setSubmitting(true);
    let uploadedImageUrl = null;

    try {
      // 1. Resilient image compression
      if (selectedFile) {
        toast.loading('Optimizing reference image...', { id: 'custom-upload' });

        try {
          const compressionOptions = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1200,
            useWebWorker: true
          };
          const compressedFile = await imageCompression(selectedFile, compressionOptions);

          if (isSupabaseConfigured && supabase) {
            const fileName = generateFileName(selectedFile.name);
            const { error: uploadErr } = await supabase.storage
              .from('order-references')
              .upload(fileName, compressedFile);

            if (!uploadErr) {
              const { data: publicUrlData } = supabase.storage
                .from('order-references')
                .getPublicUrl(fileName);
              uploadedImageUrl = publicUrlData?.publicUrl;
            }
          }
        } catch (compErr) {
          console.warn('Compression or storage upload skipped:', compErr);
        }
      }

      // 2. Log in database if configured
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('orders').insert([
            {
              name: data.name,
              phone: data.phone,
              service: `Custom Design: ${data.garmentType}`,
              description: `Fabric: ${data.fabricDetails} | Specs: ${data.description}`,
              image_url: uploadedImageUrl,
              delivery_date: data.deliveryDate,
              address: data.address,
              status: 'Pending'
            }
          ]);
        } catch (dbErr) {
          console.warn('Order database logging skipped:', dbErr);
        }
      }

      // 3. Trigger celebration confetti
      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.6 }
      });

      toast.success('Custom Design Details Prepared!', { id: 'custom-upload' });

      // 4. Construct rich WhatsApp message
      const whatsappMessage = 
        `✨ *NEW CUSTOMISED DESIGN ORDER* ✨\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 *Customer Name:* ${data.name}\n` +
        `📱 *WhatsApp Phone:* ${data.phone}\n` +
        `👗 *Garment / Item:* ${data.garmentType}\n` +
        `🎨 *Fabric & Colors:* ${data.fabricDetails || 'To be decided'}\n` +
        `📅 *Preferred Delivery:* ${data.deliveryDate}\n` +
        `📍 *Courier Address:* ${data.address}\n\n` +
        `📝 *Custom Specifications & Concept:*\n${data.description}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        (uploadedImageUrl 
          ? `🖼️ *Uploaded Reference Photo:*\n${uploadedImageUrl}\n\n` 
          : `🖼️ *Photo:* (I am attaching the design image in this chat)\n\n`) +
        `Hello Magic Embroidery! Please review my custom design and quote the price & turnaround.`;

      const whatsappUrl = `https://wa.me/919994546013?text=${encodeURIComponent(whatsappMessage)}`;

      // 5. Reset form
      reset();
      setImagePreview(null);
      setSelectedFile(null);

      // 6. Redirect to WhatsApp
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);

    } catch (err) {
      console.error(err);
      toast.error('Connecting you to WhatsApp directly...', { id: 'custom-upload' });
      
      const fallbackMsg = 
        `Hello Magic Embroidery! 🧵\n` +
        `I would like to order a Custom Design for: ${data.garmentType}.\n` +
        `Name: ${data.name}\nPhone: ${data.phone}\nDelivery by: ${data.deliveryDate}\n` +
        `Please guide me on how to proceed. I will share my reference image here!`;
      
      window.open(`https://wa.me/919994546013?text=${encodeURIComponent(fallbackMsg)}`, '_blank');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full pt-24 pb-20 bg-[radial-gradient(#E8A0B0_0.6px,transparent_0.6px)] [background-size:20px_20px]">
      <SEO 
        title="Customised Design — Upload Your Embroidery Idea" 
        description="Upload your unique embroidery sketch or reference photo to Magic Embroidery. Customize blouse necklines, saree buttis, logos, and get instant quotes and ordering on WhatsApp." 
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-primary/15 text-brand-primary px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest mb-3 border border-brand-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            Bespoke Tailoring
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-brand-secondary mt-1 mb-4 leading-tight">
            Order Your Customised Design
          </h1>
          <p className="font-body text-base text-brand-textDark/80 font-medium">
            Have a photo from Pinterest, Instagram, or your own hand-drawn sketch? Upload it here and order directly via WhatsApp for a tailored quote.
          </p>
        </div>

        {/* 3 Quick Process Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-brand-white border border-brand-accent/25 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="bg-brand-primary/10 p-2.5 rounded-xl text-brand-primary flex-shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-brand-secondary block">1. Upload Photo</span>
              <span className="text-[11px] text-brand-textDark/60 font-medium">Any sketch or pattern photo</span>
            </div>
          </div>

          <div className="bg-brand-white border border-brand-accent/25 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="bg-brand-primary/10 p-2.5 rounded-xl text-brand-primary flex-shrink-0">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-brand-secondary block">2. Specify Details</span>
              <span className="text-[11px] text-brand-textDark/60 font-medium">Fabric, colors & date</span>
            </div>
          </div>

          <div className="bg-brand-white border border-brand-accent/25 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="bg-brand-primary/10 p-2.5 rounded-xl text-brand-primary flex-shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-brand-secondary block">3. Finalize on WhatsApp</span>
              <span className="text-[11px] text-brand-textDark/60 font-medium">Instant quote & confirmation</span>
            </div>
          </div>
        </div>

        {/* Custom Order Form Container */}
        <div className="bg-brand-white border-2 border-brand-accent/30 rounded-[3rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent" />

          <form onSubmit={handleSubmit(handleCustomOrderSubmit)} className="flex flex-col gap-6">
            
            {/* UPLOAD REFERENCE IMAGE SECTION */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider flex items-center gap-2">
                <Upload className="w-3.5 h-3.5 text-brand-primary" /> Upload Your Custom Design Reference Image *
              </label>

              <div className="border-2 border-dashed border-brand-accent/50 hover:border-brand-primary bg-brand-cardBg/40 hover:bg-brand-cardBg/70 rounded-3xl p-6 transition-all relative flex flex-col items-center justify-center text-center cursor-pointer group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {!imagePreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-brand-primary/10 group-hover:bg-brand-primary text-brand-primary group-hover:text-brand-white p-4 rounded-2xl transition-all duration-300">
                      <Upload className="w-7 h-7" />
                    </div>
                    <span className="font-heading text-base font-bold text-brand-secondary">
                      Click to choose or drag & drop design photo
                    </span>
                    <span className="text-xs text-brand-textDark/60 font-semibold">
                      Supports PNG, JPG, or JPEG (Clear blouse necklines, logos, or embroidery sketches)
                    </span>
                  </div>
                ) : (
                  <div className="relative z-20 flex flex-col items-center">
                    <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-lg border-2 border-brand-primary">
                      <img 
                        src={imagePreview} 
                        alt="Design Reference Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagePreview(null);
                          setSelectedFile(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-brand-white p-1.5 rounded-full transition-all shadow-md z-30"
                        title="Remove image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <span className="text-xs font-bold text-brand-primary mt-3 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Photo Selected: {selectedFile?.name}
                    </span>
                    <span className="text-[11px] text-brand-textDark/50 font-semibold">
                      Click to choose a different photo
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Row 1: Name and WhatsApp Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-brand-primary" /> Full Name *
                </label>
                <input 
                  type="text"
                  placeholder="Enter your name"
                  {...register('name', { required: 'Name is required' })}
                  className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3.5 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark"
                />
                {errors.name && <span className="text-xs font-bold text-red-500">{errors.name.message}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-brand-primary" /> WhatsApp Mobile Number (10 Digits) *
                </label>
                <input 
                  type="tel"
                  placeholder="e.g. 9876543210"
                  {...register('phone', {
                    required: 'WhatsApp phone is required',
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: 'Please enter a valid 10-digit Indian mobile number'
                    }
                  })}
                  className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3.5 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark"
                />
                {errors.phone && <span className="text-xs font-bold text-red-500">{errors.phone.message}</span>}
              </div>
            </div>

            {/* Row 2: Garment Category & Delivery Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-brand-primary" /> Garment / Item Type *
                </label>
                <select
                  {...register('garmentType', { required: 'Select an item type' })}
                  className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3.5 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark"
                >
                  {garmentOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-primary" /> Preferred Delivery Date *
                </label>
                <input 
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  {...register('deliveryDate', { required: 'Preferred delivery date is required' })}
                  className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3.5 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark"
                />
                {errors.deliveryDate && <span className="text-xs font-bold text-red-500">{errors.deliveryDate.message}</span>}
              </div>
            </div>

            {/* Row 3: Fabric & Color Details */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-brand-primary" /> Fabric & Thread Color Preferences
              </label>
              <input 
                type="text"
                placeholder="e.g. Maroon raw silk fabric, antique gold zari thread, maroon cutdana beads..."
                {...register('fabricDetails')}
                className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3.5 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark"
              />
            </div>

            {/* Row 4: Custom Specifications / Description */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-brand-primary" /> Custom Specifications & Tailoring Notes *
              </label>
              <textarea 
                rows="4"
                placeholder="Describe your design vision in detail: neck depth, sleeve border width, stone work density, latkan tassels, or special custom sizing requirements..."
                {...register('description', { required: 'Please describe your custom design requirements' })}
                className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3.5 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark resize-none"
              />
              {errors.description && <span className="text-xs font-bold text-red-500">{errors.description.message}</span>}
            </div>

            {/* Row 5: Shipping / Courier Address */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-primary" /> Delivery / Courier Address *
              </label>
              <textarea 
                rows="3"
                placeholder="Enter complete shipping address in Chennai or across Tamil Nadu. Items will be dispatched via secure courier."
                {...register('address', { required: 'Delivery address is required' })}
                className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3.5 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark resize-none"
              />
              {errors.address && <span className="text-xs font-bold text-red-500">{errors.address.message}</span>}
            </div>

            {/* Submit & Order Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full bg-brand-primary hover:bg-brand-primary/95 text-brand-white font-body font-bold text-base py-4 px-6 rounded-full transition-all shadow-xl shadow-brand-primary/20 hover:shadow-brand-primary/35 flex items-center justify-center gap-2.5 mt-2 ${
                submitting ? 'opacity-75 cursor-not-allowed' : 'hover:scale-[1.02]'
              }`}
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" /> Preparing Custom Order & Image...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Place Custom Order on WhatsApp
                </>
              )}
            </button>

            <p className="text-xs text-center text-brand-textDark/60 font-medium">
              After submitting, WhatsApp will open with your uploaded reference photo & order specifications pre-filled.
            </p>

          </form>

        </div>

      </div>
    </div>
  );
}
