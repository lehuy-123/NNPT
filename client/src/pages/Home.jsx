import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="badge">SẢN PHẨM MỚI</div>
          <h1 className="hero-title">
            <span>TITANBOOK</span><br />
            <span className="text-primary">PRECISION M1</span>
          </h1>
          <p className="hero-desc">
            Được chế tác cho hiệu suất tuyệt đối. Kiến trúc 3nm thế hệ mới mang lại hiệu năng xử lý tinh vi cho mọi tác vụ.
          </p>
          <div className="hero-actions">
             <Link to="/category/laptops" className="btn-primary">Đặt hàng ngay</Link>
             <Link to="/category/laptops" className="btn-secondary">Thông số kỹ thuật</Link>
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
             <h3>Điện thoại</h3>
             <p>Dòng sản phẩm Apex</p>
          </div>
          <img src="/images/phone.png" alt="Smartphones" className="cat-img" />
        </div>
        <div className="cat-grid">
          <div className="cat-card h-half bg-light">
            <div className="cat-text">
               <h3>Máy tính xách tay</h3>
               <p>Hiệu suất phòng thu</p>
            </div>
            <img src="/images/laptop.png" alt="Laptops" className="cat-img-right" style={{maxHeight:'200px'}} />
          </div>
          <div className="cat-row-2">
            <div className="cat-card bg-gray">
              <div className="cat-text">
                 <h3>Âm thanh</h3>
              </div>
              <div className="square-img" style={{background: '#111'}}>
                  <img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200" alt="Audio" />
              </div>
            </div>
            <div className="cat-card bg-peach">
              <div className="cat-text">
                 <h3>Thiết bị đeo</h3>
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
             <p>Tích hợp các lõi AI mang lại 15 nghìn tỷ hoạt động mỗi giây để tích hợp máy học liền mạch.</p>
          </div>
          <div className="feature-item">
            <div className="f-icon">⚡</div>
             <h4>Sạc nhanh 2.0</h4>
             <p>Cung cấp năng lượng chính xác, sạc đầy 50% chỉ trong dưới 12 phút mà không làm giảm tuổi thọ pin.</p>
          </div>
          <div className="feature-item">
            <div className="f-icon">🛡️</div>
             <h4>Bảo mật phần cứng</h4>
             <p>Vùng an toàn chuyên dụng đảm bảo dữ liệu sinh trắc học và khóa mã hóa của bạn không bao giờ rời khỏi thiết bị.</p>
          </div>
        </div>
      </section>

      {/* Featured Hardware */}
      <section className="container featured-hardware">
        <div className="fh-header">
          <div>
             <h2>Sản phẩm nổi bật</h2>
             <p>Được thiết kế cho quy trình làm việc chuyên nghiệp.</p>
          </div>
           <a href="#" className="link-all" onClick={(e)=>e.preventDefault()}>Xem toàn bộ danh mục</a>
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
                <span className="fh-price">29.990.000 đ</span>
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
                <span className="fh-price">7.490.000 đ</span>
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
                <span className="fh-price">18.990.000 đ</span>
                <button className="btn-icon">🛒</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container newsletter-content">
           <h2>Luôn dẫn đầu công nghệ.</h2>
           <p>Tham gia cùng hơn 50.000+ người đam mê công nghệ để nhận quyền truy cập sớm độc quyền vào các đợt mở bán phần cứng.</p>
           <div className="nl-form">
             <input type="email" placeholder="Nhập email của bạn" />
             <button className="btn-primary" style={{backgroundColor: 'white', color: 'var(--primary)'}}>Đăng ký</button>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
