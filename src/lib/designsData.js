import { supabase, isSupabaseConfigured } from './supabase';

// High quality initial designs catalog with unique design numbers, prices, and properties
export const initialDesigns = [
  {
    id: 'des-1',
    design_number: 'ME-101',
    name: 'Classic Ruby Red Zardosi Bridal Back',
    price: '₹2,499',
    category: 'Bridal',
    image_url: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=800&h=1000&q=85',
    description: 'High-density gold zari work featuring intricate peacock and floral creeper motifs tailored for bridal auspiciousness. Heavy cutdana beads outline the deep U-neck curvature.',
    properties: {
      fabric: 'Raw Silk, Silk Cotton & Velvet',
      work_type: 'Digital Zardosi & Hand-Cutdana Finish',
      neck_style: 'Deep U-Cut with Tassel Latkan Border',
      stitch_density: 'High Density (85,000+ Stitches)',
      turnaround: '2 - 3 Days'
    }
  },
  {
    id: 'des-2',
    design_number: 'ME-102',
    name: 'Emerald Green Floral Sleeve Pattern',
    price: '₹1,299',
    category: 'Blouse',
    image_url: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=800&h=800&q=85',
    description: 'Modern botanical elbow-sleeve embroidery pattern combining emerald green silk threads with subtle antique gold cord outlining.',
    properties: {
      fabric: 'Brocade, Georgette & Chanderi',
      work_type: 'Computer Resham & Zari Cord Stitch',
      neck_style: 'Elbow Sleeve Border (Left & Right)',
      stitch_density: 'Medium Density (42,000 Stitches)',
      turnaround: '1 - 2 Days'
    }
  },
  {
    id: 'des-3',
    design_number: 'ME-103',
    name: 'Golden Corporate Crest Monogram',
    price: '₹499',
    category: 'Logo',
    image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&h=800&q=85',
    description: 'Ultra-crisp computer crest logo embroidery ideal for corporate blazers, hospitality uniforms, institutional crests, and sports emblems.',
    properties: {
      fabric: 'Polyester, Cotton Twill & Suiting Blend',
      work_type: 'High-Tensile Precision Madeira Stitching',
      neck_style: 'Left Chest Emblem (3.5" x 3.5")',
      stitch_density: 'Compact Dense Tatami Fill',
      turnaround: 'Same Day / 24 Hours'
    }
  },
  {
    id: 'des-4',
    design_number: 'ME-104',
    name: 'Elegant Calligraphy Script Monogram',
    price: '₹349',
    category: 'Name',
    image_url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&h=1000&q=85',
    description: 'Delicate cursive script personalized monogram for wedding handkerchiefs, bespoke shirt cuffs, baby blankets, or gifting linens.',
    properties: {
      fabric: 'Fine Cotton, Linen & Satin',
      work_type: 'Single-Needle Satin Script Embroidery',
      neck_style: 'Corner / Cuff Monogram placement',
      stitch_density: 'Fine Needle 75/11 Threading',
      turnaround: '24 Hours'
    }
  },
  {
    id: 'des-5',
    design_number: 'ME-105',
    name: 'Royal Organza Saree Sleeve Motif',
    price: '₹1,799',
    category: 'Saree',
    image_url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&h=800&q=85',
    description: 'Weightless floral butti sprays and scalloped zari border tailored specifically for sheer organza and tissue silk sarees.',
    properties: {
      fabric: 'Organza, Tissue Silk, Net & Chiffon',
      work_type: 'Micro-Zari & Water Soluble Backing Stitch',
      neck_style: 'Saree Pallu Edge & Border Panels',
      stitch_density: 'Featherlight Airy Pattern',
      turnaround: '2 Days'
    }
  },
  {
    id: 'des-6',
    design_number: 'ME-106',
    name: 'Double-Bordered Zari Pallu Motif',
    price: '₹2,199',
    category: 'Saree',
    image_url: 'https://images.unsplash.com/photo-1572087552449-d82167336021?auto=format&fit=crop&w=800&h=800&q=85',
    description: 'Traditional temple motif combined with dual geometric zari lines. Designed to replicate handloom Kanchipuram weaving precision.',
    properties: {
      fabric: 'Kanchi Pattu, Soft Silk & Banarasi Silk',
      work_type: 'Multi-head Gold & Copper Zari Weave',
      neck_style: 'Heavy Pallu & Pleat Accents',
      stitch_density: 'High Density Gold Cord Weave',
      turnaround: '3 Days'
    }
  },
  {
    id: 'des-7',
    design_number: 'ME-107',
    name: 'Royal Peacock Motif Bridal Blouse',
    price: '₹2,899',
    category: 'Bridal',
    image_url: 'https://images.unsplash.com/photo-1590075865003-e48277adc558?auto=format&fit=crop&w=800&h=950&q=85',
    description: 'Full bridal back and front-neck layout crowned with twin dancing peacocks, studded with micro stones and raised thread padding.',
    properties: {
      fabric: 'Pure Silk, Velvet & Brocade',
      work_type: '3D Padded Zardosi & Stone Encrusting',
      neck_style: 'Sweetheart Neck Front & Pot-neck Back',
      stitch_density: 'Master Artisan Grade (95,000+ Stitches)',
      turnaround: '3 - 4 Days'
    }
  },
  {
    id: 'des-8',
    design_number: 'ME-108',
    name: 'Minimal Geometric Neck Embroidery',
    price: '₹999',
    category: 'Blouse',
    image_url: 'https://images.unsplash.com/photo-1558244661-d248897f7bc4?auto=format&fit=crop&w=800&h=800&q=85',
    description: 'Subtle, understated chevron and bead line work that flatters contemporary festive and office-wear ethnic blouses.',
    properties: {
      fabric: 'Cotton Silk, Linen & Khadi',
      work_type: 'Linear Running Stitch & Tiny Mirror Accents',
      neck_style: 'Boat Neck & V-Neck Friendly',
      stitch_density: 'Lightweight Daily-Wear Friendly',
      turnaround: '1 - 2 Days'
    }
  }
];

