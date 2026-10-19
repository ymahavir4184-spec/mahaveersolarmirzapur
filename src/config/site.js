/**
 * Master Site Configuration for Solar Website Platform
 * All client-specific branding, copy, contact details, features, and calculator
 * parameters are driven exclusively by this file.
 */

export const siteConfig = {
  company: {
    name: "AuraSun Solar Solutions",
    tagline: {
      en: "Clean Solar Energy for Homes, Businesses, and Industry",
      hi: "घरों, व्यवसायों और उद्योगों के लिए स्वच्छ सौर ऊर्जा",
    },
    logo: "/client-assets/logo.svg",
    favicon: "/client-assets/favicon.ico",
    phone: "+919876543210",
    displayPhone: "+91 98765 43210",
    whatsapp: "+919876543210",
    email: "contact@aurasunsolar.com",
    address: "Plot 42, Sector 18, Udyog Vihar, Gurugram, Haryana 122015, India",
    mapsUrl: "https://maps.google.com/?q=Udyog+Vihar+Gurugram+Solar",
    establishedYear: 2018,
  },

  branding: {
    primary: "#0062FF",
    primaryDark: "#004ECC",
    secondary: "#0EA5E9",
    text: "#0F172A",
    background: "#FFFFFF",
    ice: "#F0F7FF",
    navy: "#0B192C",
    muted: "#64748B",
    card: "#FFFFFF",
    border: "#E2E8F0",
  },

  assets: {
    logo: "/client-assets/logo.svg",
    favicon: "/client-assets/favicon.ico",
    hero: "/client-assets/hero.webp",
    about: "/client-assets/about.webp",
    residential: "/client-assets/residential.webp",
    commercial: "/client-assets/commercial.webp",
    industrial: "/client-assets/industrial.webp",
    inverter: "/client-assets/inverter.webp",
    battery: "/client-assets/battery.webp",
    project01: "/client-assets/project-01.webp",
    project02: "/client-assets/project-02.webp",
    project03: "/client-assets/project-03.webp",
    fallback: "/client-assets/fallback.webp",
  },

  socialLinks: {
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    twitter: "",
  },

  services: {
    residential: {
      slug: "residential",
      title: {
        en: "Residential Rooftop Solar",
        hi: "आवासीय रूफटॉप सोलर",
      },
      summary: {
        en: "Tailored on-grid and hybrid solar installations for independent houses, villas, and housing societies with maximum government subsidy assistance.",
        hi: "स्वतंत्र घरों, विला और हाउसिंग सोसाइटियों के लिए कस्टमाइज्ड ऑन-ग्रिड और हाइब्रिड सोलर सिस्टम, सरकारी सब्सिडी सहायता के साथ।",
      },
      benefits: {
        en: [
          "Slash monthly domestic electricity bills by up to 90%",
          "Seamless PM Surya Ghar Muft Bijli Yojana subsidy processing",
          "25-year performance warranty on Tier-1 Mono PERC solar modules",
          "Smartphone monitoring app for real-time daily generation tracking",
        ],
        hi: [
          "मासिक घरेलू बिजली बिलों में 90% तक की कमी करें",
          "पीएम सूर्य घर मुफ्त बिजली योजना सब्सिडी में पूर्ण सहायता",
          "टियर-1 मोनो पीईआरसी सोलर मॉड्यूल्स पर 25 वर्ष की प्रदर्शन वारंटी",
          "दैनिक सौर उत्पादन देखने के लिए मोबाइल ऐप",
        ],
      },
      process: {
        en: [
          "Complimentary roof shadow assessment & load analysis",
          "3D engineered structural design & shadow analysis",
          "Discom net-metering liaison and paperwork clearance",
          "Precision mounting, rapid commissioning & app handover",
        ],
        hi: [
          "छत का निःशुल्क शैडो और लोड विश्लेषण",
          "3D स्ट्रक्चरल डिजाइन और छाया विश्लेषण",
          "डिस्कॉम नेट-मीटरिंग अनुमति और कागजी कार्रवाई",
          "सुरक्षित इंस्टॉलेशन, त्वरित कमीशनिंग और ऐप हैंडओवर",
        ],
      },
      image: "/client-assets/residential.webp",
    },

    commercial: {
      slug: "commercial",
      title: {
        en: "Commercial & Corporate Solar",
        hi: "व्यावसायिक और कॉर्पोरेट सोलर",
      },
      summary: {
        en: "High-yield commercial rooftop solar plants designed for offices, hospitals, schools, and malls with rapid payback and accelerated depreciation benefits.",
        hi: "कार्यालयों, अस्पतालों, स्कूलों और मॉल के लिए उच्च क्षमता वाले सोलर प्लांट, त्वरित पेबैक और त्वरित मूल्यह्रास लाभ के साथ।",
      },
      benefits: {
        en: [
          "Shield your business against rising commercial grid tariffs",
          "Claim up to 40% accelerated depreciation tax savings in year one",
          "Achieve environmental ESG compliance & green certification",
          "Zero operational downtime during installation",
        ],
        hi: [
          "व्यावसायिक बिजली की बढ़ती दरों से अपने व्यवसाय को सुरक्षित करें",
          "पहले वर्ष में 40% तक त्वरित मूल्यह्रास (AD) कर लाभ प्राप्त करें",
          "पर्यावरणीय ESG अनुपालन और ग्रीन बिल्डिंग प्रमाणन",
          "स्थापना कार्य के दौरान आपके व्यवसाय में कोई व्यवधान नहीं",
        ],
      },
      process: {
        en: [
          "Energy tariff auditing & HT/LT connection review",
          "Structural load-bearing certification by certified engineers",
          "High-capacity string or central inverter engineering",
          "Testing, net metering commissioning and SCADA integration",
        ],
        hi: [
          "ऊर्जा खपत ऑडिट और एचटी/एलटी कनेक्शन समीक्षा",
          "प्रमाणित इंजीनियरों द्वारा संरचनात्मक मजबूती परीक्षण",
          "उच्च क्षमता स्ट्रिंग इनवर्टर इंजीनियरिंग",
          "परीक्षण, नेट मीटरिंग और SCADA सिस्टम इंटीग्रेशन",
        ],
      },
      image: "/client-assets/commercial.webp",
    },

    industrial: {
      slug: "industrial",
      title: {
        en: "Industrial Scale Solar EPC",
        hi: "औद्योगिक स्केल सोलर ईपीसी",
      },
      summary: {
        en: "Megawatt-scale rooftop and ground-mount solar infrastructure engineered for manufacturing plants, warehouses, cold storage, and heavy industries.",
        hi: "विनिर्माण संयंत्रों, गोदामों, कोल्ड स्टोरेज और भारी उद्योगों के लिए मेगावाट-स्केल रूफटॉप और ग्राउंड-माउंट सोलर इंफ्रास्ट्रक्चर।",
      },
      benefits: {
        en: [
          "Lock in low-cost clean electricity for 25+ years",
          "High-tensile hot-dip galvanized mounting structures",
          "Tier-1 TOPCon bifacial modules for optimum generation per sq. ft.",
          "Custom CAPEX and OPEX/RESCO financing guidance",
        ],
        hi: [
          "25+ वर्षों के लिए न्यूनतम लागत वाली स्वच्छ बिजली सुरक्षित करें",
          "गैल्वेनाइज्ड हाई-टेंसिल मजबूत माउंटिंग स्ट्रक्चर",
          "प्रति वर्ग फुट अधिकतम उत्पादन हेतु टियर-1 TOPCon बायफेशियल मॉड्यूल",
          "कैपेक्स (CAPEX) और रेस्को (RESCO) फाइनेंसिंग मार्गदर्शन",
        ],
      },
      process: {
        en: [
          "Detailed Project Report (DPR) & yield simulation (PVSyst)",
          "State CEIG/CEA approvals and discom interconnection approvals",
          "Heavy-duty civil foundations and hot-dip galvanized mounting",
          "Automated cleaning system integration & ongoing O&M support",
        ],
        hi: [
          "विस्तृत परियोजना रिपोर्ट (DPR) और PVSyst सिमुलेशन",
          "राज्य CEIG/CEA अनुमोदन और डिस्कॉम ग्रिड इंटरकनेक्शन",
          "मजबूत सिविल फाउंडेशन और हॉट-डिप गैल्वेनाइज्ड माउंटिंग",
          "ऑटोमेटेड क्लीनिंग सिस्टम और दीर्घकालिक O&M रखरखाव",
        ],
      },
      image: "/client-assets/industrial.webp",
    },
  },

  productCategories: [
    {
      id: "panels",
      name: {
        en: "Solar PV Modules",
        hi: "सोलर पीवी मॉड्यूल्स",
      },
      description: {
        en: "High-efficiency Mono PERC, TOPCon and Bifacial solar panels engineered for superior performance under Indian temperature conditions.",
        hi: "भारतीय तापमान स्थितियों में अधिकतम बिजली उत्पादन के लिए उच्च दक्षता वाले मोनो पीईआरसी और TOPCon सोलर पैनल।",
      },
      specs: ["540Wp - 580Wp rating", "Up to 22.8% module efficiency", "25-year linear power warranty"],
      image: "/client-assets/hero.webp",
    },
    {
      id: "inverters",
      name: {
        en: "Solar Inverters",
        hi: "सोलर इनवर्टर",
      },
      description: {
        en: "Smart grid-tie and hybrid string inverters featuring dual MPPTs, IP65 weatherproofing, and built-in Wi-Fi monitoring.",
        hi: "स्मार्ट ऑन-ग्रिड और हाइब्रिड स्ट्रिंग इनवर्टर, डुअल MPPT, IP65 सुरक्षा और इन-बिल्ट वाई-फाई मॉनिटरिंग के साथ।",
      },
      specs: ["Single-phase & Three-phase", "98.6% peak efficiency", "IP65 outdoor rating", "Cloud app tracking"],
      image: "/client-assets/inverter.webp",
    },
    {
      id: "batteries",
      name: {
        en: "Energy Storage Batteries",
        hi: "एनर्जी स्टोरेज बैटरियां",
      },
      description: {
        en: "Deep-cycle Lithium Iron Phosphate (LiFePO4) solar battery banks offering 6000+ cycles and reliable backup during outages.",
        hi: "डीप-साइकिल लिथियम आयरन फॉस्फेट (LiFePO4) बैटरी बैंक, 6000+ चक्र और निर्बाध बिजली बैकअप के साथ।",
      },
      specs: ["LiFePO4 chemistry", "6000+ cycles at 80% DoD", "Wall-mount & rack-mount designs", "BMS protection"],
      image: "/client-assets/battery.webp",
    },
    {
      id: "structures",
      name: {
        en: "Mounting Structures",
        hi: "माउंटिंग स्ट्रक्चर",
      },
      description: {
        en: "Hot-dip galvanized sheet metal and anodized aluminium structures tested to withstand wind speeds up to 170 km/h.",
        hi: "हॉट-डिप गैल्वेनाइज्ड और एनोडाइज्ड एल्यूमीनियम स्ट्रक्चर, जो 170 किमी/घंटे तक की हवा का सामना कर सकते हैं।",
      },
      specs: ["Hot-dip galvanized (80+ microns)", "Wind load rated up to 170 km/h", "Elevated rooftop walkways available"],
      image: "/client-assets/commercial.webp",
    },
    {
      id: "accessories",
      name: {
        en: "Protection & Balance of System",
        hi: "सुरक्षा और बीओएस सहायक उपकरण",
      },
      description: {
        en: "ACDB, DCDB, copper earthing electrodes, chemical earthing compounds, SPD surge arresters, and UV-resistant solar cables.",
        hi: "एसीडीबी, डीसीडीबी, कॉपर अर्थिंग, एसपीडी सर्ज प्रोटेक्टर और यूवी-प्रतिरोधी सोलर केबल।",
      },
      specs: ["IP65 poly-carbonate enclosures", "Type-2 AC/DC surge protection", "TUV certified DC copper cables"],
      image: "/client-assets/industrial.webp",
    },
  ],

  projects: [
    {
      slug: "50kw-gurugram-cyber-city",
      title: {
        en: "50 kW Commercial Rooftop Installation",
        hi: "50 kW व्यावसायिक रूफटॉप सोलर संयंत्र",
      },
      location: {
        en: "Cyber City, Gurugram, Haryana",
        hi: "साइबर सिटी, गुरुग्राम, हरियाणा",
      },
      capacityKw: 50,
      type: "commercial",
      image: "/client-assets/project-01.webp",
      summary: {
        en: "Rooftop solar system for a commercial corporate park generating over 72,000 units of clean electricity annually.",
        hi: "कॉर्पोरेट पार्क के लिए स्थापित रूफटॉप सोलर सिस्टम, जो प्रति वर्ष 72,000 यूनिट से अधिक स्वच्छ बिजली पैदा करता है।",
      },
      details: {
        en: "Installed using Tier-1 550Wp Mono PERC modules paired with 50 kW European grid-tie inverter. The project provides complete offset for common area daytime lighting and centralized HVAC cooling loads, delivering a 3.2-year return on investment.",
        hi: "टियर-1 550Wp मोनो पीईआरसी मॉड्यूल और 50 kW यूरोपीय ग्रिड-टाई इनवर्टर के साथ स्थापित। यह प्रोजेक्ट सामान्य क्षेत्र की लाइटिंग और एयर कंडीशनिंग लोड को पूरी तरह सौर ऊर्जा पर चलाता है, जिससे 3.2 वर्षों में पूरी लागत वसूल होती है।",
      },
    },
    {
      slug: "15kw-luxury-villa-gurugram",
      title: {
        en: "15 kW On-Grid Villa Rooftop Solar",
        hi: "15 kW ऑन-ग्रिड विला रूफटॉप सोलर",
      },
      location: {
        en: "Golf Course Road, Gurugram, Haryana",
        hi: "गोल्फ कोर्स रोड, गुरुग्राम, हरियाणा",
      },
      capacityKw: 15,
      type: "residential",
      image: "/client-assets/project-02.webp",
      summary: {
        en: "High-aesthetic elevated pergola rooftop installation yielding zero grid bills for a multi-story residence.",
        hi: "बहुमंजिला निवास के लिए स्थापित आकर्षक पेरगोला रूफटॉप सोलर, जिससे ग्रिड बिजली का बिल शून्य हो गया।",
      },
      details: {
        en: "Engineered on an elevated hot-dip galvanized frame allowing the homeowner full usable terrace area. Integrated with 15 kW three-phase grid-tied inverter with smart Wi-Fi monitoring and complete net-metering synchronization with DHBVN.",
        hi: "ऊंचे गैल्वेनाइज्ड फ्रेम पर तैयार किया गया ताकि छत की खाली जगह का पूरा उपयोग किया जा सके। 15 kW थ्री-फेज इनवर्टर और DHBVN के साथ पूर्ण नेट-मीटरिंग कनेक्टिविटी।",
      },
    },
    {
      slug: "250kw-industrial-plant-manesar",
      title: {
        en: "250 kW Industrial Manufacturing Solar EPC",
        hi: "250 kW औद्योगिक विनिर्माण सोलर ईपीसी",
      },
      location: {
        en: "IMT Manesar, Haryana",
        hi: "आईएमटी मानेसर, हरियाणा",
      },
      capacityKw: 250,
      type: "industrial",
      image: "/client-assets/project-03.webp",
      summary: {
        en: "High-voltage industrial rooftop plant generating approximately 360,000 kWh annually for auto-component fabrication.",
        hi: "ऑटो-पार्ट्स निर्माण संयंत्र के लिए प्रति वर्ष लगभग 3,60,000 kWh बिजली पैदा करने वाला उच्च-क्षमता सोलर प्लांट।",
      },
      details: {
        en: "Built on corrugated metal shed rooftops using non-penetrating standing seam aluminium clamps to preserve roof waterproof warranty. Features 4x60kW multi-MPPT inverters with real-time SCADA reporting.",
        hi: "छत की वाटरप्रूफिंग सुरक्षित रखने हेतु नॉन-पेनेट्रेटिंग क्लैम्प्स के साथ स्थापित। रियल-टाइम SCADA रिपोर्टिंग के साथ 4x60kW मल्टी-MPPT इनवर्टर।",
      },
    },
  ],

  // Testimonials: Empty by default. No fake reviews!
  testimonials: [],

  businessHours: {
    en: "Mon - Sat: 9:00 AM - 7:00 PM (IST)",
    hi: "सोमवार - शनिवार: सुबह 9:00 बजे - शाम 7:00 बजे",
  },

  // Trust stats: Flagged isPlaceholder. Hidden automatically when showPlaceholders is false.
  trustStats: {
    isPlaceholder: true,
    stats: [
      {
        value: "12+",
        label: { en: "MW Installed", hi: "मेगावाट क्षमता स्थापित" },
      },
      {
        value: "450+",
        label: { en: "Rooftops Energized", hi: "सफल रूफटॉप प्रोजेक्ट्स" },
      },
      {
        value: "18+",
        label: { en: "Cities Covered", hi: "शहरों में सेवाएं" },
      },
      {
        value: "15,000+",
        label: { en: "Tons CO₂ Prevented", hi: "टन CO₂ प्रदूषण से बचाव" },
      },
    ],
  },

  faqs: [
    {
      question: {
        en: "How much can I reduce my monthly electricity bill with solar?",
        hi: "सोलर लगाने से मेरा मासिक बिजली बिल कितना कम हो सकता है?",
      },
      answer: {
        en: "A properly sized grid-tied solar system typically offsets 80% to 90% of your current monthly electricity bill. Through net metering, surplus electricity exported to the grid during the day is credited against your nighttime usage.",
        hi: "सही क्षमता का ऑन-ग्रिड सोलर सिस्टम आपके मासिक बिजली बिल को 80% से 90% तक कम कर देता है। नेट मीटरिंग के माध्यम से, दिन में ग्रिड को भेजी गई अतिरिक्त बिजली रात की खपत में समायोजित हो जाती है।",
      },
    },
    {
      question: {
        en: "What government subsidies are currently available for residential solar in India?",
        hi: "भारत में आवासीय सोलर के लिए वर्तमान में क्या सरकारी सब्सिडी उपलब्ध है?",
      },
      answer: {
        en: "Under the PM Surya Ghar: Muft Bijli Yojana, residential consumers receive direct central financial assistance (subsidy) up to ₹78,000 for rooftop systems up to 3 kW capacity. We handle the complete registration and documentation on the national portal.",
        hi: "पीएम सूर्य घर: मुफ्त बिजली योजना के तहत, 3 kW तक के रूफटॉप सिस्टम पर आवासीय उपभोक्ताओं को ₹78,000 तक की प्रत्यक्ष केंद्रीय सब्सिडी मिलती है। हम नेशनल पोर्टल पर पूरा पंजीकरण और दस्तावेज कार्य संभालते हैं।",
      },
    },
    {
      question: {
        en: "What is net metering and how long does discom approval take?",
        hi: "नेट मीटरिंग क्या है और डिस्कॉम अनुमोदन में कितना समय लगता है?",
      },
      answer: {
        en: "Net metering uses a bi-directional electricity meter that records both electricity drawn from the grid and solar power exported to the grid. In most states, discom approval and meter commissioning take between 3 to 6 weeks from application submission.",
        hi: "नेट मीटरिंग में एक बाई-डायरेक्शनल मीटर लगाया जाता है जो ग्रिड से ली गई और ग्रिड को भेजी गई दोनों बिजली को रिकॉर्ड करता है। अधिकांश राज्यों में डिस्कॉम अनुमोदन और मीटर लगाने में आवेदन के 3 से 6 सप्ताह का समय लगता है।",
      },
    },
    {
      question: {
        en: "What warranty and lifespan do solar panels have?",
        hi: "सोलर पैनलों की वारंटी और जीवनकाल कितना होता है?",
      },
      answer: {
        en: "Our Tier-1 solar modules come with a 25-year linear power output warranty and a 10-12 year product defect warranty. High-quality panels continue generating useful clean power for 30 years or more with minimal maintenance.",
        hi: "हमारे टियर-1 सोलर मॉड्यूल्स 25 वर्ष की लीनियर पावर आउटपुट वारंटी और 10-12 वर्ष की उत्पाद वारंटी के साथ आते हैं। न्यूनतम रखरखाव के साथ ये पैनल 30 वर्षों से अधिक समय तक कुशलतापूर्वक बिजली बनाते रहते हैं।",
      },
    },
    {
      question: {
        en: "How much roof space is required to install a 1 kW solar system?",
        hi: "1 kW सोलर सिस्टम लगाने के लिए कितनी छत की जगह चाहिए?",
      },
      answer: {
        en: "A 1 kW solar plant requires approximately 80 to 100 square feet of shadow-free rooftop area. For a standard 3 kW residential system, about 250 to 300 square feet of clear roof area is ideal.",
        hi: "1 kW सोलर प्लांट के लिए लगभग 80 से 100 वर्ग फुट छाया-मुक्त छत की आवश्यकता होती है। सामान्य 3 kW आवासीय प्रणाली के लिए लगभग 250 से 300 वर्ग फुट खुली छत पर्याप्त है।",
      },
    },
    {
      question: {
        en: "Will solar work during rainy days, winter or cloud cover?",
        hi: "क्या बारिश के दिनों, सर्दियों या बादलों में सोलर काम करता है?",
      },
      answer: {
        en: "Yes. Modern Mono PERC and TOPCon panels absorb diffused sunlight and continue generating electricity even on cloudy or overcast days, though daily generation may be 25% to 40% of peak sunny day yield.",
        hi: "हाँ। आधुनिक मोनो पीईआरसी और TOPCon पैनल बादलों और धुंध में भी फैली हुई धूप से बिजली बनाते रहते हैं, हालांकि उत्पादन धूप वाले दिन की तुलना में 25% से 40% रह सकता है।",
      },
    },
  ],

  seo: {
    title: "AuraSun Solar | Leading Rooftop Solar EPC & Clean Energy Solutions",
    description: "High-efficiency residential, commercial and industrial solar installations with end-to-end net metering and PM Surya Ghar subsidy assistance.",
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://aurasunsolar.com",
    ogImage: "/client-assets/hero.webp",
    keywords: [
      "solar power company",
      "rooftop solar panels",
      "PM Surya Ghar subsidy",
      "commercial solar plant",
      "industrial solar EPC",
      "solar net metering",
      "Gurugram solar company",
      "solar inverter battery",
    ],
  },

  features: {
    languageSelection: true,
    leadPopup: true,
    whatsappButton: true,
    loginButton: false,
    savingsCalculator: true,
    testimonials: true,
    projects: true,
    showPlaceholders: false,
  },

  login: {
    url: "",
    label: {
      en: "Client Portal",
      hi: "ग्राहक पोर्टल",
    },
  },

  leadPopup: {
    delaySeconds: 4,
    categories: [
      "Residential Rooftop (1 kW - 10 kW)",
      "Commercial Solar (10 kW - 100 kW)",
      "Industrial EPC (100 kW+)",
      "Battery Storage & Hybrid Solar",
      "Solar Operation & Maintenance",
    ],
    cooldownHours: 24,
  },

  calculator: {
    defaultTariffPerUnit: 8.5,
    costPerKw: 55000,
    generationPerKwPerDay: 4.2,
    showSubsidyNote: true,
    officialSubsidyUrl: "https://pmsuryaghar.gov.in",
  },

  footer: {
    copyright: "AuraSun Solar Solutions Pvt. Ltd.",
    licenseNote: "Registered Solar EPC Contractor",
    disclaimer: {
      en: "Solar energy generation figures, cost savings, and payback periods depend on local solar irradiance, rooftop orientation, grid stability, and applicable utility tariff structures. Calculations provided on this website are estimates.",
      hi: "सौर ऊर्जा उत्पादन के आंकड़े, लागत बचत और अदायगी की अवधि स्थानीय सौर विकिरण, छत की दिशा, ग्रिड स्थिरता और लागू बिजली दरों पर निर्भर करती है। इस वेबसाइट पर दिए गए परिणाम अनुमानित हैं।",
    },
  },
};
