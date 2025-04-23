import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { pushMessage } from "../redux/toastSlice";
import ToastComponent from "../components/ToastComponent";

export default function Register(){

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({ mode: "onBlur" });

  const onSubmit = () => {

    if (!isValid) return;
    dispatch(pushMessage({
      success: true,
      message: '註冊成功，跳轉登入頁面'
    }))
    setTimeout(() => navigate("/login"), 2000); // 延遲跳轉，讓 toast 顯示
  };

  return(
    <>
    <ToastComponent />
    <main className="login">
      <div className="bg">
        <div className="container py-2">

          <div className="row justify-content-center g-lg-0">
            {/* 左側登入圖片 */}
            <div className="col-lg-6 d-lg-block d-none">
              <div className="login-img p-0 border border-orange-dark rounded">
                <img className="w-100 h-100" src="./images/login-img.png" alt="login-img" />
              </div>
            </div>

            {/* 右側登入表單 */}
            <div className="col-lg-6">
            <div className="login-form bg-white p-5 rounded border border-orange-dark rounded box-shadow-lg">
                <div className="text-center mb-4">
                  <Link className="text-secondary" to="/">
                    <img className="logo mb-4" src="./images/logo.png" alt="logo" />
                  </Link>
                  <h4 className="text-orange-dark">會員註冊</h4>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label htmlFor="name" className="form-label fw-bold mb-lg-2">會員帳號</label>
                  <input
                    {...register('name', {
                      required: '姓名 欄位必填'
                    })}
                    type="text" id="name" className="form-control bg-gray border-radius border-0 py-2 px-3" placeholder="請輸入會員帳號" />
                    {errors?.name && <p className="text-danger my-2">{errors.name.message}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-bold mb-lg-2">會員密碼</label>
                  <input
                    {...register('password', { 
                      required: '密碼 欄位必填', 
                      minLength: { value: 6, message: "密碼至少 6 個字元" } 
                    })}
                    type="password" id="password" className="form-control bg-gray border-radius border-0 py-2 px-3" placeholder="請輸入會員密碼" />
                    {errors?.password && <p className="text-danger my-2">{errors.password.message}</p>}
                </div>
                <div className="mb-4">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="defaultCheck" value="" />
                    <label className="form-check-label" htmlFor="defaultCheck">保持登入</label>
                  </div>
                </div>
                <button className="btn btn-orange-dark w-100 py-3 mb-4" type="submit">立即註冊</button>
                <div className="d-flex justify-content-center gap-2">
                  <p>已經是會員了？</p>
                  <Link className="link-accent-200" aria-current="page" to="/login">點此登入</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  )
}