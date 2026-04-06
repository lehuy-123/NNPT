import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/product.service';
import { formatCurrency } from '../utils/format';
import './Category.css';

const Category = ({ isDeals }) => {
  const { name } = useParams();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', isDeals ? 'deals' : name],
    queryFn: () => getProducts(isDeals ? 'deals' : name)
  });

  const title = isDeals 
    ? "Ưu đãi đặc biệt" 
    : name === 'smartphones' ? 'Điện thoại' 
    : name === 'laptops' ? 'Máy tính xách tay'
    : name === 'wearables' ? 'Thiết bị đeo'
    : name === 'audio' ? 'Âm thanh'
    : name === 'accessories' ? 'Phụ kiện'
    : name 
      ? name.charAt(0).toUpperCase() + name.slice(1) 
      : "Toàn bộ sản phẩm";
      
  const desc = isDeals 
    ? "Ưu đãi giới hạn cho các thiết bị hàng đầu." 
    : "Các thuật toán hiệu năng được tinh chỉnh cho quy trình làm việc của bạn.";

  const bannerMap = {
    'smartphones': '/images/smartphone_banner.png',
    'laptops': '/images/laptop_banner.png',
    'wearables': '/images/watch_banner.png',
    'audio': '/images/audio_banner.png',
    'accessories': '/images/accessories_banner.png',
  };

  const bannerImg = isDeals 
    ? 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=1600' 
    : bannerMap[name] || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600';

  return (
    <div className="category-page">
      <div className="category-header" style={{
         backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bannerImg})`,
         backgroundSize: 'cover',
         backgroundPosition: 'center',
         height: '400px',
         display: 'flex',
         flexDirection: 'column',
         justifyContent: 'center',
         alignItems: 'center',
         color: 'white',
         textAlign: 'center',
         marginBottom: '3rem'
      }}>
         <h1 style={{fontSize: '4rem', fontWeight: 900, letterSpacing: '2px', textShadow: '2px 4px 10px rgba(0,0,0,0.5)'}}>{title.toUpperCase()}</h1>
         <p style={{fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', textShadow: '1px 2px 5px rgba(0,0,0,0.5)'}}>{desc}</p>
      </div>
      
      <div className="container category-layout">
         {/* Thanh Filter bên trái */}
         <aside className="cat-sidebar">
             <h3>Bộ lọc</h3>
             <div className="filter-group">
                <h4>Khoảng giá</h4>
                <label><input type="checkbox"/> Dưới 10.000.000 đ</label>
                <label><input type="checkbox"/> 10tr - 20tr đ</label>
                <label><input type="checkbox"/> 20tr - 40tr đ</label>
                <label><input type="checkbox"/> Trên 40.000.000 đ</label>
            </div>
             <div className="filter-group">
                <h4>Trạng thái</h4>
                <label><input type="checkbox"/> Còn hàng</label>
                <label><input type="checkbox"/> Đặt trước</label>
             </div>
             <div className="filter-group">
                <h4>Tính năng</h4>
                <label><input type="checkbox"/> Dòng Pro</label>
                <label><input type="checkbox"/> Chip A1</label>
                <label><input type="checkbox"/> Vỏ Titanium</label>
             </div>
         </aside>

         {/* Lưới sản phẩm bên phải */}
         <div className="cat-grid-wrapper">
             <div className="cat-controls">
                 <span>Hiển thị danh sách thiết bị hiệu năng cao</span>
                 <select className="sort-select">
                   <option>Sắp xếp: Nổi bật</option>
                   <option>Giá: Thấp đến Cao</option>
                   <option>Giá: Cao đến Thấp</option>
                   <option>Mới nhất</option>
                 </select>
             </div>
             
             {/* Sử dụng lại class fh-grid từ trang chủ */}
             <div className="fh-grid cat-products-grid">
                  {isLoading && <p style={{gridColumn:'span 3', textAlign:'center', marginTop:'3rem', color:'var(--text-muted)'}}>Đang kết nối tới máy chủ... Đang tải dữ liệu thiết bị...</p>}
                  {!isLoading && products?.length === 0 && (
                      <p style={{gridColumn:'span 3', textAlign:'center', marginTop:'3rem', color:'var(--text-muted)'}}>Không tìm thấy sản phẩm nào trong danh mục "{title}". Hãy quay lại sau!</p>
                  )}
                 {products?.map((product, i) => (
                    <div className="fh-card" key={product._id || i}>
                       {i === 0 && <div className="card-tag tag-new">MỚI</div>}
                      {i === 2 && isDeals && <div className="card-tag tag-limited">-15%</div>}
                      
                      <Link to={`/product/${product._id}`} style={{textDecoration:'none', color:'inherit', display:'block'}}>
                        <div className="fh-img">
                          <img src={product.images && product.images.length > 0 ? product.images[0] : "/images/phone.png"} alt={product.name} />
                        </div>
                        <div className="fh-info">
                          <span className="fh-category" style={{textTransform: 'uppercase'}}>{product.category?.name || title}</span>
                          <h4>{product.name}</h4>
                           <div className="fh-specs">
                             <span>Hiệu năng cao</span>
                             <span>Chuyên nghiệp</span>
                           </div>
                          
                          <div className="fh-footer">
                             <span className="fh-price">{formatCurrency(product.price)}</span>
                             <button className="btn-icon" onClick={(e)=>{
                               e.preventDefault(); 
                               alert(`Đã thêm ${product.name} vào giỏ hàng!`);
                             }}>🛒</button>
                          </div>
                        </div>
                      </Link>
                    </div>
                 ))}
             </div>

             <div className="pagination">
                 <button className="btn-secondary">Tải thêm sản phẩm &darr;</button>
             </div>
         </div>
      </div>
    </div>
  );
};

export default Category;
