import axios from "axios";
import { useEffect } from "react";
import { NavLink, Outlet } from "react-router";
import ToastComponent from "../components/ToastComponent";

const AdminRoutes = [
  {path: "/admin/order", name: "訂單管理"},
  {path: "/admin/product", name: "商品管理"},
]

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function AdminLayout(){

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if(token){
      axios.defaults.headers.common['Authorization'] = token;
      // getProduct();
    }else{
      Navigate("/adminLogin");
    }
  }, []);

  return(
    <>
    <ToastComponent />

    <main>
      <div className="container py-3">
        <div className="row g-3">
          <aside className="col-lg-3 bg-gray border rounded">
            <h5 className="py-3">您好，管理員</h5>
            <ul className="list-group rounded-0">
              {AdminRoutes.map((route) => (
                <li className="nav-item" key={route.path}>
                  <NavLink
                    to={route.path}
                    end
                    className={({ isActive }) =>
                      `list-group-item list-group-item-action py-3 fw-bold ${
                        isActive ? "active" : ""
                      }`
                    }
                  >
                    {route.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </aside>
          <section className="col-lg-9 section-dashboard border rounded">
            <Outlet />
          </section>
        </div>
      </div>
    </main>
    </>
  )
}