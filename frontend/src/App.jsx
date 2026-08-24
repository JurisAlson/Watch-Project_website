import { useState, useEffect } from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation
} from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';
import PageTransition from './PageTransition';
import Catalog from './Catalog';
import Admin from './Admin';
import WatchDetails from './WatchDetails';
import AboutUs from './AboutUs';


function Home() {
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // State for the Archive Milestone Slider
  const [currentMilestone, setCurrentMilestone] = useState(0);
  const [fade, setFade] = useState(true);

  const archiveMilestones = [
    {
      tag: "1965 Diver's Genesis",
      title: "The Seiko 62MAS Professional",
      description: "The iconic name combines reference 62 with MAS (automatic selfdater). Engineered as Japan's inaugural professional dive timepiece, it was built specifically to withstand extreme pressure and sub-aquatic environments. Its legendary architecture laid the definitive foundation for generations of robust maritime instruments, merging high-performance utility with timeless mid-century aesthetic elegance.",
      history: "Launched during an era of rapid technological expansion in Japanese manufacturing, the 62MAS proved that domestic horology could rival European dominance in harsh underwater conditions.",
      image: "/images/62MAS.jpg"
    },
    {
      tag: "1959 Field Standard",
      title: "The Seiko Alpinist Heritage Edition",
      description: "Conceived specifically for Japan's mountain climbers (Yama-otoko) and professional field explorers, featuring distinct structural mountain-peak indexes, highly luminous hands, and rugged case construction. It stands as the ultimate blueprint for land navigation, combining reliable anti-magnetic properties with a sophisticated dial layout designed for high-altitude legibility.",
      history: "Originally introduced to satisfy the rigorous demands of Japanese mountain guides traversing rugged terrain, the Alpinist line quickly evolved into a cult classic of field functionality.",
      image: "/images/alpinist.webp"
    },
    {
      tag: "Craftsmanship & Bar Culture",
      title: "Seiko Presage Cocktail Time",
      description: "A masterclass in dial geometry, inspired by Tokyo's sophisticated Ginza bar culture in partnership with world-renowned master mixologists. Each intricate sunburst dial pattern mimics the complex light refractions of artisan cocktails and tonics, translating organic fluid elegance into high-precision mechanical art.",
      history: "Drawing from traditional Japanese artisanal techniques and high-end mechanical watchmaking, the Presage collection bridges everyday wearability with rare aesthetic depth.",
      image: "/images/pressage.webp"
    }
  ];

  // Auto-advance the archive slider every 5.5 seconds with a smooth fade transition
  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentMilestone((prev) => (prev + 1) % archiveMilestones.length);
        setFade(true);
      }, 350);
    }, 5500);
    return () => clearInterval(timer);
  }, [archiveMilestones.length]);

  // Fetch watches from your Java backend when the page loads
  useEffect(() => {
    fetch('http://localhost:8080/api/watches/latest')
      .then((res) => res.json())
      .then((data) => {
        setWatches(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching watches:', err);
        setLoading(false);
      });
  }, []);

  // Filter watches based on search input and category selection
  const filteredWatches = watches.filter((watch) => {
    const matchesSearch = 
      watch.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      watch.modelName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'All' || 
      (watch.category && watch.category.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="app-container">
      
      {/* TRANSPARENT FIXED HEADER & NAV BAR */}
      <header className="app-header">
        <div className="header-top-row">
          <h1 className="header-logo">wala pa po name</h1>
          
          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search archive reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="user-icon">👤</div>
        </div>

        {/* Minimalist Navigation Links */}
        <nav className="nav-links">
          <Link to="/" className="nav-link active">HOME</Link>
          <Link to="/catalog" className="nav-link">Catalog</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <Link to="/about" className="nav-link">About us</Link>
        </nav>
      </header>

      <div className="content-wrapper">

        {/* EDITORIAL 3-VIDEO HERO SECTION */}
        <section className="hero-section">
          <div className="hero-grid">
            
            {/* Video 1 */}
            <div className="hero-card">
              <video autoPlay loop muted playsInline className="hero-video">
                <source src="/Video_1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="hero-overlay-text">
                <p className="hero-tag">CURATED HOROLOGY</p>
                <h2 className="hero-title">EXCEPTIONAL</h2>
              </div>
            </div>

            {/* Video 2 */}
            <div className="hero-card">
              <video autoPlay loop muted playsInline className="hero-video">
                <source src="/Video_3.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="hero-overlay-text">
                <p className="hero-tag">PRECISION</p>
                <h2 className="hero-title">TIMEPIECES</h2>
              </div>
            </div>

            {/* Video 3 */}
            <div className="hero-card">
              <video autoPlay loop muted playsInline className="hero-video">
                <source src="/Video_2.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="hero-overlay-text">
                <p className="hero-tag">ARCHIVE</p>
                <h2 className="hero-title">COLLECTION 2026</h2>
              </div>
            </div>

          </div>
        </section>

        {/* ENLARGED ARCHIVE SLIDER SECTION */}
        <section className="archive-slider-section">
          <div className="archive-container">
            
            <div className="section-header-center">
              <p className="gold-tag">Horological Milestones</p>
              <h2 className="section-heading">Icons of the Archive</h2>
            </div>

            <div className="archive-slider-box">
              <div className="archive-grid">
                
                {/* Larger Image Area */}
                <div className="archive-image-wrapper">
                  <img 
                    src={archiveMilestones[currentMilestone].image} 
                    alt={archiveMilestones[currentMilestone].title} 
                    className={`archive-img ${fade ? 'fade-in' : 'fade-out'}`}
                  />
                </div>

                {/* Educational Text & History Side */}
                <div className={`archive-text-wrapper ${fade ? 'fade-in' : 'fade-out'}`}>
                  <span className="gold-tag">{archiveMilestones[currentMilestone].tag}</span>
                  <h3 className="archive-item-title">{archiveMilestones[currentMilestone].title}</h3>
                  <p className="archive-desc">{archiveMilestones[currentMilestone].description}</p>
                  <p className="archive-history">{archiveMilestones[currentMilestone].history}</p>

                  {/* Slider Pagination Indicators */}
                  <div className="slider-indicators">
                    {archiveMilestones.map((_, idx) => (
                      <span 
                        key={idx}
                        onClick={() => {
                          setFade(false);
                          setTimeout(() => {
                            setCurrentMilestone(idx);
                            setFade(true);
                          }, 350);
                        }}
                        className={`indicator-dot ${currentMilestone === idx ? 'active' : ''}`}
                      />
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* SERVICES BANNER SECTION */}
        <section className="services-banner">
          <div className="services-container">
            <p className="gold-tag">Our Services</p>
            <h3 className="services-title">Consignment, Trade, Buy & Sell</h3>
            <p className="services-desc">
              We facilitate seamless transactions through trusted watch trading, direct acquisitions, and professional consignment services—primarily dealing with exquisite Seiko timepieces for enthusiasts and collectors.
            </p>
          </div>
        </section>

        {/* SERIES FILTER SELECTION CARDS (ICONS RETURNED TO WHITE) */}
        <section className="filter-section">
          <div className="filter-wrapper">
            <div className="filter-header-row">
              <div>
                <p className="gold-tag">Explore Collections</p>
                <h2 className="filter-main-title">Shop by Series</h2>
              </div>
              {selectedCategory !== 'All' && (
                <button onClick={() => setSelectedCategory('All')} className="reset-filter-btn">
                  Reset Filter ({selectedCategory})
                </button>
              )}
            </div>

            <div className="filter-cards-grid">
              
              {/* Prospex Card */}
              <div 
                onClick={() => setSelectedCategory('Prospex')}
                className={`filter-card ${selectedCategory === 'Prospex' ? 'selected' : ''}`}
              >
                <img src="/images/prospex_logo.png" alt="Prospex" className="filter-card-logo" />
              </div>

              {/* Presage Card */}
              <div 
                onClick={() => setSelectedCategory('Presage')}
                className={`filter-card ${selectedCategory === 'Presage' ? 'selected' : ''}`}
              >
                <img src="/images/pressage_logo.webp" alt="Presage" className="filter-card-logo" />
              </div>

              {/* Seiko 5 Card */}
              <div 
                onClick={() => setSelectedCategory('Seiko 5')}
                className={`filter-card ${selectedCategory === 'Seiko 5' ? 'selected' : ''}`}
              >
                <img src="/images/seiko_5.png" alt="Seiko 5 Sports" className="filter-card-logo" />
              </div>

            </div>
          </div>
        </section>

        {/* GRID INVENTORY SHOWCASE (REMOVED ONE-LINE RESTRICTION) */}
        <main className="inventory-section">
          <div className="inventory-header-row">
            <h2 className="inventory-title">
              {selectedCategory === 'All' ? 'Curated Inventory Showcase' : `${selectedCategory} Collection`}
            </h2>
          </div>

          {loading ? (
            <p className="loading-text">Accessing inventory records...</p>
          ) : filteredWatches.length === 0 ? (
            <div className="no-watches-box">
              <p className="no-watches-text">No timepieces available under "{selectedCategory}".</p>
              <p className="no-watches-sub">Select an alternate series or reset criteria.</p>
            </div>
          ) : (
            <div className="inventory-grid">
  {filteredWatches.map((watch) => (
    <Link
      to={`/watch/${watch.id}`}
      key={watch.id}
      className="watch-card"
    >
      
      {/* Watch Image */}
      <div className="watch-image-container">
        {watch.imageUrl ? (
          <img
            src={watch.imageUrl}
            alt={watch.modelName}
            className="watch-img"
          />
        ) : (
          <span className="placeholder-text">
            [ Archive Visual Placeholder ]
          </span>
        )}
      </div>

      {/* Status Badge */}
      {watch.status && (
        <span className="watch-status-badge">
          {watch.status}
        </span>
      )}

      {/* Gradient Overlay */}
      <div className="watch-overlay"></div>

      {/* Watch Information */}
      <div className="watch-info-content">
        <div className="watch-info-top">
          <h3 className="watch-brand">{watch.brand}</h3>

          {watch.category && (
            <span className="watch-cat-tag">
              {watch.category}
            </span>
          )}
        </div>

        <p className="watch-model">
          {watch.modelName}
        </p>

        <div className="watch-footer-row">
          <span className="watch-price">
            ₱ {watch.targetSellingPrice}
          </span>

          <span className="watch-ref">
            Ref. {watch.referenceNumber}
          </span>
        </div>
      </div>

    </Link>
  ))}
</div>
          )}
        </main>

        {/* TRADITIONAL ABOUT US & CONTACT FOOTER SECTIONS */}
        <footer className="site-footer">
          <div className="footer-grid">
            <div className="footer-col">
              <h4 className="footer-heading">About Us</h4>
              <p className="footer-text">
                ???? is dedicated to sourcing, preserving, and curating exceptional mechanical wristwatches. Specializing in legendary Seiko references, we bridge heritage craftsmanship with contemporary collectors.
              </p>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Atelier & Inquiries</h4>
              <p className="footer-text">
                Looking to acquire, consign, or trade a specific reference? Connect with our private curators directly through our verified channels or message us for consultation.
              </p>
              <p className="footer-contact-info">Email: concierge@watchproject.com</p>
              <p className="footer-contact-info">Location: Laguna, Philippines</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 watchproject. All Rights Reserved.</p>
          </div>
        </footer>

      </div>

      {/* STATIC FLOATING SOCIAL WIDGET */}
      <div className="floating-social">
        <a 
          href="https://m.me/YOUR_PAGE_USERNAME" 
          target="_blank" 
          rel="noopener noreferrer"
          title="Inquire via Messenger"
          className="social-btn messenger"
        >
          <svg className="social-svg" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.91 1.455 5.493 3.73 7.18V22l3.4-1.87c.91.253 1.87.387 2.87.387 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.06 12.54l-2.55-2.72-4.97 2.72 5.46-5.8 2.59 2.72 4.93-2.72-5.46 5.8z"/>
          </svg>
        </a>

        <a 
          href="https://facebook.com/YOUR_PAGE_USERNAME" 
          target="_blank" 
          rel="noopener noreferrer"
          title="Visit our Atelier Page"
          className="social-btn facebook"
        >
          <svg className="social-svg" viewBox="0 0 24 24">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
          </svg>
        </a>
      </div>

    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />

        <Route
          path="/about"
          element={
            <PageTransition>
              <AboutUs />
            </PageTransition>
          }
        />

        <Route
          path="/catalog"
          element={
            <PageTransition>
              <Catalog />
            </PageTransition>
          }
        />

        <Route
          path="/watch/:id"
          element={
            <PageTransition>
              <WatchDetails />
            </PageTransition>
          }
        />

        <Route
          path="/admin"
          element={<Admin />}
        />

      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
