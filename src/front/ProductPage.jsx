import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { AppContext } from "../context/AppContext";
import { useDispatch } from "react-redux";
import { pushMessage } from "../redux/toastSlice";
import ReactLoading from 'react-loading';
import LoadingComponent from "../components/LoadingComponent";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

export default function ProductPage(){
  
  const dispatch = useDispatch();
  const { id } = useParams();
  const [productData, setProductData] = useState([]);
  const { cartData, addCart, favorites, toggleFavorite, loadingId } = useContext(AppContext);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  useEffect(() => {
    const getProductId = async() => {
      setIsScreenLoading(true);
      try{
        const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/product/${id}`);
        setProductData(res.data.product);
      }catch(err){
        dispatch(pushMessage({
          success: false,
          message: '載入商品資料發生錯誤，請稍後再試。'
        }))
      }finally{
        setIsScreenLoading(false);
      }
    }
    getProductId();
  }, []);
  
  const isInCart = cartData?.carts?.some((item) => item.product_id === id);
  
  return(
    <>
    <section className="section-product">
    {isScreenLoading ? (
      <LoadingComponent />
    ):(
      <div className="bg py-3">          
        <div className="container">

          {/* 麵包屑導航 */}
          <nav aria-label="breadcrumb mt-5">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">首頁</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/category">全部商品</Link>
              </li>
              <li className="breadcrumb-item" aria-current="page">
                <Link to={`/category/${productData.category}`}>{productData.category}</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {productData.title}
              </li>
            </ol>
          </nav>

          <div className="row py-3">
            <div className="col-lg-6">
              {/* 主圖區 */}
              <Swiper
                style={{
                  '--swiper-navigation-color': '#A4492C',
                  '--swiper-pagination-color': '#A4492C',
                }}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper2 main-swiper mb-3"
              >
                {productData.imagesUrl && productData.imagesUrl[0] === "" ? (
                <SwiperSlide key="main-image">
                  <img src={productData.imageUrl} alt={productData.title} />
                  <button onClick={() => toggleFavorite(productData.id)} className={`position-absolute border-0 favorite-btn ${favorites[productData.id] ? 'favorite-active' : ''}`}>
                    <span className={`material-symbols-outlined ${favorites[productData.id] ? 'icon-fill' : ''}`}>
                    favorite
                    </span>
                  </button>
                  <p className="condition-tag">{productData.condition}</p>
                </SwiperSlide>
                ) : (
                  <>
                  <SwiperSlide key="main">
                    <img src={productData.imageUrl} alt={productData.title} />
                    <button onClick={() => toggleFavorite(productData.id)} className={`position-absolute border-0 favorite-btn ${favorites[productData.id] ? 'favorite-active' : ''}`}>
                    <span className={`material-symbols-outlined ${favorites[productData.id] ? 'icon-fill' : ''}`}>
                    favorite
                    </span>
                  </button>
                  <p className="condition-tag">{productData.condition}</p>
                  </SwiperSlide>
                  {productData.imagesUrl?.map((imageUrl, index) => (
                    <SwiperSlide key={index}>
                      <img src={imageUrl} alt={`Product image ${index + 1}`} /> 
                    </SwiperSlide>
                  ))}
                  </>
                )}
              </Swiper>
              {/* 縮圖區 */}
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper thumb-swiper"
              >
                {productData.imagesUrl && productData.imagesUrl[0] === "" ? (
                <SwiperSlide key="main-image">
                  <img src={productData.imageUrl} alt={productData.title} />
                </SwiperSlide>
                ) : (
                  <>
                  <SwiperSlide key="main" className="custom-thumbs-slide">
                    <img src={productData.imageUrl} alt={productData.title} />
                  </SwiperSlide>
                  {productData.imagesUrl?.map((imageUrl, index) => (
                    <SwiperSlide key={index}>
                      <img src={imageUrl} alt={`Product image ${index + 1}`} /> 
                    </SwiperSlide>
                  ))}
                  </>
                )}
              </Swiper>
            </div>
            <div className="col-lg-6">
              {/* 產品介紹 */}
              <div className="px-3 product-page-info d-flex flex-column justify-content-between h-100">
                <h4 className="my-3 mt-lg-0">{productData.title}</h4>
                <p className="product-promotion fw-bold text-orange-dark mb-3">全館滿 1,500 元 免運</p>
                <div className="py-3 border-top border-bottom">
                  <ul>
                    <li className="mb-3">ISBN：{productData.isbn}</li>
                    <li className="mb-3">作者：{productData.author}</li>
                    <li className="mb-3">出版社：{productData.publisher}</li>
                    <li className="mb-4">出版日期：{productData.publishdate}</li>
                    <li className="mb-3">適讀對象：{productData.suitable}</li>
                    <li className="mb-3">語言：{productData.language}</li>
                    <li className="">規格：{productData.size}</li>
                  </ul>
                </div>
                <div className="d-flex flex-column">
                  <div className="py-3 product-price mb-2 d-flex justify-content-center align-items-center">
                    <del className="text-sm me-3">售價：{productData.origin_price}</del>
                    <p className="fs-5 text-danger fw-bold">
                      <span className="material-symbols-outlined text-primary me-2">paid</span>{productData.price}
                    </p>
                  </div>
                  <button
                    onClick={() => addCart(productData.id)}
                    className={`btn mt-auto d-flex justify-content-center align-items-center gap-2 w-100 ${
                      isInCart || productData.qty === 0 ? "btn-gray-600" : "btn-warning"
                    }`}
                    type="button"
                    disabled={isInCart || productData.qty === 0 || loadingId === productData.id}
                  >
                  {productData.qty === 0 ? (
                    "已售完"
                  ) : isInCart ? (
                    "已加入購物車"
                  ) : loadingId === productData.id ? (
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
            </div>
          </div>

          {/* 商品描述 */}
          <div className="py-5">
            <div className="text-center">
              <h5 className="title-decoration mb-5">商品描述</h5>
            </div>
            <div className="mb-3">
              <h6 className="text-orange-dark mb-3">商品介紹</h6>
              <p className="text-pre-line">{productData.description}</p>
            </div>
            <div className="product-detail mb-3">
              <h6 className="text-orange-dark mb-3">商品細節</h6>
              <ul>
                <li>ISBN：{productData.isbn}</li>
                <li>作者：{productData.author}</li>
                <li>出版社：{productData.publisher}</li>
                <li>出版日期：{productData.publishdate}</li>
                <li>適讀對象：{productData.suitable}</li>
                <li>語言：{productData.language}</li>
                <li>規格：{productData.size}</li>
              </ul>
            </div>
            <div className="product-condition mb-3">
              <h6 className="text-orange-dark mb-3">書況說明</h6>
              <ul>
                <li className="fw-bold">我們的二手書均經過消毒清潔，並依據書籍狀況分類為：</li>
                <li>A：極少翻閱，書況接近新書。</li>
                <li>B：有使用痕跡，可能有自然泛黃、書斑、少量髒污，不影響閱讀。</li>
                <li>C：可能含有筆記、劃線或重點標記。可能有書皮磨損、封面折痕、自然泛黃、書斑、髒污。但內容完整可讀。</li>
                <li>D：可能年份較久遠，嚴重泛黃、書斑、髒污、封面或內頁磨損。</li>
              </ul>
            </div>
            <div className="product-condition">
              <h6 className="text-orange-dark mb-3">更多書況說明</h6>
              <ul>
                <li>{productData.conditionDescription ? "" : "無"}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )}
    </section>
    </>
  )
}