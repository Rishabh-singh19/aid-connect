import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { 
  Shield, 
  CheckCircle, 
  Upload, 
  Search, 
  FileText, 
  Clock, 
  Users, 
  MapPin,
  Award,
  Phone,
  Mail,
  FileCheck,
  UserCheck,
  BadgeCheck
} from 'lucide-react';

const GovernmentPortal = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState({});

  const handleApplyClick = () => {
    navigate('/login');
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-x-hidden">
      {/* Sticky Apply Button */}
      <div className="sticky top-0 z-50 bg-blue-700 text-white py-3 px-4 shadow-lg animate-slideDown">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span className="font-semibold text-lg">Government Portal</span>
          </div>
          <button onClick={handleApplyClick} className="bg-white text-blue-700 px-6 py-2 rounded-md font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-md transform">
            Apply Now
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-white py-12 px-4" id="hero" data-animate>
        <div className={`container mx-auto grid md:grid-cols-2 gap-8 items-center transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fadeInUp">
            AidConnect – Grant-in-aid application portal
            </h1>
            <p className="text-xl text-gray-600 mb-8 animate-fadeInUp animation-delay-200">
              Empowering citizens with transparent and efficient beneficiary identification.
            </p>
            <button onClick={handleApplyClick} className="bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-lg mb-8 transform animate-fadeInUp animation-delay-400">
              Apply Now
            </button>
            
            <div className="grid grid-cols-3 gap-4 mt-8 animate-fadeInUp animation-delay-600">
              <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 transform">
                <div className="text-2xl font-bold text-blue-700">100K+</div>
                <div className="text-gray-600">Applications Submitted</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 transform">
                <div className="text-2xl font-bold text-blue-700">660K+</div>
                <div className="text-gray-600">Verified Beneficiaries</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 transform">
                <div className="text-2xl font-bold text-blue-700">120+</div>
                <div className="text-gray-600">Districts Covered</div>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block animate-fadeInRight animation-delay-800">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <Users className="h-12 w-12 text-blue-600" />
                <FileCheck className="h-12 w-12 text-green-600" />
                <Shield className="h-12 w-12 text-blue-700" />
              </div>
              <div className="text-center text-gray-700">
                <h3 className="text-xl font-semibold mb-4">Secure & Transparent Process</h3>
                <p className="text-gray-600">Government-authorized platform for beneficiary verification and identification</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white" id="features" data-animate>
        <div className={`container mx-auto transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FileText, title: "Easy Online Application", desc: "Simple step-by-step application process" },
              { icon: Search, title: "Fast Verification", desc: "Quick verification using government databases" },
              { icon: Shield, title: "Secure Document Upload", desc: "Encrypted document submission and storage" },
              { icon: Clock, title: "Real-time Tracking", desc: "Track application status 24/7" }
            ].map((feature, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 transform animate-fadeInUp" style={{animationDelay: `${idx * 200}ms`}}>
                <feature.icon className="h-12 w-12 text-blue-700 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-blue-50" id="whyChoose" data-animate>
        <div className={`container mx-auto transition-all duration-1000 ${isVisible.whyChoose ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Our Platform</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Government Verified", desc: "Official government-approved system" },
              { icon: CheckCircle, title: "100% Secure", desc: "End-to-end encrypted data protection" },
              { icon: Award, title: "Award Winning", desc: "National e-Governance award recipient" }
            ].map((item, idx) => (
              <div key={idx} className="text-center animate-fadeInUp" style={{animationDelay: `${idx * 300}ms`}}>
                <div className="bg-white p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-sm hover:shadow-lg hover:scale-110 transition-all duration-300 transform">
                  <item.icon className="h-10 w-10 text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white" id="howItWorks" data-animate>
        <div className={`container mx-auto transition-all duration-1000 ${isVisible.howItWorks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Register", desc: "Create your account with basic details" },
              { step: "02", title: "Upload Documents", desc: "Submit required documents securely" },
              { step: "03", title: "Get Verified", desc: "Receive verification status within days" }
            ].map((step, idx) => (
              <div key={idx} className="text-center relative animate-fadeInUp" style={{animationDelay: `${idx * 400}ms`}}>
                <div className="bg-blue-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 hover:scale-110 transition-all duration-300 transform pulse-animation">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-6 left-3/4 w-full h-0.5 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50" id="testimonials" data-animate>
        <div className={`container mx-auto transition-all duration-1000 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Citizen Impact Stories</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { name: "Rajesh Kumar", location: "Patna, Bihar", story: "Received agricultural grant within 15 days. Process was transparent and hassle-free." },
              { name: "Priya Sharma", location: "Jaipur, Rajasthan", story: "Scholarship for my daughter was processed quickly. Real-time tracking was very helpful." }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 transform animate-fadeInUp" style={{animationDelay: `${idx * 300}ms`}}>
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <UserCheck className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.story}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-8 w-8" />
                <span className="text-xl font-semibold">Government Portal</span>
              </div>
              <p className="text-blue-200">
                Official Grant-in-Aid Beneficiary Identification System
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact Support</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Helpline: 1800-XXX-XXXX</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>support@govgrant.gov.in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-blue-200 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-blue-200 hover:text-white">Download Forms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-800 mt-8 pt-6 text-center text-blue-300">
            <p>© 2024 Government Grant-in-Aid System. All rights reserved.</p>
            <p className="text-sm mt-2">An initiative of the Government</p>
          </div>
        </div>
      </footer>

      {/* Floating Mobile Apply Button */}
      <div className="md:hidden fixed bottom-6 right-6 animate-bounce">
        <button onClick={handleApplyClick} className="bg-blue-700 text-white p-4 rounded-full shadow-2xl hover:bg-blue-800 hover:scale-110 transition-all duration-300 transform pulse-animation">
          <span className="font-semibold">Apply Now</span>
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fadeInRight {
          animation: fadeInRight 0.8s ease-out forwards;
        }

        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-800 {
          animation-delay: 800ms;
        }

        .pulse-animation {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default GovernmentPortal;