import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { useDispatch } from "react-redux";
import { pushMessage } from "../redux/toastSlice";

export default function HelpPage(){

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm({ mode: "onBlur" });

  const onSubmit = (data) => {
    dispatch(pushMessage({
      success: true,
      message: '您的表單已提交！我們將盡快與您聯繫。'
    }))
    reset();
  };
  
  return(
    <>
    <div className="container py-3">
      {/* 麵包屑導航 */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">首頁</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            幫助中心
          </li>
        </ol>
      </nav>

      {/* <!-- FAQ --> */}
      <section className="section-faq mb-5">
        <div className="bg-secondary-500 py-lg-6 p-3 rounded shadow">
          <div className="container">
            <h2 className="text-center mb-lg-5 mb-4">常見問題</h2>
            <div className="accordion mb-5" id="faqAccordion">
              {/* <!-- 問題 1 --> */}
              <div className="accordion-item">
                <h3 className="accordion-header">
                  <div className="faq-q accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                  所有書籍都是現貨嗎？
                  </div>
                </h3>
                <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div className="faq-a accordion-body">
                    <p>是的！所有書籍皆為現貨銷售，下單後即可安排出貨。</p>
                  </div>
                </div>
              </div>

              {/* <!-- 問題 2 --> */}
              <div className="accordion-item">
                <h3 className="accordion-header">
                  <div className="faq-q accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                  書籍的保存狀況如何？
                  </div>
                </h3>
                <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div className="faq-a accordion-body">
                    <ul className="d-flex flex-column gap-3">
                      <li className="fw-bold">我們的二手書均經過消毒清潔、分類整理，並依據書籍狀況分類為：</li>
                      <li>A：極少翻閱，書況接近新書。</li>
                      <li>B：有使用痕跡，可能有自然泛黃、書斑、少量髒污，不影響閱讀。</li>
                      <li>C：可能含有筆記、劃線或重點標記。可能有書皮磨損、封面折痕、自然泛黃、書斑、髒污。但內容完整可讀。</li>
                      <li>D：可能年份較久遠，嚴重泛黃、書斑、髒污、封面或內頁磨損。</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* <!-- 問題 3 --> */}
              <div className="accordion-item">
                <h3 className="accordion-header">
                  <div className="faq-q accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                    如何付款與配送？
                  </div>
                </h3>
                <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div className="faq-a accordion-body">
                    <ul className="d-flex flex-column gap-3 mb-3">
                      <li className="fw-bold">付款方式：</li>
                      <li>臨櫃轉帳、銀行轉帳。</li>
                    </ul>
                    <ul className="d-flex flex-column gap-3">
                      <li className="fw-bold">下單後多久可以收到？</li>
                      <li>下單後 1～2 個工作日內 配達。</li>
                      <li className="fw-semibold">📌 「當日下單，隔一個工作日出貨」，實際配達時間依物流狀況為準。</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* <!-- 問題 4 --> */}
              <div className="accordion-item">
                <h3 className="accordion-header">
                  <div className="faq-q accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                    運費如何計算？
                  </div>
                </h3>
                <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div className="faq-a accordion-body">
                    <ul className="d-flex flex-column gap-3">
                      <li className="fw-bold">常態免運費標準如下：</li>
                      <li>宅配：滿 1,500 元 免運，未達條件 運費 100 元。</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* <!-- 問題 5 --> */}
              <div className="accordion-item">
                <h3 className="accordion-header">
                  <div className="faq-q accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq5">
                    買錯了，如何退換貨？
                  </div>
                </h3>
                <div id="faq5" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div className="faq-a accordion-body">
                    請直接於平台留言，客服小編會盡速為您處理喔!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- 聯絡我們 --> */}
      <section className="section-contact mb-5">
        <div className="bg-secondary-500 py-lg-6 p-5 rounded shadow">
          <div className="container">
            <h2 className="text-center mb-lg-5 mb-4">聯絡我們</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
              <div className="col-md-6">
                <label htmlFor="name" className="form-label fw-bold mb-lg-2 mb-1">姓名</label>
                <input
                  {...register("name", { required: "請輸入您的姓名" })}
                  type="text"
                  id="name"
                  className="form-control"
                  placeholder="請輸入您的姓名"
                />
                {errors.name && <p className="text-danger my-2">{errors.name.message}</p>}
                </div>
              <div className="col-md-6">
                <label htmlFor="tel" className="form-label fw-bold mb-lg-2 mb-1">電話</label>
                <input
                  {...register('tel', {
                    required: '請輸入您的電話',
                    pattern: {
                      value: /^(0[2-8]\d{7}|09\d{8})$/,
                      message: '請輸入有效的電話格式'
                    }
                  })}
                  type="tel"
                  id="tel"
                  className="form-control"
                  placeholder="請輸入您的電話"
                />
                {errors.tel && <p className="text-danger my-2">{errors.tel.message}</p>}
              </div>
              <div className="col-12">
                <label htmlFor="email" className="form-label fw-bold mb-lg-2 mb-1">信箱</label>
                <input
                  {...register("email", {
                    required: "請輸入您的信箱",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "請輸入有效的信箱格式" }
                  })}
                  type="text"
                  id="email"
                  className="form-control"
                  placeholder="請輸入您的信箱"
                />
                {errors.email && <p className="text-danger my-2">{errors.email.message}</p>}
              </div>
              <div className="col-12 mb-5">
                <label htmlFor="message" className="form-label fw-bold mb-lg-2 mb-1">內容</label>
                <textarea
                  {...register("message", { required: "請輸入您的問題或需求" })}
                  id="message"
                  className="form-control"
                  placeholder="請輸入您的問題或需求"
                  rows="4"
                ></textarea>
                {errors.message && <p className="text-danger my-2">{errors.message.message}</p>}
              </div>
              <div className="col-12 text-end">
              <button className="btn btn-orange-dark" type="submit" disabled={!isValid}>送出表單</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}