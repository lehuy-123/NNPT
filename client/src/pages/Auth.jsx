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
         alert('Authentication Failed: ' + (err.response?.data?.error || err.message));
      }
   };

   return (
      <div className="auth-container">
         <div className="auth-card">
            <h2>{isLogin ? 'Sign In to PrecisionTech' : 'Create an Account'}</h2>
            <p className="auth-subtitle">{isLogin ? 'Enter your credentials to access your workspace.' : 'Join the elite engineering platform.'}</p>
            
            <div className="auth-tabs">
               <button className={isLogin ? 'active' : ''} type="button" onClick={() => setIsLogin(true)}>Login</button>
               <button className={!isLogin ? 'active' : ''} type="button" onClick={() => setIsLogin(false)}>Register</button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
               {!isLogin && (
                  <div className="form-group">
                     <label>FULL NAME</label>
                     <input type="text" required onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Alex Sterling"/>
                  </div>
               )}
               <div className="form-group">
                  <label>EMAIL ADDRESS</label>
                  <input type="email" required onChange={e => setFormData({...formData, email: e.target.value})} placeholder="alex@precision.tech"/>
               </div>
               <div className="form-group">
                  <label>PASSWORD</label>
                  <input type="password" required onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••"/>
               </div>
               {!isLogin && (
                  <div className="form-group">
                     <label>ACCOUNT TYPE</label>
                     <select onChange={e => setFormData({...formData, role: e.target.value})} value={formData.role}>
                        <option value="user">Individual User (Default)</option>
                        <option value="admin">System Admin</option>
                     </select>
                  </div>
               )}
               <button type="submit" className="btn-primary w-100">{isLogin ? 'Access Workspace &rarr;' : 'Register Account &rarr;'}</button>
            </form>
         </div>
      </div>
   );
};

export default Auth;
