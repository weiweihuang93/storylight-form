import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toast as BsToast } from "bootstrap";
import { removeMessage } from "../redux/toastSlice";

export default function ToastComponent() {

  const messages = useSelector(state => state.toast.messages);
  const dispatch = useDispatch();

  const toastRefs = useRef({});
  useEffect(() => {
    messages.forEach((message) => {
      const toastElement = toastRefs.current[message.id];
      if (toastElement) {
        const bsToast = new BsToast(toastElement);
        bsToast.show();

        setTimeout(() => {
          dispatch(removeMessage(message.id))
        }, 2000)
      }
    });
  }, [messages]);

  return (
    <>
    <section className={`section-toast position-fixed end-0 p-3 ${messages.length === 0 ? 'd-none' : ''}`} style={{ top: '115px', zIndex: 2000 }}>
      {messages?.map((message) => (
      <div
        key={message.id}
        ref={el => toastRefs.current[message.id] = el}
        className="toast mb-3" role="alert" aria-live="assertive" aria-atomic="true">
        <div className={`toast-header text-white ${message.status === "success" ? "bg-success" : "bg-danger"}`}>
          <strong className="me-auto">{message.status === "success" ? "成功" : "失敗"}</strong>
          <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div className="toast-body">
          <pre>{message.message}</pre>
        </div>
      </div>
    ))}
    </section>
    </>
  );
}