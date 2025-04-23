import { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { AppContext } from "../context/AppContext";
import ToastComponent from "../components/ToastComponent";

export default function CartLayout(){
  
  const { login } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if(!login){
      navigate("/login");
    }
  }, [login]);

  const steps = [
    { path: "/cart", title: "確認商品" },
    { path: "/cart/order", title: "填寫訂單" },
    { path: "/cart/payment", title: "訂單付款" },
    { path: "/cart/complete", title: "訂單完成" },
  ]

  return(
    <>
    <section className="section-progress py-5">
      <div className="container">
        <div className="row row-cols-4">
          {steps.map((step, index) => (
            <div key={index} className={`col p-3 ${location.pathname === step.path ? "active" : "" }`}>
              <div className="circle">{ index + 1 }</div>
              <div className="title">{ step.title }</div>
          </div>
          ))}
        </div>
      </div>
    </section>

    <Outlet />
    <ToastComponent />
    </>
  )
}