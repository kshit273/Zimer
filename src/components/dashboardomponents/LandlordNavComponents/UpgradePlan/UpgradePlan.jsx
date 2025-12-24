import React, { useState } from "react";
import { Check, X, ChevronDown } from "lucide-react";
import { basicList, popularList, premiumList, plans } from "../../../../constants/Abt";

const faqs = [
  {
    question: "What's the difference between Basic and Premium plan?",
    answer: "Basic plan allows you to list your PG for free with basic features. Premium plan includes all features like guaranteed cashback, tenant payment handling, priority listings, verified badges, and targeted ads to help your PG rank higher."
  },
  {
    question: "Can I upgrade or downgrade later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
  },
  {
    question: "How is commission charged?",
    answer: "Commission is charged based on successful bookings through the platform. The exact percentage varies by plan."
  },
  {
    question: "What happens if I cancel?",
    answer: "You can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period."
  },
  {
    question: "Do I need to pre-upfront?",
    answer: "No upfront payment is required for the Basic plan. Popular and Premium plans are billed monthly."
  },
  {
    question: "Can I switch from Basic to Premium anytime?",
    answer: "Yes, you can upgrade from Basic to Premium at any time and start enjoying all premium features immediately."
  },
  {
    question: "Do I need to pay upfront?",
    answer: "Payment is processed monthly for Popular and Premium plans. Basic plan is completely free."
  },
  {
    question: "How is the Premium plan priced?",
    answer: "The Premium plan is priced at ₹25 per month (including GST) and includes all premium features."
  },
  {
    question: "What happens to my data if I cancel or downgrade?",
    answer: "Your data remains safe and accessible. If you downgrade, you'll lose access to premium features but your listings and basic data remain intact."
  },
  {
    question: "What's the 'Verification Badges and why is it important?",
    answer: "Verification badges show that your PG has been thoroughly verified by our team, increasing trust and visibility to potential tenants."
  },
  {
    question: "Is my PG listed differently if I choose Premium?",
    answer: "Yes, Premium listings are prioritized in search results and marked with verification badges, making them more visible to potential tenants."
  },
  {
    question: "Do I get access to analytics or insights?",
    answer: "Popular and Premium plans include access to a dashboard with payment records and analytics to track your PG's performance."
  },
  {
    question: "Is my PG listed differently if I choose Premium?",
    answer: "Yes, Premium listings receive priority placement in search results and are marked with verified badges."
  },
  {
    question: "Does the Premium plan help me auction with dignity?",
    answer: "The Premium plan gives you competitive advantages through priority listings and verified badges, helping your PG stand out professionally."
  },
  {
    question: "What support is included in the Premium plan?",
    answer: "Premium plan includes dedicated call support for both you and your tenants, along with payment handling services."
  },
  {
    question: "How do I contact support if I need help with upgrading?",
    answer: "You can reach our support team through the contact section on our website or via the help center in your dashboard."
  },
  {
    question: "Is my PGs data safe with Zimer?",
    answer: "Yes, we use industry-standard encryption and security measures to protect all your data."
  },
  {
    question: "Is the rent payment system secure?",
    answer: "Yes, all payments are processed through secure payment gateways with full encryption and fraud protection."
  },
  {
    question: "How long does it take to get verified after choosing Premium?",
    answer: "Verification typically takes 24-48 hours after upgrading to Premium. Our team will review your PG details and contact you if any additional information is needed."
  },
  {
    question: "What documents do I need for verification?",
    answer: "You'll need proof of ownership or authorization to operate the PG, along with basic property documents and identity verification."
  },
  {
    question: "What is the difference between popular and premium plan?",
    answer: "Premium plan includes everything in Popular plus premium badges, priority listings, verified badges, and the ability to run targeted ads for higher visibility."
  }
];

const UpgradePlan = ({currentPlan}) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const allFeatures = [
  "List your PG on Zimer for FREE",
  "Gauranted cashback for tenants",
  "Rewards for tenants",
  "We will handle tenant payment records",
  "Get your own Call Support for tenants",
  "Get a dashboard to keep record of payments",
  "Zimer Tenant Reliability Score (ZTRS) to know tenant's previous history",
  "Premium badges for your PG",
  "Priority listings (PGs with badges are ranked higher and verified thoroughly)",
  "Run targeted ads if your PG rank higher",
  ];

  const hasFeature = (planList, feature) => {
    return planList.includes(feature);
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8">
      {/* Pricing Cards */}
      <div className=" mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="rounded-[15px] overflow-hidden shadow-lg"
              style={{ backgroundColor: plan.priBg }}
            >
              {/* Header */}
              <div className="p-6 text-center relative">
                {plan.title === "Popular" && (
                  <div className="absolute top-0 right-0 bg-[#d72638] text-[#f5f5f5] text-[13px] font-bold px-3 py-1 rounded-bl-lg">
                    RECOMMENDED
                  </div>
                )}
                {plan.title === "Premium" && (
                  <div className="absolute top-0 right-0 text-[13px] font-bold px-3 py-1 rounded-bl-lg"
                       style={{ backgroundColor: plan.secBg, color: plan.priBg }}>
                    BEST VALUE
                  </div>
                )}
                <h3 className="text-[30px] font-semibold mb-2" style={{ color: plan.secBg }}>
                  {plan.title} plan
                </h3>
                <div className="flex items-start justify-center mb-2">
                  <span className="text-6xl font-semibold" style={{ color: plan.secBg }}>
                    {plan.price}
                  </span>
                  <span className="text-6xl ml-1" style={{ color: plan.secBg }}>
                    %
                  </span>
                </div>
                <p className="text-sm" style={{ color: plan.secBg }}>
                  per month 
                </p>
              </div>

              {/* Features List */}
              <div className="px-6 pt-6 pb-6">
                <ul className="space-y-3">
                  {allFeatures.map((feature, idx) => {
                    const hasIt = hasFeature(plan.list, feature);
                    return (
                      <li key={idx} className="flex items-start text-[17px]">
                        <span className="mr-2 mt-0.5">
                          {hasIt ? (
                            <Check size={16} style={{ color: plan.secBg }} />
                          ) : (
                            <X size={16} style={{ color: plan.secBg, opacity: 0.4 }} />
                          )}
                        </span>
                        <span style={{ color: plan.secBg, opacity: hasIt ? 1 : 0.5 }}>
                          {feature}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {/* Upgrade Button */}
                {plan.title !== 'Basic' ? <button
  className="text-[16px] w-full mt-8 py-3 rounded-full font-semibold transition-opacity hover:opacity-90"
  style={{
    backgroundColor: currentPlan?.charAt(0).toUpperCase() + currentPlan?.slice(1) === plan.title ? '#d72638' : plan.secBg,
    color: currentPlan?.charAt(0).toUpperCase() + currentPlan?.slice(1) === plan.title ? '#ffffff' : plan.priBg,
  }}
>
  {currentPlan?.charAt(0).toUpperCase() + currentPlan?.slice(1) === plan.title ? `Current Plan` : `Upgrade`}
</button>:null}
                
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className=" mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">FAQs</h2>
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className=" rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-[18px] font-medium text-gray-800 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                    expandedIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  expandedIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-4 pb-4 pt-0 text-[15px] text-gray-600 border-t border-gray-100">
                  <p className="mt-3">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpgradePlan;