import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">PrecisionTech</div>
            <p className="footer-desc">
              Thiết kế thế hệ phần cứng mạnh mẽ, đạt tiêu chuẩn phòng thí nghiệm cho thế hệ sáng tạo hiện đại.
            </p>
          </div>
          <div className="footer-col">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><Link to="/">Thông tin vận chuyển</Link></li>
              <li><Link to="/">Chính sách đổi trả</Link></li>
              <li><Link to="/">Trung tâm hỗ trợ</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Pháp lý</h4>
            <ul>
              <li><Link to="/">Chính sách bảo mật</Link></li>
              <li><Link to="/">Điều khoản dịch vụ</Link></li>
              <li><Link to="/">Doanh nghiệp</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Social</h4>
            <ul style={{ display: 'flex', gap: '1rem' }}>
              <li><a href="#">🌐</a></li>
              <li><a href="#">📸</a></li>
              <li><a href="#">🐦</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2024 PrecisionTech Industrial Excellence. Bản quyền thuộc về Tinh Tam.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
