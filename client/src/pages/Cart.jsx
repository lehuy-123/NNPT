import React, { useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, checkoutCart } from '../services/cart.service';
import { AuthContext } from '../context/AuthContext';
import { formatCurrency } from '../utils/format';
import './Cart.css';

const Cart = () => {
   const { user } = useContext(AuthContext);
   const queryClient = useQueryClient();
   const navigate = useNavigate();
   const [showQR, setShowQR] = useState(false);

   const { data: cartData, isLoading } = useQuery({
      queryKey: ['cart'],
      queryFn: getCart,
      enabled: !!user
   });

   const removeMut = useMutation({
      mutationFn: removeFromCart,
      onSuccess: () => queryClient.invalidateQueries(['cart'])
   });

   const checkoutMut = useMutation({
      mutationFn: checkoutCart,
      onSuccess: () => {
         queryClient.invalidateQueries(['cart']);
         setShowQR(false);
         alert('Thanh toán thành công! Đơn hàng của bạn đã được ghi nhận.');
         navigate('/profile');
      }
   });

   if (!user) {
      return (
         <div style={{padding:'10rem', textAlign:'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
            <h2 style={{color:'var(--text-muted)'}}>Từ chối truy cập</h2>
            <p>Bạn phải đăng nhập để truy cập vào hệ thống Giỏ hàng.</p>
            <button className="btn-primary" onClick={() => navigate('/auth')}>Đăng nhập tại đây</button>
         </div>
      );
   }

   if (isLoading) return <div style={{padding:'10rem', textAlign:'center', color:'var(--text-muted)'}}>Đang tải dữ liệu giỏ hàng...</div>;

   const items = cartData?.items || [];
   const subtotal = cartData?.totalPrice || 0;
   const tax = subtotal * 0.08;
   const total = subtotal + tax;

   return (
      <div className="container cart-page">
         <div className="cart-header">
            <h1>Giỏ hàng</h1>
            <p className="text-muted">Xem lại các lựa chọn phần cứng hiệu năng cao của bạn.</p>
         </div>
         <div className="cart-layout">
            <div className="cart-items-section">
               {items.length === 0 && <p style={{padding:'2rem', border:'1px solid #eee', borderRadius:'8px', textAlign:'center', color:'var(--text-muted)'}}>Giỏ hàng của bạn hiện đang trống.</p>}
               {items.map(item => (
                  <div className="cart-item" key={item._id}>
                     <img src={item.product?.images?.[0] || '/images/phone.png'} alt={item.product?.name} />
                     <div className="ci-info">
                        <h3>{item.product?.name}</h3>
                        <p style={{textTransform:'uppercase', fontWeight: 600, fontSize:'0.8rem', color:'var(--primary)'}}>{item.variantName}</p>
                        <div className="ci-actions">
                           <div className="qty-box">
                              <span>-</span> <span>{item.quantity}</span> <span>+</span>
                           </div>
                           <button className="btn-remove" onClick={() => removeMut.mutate(item._id)} disabled={removeMut.isPending}>🗑️ Xóa</button>
                        </div>
                     </div>
                     <div className="ci-price">{formatCurrency(item.price * item.quantity)}</div>
                  </div>
               ))}
               
               {items.length > 0 && (
                  <div className="promo-box">
                     <h4>MÃ KHUYẾN MÃI</h4>
                     <div className="promo-input">
                        <input type="text" placeholder="Nhập mã giảm giá" />
                        <button className="btn-secondary apply-btn">Áp dụng</button>
                     </div>
                  </div>
               )}
            </div>

            <div className="cart-summary-section">
               <div className="summary-card">
                  <h3>Tóm tắt đơn hàng</h3>
                  <div className="summary-row"><span>Tạm tính</span> <strong>{formatCurrency(subtotal)}</strong></div>
                  <div className="summary-row"><span>Phí vận chuyển dự kiến</span> <strong>MIỄN PHÍ</strong></div>
                  <div className="summary-row"><span>Thuế dự kiến (8%)</span> <strong>{formatCurrency(tax)}</strong></div>
                  <hr />
                  <div className="summary-total">
                     <span>Tổng cộng</span>
                     <div className="t-right">
                        <strong className="text-primary">{formatCurrency(total)}</strong>
                        <small>ĐÃ BAO GỒM VAT</small>
                     </div>
                  </div>
                  <button className="btn-primary w-100 cart-checkout-btn" disabled={items.length === 0} onClick={() => setShowQR(true)}>Tiến hành thanh toán &rarr;</button>
                  <div className="payment-icons text-muted">
                    <span>💳 Visa</span> <span>🏦 Master</span> <span>📲 Apple</span>
                  </div>
               </div>
               <div className="guarantee-box">
                  <span className="g-icon">🛡️</span>
                  <div>
                    <strong>Cam kết từ Precision</strong>
                    <p>Mọi thiết bị đều trải qua quy trình kiểm tra 150 điểm.</p>
                  </div>
               </div>
            </div>
         </div>
         {showQR && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
                  <h3 style={{ marginBottom: '1rem', color: '#111' }}>Thanh toán QR an toàn</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>Vui lòng mở ứng dụng ngân hàng và quét mã VietQR bên dưới để thanh toán.</p>
                  
                  <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #eee' }}>
                     <img src={`https://img.vietqr.io/image/vpbank-0948737366-compact2.png?amount=${Math.round(total)}&addInfo=Checkout PrecisionTech&accountName=TINH TAM`} alt="VietQR Code" style={{ width: '100%', borderRadius: '8px' }} />
                  </div>
                  
                  <div style={{ textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.95rem', background: '#f0f4f8', padding: '1rem', borderRadius: '6px' }}>
                     <p style={{marginBottom: '0.4rem'}}><strong>Ngân hàng:</strong> VPBank</p>
                     <p style={{marginBottom: '0.4rem'}}><strong>Chủ thẻ:</strong> TINH TAM</p>
                     <p style={{marginBottom: '0.4rem'}}><strong>Số tài khoản:</strong> 0948737366</p>
                     <p><strong>Số tiền:</strong> <span style={{color: 'var(--primary)', fontWeight: 800}}>{formatCurrency(total)}</span></p>
                  </div>

                  <button className="btn-primary w-100" onClick={() => checkoutMut.mutate()} disabled={checkoutMut.isPending} style={{ marginBottom: '0.8rem', padding: '0.9rem' }}>
                     {checkoutMut.isPending ? 'Đang xác minh giao dịch...' : 'Tôi đã chuyển khoản thành công'}
                  </button>
                  <button className="btn-secondary w-100" onClick={() => setShowQR(false)} style={{ padding: '0.9rem', border: 'none', background: '#f1f1f1', color: '#333' }}>Hủy giao dịch</button>
               </div>
            </div>
         )}
      </div>
   );
};

export default Cart;
