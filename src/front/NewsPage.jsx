import { Link } from "react-router";

export default function NewsPage(){
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
            最新消息
          </li>
        </ol>
      </nav>

      <section className="section-news">
        <div className="bg-secondary-500 mb-4 d-flex flex-lg-row-reverse justify-content-between align-items-center py-lg-5 p-4 gap-4 shadow">
          <div className="d-flex flex-column align-items-center text-orange-dark fw-bold">
            <p>2025/2</p>
            <p className="fs-2">18</p>
          </div>
          <div>
            <h5 className="mb-2">和平紀念日休息公告</h5>
            <p>我們將於 2 月 28 日 (五) 暫停客服與出貨，3 月 1 日 (六) 起恢復正常服務，感謝您的耐心等候！</p>
          </div>
        </div>
        <div className="bg-secondary-500 mb-4 d-flex flex-lg-row-reverse justify-content-between align-items-center py-lg-5 p-4 gap-4 shadow">
          <div className="d-flex flex-column align-items-center text-orange-dark fw-bold">
            <p>2025/2</p>
            <p className="fs-2">1</p>
          </div>
          <div>
            <h5 className="mb-2">情人節特別活動</h5>
            <p>2/10 - 2/14 限時優惠：購買指定書籍 滿 1000 元免運費，讓愛與知識一起分享！</p>
          </div>
        </div>
        <div className="bg-secondary-500 mb-4 d-flex flex-lg-row-reverse justify-content-between align-items-center py-lg-5 p-4 gap-4 shadow">
          <div className="d-flex flex-column align-items-center text-orange-dark fw-bold">
            <p>2025/1</p>
            <p className="fs-2">17</p>
          </div>
          <div>
            <h5 className="mb-2">春節休息公告</h5>
            <p>我們將於 1 月 27 日至 1 月 31 日 暫停客服與出貨，2 月 1 日 (六) 起恢復正常服務，祝大家新春愉快，萬事如意！</p>
          </div>
        </div>
        <div className="bg-secondary-500 mb-4 d-flex flex-lg-row-reverse justify-content-between align-items-center py-lg-5 p-4 gap-4 shadow">
          <div className="d-flex flex-column align-items-center text-orange-dark fw-bold">
            <p>2024/12</p>
            <p className="fs-2">20</p>
          </div>
          <div>
            <h5 className="mb-2">2025年 元旦休息公告</h5>
            <p>Happy New Year 2025 ！我們將於 1 月 1 日 (三) 暫停客服與出貨，1 月 2 日 (四) 起恢復正常服務，感謝您的支持！</p>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}