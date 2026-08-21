import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch watches from your Java backend when the page loads
  useEffect(() => {
    fetch('http://localhost:8080/api/watches')
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

  // Filter watches based on search input
  const filteredWatches = watches.filter((watch) =>
    watch.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    watch.modelName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#121212', overflowX: 'hidden' }}>
      
      {/* HEADER SECTION */}
      <header style={{ borderBottom: '1px solid #222', padding: '20px clamp(15px, 3vw, 40px)', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px', width: '100%' }}>
          <h1 style={{ fontSize: '1.8rem', letterSpacing: '2px', margin: 0, fontWeight: 'bold', color: '#fff' }}>GGGG</h1>
          
          {/* Search Bar */}
          <div style={{ position: 'relative', flex: '1 1 250px', maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 15px',
                background: 'transparent',
                border: '1px solid #444',
                borderRadius: '4px',
                color: '#fff',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ fontSize: '1.2rem', cursor: 'pointer' }}>👤</div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', gap: '30px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', flexWrap: 'wrap' }}>
          <span style={{ color: '#fff', borderBottom: '2px solid #fff', paddingBottom: '5px', cursor: 'pointer' }}>Home</span>
          <span style={{ color: '#888', cursor: 'pointer' }}>Catalog</span>
          <span style={{ color: '#888', cursor: 'pointer' }}>Contact</span>
          <span style={{ color: '#888', cursor: 'pointer' }}>About Us</span>
        </nav>
      </header>

      {/* EDITORIAL 3-VIDEO HERO SECTION */}
      <section style={{ width: '100%', padding: '30px clamp(15px, 3vw, 40px)' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px', 
          width: '100%'
        }}>
          
          {/* Video 1 */}
          <div style={{ position: 'relative', height: '480px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333', background: '#000', width: '100%' }}>
            <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8) contrast(1.1)' }}>
              <source src="/Video_1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div style={{ position: 'absolute', bottom: '30px', left: '30px', zIndex: 2 }}>
              <p style={{ color: '#d4af37', fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 6px 0', fontWeight: 'bold' }}>CURATED HOROLOGY</p>
              <h2 style={{ fontSize: '1.8rem', letterSpacing: '2px', margin: 0, fontWeight: '300', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>EXCEPTIONAL</h2>
            </div>
          </div>

          {/* Video 2 */}
          <div style={{ position: 'relative', height: '480px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333', background: '#000', width: '100%' }}>
            <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8) contrast(1.1)' }}>
              <source src="/Video_3.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div style={{ position: 'absolute', bottom: '30px', left: '30px', zIndex: 2 }}>
              <p style={{ color: '#d4af37', fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 6px 0', fontWeight: 'bold' }}>PRECISION</p>
              <h2 style={{ fontSize: '1.8rem', letterSpacing: '2px', margin: 0, fontWeight: '300', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>TIMEPIECES</h2>
            </div>
          </div>

          {/* Video 3 */}
          <div style={{ position: 'relative', height: '480px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333', background: '#000', width: '100%' }}>
            <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8) contrast(1.1)' }}>
              <source src="/Video_2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div style={{ position: 'absolute', bottom: '30px', left: '30px', zIndex: 2 }}>
              <p style={{ color: '#d4af37', fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 6px 0', fontWeight: 'bold' }}>ARCHIVE</p>
              <h2 style={{ fontSize: '1.8rem', letterSpacing: '2px', margin: 0, fontWeight: '300', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>COLLECTION 2026</h2>
            </div>
          </div>

        </div>
      </section>


{/* EDITORIAL HERITAGE SPOTLIGHT SECTION */}
<section style={{ width: '100%', padding: '80px clamp(20px, 5vw, 60px)', background: '#0f0f0f', borderBottom: '1px solid #222' }}>
  <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
    
    {/* Section Header */}
    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
      <p style={{ color: '#d4af37', fontSize: '0.85rem', letterSpacing: '5px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 'bold' }}>
        Horological Milestones
      </p>
      <h2 style={{ fontSize: '2.8rem', fontWeight: '300', letterSpacing: '2px', color: '#fff !important', margin: 0 }}>
        Icons of the Archive
      </h2>
    </div>

    {/* Vertical Stack / Zigzag Editorial Rows */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
      
      {/* ITEM 1: The 62MAS (Image Left, Text Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #262626', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', aspectRatio: '16/10' }}>
          <img 
            src="/images/62MAS.jpg" 
            alt="Seiko 62MAS" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ color: '#d4af37', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>1965 Diver's Genesis</span>
          <h3 style={{ fontSize: '2.2rem', color: '#fff !important', margin: '0 0 20px 0', fontWeight: '300', letterSpacing: '1px' }}>The 62MAS</h3>
          <p style={{ color: '#b0b0b0', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '25px' }}>
            The iconic name "62MAS" is legendary collector slang combining the reference prefix <strong style={{ color: '#fff' }}>62</strong> (from the Cal. 6217 movement) with <strong style={{ color: '#fff' }}>MAS</strong>, an acronym for <strong style={{ color: '#fff' }}>auto[MA]tic [S]elfdater</strong>. Released in 1965 as Japan's very first professional dive watch.
          </p>
          <div style={{ borderLeft: '2px solid #d4af37', paddingLeft: '15px', color: '#888', fontSize: '0.9rem', fontStyle: 'italic' }}>
            Significance: The birth of Japanese professional dive tool watches.
          </div>
        </div>
      </div>

      {/* ITEM 2: The Alpinist (Text Left, Image Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ color: '#d4af37', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>1959 Field Standard</span>
          <h3 style={{ fontSize: '2.2rem', color: '#fff !important', margin: '0 0 20px 0', fontWeight: '300', letterSpacing: '1px' }}>The Alpinist</h3>
          <p style={{ color: '#b0b0b0', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '25px' }}>
            First introduced in 1959 as the <strong style={{ color: '#fff' }}>Seiko Laurel Alpinist</strong>, this was Seiko's breakthrough entry into sports watches. Engineered specifically for Japan's mountain climbers (<strong style={{ color: '#fff' }}>Yama-otoko</strong>), featuring distinct mountain cardinal indexes.
          </p>
          <div style={{ borderLeft: '2px solid #d4af37', paddingLeft: '15px', color: '#888', fontSize: '0.9rem', fontStyle: 'italic' }}>
            Significance: The definitive blueprint for land navigation and field durability.
          </div>
        </div>
        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #262626', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', aspectRatio: '16/10' }}>
          <img 
            src="/images/alpinist.webp" 
            alt="Seiko Alpinist" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>
      </div>

      {/* ITEM 3: The Presage (Image Left, Text Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #262626', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', aspectRatio: '16/10' }}>
          <img 
            src="/images/pressage.webp" 
            alt="Seiko Presage" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ color: '#d4af37', fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>Craftsmanship & Bar Culture</span>
          <h3 style={{ fontSize: '2.2rem', color: '#fff !important', margin: '0 0 20px 0', fontWeight: '300', letterSpacing: '1px' }}>The Presage Series</h3>
          <p style={{ color: '#b0b0b0', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '25px' }}>
            Deeply inspired by cocktail lounge culture in Tokyo’s Ginza district—collaborating with legendary mixologists like Hisashi Kishi of STAR BAR—each dial pattern mimics the unique light refraction and textures of artisan cocktails.
          </p>
          <div style={{ borderLeft: '2px solid #d4af37', paddingLeft: '15px', color: '#888', fontSize: '0.9rem', fontStyle: 'italic' }}>
            Significance: Translating master mixology and Japanese dial artistry into mechanical form.
          </div>
        </div>
      </div>

    </div>

  </div>
</section>
      {/* CATALOG SECTION */}
      <main style={{ width: '100%', padding: '20px clamp(15px, 3vw, 40px) 60px clamp(15px, 3vw, 40px)' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '30px', letterSpacing: '1px', color: '#d4af37', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '4px' }}>Features</h2>

        {loading ? (
          <p style={{ color: '#888' }}>Loading catalog inventory from server...</p>
        ) : filteredWatches.length === 0 ? (
          <div style={{ padding: '40px', background: '#1a1a1a', borderRadius: '6px', textAlign: 'center', border: '1px solid #333', width: '100%' }}>
            <p style={{ color: '#aaa', fontSize: '1.1rem' }}>No timepieces found.</p>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Add watch data to your database to view them here.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '30px', width: '100%' }}>
            {filteredWatches.map((watch) => (
              <div key={watch.id} style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', overflow: 'hidden', transition: 'transform 0.2s', width: '100%' }}>
                
                {/* Watch Image Placeholder */}
                <div style={{ width: '100%', height: '220px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '0.9rem', borderBottom: '1px solid #333' }}>
                  {watch.imageUrl ? (
                    <img src={watch.imageUrl} alt={watch.modelName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span>[ Watch Image Placeholder ]</span>
                  )}
                </div>

                {/* Watch Information */}
                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#fff' }}>{watch.brand}</h3>
                  <p style={{ margin: '4px 0', color: '#aaa', fontSize: '0.95rem' }}>{watch.modelName}</p>
                  <p style={{ margin: '12px 0 4px 0', color: '#d4af37', fontSize: '1.3rem', fontWeight: 'bold' }}>${watch.targetSellingPrice}</p>
                  <p style={{ margin: '0', color: '#666', fontSize: '0.8rem' }}>Ref: {watch.referenceNumber} | Status: {watch.status}</p>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}

export default App;