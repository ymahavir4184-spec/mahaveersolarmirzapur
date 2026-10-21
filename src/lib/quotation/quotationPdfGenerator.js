/**
 * =============================================================================
 * QUOTATION PDF GENERATOR — A4 Size Material Specification Quotation
 * =============================================================================
 * Generates a professional, branded A4-size PDF quotation with:
 * - Company logo, header, and stamp
 * - Customer details
 * - Complete material specification table
 * - NO PRICE mentioned (material-only quotation)
 * - Company address and contact info
 * - Official digital stamp
 *
 * Uses jsPDF for client-side PDF generation.
 * =============================================================================
 */

import { jsPDF } from "jspdf";
import { siteConfig } from "../../config/site.js";
import { mahaveerLogoBase64 } from "../logoBase64.js";
import { quotationText } from "./quotationTranslations.js";

/**
 * Generate the material specification quotation PDF
 * @param {Object} params - All quotation parameters
 * @param {string} params.customerName - Customer's full name
 * @param {string} params.customerMobile - Customer's mobile number
 * @param {string} params.customerAddress - Customer's address
 * @param {string} params.propertyType - residential | commercial | industrial
 * @param {string} params.roofType - rcc | metalSheet | tiled
 * @param {number} params.capacityKw - System capacity in kW
 * @param {string} params.systemType - on-grid | hybrid | off-grid
 * @param {Object[]} params.materials - Material list from materialCalculator
 * @param {Object} params.summary - System summary from getSystemSummary
 * @param {string} [params.notes] - Additional notes
 * @param {string} [params.lang="hi"] - Language: "hi" (default) or "en"
 * @returns {jsPDF} The generated PDF document
 */
