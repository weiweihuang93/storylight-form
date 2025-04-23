import ReactLoading from 'react-loading';

export default function LoadingComponent(){
  return(
    <>
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(255,255,255,0.3)",
        zIndex: 999,
      }}
    >
      <ReactLoading type="bubbles" color="orange" width="3rem" height="3rem" />
    </div>
    </>
  )
}