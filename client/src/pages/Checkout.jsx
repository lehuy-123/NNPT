import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getCart, checkoutCart } from '../services/cart.service';
import { formatCurrency } from '../utils/format';
import './Checkout.css';

const Checkout = () => {
   const navigate = useNavigate();
   const queryClient = useQueryClient();

   const { data: cartData, isLoading } = useQuery({
       queryKey: ['cart'],
       queryFn: getCart
   });

   const checkoutMut = useMutation({
       mutationFn: checkoutCart,
       onSuccess: () => {
           queryClient.invalidateQueries(['cart']);
           queryClient.invalidateQueries(['orders']);
            alert('Đặt hàng thành công!');
            navigate('/profile');
       },
        onError: (err) => {
            alert('Lỗi đặt hàng: ' + (err.response?.data?.error || err.message));
        }
   });

   const cart = cartData?.data;
   const items = cart?.items || [];
   const subtotal = cart?.totalPrice || 0;
   const tax = subtotal * 0.08;
   const total = subtotal + tax;

   if (isLoading) return <div className="container" style={{padding:'2rem'}}>Đang tải thông tin thanh toán...</div>;
   return (
      <div className="container checkout-page">
          <div className="checkout-header">
            <h1>Thanh toán an toàn</h1>
            <p className="text-muted">Bước 2/3: Vận chuyển & Thanh toán</p>
          </div>
         <div className="checkout-layout">
             <div className="co-left">
                <div className="co-card">
                   <h3>🚚 Thông tin giao hàng</h3>
                  <div className="form-grid">
                      <div className="fg-group">
                         <label>TÊN</label>
                         <input type="text" placeholder="Nhật" defaultValue="Nhật" />
                      </div>
                      <div className="fg-group">
                         <label>HỌ</label>
                         <input type="text" placeholder="Huy" defaultValue="Huy" />
                      </div>
                      <div className="fg-group full-w">
                         <label>ĐỊA CHỈ EMAIL</label>
                         <input type="email" placeholder="huy.dev@precision.tech" defaultValue="huy.dev@precision.tech" />
                      </div>
                      <div className="fg-group full-w">
                         <label>ĐỊA CHỈ GIAO HÀNG</label>
                         <input type="text" placeholder="123 Đường Sáng Tạo, Quận 1" defaultValue="123 Đường Sáng Tạo, Quận 1"/>
                      </div>
                      <div className="fg-group">
                         <label>THÀNH PHỐ</label>
                         <input type="text" placeholder="Hồ Chí Minh" defaultValue="Hồ Chí Minh"/>
                      </div>
                      <div className="fg-group">
                         <label>MÃ BƯU ĐIỆN</label>
                         <input type="text" placeholder="700000" defaultValue="700000"/>
                      </div>
                  </div>
               </div>

                <div className="co-card">
                   <h3>Phương thức vận chuyển</h3>
                  <div className="delivery-options">
                     <label className="radio-label active">
                        <div className="radio-left">
                           <input type="radio" name="delivery" defaultChecked />
                            <div>
                               <strong>Giao hàng tiêu chuẩn</strong>
                               <p className="text-muted">3-5 ngày làm việc</p>
                            </div>
                        </div>
                         <span className="d-price">Miễn phí</span>
                     </label>
                     <label className="radio-label">
                        <div className="radio-left">
                           <input type="radio" name="delivery" />
                            <div>
                               <strong>Giao hàng hỏa tốc</strong>
                               <p className="text-muted">Ngày làm việc tiếp theo</p>
                            </div>
                        </div>
                         <span className="d-price">300.000 đ</span>
                     </label>
                  </div>
               </div>
            </div>

                <div className="co-right">
                   <div className="co-card order-summary">
                      <h3>Tóm tắt đơn hàng</h3>
                      {items.length === 0 && <p>Giỏ hàng trống.</p>}
                  {items.map(item => (
                     <div className="mini-cart-item" key={item._id}>
                        <img src={item.product?.images?.[0] || "/images/phone.png"} alt="Product" />
                        <div>
                           <strong>{item.product?.name}</strong>
                           <p>{item.variantName} x {item.quantity}</p>
                            <span>{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                     </div>
                  ))}
                  <hr/>
                   <div className="summary-row"><span>Tạm tính</span> <span>{formatCurrency(subtotal)}</span></div>
                   <div className="summary-row"><span>Vận chuyển</span> <span className="text-primary" style={{fontWeight:700}}>Miễn phí</span></div>
                   <div className="summary-row"><span>Tax (8%)</span> <span>{formatCurrency(tax)}</span></div>
                   <div className="summary-total" style={{marginTop:'1.5rem'}}>
                      <span style={{fontSize:'1.2rem', fontWeight:800}}>Tổng cộng</span>                      <strong style={{fontSize:'1.8rem', color:'var(--primary)'}}>{formatCurrency(total)}</strong>
                   </div>
               </div>

                <div className="co-card payment-method">
                   <h3>Phương thức thanh toán</h3>
                  <div className="payment-options">
                     <label className="radio-label active">
                        <div className="radio-left">
                            <div className="pm-icon" style={{background: '#a50064', color:'white'}}>MoMo</div>
                            <strong>Ví điện tử MoMo</strong>
                         </div>
                        <input type="radio" name="payment" defaultChecked />
                     </label>
                     <label className="radio-label">
                        <div className="radio-left">
                           <div className="pm-icon" style={{background: '#0055a4', color:'white'}}>VNP</div>
                           <strong>VNPay QR</strong>
                        </div>
                        <input type="radio" name="payment" />
                     </label>
                     <label className="radio-label">
                        <div className="radio-left">
                            <div className="pm-icon" style={{background: '#333', color:'white', fontSize:'0.7rem'}}>COD</div>
                            <strong>Thanh toán khi nhận hàng (COD)</strong>
                         </div>
                        <input type="radio" name="payment" />
                     </label>
                  </div>
                   <button 
                      className="btn-primary w-100 checkout-submit" 
                      onClick={() => checkoutMut.mutate()}
                      disabled={checkoutMut.isPending || items.length === 0}
                   >
                      {checkoutMut.isPending ? 'Đang xử lý...' : 'Đặt hàng ngay 🚀'}
                   </button>
                   <p className="secure-badge text-center text-muted">
                     🔒 GIAO DỊCH MÃ HÓA SSL AN TOÀN. DỮ LIỆU CỦA BẠN ĐƯỢC BẢO VỆ THEO TIÊU CHUẨN PRECISIONTECH.
                   </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Checkout;
