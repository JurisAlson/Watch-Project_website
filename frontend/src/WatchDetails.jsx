import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './WatchDetails.css';

function WatchDetails() {
  const { id } = useParams();

  const [watch, setWatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageExpanded, setImageExpanded] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/api/watches/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Watch not found');
        }

        return res.json();
      })
      .then((data) => {
        setWatch(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching watch:', err);
        setLoading(false);
      });
  }, [id]);

  const handleShare = async () => {
    const shareData = {
      title: `${watch.brand} ${watch.modelName}`,
      text: `Check out this ${watch.brand} ${watch.modelName}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Watch link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (loading) {
    return (
      <div className="watch-details-page">
        <p className="watch-loading">
          Accessing timepiece records...
        </p>
      </div>
    );
  }

  if (!watch) {
    return (
      <div className="watch-details-page">
        <div className="watch-not-found">
          <h2>Timepiece Not Found</h2>

          <p>
            This watch may no longer be available in our archive.
          </p>

          <Link to="/catalog" className="back-catalog-btn">
            ← RETURN TO CATALOG
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="watch-details-page">

      <header className="app-header">
        <div className="header-top-row">
          <h1 className="header-logo">
            wala pa po name
          </h1>

          <Link to="/catalog" className="details-back-link">
            ← BACK TO CATALOG
          </Link>
        </div>

        <nav className="nav-links">
          <Link to="/" className="nav-link">
            HOME
          </Link>

          <Link to="/catalog" className="nav-link active">
            CATALOG
          </Link>

          <span className="nav-link">Contact</span>
          <span className="nav-link">About us</span>
        </nav>
      </header>

      <main className="watch-details-content">

        <div className="watch-details-grid">

          {/* IMAGE */}
          <section className="watch-details-image-section">

            <button
              className="watch-main-image"
              onClick={() => setImageExpanded(true)}
              type="button"
            >
              {watch.imageUrl ? (
                <img
                  src={watch.imageUrl}
                  alt={`${watch.brand} ${watch.modelName}`}
                />
              ) : (
                <div className="details-image-placeholder">
                  No image available
                </div>
              )}

              {watch.imageUrl && (
                <div className="image-zoom-indicator">
                  🔍
                  <span>CLICK TO EXPAND</span>
                </div>
              )}
            </button>

          </section>

          {/* DETAILS */}
          <section className="watch-details-info-section">

            <div className="watch-details-header">

              {watch.category && (
                <p className="gold-tag">
                  {watch.category}
                </p>
              )}

              <h3 className="details-watch-brand">
                {watch.brand}
              </h3>

              <h1 className="details-watch-model">
                {watch.modelName}
              </h1>

              <p className="details-watch-reference">
                Ref. {watch.referenceNumber || 'N/A'}
              </p>

            </div>

            <div className="details-price-row">

              <div>
                <p className="details-price-label">
                  PRICE
                </p>

                <p className="details-watch-price">
                  ₱ {Number(watch.targetSellingPrice).toLocaleString()}
                </p>
              </div>

              {watch.status && (
                <span className={`details-status ${watch.status.toLowerCase()}`}>
                  {watch.status}
                </span>
              )}

            </div>

            <div className="details-divider" />

            {/* TEMPORARY DESCRIPTION */}
            <section className="watch-description-section">

              <p className="details-section-label">
                ABOUT THIS TIMEPIECE
              </p>

              <p className="details-description">
                Detailed information and collector notes for this
                timepiece will be available here.
              </p>

            </section>

            {/* SPECIFICATIONS */}
            <section className="watch-specifications">

              <p className="details-section-label">
                SPECIFICATIONS
              </p>

              <div className="spec-list">

                <div className="spec-row">
                  <span>Brand</span>
                  <strong>{watch.brand}</strong>
                </div>

                <div className="spec-row">
                  <span>Model</span>
                  <strong>{watch.modelName}</strong>
                </div>

                <div className="spec-row">
                  <span>Reference</span>
                  <strong>
                    {watch.referenceNumber || 'N/A'}
                  </strong>
                </div>

                <div className="spec-row">
                  <span>Category</span>
                  <strong>
                    {watch.category || 'N/A'}
                  </strong>
                </div>

              </div>

            </section>

            {/* ACTION BUTTONS */}
            <div className="watch-actions">

              <button
                type="button"
                className="share-watch-btn"
                onClick={handleShare}
              >
                ↗ SHARE THIS WATCH
              </button>

              <a
                href="https://m.me/YOUR_PAGE_USERNAME"
                target="_blank"
                rel="noopener noreferrer"
                className="messenger-watch-btn"
              >
                MESSAGE US ABOUT THIS WATCH
              </a>

            </div>

          </section>

        </div>

      </main>

      {/* IMAGE EXPANDED */}
      {imageExpanded && watch.imageUrl && (
        <div
          className="image-lightbox"
          onClick={() => setImageExpanded(false)}
        >
          <button
            className="lightbox-close"
            type="button"
            onClick={() => setImageExpanded(false)}
          >
            ×
          </button>

          <img
            src={watch.imageUrl}
            alt={`${watch.brand} ${watch.modelName}`}
          />
        </div>
      )}

    </div>
  );
}

export default WatchDetails;