/**
 * =============================================================================
 * QUOTATION SYSTEM TRANSLATIONS (Hindi + English)
 * =============================================================================
 * Hindi is the DEFAULT language for this quotation system.
 * English is available via a toggle button.
 * =============================================================================
 */

export const quotationText = {
  // ─── Page & Login ─────────────────────────────────────────────────
  pageTitle: {
    en: "Solar Quotation System",
    hi: "सोलर कोटेशन सिस्टम",
  },
  pageSubtitle: {
    en: "Generate professional material specification quotations for clients",
    hi: "ग्राहकों के लिए प्रोफेशनल मटेरियल स्पेसिफिकेशन कोटेशन बनाएं",
  },
  loginTitle: {
    en: "Staff Login",
    hi: "स्टाफ लॉगिन",
  },
  loginSubtitle: {
    en: "Enter your credentials to access the quotation system",
    hi: "कोटेशन सिस्टम तक पहुँचने के लिए अपनी लॉगिन जानकारी दर्ज करें",
  },
  loginIdLabel: {
    en: "Login ID",
    hi: "लॉगिन आईडी",
  },
  loginIdPlaceholder: {
    en: "Enter login ID",
    hi: "लॉगिन आईडी दर्ज करें",
  },
  passwordLabel: {
    en: "Password",
    hi: "पासवर्ड",
  },
  passwordPlaceholder: {
    en: "Enter password",
    hi: "पासवर्ड दर्ज करें",
  },
  loginButton: {
    en: "Login",
    hi: "लॉगिन करें",
  },
  loggingIn: {
    en: "Logging in...",
    hi: "लॉगिन हो रहा है...",
  },
  loginError: {
    en: "Invalid login ID or password",
    hi: "गलत लॉगिन आईडी या पासवर्ड",
  },
  logout: {
    en: "Logout",
    hi: "लॉगआउट",
  },

  // ─── Language Toggle ──────────────────────────────────────────────
  switchToEnglish: {
    en: "English",
    hi: "English",
  },
  switchToHindi: {
    en: "हिंदी",
    hi: "हिंदी",
  },

  // ─── Step Labels ──────────────────────────────────────────────────
  step1Title: {
    en: "Select Solar Capacity",
    hi: "सोलर क्षमता चुनें",
  },
  step1Subtitle: {
    en: "Choose the system size and type for the client",
    hi: "ग्राहक के लिए सिस्टम का आकार और प्रकार चुनें",
  },
  step2Title: {
    en: "Material List (Auto-Generated)",
    hi: "मटेरियल सूची (ऑटो-जनरेटेड)",
  },
  step2Subtitle: {
    en: "Complete bill of materials based on selected capacity",
    hi: "चयनित क्षमता के आधार पर पूरी मटेरियल सूची",
  },
  step3Title: {
    en: "Customer Details",
    hi: "ग्राहक विवरण",
  },
  step3Subtitle: {
    en: "Enter customer information for the quotation",
    hi: "कोटेशन के लिए ग्राहक की जानकारी दर्ज करें",
  },
  step4Title: {
    en: "Quotation Preview",
    hi: "कोटेशन प्रीव्यू",
  },
  step4Subtitle: {
    en: "Review, download PDF or share on WhatsApp",
    hi: "समीक्षा करें, PDF डाउनलोड करें या WhatsApp पर भेजें",
  },

  // ─── Step 1: Capacity Selector ────────────────────────────────────
  capacityLabel: {
    en: "System Capacity",
    hi: "सिस्टम क्षमता",
  },
  customCapacity: {
    en: "Custom",
    hi: "कस्टम",
  },
  customCapacityPlaceholder: {
    en: "Enter kW (e.g. 7.5)",
    hi: "kW दर्ज करें (जैसे 7.5)",
  },
  systemType: {
    en: "System Type",
    hi: "सिस्टम प्रकार",
  },
  onGrid: {
    en: "On-Grid",
    hi: "ऑन-ग्रिड",
  },
  hybrid: {
    en: "Hybrid",
    hi: "हाइब्रिड",
  },
  offGrid: {
    en: "Off-Grid",
    hi: "ऑफ-ग्रिड",
  },
  onGridDesc: {
    en: "Grid-tied, no battery, net metering",
    hi: "ग्रिड से जुड़ा, बैटरी नहीं, नेट मीटरिंग",
  },
  hybridDesc: {
    en: "Grid + Battery backup",
    hi: "ग्रिड + बैटरी बैकअप",
  },
  offGridDesc: {
    en: "Standalone, battery powered",
    hi: "स्टैंडअलोन, बैटरी संचालित",
  },
  panelWattage: {
    en: "Panel Wattage",
    hi: "पैनल वॉटेज",
  },

  // ─── Step 2: Material List ────────────────────────────────────────
  materialListTitle: {
    en: "Bill of Materials",
    hi: "मटेरियल की सूची",
  },
  specification: {
    en: "Specification",
    hi: "स्पेसिफिकेशन",
  },
  qty: {
    en: "Qty",
    hi: "मात्रा",
  },
  details: {
    en: "Details",
    hi: "विवरण",
  },
  noPriceNote: {
    en: "PRICE NOT DISPLAYED — Material specification quotation only",
    hi: "मूल्य प्रदर्शित नहीं — केवल मटेरियल स्पेसिफिकेशन कोटेशन",
  },
  illustrativeNote: {
    en: "This is an illustrative preview, not a final engineering bill of materials. On-grid, hybrid, and off-grid systems may have different materials.",
    hi: "यह एक सांकेतिक प्रीव्यू है, अंतिम इंजीनियरिंग बिल ऑफ मटेरियल्स नहीं। ऑन-ग्रिड, हाइब्रिड और ऑफ-ग्रिड सिस्टम के मटेरियल अलग हो सकते हैं।",
  },

  // ─── Step 3: Customer Form ────────────────────────────────────────
  customerName: {
    en: "Customer Name",
    hi: "ग्राहक का नाम",
  },
  customerNamePlaceholder: {
    en: "Enter customer's full name",
    hi: "ग्राहक का पूरा नाम दर्ज करें",
  },
  customerMobile: {
    en: "Mobile Number",
    hi: "मोबाइल नंबर",
  },
  customerMobilePlaceholder: {
    en: "10-digit mobile number",
    hi: "10 अंकों का मोबाइल नंबर",
  },
  customerAddress: {
    en: "Address / Location",
    hi: "पता / स्थान",
  },
  customerAddressPlaceholder: {
    en: "Customer's installation address",
    hi: "ग्राहक का इंस्टालेशन पता",
  },
  propertyType: {
    en: "Property Type",
    hi: "प्रॉपर्टी का प्रकार",
  },
  residential: {
    en: "Residential",
    hi: "आवासीय",
  },
  commercial: {
    en: "Commercial",
    hi: "व्यावसायिक",
  },
  industrial: {
    en: "Industrial",
    hi: "औद्योगिक",
  },
  roofType: {
    en: "Roof Type",
    hi: "छत का प्रकार",
  },
  rcc: {
    en: "RCC / Concrete",
    hi: "RCC / कंक्रीट",
  },
  metalSheet: {
    en: "Metal Sheet / Tin",
    hi: "मेटल शीट / टिन",
  },
  tiled: {
    en: "Tiled / Sloped",
    hi: "टाइल / ढलान वाली",
  },
  notes: {
    en: "Additional Notes",
    hi: "अतिरिक्त नोट्स",
  },
  notesPlaceholder: {
    en: "Any special requirements or notes",
    hi: "कोई विशेष आवश्यकता या नोट्स",
  },

  // ─── Step 4: Preview & Actions ────────────────────────────────────
  downloadPdf: {
    en: "Download PDF",
    hi: "PDF डाउनलोड करें",
  },
  sendWhatsApp: {
    en: "Send via WhatsApp",
    hi: "WhatsApp पर भेजें",
  },
  newQuotation: {
    en: "New Quotation",
    hi: "नया कोटेशन",
  },
  quotationFor: {
    en: "Quotation For",
    hi: "कोटेशन: ",
  },
  systemSummary: {
    en: "System Summary",
    hi: "सिस्टम सारांश",
  },
  totalPanels: {
    en: "Total Panels",
    hi: "कुल पैनल",
  },
  dcCapacity: {
    en: "DC Capacity",
    hi: "DC क्षमता",
  },
  roofAreaRequired: {
    en: "Roof Area Required",
    hi: "आवश्यक छत क्षेत्र",
  },
  whatsappMobileLabel: {
    en: "Customer's WhatsApp Number",
    hi: "ग्राहक का WhatsApp नंबर",
  },
  whatsappMobilePlaceholder: {
    en: "Enter 10-digit mobile number",
    hi: "10 अंकों का मोबाइल नंबर दर्ज करें",
  },
  sendPdfWhatsApp: {
    en: "Open WhatsApp & Send PDF",
    hi: "WhatsApp खोलें और PDF भेजें",
  },
  pdfGenerated: {
    en: "PDF Generated Successfully!",
    hi: "PDF सफलतापूर्वक बनाया गया!",
  },

  // ─── Navigation Buttons ───────────────────────────────────────────
  next: {
    en: "Next",
    hi: "आगे बढ़ें",
  },
  previous: {
    en: "Previous",
    hi: "पीछे जाएं",
  },
  generateQuotation: {
    en: "Generate Quotation",
    hi: "कोटेशन बनाएं",
  },

  // ─── PDF Content ──────────────────────────────────────────────────
  pdfTitle: {
    en: "SOLAR SYSTEM MATERIAL SPECIFICATION QUOTATION",
    hi: "सोलर सिस्टम मटेरियल स्पेसिफिकेशन कोटेशन",
  },
  pdfSubtitle: {
    en: "Material Specification Only — No Price Mentioned",
    hi: "केवल मटेरियल स्पेसिफिकेशन — कोई मूल्य नहीं",
  },
  pdfCustomerDetails: {
    en: "CUSTOMER DETAILS",
    hi: "ग्राहक विवरण",
  },
  pdfMaterialList: {
    en: "MATERIAL SPECIFICATION LIST",
    hi: "मटेरियल स्पेसिफिकेशन सूची",
  },
  pdfDisclaimer: {
    en: "This is an illustrative material specification quotation, not a final engineering bill of materials. Actual quantities may vary based on site survey. No pricing is included in this document.",
    hi: "यह एक सांकेतिक मटेरियल स्पेसिफिकेशन कोटेशन है, अंतिम इंजीनियरिंग बिल ऑफ मटेरियल्स नहीं। वास्तविक मात्रा साइट सर्वे के आधार पर भिन्न हो सकती है। इस दस्तावेज़ में कोई मूल्य शामिल नहीं है।",
  },
};
