import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { AppContext } from "../context/AppContext";
import ReactLoading from 'react-loading';
import LoadingComponent from "../components/LoadingComponent";
import { pushMessage } from "../redux/toastSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function SearchPage(){
  const [productsData, setProductsData] = useState([]);
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  const { cartData, addCart, favorites, toggleFavorite, loadingId } = useContext(AppContext);
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  // 取得產品
  const getAllProduct = async() => {
    setIsScreenLoading(true);
    try{
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products/all`);
      const filterSearchProducts = res.data.products.filter(product => product.title.includes(keyword));
      setProductsData(filterSearchProducts);
      setIsScreenLoading(false);
    }catch(err){
      dispatch(pushMessage({
        success: false,
        message: '載入商品資料發生錯誤，請稍後再試。'
      }))
    }
  };

  useEffect(() => {
    getAllProduct();
  }, [searchParams])

  return(
    <div className="container py-3">
      <section className="section-product">
        <h4 className="pb-3">搜尋結果：{keyword}</h4>
        {isScreenLoading ? (
          <>
            <LoadingComponent />
            <p>載入中...</p>
          </>
        ) : productsData.length === 0 ? (
          <div className="text-center py-5">
            <h5>找不到與「<strong className="text-orange-dark">{keyword}</strong>」相關的書籍。</h5>
            <h5 className="text-muted mt-3">請嘗試其他關鍵字、簡化搜尋詞或瀏覽其他分類。</h5>
          </div>
        ) :
        (
          <div className="row">
            <div className="col">
              {/* 產品卡片 */}
              {productsData.map((product) => {
                const isInCart = cartData?.carts?.some((item) => item.product_id === product.id);

                return(
                <div 
                className={`product-card mb-3 ${product.category === "滿額索取" ? "bonus-wrap" : ""}`} 
                key={product.id}
              >
                  <div className="row">
                    <div className="col-5 col-lg-4">
                      <div className="product-img-h28">
                        <img src={product.imageUrl} alt={product.title} />
                        <button onClick={() => toggleFavorite(product.id)} className={`favorite-btn ${favorites[product.id] ? "active" : ""}`}>
                          <span className={`material-symbols-outlined ${favorites[product.id] ? 'icon-fill' : ''}`}>
                          favorite
                          </span>
                        </button>
                        <p className="condition-tag">{product.condition}</p>
                      </div>
                    </div>

                    
                    <div className="col-7 col-lg-4 border-lg-end">
                      <div className="product-detail p-1">
                        <h5 className="title-clamp-2">{product.title}</h5>
                        <ul className="py-2">
                          <li>作者：{product.author}</li>
                          <li>出版社：{product.publisher}</li>
                          <li>適讀對象：{product.suitable}</li>
                          <div className="product-price mb-2">
                            <del className="text-sm me-3">售價：{product.origin_price}</del>
                            <p className="fs-5 text-danger fw-bold">
                              <span className="material-symbols-outlined text-primary me-2">paid</span>{product.price}
                            </p>
                          </div>
                        </ul>
                        <button
                          onClick={() => addCart(product.id)}
                          className={`btn mt-auto d-flex justify-content-center align-items-center gap-2 w-100 ${
                            isInCart || product.qty === 0 ? "btn-gray-600" : "btn-warning"
                          }`}
                          type="button"
                          disabled={isInCart || product.qty === 0 || loadingId === product.id}
                        >
                          {product.qty === 0 ? (
                            "已售完"
                          ) : isInCart ? (
                            "已加入購物車"
                          ) : loadingId === product.id ? (
                            <>
                              加入中...
                              <ReactLoading type="spin" color="#0d6efd" height="1.5rem" width="1.5rem" />
                            </>
                          ) : (
                            "加入購物車"
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-lg-4">
                      <div className="product-detail p-1 p-lg-1 p-3">
                        <p className="line-clamp-lg-8 h-lg-12em text-pre-line">{product.content}...</p>
                        <Link
                          className="btn btn-outline-orange-dark w-100 mt-lg-0 mt-3"
                          type="button"
                          to={`/category/${product.category}/${product.id}`}
                        >
                          繼續閱讀
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* 售完遮罩 */}
                  {product.qty === 0 && (
                    <div className="sold-out-overlay">
                      <p className="sold-out-text">售完</p>
                    </div>
                  )}
                </div>
              )
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}