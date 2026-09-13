import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Lock, LogOut, CheckCircle, Clock, Trash2, Plus, Sparkles, AlertTriangle, RefreshCw, Loader, UserPlus } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import SEO from '../components/SEO';

// Mock DB states in case Supabase is offline/mock is activated
const mockOrders = [
  { id: '1', name: 'Anjali Devi', phone: '9840123456', service: 'Bridal Blouse Embroidery', description: 'Heavy gold beads with peacock border back neck design', delivery_date: '2026-06-15', address: '12, Gandhi Street, Selaiyur, Chennai 73', status: 'Pending', created_at: new Date().toISOString() },
  { id: '2', name: 'Fatima Begum', phone: '9940345678', service: 'Burka Alteration & Embroidery', description: 'Silver cuffs border stitch and length shortening', delivery_date: '2026-06-08', address: 'Abaya Mansion, Tambaram, Chennai 45', status: 'Completed', created_at: new Date().toISOString() }
];

const mockGallery = [
  { id: '1', image_url: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=300&h=300&q=80', category: 'Bridal', caption: 'Classic Ruby Red Bridal Back' },
  { id: '2', image_url: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=300&h=300&q=80', category: 'Blouse', caption: 'Emerald Sleeve Floral Borders' }
];

export default function Admin() {
  const [session, setSession] = useState(() => {
    if (!isSupabaseConfigured && typeof window !== 'undefined') {
      const mockUser = localStorage.getItem('mockAdminSession');
      return mockUser ? { user: { email: mockUser } } : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [activeTab, setActiveTab] = useState('orders'); // orders | gallery | services

  // Dashboard Data States (initialized with mock data if Supabase unconfigured)
  const [orders, setOrders] = useState(() => !isSupabaseConfigured ? mockOrders : []);
  const [gallery, setGallery] = useState(() => !isSupabaseConfigured ? mockGallery : []);
  const [ordersLoading, setOrdersLoading] = useState(() => !isSupabaseConfigured ? false : true);
  const [galleryLoading, setGalleryLoading] = useState(() => !isSupabaseConfigured ? false : true);

  // Form states for gallery uploads
  const [newImage, setNewImage] = useState(null);
  const [newCategory, setNewCategory] = useState('Blouse');
  const [newCaption, setNewCaption] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Check auth session
  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setOrders(data || []);
      } catch {
        toast.error("Failed to load live orders, using mock database.");
        setOrders(mockOrders);
      }
    } else {
      setOrders(mockOrders);
    }
    setOrdersLoading(false);
  };

  const fetchGallery = async () => {
    setGalleryLoading(true);
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setGallery(data || []);
      } catch {
        setGallery(mockGallery);
      }
    } else {
      setGallery(mockGallery);
    }
    setGalleryLoading(false);
  };

  // Fetch Dashboard content asynchronously when session is authenticated
  useEffect(() => {
    let ignore = false;

    if (session && isSupabaseConfigured) {
      Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('gallery').select('*').order('created_at', { ascending: false })
      ]).then(([ordersRes, galleryRes]) => {
        if (!ignore) {
          if (ordersRes.data) setOrders(ordersRes.data);
          if (galleryRes.data) setGallery(galleryRes.data);
          setOrdersLoading(false);
          setGalleryLoading(false);
        }
      }).catch(() => {
        if (!ignore) {
          setOrders(mockOrders);
          setGallery(mockGallery);
          setOrdersLoading(false);
          setGalleryLoading(false);
        }
      });
    }

    return () => {
      ignore = true;
    };
  }, [session]);

  // Sign In handler
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    const normalizedEmail = email.includes('@')
      ? email.trim().toLowerCase()
      : `${email.trim().toLowerCase()}@magic.com`;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
        if (error) throw error;
        toast.success("Successfully Logged In!");
      } catch (err) {
        if (err.message?.toLowerCase().includes("not confirmed")) {
          toast.error("Account created, but email not confirmed! In Supabase Dashboard > Authentication > Users, click 'Confirm User'.", { duration: 6000 });
        } else {
          toast.error(err.message || "Invalid credentials.");
        }
      }
    } else {
      // Mock Login bypass
      if (
        (normalizedEmail === 'admin@magic.com' && password === 'magicadmin') ||
        (normalizedEmail === 'shakena@magic.com' && password === 'Rasha@12345')
      ) {
        localStorage.setItem('mockAdminSession', normalizedEmail);
        setSession({ user: { email: normalizedEmail } });
        toast.success("Logged in to administration panel!");
      } else {
        toast.error("Invalid credentials.");
      }
    }
    setLoading(false);
  };

  // Sign Up handler
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    const normalizedEmail = email.includes('@')
      ? email.trim().toLowerCase()
      : `${email.trim().toLowerCase()}@magic.com`;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password: password,
          options: {
            data: {
              display_name: email.split('@')[0],
              role: 'admin'
            }
          }
        });
        if (error) throw error;

        if (data?.session) {
          toast.success("Admin account registered and logged in!");
          setSession(data.session);
        } else {
          toast.success("Account created! In Supabase Dashboard > Auth > Users, confirm user or sign in directly.", { duration: 7000 });
          setAuthMode('signin');
        }
      } catch (err) {
        toast.error(err.message || "Failed to create account.");
      }
    } else {
      localStorage.setItem('mockAdminSession', normalizedEmail);
      setSession({ user: { email: normalizedEmail } });
      toast.success("Admin account created (mock mode) and logged in!");
    }
    setLoading(false);
  };

  // Sign Out handler
  const handleSignOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('mockAdminSession');
      setSession(null);
    }
    toast.success("Logged out successfully.");
  };

  // Switch Order Status
  const handleUpdateStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Pending' ? 'In Progress' : currentStatus === 'In Progress' ? 'Completed' : 'Pending';
    
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status: nextStatus })
          .eq('id', id);
        if (error) throw error;
        toast.success(`Order status updated to ${nextStatus}!`);
        fetchOrders();
      } catch {
        toast.error("Failed to update status.");
      }
    } else {
      // Mock update
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus } : o));
      toast.success(`Order status updated to ${nextStatus} (mocked)!`);
    }
  };

  // Delete Gallery Item
  const handleDeleteGallery = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gallery item?")) return;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('gallery')
          .delete()
          .eq('id', id);
        if (error) throw error;
        toast.success("Deleted image from portfolio!");
        fetchGallery();
      } catch {
        toast.error("Failed to delete image.");
      }
    } else {
      setGallery(prev => prev.filter(g => g.id !== id));
      toast.success("Deleted image from portfolio (mocked)!");
    }
  };

  // Handle local gallery photo selection
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewImage(file);
  };

  // Upload New Gallery Item
  const handleAddGallery = async (e) => {
    e.preventDefault();
    if (!newImage) {
      toast.error("Please select an image file first.");
      return;
    }

    setUploadingImage(true);
    try {
      let finalUrl = "";

      if (isSupabaseConfigured) {
        const fileExt = newImage.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        // Upload to gallery bucket
        const { error: uploadErr } = await supabase.storage
          .from('gallery')
          .upload(filePath, newImage);
        if (uploadErr) throw uploadErr;

        const { data: publicUrlData } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);
        finalUrl = publicUrlData?.publicUrl;

        // Insert to gallery DB
        const { error: dbErr } = await supabase.from('gallery').insert([
          {
            image_url: finalUrl,
            category: newCategory,
            caption: newCaption
          }
        ]);
        if (dbErr) throw dbErr;
        toast.success("Added image to live portfolio!");
        fetchGallery();
      } else {
        // Mock upload
        finalUrl = URL.createObjectURL(newImage);
        const newItem = {
          id: String(Date.now()),
          image_url: finalUrl,
          category: newCategory,
          caption: newCaption
        };
        setGallery(prev => [newItem, ...prev]);
        toast.success("Added image to portfolio (mocked)!");
      }

      // Reset fields
      setNewImage(null);
      setNewCaption('');
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Login Panel View
  if (!session) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center pt-24 pb-20 px-4">
        <SEO 
          title="Admin Login" 
          description="Sign in to the Magic Embroidery tailor administration dashboard to manage client embroidery orders and upload design gallery files." 
        />
        <div className="w-full max-w-md bg-brand-white border-2 border-brand-accent/30 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-brand-primary" />
          
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="bg-brand-primary/10 p-4 rounded-3xl text-brand-primary mb-3">
              {authMode === 'signin' ? <Lock className="w-8 h-8" /> : <UserPlus className="w-8 h-8" />}
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-secondary">
              {authMode === 'signin' ? "Admin Login" : "Register Admin"}
            </h1>
            <p className="text-xs font-semibold text-brand-textDark/60 mt-2">
              Magic Embroidery Tailor Console
            </p>
          </div>

          {/* Environmental Mock Warning Notice */}
          {!isSupabaseConfigured && (
            <div className="bg-amber-500/10 border border-amber-500/35 text-amber-800 rounded-2xl p-4 text-xs font-semibold leading-relaxed mb-6 flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-950 block mb-0.5">Mock Mode Active</span>
                Supabase keys are unconfigured. You can log in using: <br />
                <span className="bg-amber-500/20 px-1 py-0.5 rounded text-amber-950">admin@magic.com</span> with password <span className="bg-amber-500/20 px-1 py-0.5 rounded text-amber-950">magicadmin</span>, or sign up a new mock user.
              </div>
            </div>
          )}

          {/* Auth Mode Toggle Tabs */}
          <div className="flex bg-brand-cardBg p-1 rounded-2xl border border-brand-accent/25 mb-6">
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                authMode === 'signin'
                  ? 'bg-brand-primary text-brand-white shadow-sm'
                  : 'text-brand-textDark/70 hover:text-brand-textDark'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                authMode === 'signup'
                  ? 'bg-brand-primary text-brand-white shadow-sm'
                  : 'text-brand-textDark/70 hover:text-brand-textDark'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={authMode === 'signin' ? handleSignIn : handleSignUp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider">
                {authMode === 'signin' ? "Username or Email" : "New Admin Username or Email"}
              </label>
              <input
                type="text"
                placeholder="Shakena or admin@magic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark"
              />
            </div>

            {authMode === 'signup' && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-brand-primary hover:bg-brand-primary/95 text-brand-white font-body font-bold text-sm py-3.5 rounded-full transition-transform hover:scale-105 shadow-md flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : authMode === 'signin' ? (
                "Sign In to Console"
              ) : (
                "Create Admin User"
              )}
            </button>

            <div className="text-center mt-2">
              {authMode === 'signin' ? (
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-xs font-semibold text-brand-primary hover:underline"
                >
                  Need to register a new admin? <span className="font-bold">Sign Up</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="text-xs font-semibold text-brand-primary hover:underline"
                >
                  Already have an account? <span className="font-bold">Sign In</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard Logged In View
  return (
    <div className="w-full pt-24 pb-20 min-h-screen">
      <SEO 
        title="Admin Console Dashboard" 
        description="Magic Embroidery Tailor administration console. View and manage digital blouse designs, zardosi, sarees, name monograms, and uniform logo requests." 
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Dashboard panel bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-brand-white border border-brand-accent/25 rounded-3xl p-6 mb-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-brand-primary/10 p-2.5 rounded-2xl text-brand-primary">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-brand-secondary leading-none">
                Admin Console
              </h1>
              <span className="text-xs font-semibold text-brand-textDark/60 block mt-1">
                {session?.user?.email} {!isSupabaseConfigured && "(Mock Local Sandbox)"}
              </span>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-brand-cardBg hover:bg-brand-accent/20 text-brand-textDark font-body font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-full border border-brand-accent/15 transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Dashboard Content Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Side Tabs Bar (Desktop) / Top Tabs (Mobile) */}
          <div className="lg:col-span-1 flex flex-row lg:flex-col gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 lg:flex-none text-left font-body font-bold text-sm px-6 py-4 rounded-2xl transition-all ${
                activeTab === 'orders'
                  ? 'bg-brand-primary text-brand-white shadow-md shadow-brand-primary/20 scale-[1.02]'
                  : 'bg-brand-white text-brand-textDark border border-brand-accent/15 hover:bg-brand-cardBg'
              }`}
            >
              📋 Orders Queue ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex-1 lg:flex-none text-left font-body font-bold text-sm px-6 py-4 rounded-2xl transition-all ${
                activeTab === 'gallery'
                  ? 'bg-brand-primary text-brand-white shadow-md shadow-brand-primary/20 scale-[1.02]'
                  : 'bg-brand-white text-brand-textDark border border-brand-accent/15 hover:bg-brand-cardBg'
              }`}
            >
              🖼️ Upload Designs ({gallery.length})
            </button>
          </div>

          {/* Active Tab Viewport */}
          <div className="lg:col-span-3">
            
            {/* VIEW 1: ORDERS QUEUE */}
            {activeTab === 'orders' && (
              <div className="bg-brand-white border border-brand-accent/25 rounded-[2.5rem] p-6 shadow-sm">
                <div className="flex justify-between items-center border-b border-brand-accent/15 pb-4 mb-6">
                  <h3 className="font-heading text-xl font-bold text-brand-secondary">Orders Ingestion Queue</h3>
                  <button 
                    onClick={fetchOrders}
                    className="p-2 rounded-xl text-brand-textDark hover:bg-brand-cardBg transition-colors"
                    title="Refresh orders queue"
                  >
                    <RefreshCw className={`w-4 h-4 ${ordersLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {ordersLoading ? (
                  <div className="flex items-center justify-center py-12 text-brand-primary">
                    <Loader className="w-8 h-8 animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 text-brand-textDark/50 font-semibold font-body text-sm">
                    No orders registered in the system yet.
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {orders.map((ord) => (
                      <div 
                        key={ord.id}
                        className="bg-brand-cardBg border border-brand-accent/20 rounded-3xl p-6 hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start"
                      >
                        
                        {/* Reference Image preview */}
                        {ord.image_url && (
                          <div className="w-24 h-24 rounded-2xl overflow-hidden border border-brand-accent/30 shadow-inner flex-shrink-0">
                            <img 
                              src={ord.image_url} 
                              alt="Order Reference Detail" 
                              className="w-full h-full object-cover cursor-zoom-in"
                              onClick={() => window.open(ord.image_url, '_blank')}
                            />
                          </div>
                        )}

                        {/* Order info details */}
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <h4 className="font-heading text-lg font-bold text-brand-secondary leading-none">{ord.name}</h4>
                            <span 
                              onClick={() => handleUpdateStatus(ord.id, ord.status)}
                              className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border cursor-pointer select-none transition-all hover:scale-105 flex items-center gap-1 ${
                                ord.status === 'Completed'
                                  ? 'bg-green-100 text-green-700 border-green-300'
                                  : ord.status === 'In Progress'
                                    ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                    : 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                              }`}
                            >
                              {ord.status === 'Completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {ord.status}
                            </span>
                          </div>

                          <p className="font-body text-xs font-bold text-brand-textDark/60 leading-none">
                            📞 Phone: <a href={`tel:${ord.phone}`} className="underline hover:text-brand-primary">{ord.phone}</a> | 🧵 {ord.service}
                          </p>
                          
                          <p className="font-body text-sm leading-relaxed text-brand-textDark/85 font-medium mt-1">
                            "{ord.description}"
                          </p>

                          <div className="border-t border-brand-accent/15 pt-2 mt-2 flex flex-col sm:flex-row justify-between text-[10px] text-brand-textDark/50 font-bold gap-2">
                            <span>Delivery Target: {ord.delivery_date}</span>
                            <span className="leading-tight text-right sm:max-w-xs">Courier Address: {ord.address}</span>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* VIEW 2: PORTFOLIO UPLOAD */}
            {activeTab === 'gallery' && (
              <div className="flex flex-col gap-8">
                
                {/* Image Upload Card */}
                <div className="bg-brand-white border border-brand-accent/25 rounded-[2.5rem] p-6 shadow-sm">
                  <h3 className="font-heading text-xl font-bold text-brand-secondary border-b border-brand-accent/15 pb-4 mb-6">
                    Add New Design to Live Gallery
                  </h3>
                  
                  <form onSubmit={handleAddGallery} className="flex flex-col gap-5">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      
                      {/* Photo Selector */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider">Select Design Photo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoSelect}
                          required
                          className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3 font-body text-xs font-semibold"
                        />
                      </div>

                      {/* Category Selector */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider">Category Tag</label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3 font-body text-sm font-semibold"
                        >
                          <option value="Blouse">Blouse</option>
                          <option value="Bridal">Bridal</option>
                          <option value="Saree">Saree</option>
                          <option value="Logo">Logo</option>
                          <option value="Name">Name</option>
                        </select>
                      </div>

                    </div>

                    {/* Caption description */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider">Short Caption / Description</label>
                      <input
                        type="text"
                        placeholder="e.g., Majestic Peacock Back-neck embroidery layout..."
                        value={newCaption}
                        onChange={(e) => setNewCaption(e.target.value)}
                        required
                        className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3.5 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={uploadingImage}
                      className="bg-brand-primary hover:bg-brand-primary/95 text-brand-white font-body font-bold text-sm py-3.5 rounded-full shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform mt-2"
                    >
                      {uploadingImage ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Uploading image to cloud...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" /> Publish to Public Gallery
                        </>
                      )}
                    </button>

                  </form>
                </div>

                {/* Gallery List Management Card */}
                <div className="bg-brand-white border border-brand-accent/25 rounded-[2.5rem] p-6 shadow-sm">
                  <h3 className="font-heading text-xl font-bold text-brand-secondary border-b border-brand-accent/15 pb-4 mb-6">
                    Manage Existing Portfolio ({gallery.length})
                  </h3>

                  {galleryLoading ? (
                    <div className="flex items-center justify-center py-8 text-brand-primary">
                      <Loader className="w-8 h-8 animate-spin" />
                    </div>
                  ) : gallery.length === 0 ? (
                    <div className="text-center py-8 text-brand-textDark/50 font-semibold font-body text-sm">
                      No images in the portfolio yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {gallery.map((g) => (
                        <div 
                          key={g.id}
                          className="bg-brand-cardBg border border-brand-accent/20 rounded-2xl p-2.5 relative flex flex-col gap-2 shadow-inner group"
                        >
                          <div className="aspect-square rounded-xl overflow-hidden border border-brand-accent/30 relative">
                            <img src={g.image_url} alt="" className="w-full h-full object-cover" />
                            
                            {/* Delete Overlay Button */}
                            <button
                              onClick={() => handleDeleteGallery(g.id)}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-brand-white p-2 rounded-full shadow-md transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete from gallery"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="px-1 text-[10px] font-semibold flex flex-col">
                            <span className="text-brand-primary uppercase tracking-widest font-bold font-heading leading-none">{g.category}</span>
                            <span className="text-brand-textDark/70 mt-1 line-clamp-1 leading-tight">{g.caption}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
