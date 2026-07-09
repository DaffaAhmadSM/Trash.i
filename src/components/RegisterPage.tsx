import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { setCookie } from "../lib/cookies";

interface RegisterResponse {
  user: { id: number; name: string; email: string };
  token: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { name: "", email: "", password: "", confirmPassword: "" };

    if (!name) {
      newErrors.name = "Name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (newErrors.name || newErrors.email || newErrors.password || newErrors.confirmPassword) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const data = await api<RegisterResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: confirmPassword,
        }),
      });
      setCookie("token", data.token);
      navigate("/");
    } catch (err: unknown) {
      const apiErr = err as { message?: string; errors?: Record<string, string[]> };
      if (apiErr.errors) {
        setErrors({
          name: apiErr.errors.name?.[0] ?? "",
          email: apiErr.errors.email?.[0] ?? "",
          password: apiErr.errors.password?.[0] ?? "",
          confirmPassword: "",
        });
      } else {
        setErrors({
          ...newErrors,
          email: apiErr.message ?? "Registration failed",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D9DADB] to-[#FFFFFF] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#F8F9FA] rounded-3xl border border-[#E7E8E9] shadow-[0_20px_40px_rgba(15,82,56,0.1)] overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <header className="px-4 py-4 border-b border-[#BFC9C1] bg-[#F8F9FA] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0F5238] flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11h4M10 16h4" />
            </svg>
          </div>
          <h1 className="font-['Montserrat'] font-bold text-[22px] leading-[30px] tracking-[-2.5%] text-[#0F5238]">Trash.I</h1>
        </header>

        <main className="px-6 pt-8 pb-32 flex flex-col items-center flex-1 overflow-y-auto">
          <div className="w-full flex flex-col gap-2 mb-8 text-center">
            <h2 className="font-['Montserrat'] font-bold text-[32px] leading-[40px] tracking-[-2%] text-[#0F5238]">
              Create Account
            </h2>
            <p className="font-['Inter'] text-[16px] leading-[24px] text-[#404943]">
              Create an account to start managing
              <br />your environmental impact.
            </p>
          </div>

          <form className="w-full flex flex-col gap-6 mb-4 animate-fade-in-up style-delay-200" onSubmit={handleRegister}>
            {/* Name Field */}
            <div className="flex flex-col group">
              <label className="font-['Inter'] font-semibold text-[12px] leading-[16px] tracking-[5%] text-[#191C1D] mb-2 uppercase group-focus-within:text-[#0F5238] transition-colors">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707973] group-focus-within:text-[#0F5238] transition-colors">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M10 10C12.5 10 14.5 8 14.5 5.5C14.5 3 12.5 1 10 1C7.5 1 5.5 3 5.5 5.5C5.5 8 7.5 10 10 10Z" />
                    <path d="M1 19C1 14 5 11 10 11C15 11 19 14 19 19" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  className={`w-full pl-10 pr-4 py-3.5 bg-[#F8F9FA] border rounded-lg text-[#191C1D] font-['Inter'] text-[14px] outline-none transition-all duration-300 placeholder:text-[#707973] ${
                    errors.name
                      ? "border-red-500 focus:ring-4 focus:ring-red-500/20"
                      : "border-[#E1E3E4] focus:border-[#0F5238] focus:ring-4 focus:ring-[#0F5238]/20"
                  }`}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1.5 animate-bounce-short">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div className="flex flex-col group">
              <label className="font-['Inter'] font-semibold text-[12px] leading-[16px] tracking-[5%] text-[#191C1D] mb-2 uppercase group-focus-within:text-[#0F5238] transition-colors">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707973] group-focus-within:text-[#0F5238] transition-colors">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 5L10 10.5L18 5M2 5V15C2 15.5 2.5 16 3 16H17C17.5 16 18 15.5 18 15V5" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  className={`w-full pl-10 pr-4 py-3.5 bg-[#F8F9FA] border rounded-lg text-[#191C1D] font-['Inter'] text-[14px] outline-none transition-all duration-300 placeholder:text-[#707973] ${
                    errors.email
                      ? "border-red-500 focus:ring-4 focus:ring-red-500/20"
                      : "border-[#E1E3E4] focus:border-[#0F5238] focus:ring-4 focus:ring-[#0F5238]/20"
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1.5 animate-bounce-short">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="flex flex-col group">
              <label className="font-['Inter'] font-semibold text-[12px] leading-[16px] tracking-[5%] text-[#191C1D] mb-2 uppercase group-focus-within:text-[#0F5238] transition-colors">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707973] group-focus-within:text-[#0F5238] transition-colors">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
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
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  className={`w-full pl-10 pr-12 py-3.5 bg-[#F8F9FA] border rounded-lg text-[#191C1D] font-['Inter'] text-[14px] outline-none transition-all duration-300 placeholder:text-[#707973] ${
                    errors.password
                      ? "border-red-500 focus:ring-4 focus:ring-red-500/20"
                      : "border-[#E1E3E4] focus:border-[#0F5238] focus:ring-4 focus:ring-[#0F5238]/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#707973] hover:text-[#0F5238] hover:scale-110 transition-all"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 10C3 10 7 4 10 4C13 4 17 10 17 10C17 10 13 16 10 16C7 16 3 10 3 10Z" />
                      <circle cx="10" cy="10" r="3" />
                      <line x1="3" y1="17" x2="17" y2="3" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 10C3 10 7 4 10 4C13 4 17 10 17 10C17 10 13 16 10 16C7 16 3 10 3 10Z" />
                      <circle cx="10" cy="10" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5 animate-bounce-short">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col group">
              <label className="font-['Inter'] font-semibold text-[12px] leading-[16px] tracking-[5%] text-[#191C1D] mb-2 uppercase group-focus-within:text-[#0F5238] transition-colors">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707973] group-focus-within:text-[#0F5238] transition-colors">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 10C3 10 7 4 10 4C13 4 17 10 17 10C17 10 13 16 10 16C7 16 3 10 3 10Z" />
                    <circle cx="10" cy="10" r="3" />
                  </svg>
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                  }}
                  className={`w-full pl-10 pr-12 py-3.5 bg-[#F8F9FA] border rounded-lg text-[#191C1D] font-['Inter'] text-[14px] outline-none transition-all duration-300 placeholder:text-[#707973] ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-4 focus:ring-red-500/20"
                      : "border-[#E1E3E4] focus:border-[#0F5238] focus:ring-4 focus:ring-[#0F5238]/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#707973] hover:text-[#0F5238] hover:scale-110 transition-all"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 10C3 10 7 4 10 4C13 4 17 10 17 10C17 10 13 16 10 16C7 16 3 10 3 10Z" />
                      <circle cx="10" cy="10" r="3" />
                      <line x1="3" y1="17" x2="17" y2="3" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 10C3 10 7 4 10 4C13 4 17 10 17 10C17 10 13 16 10 16C7 16 3 10 3 10Z" />
                      <circle cx="10" cy="10" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 animate-bounce-short">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-[#0F5238] hover:bg-[#0d4630] active:bg-[#08341f] text-white py-3.5 px-4 rounded-lg font-['Montserrat'] font-semibold text-[20px] leading-[28px] shadow-md transition-all duration-200 active:scale-95 mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Login Link */}
          <div className="pt-6 text-center animate-fade-in-up style-delay-500">
            <p className="font-['Inter'] text-[14px] leading-[20px] text-[#404943]">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[#0F5238] hover:text-[#2D6A4F] hover:underline transition-all">
                Login
              </Link>
            </p>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes scale-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-short {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animate-bounce-short {
          animation: bounce-short 0.3s ease-in-out;
        }
        .style-delay-100 { animation-delay: 100ms; }
        .style-delay-200 { animation-delay: 200ms; }
        .style-delay-300 { animation-delay: 300ms; }
        .style-delay-400 { animation-delay: 400ms; }
        .style-delay-500 { animation-delay: 500ms; }
      `}</style>
    </div>
  );
}
