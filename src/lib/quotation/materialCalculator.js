/**
 * =============================================================================
 * SOLAR MATERIAL CALCULATOR
 * =============================================================================
 * Automatically generates a complete Bill of Materials (BoM) based on
 * selected solar system capacity (kW) and system type (on-grid/hybrid/off-grid).
 *
 * Rules:
 * - Panel count = ceil(capacity_kW * 1000 / panel_wattage)
 * - Inverter sized to match system capacity
 * - Cable lengths, MCBs, earthing scaled based on kW
 * - Configurable panel wattage (default 550W)
 * =============================================================================
 */

/**
 * Default panel wattage used for calculations
 */
const DEFAULT_PANEL_WATT = 550;

/**
 * Calculate total DC capacity based on panel count and wattage
 * @param {number} panelCount - Number of panels
 * @param {number} panelWatt - Wattage per panel
 * @returns {number} Total DC capacity in kWp
 */
function calcDcCapacity(panelCount, panelWatt) {
  return parseFloat(((panelCount * panelWatt) / 1000).toFixed(2));
}

/**
 * Determine number of MPPT strings based on system size
 * @param {number} capacityKw - System capacity in kW
 * @returns {number} Number of MPPT strings
 */
function calcStringCount(capacityKw) {
  if (capacityKw <= 3) return 1;
  if (capacityKw <= 6) return 2;
  if (capacityKw <= 12) return 3;
  return Math.ceil(capacityKw / 5);
}

/**
 * Determine inverter phase based on system capacity
 * @param {number} capacityKw - System capacity in kW
 * @returns {string} Phase type description
 */
function getInverterPhase(capacityKw) {
  if (capacityKw <= 5) return "Single Phase (230V)";
  return "Three Phase (415V)";
}

/**
 * Estimate DC cable length based on system size
 * @param {number} capacityKw - System capacity in kW
 * @returns {number} Estimated DC cable length in metres
 */
function estimateDcCableLength(capacityKw) {
  // ~15m base + 5m per kW
  return Math.ceil(15 + capacityKw * 5);
}

/**
 * Estimate AC cable length based on system size
 * @param {number} capacityKw - System capacity in kW
 * @returns {number} Estimated AC cable length in metres
 */
function estimateAcCableLength(capacityKw) {
  // ~10m base + 3m per kW
  return Math.ceil(10 + capacityKw * 3);
}

/**
 * Determine MCB/MCCB rating and quantity
 * @param {number} capacityKw - System capacity in kW
 * @returns {{ poles: number, ampere: number, quantity: number }}
 */
function getMcbSpec(capacityKw) {
  if (capacityKw <= 3) return { poles: 2, ampere: 20, quantity: 2 };
  if (capacityKw <= 5) return { poles: 2, ampere: 32, quantity: 2 };
  if (capacityKw <= 10) return { poles: 4, ampere: 40, quantity: 3 };
  return { poles: 4, ampere: 63, quantity: 4 };
}

/**
 * Determine DC isolator specification
 * @param {number} capacityKw - System capacity in kW
 * @returns {{ voltage: number, current: number, quantity: number }}
 */
function getDcIsolatorSpec(capacityKw) {
  if (capacityKw <= 5) return { voltage: 600, current: 25, quantity: 1 };
  if (capacityKw <= 10) return { voltage: 1000, current: 32, quantity: 2 };
  return { voltage: 1000, current: 63, quantity: Math.ceil(capacityKw / 10) + 1 };
}

/**
 * Determine SPD (Surge Protection Device) spec
 * @param {number} capacityKw - System capacity in kW
 * @returns {{ dcType: string, acType: string, quantity: number }}
 */
function getSpdSpec(capacityKw) {
  return {
    dcType: capacityKw <= 10 ? "Type II DC SPD (1000V)" : "Type I+II DC SPD (1000V)",
    acType: "Type II AC SPD (275V/440V)",
    quantity: capacityKw <= 5 ? 2 : capacityKw <= 10 ? 3 : 4,
  };
}

/**
 * Determine earthing requirements
 * @param {number} capacityKw - System capacity in kW
 * @returns {{ electrodes: number, cableLength: number, description: string }}
 */
function getEarthingSpec(capacityKw) {
  const electrodes = capacityKw <= 3 ? 1 : capacityKw <= 10 ? 2 : Math.ceil(capacityKw / 10) + 1;
  const cableLength = Math.ceil(10 + capacityKw * 2);
  return {
    electrodes,
    cableLength,
    description: `${electrodes} × Copper Bonded Electrode + ${cableLength}m GI Earthing Wire`,
  };
}

/**
 * Calculate MC4 connector pairs
 * @param {number} stringCount - Number of strings
 * @returns {number} Number of MC4 connector pairs
 */
