import { Header } from "./Header";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <>
            <div className="flex flex-col min-h-screen overflow-x-hidden">
                <Header />

                <main className="grow">
                    <Outlet />
                </main>
            </div>
            <Footer />
        </>
    );
}

export { Layout };
