import { useState, useEffect } from 'react';

import './App.css';

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';

import PageTransition from './PageTransition';
import Catalog from './Catalog';
import Admin from './Admin';
import AdminLogin from './AdminLogin';
import WatchDetails from './WatchDetails';
import AboutUs from './AboutUs';
import Navbar from './Navbar';
import ProtectedRoute from './ProtectedRoute';


function Home() {

  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [collectionSlide, setCollectionSlide] = useState(0);

  const navigate = useNavigate();


  /* ========================================
      FETCH LATEST WATCHES
  ======================================== */

  useEffect(() => {

    fetch('http://localhost:8080/api/watches/latest')

      .then((res) => {

        if (!res.ok) {
          throw new Error('Failed to fetch watches');
        }

        return res.json();

      })

      .then((data) => {

        setWatches(data);
        setLoading(false);

      })

      .catch((err) => {

        console.error('Error fetching watches:', err);
        setLoading(false);

      });

  }, []);


  /* ========================================
      CURRENT COLLECTION FILTER
  ======================================== */

  const filteredWatches = watches.filter((watch) => {

    return (
      selectedCategory === 'All' ||
      (
        watch.category &&
        watch.category.toLowerCase() ===
        selectedCategory.toLowerCase()
      )
    );

  });


  /* ========================================
      COLLECTION NAVIGATION
  ======================================== */

  const openCollection = (category) => {

    setSelectedCategory(category);
    setCollectionSlide(0);

    navigate(
      `/catalog?category=${encodeURIComponent(category)}`
    );

  };


  /* ========================================
      COLLECTION CAROUSEL
  ======================================== */

  const visibleWatches = filteredWatches.slice(
    collectionSlide,
    collectionSlide + 3
  );

  const canSlideLeft = collectionSlide > 0;

  const canSlideRight =
    collectionSlide + 3 < filteredWatches.length;


  const slideCollectionLeft = () => {

    if (canSlideLeft) {
      setCollectionSlide((prev) => prev - 1);
    }

  };


  const slideCollectionRight = () => {

    if (canSlideRight) {
      setCollectionSlide((prev) => prev + 1);
    }

  };


  return (

    <div className="app-container">


      {/* ========================================
          01 — HERO
      ======================================== */}

      <section className="home-hero">

        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="home-hero-video"
        >

          <source
            src="/Video_1.mp4"
            type="video/mp4"
          />

        </video>

        <div className="home-hero-overlay"></div>


        <div className="home-hero-content">

          <p className="gold-tag">
            CURATED HOROLOGY
          </p>

          <h1 className="home-hero-title">
            TIME,
            <br />
            COLLECTED.
          </h1>

          <p className="home-hero-subtitle">
            Exceptional mechanical timepieces selected
            for collectors who appreciate craftsmanship,
            history, and character.
          </p>

        </div>


        <div className="home-hero-bottom">

          <span>
            WATCHPROJECT
          </span>

          <span>
            EST. 2026
          </span>

        </div>

      </section>


      {/* ========================================
          03 — THE ATELIER / SERVICES
      ======================================== */}

      <section className="atelier-section">

        <div className="home-section-number">
          03 — THE ATELIER
        </div>


        <div className="atelier-content">

          <p className="gold-tag">
            PRIVATE WATCH SERVICES
          </p>

          <h2>
            ACQUIRE.
            <br />
            TRADE.
            <br />
            CONSIGN.
          </h2>

          <p>
            Private acquisitions, trades, sales,
            and consignment for carefully selected
            timepieces.
          </p>

          <a
            href="https://m.me/YOUR_PAGE_USERNAME"
            target="_blank"
            rel="noopener noreferrer"
            className="atelier-button"
          >
            CONTACT THE ATELIER
            <span>
              →
            </span>
          </a>

        </div>

      </section>


      {/* ========================================
          04 — VIDEO BREAK
      ======================================== */}

      <section className="home-video-break">

        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="video-break-video"
        >

          <source
            src="/Video_2.mp4"
            type="video/mp4"
          />

        </video>

        <div className="video-break-overlay"></div>


        <div className="video-break-content">

          <p className="gold-tag">
            THE WATCH
          </p>

          <h2>
            MORE THAN
            <br />
            A WATCH.
          </h2>

          <p>
            Engineering, design, history,
            and character brought together
            in a single timepiece.
          </p>

        </div>

      </section>


      {/* ========================================
          02 — EXPLORE COLLECTIONS
      ======================================== */}

      <section className="series-section">

        <div className="home-section-number">
          02 — EXPLORE
        </div>


        <div className="series-heading">

          <p className="gold-tag">
            SEIKO COLLECTIONS
          </p>

          <h2>
            FIND YOUR
            <br />
            REFERENCE.
          </h2>

          <p>
            Explore distinctive collections
            from Seiko's modern archive.
          </p>

        </div>


        <div className="series-list">


          <button
            type="button"
            onClick={() => openCollection('Prospex')}
            className={
              selectedCategory === 'Prospex'
                ? 'active-series'
                : ''
            }
          >

            <span>
              01
            </span>

            <h3>
              PROSPEX
            </h3>

            <span>
              →
            </span>

          </button>


          <button
            type="button"
            onClick={() => openCollection('Presage')}
            className={
              selectedCategory === 'Presage'
                ? 'active-series'
                : ''
            }
          >

            <span>
              02
            </span>

            <h3>
              PRESAGE
            </h3>

            <span>
              →
            </span>

          </button>


          <button
            type="button"
            onClick={() => openCollection('Seiko 5')}
            className={
              selectedCategory === 'Seiko 5'
                ? 'active-series'
                : ''
            }
          >

            <span>
              03
            </span>

            <h3>
              SEIKO 5 SPORTS
            </h3>

            <span>
              →
            </span>

          </button>


          <button
            type="button"
            onClick={() => openCollection('All')}
            className="reset-series"
          >

            <span>
              04
            </span>

            <h3>
              VIEW ALL COLLECTIONS
            </h3>

            <span>
              →
            </span>

          </button>


        </div>

      </section>


      {/* ========================================
          04 — ABOUT WATCHPROJECT
      ======================================== */}

      <section className="home-about-section">

        <div className="home-section-number">
          04 — ABOUT WATCHPROJECT
        </div>


        <div className="home-about-visual">

          <img
            src="/willard.jpg"
            alt="Seiko Captain Willard"
            className="home-about-image"
          />

          <div className="home-about-overlay"></div>


          <div className="home-about-content">

            <p className="gold-tag">
              THE PHILOSOPHY
            </p>

            <h2>
              TIMEPIECES
              <br />
              WORTH
              <br />
              PRESERVING.
            </h2>

            <p>
              WatchProject was created from an
              appreciation for watches that deserve
              to be understood, worn, and preserved.
            </p>

            <Link
              to="/about"
              className="editorial-link"
            >
              DISCOVER OUR STORY
              <span>
                →
              </span>
            </Link>

          </div>

        </div>

      </section>


      {/* ========================================
          05 — CURRENT COLLECTION
      ======================================== */}

      <section className="featured-collection">

        <div className="home-section-number">
          05 — CURRENT COLLECTION
        </div>


        <div className="collection-heading">

          <p className="gold-tag">
            AVAILABLE NOW
          </p>

          <h2>
            CURRENTLY
            <br />
            AVAILABLE.
          </h2>

          <p>
            A selection of watches currently
            available through WatchProject.
          </p>

        </div>


        {loading ? (

          <p className="loading-text">
            Accessing inventory records...
          </p>

        ) : filteredWatches.length === 0 ? (

          <div className="no-watches-box">

            <p className="no-watches-text">
              No timepieces currently available.
            </p>

          </div>

        ) : (

          <div className="collection-carousel">

            <button
              type="button"
              className={`collection-arrow collection-arrow-left ${
                !canSlideLeft ? 'disabled' : ''
              }`}
              onClick={slideCollectionLeft}
              disabled={!canSlideLeft}
              aria-label="Previous watches"
            >
              ←
            </button>


            <div className="featured-watch-grid">

              {visibleWatches.map((watch) => (

                <Link
                  to={`/watch/${watch.id}`}
                  key={watch.id}
                  className="featured-watch-card"
                >

                  <div className="featured-watch-image">

                    {watch.imageUrl ? (

                      <img
                        src={watch.imageUrl}
                        alt={watch.modelName}
                      />

                    ) : (

                      <span className="placeholder-text">
                        ARCHIVE VISUAL
                        <br />
                        UNAVAILABLE
                      </span>

                    )}

                  </div>


                  {watch.status && (

                    <span className="featured-watch-status">
                      {watch.status}
                    </span>

                  )}


                  <div className="featured-watch-info">

                    <div className="featured-watch-top">

                      <span className="featured-watch-brand">
                        {watch.brand}
                      </span>

                      {watch.category && (

                        <span className="featured-watch-category">
                          {watch.category}
                        </span>

                      )}

                    </div>


                    <h3>
                      {watch.modelName}
                    </h3>


                    <div className="featured-watch-footer">

                      <span className="featured-watch-price">
                        ₱ {watch.targetSellingPrice}
                      </span>

                      <span className="featured-watch-reference">
                        REF. {watch.referenceNumber}
                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>


            <button
              type="button"
              className={`collection-arrow collection-arrow-right ${
                !canSlideRight ? 'disabled' : ''
              }`}
              onClick={slideCollectionRight}
              disabled={!canSlideRight}
              aria-label="Next watches"
            >
              →
            </button>

          </div>

        )}


        <div className="collection-link-wrapper">

          <Link
            to="/catalog"
            className="editorial-link"
          >
            VIEW FULL COLLECTION
            <span>
              →
            </span>
          </Link>

        </div>

      </section>


      {/* ========================================
          FOOTER
      ======================================== */}

      <footer className="site-footer">

        <div className="footer-grid">


          <div className="footer-col">

            <h4>
              WATCHPROJECT
            </h4>

            <p>
              A private platform dedicated to sourcing,
              preserving, and curating exceptional
              mechanical timepieces.
            </p>

          </div>


          <div className="footer-col">

            <h4>
              INQUIRIES
            </h4>

            <p>
              Looking to acquire, trade, sell,
              or consign a specific reference?
            </p>

            <p className="footer-contact-info">
              Laguna, Philippines
            </p>

          </div>


        </div>


        <div className="footer-bottom">

          <span>
            © 2026 WATCHPROJECT
          </span>

          <span>
            ALL RIGHTS RESERVED
          </span>

        </div>

      </footer>


      {/* ========================================
          FLOATING SOCIAL
      ======================================== */}

      <div className="floating-social">


        <a
          href="https://m.me/YOUR_PAGE_USERNAME"
          target="_blank"
          rel="noopener noreferrer"
          title="Inquire via Messenger"
          className="social-btn messenger"
        >

          <svg
            className="social-svg"
            viewBox="0 0 24 24"
          >

            <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.91 1.455 5.493 3.73 7.18V22l3.4-1.87c.91.253 1.87.387 2.87.387 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.06 12.54l-2.55-2.72-4.97 2.72 5.46-5.8 2.59 2.72 4.93-2.72-5.46 5.8z" />

          </svg>

        </a>


        <a
          href="https://facebook.com/YOUR_PAGE_USERNAME"
          target="_blank"
          rel="noopener noreferrer"
          title="Visit our Facebook Page"
          className="social-btn facebook"
        >

          <svg
            className="social-svg"
            viewBox="0 0 24 24"
          >

            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />

          </svg>

        </a>


      </div>

    </div>

  );

}


/* ========================================
    ROUTES
======================================== */

function AnimatedRoutes() {

  const location = useLocation();

  return (

    <AnimatePresence mode="wait">

      <Routes
        location={location}
        key={location.pathname}
      >

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
          path="/admin/login"
          element={
            <AdminLogin />
          }
        />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
/>
      </Routes>

    </AnimatePresence>

  );

}

function AppContent() {

  const location = useLocation();

const isAdminPage =
  location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Navbar />}

      <AnimatedRoutes />
    </>
  );
}


function App() {

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );

}


export default App;