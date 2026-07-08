import { Routes, Route, Navigate, Outlet } from "react-router-dom";
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
import HistoryPage from "./components/HistoryPage";
import ReceiptPage from "./components/ReceiptPage";
import ArticlePage from "./components/ArticlePage";
import RequireAuth from "./components/RequireAuth";

function App() {
    return (
        <div className="min-h-screen max-h-screen w-full lg:w-1/4 lg:mx-auto">
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/articles" element={<ArticlePage />} />

                {/* Protected routes */}
                <Route
                    element={
                        <RequireAuth>
                            <Outlet />
                        </RequireAuth>
                    }
                >
                    <Route path="/" element={<HomePage />} />
                    <Route path="/book-pickup" element={<BookPickupPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route
                        path="/receipt/:historyId"
                        element={<ReceiptPage />}
                    />
                    <Route
                        path="/waste-categories"
                        element={<DetailWasteCategoryPage />}
                    />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/edit-profile" element={<EditProfilePage />} />
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
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

export default App;
