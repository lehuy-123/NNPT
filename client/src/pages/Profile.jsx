import React, { useState, useContext, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/product.service';
import { getAllOrders, getMyOrders, updateOrderStatus } from '../services/order.service';
import io from 'socket.io-client';
import './Profile.css';

const Profile = ({ enforceAdmin }) => {
   const queryClient = useQueryClient();
   const navigate = useNavigate();
   const { user, logout } = useContext(AuthContext);
   
   const isAdmin = user?.role === 'admin';
   const [activeTab, setActiveTab] = useState(enforceAdmin ? 'inventory' : 'dashboard');
   const [editingId, setEditingId] = useState(null);
   
   const [formData, setFormData] = useState({
      name: '', price: '', description: 'Engineered for absolute performance.', categorySlug: 'smartphones', image: '/images/phone.png', variantsStr: '256GB:0, 512GB:200, 1TB:450'
   });

   useEffect(() => {
       if (!user) {
           navigate('/auth');
       } else if (enforceAdmin && !isAdmin) {
           navigate('/profile');
       }
   }, [user, isAdmin, enforceAdmin, navigate]);

   useEffect(() => {
       if (isAdmin) {
           const socket = io('http://localhost:5000');
           socket.on('new_order', (data) => {
               alert(`🔔 ${data.message} - Total: $${data.totalAmount}`);
               queryClient.invalidateQueries(['orders']);
           });
           return () => socket.disconnect();
       }
   }, [isAdmin, queryClient]);

   if (!user || (enforceAdmin && !isAdmin)) return null;

   const { data: allProducts, isLoading } = useQuery({
      queryKey: ['products'],
      queryFn: () => getProducts(),
      enabled: isAdmin && activeTab === 'inventory'
   });

   const createMut = useMutation({ mutationFn: createProduct, onSuccess: () => { queryClient.invalidateQueries(['products']); resetForm(); } });
   const updateMut = useMutation({ mutationFn: updateProduct, onSuccess: () => { queryClient.invalidateQueries(['products']); resetForm(); } });
   const deleteMut = useMutation({ mutationFn: deleteProduct, onSuccess: () => { queryClient.invalidateQueries(['products']); } });

   const { data: allOrders, isLoading: ordersLoading } = useQuery({
      queryKey: ['orders'],
      queryFn: isAdmin ? getAllOrders : getMyOrders,
      enabled: activeTab === 'orders'
   });
   
   const updateStatusMut = useMutation({ mutationFn: updateOrderStatus, onSuccess: () => { queryClient.invalidateQueries(['orders']); } });

   const resetForm = () => {
       setEditingId(null);
       setFormData({ name: '', price: '', description: 'Engineered for absolute performance.', categorySlug: 'smartphones', image: '/images/phone.png', variantsStr: '256GB:0, 512GB:200, 1TB:450' });
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      
      const parsedVariants = formData.variantsStr ? formData.variantsStr.split(',').map(v => {
          if(!v.trim()) return null;
          const [name, priceStr] = v.split(':').map(s => s.trim());
          const additionalPrice = Number(priceStr) || 0;
          return { name, additionalPrice, label: additionalPrice === 0 ? 'Standard' : `+$${additionalPrice}` };
      }).filter(Boolean) : [];

      const payload = { ...formData, variants: parsedVariants };

      if (editingId) {
          updateMut.mutate({ id: editingId, data: payload });
      } else {
          createMut.mutate(payload);
      }
   };

   const handleEdit = (prod) => {
       setEditingId(prod._id);
       setFormData({
           name: prod.name, price: prod.price, description: prod.description, categorySlug: prod.category?.slug || 'smartphones', image: prod.images[0] || '/images/phone.png',
           variantsStr: prod.variants?.map(v => `${v.name}:${v.additionalPrice}`).join(', ') || ''
       });
   };

   return (
      <div className="profile-layout">
         <aside className="sidebar">
            <div className="sb-header">
               <h2>{isAdmin ? 'Admin Panel' : 'My Account'}</h2>
               <p style={{color: 'var(--text-muted)'}}>System Overview</p>
            </div>
            <ul className="sb-nav">
               <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}><span>📊</span> Dashboard</li>
               {isAdmin && (
                  <li className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}><span>📦</span> Inventory CRUD</li>
               )}
               <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}><span>🛍️</span> Orders</li>
               <li><span>👥</span> Customers</li>
               <li><span>⚙️</span> Settings</li>
            </ul>
            <button className="btn-primary w-100 sb-footer-btn">Export Report</button>
         </aside>

         <main className="profile-main">
            <div className="top-profile-card">
               <div className="profile-info">
                  <img src="https://i.pravatar.cc/150?img=11" alt="User" className="avatar"/>
                  <div>
                     <h2>{user.name}</h2>
                     <p className="text-muted">{isAdmin ? 'System Administrator' : 'Enterprise User'}</p>
                     <div className="profile-tags">
                        <span>✉️ {user.email}</span>
                        <span>📍 San Francisco, CA</span>
                     </div>
                  </div>
               </div>
               <button className="btn-primary" onClick={() => { logout(); navigate('/auth'); }} style={{padding: '0.8rem 1.5rem', background: '#dc2626', borderColor: '#b91c1c'}}>Sign Out</button>
            </div>

            {activeTab === 'dashboard' && (
               <div className="profile-grid">
                  <div className="pg-left">
                     <div className="p-card">
                        <div className="pc-header"><h3>Active Tracking</h3><span className="order-id">ORDER #PT-88921</span></div>
                        <div className="tracking-bar">
                           <div className="track-line"></div>
                           <div className="track-step active"><div className="icon">✔</div><span>PROCESSED</span></div>
                           <div className="track-step active"><div className="icon">✔</div><span>SHIPPED</span></div>
                           <div className="track-step active" style={{opacity: 0.5}}><div className="icon">🚚</div><span>IN TRANSIT</span></div>
                           <div className="track-step"><div className="icon" style={{background:'#eee',color:'#aaa'}}>📦</div><span style={{color:'#aaa'}}>DELIVERED</span></div>
                        </div>
                        <div className="tracking-item">
                           <img src="/images/phone.png" alt="Phone" />
                           <div><strong>Titanium Pro X1 - 512GB</strong><p className="text-muted" style={{fontSize:'0.85rem'}}>Arrival estimated by Oct 24, 2024</p></div>
                           <span className="t-arrow">&gt;</span>
                        </div>
                     </div>
                  </div>
                  <div className="pg-right">
                     <div className="p-card">
                        <h3 className="settings-title" style={{fontSize: '0.8rem', letterSpacing: '1px', color: 'var(--text-muted)'}}>PROFILE SETTINGS</h3>
                        <div className="toggle-row"><span>🔔 Order Updates</span><div className="toggle active"><div className="knob"></div></div></div>
                        <div className="toggle-row"><span>🛡️ Two-Factor Auth</span><div className="toggle active"><div className="knob"></div></div></div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'inventory' && isAdmin && (
               <>
                  <div className="p-card" style={{marginBottom: '2rem'}}>
                     <h3 style={{marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom:'1rem'}}>{editingId ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
                     <form onSubmit={handleSubmit} style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem'}}>
                        <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                           <label style={{fontSize:'0.8rem', fontWeight:700}}>PRODUCT NAME</label>
                           <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{padding:'0.8rem', border:'1px solid #ddd', borderRadius:'4px'}} placeholder="e.g. PrecisionBook M2"/>
                        </div>
                        <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                           <label style={{fontSize:'0.8rem', fontWeight:700}}>PRICE ($)</label>
                           <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{padding:'0.8rem', border:'1px solid #ddd', borderRadius:'4px'}} placeholder="999"/>
                        </div>
                        <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                           <label style={{fontSize:'0.8rem', fontWeight:700}}>CATEGORY SLUG</label>
                           <select value={formData.categorySlug} onChange={e => setFormData({...formData, categorySlug: e.target.value})} style={{padding:'0.8rem', border:'1px solid #ddd', borderRadius:'4px'}}>
                              <option value="smartphones">Smartphones</option>
                              <option value="laptops">Laptops</option>
                              <option value="wearables">Wearables</option>
                              <option value="audio">Audio</option>
                              <option value="accessories">Accessories</option>
                           </select>
                        </div>
                        <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                           <label style={{fontSize:'0.8rem', fontWeight:700}}>VARIANTS (Name:PriceOffset)</label>
                           <input type="text" value={formData.variantsStr} onChange={e => setFormData({...formData, variantsStr: e.target.value})} style={{padding:'0.8rem', border:'1px solid #ddd', borderRadius:'4px'}} placeholder="e.g. 256GB:0, 512GB:200"/>
                        </div>
                        <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                           <label style={{fontSize:'0.8rem', fontWeight:700}}>IMAGE PATH</label>
                           <input type="text" required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} style={{padding:'0.8rem', border:'1px solid #ddd', borderRadius:'4px'}}/>
                        </div>
                        <div style={{gridColumn:'span 2', display:'flex', gap:'1rem'}}>
                           <button type="submit" className="btn-primary" disabled={createMut.isPending || updateMut.isPending}>
                              {editingId ? 'Update Product' : 'Publish Product to Store 🚀'}
                           </button>
                           {editingId && <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>}
                        </div>
                     </form>
                  </div>

                  <div className="p-card">
                     <h3 style={{marginBottom: '1rem'}}>📋 Inventory List</h3>
                     {isLoading ? <p>Loading...</p> : (
                        <table className="history-table">
                           <thead><tr><th>IMAGE</th><th>NAME</th><th>CATEGORY</th><th>PRICE</th><th>ACTIONS</th></tr></thead>
                           <tbody>
                              {allProducts?.map(prod => (
                                 <tr key={prod._id}>
                                    <td><img src={prod.images[0]} alt="" style={{width:'40px', height:'40px', objectFit:'contain'}}/></td>
                                    <td><strong>{prod.name}</strong></td>
                                    <td style={{textTransform:'capitalize'}}>{prod.category?.slug || 'N/A'}</td>
                                    <td>${Number(prod.price).toFixed(2)}</td>
                                    <td style={{display:'flex', gap:'0.5rem', marginTop:'1rem', border:'none'}}>
                                       <button onClick={() => handleEdit(prod)} style={{padding:'0.5rem 1rem', background:'#e0f2fe', color:'#0284c7', border:'none', borderRadius:'4px', cursor:'pointer', fontWeight:600}}>Edit</button>
                                       <button onClick={() => { if(window.confirm('Delete this product?')) deleteMut.mutate(prod._id); }} style={{padding:'0.5rem 1rem', background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:'4px', cursor:'pointer', fontWeight:600}}>Delete</button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     )}
                  </div>
               </>
            )}

            {activeTab === 'orders' && (
               <div className="p-card">
                  <h3 style={{marginBottom: '1rem'}}>🛍️ {isAdmin ? 'User Orders' : 'My Orders'}</h3>
                  {ordersLoading ? <p>Loading orders...</p> : (
                     <table className="history-table">
                        <thead>
                           <tr>
                              <th>ORDER ID</th>
                              {isAdmin && <th>USER</th>}
                              <th>TOTAL</th>
                              <th>PAYMENT</th>
                              <th>STATUS</th>
                              {isAdmin && <th>ACTIONS</th>}
                           </tr>
                        </thead>
                        <tbody>
                           {allOrders?.map(order => (
                              <tr key={order._id}>
                                 <td style={{fontSize:'0.85rem', color:'#666'}}>{order._id}</td>
                                 {isAdmin && <td><strong>{order.user?.name}</strong><br/><span style={{fontSize:'0.8rem', color:'#aaa'}}>{order.user?.email}</span></td>}
                                 <td style={{fontWeight: 700}}>${order.totalAmount?.toFixed(2)}</td>
                                 <td>{order.paymentMethod}</td>
                                 <td>
                                    <span style={{
                                       padding:'0.4rem 0.8rem', 
                                       borderRadius:'20px', 
                                       fontSize:'0.8rem', 
                                       fontWeight:600,
                                       background: 
                                          order.status === 'pending' ? '#fef3c7' : 
                                          order.status === 'processing' ? '#e0e7ff' : 
                                          order.status === 'shipped' ? '#dbeafe' : 
                                          order.status === 'delivered' ? '#dcfce3' : '#fee2e2',
                                       color: 
                                          order.status === 'pending' ? '#d97706' : 
                                          order.status === 'processing' ? '#4f46e5' : 
                                          order.status === 'shipped' ? '#2563eb' : 
                                          order.status === 'delivered' ? '#16a34a' : '#dc2626'
                                    }}>
                                       {order.status.toUpperCase()}
                                    </span>
                                 </td>
                                 {isAdmin && (
                                 <td>
                                    <select 
                                       value={order.status} 
                                       onChange={(e) => updateStatusMut.mutate({ id: order._id, status: e.target.value })}
                                       style={{padding:'0.5rem', borderRadius:'4px', border:'1px solid #ddd'}}
                                    >
                                       <option value="pending">Pending</option>
                                       <option value="processing">Processing</option>
                                       <option value="shipped">Shipped</option>
                                       <option value="delivered">Delivered</option>
                                       <option value="cancelled">Cancelled</option>
                                    </select>
                                 </td>
                                 )}
                              </tr>
                           ))}
                           {(!allOrders || allOrders.length === 0) && (
                              <tr><td colSpan={isAdmin ? 6 : 4} style={{textAlign:'center', padding:'2rem'}}>No orders found.</td></tr>
                           )}
                        </tbody>
                     </table>
                  )}
               </div>
            )}
         </main>
      </div>
   );
};

export default Profile;
