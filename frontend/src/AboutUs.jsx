import './AboutUs.css';

function AboutUs() {
  return (
    <div className="about-page">

      {/* ================================
          HERO — GRAND SEIKO SWEEPING HAND
      ================================= */}

      <section className="about-hero">

        <video
          autoPlay
          loop
          muted
          playsInline
          className="about-hero-video"
        >
          <source
            src="grandseiko.mp4"
            type="video/mp4"
          />
        </video>

        <div className="about-hero-overlay"></div>

        <div className="about-hero-content">

          <p className="about-hero-tag">
            THE ART OF HOROLOGY
          </p>

          <h1 className="about-hero-title">
            TIME,
            <br />
            REFINED.
          </h1>

          <p className="about-hero-subtitle">
            An appreciation for precision, craftsmanship,
            and the details that make a timepiece worth preserving.
          </p>

        </div>

        <div className="about-hero-bottom">
          <span>WATCHPROJECT</span>
          <span>EST. 2026</span>
        </div>

      </section>


      {/* ================================
          GRAND SEIKO MOVEMENT
      ================================= */}

      <section className="movement-section">

        <video
          autoPlay
          loop
          muted
          playsInline
          className="movement-video"
        >
          <source
            src="grandseikomovement.mp4"
            type="video/mp4"
          />
        </video>

        <div className="movement-overlay"></div>

        <div className="movement-content">

          <p className="gold-tag">
            BENEATH THE DIAL
          </p>

          <h2>
            PRECISION
            <br />
            IN MOTION.
          </h2>

          <p>
            Every component has a purpose. Every movement tells
            a story of engineering, patience, and precision.
          </p>

        </div>

      </section>


      {/* ================================
          PHILOSOPHY
      ================================= */}

      <section className="about-philosophy">

        <div className="about-section-number">
          01 — OUR PHILOSOPHY
        </div>

        <div className="philosophy-grid">

          <h2>
            More than a watch.
            <br />
            A piece of horological history.
          </h2>

          <div className="philosophy-copy">

            <p>
              WatchProject was created from an appreciation for
              watches that deserve to be understood, worn, and
              preserved.
            </p>

            <p>
              We focus primarily on Japanese horology, particularly
              Seiko references that combine distinctive design,
              engineering, history, and character.
            </p>

            <p>
              From everyday references to limited editions and
              historically significant models, every watch we
              encounter has a story behind it.
            </p>

          </div>

        </div>

      </section>


      {/* ================================
          WHAT WE DO
      ================================= */}

      <section className="about-values">

        <div className="about-section-number">
          02 — WHAT WE DO
        </div>

        <div className="values-grid">

          <div className="value-item">
            <span>01</span>

            <h3>CURATE</h3>

            <p>
              We search for watches that offer something
              meaningful beyond simply telling time.
            </p>
          </div>


          <div className="value-item">
            <span>02</span>

            <h3>VERIFY</h3>

            <p>
              References, condition, originality, and
              documentation are considered before a watch
              enters our collection.
            </p>
          </div>


          <div className="value-item">
            <span>03</span>

            <h3>CONNECT</h3>

            <p>
              We connect interesting timepieces with collectors
              who appreciate the story behind them.
            </p>
          </div>

        </div>

      </section>


      {/* ================================
          CONTACT
      ================================= */}

      <section className="about-contact">

        <p className="gold-tag">
          PRIVATE INQUIRIES
        </p>

        <h2>
          Looking for a particular
          <br />
          reference?
        </h2>

        <p>
          Acquire, trade, sell, or consign a timepiece
          through our private channels.
        </p>

        <a
          href="https://m.me/YOUR_PAGE_USERNAME"
          target="_blank"
          rel="noopener noreferrer"
          className="about-contact-button"
        >
          CONTACT THE ATELIER
        </a>

      </section>


      <footer className="about-footer">

        <span>WATCHPROJECT</span>

        <span>
          © 2026 ALL RIGHTS RESERVED
        </span>

      </footer>

    </div>
  );
}

export default AboutUs;