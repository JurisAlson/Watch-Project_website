import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Catalog() {
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/watches')
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

  return (
    <div className="catalog-page">

      <header className="catalog-header">
        <h1>Watch Catalog</h1>
        <p>Explore our complete collection.</p>
      </header>

      {loading ? (
        <p>Accessing inventory records...</p>
      ) : watches.length === 0 ? (
        <p>No watches currently available.</p>
      ) : (
        <div className="inventory-grid">
          {watches.map((watch) => (
            <Link
              to={`/catalog/${watch.id}`}
              key={watch.id}
              className="watch-card"
            >
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

              {watch.status && (
                <span className="watch-status-badge">
                  {watch.status}
                </span>
              )}

              <div className="watch-overlay"></div>

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

    </div>
  );
}

export default Catalog;