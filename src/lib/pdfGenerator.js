import { jsPDF } from 'jspdf';
import { siteConfig } from '../config/site.js';

/**
 * Generate a modern, branded Solar Quotation PDF
 * Includes official header, company branding, client details,
 * system technical specs, financial & subsidy feasibility,
 * environmental impact, warranty, and digital company stamp.
 */
export function generateSolarQuotationPdf({
  clientName = "Valued Customer",
  clientPhone = "",
  city = "Gurugram, Haryana",
  propertyType = "residential",
  billValue = 6500,
  unitsValue = 750,
  mode = "bill",
  recommendedKw = 5.0,
  estMonthlyGeneration = 630,
  estAnnualSavings = 64260,
  estPaybackYears = "3.4",
  estSystemCost = 275000,
  subsidyAmount = 78000,
  netCost = 197000,
  panelsCount = 9,
  roofAreaSqFt = 450,
  co2SavingsTonnes = "6.0",
  treesEquivalent = 100,
  proposalId = null,
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const validUntilStr = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const propId = proposalId || `AS-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  // Page dimensions
  const pageWidth = 210;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  // Colors
  const navy = [11, 25, 44];       // #0B192C
  const blue = [0, 98, 255];       // #0062FF
  const skyBlue = [14, 165, 233];  // #0EA5E9
  const slateDark = [30, 41, 59];  // #1E293B
  const slateMuted = [100, 116, 139]; // #64748B
  const bgLight = [248, 250, 252]; // #F8FAFC
  const borderLight = [226, 232, 240]; // #E2E8F0
  const emerald = [16, 185, 129];  // #10B981
  const amber = [245, 158, 11];    // #F59E0B
  const stampRed = [190, 24, 24];  // Official Stamp Red

  // ----------------------------------------------------
  // 1. TOP HEADER BANNER (Navy)
  // ----------------------------------------------------
  doc.setFillColor(...navy);
  doc.rect(0, 0, pageWidth, 36, 'F');

  // Decorative blue gradient bar
  doc.setFillColor(...skyBlue);
  doc.rect(0, 36, pageWidth, 1.8, 'F');

  // Vector Logo Icon (Sun + Solar Grid)
  const logoX = margin;
  const logoY = 9;
  
  // Sun circle
  doc.setFillColor(...amber);
  doc.circle(logoX + 7, logoY + 7, 6, 'F');

  // Solar rays / PV box
  doc.setFillColor(...blue);
  doc.roundedRect(logoX + 2, logoY + 2, 10, 10, 1.5, 1.5, 'F');
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.4);
  doc.line(logoX + 7, logoY + 2, logoX + 7, logoY + 12);
  doc.line(logoX + 2, logoY + 7, logoX + 12, logoY + 7);

  // Company Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(siteConfig.company.name.toUpperCase(), logoX + 16, logoY + 6);

  // Tagline
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...skyBlue);
  doc.text("MNRE Channel Partner | High-Efficiency Rooftop Solar EPC", logoX + 16, logoY + 11);

  // Contact Info on Header Right
  doc.setFontSize(7.5);
  doc.setTextColor(220, 230, 245);
  doc.text(`Phone: ${siteConfig.company.displayPhone}`, pageWidth - margin, logoY + 4, { align: 'right' });
  doc.text(`Email: ${siteConfig.company.email}`, pageWidth - margin, logoY + 8.5, { align: 'right' });
  doc.text(`Web: ${siteConfig.seo.baseUrl.replace('https://', '')}`, pageWidth - margin, logoY + 13, { align: 'right' });

  // ----------------------------------------------------
  // 2. PROPOSAL METADATA STRIP
  // ----------------------------------------------------
  let curY = 41;
  doc.setFillColor(...bgLight);
  doc.setDrawColor(...borderLight);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, curY, contentWidth, 9, 1.5, 1.5, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...blue);
  doc.text(`PROPOSAL NO: ${propId}`, margin + 4, curY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateDark);
  doc.text(`DATE: ${dateStr}`, margin + 85, curY + 6);
  doc.text(`VALID UNTIL: ${validUntilStr}`, pageWidth - margin - 4, curY + 6, { align: 'right' });

  // ----------------------------------------------------
  // 3. CLIENT & SITE DETAILS CARD
  // ----------------------------------------------------
  curY += 12;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...borderLight);
  doc.roundedRect(margin, curY, contentWidth, 23, 2, 2, 'FD');

  // Title chip
  doc.setFillColor(...blue);
  doc.roundedRect(margin, curY, 34, 5, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text("CUSTOMER DETAILS", margin + 3, curY + 3.6);

  // Client info fields
  doc.setFontSize(8.5);
  doc.setTextColor(...slateMuted);
  doc.text("Client Name:", margin + 5, curY + 10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...slateDark);
  doc.text(clientName || "Valued Customer", margin + 28, curY + 10);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateMuted);
  doc.text("Mobile No:", margin + 5, curY + 16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...slateDark);
  doc.text(clientPhone || "Not specified", margin + 28, curY + 16);

  // Sector & Billing on Right
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateMuted);
  doc.text("Property Type:", margin + 95, curY + 10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...slateDark);
  const sectorLabel = propertyType.charAt(0).toUpperCase() + propertyType.slice(1);
  doc.text(`${sectorLabel} Rooftop`, margin + 120, curY + 10);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateMuted);
  doc.text("Current Power:", margin + 95, curY + 16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...slateDark);
  const billingText = mode === "bill" ? `Bill: Rs. ${billValue.toLocaleString('en-IN')}/mo` : `Units: ${unitsValue} kWh/mo`;
  doc.text(billingText, margin + 120, curY + 16);

  // ----------------------------------------------------
  // 4. RECOMMENDED SYSTEM SPECIFICATIONS
  // ----------------------------------------------------
  curY += 26;
  doc.setFillColor(...navy);
  doc.roundedRect(margin, curY, contentWidth, 29, 2, 2, 'F');

  // Highlight Box for kW
  doc.setFillColor(...blue);
  doc.roundedRect(margin + 4, curY + 4, 46, 21, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text("RECOMMENDED SYSTEM", margin + 8, curY + 10);
  doc.setFontSize(19);
  doc.setFont('helvetica', 'bold');
  doc.text(`${recommendedKw} kW`, margin + 8, curY + 19);

  // Specs Columns
  const specX1 = margin + 55;
  const specX2 = margin + 122;
  doc.setFontSize(8);

  // Spec 1: Solar Modules
  doc.setTextColor(...skyBlue);
  doc.setFont('helvetica', 'bold');
  doc.text("Solar PV Modules:", specX1, curY + 9);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.text(`~${panelsCount}x 550W Tier-1 Mono PERC / Bi-facial`, specX1, curY + 14);

  // Spec 2: Inverter
  doc.setTextColor(...skyBlue);
  doc.setFont('helvetica', 'bold');
  doc.text("Smart Inverter:", specX1, curY + 20);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  const inverterPhase = recommendedKw > 8 ? "Three Phase 415V" : "Single/Three Phase";
  doc.text(`${recommendedKw}kW On-Grid MPPT (${inverterPhase})`, specX1, curY + 25);

  // Spec 3: Structure
  doc.setTextColor(...skyBlue);
  doc.setFont('helvetica', 'bold');
  doc.text("Roof Area Needed:", specX2, curY + 9);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.text(`~${roofAreaSqFt} Sq. Ft. Shadow-Free`, specX2, curY + 14);

  // Spec 4: Racking & Net Metering
  doc.setTextColor(...skyBlue);
  doc.setFont('helvetica', 'bold');
  doc.text("Racking & Grid:", specX2, curY + 20);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.text("HDG Galvanized + Net Metering Liaison", specX2, curY + 25);

  // ----------------------------------------------------
  // 5. FINANCIAL FEASIBILITY & SUBSIDY BREAKDOWN (TABLE)
  // ----------------------------------------------------
  curY += 32;

  // Table Header
  doc.setFillColor(...bgLight);
  doc.setDrawColor(...borderLight);
  doc.roundedRect(margin, curY, contentWidth, 6, 1, 1, 'FD');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...slateDark);
  doc.text("FINANCIAL & SUBSIDY FEASIBILITY BREAKDOWN", margin + 4, curY + 4.2);
  doc.text("ESTIMATED VALUE", pageWidth - margin - 4, curY + 4.2, { align: 'right' });

  curY += 7;
  const tableRows = [
    {
      label: "Estimated System Benchmark Cost (EPC + Installation + Approvals)",
      value: `Rs. ${estSystemCost.toLocaleString('en-IN')}`,
      bold: false,
      color: slateDark,
    },
    {
      label: propertyType === "residential" 
        ? "PM Surya Ghar Muft Bijli Yojana Central Govt. Subsidy (DBT)" 
        : "Tax Accelerated Depreciation (40%) Benefit",
      value: propertyType === "residential" 
        ? `- Rs. ${subsidyAmount.toLocaleString('en-IN')}` 
        : "Direct Tax Benefit",
      bold: true,
      color: emerald,
    },
    {
      label: "Net Effective Estimated Customer Investment",
      value: `Rs. ${netCost.toLocaleString('en-IN')}`,
      bold: true,
      color: blue,
    },
    {
      label: "Estimated Monthly Solar Generation (Yield)",
      value: `~${estMonthlyGeneration.toLocaleString('en-IN')} kWh (Units)`,
      bold: false,
      color: slateDark,
    },
    {
      label: "Estimated Annual Electricity Bill Savings",
      value: `Rs. ${estAnnualSavings.toLocaleString('en-IN')} / year`,
      bold: true,
      color: emerald,
    },
    {
      label: "Estimated 25-Year Lifetime Cumulative Savings (4% grid inflation)",
      value: `Rs. ${(estAnnualSavings * 23).toLocaleString('en-IN')}`,
      bold: true,
      color: blue,
    },
    {
      label: "Estimated Capital Payback Period",
      value: `~${estPaybackYears} Years`,
      bold: true,
      color: amber,
    },
  ];

  tableRows.forEach((row, idx) => {
    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.setFillColor(252, 253, 255);
      doc.rect(margin, curY, contentWidth, 7, 'F');
    }
    doc.setDrawColor(...borderLight);
    doc.setLineWidth(0.2);
    doc.line(margin, curY + 7, pageWidth - margin, curY + 7);

    doc.setFontSize(8);
    doc.setFont('helvetica', row.bold ? 'bold' : 'normal');
    doc.setTextColor(...row.color);
    doc.text(row.label, margin + 4, curY + 4.8);
    doc.text(row.value, pageWidth - margin - 4, curY + 4.8, { align: 'right' });

    curY += 7;
  });

  // ----------------------------------------------------
  // 6. ENVIRONMENTAL IMPACT & 25-YEAR WARRANTY (2 COLUMNS)
  // ----------------------------------------------------
  curY += 3;
  const colW = (contentWidth - 4) / 2;

  // Left Box: Environmental Impact
  doc.setFillColor(240, 253, 244); // Light Green
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, curY, colW, 23, 1.5, 1.5, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...emerald);
  doc.text("CLEAN GREEN ENVIRONMENTAL IMPACT", margin + 3, curY + 4.5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateDark);
  doc.text(`* Carbon Offset: ~${co2SavingsTonnes} Tonnes CO2 prevented / year`, margin + 3, curY + 11);
  doc.text(`* Equivalent to planting ~${treesEquivalent} mature trees annually`, margin + 3, curY + 16.5);

  // Right Box: 25-Year Warranties
  const col2X = margin + colW + 4;
  doc.setFillColor(239, 246, 255); // Light Blue
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(col2X, curY, colW, 23, 1.5, 1.5, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...blue);
  doc.text("COMPREHENSIVE EPC WARRANTIES", col2X + 3, curY + 4.5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateDark);
  doc.text("* 25 Years Tier-1 Module Performance Warranty", col2X + 3, curY + 11);
  doc.text("* 5-10 Years Smart Inverter Manufacturer Warranty", col2X + 3, curY + 16.5);
  doc.text("* 5 Years Comprehensive Workmanship & DISCOM Support", col2X + 3, curY + 21);

  // ----------------------------------------------------
  // 7. COMPANY STAMP & AUTHORIZED SIGNATURE
  // ----------------------------------------------------
  curY += 26;
  doc.setDrawColor(...borderLight);
  doc.setLineWidth(0.3);
  doc.line(margin, curY, pageWidth - margin, curY);

  curY += 4;
  // Left: Registered Office Info
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...navy);
  doc.text("HEAD OFFICE & DISPATCH", margin, curY + 3);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateMuted);
  doc.text(siteConfig.company.address, margin, curY + 7.5, { maxWidth: 90 });
  doc.text(`WhatsApp / Helpline: ${siteConfig.company.displayPhone}`, margin, curY + 15);
  doc.text(`Email: ${siteConfig.company.email} | GSTIN: 07AABCA1234F1Z8`, margin, curY + 19);

  // Right: Official Digital Stamp & Signatory
  const stampBoxX = pageWidth - margin - 75;
  
  // Stamp Circle (Red Ink Style)
  const stampCenterX = stampBoxX + 22;
  const stampCenterY = curY + 13;
  const stampRadius = 15;

  doc.setDrawColor(...stampRed);
  doc.setLineWidth(0.8);
  doc.circle(stampCenterX, stampCenterY, stampRadius, 'D');

  doc.setLineWidth(0.35);
  doc.circle(stampCenterX, stampCenterY, stampRadius - 2, 'D');

  // Stamp Text inside
  doc.setTextColor(...stampRed);
  doc.setFontSize(4.8);
  doc.setFont('helvetica', 'bold');
  doc.text("AURASUN SOLAR SOLUTIONS", stampCenterX, stampCenterY - 7.5, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text("APPROVED", stampCenterX, stampCenterY - 1.8, { align: 'center' });
  doc.setFontSize(5.5);
  doc.text("TECHNICAL SEAL", stampCenterX, stampCenterY + 2.8, { align: 'center' });
  doc.setFontSize(5);
  doc.text(dateStr, stampCenterX, stampCenterY + 7.5, { align: 'center' });

  // Signature Block to the right of stamp
  doc.setTextColor(...slateDark);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text("For AuraSun Solar Solutions Pvt. Ltd.", stampBoxX + 40, curY + 8);

  // Simulated digital signature script
  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(...blue);
  doc.text("A. Sharma", stampBoxX + 45, curY + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...slateMuted);
  doc.text("Authorized Technical Signatory", stampBoxX + 40, curY + 20);

  // ----------------------------------------------------
  // 8. FOOTER BAR
  // ----------------------------------------------------
  doc.setFillColor(...navy);
  doc.rect(0, 287, pageWidth, 10, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Empowering India with Clean Energy | Official WhatsApp: ${siteConfig.company.displayPhone} | Visit: ${siteConfig.seo.baseUrl.replace('https://', '')}`,
    pageWidth / 2,
    293,
    { align: 'center' }
  );

  return doc;
}
