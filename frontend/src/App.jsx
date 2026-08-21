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
<section style={{ width: '100%', padding: '60px clamp(15px, 4vw, 50px)', borderBottom: '1px solid #222' }}>
  <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
    
    <p style={{ color: '#d4af37', fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 'bold' }}>
      Horological Milestones
    </p>
    <h2 style={{ fontSize: '2.5rem', fontWeight: '300', letterSpacing: '2px', color: '#fff !important', marginBottom: '40px' }}>
      Icons of the Archive
    </h2>

    {/* 3-Column Grid for 62MAS, Alpinist, Presage */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', width: '100%' }}>
      
      {/* 1. The 62MAS */}
      <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: '100%', height: '240px', background: '#222', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
          <span>[ 62MAS Image Placeholder ]</span>
        </div>
        <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ color: '#d4af37', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>1965 Diver's Genesis</span>
            <h3 style={{ fontSize: '1.6rem', color: '#fff !important', margin: '10px 0 15px 0', fontWeight: '400' }}>The 62MAS</h3>
            <p style={{ color: '#bbb', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
              The iconic name "62MAS" is legendary collector slang. It combines the reference prefix **62** (from the Cal. 6217 movement) with **MAS**, an acronym for **auto[MA]tic [S]elfdater**. Released in 1965 as Japan's very first professional dive watch, this moniker stuck because saying the full technical reference was far too clunky.
            </p>
          </div>
          <div style={{ borderLeft: '2px solid #d4af37', paddingLeft: '15px', color: '#888', fontSize: '0.85rem', fontStyle: 'italic' }}>
            Significance: The birth of Japanese professional dive tool watches.
          </div>
        </div>
      </div>

      {/* 2. The Alpinist */}
      <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: '100%', height: '240px', background: '#222', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
          <span>[ Alpinist Image Placeholder ]</span>
        </div>
        <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ color: '#d4af37', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>1959 Field Standard</span>
            <h3 style={{ fontSize: '1.6rem', color: '#fff !important', margin: '10px 0 15px 0', fontWeight: '400' }}>The Alpinist</h3>
            <p style={{ color: '#bbb', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
              First introduced in 1959 as the **Seiko Laurel Alpinist**, this was Seiko's breakthrough entry into purpose-built sports watches. Engineered specifically for Japan's mountain climbers (**Yama-otoko**), it featured mountain-shaped cardinal indexes and protective bund straps to conquer harsh terrain.
            </p>
          </div>
          <div style={{ borderLeft: '2px solid #d4af37', paddingLeft: '15px', color: '#888', fontSize: '0.85rem', fontStyle: 'italic' }}>
            Significance: The definitive blueprint for land navigation and field durability.
          </div>
        </div>
      </div>

      {/* 3. The Presage */}
      <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: '100%', height: '240px', background: '#222', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
          <span>[ Presage Image Placeholder ]</span>
        </div>
        <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ color: '#d4af37', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Craftsmanship & Bar Culture</span>
            <h3 style={{ fontSize: '1.6rem', color: '#fff !important', margin: '10px 0 15px 0', fontWeight: '400' }}>The Presage Series</h3>
            <p style={{ color: '#bbb', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
              Deeply inspired by the vibrant cocktail lounge culture of Tokyo’s upscale Ginza district—collaborating with legendary mixologists like Hisashi Kishi of STAR BAR—each dial pattern and color palette mimics the light refraction, textures, and hues of artisan cocktails.
            </p>
          </div>
          <div style={{ borderLeft: '2px solid #d4af37', paddingLeft: '15px', color: '#888', fontSize: '0.85rem', fontStyle: 'italic' }}>
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