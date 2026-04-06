import React, { useState, useContext, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/product.service';
import { getAllOrders, getMyOrders, updateOrderStatus, getOrderStats } from '../services/order.service';
import { formatCurrency } from '../utils/format';
import io from 'socket.io-client';
import './Profile.css';

const Profile = ({ enforceAdmin }) => {
   const queryClient = useQueryClient();
   const navigate = useNavigate();
   const { user, logout } = useContext(AuthContext);
   
   const isAdmin = user?.role === 'admin';
   const [activeTab, setActiveTab] = useState(enforceAdmin ? 'inventory' : (isAdmin ? 'dashboard' : 'orders'));
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
               alert(`🔔 ${data.message} - Total: ${formatCurrency(data.totalAmount)}`);
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
   
   const updateStatusMut = useMutation({ mutationFn: updateOrderStatus, onSuccess: () => { queryClient.invalidateQueries(['orders']); queryClient.invalidateQueries(['stats']); } });

   const { data: stats, isLoading: statsLoading } = useQuery({
      queryKey: ['stats'],
      queryFn: getOrderStats,
      enabled: isAdmin && activeTab === 'dashboard'
   });

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
               <h2>{isAdmin ? 'Quản lý hệ thống' : 'Tài khoản của tôi'}</h2>
               <p style={{color: 'var(--text-muted)'}}>Tổng quan hệ thống</p>
            </div>
            <ul className="sb-nav">
               {isAdmin && (
                  <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}><span>📊</span> Bảng điều khiển</li>
               )}
               {isAdmin && (
                  <li className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}><span>📦</span> Quản lý kho hàng</li>
               )}
               <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}><span>🛍️</span> Đơn hàng của tôi</li>
               {isAdmin && (
                  <li className={activeTab === 'customers' ? 'active' : ''} onClick={() => setActiveTab('customers')}><span>👥</span> Khách hàng</li>
               )}
               <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}><span>⚙️</span> Cài đặt</li>
            </ul>
            <button className="btn-primary w-100 sb-footer-btn">Xuất báo cáo</button>
         </aside>

         <main className="profile-main">
            <div className="top-profile-card">
               <div className="profile-info">
                  <img src="https://i.pravatar.cc/150?img=11" alt="User" className="avatar"/>
                  <div>
                     <h2>{user.name}</h2>
                     <p className="text-muted">{isAdmin ? 'Quản trị viên hệ thống' : 'Thành viên Enterprise'}</p>
                     <div className="profile-tags">
                        <span>✉️ {user.email}</span>
                        <span>📍 TP. Hồ Chí Minh, VN</span>
                     </div>
                  </div>
               </div>
               <button className="btn-primary" onClick={() => { logout(); navigate('/auth'); }} style={{padding: '0.8rem 1.5rem', background: '#dc2626', borderColor: '#b91c1c'}}>Đăng xuất</button>
            </div>

            {activeTab === 'dashboard' && isAdmin && (
               <div className="profile-grid">
                  <div className="pg-left" style={{gridColumn: 'span 2'}}>
                     <div className="stats-row" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
                        <div className="p-card" style={{background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', border: 'none'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', opacity: 0.8}}>
                                <span>TỔNG DOANH THU</span>
                                <span style={{fontSize: '1.5rem'}}>💰</span>
                            </div>
                            <h2 style={{fontSize: '2.4rem', fontWeight: 800}}>{statsLoading ? '...' : formatCurrency(stats?.totalRevenue)}</h2>
                            <div style={{marginTop: '1rem', fontSize: '0.85rem', color: '#10b981'}}>↑ 12.5% so với tháng trước</div>
                        </div>
                        
                        <div className="p-card" style={{background: 'white', border: '1px solid #f1f5f9'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: 'var(--text-muted)'}}>
                                <span>TỔNG ĐƠN HÀNG</span>
                                <span style={{fontSize: '1.5rem'}}>📦</span>
                            </div>
                            <h2 style={{fontSize: '2.4rem', fontWeight: 800, color: '#1a1a1a'}}>{statsLoading ? '...' : stats?.totalOrders}</h2>
                            <div style={{marginTop: '1rem', fontSize: '0.85rem', color: '#64748b'}}>Đơn hàng trọn đời trên hệ thống</div>
                        </div>

                        <div className="p-card" style={{background: 'white', border: '1px solid #f1f5f9'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: 'var(--text-muted)'}}>
                                <span>VẬN CHUYỂN ĐANG CHẠY</span>
                                <span style={{fontSize: '1.5rem'}}>🚚</span>
                            </div>
                            <h2 style={{fontSize: '2.4rem', fontWeight: 800, color: '#1a1a1a'}}>{statsLoading ? '...' : (stats?.totalOrders - stats?.deliveredOrders)}</h2>
                            <div style={{marginTop: '1rem', fontSize: '0.85rem', color: '#f59e0b'}}>Yêu cầu sự chú ý ngay lập tức</div>
                        </div>
                     </div>

                     <div className="p-card">
                        <div className="pc-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                           <h3>Phân bổ đơn hàng</h3>
                           <button className="btn-secondary" style={{padding: '0.5rem 1rem', fontSize: '0.75rem'}}>XUẤT FILE CSV</button>
                        </div>
                        <div style={{padding: '2rem 0', display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap'}}>
                            <div style={{width: '180px', height: '180px', borderRadius: '50%', border: '25px solid #0f172a', borderRightColor: '#3b82f6', borderBottomColor: '#f59e0b'}}></div>
                            <div style={{display: 'grid', gap: '1rem'}}>
                                <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
                                    <div style={{width:'12px',height:'12px',background:'#0f172a', borderRadius:'2px'}}></div>
                                    <span>Đã giao: <strong>{stats?.deliveredOrders}</strong></span>
                                </div>
                                <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
                                    <div style={{width:'12px',height:'12px',background:'#3b82f6', borderRadius:'2px'}}></div>
                                    <span>Đang giao / Xử lý: <strong>{stats?.totalOrders - stats?.deliveredOrders - stats?.pendingOrders}</strong></span>
                                </div>
                                <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
                                    <div style={{width:'12px',height:'12px',background:'#f59e0b', borderRadius:'2px'}}></div>
                                    <span>Chờ xác nhận: <strong>{stats?.pendingOrders}</strong></span>
                                </div>
                            </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'inventory' && isAdmin && (
               <>
                  <div className="p-card" style={{marginBottom: '2rem'}}>
                     <h3 style={{marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom:'1rem'}}>{editingId ? '✏️ Chỉnh sửa sản phẩm' : '➕ Thêm sản phẩm mới'}</h3>
                     <form onSubmit={handleSubmit} style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem'}}>
                        <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                           <label style={{fontSize:'0.8rem', fontWeight:700}}>TÊN SẢN PHẨM</label>
                           <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{padding:'0.8rem', border:'1px solid #ddd', borderRadius:'4px'}} placeholder="Ví dụ: PrecisionBook M2"/>
                        </div>
                        <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                           <label style={{fontSize:'0.8rem', fontWeight:700}}>GIÁ BÁN (VND)</label>
                           <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{padding:'0.8rem', border:'1px solid #ddd', borderRadius:'4px'}} placeholder="1000000"/>
                        </div>
                        <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                           <label style={{fontSize:'0.8rem', fontWeight:700}}>DANH MỤC</label>
                           <select value={formData.categorySlug} onChange={e => setFormData({...formData, categorySlug: e.target.value})} style={{padding:'0.8rem', border:'1px solid #ddd', borderRadius:'4px'}}>
                              <option value="smartphones">Điện thoại</option>
                              <option value="laptops">Laptop</option>
                              <option value="wearables">Đồng hồ</option>
                              <option value="audio">Âm thanh</option>
                              <option value="accessories">Phụ kiện</option>
                           </select>
                        </div>
                        <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                           <label style={{fontSize:'0.8rem', fontWeight:700}}>CẤU HÌNH (Tên:GiáCộngThêm)</label>
                           <input type="text" value={formData.variantsStr} onChange={e => setFormData({...formData, variantsStr: e.target.value})} style={{padding:'0.8rem', border:'1px solid #ddd', borderRadius:'4px'}} placeholder="Ví dụ: 256GB:0, 512GB:2000000"/>
                        </div>
                        <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                           <label style={{fontSize:'0.8rem', fontWeight:700}}>ĐƯỜNG DẪN ẢNH</label>
                           <input type="text" required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} style={{padding:'0.8rem', border:'1px solid #ddd', borderRadius:'4px'}}/>
                        </div>
                        <div style={{gridColumn:'span 2', display:'flex', gap:'1rem'}}>
                           <button type="submit" className="btn-primary" disabled={createMut.isPending || updateMut.isPending}>
                              {editingId ? 'Cập nhật sản phẩm' : 'Đưa sản phẩm lên kệ ngay 🚀'}
                           </button>
                           {editingId && <button type="button" className="btn-secondary" onClick={resetForm}>Hủy</button>}
                        </div>
                     </form>
                  </div>

                  <div className="p-card">
                     <h3 style={{marginBottom: '1rem'}}>📋 Danh sách kho hàng</h3>
                     {isLoading ? <p>Đang tải...</p> : (
                        <table className="history-table">
                           <thead><tr><th>ẢNH</th><th>TÊN</th><th>DANH MỤC</th><th>GIÁ</th><th>THAO TÁC</th></tr></thead>
                           <tbody>
                              {allProducts?.map(prod => (
                                 <tr key={prod._id}>
                                    <td><img src={prod.images[0]} alt="" style={{width:'40px', height:'40px', objectFit:'contain'}}/></td>
                                    <td><strong>{prod.name}</strong></td>
                                    <td style={{textTransform:'capitalize'}}>{prod.category?.slug === 'smartphones' ? 'Điện thoại' : prod.category?.slug || 'N/A'}</td>
                                    <td>{formatCurrency(prod.price)}</td>
                                    <td style={{display:'flex', gap:'0.5rem', marginTop:'1rem', border:'none'}}>
                                       <button onClick={() => handleEdit(prod)} style={{padding:'0.5rem 1rem', background:'#e0f2fe', color:'#0284c7', border:'none', borderRadius:'4px', cursor:'pointer', fontWeight:600}}>Sửa</button>
                                       <button onClick={() => { if(window.confirm('Xóa sản phẩm này?')) deleteMut.mutate(prod._id); }} style={{padding:'0.5rem 1rem', background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:'4px', cursor:'pointer', fontWeight:600}}>Xóa</button>
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
                  <h3 style={{marginBottom: '1rem'}}>🛍️ {isAdmin ? 'Quản lý đơn hàng' : 'Đơn hàng của tôi'}</h3>
                  {ordersLoading ? <p>Đang tải đơn hàng...</p> : (
                     <table className="history-table">
                        <thead>
                           <tr>
                              <th>MÃ ĐƠN</th>
                              {isAdmin && <th>KHÁCH HÀNG</th>}
                              <th>TỔNG TIỀN</th>
                              <th>THANH TOÁN</th>
                              <th>TRẠNG THÁI</th>
                              {isAdmin && <th>THAO TÁC</th>}
                           </tr>
                        </thead>
                        <tbody>
                           {allOrders?.map(order => (
                              <tr key={order._id}>
                                 <td style={{fontSize:'0.85rem', color:'#666'}}>{order._id}</td>
                                 {isAdmin && <td><strong>{order.user?.name}</strong><br/><span style={{fontSize:'0.8rem', color:'#aaa'}}>{order.user?.email}</span></td>}
                                 <td style={{fontWeight: 700}}>{formatCurrency(order.totalAmount)}</td>
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
                                       {order.status === 'pending' ? 'CHỜ XÁC NHẬN' : 
                                        order.status === 'processing' ? 'ĐANG XỬ LÝ' : 
                                        order.status === 'shipped' ? 'ĐANG GIAO' : 
                                        order.status === 'delivered' ? 'ĐÃ GIAO' : 'ĐÃ HỦY'}
                                    </span>
                                 </td>
                                 {isAdmin && (
                                 <td>
                                    <select 
                                       value={order.status} 
                                       onChange={(e) => updateStatusMut.mutate({ id: order._id, status: e.target.value })}
                                       style={{padding:'0.5rem', borderRadius:'4px', border:'1px solid #ddd'}}
                                    >
                                       <option value="pending">Chờ xác nhận</option>
                                       <option value="processing">Đang xử lý</option>
                                       <option value="shipped">Đang giao</option>
                                       <option value="delivered">Đã giao</option>
                                       <option value="cancelled">Đã hủy</option>
                                    </select>
                                 </td>
                                 )}
                              </tr>
                           ))}
                           {(!allOrders || allOrders.length === 0) && (
                              <tr><td colSpan={isAdmin ? 6 : 4} style={{textAlign:'center', padding:'2rem'}}>Không tìm thấy đơn hàng nào.</td></tr>
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
