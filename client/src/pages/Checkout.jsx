import React from 'react';
import './Checkout.css';

const Checkout = () => {
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
                  <div className="mini-cart-item">
                     <img src="/images/laptop.png" alt="L" />
                     <div>
                        <strong>Precision X14 Laptop</strong>
                        <p>32GB RAM / 1TB SSD</p>
                        <span>$2,499.00</span>
                     </div>
                  </div>
                  <div className="mini-cart-item">
                     <img src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100" alt="B" />
                     <div>
                        <strong>SonicAir Buds Pro</strong>
                        <p>Active Noise Cancelling</p>
                        <span>$199.00</span>
                     </div>
                  </div>
                  <hr/>
                  <div className="summary-row"><span>Subtotal</span> <span>$2,698.00</span></div>
                  <div className="summary-row"><span>Shipping</span> <span className="text-primary" style={{fontWeight:700}}>Free</span></div>
                  <div className="summary-row"><span>Tax</span> <span>$215.84</span></div>
                  <div className="summary-total" style={{marginTop:'1.5rem'}}>
                     <span style={{fontSize:'1.2rem', fontWeight:800}}>Total</span> 
                     <strong style={{fontSize:'1.8rem', color:'var(--primary)'}}>$2,913.84</strong>
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
                  <button className="btn-primary w-100 checkout-submit">Order Now &rarr;</button>
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
