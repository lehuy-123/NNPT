import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductById } from '../services/product.service';
import { addToCart } from '../services/cart.service';
import { AuthContext } from '../context/AuthContext';
import { formatCurrency } from '../utils/format';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [selectedVariant, setSelectedVariant] = useState(null);

  const { data: product, isLoading, error } = useQuery({
     queryKey: ['product', id],
     queryFn: () => getProductById(id)
  });

  const addToCartMut = useMutation({
     mutationFn: addToCart,
     onSuccess: () => {
        alert('Thanh công! Sản phẩm đã được thêm vào giỏ hàng.');
        queryClient.invalidateQueries(['cart']);
     }
  });

  const handleCreateOrder = () => {
     if (!user) {
        alert('Bạn cần đăng nhập để thực hiện hành động này.');
        navigate('/auth');
        return;
     }
     addToCartMut.mutate({
         productId: product._id,
         quantity: 1,
         variantName: selectedVariant?.name || 'Standard',
         price: Number(product.price) + (selectedVariant?.additionalPrice || 0)
     });
  };

  useEffect(() => {
     if (product?.variants?.length > 0) {
         setSelectedVariant(product.variants[0]);
     }
  }, [product]);

  if (isLoading) return <div style={{padding: '10rem', textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-muted)'}}>Connecting to MongoDB... Retrieving hardware schematics...</div>;
  if (error || !product) return <div style={{padding: '10rem', textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-muted)'}}>Hardware configuration not found. It may have been archived.</div>;

  return (
    <div className="container p-detail-page">
      <div className="pd-main">
        <div className="pd-images">
          <div className="main-img">
            <img src={product.images && product.images.length > 0 ? product.images[0] : "/images/phone.png"} alt={product.name} />
          </div>
          <div className="thumb-grid">
            <div className="thumb"><img src={product.images && product.images[0] ? product.images[0] : "/images/phone.png"} alt="T1" /></div>
            <div className="thumb"><img src="/images/phone.png" alt="T2" /></div>
            <div className="thumb"><img src="/images/phone.png" alt="T3" /></div>
            <div className="thumb more-thumb"><span>+2</span></div>
          </div>
        </div>

        <div className="pd-info">
          <div className="pd-badges">
            <span className="badge-new">SẢN PHẨM MỚI</span>
            <span className="badge-rating" style={{textTransform:'uppercase', background: '#e0f2fe', color: '#0284c7'}}>{product.category?.name || 'TECHNOLOGY'}</span>
          </div>
          <h1 className="pd-title">{product.name}</h1>
          <p className="pd-desc">{product.description || "The pinnacle of engineering. Built for the future of mobile performance."}</p>
          
          <div className="pd-variants">
            <h4>Màu sắc: <span className="text-muted" style={{fontWeight: 400}}>Đen nhám (Obsidian)</span></h4>
            <div className="color-options">
               <div className="color-circle active" style={{background: '#222'}}></div>
               <div className="color-circle" style={{background: '#888'}}></div>
               <div className="color-circle" style={{background: '#e0e0e0'}}></div>
               <div className="color-circle" style={{background: '#093a7a'}}></div>
            </div>
            
            
            {product.variants && product.variants.length > 0 && (
               <>
                  <h4 style={{marginTop: '1.5rem'}}>Dung lượng lưu trữ / Cấu hình</h4>
                  <div className="storage-options">
                    {product.variants.map((variant, idx) => (
                       <div 
                         key={idx} 
                         className={`storage-box ${selectedVariant?.name === variant.name ? 'active' : ''}`}
                         onClick={() => setSelectedVariant(variant)}
                       >
                         <span className="s-size">{variant.name}</span>
                         <span className="s-desc">{variant.label}</span>
                       </div>
                    ))}
                  </div>
               </>
            )}
          </div>

          <div className="pd-buybox">
            <div className="price-row">
              <div className="price-wrap">
                <span className="current-price">{formatCurrency(Number(product.price) + (selectedVariant?.additionalPrice || 0))}</span>
              </div>
              <span className="limited-time">TÌNH TRẠNG: {product.stock > 0 ? 'Còn hàng' : 'Liên hệ'} ({product.stock || 0})</span>
            </div>
            <button className="btn-primary w-100 pd-btn" onClick={handleCreateOrder} disabled={addToCartMut.isPending}>
               {addToCartMut.isPending ? 'Đang xử lý...' : 'Thêm vào giỏ hàng'}
            </button>
            <button className="btn-secondary w-100 pd-btn">Tìm cửa hàng gần bạn</button>
            <div className="pd-guarantees">
              <span>🚚 Miễn phí vận chuyển hỏa tốc</span>
              <span>🛡️ Bảo hành chính hãng 2 năm</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pd-lower">
        <div className="pd-specs">
          <h3>Thông số kỹ thuật</h3>
          <ul className="spec-list">
            <li><span>Bộ vi xử lý</span> <span>Chip A1 4nm 8 nhân</span></li>
            <li><span>Màn hình</span> <span>6.7" OLED Liquid Retina (120Hz)</span></li>
            <li><span>Camera</span> <span>50MP Chính | 12MP Siêu rộng | 10MP Tele</span></li>
            <li><span>Pin</span> <span>5,000 mAh (Sạc nhanh 65W)</span></li>
            <li><span>Hệ điều hành</span> <span>PrecisionOS 14 (Tiếng Việt)</span></li>
          </ul>
        </div>
        <div className="pd-sustainability">
           <div className="sus-icon">🌿</div>
           <h3>Cam kết về môi trường</h3>
           <p>Alpha-X là thiết kế xanh nhất của chúng tôi từ trước đến nay. Khung máy làm từ 100% titan tái chế, và pin sử dụng 100% coban tái chế. Chúng tôi đã giảm 40% bao bì và loại bỏ hoàn toàn màng lọc nhựa.</p>
           <a href="#">Read our 2024 Impact Report &rarr;</a>
        </div>
      </div>

      <div className="pd-reviews">
        <div className="review-header">
           <div>
             <h3>Đánh giá từ người dùng</h3>
             <p style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>★★★★★ <strong>4.9/5 dựa trên 1,240 lượt đánh giá</strong></p>
           </div>
           <button className="btn-secondary" style={{background: '#111', color: 'white'}}>Viết đánh giá</button>
        </div>
        <div className="review-grid">
           <div className="review-card">
              <div className="rc-top"><span style={{color: '#9e3200'}}>★★★★★</span> <span className="r-date">2 days ago</span></div>
              <h4>Incredible Performance</h4>
              <p>The new A1 chip is a beast. Everything from video editing to heavy gaming feels buttery smooth. The titanium finish is also much more durable than I expected.</p>
              <div className="r-user"><span className="r-avatar">MK</span> <strong>Marcus K.</strong></div>
           </div>
           <div className="review-card">
              <div className="rc-top"><span style={{color: '#9e3200'}}>★★★★★</span> <span className="r-date">1 week ago</span></div>
              <h4>Best Camera in Class</h4>
              <p>I'm a professional photographer and the RAW capability on this phone is mind-blowing. The low light performance has finally caught up to dedicated mirrorless cameras.</p>
              <div className="r-user"><span className="r-avatar" style={{background: '#fadba7'}}>SR</span> <strong>Sarah R.</strong></div>
           </div>
           <div className="review-card">
              <div className="rc-top"><span style={{color: '#9e3200'}}>★★★★☆</span> <span className="r-date">2 weeks ago</span></div>
              <h4>Sleek but Expensive</h4>
              <p>The design is flawless. Only giving 4 stars because the 1TB upgrade is quite pricey, but the hardware itself is absolutely top-tier. Highly recommend if you have the budget.</p>
              <div className="r-user"><span className="r-avatar" style={{background: '#d4e4fa'}}>JT</span> <strong>James T.</strong></div>
           </div>
        </div>
        <div className="r-viewall">
          <a href="#" style={{color: 'var(--primary)', fontWeight: 600, textDecoration: 'none'}}>Xem tất cả 1,240 đánh giá &darr;</a>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
