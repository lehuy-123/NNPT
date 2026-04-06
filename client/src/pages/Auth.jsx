import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Auth = () => {
   const [isLogin, setIsLogin] = useState(true);
   const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
   const { user, login, register } = useContext(AuthContext);
   const navigate = useNavigate();

   React.useEffect(() => {
       if (user) navigate('/profile');
   }, [user, navigate]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         if (isLogin) {
            await login(formData.email, formData.password);
         } else {
            await register(formData.name, formData.email, formData.password, formData.role);
         }
         navigate('/profile');
      } catch (err) {
         alert('Lỗi xác thực: ' + (err.response?.data?.error || err.message));
      }
   };

   return (
      <div className="auth-container">
         <div className="auth-card">
            <h2>{isLogin ? 'Đăng nhập vào PrecisionTech' : 'Tạo tài khoản mới'}</h2>
            <p className="auth-subtitle">{isLogin ? 'Nhập thông tin của bạn để truy cập hệ thống.' : 'Tham gia nền tảng công nghệ hàng đầu.'}</p>
            
            <div className="auth-tabs">
               <button className={isLogin ? 'active' : ''} type="button" onClick={() => setIsLogin(true)}>Đăng nhập</button>
               <button className={!isLogin ? 'active' : ''} type="button" onClick={() => setIsLogin(false)}>Đăng ký</button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
               {!isLogin && (
                  <div className="form-group">
                     <label>HỌ VÀ TÊN</label>
                     <input type="text" required onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nguyễn Văn A"/>
                  </div>
               )}
               <div className="form-group">
                  <label>ĐỊA CHỈ EMAIL</label>
                  <input type="email" required onChange={e => setFormData({...formData, email: e.target.value})} placeholder="alex@precision.tech"/>
               </div>
               <div className="form-group">
                  <label>MẬT KHẨU</label>
                  <input type="password" required onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••"/>
               </div>
               {!isLogin && (
                  <div className="form-group">
                     <label>LOẠI TÀI KHOẢN</label>
                     <select onChange={e => setFormData({...formData, role: e.target.value})} value={formData.role}>
                        <option value="user">Người dùng cá nhân (Mặc định)</option>
                        <option value="admin">Quản trị viên hệ thống</option>
                     </select>
                  </div>
               )}
               <button type="submit" className="btn-primary w-100">{isLogin ? 'Đăng nhập ngay &rarr;' : 'Đăng ký tài khoản &rarr;'}</button>
            </form>
         </div>
      </div>
   );
};

export default Auth;
