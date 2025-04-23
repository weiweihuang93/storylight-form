import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Modal } from "bootstrap";
import { useDispatch } from "react-redux";
import { pushMessage } from "../redux/toastSlice";
import LoadingComponent from "../components/LoadingComponent";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

const categories = ["親子童書", "商業理財", "藝術音樂", "人文科普", "心理勵志", "生活休閒", "文學小說", "工具學習", "滿額索取", "運費專區"];

const defaultModalState = {
  imageUrl: "",
  title: "",
  maintitle: "",
  category: "",
  unit: "本",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""],
  isbn: "",
  language: "繁體中文",
  qty: "",
  author: "",
  publisher: "",
  publishdate: "",
  suitable: "成人(一般)",
  condition: "",
  conditionDescription: "",
  size: ""
}

export default function AdminProduct(){

  const [allProducts, setAllProducts] = useState({});
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [selectCategory, setSelectCategory] = useState('全部商品');

  const productModalRef = useRef(null);
  const [modalMode, setModalMode] = useState('');
  const [tempProduct, setTempProduct] = useState(defaultModalState);

  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredCurrentPage, setfilteredCurrentPage] = useState(1);
  const [filteredTotalPage, setFilteredTotalPage] = useState(1);
  const itemsPerPage = 10;
  const [sortOrder, setSortOrder] = useState(""); // '', 'asc', 'desc'
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const openModal = (mode, product) => {
    setModalMode(mode);
    switch (mode){
      case "create":
        setTempProduct({ ...defaultModalState });
        break;
      case "edit":
        setTempProduct({
          ...defaultModalState, // 先填充所有預設值，確保欄位存在
          ...product // 再覆蓋新的產品資料
        });
        break;
        
      default:
      break;
    }
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  }

  const closeModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
  };

  const getAllProduct = async () => {
    setIsScreenLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products/all`);
      setAllProducts(res.data.products);
    } catch (error) {
      dispatch(pushMessage(error.response.data));
    }finally{
      setIsScreenLoading(false);
    }
  };

  const getProduct = async (page = 1) => {
    setIsScreenLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      dispatch(pushMessage(error.response.data));
    }finally{
      setIsScreenLoading(false);
    }
  };

  const handlePageChange = (e, page) => {
    e.preventDefault();
    getProduct(page);
  };

  const editProduct = async (product_id) => {
    try {
      const res = await axios.put(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0,
          qty: Number(tempProduct.qty)
        }
      });
      dispatch(pushMessage(res.data));
      closeModal();
    } catch (error) {
      dispatch(pushMessage(error.response.data));
    }
  };

  const createProduct = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/product`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0
        }
      });
      dispatch(pushMessage(res.data));
      closeModal();
    } catch (error) {
      dispatch(pushMessage(error.response.data));
    }
  };

  const deleteProduct = async (product_id) => {
    try {
      const res = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/admin/product/${product_id}`);
      dispatch(pushMessage(res.data));
      getAllProduct();
      getProduct();
    } catch (error) {
      dispatch(pushMessage(error.response.data));
    }
  };

  const handleModalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTempProduct({
      ...tempProduct,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...tempProduct.imagesUrl];
    newImages[index] = value;

    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages
    })
  };

  const handleAddImage = () => {
    const newImages = [...tempProduct.imagesUrl, ''];
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages
    })
  };

  const handleRemoveImage = () => {
    const newImages = [...tempProduct.imagesUrl];
    newImages.pop();
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages
    })
  };

  const handleUpdateProduct = async () => {
    const apiCall = modalMode === 'create' ? createProduct : editProduct;
    try {
      await apiCall();
      getAllProduct();
      getProduct();
    } catch (error) {
      dispatch(pushMessage(error.response.data));
    }
  };

  const handleFileChange = async (e) => {
    const formData = new FormData();
    const fileInput = e.target;
    const file = e.target.files[0];
    formData.append('file-to-upload', file);
    try {
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/upload`, formData);
      const uploadImageUrl = res.data.imageUrl;
      setTempProduct({
        ...tempProduct,
        imageUrl: uploadImageUrl
      })
      fileInput.value = '';
    } catch (error) {
      dispatch(pushMessage(error.response.data));
    }
  };

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if(token){
      axios.defaults.headers.common['Authorization'] = token;
      getAllProduct();
      getProduct();
    }else{
      navigate("/adminLogin");
    }
  }, []);
  
  useEffect(() => {
    new Modal(productModalRef.current, {
      backdrop: false
    });
  }, []);

 // 搜尋 & 分類篩選
  useEffect(() => {
    const allItems = Object.values(allProducts).reverse();
    let filtered = [...allItems];

    if (search.trim()) {
      const keyword = search.trim().toLowerCase();
      filtered = filtered.filter(product => product.title?.toLowerCase().includes(keyword));
    }

    if(selectCategory && selectCategory !== "全部商品"){
      filtered = filtered.filter(product => product.category === selectCategory);
    }

    // 價格排序
    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
    setFilteredTotalPage(Math.ceil(filtered.length / itemsPerPage));
    setfilteredCurrentPage(1);
  }, [search, selectCategory, allProducts, sortOrder]);

  const handleFilterPageChange = (e, page) => {
    e.preventDefault();
    setfilteredCurrentPage(page);
  };

  const indexOfLastItem = filteredCurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFilteredProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);


  const handleFromISBN = async() => {
    const isbn = tempProduct.isbn;
    if (!isbn){
      dispatch(pushMessage({
        success: false,
        message: '請先輸入ISBN'
      }));
      return;
    }
    try{
      const res = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${GOOGLE_BOOKS_API_KEY}`)

      // 先判斷是否有回傳書籍
      if (res.data.totalItems < 1) {
        dispatch(pushMessage({
          success: false,
          message: '查無資料，請確認 ISBN 是否正確'
        }));
        return;
      }

      // 有資料後再進行後續處理
      dispatch(pushMessage({
        success: true,
        message: `找到 ${res.data.totalItems} 筆資料，已成功套用`
      }));
      const apiBook = res.data.items?.[0];
      const apiBookTitle = encodeURIComponent(apiBook.volumeInfo.title || '');
      const apiBookId = apiBook.id;
      const googleBookUrl = `https://www.google.com.tw/books/edition/${apiBookTitle}/${apiBookId}?hl=zh-TW&gbpv=0`;

      setTempProduct((prev) => ({
        ...prev,
        imageUrl: apiBook.volumeInfo.imageLinks?.thumbnail.replace('http://', 'https://') || prev.imageUrl,
        title: apiBook.volumeInfo.title || prev.title,
        content: apiBook.searchInfo?.textSnippet || prev.content,
        imagesUrl: [""],
        author: apiBook.volumeInfo?.authors?.[0] || prev.author,
        publisher: apiBook.volumeInfo.publisher || prev.publisher,
        publishdate: apiBook.volumeInfo.publishedDate.replace(/-/g, "/") || prev.publishedDate,
        googleBookUrl,
        previewLink: apiBook.volumeInfo.previewLink
        // description: prev.description,
      }))
    }
    catch(error){
      dispatch(pushMessage({
        success: false,
        message: '搜尋時發生錯誤，請稍後再試'
      }));
    }
  }

  return(
    <>
    <div className="container">
      <div className="row py-3 g-3">
        <div className="col-12">
          <h4>產品資訊</h4>
        </div>

        {/* 搜尋 & 分類篩選 */}
        <div className="col-md-6">
          <div className="form-search d-flex">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search" className="form-control" placeholder="請輸入書名" />
            <button type="submit" className="btn px-2 py-0">
              <span className="material-symbols-outlined icon-black"> search </span>
            </button>
          </div>
        </div>
        <div className="col-md-6">
          <select
            onChange={(e) => setSelectCategory(e.target.value)}
            value={selectCategory}
            className="form-select">
            <option disabled>請選擇分類</option>
            <option key="全部商品" value="全部商品">全部商品</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* 商品數量 & 新增按鈕 */}
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-3">
              <p>
                目前上架數量：
                <span className="fw-bold text-orange-dark">{allProducts ? Object.keys(allProducts).length : 0}</span>
              </p>

              <p>
                篩選後數量：
                <span className="fw-bold text-orange-dark">{filteredProducts.length}</span>
              </p>
            </div>

            <button
              onClick={() => openModal('create')}
              className="btn btn-orange"
              type="button">新增產品
            </button>
          </div>
        </div>

        {/* 商品列表 */}
        <div className="col-12">
          <div className="d-flex justify-content-end mb-2">
            <button
              className={`btn btn-sm ${sortOrder === '' ? 'btn-secondary' : 'btn-danger'}`}
              onClick={() => setSortOrder("")}
            >
              清除排序
            </button>
          </div>

          <div className="product-header fw-bold text-center">
            <span className="product-name">產品名稱</span>
            {/* 售價 + 排序按鈕 */}
            <span className="product-price d-none d-md-flex align-items-center justify-content-center">
              <button className="border-0 bg-transparent" onClick={() => setSortOrder("desc")}>
                ▼
              </button>
              售價
              <button className="border-0 bg-transparent" onClick={() => setSortOrder("asc")}>
                ▲
              </button>
            </span>
            <span className="product-qty d-none d-md-block">數量</span>
            <span className="product-status d-none d-md-block">狀態</span>
            <span className="product-action">操作</span>
          </div>

          <div className="product-list">
            {search || selectCategory ? (
              filteredProducts.length > 0 ? (
                currentFilteredProducts.map((product) => (
                  <div className="product-item text-center" key={product.id}>
                    <span className="product-name flex-grow-1">{product.title}</span>
                    <span className="product-price d-none d-md-block">{product.price}</span>
                    <span className="product-qty d-none d-md-block">{product.qty}</span>
                    <span className={`product-status d-none d-md-block ${product.is_enabled ? "text-success fw-bold" : "text-danger fw-bold"}`}>
                      {product.is_enabled ? "已啟用" : "未啟用"}
                    </span>
                    <span className="product-action">
                      <div className="d-flex gap-2">
                        <button onClick={() => openModal('edit', product)} className="btn btn-outline-primary btn-sm">
                          編輯
                        </button>
                        <button onClick={() => deleteProduct(product.id)} className="btn btn-outline-danger btn-sm">
                          刪除
                        </button>
                      </div>
                    </span>
                  </div>
                ))
              ) : (
                <p className="py-3">沒有找到相關商品</p>
              )
            ) : (
              products.map((product) => (
                <div className="product-item text-center" key={product.id}>
                  <span className="product-name flex-grow-1">{product.title}</span>
                  <span className="product-price d-none d-md-block">{product.price}</span>
                  <span className="product-qty d-none d-md-block">{product.qty}</span>
                  <span className={`product-status d-none d-md-block ${product.is_enabled ? "text-success fw-bold" : "text-danger fw-bold"}`}>
                    {product.is_enabled ? "已啟用" : "未啟用"}
                  </span>
                  <span className="product-action">
                    <div className="d-flex gap-2">
                      <button onClick={() => openModal('edit', product)} className="btn btn-outline-primary btn-sm">
                        編輯
                      </button>
                      <button onClick={() => deleteProduct(product.id)} className="btn btn-outline-danger btn-sm">
                        刪除
                      </button>
                    </div>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 分頁 */}
        <nav className="pagination-container" aria-label="分頁導航">
          {search || selectCategory ? (
            <ul className="pagination">
              {/* 上一頁按鈕 */}
              <li className={`page-item ${filteredCurrentPage === 1 ? 'disabled' : ''}`}>
                <a
                  onClick={(e) => handleFilterPageChange(e, filteredCurrentPage - 1)}
                  className="page-link" href="#">
                  上一頁
                </a>
              </li>
              {/* 頁碼 */}
              {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage)}).map((_, index) => (
              <li key={index} className={`page-item ${filteredCurrentPage === index + 1 ? 'active' : ''}`}>
                <a
                  onClick={(e) => handleFilterPageChange(e, index + 1)}
                  className="page-link" href="#">
                  { index + 1 }
                </a>
              </li>
              ))}
              {/* 下一頁按鈕 */}
              <li className={`page-item ${filteredCurrentPage === filteredTotalPage ? 'disabled' : ''}`}>
                <a
                  onClick={(e) => handleFilterPageChange(e, filteredCurrentPage + 1)}
                  className="page-link" href="#">
                  下一頁
                </a>
              </li>
            </ul>
          ) : (
            <ul className="pagination">
              {/* 上一頁按鈕 */}
              <li className={`page-item ${pagination.has_pre ? '' : 'disabled'}`}>
                <a 
                  onClick={(e) => handlePageChange(e, pagination.current_page - 1)}
                  className="page-link"
                  href="#">
                  上一頁
                </a>
              </li>
              {/* 頁碼 */}
              {Array.from({ length: pagination.total_pages }).map((_, index) => (
                <li key={index} className={`page-item ${pagination.current_page === index + 1 ? 'active' : ''}`}>
                  <a 
                    onClick={(e) => handlePageChange(e, index + 1)}
                    className="page-link"
                    href="#">
                    {index + 1}
                  </a>
                </li>
              ))}
              {/* 下一頁按鈕 */}
              <li className={`page-item ${pagination.has_next ? '' : 'disabled'}`}>
                <a
                  onClick={(e) => handlePageChange(e, pagination.current_page + 1)}
                  className="page-link"
                  href="#">
                  下一頁
                </a>
              </li>
            </ul>
          )}
          
        </nav>

        {/* modal */}
        <div id="productModal" ref={productModalRef} className="modal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-bottom">
              <h5 className="modal-title">{modalMode === 'create' ? '新增產品': '編輯產品'}</h5>
                <button onClick={() => closeModal()} type="button" className="btn-close" aria-label="Close"></button>
              </div>

              <div className="modal-body p-4">
                <div className="row g-4">
                  <div className="col-lg-4">
                    {/* 圖片上傳 */}
                    <div className="mb-5">
                      <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                      <input
                        onChange={handleFileChange}
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        className="form-control"
                        id="fileInput"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="primary-image" className="form-label">
                        主圖
                      </label>
                      <div className="input-group">
                        <input
                          value={tempProduct.imageUrl}
                          onChange={handleModalInputChange}
                          name="imageUrl"
                          type="text"
                          id="primary-image"
                          className="form-control"
                          placeholder="請輸入圖片連結"
                        />
                      </div>
                      <img
                        src={tempProduct.imageUrl}
                        alt={tempProduct.title}
                        className="img-fluid"
                      />
                    </div>

                    {/* 副圖 */}
                    <div className="border border-2 border-dashed rounded-3 p-3">
                    {tempProduct.imagesUrl?.map((image, index) => (
                      <div key={index}>
                        <label htmlFor={`images-${index + 1}`} className="form-label">副圖 {index + 1}</label>
                        <input
                          value={image}
                          onChange={(e) => handleImageChange(e, index)}
                          id={`images-${index + 1}`} type="text" className="form-control" placeholder={`圖片網址-${index + 1}`} />
                        {image && (
                          <img 
                            src={image}
                            alt={`副圖 ${index + 1}`}
                            className="img-fluid mb-2"/>
                        )}
                      </div>
                    ))}

                    <div className="btn-group w-100">
                      {tempProduct.imagesUrl.length < 5 && tempProduct.imagesUrl.length[tempProduct.imagesUrl.length - 1] !== "" && 
                      (<button onClick={handleAddImage} className="btn btn-outline-primary btn-sm w-100">新增圖片</button>)}
                      {tempProduct.imagesUrl.length > 1 && 
                      (<button onClick={handleRemoveImage} className="btn btn-outline-danger btn-sm w-100">取消圖片</button>)}
                    </div>
                  </div>
                </div>

                  <div className="col-lg-8">
                    <div className="row g-4">
                      <div className="col-6">
                        <label htmlFor="title" className="form-label">
                          標題
                        </label>
                        <input
                          value={tempProduct.title}
                          onChange={handleModalInputChange}
                          name="title"
                          id="title"
                          type="text"
                          className="form-control"
                          placeholder="請輸入標題"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="maintitle" className="form-label">
                          簡短標題
                        </label>
                        <input
                          value={tempProduct.maintitle}
                          onChange={handleModalInputChange}
                          name="maintitle"
                          id="maintitle"
                          type="text"
                          className="form-control"
                          placeholder="請輸入簡短標題"
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="isbn" className="form-label">
                          ISBN
                        </label>
                        <div className="input-group">
                          <input
                            value={tempProduct.isbn}
                            onChange={handleModalInputChange}
                            name="isbn"
                            id="isbn"
                            type="number"
                            className="form-control"
                            placeholder="請輸入ISBN"
                          />
                          <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={handleFromISBN}
                          >
                            搜尋
                          </button>
                        </div>

                          {/* 加在這裡，搜尋成功才顯示 */}
                          {tempProduct.googleBookUrl && (
                            <div className="mt-2">
                              <a
                                href={tempProduct.googleBookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-link p-0"
                              >
                                🔗 查看此書在 Google 圖書
                              </a>
                            </div>
                          )}
                        {/* <input
                          value={tempProduct.isbn}
                          onChange={handleModalInputChange}
                          name="isbn"
                          id="isbn"
                          type="number"
                          className="form-control"
                          placeholder="請輸入ISBN"
                        /> */}
                      </div>
                      <div className="col-12">
                        <label htmlFor="category" className="form-label">
                          分類
                        </label>
                        <select
                          value={tempProduct.category}
                          onChange={handleModalInputChange}
                          name="category"
                          id="category"
                          type="text"
                          className="form-control"
                          >
                          <option value="" disabled>
                            請選擇分類
                          </option>
                          {categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-6">
                        <label htmlFor="origin_price" className="form-label">
                          原價
                        </label>
                        <input
                          value={tempProduct.origin_price}
                          onChange={handleModalInputChange}
                          name="origin_price"
                          id="origin_price"
                          type="number"
                          className="form-control"
                          placeholder="請輸入原價"
                          min="0"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="price" className="form-label">
                          售價
                        </label>
                        <input
                          value={tempProduct.price}
                          onChange={handleModalInputChange}
                          name="price"
                          id="price"
                          type="number"
                          className="form-control"
                          placeholder="請輸入售價"
                          min="0"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="qty" className="form-label">
                          數量
                        </label>
                        <input
                          value={tempProduct.qty}
                          onChange={handleModalInputChange}
                          name="qty"
                          id="qty"
                          type="number"
                          className="form-control"
                          placeholder="請輸入數量"
                          min="0"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="unit" className="form-label">
                          單位
                        </label>
                        <input
                          value={tempProduct.unit}
                          onChange={handleModalInputChange}
                          name="unit"
                          id="unit"
                          type="text"
                          className="form-control"
                          placeholder="請輸入單位"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="author" className="form-label">
                          作者
                        </label>
                        <input
                          value={tempProduct.author}
                          onChange={handleModalInputChange}
                          name="author"
                          id="author"
                          type="text"
                          className="form-control"
                          placeholder="請輸入作者"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="publisher" className="form-label">
                          出版社
                        </label>
                        <input
                          value={tempProduct.publisher}
                          onChange={handleModalInputChange}
                          name="publisher"
                          id="publisher"
                          type="text"
                          className="form-control"
                          placeholder="請輸入出版社"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="publishdate" className="form-label">
                          出版日期 <span className="ms-2 text-danger">（西元年/月/日）</span>
                        </label>
                        <input
                          value={tempProduct.publishdate}
                          onChange={handleModalInputChange}
                          name="publishdate"
                          id="publishdate"
                          type="text"
                          className="form-control"
                          placeholder="請輸入出版日期"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="suitable" className="form-label">
                          識讀年齡
                        </label>
                        <input
                          value={tempProduct.suitable}
                          onChange={handleModalInputChange}
                          name="suitable"
                          id="suitable"
                          type="text"
                          className="form-control"
                          placeholder="請輸入識讀年齡"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="language" className="form-label">
                          語言
                        </label>
                        <input
                          value={tempProduct.language}
                          onChange={handleModalInputChange}
                          name="language"
                          id="language"
                          type="text"
                          className="form-control"
                          placeholder="請輸入語言"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="size" className="form-label">
                          規格
                        </label>
                        <input
                          value={tempProduct.size}
                          onChange={handleModalInputChange}
                          name="size"
                          id="size"
                          type="text"
                          className="form-control"
                          placeholder="請輸入平裝或精裝"
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="condition" className="form-label">
                        書況標籤
                        </label>
                        <select
                          value={tempProduct.condition}
                          onChange={handleModalInputChange}
                          name="condition"
                          id="condition"
                          className="form-select"
                        >
                          <option value="">請選擇書況</option>
                          <option value="A">A（極少翻閱，接近新書）</option>
                          <option value="B">B（輕微使用痕跡）</option>
                          <option value="C">C（可能含筆記、劃線）</option>
                          <option value="D">D（可能嚴重泛黃、書斑、磨損）</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label htmlFor="conditionDescription" className="form-label">
                          書況說明
                        </label>
                        <textarea
                          value={tempProduct.conditionDescription}
                          onChange={handleModalInputChange}
                          name="conditionDescription"
                          id="conditionDescription"
                          type="text"
                          className="form-control"
                          placeholder="請輸入書況說明"
                        ></textarea>
                      </div>
                      <div className="col-12">
                        <label htmlFor="description" className="form-label">
                          產品描述
                        </label>
                        <textarea
                          value={tempProduct.description}
                          onChange={handleModalInputChange}
                          name="description"
                          id="description"
                          className="form-control"
                          rows={4}
                          placeholder="請輸入產品描述"
                        ></textarea>
                      </div>
                      <div className="col-12">
                        <label htmlFor="content" className="form-label">
                          說明內容 <span className="ms-2 text-danger">（字數限制180字）</span>
                        </label>
                        <textarea
                          value={tempProduct.content}
                          onChange={handleModalInputChange}
                          name="content"
                          id="content"
                          className="form-control"
                          rows={4}
                          placeholder="請輸入說明內容"
                          maxLength={180}
                        ></textarea>
                      </div>
                    </div>
                    <div className="form-check mt-4">
                      <input
                        checked={tempProduct.is_enabled}
                        onChange={handleModalInputChange}
                        name="is_enabled"
                        type="checkbox"
                        className="form-check-input"
                        id="isEnabled"
                      />
                      <label className="form-check-label" htmlFor="isEnabled">
                        是否啟用
                      </label>
                    </div>

                  </div>
                </div>
              </div>

              <div className="modal-footer border-top bg-light">
                <button onClick={() => closeModal()} type="button" className="btn btn-secondary">
                  取消
                </button>
                <button onClick={handleUpdateProduct} type="button" className="btn btn-primary">
                  確認
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      {isScreenLoading && <LoadingComponent />}
    </div>
    </>
  )
}