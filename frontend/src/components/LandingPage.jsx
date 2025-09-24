import React, { useState, useEffect, useRef } from 'react';
import { Flex, Layout } from "antd";
import { Content, Footer } from "antd/es/layout/layout";

// Placeholder components - replace with your actual components
const CustomHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${
      isScrolled 
        ? 'py-4 px-6 md:px-12 bg-gray-900 bg-opacity-90 backdrop-blur-xl border-b border-white border-opacity-10' 
        : 'py-6 px-6 md:px-12 bg-white bg-opacity-5 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-3xl md:text-4xl font-black gradient-primary animate-logo-glow">
          FitHub
        </div>
        <ul className="hidden md:flex space-x-10">
          {['Home', 'Features', 'Programs', 'Contact'].map((item) => (
            <li key={item}>
              <a 
                href={`#${item.toLowerCase()}`}
                className="text-white font-medium hover:text-transparent hover:bg-gradient-to-r hover:from-orange-400 hover:to-red-500 hover:bg-clip-text transition-all duration-300 relative group"
              >
                {item}
                                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

const CustomFooter = () => {
  return (
    <footer className="bg-gray-900 bg-opacity-90 backdrop-blur-xl border-t border-white border-opacity-10 py-8 px-6 text-center text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-2xl font-black gradient-primary mb-4">FitHub</div>
        <p className="text-gray-300">© 2024 FitHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

const contentStyle = {
  textAlign: "center",
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  color: "#fff",
  backgroundColor: "transparent",
  padding: 0,
  minHeight: "100vh",
};

const layoutStyle = {
  overflow: "hidden",
  width: "100%",
  minHeight: "100vh",
  backgroundColor: "transparent",
};

const boxStyle = {
  width: "100%",
  height: "100%",
  minHeight: "100vh",
};

function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visibleElements, setVisibleElements] = useState(new Set());
  const particlesRef = useRef(null);
  const observerRef = useRef(null);

  // Handle mouse movement for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 100,
        y: (e.clientY / window.innerHeight - 0.5) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Create particles
  useEffect(() => {
    if (particlesRef.current) {
      const particleCount = 50;
      particlesRef.current.innerHTML = '';
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesRef.current.appendChild(particle);
      }
    }
  }, []);

  const features = [
    {
      icon: '💪',
      title: 'Personal Training',
      description: 'Get customized workout plans designed by certified trainers based on your goals, fitness level, and preferences.'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Monitor your fitness journey with advanced analytics, body composition tracking, and performance metrics.'
    },
    {
      icon: '🏃',
      title: 'Group Classes',
      description: 'Join energizing group fitness classes including HIIT, yoga, pilates, and strength training sessions.'
    },
    {
      icon: '🥗',
      title: 'Nutrition Guidance',
      description: 'Receive personalized meal plans and nutrition coaching to fuel your workouts and optimize results.'
    },
    {
      icon: '🌟',
      title: '24/7 Access',
      description: 'Train on your schedule with round-the-clock gym access and online workout streaming.'
    },
    {
      icon: '🤝',
      title: 'Community Support',
      description: 'Connect with like-minded individuals, share your progress, and stay motivated together.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Members' },
    { number: '500+', label: 'Expert Trainers' },
    { number: '95%', label: 'Success Rate' },
    { number: '24/7', label: 'Gym Access' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden relative">
      <style jsx>{`
        /* Animated gradient background */
        .bg-gradient {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(-45deg, #ff6347, #ff4500, #ff8c00, #ffa500, #ff7f50);
          background-size: 400% 400%;
          animation: gradientShift 20s ease infinite;
          z-index: -2;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
          100% { background-position: 0% 50%; }
        }

        /* Floating particles */
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: float 25s infinite linear;
        }

        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }

        /* Text animations */
        @keyframes textReveal {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Logo glow animation */
        @keyframes logoGlow {
          0% { 
            filter: drop-shadow(0 0 5px rgba(255, 99, 71, 0.3));
            transform: scale(1);
          }
          50% { 
            filter: drop-shadow(0 0 25px rgba(255, 140, 0, 0.6));
            transform: scale(1.02);
          }
          100% { 
            filter: drop-shadow(0 0 5px rgba(255, 99, 71, 0.3));
            transform: scale(1);
          }
        }

        /* Floating elements */
        @keyframes floating {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          25% { 
            transform: translateY(-25px) rotate(8deg) scale(1.05);
          }
          50% { 
            transform: translateY(-10px) rotate(-5deg) scale(0.95);
          }
          75% { 
            transform: translateY(15px) rotate(3deg) scale(1.02);
          }
        }

        /* Card hover effects */
        .feature-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.8s ease;
        }

        .feature-card:hover::before {
          left: 100%;
        }

        /* Button animations */
        .btn-primary {
          background: linear-gradient(135deg, #ff6347, #ff4500);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-primary:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px rgba(255, 99, 71, 0.4);
        }

        .btn-secondary {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(255, 255, 255, 0.1);
        }

        /* Animation classes */
        .animate-text-reveal {
          animation: textReveal 1.2s cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        .animate-scale-in {
          animation: scaleIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        .animate-logo-glow {
          animation: logoGlow 4s ease-in-out infinite;
        }

        .animate-floating {
          animation: floating 8s ease-in-out infinite;
        }

        /* Gradient text */
        .gradient-text {
          background: linear-gradient(135deg, #fff, #ff6347, #ff4500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .gradient-text-hero {
          background: linear-gradient(135deg, #fff 20%, #ff6347 40%, #ff4500 60%, #fff 80%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 8s ease infinite;
        }

        .gradient-primary {
          background: linear-gradient(135deg, #ff6347, #ff4500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Override Ant Design styles */
        .ant-layout {
          background: transparent !important;
        }

        .ant-layout-content {
          background: transparent !important;
        }
      `}</style>

      {/* Background */}
      <div className="bg-gradient"></div>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-85 backdrop-blur-3xl z-[-1]"></div>
      
      {/* Particles */}
      <div ref={particlesRef} className="fixed inset-0 pointer-events-none z-[-1]"></div>

      <Flex style={boxStyle} gap="middle" wrap>
        <Layout style={layoutStyle}>
          <CustomHeader />
          <Content style={contentStyle}>
            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center relative px-6 pt-20">
              {/* Floating Elements */}
              <div 
                className="absolute top-1/4 left-1/12 w-20 h-20 bg-white bg-opacity-5 backdrop-blur-md rounded-3xl border border-white border-opacity-10 animate-floating"
                style={{
                  transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
                  animationDelay: '0s'
                }}
              ></div>
              <div 
                className="absolute top-3/5 right-1/6 w-28 h-16 bg-white bg-opacity-5 backdrop-blur-md rounded-2xl border border-white border-opacity-10 animate-floating"
                style={{
                  transform: `translate(${mousePosition.x * 0.03}px, ${mousePosition.y * 0.03}px)`,
                  animationDelay: '2s'
                }}
              ></div>
              <div 
                className="absolute bottom-1/3 left-1/6 w-24 h-24 bg-white bg-opacity-5 backdrop-blur-md rounded-3xl border border-white border-opacity-10 animate-floating"
                style={{
                  transform: `translate(${mousePosition.x * 0.025}px, ${mousePosition.y * 0.025}px)`,
                  animationDelay: '4s'
                }}
              ></div>

              <div className="text-center max-w-5xl mx-auto z-10">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 gradient-text-hero animate-text-reveal">
                  Transform Your Body, Elevate Your Life
                </h1>
                <p className="text-xl md:text-2xl mb-12 text-gray-300 leading-relaxed animate-text-reveal" style={{animationDelay: '0.3s'}}>
                  Join thousands of fitness enthusiasts in their journey to peak performance with FitHub's revolutionary training programs and community support.
                </p>
                <div className="flex flex-col sm:flex-row gap-8 justify-center items-center animate-text-reveal" style={{animationDelay: '0.6s'}}>
                  <button onClick={() => navigate('/login')} className="btn-primary px-10 py-5 rounded-full text-lg font-semibold text-white shadow-2xl">
                    Start Your Journey
                  </button>
                  <button className="btn-secondary px-10 py-5 rounded-full text-lg font-semibold text-white border-2 border-white border-opacity-30 backdrop-blur-md">
                    Watch Demo
                  </button>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section 
              id="features" 
              data-animate 
              className={`py-32 px-6 max-w-7xl mx-auto transition-all duration-1000 ${
                visibleElements.has('features') ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'
              }`}
            >
              <h2 className="text-5xl md:text-6xl font-black text-center mb-20 gradient-text">
                Why Choose FitHub?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`feature-card relative bg-white bg-opacity-5 backdrop-blur-xl border border-white border-opacity-10 rounded-3xl p-8 lg:p-10 text-center hover:border-orange-400 hover:border-opacity-30 hover:shadow-2xl hover:-translate-y-3 overflow-hidden transition-all duration-500 ${
                      visibleElements.has('features') ? 'animate-scale-in' : 'opacity-0 scale-90'
                    }`}
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-3xl transform hover:rotate-12 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed text-lg">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Stats Section */}
            <section 
              id="stats" 
              data-animate 
              className={`py-24 px-6 bg-white bg-opacity-2 backdrop-blur-xl transition-all duration-1000 ${
                visibleElements.has('stats') ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                  {stats.map((stat, index) => (
                    <div 
                      key={index} 
                      className={`animate-scale-in ${
                        visibleElements.has('stats') ? '' : 'opacity-0 scale-90'
                      }`}
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className="text-5xl md:text-6xl font-black gradient-primary mb-3">
                        {stat.number}
                      </div>
                      <div className="text-lg text-gray-300 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </Content>
          <CustomFooter />
        </Layout>
      </Flex>
    </div>
  );
}

export default LandingPage;