import { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = { email: "", password: "", confirmPassword: "" };

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

        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirm password is required";
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (newErrors.email || newErrors.password || newErrors.confirmPassword) {
            setErrors(newErrors);
            return;
        }

        console.log("Register attempt:", { email, password });
        alert(`Account created for ${email}! This is a frontend demo.`);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    };

    const handleGoogleLogin = () => {
        console.log("Google login clicked");
        alert("Google authentication is a frontend demo");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#D9DADB] to-[#FFFFFF] flex items-center justify-center p-4">
            <div className="w-full bg-[#F8F9FA] rounded-3xl border border-[#E7E8E9] shadow-[0_20px_40px_rgba(15,82,56,0.1)] overflow-hidden flex flex-col">
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

                    {/* Register Form */}
                    <form
                        className="w-full flex flex-col gap-6 mb-4"
                        onSubmit={handleRegister}
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
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) {
                                            setErrors({
                                                ...errors,
                                                email: "",
                                            });
                                        }
                                    }}
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
                            <label className="font-['Inter'] font-semibold text-[12px] leading-[16px] tracking-[5%] text-[#191C1D] mb-2 uppercase">
                                Password
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
                                        <path d="M3 10C3 10 7 4 10 4C13 4 17 10 17 10C17 10 13 16 10 16C7 16 3 10 3 10Z" />
                                        <circle cx="10" cy="10" r="3" />
                                    </svg>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password) {
                                            setErrors({
                                                ...errors,
                                                password: "",
                                            });
                                        }
                                    }}
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

                        {/* Confirm Password Field */}
                        <div className="flex flex-col">
                            <label className="font-['Inter'] font-semibold text-[12px] leading-[16px] tracking-[5%] text-[#191C1D] mb-2 uppercase">
                                Confirm Password
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
                                        <path d="M3 10C3 10 7 4 10 4C13 4 17 10 17 10C17 10 13 16 10 16C7 16 3 10 3 10Z" />
                                        <circle cx="10" cy="10" r="3" />
                                    </svg>
                                </div>
                                <input
                                    type={
                                        showConfirmPassword ? "text" : "password"
                                    }
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (errors.confirmPassword) {
                                            setErrors({
                                                ...errors,
                                                confirmPassword: "",
                                            });
                                        }
                                    }}
                                    className={`w-full pl-10 pr-12 py-3.5 bg-[#F8F9FA] border rounded-lg text-[#191C1D] font-['Inter'] text-[14px] outline-none transition-all placeholder:text-[#707973] ${
                                        errors.confirmPassword
                                            ? "border-red-500 focus:ring-2 focus:ring-red-300"
                                            : "border-[#BFC9C1] focus:border-[#0F5238] focus:ring-2 focus:ring-[#0F5238] focus:ring-opacity-20"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#707973] hover:text-[#0F5238] transition-colors"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? (
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
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1.5">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full flex justify-center items-center gap-2 bg-[#0F5238] hover:bg-[#0d4630] active:bg-[#08341f] text-white py-3.5 px-4 rounded-lg font-['Montserrat'] font-semibold text-[20px] leading-[28px] shadow-md transition-all duration-200 active:scale-95"
                        >
                            Register
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

                    {/* Divider */}
                    <div className="w-full flex items-center gap-4 py-6">
                        <div className="flex-1 h-px bg-[rgba(191,201,193,0.5)]"></div>
                        <span className="font-['Inter'] font-semibold text-[12px] text-[#707973] tracking-[5%]">
                            OR
                        </span>
                        <div className="flex-1 h-px bg-[rgba(191,201,193,0.5)]"></div>
                    </div>

                    {/* Google Login Button */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex justify-center items-center gap-2 bg-white border border-[#BFC9C1] py-3.5 px-4 rounded-lg font-['Inter'] text-[14px] leading-[20px] text-[#191C1D] hover:bg-[#F3F4F5] transition-all duration-200 active:scale-95"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 48 48"
                            fill="none"
                        >
                            <path
                                d="M44.5 20H24v8.5h11.8C34.7 33 30 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6.2 1.1 8.6 3.1l6.4-6.4C34.6 5.1 29.6 2 24 2 11.3 2 2 11.3 2 24s9.3 22 22 22c13 0 22-9 22-22 0-1.3-.2-2.7-.5-4z"
                                fill="#EA4335"
                            />
                            <path
                                d="M6.3 14.7c-1.6 2.4-2.5 5.2-2.5 8.3s.9 5.9 2.5 8.3l7.1-5.5c-.4-1.3-.6-2.8-.6-4.3s.2-3 .6-4.3l-7.1-5.5z"
                                fill="#FBBC04"
                            />
                            <path
                                d="M24 44c6.1 0 11.3-2.3 15.1-6l-7.1-5.5c-2.1 1.4-4.7 2.2-7.6 2.2-5.9 0-11-3.6-13.3-8.8l-7.2 5.5C10.9 39.9 16.8 44 24 44z"
                                fill="#34A853"
                            />
                            <path
                                d="M43.8 20.2l.8-5.2H24v8.5h11.8c-.6 1.5-1.5 2.9-2.6 4l7.1 5.5c4.3-3.9 6.9-9.7 6.9-16.8z"
                                fill="#4285F4"
                            />
                        </svg>
                        Continue with Google
                    </button>

                    {/* Login Link */}
                    <div className="pt-6 text-center">
                        <p className="font-['Inter'] text-[14px] leading-[20px] text-[#404943]">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-[#0F5238] hover:underline transition-all"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}