function getMc4Pairs(stringCount) {
  return stringCount * 2 + 2; // 2 pairs per string + 2 spare
}

/**
 * =============================================================================
 * MAIN: Generate complete material list for a solar system
 * =============================================================================
 * @param {Object} params
 * @param {number} params.capacityKw - Selected system capacity in kW
 * @param {string} params.systemType - "on-grid" | "hybrid" | "off-grid"
 * @param {number} [params.panelWatt=550] - Panel wattage
 * @returns {Object[]} Array of material items with complete specifications
 */
export function generateMaterialList({
  capacityKw,
  systemType = "on-grid",
  panelWatt = DEFAULT_PANEL_WATT,
}) {
  // --- Core calculations ---
  const panelCount = Math.ceil((capacityKw * 1000) / panelWatt);
  const dcCapacity = calcDcCapacity(panelCount, panelWatt);
  const stringCount = calcStringCount(capacityKw);
  const inverterPhase = getInverterPhase(capacityKw);
  const dcCableLength = estimateDcCableLength(capacityKw);
  const acCableLength = estimateAcCableLength(capacityKw);
  const mcbSpec = getMcbSpec(capacityKw);
  const dcIsolator = getDcIsolatorSpec(capacityKw);
  const spdSpec = getSpdSpec(capacityKw);
  const earthingSpec = getEarthingSpec(capacityKw);
  const mc4Pairs = getMc4Pairs(stringCount);

  // --- System type label ---
  const systemTypeLabels = {
    "on-grid": { en: "On-Grid (Grid-Tied)", hi: "ऑन-ग्रिड (ग्रिड-टाइड)" },
    hybrid: { en: "Hybrid (Grid + Battery)", hi: "हाइब्रिड (ग्रिड + बैटरी)" },
    "off-grid": { en: "Off-Grid (Standalone)", hi: "ऑफ-ग्रिड (स्टैंडअलोन)" },
  };

  // --- Build material list ---
  const materials = [
    {
      id: "solar_panels",
      name: { en: "Solar PV Modules", hi: "सोलर पीवी मॉड्यूल" },
      specification: {
        en: `${panelWatt}W Mono PERC / TOPCon Tier-1`,
        hi: `${panelWatt}W मोनो PERC / TOPCon टियर-1`,
      },
      detail: {
        en: `${panelCount} units · Total ${dcCapacity} kWp DC capacity`,
        hi: `${panelCount} यूनिट · कुल ${dcCapacity} kWp DC क्षमता`,
      },
      quantity: `${panelCount} Nos.`,
      quantityHi: `${panelCount} नग`,
      icon: "solar_panel",
    },
    {
      id: "solar_inverter",
      name: { en: "Solar Inverter", hi: "सोलर इनवर्टर" },
      specification: {
        en: `${capacityKw} kW ${systemTypeLabels[systemType]?.en || "On-Grid"} · ${inverterPhase}`,
        hi: `${capacityKw} kW ${systemTypeLabels[systemType]?.hi || "ऑन-ग्रिड"} · ${inverterPhase}`,
      },
      detail: {
        en: `${capacityKw} kW nominal AC capacity, ${stringCount} MPPT, subject to design`,
        hi: `${capacityKw} kW नॉमिनल AC क्षमता, ${stringCount} MPPT, डिज़ाइन अनुसार`,
      },
      quantity: "1 No.",
      quantityHi: "1 नग",
      icon: "inverter",
    },
    {
      id: "mounting_structure",
      name: { en: "Mounting Structure", hi: "माउंटिंग स्ट्रक्चर" },
      specification: {
        en: "Hot-Dip Galvanized (HDG) / Aluminium Rail",
        hi: "हॉट-डिप गैल्वेनाइज्ड (HDG) / एल्यूमीनियम रेल",
      },
      detail: {
        en: "Roof type and panel layout ke according",
        hi: "छत के प्रकार और पैनल लेआउट के अनुसार",
      },
      quantity: "As required",
      quantityHi: "आवश्यकतानुसार",
      icon: "structure",
    },
    {
      id: "dc_cable",
      name: { en: "DC Solar Cable", hi: "DC सोलर केबल" },
      specification: {
        en: `4 sq.mm / 6 sq.mm TUV Certified, UV Resistant`,
        hi: `4 sq.mm / 6 sq.mm TUV प्रमाणित, UV प्रतिरोधी`,
      },
      detail: {
        en: `Estimated ~${dcCableLength} metres (as per site survey)`,
        hi: `अनुमानित ~${dcCableLength} मीटर (साइट सर्वे अनुसार)`,
      },
      quantity: `~${dcCableLength} m`,
      quantityHi: `~${dcCableLength} मी.`,
      icon: "cable",
    },
    {
      id: "ac_cable",
      name: { en: "AC Cable", hi: "AC केबल" },
      specification: {
        en: `${capacityKw <= 5 ? "2.5 / 4" : "6 / 10"} sq.mm Copper, PVC Armoured`,
        hi: `${capacityKw <= 5 ? "2.5 / 4" : "6 / 10"} sq.mm कॉपर, PVC आर्मर्ड`,
      },
      detail: {
        en: `Estimated ~${acCableLength} metres (inverter to distribution board)`,
        hi: `अनुमानित ~${acCableLength} मीटर (इनवर्टर से डिस्ट्रीब्यूशन बोर्ड तक)`,
      },
      quantity: `~${acCableLength} m`,
      quantityHi: `~${acCableLength} मी.`,
      icon: "cable",
    },
    {
      id: "dcdb",
      name: { en: "DCDB (DC Distribution Box)", hi: "DCDB (DC डिस्ट्रीब्यूशन बॉक्स)" },
      specification: {
        en: `IP65 Polycarbonate Enclosure, ${stringCount}-String Input`,
        hi: `IP65 पॉलीकार्बोनेट एनक्लोज़र, ${stringCount}-स्ट्रिंग इनपुट`,
      },
      detail: {
        en: "DC protection box with fuses and string capacity",
        hi: "फ्यूज़ और स्ट्रिंग क्षमता के साथ DC सुरक्षा बॉक्स",
      },
      quantity: "1 No.",
      quantityHi: "1 नग",
      icon: "protection",
    },
    {
      id: "acdb",
      name: { en: "ACDB (AC Distribution Box)", hi: "ACDB (AC डिस्ट्रीब्यूशन बॉक्स)" },
      specification: {
        en: "IP65 Enclosure with MCB and SPD",
        hi: "MCB और SPD के साथ IP65 एनक्लोज़र",
      },
      detail: {
        en: "AC protection box as per inverter design",
        hi: "इनवर्टर डिज़ाइन के अनुसार AC सुरक्षा बॉक्स",
      },
      quantity: "1 No.",
      quantityHi: "1 नग",
      icon: "protection",
    },
    {
      id: "mcb_mccb",
      name: { en: "MCB / MCCB", hi: "MCB / MCCB" },
      specification: {
        en: `${mcbSpec.poles}P, ${mcbSpec.ampere}A Rating`,
        hi: `${mcbSpec.poles}P, ${mcbSpec.ampere}A रेटिंग`,
      },
      detail: {
        en: `${mcbSpec.poles}-Pole, ${mcbSpec.ampere} Ampere Miniature Circuit Breaker`,
        hi: `${mcbSpec.poles}-पोल, ${mcbSpec.ampere} एम्पियर मिनिएचर सर्किट ब्रेकर`,
      },
      quantity: `${mcbSpec.quantity} Nos.`,
      quantityHi: `${mcbSpec.quantity} नग`,
      icon: "mcb",
    },
    {
      id: "dc_isolator",
      name: { en: "DC Isolator / Disconnect", hi: "DC आइसोलेटर / डिस्कनेक्ट" },
      specification: {
        en: `${dcIsolator.voltage}V DC, ${dcIsolator.current}A Rotary`,
        hi: `${dcIsolator.voltage}V DC, ${dcIsolator.current}A रोटरी`,
      },
      detail: {
        en: `DC disconnect switch for safe maintenance isolation`,
        hi: `सुरक्षित रखरखाव के लिए DC डिस्कनेक्ट स्विच`,
      },
      quantity: `${dcIsolator.quantity} Nos.`,
      quantityHi: `${dcIsolator.quantity} नग`,
      icon: "isolator",
    },
    {
      id: "spd",
      name: { en: "SPD (Surge Protection)", hi: "SPD (सर्ज प्रोटेक्शन)" },
      specification: {
        en: `DC: ${spdSpec.dcType} · AC: ${spdSpec.acType}`,
        hi: `DC: ${spdSpec.dcType} · AC: ${spdSpec.acType}`,
      },
      detail: {
        en: "Lightning and surge protection for DC and AC side",
        hi: "DC और AC साइड के लिए लाइटनिंग और सर्ज प्रोटेक्शन",
      },
      quantity: `${spdSpec.quantity} Nos.`,
      quantityHi: `${spdSpec.quantity} नग`,
      icon: "spd",
    },
    {
      id: "earthing",
      name: { en: "Earthing System", hi: "अर्थिंग सिस्टम" },
      specification: {
        en: "Copper Bonded Electrode + Chemical Earthing Compound",
        hi: "कॉपर बॉन्डेड इलेक्ट्रोड + केमिकल अर्थिंग कम्पाउंड",
      },
      detail: {
        en: earthingSpec.description,
        hi: `${earthingSpec.electrodes} × कॉपर बॉन्डेड इलेक्ट्रोड + ${earthingSpec.cableLength}m GI अर्थिंग वायर`,
      },
      quantity: `${earthingSpec.electrodes} Sets`,
      quantityHi: `${earthingSpec.electrodes} सेट`,
      icon: "earthing",
    },
    {
      id: "mc4_connectors",
      name: { en: "MC4 Connectors", hi: "MC4 कनेक्टर" },
      specification: {
        en: "IP67 Waterproof, Compatible Connector Pairs",
        hi: "IP67 वाटरप्रूफ, संगत कनेक्टर जोड़े",
      },
      detail: {
        en: `${mc4Pairs} pairs for ${stringCount} string(s) configuration`,
        hi: `${stringCount} स्ट्रिंग कॉन्फिगरेशन के लिए ${mc4Pairs} जोड़े`,
      },
      quantity: `${mc4Pairs} Pairs`,
      quantityHi: `${mc4Pairs} जोड़े`,
      icon: "connector",
    },
    {
      id: "conduit_accessories",
      name: { en: "Conduit & Accessories", hi: "कॉन्ड्यूट और सहायक सामग्री" },
      specification: {
        en: "PVC/HDPE Conduit Pipe, Cable Clips, Lugs, Glands, Fasteners",
        hi: "PVC/HDPE कॉन्ड्यूट पाइप, केबल क्लिप, लग्स, ग्लैंड्स, फास्टनर",
      },
      detail: {
        en: "Final quantities as per site survey and installation design",
        hi: "अंतिम मात्रा साइट सर्वे और इंस्टालेशन डिज़ाइन अनुसार",
      },
      quantity: "As designed",
      quantityHi: "डिज़ाइन अनुसार",
      icon: "accessories",
    },
    {
      id: "installation",
      name: { en: "Installation & Commissioning", hi: "इंस्टालेशन और कमीशनिंग" },
      specification: {
        en: "Labour, Mounting, Wiring, Testing & Commissioning",
        hi: "श्रम, माउंटिंग, वायरिंग, टेस्टिंग और कमीशनिंग",
      },
      detail: {
        en: "Complete turnkey installation with safety compliance",
        hi: "सुरक्षा अनुपालन के साथ पूर्ण टर्नकी इंस्टालेशन",
      },
      quantity: "1 Job",
      quantityHi: "1 कार्य",
      icon: "installation",
    },
  ];

  // --- Add battery for hybrid/off-grid systems ---
  if (systemType === "hybrid" || systemType === "off-grid") {
    const batteryCapacity = capacityKw <= 3 ? "5 kWh" : capacityKw <= 5 ? "10 kWh" : `${Math.ceil(capacityKw * 2)} kWh`;
    materials.splice(2, 0, {
      id: "battery_storage",
      name: { en: "Battery Storage (LiFePO4)", hi: "बैटरी स्टोरेज (LiFePO4)" },
      specification: {
        en: `${batteryCapacity} Lithium Iron Phosphate, Wall/Rack Mount`,
        hi: `${batteryCapacity} लिथियम आयरन फॉस्फेट, वॉल/रैक माउंट`,
      },
      detail: {
        en: `${batteryCapacity} deep-cycle battery bank with BMS protection`,
        hi: `BMS सुरक्षा के साथ ${batteryCapacity} डीप-साइकिल बैटरी बैंक`,
      },
      quantity: "1 Set",
      quantityHi: "1 सेट",
      icon: "battery",
    });
  }

  return materials;
}

