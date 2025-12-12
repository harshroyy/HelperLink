import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, MessageCircle, Heart, CheckCircle2 } from "lucide-react";
import heroImg from '../assets/hero.png';
import logo2 from '../assets/logo2.png';
import helpImg from '../assets/help.png';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal'; // <--- RE-ADDED

const Home = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false); // <--- RE-ADDED

  // Toggle functions
  const switchToRegister = () => {
    setIsLoginOpen(false);
    setTimeout(() => setIsRegisterOpen(true), 200);
  };

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setTimeout(() => setIsLoginOpen(true), 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white font-sans text-gray-900">

      {/* --- MOUNT MODALS --- */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={switchToRegister}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={switchToLogin}
      />



      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">

            {/* Text Left */}
            <div className="space-y-8 relative z-10">
              <h1
                className="text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] font-bold text-[#181E4B] leading-[1.1] tracking-tight"
                style={{ fontFamily: "'Vollkorn', 'Volkhov', serif" }}
              >
                Where <span className="text-[#F4616D]">Kindness</span><br />
                Finds a <br />
                <span className="text-[#747def]">Destination</span>
              </h1>

              <p className="text-lg text-[#5E6282] leading-relaxed italic max-w-lg" style={{ fontFamily: "Poppins, sans-serif" }}>
                We bridge the gap between giving and need. Skip the uncertainty and connect directly with verified people seeking genuine support.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => setIsRegisterOpen(true)} // <--- FIXED
                  className="px-8 py-4 rounded-2xl border-2 border-[#747def] text-[#747def] hover:bg-[#747def]/5 transition-all duration-200 font-bold text-lg"
                  style={{ fontFamily: "'Vollkorn', 'Volkhov', serif" }}
                >
                  Get Help
                </button>

                <button
                  onClick={() => setIsRegisterOpen(true)} // <--- FIXED
                  className="px-8 py-4 rounded-2xl bg-[#747def] text-white hover:bg-[#5e63c2] transition-all duration-200 shadow-xl shadow-[#F4616D]/25 font-bold text-lg"
                  style={{ fontFamily: "'Vollkorn', 'Volkhov', serif" }}
                >
                  I Want to Help
                </button>
              </div>
            </div>

            {/* Image Right */}
            <div className="relative w-full h-full flex justify-end">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl transform scale-90 translate-y-4"></div>
              <img
                src={heroImg}
                alt="Diverse people connecting"
                className="relative rounded-[2.5rem] object-cover w-full h-[500px] lg:h-[600px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES (BENTO GRID) --- */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid md:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="backdrop-blur-xl bg-white/90 rounded-3xl p-8 border border-white/60 shadow-xl shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Connect with Confidence</h3>
              <p className="text-gray-600 leading-relaxed">
                We verify every helper before they join, ensuring a safe and transparent environment for meaningful support.
              </p>
            </div>

            {/* Card 2 */}
            <div className="backdrop-blur-xl bg-white/90 rounded-3xl p-8 border border-white/60 shadow-xl shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 md:col-span-1 relative overflow-hidden group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Instant Chat</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Connect instantly with helpers in your area through our real-time messaging system.
              </p>

              {/* Mock Chat UI */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 space-y-3 border border-gray-100 shadow-sm">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">A</div>
                  <div className="flex-1 bg-white rounded-xl px-4 py-2 border border-gray-100 text-sm text-gray-700">
                    Hey! I can help with that
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <div className="bg-blue-600 rounded-xl px-4 py-2 text-sm text-white">
                    That would be great!
                  </div>
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">Me</div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="backdrop-blur-xl bg-white/90 rounded-3xl p-8 border border-white/60 shadow-xl shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center mb-6 shadow-lg shadow-pink-500/20">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">Safe & Transparent</h3>
              <p className="text-gray-600 leading-relaxed">
                We prioritize your well-being with strict guidelines and easy reporting, keeping the platform secure for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT/MISSION SECTION --- */}
      <section className="py-20 px-6 md:px-12 relative">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Image (Left) */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#747def]/20 to-purple-500/20 rounded-3xl blur-3xl transform -rotate-3"></div>
              <img
                src={helpImg}
                alt="Community Support"
                className="relative rounded-[2.5rem] shadow-2xl object-cover w-full h-[600px]"
              />
            </div>

            {/* Text (Right) */}
            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-4">
                <h2
                  className="text-4xl md:text-5xl font-bold text-[#181E4B] leading-tight"
                  style={{ fontFamily: "'Vollkorn', 'Volkhov', serif" }}
                >
                  More Than Just a <br />
                  <span className="text-[#747def]">Platform</span>
                </h2>
                <p className="text-lg text-[#5E6282] leading-relaxed" style={{ fontFamily: "Poppins, sans-serif" }}>
                  In a world that often feels disconnected, Reach brings us back to our roots: people helping people. We believe that asking for help isn't a sign of weakness—it's the first step toward connection.
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-4">
                {[
                  "Strengthens community bonds and trust",
                  "Reduces stress for those in need",
                  "Creates a positive cycle of kindness",
                  "Verified and safe interactions"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 border border-white/60 shadow-sm hover:bg-white hover:shadow-md transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-[#747def]/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-[#747def]" />
                    </div>
                    <span className="text-[#181E4B] font-medium text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 px-6 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-auto">
                <img src={logo2} alt="Logo" className="h-full w-auto" />
              </div>
            </div>

            <div className="flex gap-8">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Support</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Safety</a>
            </div>

            <p className="text-gray-500 text-sm">
              © 2025 Reach. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;