import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router"
import { useDispatch } from "react-redux";
import { pushMessage } from "../redux/toastSlice";
import ToastComponent from "../components/ToastComponent";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function AdminLogin(){

  const [account, setAccount] = useState({
    "username": "",
    "password": ""
  });

  const [token, setToken] = useState();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if(token){
      axios.defaults.headers.common['Authorization'] = token;
      CheckUserLogin(); // 檢查用戶是否已登入
    }
  }, []);

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setAccount({
      ...account,
      [name]: value
    })
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/v2/admin/signin`, account);
      const { expired, token } = res.data;
      setToken(token);
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
      axios.defaults.headers.common['Authorization'] = token;
      dispatch(pushMessage(res.data));
      setTimeout(() => navigate("/admin/product"), 2000); // 延遲跳轉，讓 toast 顯示
    } catch (error) {
      dispatch(pushMessage(error.response.data));
    }
  };

  const CheckUserLogin = async () => {
    try {
      await axios.post(`${BASE_URL}/v2/api/user/check`);
      dispatch(pushMessage({
        success: true,
        message: '登入成功'
      }));
      setTimeout(() => navigate("/admin/product"), 2000); // 延遲跳轉，讓 toast 顯示
    } catch (error) {
      dispatch(pushMessage(error.response.data));
      navigate("/adminLogin");
    }
  };

  return(
    <>
    <ToastComponent />
    <main className="adminlogin">
      <div className="bg">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="bg-white shadow p-5 rounded border">
                <div className="text-center mb-4">
                  <Link className="text-secondary" to="/">
                    <img className="logo mb-4" src="./images/logo.png" alt="logo" />
                  </Link>
                  <h4 className="text-orange-dark">管理員登入</h4>
                </div>
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label htmlFor="adminAccount" className="form-label fw-bold">管理員帳號</label>
                    <input
                      name="username"
                      value={account.username}
                      onChange={handleLoginInputChange}
                      type="text"
                      id="adminAccount"
                      className="form-control py-2 px-3"
                      placeholder="請輸入帳號" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="adminPassword" className="form-label fw-bold">管理員密碼</label>
                    <input
                      name="password"
                      onChange={handleLoginInputChange}
                      value={account.password}
                      type="password"
                      id="adminPassword"
                      className="form-control py-2 px-3"
                      placeholder="請輸入密碼" />
                  </div>
                  <button className="btn btn-orange-dark w-100 py-3 mb-4" type="submit">登入</button>
                </form>
                <div className="text-center">
                  <Link className="text-secondary" to="/">返回首頁</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  )
}