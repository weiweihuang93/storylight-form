import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router"
import { AppContext } from "../context/AppContext";
import { useDispatch } from "react-redux";
import { pushMessage } from "../redux/toastSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function PaymentPage(){

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { orderId } = useContext(AppContext);

  useEffect(() => {
    if (!orderId) return;

    const handlePayment = async() => {
      try{
        const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/pay/${orderId}`);
        dispatch(pushMessage(res.data));
        setTimeout(() => navigate("/cart/complete"), 2000); // 延遲跳轉，讓 toast 顯示
      }catch(err){
        dispatch(pushMessage({
          success: false,
          message: '訂單付款發生錯誤，請稍後再試。'
        }))
      }
    }

    const timer = setTimeout(handlePayment, 3000);

    return () => clearTimeout(timer);
  }, [orderId]);

  return(
    <>
    <section className="section-order">
      <div className="bg">
        <div className="container p-6">
            <div className="text-center">
              <h3 className="mb-5">正在處理付款...</h3>
              <h5 className="mb-5">訂單編號：{ orderId || "無法取得訂單編號" }</h5>
              <p className="mb-5">請稍候，我們正在處理您的付款。</p>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
        </div>
      </div>
    </section>
    </>
  )
}