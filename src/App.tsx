import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import HomePage from "./components/HomePage";
import BookPickupPage from "./components/BookPickupPage";
import CheckoutPage from "./components/CheckoutPage";
import DetailWasteCategoryPage from "./components/DetailWasteCategoryPage";
import ProfilePage from "./components/ProfilePage";
import EditProfilePage from "./components/EditProfilePage";
import ManageAddressPage from "./components/ManageAddressPage";
import ManageAddressAddFormPage from "./components/ManageAddressAddFormPage";

function App() {
    return (
        <div className="min-h-screen w-full lg:w-1/4 lg:mx-auto">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/book-pickup" element={<BookPickupPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route
                    path="/waste-categories"
                    element={<DetailWasteCategoryPage />}
                />
                <Route path="/profile" element={<ProfilePage />} />
                <Route
                    path="/manage-addresses"
                    element={<ManageAddressPage />}
                />
                <Route
                    path="/manage-addresses/new"
                    element={<ManageAddressAddFormPage />}
                />
                <Route
                    path="/manage-addresses/:addressId/edit"
                    element={<ManageAddressAddFormPage />}
                />
                <Route path="/edit-profile" element={<EditProfilePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

export default App;