const LOCAL_STORAGE_KEY = 'magic_embroidery_designs';

/**
 * Get stored local mock designs or default initial designs
 */
export function getLocalDesigns() {
  if (typeof window === 'undefined') return initialDesigns;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed reading designs from localStorage:', err);
  }
  return initialDesigns;
}

/**
 * Save designs array to local storage
 */
export function setLocalDesigns(designs) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(designs));
  } catch (err) {
    console.warn('Failed writing designs to localStorage:', err);
  }
}

/**
 * Fetch all designs: tries Supabase first (designs table, then gallery fallback),
 * then falls back to local designs.
 */
export async function fetchAllDesigns() {
  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Try 'designs' table
      const { data, error } = await supabase
        .from('designs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Map database records into standardized design objects
        return data.map((item, idx) => ({
          id: String(item.id || idx + 1),
          design_number: item.design_number || `ME-${100 + (idx + 1)}`,
          name: item.name || item.caption || 'Custom Embroidery Design',
          price: item.price ? (String(item.price).startsWith('₹') ? item.price : `₹${item.price}`) : '₹1,499',
          category: item.category || 'Blouse',
          image_url: item.image_url,
          description: item.description || item.caption || 'Exquisite computer-tailored digital embroidery design.',
          properties: typeof item.properties === 'object' && item.properties !== null
            ? item.properties
            : {
                fabric: item.fabric || 'Silk & Cotton Blends',
                work_type: item.work_type || 'Computer Zari & Thread',
                neck_style: item.neck_style || 'Custom Neckline',
                stitch_density: item.stitch_density || 'High-Density Digital Stitch',
                turnaround: item.turnaround || '2 - 3 Days'
              },
          created_at: item.created_at
        }));
      }

      // 2. Fallback to 'gallery' table if 'designs' table doesn't exist yet
      const { data: galleryData, error: galleryError } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (!galleryError && galleryData && galleryData.length > 0) {
        return galleryData.map((item, idx) => ({
          id: String(item.id || idx + 1),
          design_number: item.design_number || `ME-${101 + idx}`,
          name: item.caption || `Embroidery Pattern #${101 + idx}`,
          price: item.price || '₹1,499',
          category: item.category || 'Blouse',
          image_url: item.image_url,
          description: item.caption || 'Digital high-precision computer embroidery tailored to your measurements.',
          properties: {
            fabric: 'Silk, Cotton & Georgette',
            work_type: 'Digital Zari & Thread',
            neck_style: 'Custom Pattern Fit',
            stitch_density: 'High-Density Digital Stitch',
            turnaround: '2 - 3 Days'
          },
          created_at: item.created_at
        }));
      }
    } catch (err) {
      console.warn('Supabase designs fetch encountered an error, using local catalog:', err);
    }
  }

  // Offline / Mock mode fallback
  return getLocalDesigns();
}

