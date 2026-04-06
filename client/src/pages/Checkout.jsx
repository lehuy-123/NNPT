import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getCart, checkoutCart } from '../services/cart.service';
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
           alert('Order placed successfully!');
           navigate('/profile');
       },
       onError: (err) => {
           alert('Checkout failed: ' + (err.response?.data?.error || err.message));
       }
   });

   const cart = cartData?.data;
   const items = cart?.items || [];
   const subtotal = cart?.totalPrice || 0;
   const tax = subtotal * 0.08;
   const total = subtotal + tax;

   if (isLoading) return <div className="container" style={{padding:'2rem'}}>Loading checkout...</div>;
   return (
      <div className="container checkout-page">
         <div className="checkout-header">
           <h1>Secure Checkout</h1>
           <p className="text-muted">Step 2 of 3: Shipping &amp; Payment</p>
         </div>
         <div className="checkout-layout">
            <div className="co-left">
               <div className="co-card">
                  <h3>🚚 Shipping Information</h3>
                  <div className="form-grid">
                     <div className="fg-group">
                        <label>FIRST NAME</label>
                        <input type="text" placeholder="John" defaultValue="John" />
                     </div>
                     <div className="fg-group">
                        <label>LAST NAME</label>
                        <input type="text" placeholder="Doe" defaultValue="Doe" />
                     </div>
                     <div className="fg-group full-w">
                        <label>EMAIL ADDRESS</label>
                        <input type="email" placeholder="john.doe@precision.tech" defaultValue="john.doe@precision.tech" />
                     </div>
                     <div className="fg-group full-w">
                        <label>DELIVERY ADDRESS</label>
                        <input type="text" placeholder="123 Innovation Drive, Tech District" defaultValue="123 Innovation Drive, Tech District"/>
                     </div>
                     <div className="fg-group">
                        <label>CITY</label>
                        <input type="text" placeholder="Ho Chi Minh City" defaultValue="Ho Chi Minh City"/>
                     </div>
                     <div className="fg-group">
                        <label>POSTAL CODE</label>
                        <input type="text" placeholder="700000" defaultValue="700000"/>
                     </div>
                  </div>
               </div>

               <div className="co-card">
                  <h3>Delivery Method</h3>
                  <div className="delivery-options">
                     <label className="radio-label active">
                        <div className="radio-left">
                           <input type="radio" name="delivery" defaultChecked />
                           <div>
                              <strong>Standard Shipping</strong>
                              <p className="text-muted">3-5 business days</p>
                           </div>
                        </div>
                        <span className="d-price">Free</span>
                     </label>
                     <label className="radio-label">
                        <div className="radio-left">
                           <input type="radio" name="delivery" />
                           <div>
                              <strong>Express Delivery</strong>
                              <p className="text-muted">Next business day</p>
                           </div>
                        </div>
                        <span className="d-price">$15.00</span>
                     </label>
                  </div>
               </div>
            </div>

            <div className="co-right">
               <div className="co-card order-summary">
                  <h3>Order Summary</h3>
                  {items.length === 0 && <p>Your cart is empty.</p>}
                  {items.map(item => (
                     <div className="mini-cart-item" key={item._id}>
                        <img src={item.product?.images?.[0] || "/images/phone.png"} alt="Product" />
                        <div>
                           <strong>{item.product?.name}</strong>
                           <p>{item.variantName} x {item.quantity}</p>
                           <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                     </div>
                  ))}
                  <hr/>
                  <div className="summary-row"><span>Subtotal</span> <span>${subtotal.toFixed(2)}</span></div>
                  <div className="summary-row"><span>Shipping</span> <span className="text-primary" style={{fontWeight:700}}>Free</span></div>
                  <div className="summary-row"><span>Tax (8%)</span> <span>${tax.toFixed(2)}</span></div>
                  <div className="summary-total" style={{marginTop:'1.5rem'}}>
                     <span style={{fontSize:'1.2rem', fontWeight:800}}>Total</span> 
                     <strong style={{fontSize:'1.8rem', color:'var(--primary)'}}>${total.toFixed(2)}</strong>
                  </div>
               </div>

               <div className="co-card payment-method">
                  <h3>Payment Method</h3>
                  <div className="payment-options">
                     <label className="radio-label active">
                        <div className="radio-left">
                           <div className="pm-icon" style={{background: '#a50064', color:'white'}}>MoMo</div>
                           <strong>MoMo E-Wallet</strong>
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
                           <strong>Cash on Delivery</strong>
                        </div>
                        <input type="radio" name="payment" />
                     </label>
                  </div>
                  <button 
                     className="btn-primary w-100 checkout-submit" 
                     onClick={() => checkoutMut.mutate()}
                     disabled={checkoutMut.isPending || items.length === 0}
                  >
                     {checkoutMut.isPending ? 'Processing...' : 'Order Now 🚀'}
                  </button>
                  <p className="secure-badge text-center text-muted">
                    🔒 SECURE SSL ENCRYPTED TRANSACTION. YOUR DATA IS PROTECTED UNDER PRECISIONTECH PRIVACY STANDARDS.
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Checkout;
