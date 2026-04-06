import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="badge">NEW RELEASE</div>
          <h1 className="hero-title">
            <span>TITANBOOK</span><br />
            <span className="text-primary">PRECISION M1</span>
          </h1>
          <p className="hero-desc">
            Engineered for absolute performance. Featuring the new 3nm architecture for surgical efficiency in every task.
          </p>
          <div className="hero-actions">
            <Link to="/product/1" className="btn-primary">Pre-order Now</Link>
            <Link to="/product/1" className="btn-secondary">Technical Specs</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/laptop.png" alt="Titanbook" />
        </div>
      </section>

      {/* Categories */}
      <section className="container categories">
        <div className="cat-card primary-cat">
          <div className="cat-text">
            <h3>Smartphones</h3>
            <p>The Apex Series</p>
          </div>
          <img src="/images/phone.png" alt="Smartphones" className="cat-img" />
        </div>
        <div className="cat-grid">
          <div className="cat-card h-half bg-light">
            <div className="cat-text">
              <h3>Laptops</h3>
              <p>Studio performance</p>
            </div>
            <img src="/images/laptop.png" alt="Laptops" className="cat-img-right" style={{maxHeight:'200px'}} />
          </div>
          <div className="cat-row-2">
            <div className="cat-card bg-gray">
              <div className="cat-text">
                <h3>Audio</h3>
              </div>
              <div className="square-img" style={{background: '#111'}}>
                  <img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200" alt="Audio" />
              </div>
            </div>
            <div className="cat-card bg-peach">
              <div className="cat-text">
                <h3>Wearables</h3>
              </div>
              <img src="/images/watch.png" alt="Wearables" className="cat-img-center" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Outline */}
      <section className="features bg-off-white">
        <div className="container features-grid">
          <div className="feature-item">
            <div className="f-icon">🧠</div>
            <h4>Neural Engine v5</h4>
            <p>Integrated AI cores delivering 15 trillion operations per second for seamless machine learning integration.</p>
          </div>
          <div className="feature-item">
            <div className="f-icon">⚡</div>
            <h4>Turbo Charging 2.0</h4>
            <p>Precision power delivery that fills 50% capacity in under 12 minutes without degrading cell longevity.</p>
          </div>
          <div className="feature-item">
            <div className="f-icon">🛡️</div>
            <h4>Hard-Coded Security</h4>
            <p>Dedicated security enclave ensures your biometric data and encryption keys never leave the hardware.</p>
          </div>
        </div>
      </section>

      {/* Featured Hardware */}
      <section className="container featured-hardware">
        <div className="fh-header">
          <div>
            <h2>Featured Hardware</h2>
            <p>Curated for professional workflows.</p>
          </div>
          <a href="#" className="link-all" onClick={(e)=>e.preventDefault()}>View Entire Catalog</a>
        </div>
        <div className="fh-grid">
          <div className="fh-card">
            <div className="card-tag tag-new">NEW</div>
            <div className="fh-img">
              <img src="/images/phone.png" alt="Apex Pro 15" />
            </div>
            <div className="fh-info">
              <span className="fh-category">SMARTPHONE</span>
              <h4>Apex Pro 15</h4>
              <div className="fh-specs"><span>256GB</span><span>A1-Silicon</span></div>
              <div className="fh-footer">
                <span className="fh-price">$1,199.00</span>
                <button className="btn-icon">🛒</button>
              </div>
            </div>
          </div>
          <div className="fh-card">
            <div className="fh-img">
              <img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400" alt="Zenith Buds Elite" />
            </div>
            <div className="fh-info">
              <span className="fh-category">AUDIO</span>
              <h4>Zenith Buds Elite</h4>
              <div className="fh-specs"><span>ANC 2.0</span><span>24h Battery</span></div>
              <div className="fh-footer">
                <span className="fh-price">$299.00</span>
                <button className="btn-icon">🛒</button>
              </div>
            </div>
          </div>
          <div className="fh-card">
             <div className="card-tag tag-limited">LIMITED</div>
            <div className="fh-img">
              <img src="/images/watch.png" alt="Vanguard Watch X" />
            </div>
            <div className="fh-info">
              <span className="fh-category">WEARABLES</span>
              <h4>Vanguard Watch X</h4>
              <div className="fh-specs"><span>GPS L5</span><span>Titanium</span></div>
              <div className="fh-footer">
                <span className="fh-price">$749.00</span>
                <button className="btn-icon">🛒</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container newsletter-content">
          <h2>Stay at the cutting edge.</h2>
          <p>Join 50,000+ tech enthusiasts getting exclusive early access to hardware launches and technical insights.</p>
          <div className="nl-form">
            <input type="email" placeholder="Enter your business email" />
            <button className="btn-primary" style={{backgroundColor: 'white', color: 'var(--primary)'}}>Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
