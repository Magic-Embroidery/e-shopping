import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { Calendar, User, Phone, Edit, MapPin, Upload, Eye, RefreshCw, Send } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import SEO from '../components/SEO';

const servicesOptions = [
  'Bridal Blouse Embroidery',
  'Blouse Embroidery',
  'Saree Embroidery',
  'Logo Embroidery',
  'Initial & Name Embroidery',
  'Burka Alteration & Embroidery'
];

function generateOrderReferenceFileName(originalName) {
  const fileExt = originalName.split('.').pop();
  return `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
}

export default function Order() {
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
      service: '',
      description: '',
      deliveryDate: '',
      address: ''
    }
  });

  // Handle image file selections and client-side compressed previews
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Type checking
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPG, JPEG, PNG).");
      return;
    }

    // Size limit warning (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image is too large. We will compress it for upload.");
    }

    setSelectedFile(file);

    // Create client-side preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleOrderSubmit = async (data) => {
    setSubmitting(true);
    let imageUrl = null;

    try {
      // 1. Resilient image compression & Supabase Storage upload
      if (selectedFile) {
        if (isSupabaseConfigured) {
          // Compress options
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1200,
            useWebWorker: true
          };
          
          toast.loading("Compressing reference photo...", { id: "upload-status" });
          const compressedFile = await imageCompression(selectedFile, options);

          const fileName = generateOrderReferenceFileName(selectedFile.name);
          const filePath = `order-references/${fileName}`;

          toast.loading("Uploading reference photo...", { id: "upload-status" });
          const { error: uploadError } = await supabase.storage
            .from('order-references')
            .upload(filePath, compressedFile);

          if (uploadError) {
            console.error("Bucket upload failed:", uploadError);
            throw new Error("Photo upload failed. You can still order via WhatsApp!");
          }

          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from('order-references')
            .getPublicUrl(filePath);

          imageUrl = publicUrlData?.publicUrl;
        } else {
          console.warn("Supabase not configured, skipping image storage upload.");
        }
      }

      // 2. Insert record into orders table in Supabase
      if (isSupabaseConfigured) {
        toast.loading("Ingesting order details...", { id: "upload-status" });
        const { error: dbError } = await supabase.from('orders').insert([
          {
            name: data.name,
            phone: data.phone,
            service: data.service,
            description: data.description,
            image_url: imageUrl,
            delivery_date: data.deliveryDate,
            address: data.address,
            status: 'Pending'
          }
        ]);

        if (dbError) throw dbError;
        toast.success("Order logged in our database!", { id: "upload-status" });
      } else {
        console.warn("Supabase not configured, order skipped saving to cloud.");
      }

      // 3. Trigger confetti success overlays
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

      toast.success("Order Placed Successfully!", { id: "upload-status" });

      // 4. Form pre-filled WhatsApp deep-link message
      const formattedMessage = `Hello Magic Embroidery! 🧵\n` +
        `Name: ${data.name}\n` +
        `Phone: ${data.phone}\n` +
        `Service: ${data.service}\n` +
        `Description: ${data.description}\n` +
        `Delivery by: ${data.deliveryDate}\n` +
        `Address: ${data.address}` +
        (imageUrl ? `\nReference Image: ${imageUrl}` : '');

      const whatsappUrl = `https://wa.me/919994546013?text=${encodeURIComponent(formattedMessage)}`;

      // 5. Reset form and states
      reset();
      setImagePreview(null);
      setSelectedFile(null);

      // 6. Direct client redirect to WhatsApp client
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);

    } catch (err) {
      console.error("Order ingestion failed:", err);
      toast.error(err.message || "Failed to log order. Redirecting you to WhatsApp...", { id: "upload-status" });
      
      // Secondary fallback: execute direct WhatsApp redirect even if Supabase fails
      const formattedMessage = `Hello Magic Embroidery! 🧵\n` +
        `Name: ${data.name}\n` +
        `Phone: ${data.phone}\n` +
        `Service: ${data.service}\n` +
        `Description: ${data.description}\n` +
        `Delivery by: ${data.deliveryDate}\n` +
        `Address: ${data.address}`;
      const whatsappUrl = `https://wa.me/919994546013?text=${encodeURIComponent(formattedMessage)}`;
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full pt-24 pb-20 bg-[radial-gradient(#E8A0B0_0.6px,transparent_0.6px)] [background-size:20px_20px]">
      <SEO 
        title="Custom Embroidery Order Form" 
        description="Fill out our digital tailor request form. Select your embroidery service, add a description, upload reference photos with instant compression, and place your order securely on WhatsApp." 
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-brand-primary font-bold">Custom Request</span>
          <h1 className="text-4xl font-heading font-bold text-brand-secondary mt-2 mb-4">
            Place Your Embroidery Order
          </h1>
          <p className="font-body text-sm sm:text-base text-brand-textDark/80 font-medium">
            Fill in the details below. Once submitted, your order is logged and you will be redirected to WhatsApp to finalize your tailor request.
          </p>
        </div>

        {/* Order Card Container */}
        <div className="bg-brand-white border-2 border-brand-accent/30 rounded-[3rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Decorative sewing thread line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent" />

          <form onSubmit={handleSubmit(handleOrderSubmit)} className="flex flex-col gap-6">
            
            {/* Row 1: Name and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Name Field */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-brand-primary" /> Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  {...register('name', { required: 'Full Name is required' })}
                  className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3.5 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark focus:ring-1 focus:ring-brand-primary"
                />
                {errors.name && <span className="text-xs font-bold text-red-500 mt-1">{errors.name.message}</span>}
              </div>

              {/* Phone Field */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-brand-primary" /> Phone Number (10 Digits)
                </label>
                <input
                  type="tel"
                  placeholder="Enter 10-digit number"
                  {...register('phone', {
                    required: 'Phone Number is required',
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: 'Please enter a valid 10-digit Indian mobile number'
                    }
                  })}
                  className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3.5 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark focus:ring-1 focus:ring-brand-primary"
                />
                {errors.phone && <span className="text-xs font-bold text-red-500 mt-1">{errors.phone.message}</span>}
              </div>

            </div>

            {/* Row 2: Service & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Service Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider flex items-center gap-1.5">
                  <Edit className="w-3.5 h-3.5 text-brand-primary" /> Service Type
                </label>
                <select
                  {...register('service', { required: 'Please select a service' })}
                  className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3.5 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark focus:ring-1 focus:ring-brand-primary"
                >
                  <option value="">Choose an Embroidery Service</option>
                  {servicesOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {errors.service && <span className="text-xs font-bold text-red-500 mt-1">{errors.service.message}</span>}
              </div>

              {/* Delivery Date */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-primary" /> Preferred Delivery Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]} // Block historical dates
                  {...register('deliveryDate', { required: 'Preferred delivery date is required' })}
                  className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3.5 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark focus:ring-1 focus:ring-brand-primary"
                />
                {errors.deliveryDate && <span className="text-xs font-bold text-red-500 mt-1">{errors.deliveryDate.message}</span>}
              </div>

            </div>

            {/* Design Description */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider flex items-center gap-1.5">
                <Edit className="w-3.5 h-3.5 text-brand-primary" /> Design Description
              </label>
              <textarea
                rows="4"
                placeholder="Describe your embroidery design concept, color preferences, sizes, thread choices, or custom tailoring specifications..."
                {...register('description', { required: 'Please write a short description' })}
                className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3.5 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark focus:ring-1 focus:ring-brand-primary resize-none"
              />
              {errors.description && <span className="text-xs font-bold text-red-500 mt-1">{errors.description.message}</span>}
            </div>

            {/* Shipping Address */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-primary" /> Shipping/Courier Address
              </label>
              <textarea
                rows="3"
                placeholder="Enter complete shipping address. Finished items will be delivered strictly via secure courier."
                {...register('address', { required: 'Shipping Address is required' })}
                className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3.5 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark focus:ring-1 focus:ring-brand-primary resize-none"
              />
              {errors.address && <span className="text-xs font-bold text-red-500 mt-1">{errors.address.message}</span>}
            </div>

            {/* Reference Image Upload */}
            <div className="flex flex-col gap-3 border-2 border-dashed border-brand-accent/40 bg-brand-cardBg/30 rounded-[2rem] p-6 relative">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="bg-brand-primary text-brand-white p-3 rounded-2xl">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="font-heading text-base font-bold text-brand-secondary leading-tight">Upload Reference Image</h4>
                  <p className="text-xs text-brand-textDark/60 font-semibold mt-1">PNG, JPG, or JPEG files up to 5MB.</p>
                </div>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              {/* Compressed Image Preview */}
              {imagePreview && (
                <div className="mt-4 flex flex-col items-center sm:items-start">
                  <span className="text-[10px] uppercase font-bold text-brand-textDark/60 mb-2 flex items-center gap-1">
                    <Eye className="w-3 h-3 text-brand-primary" /> Reference Photo Preview:
                  </span>
                  <div className="relative w-40 h-40 border border-brand-accent/35 rounded-2xl overflow-hidden shadow-md">
                    <img 
                      src={imagePreview} 
                      alt="Uploaded reference preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview(null);
                        setSelectedFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-brand-white p-1.5 rounded-full transition-colors z-20"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full bg-brand-primary hover:bg-brand-primary/95 text-brand-white font-body font-bold text-base py-4 px-6 rounded-full transition-all shadow-xl shadow-brand-primary/20 hover:shadow-brand-primary/35 flex items-center justify-center gap-2 ${
                submitting ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" /> Loggin Order & Uploading...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Submit & Order on WhatsApp
                </>
              )}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}
