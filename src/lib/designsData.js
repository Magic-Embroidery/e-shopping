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
    category: 'Saree and Kurthi',
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
    category: 'Saree and Kurthi',
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
 * Helper to parse and standardize design records from Supabase (designs or gallery table)
 * and local storage. Intelligently synchronizes prices, extracts unique design numbers,
 * and cleans design titles.
 */
export function parseDesignRecord(item, idx = 0) {
  if (!item) return null;

  let designNumber = item.design_number ? String(item.design_number).trim() : '';
  let price = item.price ? String(item.price).trim() : '';
  let name = item.name ? String(item.name).trim() : (item.caption ? String(item.caption).trim() : '');
  let description = item.description ? String(item.description).trim() : (item.caption ? String(item.caption).trim() : '');

  // 1. Price extraction from name / caption / description if item.price is missing or default
  // Matches expressions in parentheses like (₹1500), (₹400 Onwards), (₹500 - 2000), (₹400-1000), (₹1,499), (500 Onwards)
  const priceRegex = /\((?:₹|Rs\.?|INR)?\s*([0-9,]+(?:\s*-\s*[0-9,]+)?(?:\s*[a-zA-Z]+)?)\)/i;
  
  if (!price || price === '₹1,499') {
    const rawMatch = name.match(priceRegex) || (item.caption && String(item.caption).match(priceRegex)) || description.match(priceRegex);
    if (rawMatch && rawMatch[1]) {
      const extracted = rawMatch[1].trim();
      price = extracted.startsWith('₹') ? extracted : `₹${extracted}`;
    }
  }

  // 2. Clean trailing price in parentheses from name
  name = name.replace(priceRegex, '').trim();

  // 3. Extract and normalize design number from name or caption if missing
  // Matches patterns like "ME-ME1002 - ", "ME-1002: ", "ME1002 - ", "#ME-101 - "
  if (!designNumber) {
    const numMatch = name.match(/^(?:#\s*)?(?:ME-?)+([A-Za-z0-9]+)(?:\s*[-–]\s*|\s*:\s*)/i) ||
                     (item.caption && String(item.caption).match(/^(?:#\s*)?(?:ME-?)+([A-Za-z0-9]+)(?:\s*[-–]\s*|\s*:\s*)/i));
    if (numMatch && numMatch[1]) {
      designNumber = `ME-${numMatch[1].toUpperCase()}`;
      name = name.slice(numMatch[0].length).trim();
    }
  }

  // 4. Normalize any duplicate prefixes in design number (e.g. ME-ME1002 -> ME-1002, ##ME-101 -> ME-101)
  if (designNumber) {
    let cleanCode = designNumber.replace(/^(?:#\s*)?(?:ME-?)+/i, '');
    cleanCode = cleanCode.replace(/^ME/i, '');
    designNumber = cleanCode ? `ME-${cleanCode.toUpperCase()}` : `ME-${100 + (idx + 1)}`;
  } else {
    designNumber = `ME-${100 + (idx + 1)}`;
  }

  // 5. Clean any residual leading "ME-... - " from name
  name = name.replace(/^(?:#\s*)?(?:ME-?)+[A-Za-z0-9]+(?:\s*[-–]\s*|\s*:\s*)/i, '').trim();
  if (!name) {
    name = `Embroidery Pattern ${designNumber}`;
  }

  // 6. Ensure price has ₹ prefix and a sensible fallback if empty
  if (!price) {
    price = '₹400 Onwards';
  } else if (!price.startsWith('₹')) {
    price = `₹${price}`;
  }

  // 7. Clean description if it is just a duplicate of caption
  if (item.caption && (description === item.caption || description.includes(name))) {
    description = `Digital computer embroidery design tailored for ${item.category || 'ethnic'} attire with precision zari & thread finish.`;
  } else if (!description) {
    description = 'High-precision digital embroidery design crafted to perfection.';
  }

  // 8. Properties
  const properties = (typeof item.properties === 'object' && item.properties !== null)
    ? item.properties
    : {
        fabric: item.fabric || 'Silk, Raw Silk & Cotton',
        work_type: item.work_type || 'Digital Zari & Resham Stitch',
        neck_style: item.neck_style || 'Custom Neck & Sleeves',
        stitch_density: item.stitch_density || 'High Density (50,000+ Stitches)',
        turnaround: item.turnaround || '2 - 3 Days'
      };

  let category = item.category ? String(item.category).trim() : 'Blouse';
  if (category.toLowerCase() === 'saree') {
    category = 'Saree and Kurthi';
  }

  return {
    id: String(item.id || idx + 1),
    design_number: designNumber,
    name,
    price,
    category,
    image_url: item.image_url,
    description,
    properties,
    created_at: item.created_at
  };
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
        return data.map((item, idx) => parseDesignRecord(item, idx));
      }

      // 2. Fallback to 'gallery' table if 'designs' table doesn't exist yet
      const { data: galleryData, error: galleryError } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (!galleryError && galleryData && galleryData.length > 0) {
        return galleryData.map((item, idx) => parseDesignRecord(item, idx));
      }
    } catch (err) {
      console.warn('Supabase designs fetch encountered an error, using local catalog:', err);
    }
  }

  // Offline / Mock mode fallback
  return getLocalDesigns().map((item, idx) => parseDesignRecord(item, idx));
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

  // Clean design number - prevent double ME- prefix
  let cleanNum = (design_number || '').trim().replace(/^(?:#\s*)?(?:ME-?)+/i, '');
  cleanNum = cleanNum.replace(/^ME/i, '');
  const standardizedNumber = cleanNum
    ? `ME-${cleanNum.toUpperCase()}`
    : `ME-${Math.floor(100 + Math.random() * 900)}`;

  // Formatted price - preserve exact price entered by user
  const formattedPrice = (price && String(price).trim())
    ? (String(price).trim().startsWith('₹') ? String(price).trim() : `₹${String(price).trim()}`)
    : '₹499 Onwards';

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
        const { data: galleryData, error: galleryErr } = await supabase.from('gallery').insert([{
          image_url: finalImageUrl,
          category,
          caption: `${standardizedNumber} - ${name} (${formattedPrice})`
        }]).select();
        if (galleryErr) throw galleryErr;

        return parseDesignRecord(galleryData?.[0] || {
          id: String(Date.now()),
          image_url: finalImageUrl,
          category,
          caption: `${standardizedNumber} - ${name} (${formattedPrice})`
        });
      }

      return parseDesignRecord(data?.[0] || newRecord);
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
