import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/product.service';
import './Category.css';

const Category = ({ isDeals }) => {
  const { name } = useParams();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', isDeals ? 'deals' : name],
    queryFn: () => getProducts(isDeals ? 'deals' : name)
  });

  const title = isDeals 
    ? "Special Deals" 
    : name 
      ? name.charAt(0).toUpperCase() + name.slice(1) 
      : "All Hardware";
      
  const desc = isDeals 
    ? "Exclusive limited-time offers on top-tier equipment." 
    : "Precision engineered performance algorithms for your workflow.";

  return (
    <div className="category-page">
      {/* Banner của nhóm hàng */}
      <div className="category-hero">
         <div className="container">
           <h1 style={{textTransform: 'uppercase'}}>{title}</h1>
           <p>{desc}</p>
         </div>
      </div>
      
      <div className="container category-layout">
         {/* Thanh Filter bên trái */}
         <aside className="cat-sidebar">
            <h3>Filters</h3>
            <div className="filter-group">
               <h4>Price Range</h4>
               <label><input type="checkbox"/> Under $500</label>
               <label><input type="checkbox"/> $500 - $1,000</label>
               <label><input type="checkbox"/> $1,000 - $2,000</label>
               <label><input type="checkbox"/> Over $2,000</label>
            </div>
            <div className="filter-group">
               <h4>Availability</h4>
               <label><input type="checkbox"/> In Stock</label>
               <label><input type="checkbox"/> Pre-order</label>
            </div>
            <div className="filter-group">
               <h4>Features</h4>
               <label><input type="checkbox"/> Pro Series</label>
               <label><input type="checkbox"/> A1-Silicon</label>
               <label><input type="checkbox"/> Titanium Finish</label>
            </div>
         </aside>

         {/* Lưới sản phẩm bên phải */}
         <div className="cat-grid-wrapper">
             <div className="cat-controls">
                <span>Showing 12 high-performance items</span>
                <select className="sort-select">
                  <option>Sort By: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                </select>
             </div>
             
             {/* Sử dụng lại class fh-grid từ trang chủ */}
             <div className="fh-grid cat-products-grid">
                 {isLoading && <p style={{gridColumn:'span 3', textAlign:'center', marginTop:'3rem', color:'var(--text-muted)'}}>Connecting to MongoDB... Loading hardware data...</p>}
                 {!isLoading && products?.length === 0 && (
                     <p style={{gridColumn:'span 3', textAlign:'center', marginTop:'3rem', color:'var(--text-muted)'}}>No products found in the "{title}" category yet. Use the Admin panel to add some!</p>
                 )}
                 {products?.map((product, i) => (
                    <div className="fh-card" key={product._id || i}>
                      {i === 0 && <div className="card-tag tag-new">NEW</div>}
                      {i === 2 && isDeals && <div className="card-tag tag-limited">-15%</div>}
                      
                      <Link to={`/product/${product._id}`} style={{textDecoration:'none', color:'inherit', display:'block'}}>
                        <div className="fh-img">
                          <img src={product.images && product.images.length > 0 ? product.images[0] : "/images/phone.png"} alt={product.name} />
                        </div>
                        <div className="fh-info">
                          <span className="fh-category" style={{textTransform: 'uppercase'}}>{product.category?.name || title}</span>
                          <h4>{product.name}</h4>
                          <div className="fh-specs">
                            <span>High Performance</span>
                            <span>Pro</span>
                          </div>
                          
                          <div className="fh-footer">
                            <span className="fh-price">${product.price.toFixed(2)}</span>
                            <button className="btn-icon" onClick={(e)=>{
                              e.preventDefault(); 
                              alert(`Added ${product.name} to Cart!`);
                            }}>🛒</button>
                          </div>
                        </div>
                      </Link>
                    </div>
                 ))}
             </div>

             <div className="pagination">
                <button className="btn-secondary">Load More Products &darr;</button>
             </div>
         </div>
      </div>
    </div>
  );
};

export default Category;