/**
 * Add a new design: uploads to Supabase (if available) or persists to localStorage.
 */
export async function createDesign({
  design_number,
  name,
  price,
  category,
  description,
  properties,
  imageFile,
  imageUrl
}) {
  let finalImageUrl = imageUrl || '';

  // Formatted price
  const formattedPrice = price
    ? (String(price).trim().startsWith('₹') ? String(price).trim() : `₹${String(price).trim()}`)
    : '₹1,499';

  const standardizedNumber = (design_number && design_number.trim())
    ? (design_number.trim().toUpperCase().startsWith('ME-') ? design_number.trim().toUpperCase() : `ME-${design_number.trim().toUpperCase()}`)
    : `ME-${Math.floor(100 + Math.random() * 900)}`;

  if (isSupabaseConfigured && supabase) {
    try {
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${standardizedNumber.toLowerCase()}-${Date.now()}.${fileExt}`;

        // Attempt upload to 'designs' bucket, fallback to 'gallery'
        let bucket = 'designs';
        let uploadRes = await supabase.storage.from(bucket).upload(fileName, imageFile);
        if (uploadRes.error) {
          bucket = 'gallery';
          uploadRes = await supabase.storage.from(bucket).upload(fileName, imageFile);
        }

        if (uploadRes.error) throw uploadRes.error;

        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
        finalImageUrl = publicUrlData?.publicUrl;
      }

      // Try inserting into designs table
      const newRecord = {
        design_number: standardizedNumber,
        name,
        price: formattedPrice,
        category,
        image_url: finalImageUrl,
        description,
        properties
      };

      const { data, error } = await supabase.from('designs').insert([newRecord]).select();
      if (error) {
        // Fallback to gallery table if designs table not yet migrated in Supabase
        const { error: galleryErr } = await supabase.from('gallery').insert([{
          image_url: finalImageUrl,
          category,
          caption: `${standardizedNumber} - ${name} (${formattedPrice})`
        }]);
        if (galleryErr) throw galleryErr;
      }

      return {
        id: data?.[0]?.id || String(Date.now()),
        design_number: standardizedNumber,
        name,
        price: formattedPrice,
        category,
        image_url: finalImageUrl,
        description,
        properties
      };
    } catch (err) {
      console.error('Supabase create design error, saving to local store:', err);
    }
  }

  // Local / Mock fallback persistence
  if (imageFile && !finalImageUrl) {
    finalImageUrl = URL.createObjectURL(imageFile);
  }

  const localNewItem = {
    id: `des-${Date.now()}`,
    design_number: standardizedNumber,
    name,
    price: formattedPrice,
    category: category || 'Blouse',
    image_url: finalImageUrl,
    description: description || 'Exquisite bespoke computer embroidery pattern.',
    properties: properties || {
      fabric: 'Raw Silk, Brocade & Cotton',
      work_type: 'Digital Zari & Resham Stitch',
      neck_style: 'Custom Pattern Fit',
      stitch_density: 'High-Density Digital Stitch',
      turnaround: '2 - 3 Days'
    },
    created_at: new Date().toISOString()
  };

  const existing = getLocalDesigns();
  const updated = [localNewItem, ...existing];
  setLocalDesigns(updated);
  return localNewItem;
}

/**
 * Delete a design by ID
 */
export async function deleteDesignItem(id) {
  if (isSupabaseConfigured && supabase) {
    try {
      // Try designs table
      await supabase.from('designs').delete().eq('id', id);
      // Also try gallery table
      await supabase.from('gallery').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete error:', err);
    }
  }

  // Update local storage
  const existing = getLocalDesigns();
  const updated = existing.filter(item => String(item.id) !== String(id));
  setLocalDesigns(updated);
  return updated;
}
