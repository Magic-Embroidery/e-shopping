import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, MessageSquare, Heart } from 'lucide-react';

const Instagram = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: 'Bridal Blouse Embroidery', path: '/services' },
    { name: 'Blouse Embroidery', path: '/services' },
    { name: 'Saree Embroidery', path: '/services' },
    { name: 'Logo Embroidery', path: '/services' },
    { name: 'Initial & Name Embroidery', path: '/services' },
    { name: 'Burka Alteration & Embroidery', path: '/services' }
  ];

  return (
    <footer className="bg-brand-cardBg border-t border-brand-accent/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Shop Bio Column */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex flex-col">
              <span className="font-heading text-2xl font-bold tracking-tight text-brand-secondary leading-none">
                Magic Embroidery
              </span>
              <span className="text-xs font-semibold tracking-widest text-brand-primary uppercase mt-1">
                It's Digital
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-brand-textDark/80 font-medium">
              "We will provide the best and reliable digital embroidery."
            </p>
            <p className="text-xs text-brand-textDark/60 italic font-semibold mt-2">
              Based in Selaiyur, Chennai 73
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-heading text-lg font-bold text-brand-secondary mb-4">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link to="/" className="text-sm font-semibold hover:text-brand-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/services" className="text-sm font-semibold hover:text-brand-primary transition-colors">Our Services</Link>
              </li>
              <li>
                <Link to="/gallery" className="text-sm font-semibold hover:text-brand-primary transition-colors">Design Gallery</Link>
              </li>
              <li>
                <Link to="/about" className="text-sm font-semibold hover:text-brand-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/order" className="text-sm font-semibold hover:text-brand-primary transition-colors">Order Form</Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-heading text-lg font-bold text-brand-secondary mb-4">Services</h4>
            <ul className="flex flex-col gap-3">
              {services.map((service, index) => (
                <li key={index}>
                  <Link to={service.path} className="text-sm font-semibold hover:text-brand-primary transition-colors">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact coordinates Column */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading text-lg font-bold text-brand-secondary mb-4">Contact Info</h4>
            <div className="flex flex-col gap-3">
              <a 
                href="tel:+919994546013" 
                className="flex items-center gap-3 text-sm font-semibold hover:text-brand-primary transition-colors"
              >
                <div className="bg-brand-primary/10 p-2 rounded-full text-brand-primary">
                  <Phone className="w-4 h-4" />
                </div>
                <span>99945 46013</span>
              </a>
              <a 
                href="https://wa.me/919994546013" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 text-sm font-semibold hover:text-brand-primary transition-colors"
              >
                <div className="bg-green-500/10 p-2 rounded-full text-green-600">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span>WhatsApp Live Chat</span>
              </a>
              <a 
                href="https://instagram.com/magicembroidery_digital" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 text-sm font-semibold hover:text-brand-primary transition-colors"
              >
                <div className="bg-pink-500/10 p-2 rounded-full text-pink-600">
                  <Instagram className="w-4 h-4" />
                </div>
                <span>@magicembroidery_digital</span>
              </a>
              <a 
                href="https://maps.app.goo.gl/RHngweEYyT6YM1Vz7" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 text-sm font-semibold hover:text-brand-primary transition-colors"
              >
                <div className="bg-brand-secondary/10 p-2 rounded-full text-brand-secondary">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="leading-tight">Selaiyur, Chennai 600073</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-accent/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-brand-textDark/60">
          <p>© {currentYear} Magic Embroidery — It's Digital. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-brand-primary fill-brand-primary" /> in Chennai
          </p>
        </div>
      </div>
    </footer>
  );
}
