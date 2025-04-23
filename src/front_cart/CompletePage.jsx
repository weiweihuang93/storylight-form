import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router";
import { useDispatch } from "react-redux";
import { pushMessage } from "../redux/toastSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CompletePage(){

  const dispatch = useDispatch();
  const { orderId, shippingAdd } = useContext(AppContext);
  const [orderData, setOrderData] = useState({});

  useEffect(() => {
    getOrderId();
  }, [orderId])

  const getOrderId = async() => {
    try{
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/order/${orderId}`);
      setOrderData(res.data.order);
    }catch(err){
      dispatch(pushMessage({
        success: false,
        message: '訂單發生錯誤，請稍後再試。'
      }))
    }
  };

  return(
    <>
    <section className="section-order">
      <div className="bg">
        <div className="container p-lg-6 py-6">
          <div className="text-center">
            <span className="material-symbols-outlined d-block fs-1 text-success">
              check_circle
            </span>
            <h3 className="mb-3">已收到您的訂單，感謝你的購買</h3>
          </div>

          <div className="order-content mt-4 p-4 border rounded bg-white w-md-100 w-lg50">
            <h5 className="mb-3">訂單資訊</h5>
            <ul>
              <li><strong>訂單編號：</strong>{orderId}</li>
              <li>
                <strong>訂單時間：</strong>
                {new Date(orderData.create_at * 1000).toLocaleString("zh-TW", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false, // 24 小時制
                })}
              </li>
              <li><strong>運送方式：</strong>宅配</li>
              <li className="text-danger">預計出貨時間：2-3 個工作天內</li>
              <li>
                <strong>總金額：</strong>NT$ {Math.round(orderData.total)}
                {shippingAdd && <span className="text-muted">（已加收運費 NT$ 100）</span>}
              </li>
              <li>
                <strong>付款狀態：</strong>
                {orderData.is_paid ? <span className="text-success">已付款</span> : <span className="text-danger">尚未付款</span>}
              </li>
            </ul>
          </div>
          <div className="order-content mt-4 p-4 border rounded bg-white w-md-100 w-lg50">
            <h5 className="mb-3">訂單明細</h5>
            <ul>
              {Object.values(orderData.products || {}).filter((item) => (
                item.product_id !== "-OLDh-kx-_pNd2Ls902s"

              )).map((item) => (
                <li key={item.product_id} className={`d-flex align-items-center ${orderData.products.length > 1 ? "border-bottom pb-3" : ""}`}>
                  <img src={item.product.imageUrl} alt={item.product.title} className="me-3 rounded" width="80" />
                  <div>
                    <h6 className="">{item.product.title}</h6>
                    <p>數量：{item.qty}</p>
                  </div>
                </li>
                ))}
            </ul>
          </div>

          <div className="mt-5">
            <Link to="/" className="btn btn-orange-dark w-100">返回首頁</Link>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}