import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { setCookie } from "../lib/cookies";

interface LoginResponse {
    user: { id: number; name: string; email: string };
    token: string;
}

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (errors.email) setErrors({ ...errors, email: "" });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (errors.password) setErrors({ ...errors, password: "" });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = { email: "", password: "" };

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (newErrors.email || newErrors.password) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            const data = await api<LoginResponse>("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });
            setCookie("token", data.token);
            navigate("/");
        } catch (err: unknown) {
            const apiErr = err as { status?: number; message?: string };
            if (apiErr.status === 401) {
                setErrors({
                    email: "Invalid credentials",
                    password: "Invalid credentials",
                });
            } else {
                setErrors({
                    email: apiErr.message ?? "Login failed",
                    password: "",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#D9DADB] to-[#E8E9EA] flex items-center justify-center p-4">
            {/* Mobile Container */}
            <div className="w-full bg-[#F8F9FA] rounded-3xl border border-[#E7E8E9] shadow-lg overflow-hidden flex flex-col">
                {/* Header */}
                <header className="px-4 py-4 border-b border-[#BFC9C1] bg-[#F8F9FA] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0F5238] flex items-center justify-center flex-shrink-0">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="2.5"
                        >
                            <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11h4M10 16h4" />
                        </svg>
                    </div>
                    <h1 className="font-['Montserrat'] font-bold text-[22px] leading-[30px] tracking-[-2.5%] text-[#0F5238]">
                        Trash.I
                    </h1>
                </header>

                {/* Main Content */}
                <main className="px-6 pt-8 pb-32 flex flex-col items-center flex-1 overflow-y-auto">
                    {/* Hero Illustration */}
                    <div className="w-full h-[192px] mb-8 flex justify-center items-center rounded-xl bg-white border border-[rgba(191,201,193,0.3)] shadow-sm overflow-hidden">
                        <img
                            src="/src/assets/hero_illustration.png"
                            alt="Eco friendly illustration"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                    "none";
                            }}
                        />
                    </div>

                    {/* Welcome Text */}
                    <div className="w-full flex flex-col gap-2 mb-8 text-center">
                        <h2 className="font-['Montserrat'] font-bold text-[32px] leading-[40px] tracking-[-2%] text-[#0F5238]">
                            Welcome Back
                        </h2>
                        <p className="font-['Inter'] text-[16px] leading-[24px] text-[#404943]">
                            Sign in to continue managing your
                            <br />
                            environmental impact.
                        </p>
                    </div>

                    {/* Login Form */}
                    <form
                        className="w-full flex flex-col gap-5 mb-6"
                        onSubmit={handleLogin}
                    >
                        {/* Email Field */}
                        <div className="flex flex-col">
                            <label className="font-['Inter'] font-semibold text-[12px] leading-[16px] tracking-[5%] text-[#191C1D] mb-2 uppercase">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707973]">
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    >
                                        <path d="M2 5L10 10.5L18 5M2 5V15C2 15.5 2.5 16 3 16H17C17.5 16 18 15.5 18 15V5" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className={`w-full pl-10 pr-4 py-3.5 bg-[#F8F9FA] border rounded-lg text-[#191C1D] font-['Inter'] text-[14px] outline-none transition-all placeholder:text-[#707973] ${
                                        errors.email
                                            ? "border-red-500 focus:ring-2 focus:ring-red-300"
                                            : "border-[#BFC9C1] focus:border-[#0F5238] focus:ring-2 focus:ring-[#0F5238] focus:ring-opacity-20"
                                    }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1.5">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                                <label className="font-['Inter'] font-semibold text-[12px] leading-[16px] tracking-[5%] text-[#191C1D] uppercase">
                                    Password
                                </label>
                                <a
                                    href="#"
                                    className="font-['Inter'] font-semibold text-[12px] text-[#0F5238] hover:underline transition-all"
                                >
                                    Forgot Password?
                                </a>
                            </div>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707973]">
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    >
                                        <path d="M3 10C3 10 7 4 10 4C13 4 17 10 17 10C17 10 13 16 10 16C7 16 3 10 3 10Z" />
                                        <circle cx="10" cy="10" r="3" />
                                    </svg>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className={`w-full pl-10 pr-12 py-3.5 bg-[#F8F9FA] border rounded-lg text-[#191C1D] font-['Inter'] text-[14px] outline-none transition-all placeholder:text-[#707973] ${
                                        errors.password
                                            ? "border-red-500 focus:ring-2 focus:ring-red-300"
                                            : "border-[#BFC9C1] focus:border-[#0F5238] focus:ring-2 focus:ring-[#0F5238] focus:ring-opacity-20"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#707973] hover:text-[#0F5238] transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        >
                                            <path d="M3 10C3 10 7 4 10 4C13 4 17 10 17 10C17 10 13 16 10 16C7 16 3 10 3 10Z" />
                                            <circle cx="10" cy="10" r="3" />
                                            <line
                                                x1="3"
                                                y1="17"
                                                x2="17"
                                                y2="3"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        >
                                            <path d="M3 10C3 10 7 4 10 4C13 4 17 10 17 10C17 10 13 16 10 16C7 16 3 10 3 10Z" />
                                            <circle cx="10" cy="10" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1.5">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 bg-[#0F5238] hover:bg-[#0d4630] active:bg-[#08341f] text-white py-3.5 px-4 rounded-lg font-['Montserrat'] font-semibold text-[20px] leading-[28px] shadow-md transition-all duration-200 active:scale-95 mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing in..." : "Login"}
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 20 20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <path d="M4 10H16M11 5L16 10L11 15" />
                            </svg>
                        </button>
                    </form>


                    {/* Sign Up Section */}
                    <div className="pt-6 text-center">
                        <p className="font-['Inter'] text-[14px] leading-[20px] text-[#404943]">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="font-semibold text-[#0F5238] hover:underline transition-all"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}