/**
 * Get system summary info for display
 * @param {Object} params
 * @param {number} params.capacityKw - System capacity in kW
 * @param {string} params.systemType - System type
 * @param {number} [params.panelWatt=550] - Panel wattage
 * @returns {Object} Summary information
 */
export function getSystemSummary({ capacityKw, systemType = "on-grid", panelWatt = DEFAULT_PANEL_WATT }) {
  const panelCount = Math.ceil((capacityKw * 1000) / panelWatt);
  const dcCapacity = calcDcCapacity(panelCount, panelWatt);
  const roofArea = Math.ceil(panelCount * 22); // ~22 sq.ft per panel

  return {
    panelCount,
    dcCapacity,
    panelWatt,
    roofArea,
    inverterPhase: getInverterPhase(capacityKw),
    stringCount: calcStringCount(capacityKw),
    systemType,
    systemTypeLabel: {
      "on-grid": { en: "On-Grid (Grid-Tied)", hi: "ऑन-ग्रिड (ग्रिड-टाइड)" },
      hybrid: { en: "Hybrid (Grid + Battery)", hi: "हाइब्रिड (ग्रिड + बैटरी)" },
      "off-grid": { en: "Off-Grid (Standalone)", hi: "ऑफ-ग्रिड (स्टैंडअलोन)" },
    }[systemType] || { en: "On-Grid", hi: "ऑन-ग्रिड" },
  };
}