export function generateMaterialQuotationPdf({
  customerName = "",
  customerMobile = "",
  customerAddress = "",
  quotationRef = "",
  quotationDate = "",
  propertyType = "residential",
  roofType = "rcc",
  capacityKw = 5,
  systemType = "on-grid",
  materials = [],
  summary = {},
  notes = "",
  lang = "hi",
}) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Helper to get translated text
  const tx = (key) => quotationText[key]?.[lang] || quotationText[key]?.en || "";

  // ─── Date & Reference ─────────────────────────────────────────────
  const now = new Date();
  const parsedQuotationDate = quotationDate ? new Date(quotationDate) : now;
  const date = Number.isNaN(parsedQuotationDate.getTime()) ? now : parsedQuotationDate;
  const dateStr = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
  const refNo = quotationRef || `MS-Q-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;

  // ─── Page Constants ───────────────────────────────────────────────
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  // ─── Colors ───────────────────────────────────────────────────────
  const navy = [11, 25, 44];
  const blue = [0, 98, 255];
  const skyBlue = [14, 165, 233];
  const slateDark = [30, 41, 59];
  const slateMuted = [100, 116, 139];
  const bgLight = [248, 250, 252];
  const borderLight = [226, 232, 240];
  const emerald = [16, 185, 129];
  const amber = [245, 158, 11];
  const stampRed = [190, 24, 24];
  const white = [255, 255, 255];

  // ===================================================================
  // 1. HEADER BANNER
  // ===================================================================
  doc.setFillColor(...navy);
  doc.rect(0, 0, pageWidth, 34, "F");

  // Accent bar
  doc.setFillColor(...amber);
  doc.rect(0, 34, pageWidth, 1.5, "F");

  // Logo
  if (mahaveerLogoBase64) {
    try {
      doc.addImage(mahaveerLogoBase64, "PNG", margin, 6, 24, 24);
    } catch {
      doc.setFillColor(...amber);
      doc.circle(margin + 12, 18, 9, "F");
    }
  }

  // Company Name
  doc.setTextColor(...white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text((siteConfig.company.legalName || siteConfig.company.name).toUpperCase(), margin + 28, 14);

  // Tagline
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...skyBlue);
  doc.text("MNRE Channel Partner | Rooftop Solar EPC", margin + 28, 19);

  // Address line
  doc.setFontSize(7);
  doc.setTextColor(200, 210, 225);
  doc.text(`${siteConfig.company.address}`, margin + 28, 24);
  doc.text(`Ph: ${siteConfig.company.displayPhone} | Email: ${siteConfig.company.email}`, margin + 28, 28.5);
  doc.setFontSize(6.5);
  doc.text("GSTIN/UIN: " + siteConfig.company.gstin + " | State: " + siteConfig.company.stateName + " (" + siteConfig.company.stateCode + ")", margin + 28, 32);

  // ===================================================================
  // 2. QUOTATION TITLE STRIP
  // ===================================================================
  let y = 38;
  doc.setFillColor(...blue);
  doc.rect(margin, y, contentWidth, 8, "F");
  doc.setTextColor(...white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(tx("pdfTitle"), pageWidth / 2, y + 5.5, { align: "center" });

  // ─── Subtitle ─────────────────────────────────────────────────────
  y += 9;
  doc.setFillColor(...bgLight);
  doc.setDrawColor(...borderLight);
  doc.roundedRect(margin, y, contentWidth, 7, 1, 1, "FD");
  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...slateMuted);
  doc.text(tx("pdfSubtitle"), pageWidth / 2, y + 4.8, { align: "center" });

  // ─── Reference & Date ─────────────────────────────────────────────
  y += 8.5;
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...blue);
  doc.text(`Ref: ${refNo}`, margin + 2, y + 3);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...slateDark);
  doc.text(`Date: ${dateStr}`, pageWidth - margin - 2, y + 3, { align: "right" });

  // ===================================================================
  // 3. CUSTOMER DETAILS CARD
  // ===================================================================
  y += 7;
  doc.setFillColor(...white);
  doc.setDrawColor(...borderLight);
  doc.roundedRect(margin, y, contentWidth, 28, 1.5, 1.5, "FD");

  // Section title chip
  doc.setFillColor(...navy);
  doc.roundedRect(margin + 2, y + 1.5, 38, 5, 1, 1, "F");
  doc.setTextColor(...white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text(tx("pdfCustomerDetails"), margin + 5, y + 4.8);

  // Customer fields - Left column
  const fieldY = y + 10;
  doc.setFontSize(8);

  // Name
  doc.setTextColor(...slateMuted);
  doc.setFont("helvetica", "normal");
  doc.text(lang === "hi" ? "ग्राहक का नाम:" : "Customer Name:", margin + 4, fieldY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...slateDark);
  doc.text(customerName || "—", margin + 38, fieldY);

  // Mobile
  doc.setTextColor(...slateMuted);
  doc.setFont("helvetica", "normal");
  doc.text(lang === "hi" ? "मोबाइल नंबर:" : "Mobile No:", margin + 4, fieldY + 6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...slateDark);
  doc.text(customerMobile || "—", margin + 38, fieldY + 6);

  // Address
  doc.setTextColor(...slateMuted);
  doc.setFont("helvetica", "normal");
  doc.text(lang === "hi" ? "पता:" : "Address:", margin + 4, fieldY + 12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...slateDark);
  doc.text(customerAddress || "—", margin + 38, fieldY + 12, { maxWidth: 55 });

  // Right column
  const rightCol = margin + 100;

  // Property Type
  doc.setTextColor(...slateMuted);
  doc.setFont("helvetica", "normal");
  doc.text(lang === "hi" ? "प्रॉपर्टी:" : "Property:", rightCol, fieldY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...slateDark);
  const propLabel = { residential: lang === "hi" ? "आवासीय" : "Residential", commercial: lang === "hi" ? "व्यावसायिक" : "Commercial", industrial: lang === "hi" ? "औद्योगिक" : "Industrial" }[propertyType] || propertyType;
  doc.text(propLabel, rightCol + 22, fieldY);

  // System
  doc.setTextColor(...slateMuted);
  doc.setFont("helvetica", "normal");
  doc.text(lang === "hi" ? "सिस्टम:" : "System:", rightCol, fieldY + 6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...blue);
  doc.text(`${capacityKw} kW ${summary.systemTypeLabel?.[lang] || "On-Grid"}`, rightCol + 22, fieldY + 6);

  // Roof Type
  doc.setTextColor(...slateMuted);
  doc.setFont("helvetica", "normal");
  doc.text(lang === "hi" ? "छत:" : "Roof:", rightCol, fieldY + 12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...slateDark);
  const roofLabel = { rcc: "RCC/Concrete", metalSheet: "Metal Sheet", tiled: "Tiled/Sloped" }[roofType] || roofType;
  doc.text(roofLabel, rightCol + 22, fieldY + 12);

  // ===================================================================
  // 4. SYSTEM SUMMARY BAR
  // ===================================================================
  y += 30;
  doc.setFillColor(...navy);
  doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, "F");

  // Summary items
  const summaryItems = [
    { label: lang === "hi" ? "क्षमता" : "Capacity", value: `${capacityKw} kW` },
    { label: lang === "hi" ? "पैनल" : "Panels", value: `${summary.panelCount || "—"} × ${summary.panelWatt || 550}W` },
    { label: lang === "hi" ? "DC क्षमता" : "DC Cap.", value: `${summary.dcCapacity || "—"} kWp` },
    { label: lang === "hi" ? "छत क्षेत्र" : "Roof Area", value: `~${summary.roofArea || "—"} Sq.Ft.` },
    { label: lang === "hi" ? "इनवर्टर" : "Inverter", value: summary.inverterPhase || "—" },
  ];

  const itemWidth = contentWidth / summaryItems.length;
  summaryItems.forEach((item, idx) => {
    const ix = margin + idx * itemWidth;
    doc.setTextColor(...skyBlue);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text(item.label, ix + itemWidth / 2, y + 4.5, { align: "center" });
    doc.setTextColor(...white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text(item.value, ix + itemWidth / 2, y + 10.5, { align: "center" });

    // Separator line
    if (idx < summaryItems.length - 1) {
      doc.setDrawColor(60, 80, 110);
      doc.setLineWidth(0.2);
      doc.line(ix + itemWidth, y + 2, ix + itemWidth, y + 12);
    }
  });

  // ===================================================================
  // 5. MATERIAL SPECIFICATION TABLE
  // ===================================================================
  y += 17;

  // Table Header
  doc.setFillColor(...blue);
  doc.rect(margin, y, contentWidth, 7, "F");
  doc.setTextColor(...white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);

  const col1X = margin + 3;       // S.No.
  const col2X = margin + 12;      // Material Name
  const col3X = margin + 62;      // Specification
  const col4X = margin + 140;     // Qty
  doc.text("S.No.", col1X, y + 4.8);
  doc.text(lang === "hi" ? "मटेरियल" : "Material", col2X, y + 4.8);
  doc.text(lang === "hi" ? "स्पेसिफिकेशन / विवरण" : "Specification / Details", col3X, y + 4.8);
  doc.text(lang === "hi" ? "मात्रा" : "Qty", col4X, y + 4.8);

  y += 7;

  // Table Rows
  materials.forEach((mat, idx) => {
    const rowHeight = 11;

    // Check for page overflow
    if (y + rowHeight > pageHeight - 55) {
      doc.addPage();
      y = 15;
      // Repeat header on new page
      doc.setFillColor(...blue);
      doc.rect(margin, y, contentWidth, 7, "F");
      doc.setTextColor(...white);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.text("S.No.", col1X, y + 4.8);
      doc.text(lang === "hi" ? "मटेरियल" : "Material", col2X, y + 4.8);
      doc.text(lang === "hi" ? "स्पेसिफिकेशन / विवरण" : "Specification / Details", col3X, y + 4.8);
      doc.text(lang === "hi" ? "मात्रा" : "Qty", col4X, y + 4.8);
      y += 7;
    }

    // Alternating row background
    if (idx % 2 === 0) {
      doc.setFillColor(252, 253, 255);
      doc.rect(margin, y, contentWidth, rowHeight, "F");
    }

    // Row border
    doc.setDrawColor(...borderLight);
    doc.setLineWidth(0.15);
    doc.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight);

    // S.No.
    doc.setTextColor(...slateMuted);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(`${idx + 1}.`, col1X, y + 4);

    // Material Name
    doc.setTextColor(...slateDark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text(mat.name?.[lang] || mat.name?.en || "", col2X, y + 4);

    // Specification
    doc.setTextColor(...slateMuted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text(mat.specification?.[lang] || mat.specification?.en || "", col3X, y + 4, { maxWidth: 72 });

    // Detail line
    doc.setFontSize(6);
    doc.setTextColor(130, 140, 155);
    doc.text(mat.detail?.[lang] || mat.detail?.en || "", col3X, y + 8.5, { maxWidth: 72 });

    // Quantity
    doc.setTextColor(...blue);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    const qtyText = lang === "hi" ? (mat.quantityHi || mat.quantity) : mat.quantity;
    doc.text(qtyText || "", col4X, y + 5.5);

    y += rowHeight;
  });

  // ===================================================================
  // 6. NO PRICE NOTICE
  // ===================================================================
  y += 3;
  doc.setFillColor(254, 243, 199); // Amber light
  doc.setDrawColor(...amber);
  doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, "FD");
  doc.setTextColor(146, 100, 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text(tx("noPriceNote"), pageWidth / 2, y + 5.2, { align: "center" });

  // ===================================================================
  // 7. NOTES (if any)
  // ===================================================================
  if (notes && notes.trim()) {
    y += 11;
    doc.setFillColor(...bgLight);
    doc.setDrawColor(...borderLight);
    doc.roundedRect(margin, y, contentWidth, 12, 1, 1, "FD");
    doc.setTextColor(...slateMuted);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7);
    doc.text(lang === "hi" ? "नोट्स:" : "Notes:", margin + 3, y + 4);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...slateDark);
    doc.text(notes, margin + 18, y + 4, { maxWidth: contentWidth - 22 });
    y += 14;
  } else {
    y += 10;
  }

  // ===================================================================
  // 8. DISCLAIMER
  // ===================================================================
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(...borderLight);
  doc.roundedRect(margin, y, contentWidth, 10, 1, 1, "FD");
  doc.setFontSize(5.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...slateMuted);
  doc.text(tx("pdfDisclaimer"), margin + 3, y + 3.5, { maxWidth: contentWidth - 6 });

  // ===================================================================
  // 9. COMPANY STAMP & SIGNATURE
  // ===================================================================
  y += 13;
  doc.setDrawColor(...borderLight);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);

  y += 3;

  // Left: Office Info
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...navy);
  doc.text(lang === "hi" ? "मुख्य कार्यालय" : "HEAD OFFICE", margin + 2, y + 3);

  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...slateMuted);
  doc.text(siteConfig.company.address, margin + 2, y + 7.5);
  doc.text(`WhatsApp: ${siteConfig.company.displayPhone}`, margin + 2, y + 11.5);
  doc.text(`Email: ${siteConfig.company.email}`, margin + 2, y + 15.5);

  // Right: Official Stamp
  const stampCX = pageWidth - margin - 38;
  const stampCY = y + 10;
  const stampR = 13;

  // Outer circle
  doc.setDrawColor(...stampRed);
  doc.setLineWidth(0.7);
  doc.circle(stampCX, stampCY, stampR, "D");
  // Inner circle
  doc.setLineWidth(0.3);
  doc.circle(stampCX, stampCY, stampR - 1.8, "D");

  // Stamp text
  doc.setTextColor(...stampRed);
  doc.setFontSize(4.2);
  doc.setFont("helvetica", "bold");
  doc.text((siteConfig.company.legalName || siteConfig.company.name).toUpperCase(), stampCX, stampCY - 6.5, { align: "center", maxWidth: 22 });
  doc.text("SAUR URJA", stampCX, stampCY - 3.5, { align: "center" });
  doc.setFontSize(7);
  doc.text("APPROVED", stampCX, stampCY + 1, { align: "center" });
  doc.setFontSize(4.5);
  doc.text("BHARUHANA, MIRZAPUR", stampCX, stampCY + 4.5, { align: "center" });
  doc.setFontSize(4);
  doc.text(dateStr, stampCX, stampCY + 7.5, { align: "center" });

  // Signature block
  const sigX = pageWidth - margin - 12;
  doc.setTextColor(...slateDark);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.text(`For ${siteConfig.company.legalName || siteConfig.company.name}`, sigX, y + 4, { align: "right" });

  doc.setFont("times", "italic");
  doc.setFontSize(10);
  doc.setTextColor(...blue);
  doc.text("Authorized", sigX, y + 10, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(...slateMuted);
  doc.text(lang === "hi" ? "अधिकृत हस्ताक्षरकर्ता" : "Authorized Signatory", sigX, y + 14, { align: "right" });

  // ===================================================================
  // 10. FOOTER BAR
  // ===================================================================
  doc.setFillColor(...navy);
  doc.rect(0, pageHeight - 9, pageWidth, 9, "F");

  doc.setTextColor(...white);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${siteConfig.company.legalName || siteConfig.company.name} | ${siteConfig.company.displayPhone} | ${siteConfig.company.address}`,
    pageWidth / 2,
    pageHeight - 4,
    { align: "center" }
  );

  return doc;
}
