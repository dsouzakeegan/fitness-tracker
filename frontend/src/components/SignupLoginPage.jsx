import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../store/slices/authSlice";

const SignupLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error: authError, user } = useSelector((state) => state.auth);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
  });

  // Hardcoded default role ID
  const DEFAULT_ROLE_ID = "67f50f1107464552f498490e";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Use Redux for login
        dispatch(
          loginUser({
            email: formData.email,
            password: formData.password,
            navigate,
          })
        )
          .unwrap()
          .catch((error) => {
            console.error("Login error:", error);
            setError(error.message || "Login failed");
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        let requestData = {
          firstname: formData.firstName,
          lastname: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: DEFAULT_ROLE_ID,
          mobileNumber: formData.mobileNumber,
        };

        console.log("Signup request data:", requestData);

        dispatch(
          signupUser({
            userData: requestData,
            navigate,
          })
        )
          .unwrap()
          .catch((error) => {
            console.error("Signup error:", error);
            setError(error.message || "Signup failed");
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } catch (error) {
      console.error("Error details:", error);
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    let value = e.target.value;

    // For mobile number, only allow digits and limit to 10 characters
    if (e.target.name === "mobileNumber") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  // Gym equipment icons as SVG strings for animations
  const gymIcons = [
    // Dumbbell
    `<svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
      <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14 4.14 5.57 2 7.71 3.43 9.14 2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22 14.86 20.57 16.29 22 17.71 20.57 20.57 17.71 22 16.29 20.57 14.86Z"/>
    </svg>`,
    // Barbell
    `<svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
      <rect x="2" y="10" width="2" height="4"/>
      <rect x="6" y="8" width="2" height="8"/>
      <rect x="10" y="11" width="4" height="2"/>
      <rect x="16" y="8" width="2" height="8"/>
      <rect x="20" y="10" width="2" height="4"/>
    </svg>`,
    // Trophy
    `<svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
      <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20.38C20.8 4 21.11 4.42 20.96 4.82L20.76 5.26C20.68 5.46 20.5 5.61 20.29 5.68L18.5 6.18C18.24 6.26 18 6.5 18 6.78V11C18 14.31 15.31 17 12 17S6 14.31 6 11V6.78C6 6.5 5.76 6.26 5.5 6.18L3.71 5.68C3.5 5.61 3.32 5.46 3.24 5.26L3.04 4.82C2.89 4.42 3.2 4 3.62 4H7ZM9 11C9 12.66 10.34 14 12 14S15 12.66 15 11V6H9V11ZM12 18C12.55 18 13 18.45 13 19V20H16C16.55 20 17 20.45 17 21S16.55 22 16 22H8C7.45 22 7 21.55 7 21S7.45 20 8 20H11V19C11 18.45 11.45 18 12 18Z"/>
    </svg>`,
    // Target
    `<svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
      <circle cx="12" cy="12" r="2"/>
      <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
    </svg>`
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      
      {/* CSS Keyframes for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-180deg); }
        }
        
        @keyframes drift {
          0% { transform: translateX(-20px); }
          100% { transform: translateX(20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        
        .float-1 { animation: float 6s ease-in-out infinite; }
        .float-2 { animation: floatReverse 8s ease-in-out infinite; }
        .float-3 { animation: float 7s ease-in-out infinite; }
        .float-4 { animation: floatReverse 9s ease-in-out infinite; }
        .drift-1 { animation: drift 10s ease-in-out infinite alternate; }
        .drift-2 { animation: drift 12s ease-in-out infinite alternate-reverse; }
        .pulse-bg { animation: pulse 4s ease-in-out infinite; }
      `}</style>

      {/* Animated Gym Background Elements */}
      <div className="absolute inset-0">
        {/* Floating gym equipment icons */}
        <div className="absolute top-20 left-20 text-orange-500/20 float-1">
          <div dangerouslySetInnerHTML={{ __html: gymIcons[0] }} />
        </div>
        <div className="absolute top-32 right-32 text-red-500/20 float-2">
          <div dangerouslySetInnerHTML={{ __html: gymIcons[1] }} />
        </div>
        <div className="absolute bottom-40 left-16 text-yellow-500/20 float-3">
          <div dangerouslySetInnerHTML={{ __html: gymIcons[2] }} />
        </div>
        <div className="absolute bottom-20 right-20 text-green-500/20 float-4">
          <div dangerouslySetInnerHTML={{ __html: gymIcons[3] }} />
        </div>
        <div className="absolute top-1/3 left-1/4 text-purple-500/20 float-1 drift-1">
          <div dangerouslySetInnerHTML={{ __html: gymIcons[0] }} />
        </div>
        <div className="absolute top-2/3 right-1/4 text-blue-500/20 float-2 drift-2">
          <div dangerouslySetInnerHTML={{ __html: gymIcons[1] }} />
        </div>

        {/* Subtle geometric shapes */}
        <div className="absolute top-10 right-10 w-24 h-24 border border-orange-500/10 rotate-45 pulse-bg"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 border border-red-500/10 rounded-full pulse-bg"></div>
        <div className="absolute top-1/2 left-8 w-16 h-16 bg-gradient-to-r from-purple-500/10 to-transparent rotate-12 pulse-bg"></div>
        <div className="absolute top-1/4 right-8 w-20 h-20 bg-gradient-to-l from-blue-500/10 to-transparent -rotate-12 pulse-bg"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Gradient overlays for depth */}
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/10 blur-3xl pulse-bg"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-purple-500/20 to-blue-500/10 blur-3xl pulse-bg"></div>
      </div>

      <div className="relative max-w-md w-full z-10">
        {/* Glass morphism card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {isLogin ? "Welcome back" : "Get started"}
            </h2>
            <p className="text-gray-300 text-sm">
              {isLogin ? "Sign in to your account" : "Join the fitness revolution"}
            </p>
          </div>

          {/* Toggle buttons */}
          <div className="flex bg-white/5 backdrop-blur-sm rounded-2xl p-1 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError("");
                setFormData({
                  email: "",
                  password: "",
                  firstName: "",
                  lastName: "",
                  mobileNumber: "",
                });
              }}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                isLogin
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError("");
                setFormData({
                  email: "",
                  password: "",
                  firstName: "",
                  lastName: "",
                  mobileNumber: "",
                });
              }}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                !isLogin
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded-2xl text-sm backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 backdrop-blur-sm transition-all duration-300"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 backdrop-blur-sm transition-all duration-300"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-300">
                    Mobile Number
                  </label>
                  <input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="tel"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 backdrop-blur-sm transition-all duration-300"
                    placeholder="1234567890"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    maxLength={10}
                  />
                  <p className="text-xs text-gray-400">
                    Enter 10-digit mobile number
                  </p>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 backdrop-blur-sm transition-all duration-300"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 backdrop-blur-sm transition-all duration-300"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading" || isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg flex items-center justify-center space-x-2"
            >
              {status === "loading" || isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Please wait...</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? "Sign in" : "Start your journey"}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {isLogin && (
            <div className="text-center">
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors duration-300">
                Forgot your password?
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupLoginPage;