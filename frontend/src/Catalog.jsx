import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Catalog.css';

function Catalog() {
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/watches`)
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

  const filteredWatches = watches.filter((watch) => {
    const matchesSearch =
      watch.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      watch.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (watch.referenceNumber &&
        watch.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' ||
      (watch.category &&
        watch.category.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="catalog-page">

      <main className="catalog-content">

        {/* CATALOG INTRO */}
        <section className="catalog-hero">
          <p className="gold-tag">THE COLLECTION</p>
          <h2 className="catalog-title">Watch Archive</h2>
          <p className="catalog-description">
            Explore our complete collection of curated timepieces,
            from contemporary references to limited editions and iconic
            mechanical watches.
          </p>
        </section>

        {/* FILTERS */}
        <section className="catalog-filters">

          <div className="catalog-filter-header">
            <div>
              <p className="gold-tag">Browse Collection</p>
              <h3 className="catalog-section-title">
                All Timepieces
              </h3>
            </div>

            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="reset-filter-btn"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="catalog-category-buttons">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`catalog-category-btn ${
                selectedCategory === 'All' ? 'selected' : ''
              }`}
            >
              All
            </button>

            <button
              onClick={() => setSelectedCategory('Prospex')}
              className={`catalog-category-btn ${
                selectedCategory === 'Prospex' ? 'selected' : ''
              }`}
            >
              Prospex
            </button>

            <button
              onClick={() => setSelectedCategory('Presage')}
              className={`catalog-category-btn ${
                selectedCategory === 'Presage' ? 'selected' : ''
              }`}
            >
              Presage
            </button>

            <button
              onClick={() => setSelectedCategory('Seiko 5')}
              className={`catalog-category-btn ${
                selectedCategory === 'Seiko 5' ? 'selected' : ''
              }`}
            >
              Seiko 5
            </button>

            <button
              onClick={() => setSelectedCategory('GMT')}
              className={`catalog-category-btn ${
                selectedCategory === 'GMT' ? 'selected' : ''
              }`}
            >
              GMT
            </button>

            <button
              onClick={() => setSelectedCategory('Diver')}
              className={`catalog-category-btn ${
                selectedCategory === 'Diver' ? 'selected' : ''
              }`}
            >
              Diver
            </button>

            <button
              onClick={() => setSelectedCategory('Dress')}
              className={`catalog-category-btn ${
                selectedCategory === 'Dress' ? 'selected' : ''
              }`}
            >
              Dress
            </button>

            <button
              onClick={() => setSelectedCategory('Field')}
              className={`catalog-category-btn ${
                selectedCategory === 'Field' ? 'selected' : ''
              }`}
            >
              Field
            </button>
          </div>

        </section>

        {/* WATCH CATALOG */}
        <section className="catalog-inventory">

          {loading ? (
            <p className="loading-text">
              Accessing inventory records...
            </p>
          ) : filteredWatches.length === 0 ? (
            <div className="no-watches-box">
              <p className="no-watches-text">
                No timepieces found.
              </p>
              <p className="no-watches-sub">
                Try another search or category.
              </p>
            </div>
          ) : (
            <div className="catalog-grid">

 {filteredWatches.map((watch) => (
  <Link
    to={`/watch/${watch.id}`}
    key={watch.id}
    className="catalog-watch-card"
  >
    <div className="catalog-watch-image">
      {watch.imageUrl ? (
        <img
          src={watch.imageUrl}
          alt={watch.modelName}
        />
      ) : (
        <span>[ Archive Visual Placeholder ]</span>
      )}
    </div>

    {watch.status && (
      <span className="watch-status-badge">
        {watch.status}
      </span>
    )}

    <div className="catalog-watch-info">
      <div className="catalog-watch-top">
        <h3>{watch.brand}</h3>

        {watch.category && (
          <span className="watch-cat-tag">
            {watch.category}
          </span>
        )}
      </div>

      <p className="catalog-watch-model">
        {watch.modelName}
      </p>

      <p className="catalog-watch-reference">
        Ref. {watch.referenceNumber}
      </p>

      <div className="catalog-watch-footer">
        <span className="catalog-watch-price">
          ₱ {Number(watch.targetSellingPrice).toLocaleString()}
        </span>

        <span className="catalog-view">
          VIEW →
        </span>
      </div>
    </div>
  </Link>
))}

            </div>
          )}

        </section>

      </main>
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

      {/* SAME STATIC SOCIAL WIDGET AS HOME */}
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

export default Catalog;