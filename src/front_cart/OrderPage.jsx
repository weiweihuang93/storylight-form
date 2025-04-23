import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { AppContext } from "../context/AppContext";
import { useDispatch } from "react-redux";
import { pushMessage } from "../redux/toastSlice";
import LoadingComponent from "../components/LoadingComponent";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function OrderPage() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid }
  } = useForm({ mode: "onBlur" });

  const paymentMethod = watch("paymentMethod");

  const { setOrderId, cartData, setCartData, getCartData, selectedCoupon, setSelectedCoupon } = useContext(AppContext);
  const [selectedCouponDescription, setSelectedCouponDescription] = useState("");
  const [totalAfterCoupon, setTotalAfterCoupon] = useState("");
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  const addcoupons = [
    { code: "WELCOME", title: "新會員專屬優惠", description: "新會員首次購物可享 70% 折扣" },
    { code: "MONTHLY90", title: "限時折扣券", description: "購物可享 90% 折扣，限時使用" },
    { code: "NONE", title: "不使用優惠券", description: "不使用優惠券" },
  ];

  const handleCoupon = async() => {
    setIsScreenLoading(true);
    try{
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/coupon`, {
        "data": {
          "code": selectedCoupon
        }
      });
      dispatch(pushMessage({
        success: true,
        message: '已套用優惠券'
      }))
      setTotalAfterCoupon(res.data.data); //final_total
      // 更新優惠券描述
      const selectCouponData = addcoupons.find(coupon => coupon.code === selectedCoupon);
      setSelectedCouponDescription(selectCouponData ? selectCouponData.description : "");
    }catch(err){
      dispatch(pushMessage({
        success: false,
        message: '使用優惠券發生錯誤，請稍後再試。'
      }))
    }finally{
      setIsScreenLoading(false);
    }
  };

  const handleCouponNone = async() => {
    try{
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/coupon`, {
        "data": {
          "code": "NONE"
        }
      });
      setSelectedCoupon("")
      setTotalAfterCoupon(null); // 沒有選擇優惠券時，清空折扣金額
      setSelectedCouponDescription(""); // 清除優惠券描述
      getCartData();
    }catch(err){
      dispatch(pushMessage({
        success: false,
        message: '使用優惠券發生錯誤，請稍後再試。'
      }))
    }
  };

  const submitOrder = async (data) => {
    try{
      const res = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, data);
      dispatch(pushMessage(res.data));
      setOrderId(res.data.orderId);
      setCartData([]); //清空購物車資料
      navigate("/cart/payment");
    }catch (error){
      dispatch(pushMessage({
        success: false,
        message: '提交訂單發生錯誤，請稍後再試。'
      }))
    }
  };

  const onSubmit = (data) => {
    const { paymentMethod, message, ...user } = data;
    const userData = {
      data: {
        user,
        message,
        paymentMethod
      }
    };
    submitOrder(userData);
    reset();
  };

  useEffect(() => {
    handleCouponNone();
  }, []);

  return (
    <>
    <section className="section-order">
      <div className="bg">
        <div className="container py-6">
          <div className="row g-3">
            {/* 優惠券選擇 */}
            <div className="col-lg-4">
              <div className="bg-white">
                
                <div className="cart-order px-3 py-4 border rounded">
                  <h5 className="">選擇優惠券</h5>
                  <select 
                    className="form-select" 
                    value={selectedCoupon} 
                    onChange={(e) => setSelectedCoupon(e.target.value)}
                  >
                    <option value="" disabled>請選擇優惠券</option>
                    {addcoupons.map((coupon, index) => (
                      <option key={index} value={coupon.code}>
                        {coupon.title}
                      </option>
                    ))}
                  </select>

                  <button onClick={handleCoupon} className="btn btn-orange w-100">
                    使用優惠券
                  </button>
                </div>

                {/* 顯示優惠折扣（只有在按下按鈕後才會顯示） */}
                <div className="cart-order px-3 py-4 border rounded">
                  {totalAfterCoupon && (
                    <>
                    <div className="d-flex justify-content-between">
                      <p>優惠折扣</p>
                      <p>－ NT$ {Math.round(cartData.final_total - totalAfterCoupon.final_total)}</p>
                    </div>

                    {/* 顯示優惠券描述 */}
                    <div>
                      <p className="text-orange-dark">{selectedCouponDescription}</p>
                    </div>
                    </>
                  )}

                {/* 顯示結帳金額 */}
                  {totalAfterCoupon ? 
                  (<>
                  <div className="d-flex justify-content-between">
                    <h5>結帳金額</h5>
                    <h5 className="text-danger">NT$ {Math.round(totalAfterCoupon.final_total)}</h5>
                  </div>
                  </>) : 
                  (<>
                  <div className="d-flex justify-content-between">
                    <h5>結帳金額</h5>
                    <h5 className="text-danger">NT$ {cartData.final_total}</h5>
                  </div>
                  </>)}
                </div>
              </div>

            </div>
            
            <div className="col-lg-8">

              {/* 付款方式 */}
            <form  onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-white px-3 py-4 border rounded h-100 mb-3">
                <div className="mb-4">
                  <h3 className="mb-3">付款方式</h3>
                  <div className="d-flex flex-column gap-3">
                    <label className="d-flex align-items-center">
                      <input {...register("paymentMethod", { required: "請選擇付款方式" })} type="radio" value="creditcard" className="me-2" />
                      信用卡
                    </label>
                    <label className="d-flex align-items-center">
                      <input {...register("paymentMethod")} type="radio" value="atm" className="me-2" />
                      ATM轉帳
                    </label>
                  </div>
                  {errors?.paymentMethod && <p className="text-danger my-2">{errors.paymentMethod.message}</p>}
                </div>

                {/* 信用卡付款欄位 */}
                {paymentMethod === "creditcard" && (
                  <div className="border p-3 mb-3">
                    <h5>信用卡資訊</h5>
                    <div className="mb-2">
                      <label className="form-label">信用卡號</label>
                      <input type="text" className="form-control" 
                        {...register("creditCardNumber", {
                          required: "信用卡號必填",
                          pattern: {
                            value: /^\d{16}$/, // 簡單的 16 位數字驗證
                            message: "信用卡號格式錯誤"
                          }
                        })} />
                        {errors?.creditCardNumber && <p className="text-danger my-2">{errors.creditCardNumber.message}</p>}
                    </div>
                    <div className="mb-2">
                      <label className="form-label">持卡人姓名</label>
                      <input type="text" className="form-control" {...register("cardHolder")} />
                    </div>
                    <div className="row">
                      <div className="col">
                        <label className="form-label">有效期限</label>
                        <input type="text" className="form-control" placeholder="MM/YY" {...register("expiryDate")} />
                      </div>
                      <div className="col">
                        <label className="form-label">CVC</label>
                        <input type="text" className="form-control" {...register("cvc")} />
                      </div>
                    </div>
                  </div>
                )}

                {/* ATM付款欄位*/}
                {paymentMethod === "atm" && (
                  <div className="border p-3 mb-3">
                  <h5>ATM 轉帳資訊</h5>
                  <p>銀行代碼：<strong>123</strong></p>
                  <p>帳戶號碼：<strong>9876543210</strong></p>
                </div>
                )}
              </div>

              {/* 訂單資料 */}
              <div className="bg-white px-3 py-4 border rounded">
                  <h3 className="mb-3">訂單資料</h3>
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="email" className="form-label fw-bold mb-lg-2 mb-1">
                        Email
                      </label>
                      <input
                        {...register('email', {
                          required: 'Email 欄位必填',
                          pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Email 格式錯誤'
                          }
                        })}
                        id="email" type="email" className={`form-control ${errors.email && 'is-invalid'}`} placeholder="請輸入Email" />
                        {errors?.email && <p className="text-danger my-2">{errors.email.message}</p>}
                    </div>
                    <div className="col-12">
                      <label htmlFor="name" className="form-label fw-bold mb-lg-2 mb-1">
                        姓名
                      </label>
                      <input
                        {...register('name', {
                          required: '姓名 欄位必填'
                        })}
                        id="name" type="text" className={`form-control ${errors.name && 'is-invalid'}`} placeholder="請輸入姓名" />
                        {errors?.name && <p className="text-danger my-2">{errors.name.message}</p>}
                    </div>
                    <div className="col-12">
                      <label htmlFor="tel" className="form-label fw-bold mb-lg-2 mb-1">
                        電話
                      </label>
                      <input
                        {...register('tel', {
                          required: '電話 欄位必填',
                          pattern: {
                            value: /^(0[2-8]\d{7}|09\d{8})$/,
                            message: '電話 格式錯誤'
                          }
                        })}
                        id="tel" type="tel" className={`form-control ${errors.tel && 'is-invalid'}`} placeholder="請輸入電話" />
                        {errors?.tel && <p className="text-danger my-2">{errors.tel.message}</p>}
                    </div>
                    <div className="col-12">
                      <label htmlFor="address" className="form-label fw-bold mb-lg-2 mb-1">
                        地址
                      </label>
                      <input
                        {...register('address', {
                          required: '地址 欄位必填'
                        })}
                        id="address" type="text" className={`form-control ${errors.address && 'is-invalid'}`} placeholder="請輸入地址" />
                        {errors?.address && <p className="text-danger my-2">{errors.address.message}</p>}
                    </div>
                    <div className="col-12">
                      <label htmlFor="message" className="form-label fw-bold mb-lg-2 mb-1">
                        留言
                      </label>
                      <textarea
                        {...register('message')}
                        id="message" name="message" className="form-control" cols="30" rows="4" placeholder="請輸入留言"></textarea>
                    </div>
                  </div>

                  {/* 進行下一步的按鈕 */}
                  <div className="text-end mt-3">
                    <button type="submit" className="btn btn-orange-dark px-4 py-2"
                      disabled={
                        cartData.length === 0 ||
                        !paymentMethod ||
                        !isValid ||
                        Object.keys(errors).length > 0}>
                      送出訂單
                    </button>
                  </div>
              </div>
          
          </form>
            </div>
          </div>
        </div>
      </div>

      {isScreenLoading && <LoadingComponent />}
    </section>
    </>
  );
}