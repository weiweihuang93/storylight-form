import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../context/AppContext";
import { useDispatch } from "react-redux";
import { pushMessage } from "../redux/toastSlice";
import LoadingComponent from "../components/LoadingComponent";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CartPage(){

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { cartData, getCartData, shippingAdd, setShippingAdd } = useContext(AppContext);
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  const delAllCart = async() => {
    setIsScreenLoading(true);
    try{
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
      dispatch(pushMessage({
        success: true,
        message: '購物車目前沒有商品 ⋟﹏⋞'
      }));
      getCartData();
    }catch(err){
      dispatch(pushMessage(error.response.data));
    }finally{
      setIsScreenLoading(false);
    }
  };

  const delIdCart = async(cart_id) => {
    setIsScreenLoading(true);
    try{
      const res = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${cart_id}`);
      dispatch(pushMessage(res.data));
      getCartData();
    }catch(err){
      dispatch(pushMessage(error.response.data));
    }finally{
      setIsScreenLoading(false);
    }
  };

  // 處理運費商品
  const updateCart = async() => {
    setIsScreenLoading(true);
    try{
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
        "data": {
          "product_id": "-OLDh-kx-_pNd2Ls902s", //加入運費商品
          "qty": 1
        }
      });
      dispatch(pushMessage({
        success: true,
        message: '未達免運門檻，已加入運費。'
      }));
      setShippingAdd(true);
      getCartData();
    }catch(err){
      dispatch(pushMessage({
        success: false,
        message: '加入運費失敗，請稍後再試。'
      }));
    }finally{
      setIsScreenLoading(false);
    }
  };

  // 刪除運費商品
  const delShippingIdCart = async(cart_id) => {
    setIsScreenLoading(true);
    try{
      const res = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${cart_id}`);
      dispatch(pushMessage({
        success: true,
        message: cartData.final_total >= 1600 ? '已達免運門檻，刪除運費。' : '購物車目前沒有商品 ⋟﹏⋞'
      }));
      getCartData();
    }catch(err){
      dispatch(pushMessage({
        success: false,
        message: '刪除運費失敗，請稍後再試。'
      }));
    }finally{
      setIsScreenLoading(false);
    }
  };

  useEffect(() => {
    const isShippingInCart = cartData?.carts?.some((item) => item.product_id === "-OLDh-kx-_pNd2Ls902s");
    if (isShippingInCart){
      setShippingAdd(true);
      if (cartData.final_total >= 1600 || cartData.carts.length === 1){
        //移除運費商品
        const findCartId = cartData.carts.find((item) => item.product_id === "-OLDh-kx-_pNd2Ls902s")?.id;
        delShippingIdCart(findCartId);
      }
    }else{
      setShippingAdd(false);
      if (cartData?.carts?.length > 0 && cartData.final_total < 1500){
        updateCart();
      }
    };
  }, [cartData]);

  return(
    <>
    <section className="section-cart">
      <div className="bg">
        <div className="container py-6">
          <h2 className="mb-4">購物車</h2>
          <div className="row g-3">
          {cartData?.carts?.length > 0 ?
          (<>
            <div className="col-xl-9">
              <div className="cart-confirm p-3">
                <div className="d-flex justify-content-between">
                  <h4>確認訂單</h4>
                  <button onClick={() => delAllCart()} className="btn btn-outline-danger fs-6" type="button">清空購物車</button>
                </div>
                
                <div className="cart-item fw-bold text-center">
                  <p className="cart-info">產品資料</p>
                  <p className="cart-price d-none d-md-block">單價</p>
                  <p className="cart-qty d-none d-md-block">數量</p>
                  <p className="cart-total">小計</p>
                  <p>刪除</p>
                </div>

                {cartData?.carts?.map((cart) => (
                <div className="cart-item" key={cart.id}>
                  <img src={cart.product.imageUrl} alt={cart.product.title} />
                  <div className="cart-info">
                    <p>{cart.product.maintitle}</p>
                  </div>
                  <p className="cart-price d-none d-md-block">NT${cart.product.price}</p>
                  <p className="cart-qty d-none d-md-block">x {cart.qty}</p>
                  <p className="cart-total">NT${cart.total}</p>
                  <button
                    onClick={() => delIdCart(cart.id)}
                    type="button"
                    className="btn btn-sm">
                    <span className="material-symbols-outlined icon-gray"> delete </span>
                  </button>
                </div>
                ))}

              </div>
            </div>
              
            <div className="col-xl-3 position">
              <div className="bg-white">
                <div className="cart-order px-3 py-4 border rounded">
                  <h4>訂單明細</h4>
                  <div className="d-flex justify-content-between">
                    <p>總金額</p>
                    <p>NT$ {cartData.total - (shippingAdd ? 100 : 0)}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p>宅配運費</p>
                    <p>NT$ {shippingAdd ? "100" : "0"}</p>
                  </div>
                  <p className={shippingAdd ? "text-gray-600" : "text-orange-dark"}>
                    {shippingAdd
                      ? "再加購一些商品，您就可以享有免運優惠囉！"
                      : "您已達免運門檻，快完成您的購物吧！"}
                  </p>

                {/* 進行下一步的按鈕 */}
                <button onClick={() => navigate("/cart/order")} className="btn btn-orange-dark w-100">
                  下一步，<span className="d-lg-inline d-xl-block">填寫訂單資料</span>
                </button>
                </div>
              </div>
            </div>
                
            </>) : 
            (<>
              <h4 className="text-gray-600 py-3">購物車目前沒有商品 ⋟﹏⋞</h4>
            </>)}
          </div>
        </div>
      </div>

      {isScreenLoading && <LoadingComponent />}
    </section>
    </>
  )
}