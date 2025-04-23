import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import { AppContext } from "../context/AppContext";
import { useDispatch } from "react-redux";
import { pushMessage } from "../redux/toastSlice";
import ReactLoading from 'react-loading';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function HomePage(){
  
  const dispatch = useDispatch();
  
  const [productsData, setProductsData] = useState([]);
  const [bonusProductsData, setBonusProductsData] = useState([]);
  const { cartData, addCart, favorites, toggleFavorite, loadingId } = useContext(AppContext);

  // 取得產品 過濾運費專區和滿額索取
  const getAllProduct = async() => {
    try{
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products/all`);
      const filterCategoryProducts = res.data.products.filter((item) => item.category !== '運費專區' && item.category !== '滿額索取');
      const filter10Products = filterCategoryProducts.slice(-10);
      setProductsData(filter10Products);
    }catch(error){
      dispatch(pushMessage({
        success: false,
        message: '載入商品資料發生錯誤，請稍後再試。'
      }))
    }
  };

  const getBonusProduct = async() => {
    try{
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`, {
        params: { category: '滿額索取'}
      });
      setBonusProductsData(res.data.products);
    }catch(error){
      dispatch(pushMessage({
        success: false,
        message: '載入商品資料發生錯誤，請稍後再試。'
      }))
    }
  };

  useEffect(() => {
    getAllProduct();
    getBonusProduct();
  }, []); 

  return(
    <>
    {/* <!-- 輪播圖 --> */}
    <header>
      <div className="container-fluid p-0">
        <div className="header-banner">
        <img className="header-img" src="./images/banner.png" alt="header-banner" />
        <div className="header-info">
            <h1 className="fs-2 mb-5">讓時光，<br />在舊書的翻閱中靜靜流轉...</h1>
            <h2 className="fs-2 text-md-end text-start">
              <span className="d-block d-md-inline">每一本書，</span>
              <span className="d-block d-md-inline">都是一段未完的故事，</span>
              <p>等待你的發現！</p>
            </h2>
          </div>
        </div>
      </div>
    </header>

    {/* <!-- 買書 / 徵求 --> */}
    <section className="section-option">
      <div className="bg py-6">
        <div className="container">
          <div className="row row-cols-lg-2 row-cols-1 gy-3">
            <div className="col">
              <Link to="/category" className="option-card rounded">
                <div className="option-card-inner">
                  {/* 前面 */}
                  <div className="option-card-front rounded">
                    <h2 className="text-black mb-3">我要買書</h2>
                    <p className="text-muted text-center mb-3">
                    精選書籍任你挑選，<span className="d-block d-md-inline">輕鬆找到愛書！</span>
                    </p>
                    <button className="btn btn-orange">立即選購</button>
                  </div>
                  {/* 背面 */}
                  <div className="option-card-back rounded">
                    <span className="material-symbols-outlined fs-1">shopping_cart</span>
                    <h2>立即選購</h2>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col">
              <Link to="/wish" className="option-card rounded">
                <div className="option-card-inner">
                  {/* 前面 */}
                  <div className="option-card-front rounded">
                    <h2 className="text-black mb-3">我要徵求</h2>
                    <p className="text-muted text-center mb-3">
                      找不到想要的嗎？<span className="d-block d-md-inline">填寫表單，讓賣家聯繫你！</span>
                    </p>
                    <button className="btn btn-orange">立即徵求</button>
                  </div>
                  {/* 背面 */}
                  <div className="option-card-back rounded">
                    <span className="material-symbols-outlined fs-1">assignment</span>
                    <h2>立即徵求</h2>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* <!-- 書籍分類 8大分類區 --> */}
    <section className="section-category">
      <div className="container py-lg-6 py-5">
        <div className="text-center">
          <h2 className="title-decoration mb-lg-5 mb-4">書籍分類</h2>
        </div>
        <div className="row row-cols-3 g-3">
          <div className="col">
            <Link to="/category/親子童書" className="category-card border rounded text-center px-3 py-4">
              <span className="material-symbols-outlined fs-1">
                nature_people
              </span>
              <h4 className="category-title">親子童書</h4>
            </Link>
          </div>
          <div className="col">
            <Link to="/category/商業理財" className="category-card border rounded text-center px-3 py-4">
              <span className="material-symbols-outlined fs-1">
                query_stats
              </span>
              <h4 className="category-title">商業理財</h4>
            </Link>
          </div>
          <div className="col">
            <Link to="/category/藝術音樂" className="category-card border rounded text-center px-3 py-4">
              <span className="material-symbols-outlined fs-1">
                palette
              </span>
              <h4 className="category-title">藝術音樂</h4>
            </Link>
          </div>
          <div className="col">
            <Link to="/category/人文科普" className="category-card border rounded text-center px-3 py-4">
              <span className="material-symbols-outlined fs-1">
                wb_sunny
              </span>
              <h4 className="category-title">人文科普</h4>
            </Link>
          </div>
          <div className="col">
            <Link to="/category/心理勵志" className="category-card border rounded text-center px-3 py-4">
              <span className="material-symbols-outlined fs-1">
                favorite
              </span>
              <h4 className="category-title">心理勵志</h4>
            </Link>
          </div>
          <div className="col">
            <Link to="/category/生活休閒" className="category-card border rounded text-center px-3 py-4">
              <span className="material-symbols-outlined fs-1">
                sports_martial_arts
              </span>
              <h4 className="category-title">生活休閒</h4>
            </Link>
          </div>
          <div className="col">
            <Link to="/category/文學小說" className="category-card border rounded text-center px-3 py-4">
              <span className="material-symbols-outlined fs-1">
                history_edu
              </span>
              <h4 className="category-title">文學小說</h4>
            </Link>
          </div>
          <div className="col">
            <Link to="/category/工具學習" className="category-card border rounded text-center px-3 py-4">
              <span className="material-symbols-outlined fs-1">
                book_3
              </span>
              <h4 className="category-title">工具學習</h4>
            </Link>
          </div>
          <div className="col">
            <Link to="/category" className="category-card border rounded text-center px-3 py-4">
              <span className="material-symbols-outlined fs-1">
                more_horiz
              </span>
              <h4 className="category-title">查看更多</h4>
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* <!-- 新書上架 --> */}
    <section className="section-product">
      <div className="container py-lg-6 py-5">
        <div className="text-center">
          <h2 className="title-decoration mb-lg-5 mb-4">新書上架</h2>
        </div>
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          loop={productsData.length > 5}
          breakpoints={{
            0: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
            1200: { slidesPerView: 5 },
          }}
          className="swiper py-2"
        >
          {productsData.map((product) => {
            
            const isInCart = cartData?.carts?.some((item) => item.product_id === product.id);

            return(
            <SwiperSlide key={product.id}>
              <div className="product-card">
                <div className="product-img-h22">
                  <img src={product.imageUrl} alt={product.title} />
                  <button onClick={() => toggleFavorite(product.id)} className={`favorite-btn ${favorites[product.id] ? "active" : ""}`}>
                    <span className={`material-symbols-outlined ${favorites[product.id] ? "icon-fill" : ""}`}>
                    favorite
                    </span>
                  </button>
                  <p className="condition-tag">{product.condition}</p>
                </div>
                <ul className="product-info p-2">
                  <li className="fw-bold title-clamp-2 h-3em">
                    {product.title}
                  </li>
                  <li className="text-truncate">適讀對象：{product.suitable}</li>
                  <div>
                    <p className="fs-5 text-danger fw-bold">
                      <span className="material-symbols-outlined text-primary me-2">paid</span>
                      {product.price}
                    </p>
                  </div>
                </ul>
                <Link className="btn btn-orange-dark w-100 mb-2" type="button" to={`/category/${product.category}/${product.id}`}>繼續閱讀</Link>
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

                {/* 售完遮罩 */}
                {product.qty === 0 && (
                  <div className="sold-out-overlay">
                    <p className="sold-out-text">售完</p>
                  </div>
                )}
              </div>
            </SwiperSlide>
          )
          })}
        </Swiper>
      </div>
    </section>

    {/* <!-- 滿額索取 --> */}
    <section className="section-bonusproduct">
      <div className="container py-lg-6 py-5">
        <div className="text-center">
          <h2 className="title-decoration mb-lg-5 mb-4">滿額索取</h2>
        </div>
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          loop={bonusProductsData.length > 5}
          breakpoints={{
            0: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 },
            1200: { slidesPerView: 5 },
          }}
          className="swiper py-2"
        >
          {bonusProductsData.map((product) => {

            const isInCart = cartData?.carts?.some((item) => item.product_id === product.id);

            return(
            <SwiperSlide key={product.id}>
              <div className="product-card bonus-wrap">
                <div className="product-img-h22">
                  <img src={product.imageUrl} alt={product.title} />
                  <button onClick={() => toggleFavorite(product.id)} className={`favorite-btn ${favorites[product.id] ? "active" : ""}`}>
                    <span className={`material-symbols-outlined ${favorites[product.id] ? "icon-fill" : ""}`}>
                    favorite
                    </span>
                  </button>
                  <p className="condition-tag">{product.condition}</p>
                </div>
                <ul className="product-info p-2">
                  <li className="fw-bold title-clamp-2 h-3em">
                    {product.title}
                  </li>
                  <li className="text-truncate">適讀對象：{product.suitable}</li>
                  <div>
                    <p className="fs-5 text-danger fw-bold">
                      <span className="material-symbols-outlined text-primary me-2">paid</span>
                      {product.price}
                    </p>
                  </div>
                </ul>
                <Link className="btn btn-orange-dark w-100 mb-2" type="button" to={`/category/${product.category}/${product.id}`}>繼續閱讀</Link>
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

              {/* 售完遮罩 */}
              {product.qty === 0 && (
                <div className="sold-out-overlay">
                  <p className="sold-out-text">售完</p>
                </div>
              )}
              </div>
            </SwiperSlide>
          )
          })}
        </Swiper>
      </div>
    </section>

    {/* <!-- 加入會員活動 --> */}
    <section className="section-membership">
      <div className="bg py-lg-6 py-5">
        <div className="container">
          <div className="membership-wrap">
            <h2 className="text-center mb-lg-5 mb-4">\ 專屬會員限定優惠 /</h2>
            <ul>
              <li><span className="material-symbols-outlined icon-fill"> check_circle </span>會員積分回饋（每消費 1 元累積 1 點），積分可用於兌換專屬優惠。</li>
              <li><span className="material-symbols-outlined icon-fill"> check_circle </span>找不到想要的嗎？填寫徵求表單，告訴我們您的需求，讓好書輕鬆入手！</li>
              <li><span className="material-symbols-outlined icon-fill"> check_circle </span>定期發放專屬優惠券和折扣活動，讓你以更優惠的價格收藏好書。</li>
              <li><span className="material-symbols-outlined icon-fill"> check_circle </span>購物滿額，即可免費索取好書，輕鬆擁有更多好書！</li>
              <li><span className="material-symbols-outlined icon-fill"> check_circle </span>提供專屬客服服務，解決您的問題，讓購書和閱讀更無後顧之憂。</li>
            </ul> 
            <img className="membership-img1 d-none d-lg-block" src="https://opendoodles.s3-us-west-1.amazonaws.com/reading-side.svg" alt="membership-img1" />
            <img className="membership-img2 d-none d-lg-block" src="https://opendoodles.s3-us-west-1.amazonaws.com/sitting-reading.svg" alt="membership-img2" />
            <Link to="/register" className="btn btn-orange btn-lg mt-5">立即加入，開啟你的專屬閱讀旅程！</Link>
          </div>
        </div>
      </div>
    </section>

    {/* <!-- 店家介紹 --> */}
    <section className="section-about">
      <div className="container text-center py-lg-6 py-5">
        <div className="text-center">
          <h2 className="title-decoration mb-lg-5 mb-4">關於我們｜書籍如何處理？</h2>
        </div>
        <p className="fs-5 text-muted mb-5">我們細心處理每一本書，<span className="d-block d-lg-inline">確保你收到的書籍乾淨、完整！</span></p>

        <div className="row row-cols-lg-4 row-cols-sm-2 row-cols-1 g-3">
          <div className="col">
            <div className="about-wrap bg-secondary-400 p-5">
              <h3 className="mb-3">
                <span className="material-symbols-outlined"> encrypted </span> 安心
              </h3>
              <p>
                <span>每本書皆經過清潔與消毒，閱讀無負擔。</span>
              </p>
            </div>
          </div>
          <div className="col">
            <div className="about-wrap bg-secondary-100 p-5">
              <h3 className="mb-3">
                <span className="material-symbols-outlined"> book </span> 分級
              </h3>
              <p>
                <span>書況分級標籤透明清楚，讓你一目了然！</span>
              </p>
            </div>
          </div>
          <div className="col">
            <div className="about-wrap bg-secondary-300 p-5">
              <h3 className="mb-3">
                <span className="material-symbols-outlined"> public </span> 環保
              </h3>
              <p>
                <span>採用環保包裝減少浪費，共同愛護地球！</span>
              </p>
            </div>
          </div>
          <div className="col">
            <div className="about-wrap bg-secondary-200 p-5">
              <h3 className="mb-3">
                <span className="material-symbols-outlined"> delivery_truck_speed </span> 方便
              </h3>
              <p>
                <span>下單快速出貨，讓你輕鬆買，快速收書！</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* <!-- FAQ --> */}
    <section className="section-faq">
      <div className="bg py-lg-6 py-5">
        <div className="container">
          <h2 className="text-center mb-lg-5 mb-4">常見問題</h2>
          <div className="accordion mb-5" id="faqAccordion">
            {/* <!-- 問題 1 --> */}
            <div className="accordion-item">
              <h3 className="accordion-header">
                <div className="faq-q accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                所有書籍都是現貨嗎？
                </div>
              </h3>
              <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="faq-a accordion-body">
                  <p>是的！所有書籍皆為現貨銷售，下單後即可安排出貨。</p>
                </div>
              </div>
            </div>

            {/* <!-- 問題 2 --> */}
            <div className="accordion-item">
              <h3 className="accordion-header">
                <div className="faq-q accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                書籍的保存狀況如何？
                </div>
              </h3>
              <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="faq-a accordion-body">
                  <ul className="d-flex flex-column gap-3">
                    <li className="fw-bold">我們的二手書均經過消毒清潔、分類整理，並依據書籍狀況分類為：</li>
                    <li>A：極少翻閱，書況接近新書。</li>
                    <li>B：有使用痕跡，可能有自然泛黃、書斑、少量髒污，不影響閱讀。</li>
                    <li>C：可能含有筆記、劃線或重點標記。可能有書皮磨損、封面折痕、自然泛黃、書斑、髒污。但內容完整可讀。</li>
                    <li>D：可能年份較久遠，嚴重泛黃、書斑、髒污、封面或內頁磨損。</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* <!-- 問題 3 --> */}
            <div className="accordion-item">
              <h3 className="accordion-header">
                <div className="faq-q accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                  如何付款與配送？
                </div>
              </h3>
              <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="faq-a accordion-body">
                  <ul className="d-flex flex-column gap-3 mb-3">
                    <li className="fw-bold">付款方式：</li>
                    <li>銀行轉帳、貨到付款。</li>
                  </ul>
                  <ul className="d-flex flex-column gap-3">
                    <li className="fw-bold">下單後多久可以收到？</li>
                    <li>下單後 1～2 個工作日內 配達。</li>
                    <li className="fw-semibold">📌 「當日下單，隔一個工作日出貨」，實際配達時間依物流狀況為準。</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* <!-- 問題 4 --> */}
            <div className="accordion-item">
              <h3 className="accordion-header">
                <div className="faq-q accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                  運費如何計算？
                </div>
              </h3>
              <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="faq-a accordion-body">
                  <ul className="d-flex flex-column gap-3">
                    <li className="fw-bold">常態免運費標準如下：</li>
                    <li>宅配：滿 1,500 元 免運，未達條件 運費 100 元。</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* <!-- 問題 5 --> */}
            <div className="accordion-item">
              <h3 className="accordion-header">
                <div className="faq-q accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq5">
                  買錯了，如何退換貨？
                </div>
              </h3>
              <div id="faq5" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="faq-a accordion-body">
                  請直接於平台留言，客服小編會盡速為您處理喔!
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <Link to="/help" className="btn btn-orange">查看更多FAQ</Link>
          </div>
        </div>
      </div>
    </section>
    
    </>
  )
}