import { Route, Routes } from "react-router-dom";
import { Footer, Header, MobileMenu, ProductModal } from "./components";
import { AboutUs, CheckOut, Contacts, NotFound404, Order, Products, ShippingAndPayment } from "./screens";
import "./App.scss";

export const App = () => {

    return (
        <>
            <Header />
            <main className="main">
                <Routes>
                    <Route path="/:lang?" element={<Products />} />
                    <Route path="/:lang?/catalog/:category" element={<Products />} />
                    <Route path="/:lang?/about" element={<AboutUs />} />
                    <Route path="/:lang?/shipping-info" element={<ShippingAndPayment />} />
                    <Route path="/:lang?/contacts" element={<Contacts />} />
                    <Route path="/:lang?/checkout" element={<CheckOut />} />
                    <Route path="/:lang?/order/:number" element={<Order />} />
                    <Route path="/*" element={<NotFound404 />} />
                </Routes>
            </main>
            <Footer />
            <ProductModal />
            <MobileMenu />
        </>
    );
}