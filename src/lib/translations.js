/**
 * Complete English (en) and Hindi (hi) Dictionaries
 * Natural, professional phrasing without mixed-language sentences.
 * Brand names, technical abbreviations (kW, kWh, MPPT, etc.), and addresses remain untranslated.
 */

export const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About Us",
      services: "Services",
      allServices: "All Solar Services",
      residential: "Residential Solar",
      commercial: "Commercial Solar",
      industrial: "Industrial EPC",
      products: "Products",
      projects: "Projects",
      calculator: "Savings Calculator",
      contact: "Contact Us",
      getQuote: "Get Free Quote",
      clientPortal: "Client Portal",
    },

    buttons: {
      getQuote: "Get Free Solar Quote",
      calculateSavings: "Calculate My Solar Savings",
      learnMore: "Learn More",
      viewProjects: "View Our Projects",
      exploreServices: "Explore Solar Services",
      submit: "Submit Enquiry",
      submitting: "Submitting...",
      sendWhatsapp: "Send Enquiry via WhatsApp",
      openWhatsapp: "Chat on WhatsApp",
      callNow: "Call Solar Expert",
      skipContinue: "Skip, continue browsing",
      close: "Close",
      backToHome: "Back to Home",
      tryAgain: "Try Again",
      viewAllProjects: "View All Solar Installations",
      requestSiteVisit: "Book Free Site Survey",
    },

    hero: {
      badge: "India's High-Efficiency Solar EPC",
      title: "Power Your Future with Smarter Solar Energy.",
      subtitle:
        "High-performance rooftop solar systems for residences, commercial enterprises, and industrial facilities. Slash power bills, secure 25-year reliability, and leverage full government subsidy assistance.",
      ctaPrimary: "Get Free Rooftop Quote",
      ctaSecondary: "Calculate Savings",
      feature1: "Tier-1 Mono PERC & TOPCon Panels",
      feature2: "Up to ₹78,000 PM Surya Ghar Subsidy",
      feature3: "25-Year Performance Warranty",
    },

    sections: {
      services: {
        badge: "Our Solar Solutions",
        title: "Tailored Solar Energy Systems for Every Property",
        subtitle:
          "From independent homes to megawatt manufacturing complexes, we engineer high-efficiency solar plants built for long-term power generation.",
        viewDetails: "View Service Details",
      },
      products: {
        badge: "Solar Hardware",
        title: "Certified Tier-1 Solar Components",
        subtitle:
          "We deploy exclusively MNRE-approved, Tier-1 solar panels, smart European and Indian inverters, and heavy-duty structural mountings.",
        specsHeading: "Key Technical Specifications",
      },
      howItWorks: {
        badge: "Seamless 6-Step Process",
        title: "How Your Solar Rooftop Installation Works",
        subtitle:
          "From initial shadow assessment to discom net metering synchronization, we handle all legal approvals, engineering, and commissioning.",
        steps: [
          {
            number: "01",
            title: "Site Survey & Load Study",
            description: "Our engineers evaluate your roof layout, structural capacity, shadow profiles, and historical electricity bills.",
          },
          {
            number: "02",
            title: "3D Engineering Design",
            description: "Custom solar array layout optimized for maximum sunlight capture and aesthetic terrace space utilization.",
          },
          {
            number: "03",
            title: "Subsidy & Discom Liaison",
            description: "Complete paperwork clearance for national portal subsidy and state electricity board net metering approval.",
          },
          {
            number: "04",
            title: "Safe On-Site Installation",
            description: "Certified technicians install hot-dip galvanized mounting structures, Tier-1 modules, and safety earthing.",
          },
          {
            number: "05",
            title: "Net-Metering Commissioning",
            description: "Discom inspection, bi-directional meter synchronization, and official energization of your solar plant.",
          },
          {
            number: "06",
            title: "App Setup & 25-Year Support",
            description: "Live generation tracking on your smartphone, hand-over documentation, and scheduled maintenance.",
          },
        ],
      },
      projects: {
        badge: "Proven Portfolio",
        title: "Featured Solar Installations",
        subtitle: "Real rooftop installations delivering verified clean kilowatt-hours every single day.",
        capacityLabel: "Installed Capacity",
        locationLabel: "Location",
        viewCaseStudy: "View Project Details",
      },
      whyUs: {
        badge: "The AuraSun Advantage",
        title: "Why Property Owners Choose Us",
        subtitle: "Precision engineering, transparent pricing, and relentless post-installation support.",
        points: [
          {
            title: "In-House Certified Engineers",
            description: "No outsourced third-party labor. Every installation is designed and supervised by certified solar engineers.",
          },
          {
            title: "Tier-1 Quality Guarantee",
            description: "Strictly Tier-1 monocrystalline modules with anti-reflective glass and 25-year linear performance degradation limits.",
          },
          {
            title: "End-to-End Subsidy Clearance",
            description: "We handle your PM Surya Ghar application, discom documentation, and subsidy credit directly into your bank account.",
          },
          {
            title: "Smart Mobile Monitoring",
            description: "Track your real-time daily generation, CO₂ savings, and export units directly from your mobile smartphone.",
          },
        ],
      },
      calculator: {
        badge: "Instant Solar Estimate",
        title: "Estimate Your Solar System Size & Monthly Savings",
        subtitle:
          "Calculate your approximate required kilowatt capacity, annual electricity bill savings, and estimated payback period in seconds.",
      },
      testimonials: {
        badge: "Client Testimonials",
        title: "Trusted by Homeowners & Business Leaders",
        subtitle: "Hear firsthand from clients who converted their rooftops into clean energy assets.",
      },
      faqs: {
        badge: "Got Questions?",
        title: "Frequently Asked Questions About Solar",
        subtitle: "Everything you need to know about rooftop solar, government subsidies, net metering, and maintenance.",
        stillQuestions: "Have a specific technical question?",
      },
      ctaBand: {
        title: "Ready to Switch to Zero-Cost Solar Power?",
        subtitle:
          "Book a complimentary rooftop shadow survey and receive a customized 3D solar design report for your property.",
        cta: "Request Free Site Feasibility Study",
      },
      contact: {
        badge: "Get in Touch",
        title: "Talk to a Solar Energy Specialist",
        subtitle: "Have questions about rooftop viability, commercial tariffs, or solar financing? Our engineers are here to assist.",
        phoneLabel: "Call Us Directly",
        emailLabel: "Email Our Team",
        addressLabel: "Corporate Headquarters",
        hoursLabel: "Operational Hours",
        sendEnquiry: "Send a Direct Message",
      },
    },

    forms: {
      name: {
        label: "Full Name",
        placeholder: "e.g. Rajesh Kumar",
      },
      phone: {
        label: "Mobile Number",
        placeholder: "e.g. 98765 43210",
        helper: "10-digit Indian mobile number",
      },
      email: {
        label: "Email Address (Optional)",
        placeholder: "e.g. rajesh@example.com",
      },
      city: {
        label: "City / District",
        placeholder: "e.g. Gurugram, Delhi NCR",
      },
      propertyType: {
        label: "Property Type",
        residential: "Residential / Independent Home",
        commercial: "Commercial / Office / School",
        industrial: "Industrial / Factory / Warehouse",
        housingSociety: "Housing Society / Apartment Complex",
      },
      monthlyBill: {
        label: "Average Monthly Electricity Bill (₹)",
        placeholder: "e.g. 6500",
        helper: "Approximate monthly power cost",
      },
      category: {
        label: "Enquiry Interest",
        selectOption: "Select solar requirement",
      },
      message: {
        label: "Additional Notes or Roof Area (Optional)",
        placeholder: "Mention approximate roof area, specific inverter preference, or questions...",
      },
      consent: {
        prefix: "I consent to AuraSun contacting me via Phone/WhatsApp for this solar consultation as detailed in the ",
        privacyLink: "Privacy Policy",
        suffix: ".",
      },
      submitButton: {
        default: "Submit Free Quote Request",
        submitting: "Submitting Details...",
        popupSubmit: "Get Instant Feasibility Call",
      },
      feedback: {
        successTitle: "Enquiry Received Successfully!",
        successDesc:
          "Thank you! Our solar engineering team has received your details and will call you within 2 business hours with initial system sizing.",
        whatsappCta: "Send this enquiry directly on WhatsApp",
        whatsappNote: "Note: Clicking this will open WhatsApp with your pre-filled enquiry. You must click Send in WhatsApp.",
        fallbackErrorTitle: "Notice: Direct Database Storage Unavailable",
        fallbackErrorDesc:
          "We could not save your details to our server right now. You can still reach our team immediately via WhatsApp or phone call.",
      },
    },

    validation: {
      nameRequired: "Please enter your full name (minimum 2 letters).",
      phoneInvalid: "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.",
      emailInvalid: "Please enter a valid email address.",
      cityRequired: "Please enter your city or district.",
      consentRequired: "You must give consent to be contacted regarding this solar enquiry.",
      billRequired: "Please enter a valid monthly bill amount.",
      categoryRequired: "Please select an enquiry category.",
    },

    calculator: {
      inputHeading: "Calculate Your Solar Capacity",
      billTab: "By Monthly Bill (₹)",
      unitsTab: "By Monthly Consumption (Units)",
      billLabel: "Monthly Electricity Bill (₹)",
      unitsLabel: "Monthly Electricity Consumption (Units / kWh)",
      propertyTypeLabel: "Property Sector",
      roofAreaLabel: "Estimated Clear Roof Area (Sq. Ft.) - Optional",
      resultsHeading: "Estimated Solar System Potential",
      systemSize: "Recommended System Size",
      monthlyGeneration: "Estimated Monthly Generation",
      annualSavings: "Estimated Annual Savings",
      paybackPeriod: "Estimated Payback Period",
      disclaimer:
        "Disclaimer: These calculations are estimates based on standard regional solar irradiation (4.2 units/kW/day). Actual generation and payback vary based on roof tilt, orientation, local weather, and applicable state electricity tariffs.",
      subsidyNote:
        "Government Subsidy Note: Residential systems up to 3 kW are eligible for central government financial assistance under PM Surya Ghar Muft Bijli Yojana.",
      viewSubsidyPortal: "Visit Official PM Surya Ghar Portal",
      quoteCta: "Get an Engineered Quote for This Size",
      kwUnit: "kW",
      kwhUnit: "Units (kWh) / month",
      inrUnit: "₹ / year",
      yearsUnit: "Years",
    },

    popup: {
      badge: "Free Consultation",
      title: "Get a Free Rooftop Solar Feasibility Report",
      subtitle:
        "Enter your contact details and our certified solar engineer will share a customized 3D design and payback forecast within 2 hours.",
      skip: "Skip, continue browsing the website",
    },

    overlay: {
      heading: "Welcome to AuraSun Solar Solutions",
      subheading: "Please select your preferred language / कृपया अपनी पसंदीदा भाषा चुनें",
      enButton: "Continue in English",
      hiButton: "हिंदी में आगे बढ़ें",
    },

    notFound: {
      title: "Page Not Found (404)",
      description: "The page you are looking for does not exist, has been removed, or has had its name changed.",
      backButton: "Return to Homepage",
    },

    error: {
      title: "Something Went Wrong",
      description: "An unexpected error occurred while loading this page. Our technical team has been alerted.",
      retry: "Try Again",
    },

    footer: {
      aboutCompany:
        "AuraSun Solar is an engineering-driven solar EPC provider committed to delivering reliable rooftop solar power plants for residential, commercial, and industrial facilities across India.",
      quickLinks: "Quick Links",
      solarServices: "Solar Services",
      contactInfo: "Contact Information",
      allRightsReserved: "All rights reserved.",
      privacyPolicy: "Privacy Policy",
      termsConditions: "Terms & Conditions",
    },

    privacyTerms: {
      privacyTitle: "Privacy Policy",
      termsTitle: "Terms & Conditions",
      lastUpdated: "Last Updated: October 2026",
    },
  },

  hi: {
    nav: {
      home: "होम",
      about: "हमारे बारे में",
      services: "सेवाएं",
      allServices: "सभी सौर सेवाएं",
      residential: "आवासीय सोलर",
      commercial: "व्यावसायिक सोलर",
      industrial: "औद्योगिक ईपीसी",
      products: "उत्पाद",
      projects: "प्रोजेक्ट्स",
      calculator: "बचत कैलकुलेटर",
      contact: "संपर्क करें",
      getQuote: "फ्री कोटेशन पाएं",
      clientPortal: "ग्राहक पोर्टल",
    },

    buttons: {
      getQuote: "निःशुल्क सोलर कोटेशन पाएं",
      calculateSavings: "अपनी सौर बचत की गणना करें",
      learnMore: "अधिक जानकारी",
      viewProjects: "हमारे प्रोजेक्ट्स देखें",
      exploreServices: "सौर सेवाएं देखें",
      submit: "पूछताछ भेजें",
      submitting: "भेजा जा रहा है...",
      sendWhatsapp: "व्हाट्सएप पर पूछताछ भेजें",
      openWhatsapp: "व्हाट्सएप पर बात करें",
      callNow: "सोलर विशेषज्ञ को कॉल करें",
      skipContinue: "छोड़ें, वेबसाइट देखते रहें",
      close: "बंद करें",
      backToHome: "मुख्य पृष्ठ पर लौटें",
      tryAgain: "पुनः प्रयास करें",
      viewAllProjects: "सभी सोलर इंस्टॉलेशन देखें",
      requestSiteVisit: "फ्री साइट सर्वे बुक करें",
    },

    hero: {
      badge: "भारत का अग्रणी सोलर ईपीसी प्रदाता",
      title: "स्मार्ट सौर ऊर्जा के साथ अपना भविष्य रोशन करें।",
      subtitle:
        "घरों, व्यावसायिक प्रतिष्ठानों और औद्योगिक परिसरों के लिए उच्च दक्षता वाले रूफटॉप सोलर सिस्टम। बिजली बिलों में 90% तक की बचत करें, 25 वर्ष की विश्वसनीयता पाएं और पूर्ण सरकारी सब्सिडी सहायता प्राप्त करें।",
      ctaPrimary: "निःशुल्क रूफटॉप कोटेशन पाएं",
      ctaSecondary: "बचत कैलकुलेटर",
      feature1: "टियर-1 मोनो पीईआरसी और TOPCon पैनल",
      feature2: "पीएम सूर्य घर योजना में ₹78,000 तक सब्सिडी",
      feature3: "25 वर्ष की लीनियर परफॉर्मेंस वारंटी",
    },

    sections: {
      services: {
        badge: "हमारे सौर समाधान",
        title: "हर प्रकार की संपत्ति के लिए विशेष सौर ऊर्जा संयंत्र",
        subtitle:
          "स्वतंत्र मकानों से लेकर मेगावाट-स्केल विनिर्माण कारखानों तक, हम दीर्घकालिक और विश्वसनीय बिजली उत्पादन हेतु सोलर प्लांट तैयार करते हैं।",
        viewDetails: "सेवा का विवरण देखें",
      },
      products: {
        badge: "सोलर उपकरण",
        title: "प्रमाणित टियर-1 सोलर उपकरण",
        subtitle:
          "हम केवल एमएनआरई-स्वीकृत टियर-1 सोलर मॉड्यूल, आधुनिक भारतीय और यूरोपीय इनवर्टर तथा अत्यधिक मजबूत माउंटिंग स्ट्रक्चर का उपयोग करते हैं।",
        specsHeading: "मुख्य तकनीकी विशेषताएं",
      },
      howItWorks: {
        badge: "सहज 6-चरणीय प्रक्रिया",
        title: "सोलर रूफटॉप इंस्टॉलेशन कैसे काम करता है",
        subtitle:
          "प्रारंभिक छाया निरीक्षण से लेकर डिस्कॉम नेट मीटरिंग तक, सभी सरकारी अनुमतियां, इंजीनियरिंग और कमीशनिंग हम संभालते हैं।",
        steps: [
          {
            number: "01",
            title: "साइट सर्वेक्षण और लोड अध्ययन",
            description: "हमारे इंजीनियर आपकी छत की मजबूती, छाया प्रोफाइल और पिछले बिजली बिलों का विस्तृत विश्लेषण करते हैं।",
          },
          {
            number: "02",
            title: "3D इंजीनियरिंग डिजाइन",
            description: "अधिकतम धूप प्राप्त करने और छत की खुली जगह को सुरक्षित रखने के लिए कस्टमाइज्ड सोलर लेआउट तैयार किया जाता है।",
          },
          {
            number: "03",
            title: "सब्सिडी और डिस्कॉम अनुमोदन",
            description: "राष्ट्रीय पोर्टल सब्सिडी और राज्य बिजली बोर्ड से नेट मीटरिंग की सभी कागजी कार्यवाही हम पूरी करते हैं।",
          },
          {
            number: "04",
            title: "सुरक्षित ऑन-साइट इंस्टॉलेशन",
            description: "प्रमाणित तकनीशियन हॉट-डिप गैल्वेनाइज्ड स्ट्रक्चर, टियर-1 मॉड्यूल और उचित अर्थिंग सुरक्षा स्थापित करते हैं।",
          },
          {
            number: "05",
            title: "नेट-मीटरिंग और कमीशनिंग",
            description: "डिस्कॉम अधिकारियों द्वारा निरीक्षण, बाई-डायरेक्शनल मीटर स्थापना और सोलर प्लांट को ग्रिड से जोड़ना।",
          },
          {
            number: "06",
            title: "मोबाइल ऐप और 25 वर्ष सहयोग",
            description: "मोबाइल पर लाइव सोलर बिजली उत्पादन ट्रैकिंग, वारंटी दस्तावेज और निर्धारित समय पर रखरखाव।",
          },
        ],
      },
      projects: {
        badge: "प्रमाणित कार्य",
        title: "प्रमुख सोलर प्रोजेक्ट्स",
        subtitle: "वास्तविक रूफटॉप सोलर सिस्टम जो प्रतिदिन स्वच्छ और किफायती बिजली का उत्पादन कर रहे हैं।",
        capacityLabel: "स्थापित क्षमता",
        locationLabel: "स्थान",
        viewCaseStudy: "प्रोजेक्ट का विवरण देखें",
      },
      whyUs: {
        badge: "हमारा विशेष अनुभव",
        title: "उपभोक्ता हमें क्यों चुनते हैं",
        subtitle: "सटीक इंजीनियरिंग, पारदर्शी मूल्य और इंस्टॉलेशन के बाद निरंतर तकनीकी सहयोग।",
        points: [
          {
            title: "प्रमाणित इन-हाउस इंजीनियर",
            description: "कोई बाहरी थर्ड-पार्टी लेबर नहीं। प्रत्येक प्लांट प्रमाणित सोलर इंजीनियरों की देखरेख में स्थापित होता है।",
          },
          {
            title: "टियर-1 गुणवत्ता गारंटी",
            description: "केवल टियर-1 मोनोक्रिस्टलाइन सोलर मॉड्यूल, एंटी-रिफ्लेक्टिव ग्लास और 25 वर्ष की परफॉर्मेंस वारंटी।",
          },
          {
            title: "संपूर्ण सब्सिडी सहायता",
            description: "पीएम सूर्य घर योजना में आवेदन और डिस्कॉम कागजी कार्यवाही हम संभालते हैं ताकि सब्सिडी सीधे आपके खाते में आए।",
          },
          {
            title: "स्मार्ट मोबाइल ट्रैकिंग",
            description: "अपने स्मार्टफोन पर प्रतिदिन बनने वाली बिजली, कार्बन बचत और ग्रिड को भेजी गई यूनिट्स लाइव देखें।",
          },
        ],
      },
      calculator: {
        badge: "त्वरित सौर अनुमान",
        title: "अपनी सोलर क्षमता और मासिक बचत का अनुमान लगाएं",
        subtitle:
          "कुछ ही सेकंड में जानें कि आपके घर या व्यवसाय के लिए कितने किलोवाट का सोलर सिस्टम चाहिए और कितनी बचत होगी।",
      },
      testimonials: {
        badge: "ग्राहकों के विचार",
        title: "संतुष्ट गृहस्वामियों और व्यवसायियों का विश्वास",
        subtitle: "उन लोगों के अनुभव जिन्होंने अपनी खाली छतों को सौर ऊर्जा संयंत्र में बदल दिया।",
      },
      faqs: {
        badge: "अक्सर पूछे जाने वाले सवाल",
        title: "सोलर से संबंधित सामान्य प्रश्न",
        subtitle: "रूफटॉप सोलर, सरकारी सब्सिडी, नेट मीटरिंग और रखरखाव से जुड़े महत्वपूर्ण सवालों के जवाब।",
        stillQuestions: "क्या आपका कोई विशेष तकनीकी सवाल है?",
      },
      ctaBand: {
        title: "क्या आप शून्य बिजली बिल की ओर कदम बढ़ाने के लिए तैयार हैं?",
        subtitle:
          "आज ही अपनी छत के लिए निःशुल्क शैडो सर्वे बुक करें और संपूर्ण 3D सोलर फिजिबिलिटी रिपोर्ट प्राप्त करें।",
        cta: "निःशुल्क साइट सर्वे के लिए अनुरोध करें",
      },
      contact: {
        badge: "संपर्क करें",
        title: "हमारे सोलर विशेषज्ञ से बात करें",
        subtitle: "छत की उपयुक्तता, व्यावसायिक दरों या फाइनेंसिंग से जुड़े सवालों के लिए हमारे इंजीनियर आपकी सहायता के लिए उपस्थित हैं।",
        phoneLabel: "सीधे फोन करें",
        emailLabel: "ईमेल भेजें",
        addressLabel: "मुख्य कार्यालय का पता",
        hoursLabel: "कार्य दिवस व समय",
        sendEnquiry: "सीधा संदेश भेजें",
      },
    },

    forms: {
      name: {
        label: "पूरा नाम",
        placeholder: "उदा. राजेश कुमार",
      },
      phone: {
        label: "मोबाइल नंबर",
        placeholder: "उदा. 98765 43210",
        helper: "10 अंकों का भारतीय मोबाइल नंबर",
      },
      email: {
        label: "ईमेल पता (वैकल्पिक)",
        placeholder: "उदा. rajesh@example.com",
      },
      city: {
        label: "शहर / जिला",
        placeholder: "उदा. गुरुग्राम, दिल्ली एनसीआर",
      },
      propertyType: {
        label: "संपत्ति का प्रकार",
        residential: "आवासीय / स्वतंत्र मकान",
        commercial: "व्यावसायिक / कार्यालय / स्कूल",
        industrial: "औद्योगिक / कारखाना / गोदाम",
        housingSociety: "हाउसिंग सोसाइटी / अपार्टमेंट",
      },
      monthlyBill: {
        label: "औसत मासिक बिजली बिल (₹)",
        placeholder: "उदा. 6500",
        helper: "आपका अनुमानित मासिक बिजली खर्च",
      },
      category: {
        label: "पूछताछ की श्रेणी",
        selectOption: "अपनी सौर आवश्यकता चुनें",
      },
      message: {
        label: "अतिरिक्त विवरण या छत का क्षेत्रफल (वैकल्पिक)",
        placeholder: "छत का अनुमानित आकार, इनवर्टर प्राथमिकता या कोई विशेष प्रश्न लिखें...",
      },
      consent: {
        prefix: "मैं इस सौर परामर्श हेतु फोन या व्हाट्सएप पर संपर्क किए जाने की सहमति देता/देती हूँ जैसा कि ",
        privacyLink: "गोपनीयता नीति",
        suffix: " में वर्णित है।",
      },
      submitButton: {
        default: "निःशुल्क कोटेशन अनुरोध भेजें",
        submitting: "विवरण भेजा जा रहा है...",
        popupSubmit: "तुरंत फिजिबिलिटी कॉल प्राप्त करें",
      },
      feedback: {
        successTitle: "आपकी पूछताछ सफलतापूर्वक प्राप्त हुई!",
        successDesc:
          "धन्यवाद! हमारी सोलर इंजीनियरिंग टीम को आपका विवरण मिल गया है और वे 2 कार्य घंटों के भीतर प्राथमिक डिजाइन के साथ आपसे संपर्क करेंगे।",
        whatsappCta: "यह पूछताछ सीधे व्हाट्सएप पर भेजें",
        whatsappNote: "नोट: इस पर क्लिक करने से व्हाट्सएप खुलेगा जिसमें आपका संदेश भरा होगा। व्हाट्सएप में सेंड बटन दबाना आवश्यक है।",
        fallbackErrorTitle: "सूचना: डेटाबेस में सीधा संग्रह उपलब्ध नहीं है",
        fallbackErrorDesc:
          "हम इस समय आपके विवरण को सर्वर पर सुरक्षित नहीं कर सके। आप व्हाट्सएप या फोन कॉल के माध्यम से तुरंत हमारी टीम से संपर्क कर सकते हैं।",
      },
    },

    validation: {
      nameRequired: "कृपया अपना पूरा नाम दर्ज करें (कम से कम 2 अक्षर)।",
      phoneInvalid: "कृपया 6, 7, 8 या 9 से शुरू होने वाला 10 अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें।",
      emailInvalid: "कृपया एक वैध ईमेल पता दर्ज करें।",
      cityRequired: "कृपया अपना शहर या जिला दर्ज करें।",
      consentRequired: "परामर्श के लिए सहमति देना आवश्यक है।",
      billRequired: "कृपया वैध मासिक बिजली बिल राशि दर्ज करें।",
      categoryRequired: "कृपया पूछताछ की श्रेणी चुनें।",
    },

    calculator: {
      inputHeading: "अपनी सौर क्षमता की गणना करें",
      billTab: "मासिक बिल द्वारा (₹)",
      unitsTab: "मासिक बिजली खपत द्वारा (यूनिट)",
      billLabel: "मासिक बिजली बिल (₹)",
      unitsLabel: "मासिक बिजली खपत (यूनिट / kWh)",
      propertyTypeLabel: "संपत्ति का वर्ग",
      roofAreaLabel: "अनुमानित खुली छत का क्षेत्रफल (वर्ग फुट) - वैकल्पिक",
      resultsHeading: "अनुमानित सौर संयंत्र परिणाम",
      systemSize: "अनुशंसित सोलर क्षमता",
      monthlyGeneration: "अनुमानित मासिक बिजली उत्पादन",
      annualSavings: "अनुमानित वार्षिक बिजली बचत",
      paybackPeriod: "अनुमानित लागत वापसी समय (पेबैक)",
      disclaimer:
        "अस्वीकरण: ये गणनाएं क्षेत्रीय औसत सौर विकिरण (4.2 यूनिट/किलोवाट/दिन) पर आधारित अनुमान हैं। वास्तविक उत्पादन और बचत छत की दिशा, मौसम और स्थानीय बिजली दरों पर निर्भर करती है।",
      subsidyNote:
        "सरकारी सब्सिडी सूचना: 3 किलोवाट तक के आवासीय सोलर सिस्टम पीएम सूर्य घर मुफ्त बिजली योजना के तहत प्रत्यक्ष केंद्रीय वित्तीय सहायता के पात्र हैं।",
      viewSubsidyPortal: "आधिकारिक पीएम सूर्य घर पोर्टल देखें",
      quoteCta: "इस क्षमता के लिए सटीक कोटेशन प्राप्त करें",
      kwUnit: "किलोवाट (kW)",
      kwhUnit: "यूनिट (kWh) / माह",
      inrUnit: "₹ / वर्ष",
      yearsUnit: "वर्ष",
    },

    popup: {
      badge: "निःशुल्क परामर्श",
      title: "मुफ्त रूफटॉप सोलर फिजिबिलिटी रिपोर्ट प्राप्त करें",
      subtitle:
        "अपना मोबाइल नंबर दर्ज करें और हमारे प्रमाणित सोलर इंजीनियर 2 घंटे के भीतर आपकी छत का 3D डिजाइन और बचत रिपोर्ट साझा करेंगे।",
      skip: "छोड़ें, वेबसाइट देखते रहें",
    },

    overlay: {
      heading: "औरासन सोलर सॉल्यूशंस में आपका स्वागत है",
      subheading: "कृपया अपनी पसंदीदा भाषा चुनें / Please select your preferred language",
      enButton: "Continue in English",
      hiButton: "हिंदी में आगे बढ़ें",
    },

    notFound: {
      title: "पृष्ठ नहीं मिला (404)",
      description: "आप जिस पृष्ठ की तलाश कर रहे हैं वह मौजूद नहीं है या उसका पता बदल दिया गया है।",
      backButton: "मुख्य पृष्ठ पर लौटें",
    },

    error: {
      title: "कुछ गलत हो गया",
      description: "इस पृष्ठ को लोड करते समय एक अप्रत्याशित समस्या आई है। हमारी तकनीकी टीम को सूचित कर दिया गया है।",
      retry: "पुनः प्रयास करें",
    },

    footer: {
      aboutCompany:
        "औरासन सोलर एक विश्वसनीय सोलर ईपीसी कंपनी है जो पूरे भारत में आवासीय, व्यावसायिक और औद्योगिक परिसरों के लिए उच्च दक्षता वाले सौर ऊर्जा संयंत्र स्थापित करती है।",
      quickLinks: "महत्वपूर्ण लिंक",
      solarServices: "सोलर सेवाएं",
      contactInfo: "संपर्क विवरण",
      allRightsReserved: "सर्वाधिकार सुरक्षित।",
      privacyPolicy: "गोपनीयता नीति",
      termsConditions: "नियम एवं शर्तें",
    },

    privacyTerms: {
      privacyTitle: "गोपनीयता नीति (Privacy Policy)",
      termsTitle: "नियम एवं शर्तें (Terms & Conditions)",
      lastUpdated: "अंतिम अद्यतन: अक्टूबर 2026",
    },
  },
};
