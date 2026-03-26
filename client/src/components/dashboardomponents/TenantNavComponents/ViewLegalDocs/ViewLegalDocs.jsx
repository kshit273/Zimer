import React, { useState } from "react";
import { FileText, Shield, Scale, Cookie, Eye, ChevronDown, ChevronUp, Home } from "lucide-react";

const ViewLegalDocs = () => {
  const [activeDoc, setActiveDoc] = useState("terms");
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const legalDocs = {
    terms: {
      title: "Terms of Service",
      icon: FileText,
      lastUpdated: "January 1, 2026",
      sections: [
        {
          id: "acceptance",
          title: "1. Acceptance of Terms",
          content: "By accessing and using Zimer, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service."
        },
        {
          id: "services",
          title: "2. Description of Services",
          content: "Zimer provides an online platform connecting property owners with potential renters. We facilitate the listing, discovery, and booking of rental properties. Our service includes property listings, search functionality, messaging between parties, and payment processing."
        },
        {
          id: "user-accounts",
          title: "3. User Accounts",
          content: "You must create an account to use certain features of Zimer. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during registration."
        },
        {
          id: "listings",
          title: "4. Property Listings",
          content: "Property owners are responsible for the accuracy of their listings. All listings must comply with local laws and regulations. Zimer reserves the right to remove any listing that violates our policies or applicable laws."
        },
        {
          id: "payments",
          title: "5. Payments and Fees",
          content: "Zimer charges service fees for successful bookings. Payment terms are disclosed at the time of booking. All payments are processed securely through our third-party payment processors. Refunds are subject to our cancellation policy."
        },
        {
          id: "liability",
          title: "6. Limitation of Liability",
          content: "Zimer acts as a platform connecting renters and property owners. We are not responsible for the condition of properties, the conduct of users, or disputes between parties. Users engage with each other at their own risk."
        }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      icon: Shield,
      lastUpdated: "January 1, 2026",
      sections: [
        {
          id: "collection",
          title: "1. Information We Collect",
          content: "We collect information you provide directly (name, email, phone number, payment information), information about your use of our service (browsing data, search queries, booking history), and information from third parties (identity verification services, payment processors)."
        },
        {
          id: "usage",
          title: "2. How We Use Your Information",
          content: "We use your information to provide and improve our services, process transactions, communicate with you, ensure safety and security, comply with legal obligations, and personalize your experience on Zimer."
        },
        {
          id: "sharing",
          title: "3. Information Sharing",
          content: "We share your information with other users as necessary to facilitate bookings, with service providers who assist our operations, with law enforcement when required by law, and in connection with business transfers or mergers."
        },
        {
          id: "security",
          title: "4. Data Security",
          content: "We implement industry-standard security measures to protect your personal information. This includes encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure."
        },
        {
          id: "rights",
          title: "5. Your Rights",
          content: "You have the right to access, correct, or delete your personal information. You can opt-out of marketing communications and request a copy of your data. Contact our privacy team to exercise these rights."
        },
        {
          id: "cookies",
          title: "6. Cookies and Tracking",
          content: "We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver targeted advertising. You can control cookie settings through your browser preferences."
        }
      ]
    },
    cancellation: {
      title: "Cancellation Policy",
      icon: Scale,
      lastUpdated: "January 1, 2026",
      sections: [
        {
          id: "guest-cancellation",
          title: "1. Guest Cancellation",
          content: "Flexible: Full refund if cancelled 24 hours before check-in. Moderate: Full refund if cancelled 5 days before check-in; 50% refund if cancelled within 5 days. Strict: 50% refund if cancelled 7 days before check-in; no refund within 7 days of check-in."
        },
        {
          id: "host-cancellation",
          title: "2. Host Cancellation",
          content: "Hosts who cancel confirmed bookings may face penalties including fees, calendar blocking, and account suspension. Exceptions may be made for extenuating circumstances such as emergencies or property damage."
        },
        {
          id: "refunds",
          title: "3. Refund Processing",
          content: "Approved refunds are processed within 5-10 business days to the original payment method. Service fees may be refundable depending on the cancellation timing and policy type."
        },
        {
          id: "disputes",
          title: "4. Cancellation Disputes",
          content: "If there is a dispute regarding a cancellation, users can contact Zimer support within 24 hours. We will review the circumstances and make a determination based on our policies and the evidence provided."
        }
      ]
    },
    cookies: {
      title: "Cookie Policy",
      icon: Cookie,
      lastUpdated: "January 1, 2026",
      sections: [
        {
          id: "what-are-cookies",
          title: "1. What Are Cookies",
          content: "Cookies are small text files stored on your device when you visit our website. They help us remember your preferences, understand how you use our site, and improve your experience."
        },
        {
          id: "types",
          title: "2. Types of Cookies We Use",
          content: "Essential cookies: Required for basic site functionality. Performance cookies: Help us understand site usage and performance. Functional cookies: Remember your preferences and settings. Targeting cookies: Used for personalized advertising."
        },
        {
          id: "third-party",
          title: "3. Third-Party Cookies",
          content: "We use third-party services like Google Analytics, payment processors, and social media platforms that may set their own cookies. These are governed by the respective third party's privacy policy."
        },
        {
          id: "control",
          title: "4. Managing Cookies",
          content: "You can control and delete cookies through your browser settings. Disabling cookies may affect the functionality of our website. Most browsers allow you to refuse cookies or delete existing ones."
        }
      ]
    },
    community: {
      title: "Community Guidelines",
      icon: Eye,
      lastUpdated: "January 1, 2026",
      sections: [
        {
          id: "respect",
          title: "1. Respect and Safety",
          content: "Treat all community members with respect and courtesy. Discrimination, harassment, or hate speech of any kind will not be tolerated. Report any safety concerns immediately to Zimer support."
        },
        {
          id: "accuracy",
          title: "2. Honesty and Accuracy",
          content: "Provide accurate information in your profile and listings. Do not misrepresent properties, amenities, or your identity. Be transparent about house rules, pricing, and any potential issues with the property."
        },
        {
          id: "communication",
          title: "3. Communication Standards",
          content: "Respond to inquiries and messages promptly. Keep all booking-related communication on the Zimer platform. Use professional and courteous language in all interactions."
        },
        {
          id: "prohibited",
          title: "4. Prohibited Activities",
          content: "Do not engage in fraudulent activities, spam, or attempts to bypass platform fees. Do not list illegal properties or use properties for illegal purposes. Do not discriminate against guests based on protected characteristics."
        },
        {
          id: "reviews",
          title: "5. Reviews and Ratings",
          content: "Leave honest, fair reviews based on your experience. Do not manipulate the review system or offer incentives for positive reviews. Reviews should focus on the property and experience, not personal attacks."
        }
      ]
    }
  };

  const currentDoc = legalDocs[activeDoc];
  const IconComponent = currentDoc.icon;

  return (
    <div className="w-full min-h-screen">

      <div className=" mx-auto px-4 sm:px-6 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className=" p-4 sticky top-4">
              <h2 className="text-[18px] font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Documents
              </h2>
              <nav className="space-y-2">
                {Object.entries(legalDocs).map(([key, doc]) => {
                  const Icon = doc.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveDoc(key)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                        activeDoc === key
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-[16px] font-medium">{doc.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="overflow-hidden">
              {/* Document Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-8 text-white rounded-md">
                <div className="flex items-center gap-4 mb-2">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-[30px] font-semibold">{currentDoc.title}</h2>
                    <p className="text-blue-100 text-[15px]">
                      Last updated: {currentDoc.lastUpdated}
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Content */}
              <div className="px-8 py-6">
                <div className="prose max-w-none">
                  {currentDoc.sections.map((section) => (
                    <div key={section.id} className="mb-6 border-b border-gray-200 pb-6 last:border-b-0">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between text-left group"
                      >
                        <h3 className="text-[20px] font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {section.title}
                        </h3>
                        {expandedSections[section.id] ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      
                      {expandedSections[section.id] && (
                        <div className="text-[16px] mt-4 text-gray-700 leading-relaxed animate-fadeIn">
                          {section.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer Note */}
                <div className="mt-8">
                  <p className="text-[18px] text-gray-700">
                    <strong>Questions?</strong> If you have any questions about our {currentDoc.title.toLowerCase()}, 
                    please contact us at{" "}
                    <a href="mailto:legal@zimer.com" className="text-blue-600 hover:underline font-medium">
                      legal@zimer.com
                    </a>{" "}
                    or visit our support center.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ViewLegalDocs;