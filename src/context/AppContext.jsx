import axios from "axios";
import { createContext, useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { pushMessage } from "../redux/toastSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const AppContext = createContext();

export default function AppProvider({ children }) {
  const [login, setLogin] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [shippingAdd, setShippingAdd] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const dispatch = useDispatch();
  
  // 取得購物車資料
  const getCartData = useCallback(async() => {
    try{
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      setCartData(res.data.data);
    }catch(error){
      dispatch(pushMessage({
        success: false,
        message: '載入購物車發生錯誤，請稍後再試。'
      }))
    }
  }, [setCartData]);

  // 加入購物車
  const addCart = useCallback(async (productId) => {
    setLoadingId(productId);
    try {
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        data: { product_id: productId, qty: 1 }
      });
      dispatch(pushMessage(res.data));
      await getCartData();
    } catch (err) {
      dispatch(pushMessage(err.response.data));
    } finally {
      setLoadingId(null);
    }
  }, [cartData]);

  useEffect(() => {
    getCartData();
  }, []);

  // 收藏功能
  const toggleFavorite = useCallback((productId) => {
    setFavorites((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  }, [setFavorites]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);
  
  useEffect(() => {
    if (Object.keys(favorites).length) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  return (
    <AppContext.Provider value={{

      login, setLogin,
      cartData, setCartData, getCartData, addCart,
      shippingAdd, setShippingAdd,
      selectedCoupon, setSelectedCoupon,
      orderId, setOrderId,
      favorites, toggleFavorite,
      loadingId
      
      }}>
      {children}
    </AppContext.Provider>
  );
}

export { AppContext };