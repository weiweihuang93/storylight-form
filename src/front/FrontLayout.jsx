import { useState, useEffect, useContext } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { AppContext } from "../context/AppContext";
import ToastComponent from "../components/ToastComponent";

const Routes = [
  // {path: "/", name: "首頁"},
  {path: "news", name: "最新消息"},
  {path: "category", name: "線上購書"},
  {path: "wish", name: "線上許願"},
  {path: "help", name: "幫助中心"},
]

export default function FrontLayout() {
  const [isMemberbarOpen, setIsMemberbarOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartData, shippingAdd, setShippingAdd } = useContext(AppContext);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isShippingInCart = cartData?.carts?.some((item) => item.product_id === "-OLDh-kx-_pNd2Ls902s");
    if (isShippingInCart){
      setShippingAdd(true);
    }
  }, [cartData]);

  // 監聽視窗尺寸變化並更新折疊選單的狀態
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsMemberbarOpen(true);
      } else {
        const navbarCollapse = document.getElementById("navbarCollapse");
        if (navbarCollapse && navbarCollapse.classList.contains("show")) {
          setIsMemberbarOpen(false);
        }
      }
    };

    // 初始化時呼叫一次
    handleResize();

    // 監聽視窗大小變化
    window.addEventListener('resize', handleResize);

    // 清理事件監聽
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    }, []);

  // MemberbarOpen
  useEffect(() => {
    const navbarCollapse = document.getElementById("navbarCollapse");
    if (!navbarCollapse) return;

    const handleShow = () => setIsMemberbarOpen(false);
    const handleHide = () => {
      setTimeout(() => {
        setIsMemberbarOpen(true)
      }, 500)
    };

    navbarCollapse.addEventListener("show.bs.collapse", handleShow);
    navbarCollapse.addEventListener("hide.bs.collapse", handleHide);

    return () => {
      // 移除監聽器，避免內存洩漏
      navbarCollapse.removeEventListener("show.bs.collapse", handleShow);
      navbarCollapse.removeEventListener("hide.bs.collapse", handleHide);
    };
  }, []);

  // SearchOpen
  useEffect(() => {
    const searchIconLink = document.querySelector(".searchiconlink");
    
    const handleSearchClick = (e) => {
      e.preventDefault();
      setIsSearchOpen((prev) => !prev); // **正確切換狀態**
    };
  
    if (searchIconLink) {
      searchIconLink.addEventListener("click", handleSearchClick);
    }

    return () => {
      if (searchIconLink) {
        searchIconLink.removeEventListener("click", handleSearchClick);
      }
    };
  }, []);

  // 搜尋功能
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedSearch = search.trim()
    if(trimmedSearch){
      navigate(`/search?keyword=${trimmedSearch}`);
    }
  };

  return (
    <>
    <ToastComponent />
    
    <section className="section-promotion bg">
      <h6 className="py-2">✨ 首次購物可享 70% 折扣 ✨</h6>
    </section>
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <Link to="/"><img className="logo" src="./images/logo.png" alt="logo" /></Link>
        <div className="collapse navbar-collapse justify-content-center" id="navbarCollapse">
          <ul className="navbar-nav gap-lg-0 gap-3">
            {Routes.map((route) => (
              <li className="nav-item" key={route.name}>
                <NavLink className="nav-link py-2 px-4 w-100" aria-current="page" to={route.path} end>{route.name}</NavLink>
              </li>
            ))}
            <li className="nav-item d-lg-none">
              <NavLink to="/login" className=" btn btn-orange w-100">登入 / 註冊</NavLink>
            </li>
          </ul>
        </div>
        <div className={`memberbar ${isMemberbarOpen ? "d-block" : "d-none"}`}>
          <ul className="d-flex gap-3">
            <li>
              <a href="#"><span className="material-symbols-outlined icon-black searchiconlink"> search </span></a>
            </li>
            <li>
              <Link to="/cart" className="icon-badge">
              <span className="material-symbols-outlined icon-black"> shopping_cart </span>
                <span className="badge bg-primary">{Math.max((cartData?.carts?.length || 0) - (shippingAdd ? 1 : 0), 0)}</span>
              </Link>
            </li>
            <li>
              <Link to="/login"><span className="material-symbols-outlined icon-black"> person </span></Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    {/* <!-- 搜尋框 (預設隱藏) --> */}
    <div className="container">
      <form onSubmit={handleSearchSubmit} className={`form-search m-3 ${isSearchOpen ? "d-block" : "d-none"}`} role="search" >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-search form-control form-control-input" type="search" placeholder="搜尋" aria-label="Search" />
        <button className="a-search" type="submit">
          <span className="material-symbols-outlined"> search </span>
        </button>
      </form>
    </div>

    <main>
      <Outlet />
    </main>

    <footer>
      <div className="footer bg pt-4 pb-3">
        <div className="container">
          <div className="footer-wrap mb-lg-5 mb-3">
            <Link to="/"><img className="logo" src="./images/logo.png" alt="logo" /></Link>
            
            <div className="mb-3">
              <div className="d-flex justify-content-center gap-lg-7 gap-3 mb-3">
                <a><img className="contact" src="./images/ic-social-fb.png" alt="contact-fb" /></a>
                <a><img className="contact" src="./images/ic-social-ig.png" alt="contact-ig" /></a>
                <a><img className="contact" src="./images/ic-social-line.png" alt="contact-line" /></a>
              </div>
                <p className="fs-5">拾光尋書，等你續寫</p>
            </div>
          </div>

          <hr/>
          <p className="text-sm text-center mb-1">作品僅作學習使用，無商業用途，若有侵權請來信告知</p>
          <p className="text-sm text-center mb-1">@gmail.com，我們將立即移除</p>
          <p className="text-sm text-center">Copyright © WEIWEI 2025 All Right Reserved</p>
        </div>
      </div>
    </footer>
    </>
  );
}