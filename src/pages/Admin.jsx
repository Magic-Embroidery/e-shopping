import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Lock, LogOut, CheckCircle, Clock, Trash2, Plus, Sparkles, AlertTriangle, RefreshCw, Loader, UserPlus } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { fetchAllDesigns, createDesign, deleteDesignItem } from '../lib/designsData';
import SEO from '../components/SEO';

// Mock DB states in case Supabase is offline/mock is activated
const mockOrders = [
  { id: '1', name: 'Anjali Devi', phone: '9840123456', service: 'Bridal Blouse Embroidery', description: 'Heavy gold beads with peacock border back neck design', delivery_date: '2026-06-15', address: '12, Gandhi Street, Selaiyur, Chennai 73', status: 'Pending', created_at: new Date().toISOString() },
  { id: '2', name: 'Fatima Begum', phone: '9940345678', service: 'Burka Alteration & Embroidery', description: 'Silver cuffs border stitch and length shortening', delivery_date: '2026-06-08', address: 'Abaya Mansion, Tambaram, Chennai 45', status: 'Completed', created_at: new Date().toISOString() }
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
  const [activeTab, setActiveTab] = useState('orders'); // orders | designs

  // Dashboard Data States
  const [orders, setOrders] = useState(() => !isSupabaseConfigured ? mockOrders : []);
  const [designs, setDesigns] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(() => !isSupabaseConfigured ? false : true);
  const [designsLoading, setDesignsLoading] = useState(true);

  // Form states for design uploads
  const [newImage, setNewImage] = useState(null);
  const [newDesignNumber, setNewDesignNumber] = useState('');
  const [newDesignName, setNewDesignName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Blouse');
  const [newDescription, setNewDescription] = useState('');
  const [newFabric, setNewFabric] = useState('Raw Silk, Brocade & Silk Cotton');
  const [newWorkType, setNewWorkType] = useState('Digital Zardosi & Thread');
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

  const fetchDesigns = async () => {
    setDesignsLoading(true);
    try {
      const data = await fetchAllDesigns();
      setDesigns(data);
    } catch {
      toast.error("Failed to load designs.");
    } finally {
      setDesignsLoading(false);
    }
  };

  // Fetch Dashboard content asynchronously when session is authenticated
  useEffect(() => {
    let ignore = false;

    if (session) {
      const loadData = async () => {
        try {
          if (isSupabaseConfigured) {
            const ordersRes = await supabase.from('orders').select('*').order('created_at', { ascending: false });
            if (!ignore && ordersRes.data) setOrders(ordersRes.data);
          } else {
            if (!ignore) setOrders(mockOrders);
          }

          const designsData = await fetchAllDesigns();
          if (!ignore) setDesigns(designsData);
        } catch (e) {
          console.warn("Failed loading dashboard data:", e);
        } finally {
          if (!ignore) {
            setOrdersLoading(false);
            setDesignsLoading(false);
          }
        }
      };

      loadData();
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

  // Delete Design Item
  const handleDeleteDesign = async (id) => {
    if (!window.confirm("Are you sure you want to delete this design?")) return;

    try {
      await deleteDesignItem(id);
      setDesigns(prev => prev.filter(d => String(d.id) !== String(id)));
      toast.success("Design deleted from catalog!");
    } catch {
      toast.error("Failed to delete design.");
    }
  };

  // Handle local design photo selection
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewImage(file);
  };

  // Upload New Design Item
  const handleAddDesign = async (e) => {
    e.preventDefault();
    if (!newImage) {
      toast.error("Please select a design image file first.");
      return;
    }
    if (!newDesignName.trim()) {
      toast.error("Please provide a design name.");
      return;
    }

    setUploadingImage(true);
    try {
      const designNum = newDesignNumber.trim() || `ME-${100 + designs.length + 1}`;
      const created = await createDesign({
        design_number: designNum,
        name: newDesignName.trim(),
        price: newPrice.trim() || '₹1,499',
        category: newCategory,
        description: newDescription.trim() || 'Digital embroidery design pattern.',
        properties: {
          fabric: newFabric.trim() || 'Silk & Cotton Blends',
          work_type: newWorkType.trim() || 'Digital Zari & Thread',
          neck_style: 'Custom Pattern Fit',
          stitch_density: 'High Density (50,000+ Stitches)',
          turnaround: '2 - 3 Days'
        },
        imageFile: newImage
      });

      setDesigns(prev => [created, ...prev]);
      toast.success(`Design ${created.design_number} added to catalog!`);

      // Reset fields
      setNewImage(null);
      setNewDesignNumber('');
      setNewDesignName('');
      setNewPrice('');
      setNewDescription('');
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload design.");
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
              onClick={() => setActiveTab('designs')}
              className={`flex-1 lg:flex-none text-left font-body font-bold text-sm px-6 py-4 rounded-2xl transition-all ${
                activeTab === 'designs'
                  ? 'bg-brand-primary text-brand-white shadow-md shadow-brand-primary/20 scale-[1.02]'
                  : 'bg-brand-white text-brand-textDark border border-brand-accent/15 hover:bg-brand-cardBg'
              }`}
            >
              🖼️ Designs Catalog ({designs.length})
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

            {/* VIEW 2: DESIGNS CATALOG & UPLOADS */}
            {activeTab === 'designs' && (
              <div className="flex flex-col gap-8">
                
                {/* Design Upload Card */}
                <div className="bg-brand-white border border-brand-accent/25 rounded-[2.5rem] p-6 shadow-sm">
                  <h3 className="font-heading text-xl font-bold text-brand-secondary border-b border-brand-accent/15 pb-4 mb-6">
                    Add New Design to Public Catalog
                  </h3>
                  
                  <form onSubmit={handleAddDesign} className="flex flex-col gap-5">
                    
                    {/* Row 1: Design Code & Price */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider">
                          Unique Design Number
                        </label>
                        <input
                          type="text"
                          placeholder={`e.g. ME-${100 + designs.length + 1}`}
                          value={newDesignNumber}
                          onChange={(e) => setNewDesignNumber(e.target.value)}
                          className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3.5 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider">
                          Price (₹)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. ₹1,800 or 1800"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          required
                          className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3.5 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark"
                        />
                      </div>
                    </div>

                    {/* Row 2: Name & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider">
                          Design Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Royal Peacock Zardosi Back"
                          value={newDesignName}
                          onChange={(e) => setNewDesignName(e.target.value)}
                          required
                          className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3.5 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider">Category</label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3.5 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark"
                        >
                          <option value="Blouse">Blouse</option>
                          <option value="Bridal">Bridal</option>
                          <option value="Saree">Saree</option>
                          <option value="Logo">Logo</option>
                          <option value="Name">Name</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 3: Photo Selector */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider">Select Design Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        required
                        className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3 font-body text-xs font-semibold"
                      />
                      {newImage && (
                        <span className="text-[11px] text-brand-primary font-bold">
                          Selected file: {newImage.name}
                        </span>
                      )}
                    </div>

                    {/* Row 4: Fabric & Work Type Properties */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider">Fabric Compatibility</label>
                        <input
                          type="text"
                          value={newFabric}
                          onChange={(e) => setNewFabric(e.target.value)}
                          placeholder="e.g. Raw Silk, Brocade, Silk Cotton"
                          className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3.5 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider">Stitching Work Type</label>
                        <input
                          type="text"
                          value={newWorkType}
                          onChange={(e) => setNewWorkType(e.target.value)}
                          placeholder="e.g. Digital Zardosi & Thread"
                          className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3.5 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-brand-textDark uppercase tracking-wider">Design Description & Motifs</label>
                      <textarea
                        rows="2"
                        placeholder="e.g., Majestic Peacock Back-neck embroidery layout with dense gold zari..."
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        required
                        className="bg-brand-cardBg border border-brand-accent/35 rounded-2xl px-4 py-3.5 font-body text-sm font-semibold focus:outline-none focus:border-brand-primary text-brand-textDark resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={uploadingImage}
                      className="bg-brand-primary hover:bg-brand-primary/95 text-brand-white font-body font-bold text-sm py-3.5 rounded-full shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform mt-2"
                    >
                      {uploadingImage ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Uploading design to catalog...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" /> Publish Design to Catalog
                        </>
                      )}
                    </button>

                  </form>
                </div>

                {/* Designs Catalog Management Card */}
                <div className="bg-brand-white border border-brand-accent/25 rounded-[2.5rem] p-6 shadow-sm">
                  <div className="flex justify-between items-center border-b border-brand-accent/15 pb-4 mb-6">
                    <h3 className="font-heading text-xl font-bold text-brand-secondary">
                      Active Designs Catalog ({designs.length})
                    </h3>
                    <button 
                      onClick={fetchDesigns}
                      className="p-2 rounded-xl text-brand-textDark hover:bg-brand-cardBg transition-colors"
                      title="Refresh designs"
                    >
                      <RefreshCw className={`w-4 h-4 ${designsLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {designsLoading ? (
                    <div className="flex items-center justify-center py-8 text-brand-primary">
                      <Loader className="w-8 h-8 animate-spin" />
                    </div>
                  ) : designs.length === 0 ? (
                    <div className="text-center py-8 text-brand-textDark/50 font-semibold font-body text-sm">
                      No designs in the catalog yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {designs.map((d) => (
                        <div 
                          key={d.id}
                          className="bg-brand-cardBg border border-brand-accent/20 rounded-2xl p-3 relative flex flex-col gap-2.5 shadow-sm group hover:shadow-md transition-all"
                        >
                          <div className="aspect-[4/3] rounded-xl overflow-hidden border border-brand-accent/30 relative">
                            <img src={d.image_url} alt={d.name} className="w-full h-full object-cover" />
                            
                            {/* Unique Code Tag */}
                            <span className="absolute top-2 left-2 bg-brand-secondary text-brand-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                              #{d.design_number}
                            </span>

                            {/* Delete Overlay Button */}
                            <button
                              onClick={() => handleDeleteDesign(d.id)}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-brand-white p-2 rounded-full shadow-md transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete design"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          <div className="px-1 text-xs flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="text-brand-primary uppercase tracking-wider font-bold text-[10px]">{d.category}</span>
                              <span className="font-heading font-bold text-brand-secondary text-sm">{d.price}</span>
                            </div>
                            <span className="text-brand-secondary font-bold font-heading line-clamp-1">{d.name}</span>
                            <span className="text-brand-textDark/60 text-[11px] line-clamp-1">{d.description}</span>
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
