import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import HomePage from "./components/HomePage";
import BookPickupPage from "./components/BookPickupPage";
import CheckoutPage from "./components/CheckoutPage";

function App() {
    return (
        <div className="min-h-screen w-full lg:w-1/4 lg:mx-auto">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/book-pickup" element={<BookPickupPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

export default App;
