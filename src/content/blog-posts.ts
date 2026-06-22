export const getLocalizedBlogPosts = (locale: string) => {
  const posts: Record<string, Array<{ slug: string; title: string; description: string }>> = {
    en: [
      {
        slug: "why-every-business-needs-a-website",
        title: "Why Every Business Needs a Website in 2026",
        description: "Discover why having a professional website is essential for business growth."
      },
      {
        slug: "top-digital-marketing-trends",
        title: "Top Digital Marketing Trends in 2026",
        description: "Explore the latest digital marketing strategies for business growth."
      }
    ],
    hi: [
      {
        slug: "why-every-business-needs-a-website",
        title: "2026 में हर व्यवसाय को वेबसाइट की आवश्यकता क्यों है",
        description: "जानें कि व्यावसायिक विकास के लिए एक पेशेवर वेबसाइट होना क्यों आवश्यक है।"
      },
      {
        slug: "top-digital-marketing-trends",
        title: "2026 में शीर्ष डिजिटल मार्केटिंग रुझान",
        description: "व्यावसायिक विकास के लिए नवीनतम डिजिटल मार्केटिंग रणनीतियों का पता लगाएं।"
      }
    ],
    kn: [
      {
        slug: "why-every-business-needs-a-website",
        title: "2026 ರಲ್ಲಿ ಪ್ರತಿಯೊಂದು ವ್ಯವಹಾರಕ್ಕೂ ವೆಬ್‌ಸೈಟ್ ಏಕೆ ಬೇಕು",
        description: "ವ್ಯವಹಾರದ ಬೆಳವಣಿಗೆಗೆ ವೃತ್ತಿಪರ ವೆಬ್‌ಸೈಟ್ ಹೊಂದುವುದು ಏಕೆ ಅತ್ಯಗತ್ಯ ಎಂದು ತಿಳಿಯಿರಿ."
      },
      {
        slug: "top-digital-marketing-trends",
        title: "2026 ರಲ್ಲಿ ಉನ್ನತ ಡಿಜಿಟಲ್ ಮಾರ್ಕೆಟಿಂಗ್ ಪ್ರವೃತ್ತಿಗಳು",
        description: "ವ್ಯವಹಾರದ ಬೆಳವಣಿಗೆಗಾಗಿ ಇತ್ತೀಚಿನ ಡಿಜಿಟಲ್ ಮಾರ್ಕೆಟಿಂಗ್ ತಂತ್ರಗಳನ್ನು ಅನ್ವೇಷಿಸಿ."
      }
    ],
    te: [
      {
        slug: "why-every-business-needs-a-website",
        title: "2026లో ప్రతి వ్యాపారానికి వెబ్‌సైట్ ఎందుకు అవసరం",
        description: "వ్యాపార వృద్ధికి వృత్తిపరమైన వెబ్‌సైట్ ಹೊಂದడం ఎందుకు అత్యవసరం ಎಂದು ತಿಳಿಯಿರಿ."
      },
      {
        slug: "top-digital-marketing-trends",
        title: "2026లో టాప్ డిజిటల్ మార్కెటింగ్ ట్రెండ్స్",
        description: "వ్యాపార వృద్ధి కోసం తాజా డిಜಿటల్ మార్కెటింగ్ వ్యూహాలను అన్వేషించండి."
      }
    ],
    mr: [
      {
        slug: "why-every-business-needs-a-website",
        title: "2026 मध्ये प्रत्येक व्यवसायाला वेबसाइटची आवश्यकता का आहे",
        description: "व्यवसायाच्या वाढीसाठी व्यावसायिक वेबसाइट असणे का आवश्यक आहे ते शोधा."
      },
      {
        slug: "top-digital-marketing-trends",
        title: "2026 मधील शीर्ष डिजिटल मार्केटिंग ट्रेंड",
        description: "व्यवसाय वाढीसाठी नवीनतम डिजिटल मार्केटिंग धोरणे एक्सप्लोर करा."
      }
    ]
  };

  // Fallback to English if the locale array doesn't exist
  return posts[locale] || posts["en"];
};
