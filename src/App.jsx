import { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader } from 'lucide-react';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Lazy-loaded Pages (optimized for rapid mobile paints)
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Order = lazy(() => import('./pages/Order'));
const About = lazy(() => import('./pages/About'));
const Admin = lazy(() => import('./pages/Admin'));

// Scroll to Top helper on route changes
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Center spinner loading skeleton fallback
function PageLoader() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-brand-primary">
      <Loader className="w-10 h-10 animate-spin" />
      <span className="font-body text-xs font-bold uppercase tracking-widest text-brand-textDark/60">
        Loading magic...
      </span>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      
      {/* Toast Notification Container */}
      <Toaster 
        position="top-center"
        toastOptions={{
          className: 'font-body text-sm font-semibold border-2 border-brand-accent/25 rounded-2xl p-4 bg-brand-white text-brand-textDark',
          success: {
            iconTheme: {
              primary: '#C0305A',
              secondary: '#FFFFFF',
            },
          },
          duration: 4000,
        }}
      />

      <div className="flex flex-col min-h-screen relative bg-brand-bg">
        {/* Sticky Responsive Header */}
        <Navbar />

        {/* Main Body Routing Area */}
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/order" element={<Order />} />
              <Route path="/about" element={<About />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Home />} /> {/* Wildcard route fallback */}
            </Routes>
          </Suspense>
        </main>

        {/* Permanent WhatsApp pulse button */}
        <WhatsAppButton />

        {/* Brand coordinates Footer */}
        <Footer />
      </div>
    </HashRouter>
  );
}
