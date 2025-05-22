import { Header } from "./Header";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout() {
    return (
        <>
            <div className="flex flex-col min-h-screen overflow-x-hidden bg-[#E6E6EA]">
                <Header />
                <ToastContainer
                    position="top-right"
                    autoClose={2500}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                />

                <main className="grow max-w-[1600px] mx-auto w-full pt-[100px]">
                    <Outlet />
                </main>
            </div>
            <Footer />
        </>
    );
}

export { Layout };
