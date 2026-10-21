import { jsPDF } from "jspdf";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 10;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const BLACK = [20, 20, 20];
const GRID = [105, 105, 105];
const MUTED = [85, 85, 85];

const ITEM_COLUMNS = [
  { label: "Sl\nNo.", width: 8 },
  { label: "Description of Goods", width: 51 },
  { label: "HSN/SAC", width: 17 },
  { label: "GST\nRate", width: 13 },
  { label: "Quantity", width: 20 },
  { label: "Rate\n(Incl. of Tax)", width: 24 },
  { label: "Rate", width: 19 },
  { label: "per", width: 9 },
  { label: "Amount", width: 29 },
];

const TAX_COLUMNS = [
  { label: "HSN/SAC", width: 22 },
  { label: "Taxable\nValue", width: 34 },
  { label: "CGST %", width: 13 },
  { label: "CGST Amount", width: 22 },
  { label: "SGST %", width: 13 },
  { label: "SGST Amount", width: 22 },
  { label: "IGST %", width: 13 },
  { label: "IGST Amount", width: 22 },
  { label: "Tax Amount", width: 29 },
];

const money = (value) => (Number(value) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const quantity = (value) => (Number(value) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 3 });

function formatDate(value) {
  if (!value) return new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit", timeZone: "Asia/Kolkata" });
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" });
}

function underThousand(value) {
  const ones = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  let number = Math.floor(value);
  const words = [];
  if (number >= 100) {
    words.push(`${ones[Math.floor(number / 100)]} Hundred`);
    number %= 100;
  }
  if (number >= 20) {
    words.push(tens[Math.floor(number / 10)]);
    if (number % 10) words.push(ones[number % 10]);
  } else if (number > 0 || words.length === 0) {
    words.push(ones[number]);
  }
  return words.join(" ");
}

function integerInWords(value) {
  let number = Math.floor(Math.abs(Number(value) || 0));
  if (!number) return "Zero";
  const chunks = [{ value: number % 1000, label: "" }];
  number = Math.floor(number / 1000);
  const labels = ["Thousand", "Lakh", "Crore", "Arab", "Kharab"];
  let index = 0;
  while (number > 0) {
    chunks.push({ value: number % 100, label: labels[index] || "" });
    number = Math.floor(number / 100);
    index += 1;
  }
  return chunks.reverse().filter((part) => part.value).map((part) => `${underThousand(part.value)}${part.label ? ` ${part.label}` : ""}`).join(" ");
}

function amountInWords(value) {
  const paiseValue = Math.round((Number(value) || 0) * 100);
  const rupees = Math.floor(paiseValue / 100);
  const paise = paiseValue % 100;
  return `INR ${integerInWords(rupees)}${paise ? ` and ${integerInWords(paise)} Paise` : ""} Only`;
}

function wrappedLines(doc, value, width, maxLines = 4) {
  const paragraphs = String(value || "").split(/\r?\n/);
  const lines = paragraphs.flatMap((paragraph) => doc.splitTextToSize(paragraph || "—", width));
  if (lines.length <= maxLines) return lines;
  return [...lines.slice(0, maxLines - 1), `${lines[maxLines - 1].replace(/\s+\S*$/, "")}…`];
}

function drawMetaTable(doc, business, estimate, x, y, width, height) {
  const details = estimate.document_details || estimate.documentDetails || {};
  const rows = [
    ["Estimate No.", estimate.estimate_number || "—", "Dated", formatDate(estimate.estimate_date)],
    ["Delivery Note", details.deliveryNote || "", "Mode/Terms of Payment", details.paymentTerms || ""],
    ["Reference No. & Date", details.referenceNoDate || "", "Other References", details.otherReferences || ""],
    ["Buyer's Order No.", details.buyersOrderNo || "", "Dated", details.dated || ""],
    ["Dispatch Doc No.", details.dispatchDocNo || "", "Delivery Note Date", details.deliveryNoteDate || ""],
    ["Dispatched through", details.dispatchedThrough || "", "Destination", details.destination || ""],
    ["Terms of Delivery", details.termsOfDelivery || "", "", ""],
  ];
  const rowHeight = height / rows.length;
  const cellWidth = width / 2;
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.22);
  doc.rect(x, y, width, height);
  for (let index = 1; index < rows.length; index += 1) doc.line(x, y + rowHeight * index, x + width, y + rowHeight * index);
  doc.line(x + cellWidth, y, x + cellWidth, y + height);

  rows.forEach((row, rowIndex) => {
    const rowY = y + rowHeight * rowIndex;
    const isLast = rowIndex === rows.length - 1;
    if (isLast) doc.line(x, rowY, x + width, rowY);
    [0, 2].forEach((offset, cellIndex) => {
      const cellX = x + (cellIndex ? cellWidth : 0);
      const label = row[offset];
      const value = row[offset + 1];
      doc.setFont("helvetica", "normal");
      doc.setFontSize(5.5);
      doc.setTextColor(...MUTED);
      doc.text(label, cellX + 2, rowY + 3.2, { maxWidth: cellWidth - 4 });
      if (value) {
        doc.setFontSize(6.6);
        doc.setTextColor(...BLACK);
        doc.text(doc.splitTextToSize(String(value), cellWidth - 4).slice(0, 2), cellX + 2, rowY + 6.4);
      }
    });
  });
}

function drawCustomerBlock(doc, estimate, x, y, width, label, addressLines, height) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.6);
  doc.setTextColor(...BLACK);
  doc.text(label, x + 2, y + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text(`Name: ${estimate.customer_name || "—"}`, x + 2, y + 8);
  doc.text(`Mobile: ${estimate.customer_mobile || "—"}`, x + 2, y + 12);
  doc.text(addressLines, x + 2, y + 16, { maxWidth: width - 4 });
  return y + height;
}

function drawFirstPageHeader(doc, estimate, business) {
  const leftX = MARGIN;
  const leftWidth = 106;
  const gap = 2;
  const rightX = leftX + leftWidth + gap;
  const rightWidth = CONTENT_WIDTH - leftWidth - gap;
  const top = 14;
  const addressLines = wrappedLines(doc, estimate.customer_address || "—", leftWidth - 4, 5);
  const sellerHeight = 29;
  const customerHeight = Math.max(20, 16 + addressLines.length * 3.2);
  const totalHeight = sellerHeight + customerHeight * 2 + 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...BLACK);
  doc.text("ESTIMATE", PAGE_WIDTH / 2, 9, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text("ORIGINAL FOR RECIPIENT", PAGE_WIDTH - MARGIN, 9, { align: "right" });

  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.22);
  doc.rect(leftX, top, leftWidth, totalHeight);
  doc.line(leftX, top + sellerHeight, leftX + leftWidth, top + sellerHeight);
  doc.line(leftX, top + sellerHeight + customerHeight + 1, leftX + leftWidth, top + sellerHeight + customerHeight + 1);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(String(business.name || "Mahaveer Enterprises"), leftX + 2, top + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text(doc.splitTextToSize(String(business.address || ""), leftWidth - 4).slice(0, 2), leftX + 2, top + 9);
  doc.text(`Mobile No- ${business.mobile || business.phone || ""}`, leftX + 2, top + 16.5);
  doc.text(`GSTIN/UIN: ${business.gstin || ""}`, leftX + 2, top + 20);
  doc.text(`State Name : ${business.stateName || "Uttar Pradesh"}, Code : ${business.stateCode || "09"}`, leftX + 2, top + 23.5);
  doc.text(`E-Mail : ${business.email || ""}`, leftX + 2, top + 27);

  const consigneeTop = top + sellerHeight + 1;
  const buyerTop = consigneeTop + customerHeight + 1;
  drawCustomerBlock(doc, estimate, leftX, consigneeTop, leftWidth, "Consignee (Ship to)", addressLines, customerHeight);
  drawCustomerBlock(doc, estimate, leftX, buyerTop, leftWidth, "Buyer (Estimate to)", addressLines, customerHeight);

  drawMetaTable(doc, business, estimate, rightX, top, rightWidth, totalHeight);
  return top + totalHeight + 2;
}

function drawContinuationHeader(doc, estimate, business, sectionLabel = "CONTINUED") {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...BLACK);
  doc.text(String(business.name || "Mahaveer Enterprises"), MARGIN, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(`Estimate No.: ${estimate.estimate_number || "—"}`, PAGE_WIDTH - MARGIN, 11, { align: "right" });
  doc.setTextColor(...MUTED);
  doc.text(`${sectionLabel} · ${formatDate(estimate.estimate_date)}`, PAGE_WIDTH - MARGIN, 16, { align: "right" });
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.22);
  doc.line(MARGIN, 20, PAGE_WIDTH - MARGIN, 20);
  return 23;
}

function drawGridHeader(doc, columns, x, y, height, fontSize) {
  doc.setFillColor(245, 245, 245);
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.22);
  doc.rect(x, y, CONTENT_WIDTH, height, "FD");
  let columnX = x;
  columns.forEach((column, index) => {
    const lines = String(column.label).split("\n");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(fontSize);
    doc.setTextColor(...BLACK);
    doc.text(lines, columnX + column.width / 2, y + (lines.length > 1 ? 3.5 : height / 2 + 1), {
      align: "center",
      maxWidth: column.width - 1,
    });
    columnX += column.width;
    if (index < columns.length - 1) doc.line(columnX, y, columnX, y + height);
  });
  return y + height;
}

function normalizedItems(items) {
  return (Array.isArray(items) ? items : []).map((item, index) => {
    const unitPrice = Number(item.unit_price ?? item.unitPrice) || 0;
    const count = Number(item.quantity) || 0;
    const rate = Number(item.gst_rate ?? item.gstRate) || 0;
    const taxable = Number(item.taxable_amount ?? item.taxableAmount);
    const taxTotal = Number(item.cgst_amount || 0) + Number(item.sgst_amount || 0) + Number(item.igst_amount || 0);
    return {
      ...item,
      line_number: Number(item.line_number) || index + 1,
      product_name: String(item.product_name || item.productName || "—"),
      hsn_sac: String(item.hsn_sac || item.hsnSac || ""),
      quantity: count,
      unit: String(item.unit || "pcs"),
      unit_price: unitPrice,
      gst_rate: rate,
      taxable_amount: Number.isFinite(taxable) ? taxable : count * unitPrice,
      line_total: Number(item.line_total) || count * unitPrice + taxTotal,
    };
  });
}

function prepareItemRows(doc, items) {
  const fontSize = items.length > 40 ? 5.7 : items.length > 25 ? 6.1 : items.length > 14 ? 6.5 : 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize);
  return items.map((item) => {
    const lines = doc.splitTextToSize(item.product_name, ITEM_COLUMNS[1].width - 3);
    return { item, lines, fontSize, height: Math.max(7.5, lines.length * fontSize * 0.52 + 3) };
  });
}

function drawItemRow(doc, row, x, y, index) {
  const { item, lines, height, fontSize } = row;
  let columnX = x;
  doc.setDrawColor(...GRID);
  doc.setLineWidth(0.16);
  doc.rect(x, y, CONTENT_WIDTH, height);
  ITEM_COLUMNS.slice(0, -1).forEach((column) => {
    columnX += column.width;
    doc.line(columnX, y, columnX, y + height);
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize);
  doc.setTextColor(...BLACK);
  columnX = x;
  const values = [
    String(index + 1),
    lines,
    item.hsn_sac || "—",
    `${item.gst_rate}%`,
    quantity(item.quantity),
    money(item.unit_price * (1 + item.gst_rate / 100)),
    money(item.unit_price),
    `${item.unit}.`,
    money(item.taxable_amount),
  ];
  ITEM_COLUMNS.forEach((column, columnIndex) => {
    const baseline = y + (Array.isArray(values[columnIndex]) ? 3.7 : height / 2 + fontSize * 0.32);
    doc.text(values[columnIndex], columnX + (columnIndex === 1 ? 1.5 : column.width / 2), baseline, {
      align: columnIndex === 1 ? "left" : "center",
      maxWidth: column.width - 2,
    });
    columnX += column.width;
  });
}

function drawEmptyItemSpace(doc, x, y, height) {
  if (height <= 0.5) return;
  doc.setDrawColor(...GRID);
  doc.setLineWidth(0.16);
  doc.rect(x, y, CONTENT_WIDTH, height);
  let columnX = x;
  ITEM_COLUMNS.slice(0, -1).forEach((column) => {
    columnX += column.width;
    doc.line(columnX, y, columnX, y + height);
  });
}

function drawItemTotalRow(doc, estimate, items, x, y) {
  const height = 7;
  const unitQuantities = new Map();
  items.forEach((item) => unitQuantities.set(item.unit, (unitQuantities.get(item.unit) || 0) + item.quantity));
  const quantityText = [...unitQuantities.entries()].map(([unit, value]) => `${quantity(value)} ${unit}.`).join(", ");
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.22);
  doc.rect(x, y, CONTENT_WIDTH, height);
  let columnX = x;
  ITEM_COLUMNS.slice(0, -1).forEach((column) => {
    columnX += column.width;
    doc.line(columnX, y, columnX, y + height);
  });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(...BLACK);
  const descriptionEnd = x + ITEM_COLUMNS.slice(0, 2).reduce((sum, column) => sum + column.width, 0) - 2;
  doc.text("Subtotal", descriptionEnd, y + 4.8, { align: "right", maxWidth: ITEM_COLUMNS[1].width - 2 });
  doc.text(quantityText, x + ITEM_COLUMNS.slice(0, 5).reduce((sum, col) => sum + col.width, 0) - 2, y + 4.8, { align: "right", maxWidth: 20 });
  doc.text(money(estimate.subtotal), x + CONTENT_WIDTH - 2, y + 4.8, { align: "right" });
  doc.line(x, y + height, x + CONTENT_WIDTH, y + height);
  return y + height;
}

function groupTaxes(items) {
  const groups = new Map();
  items.forEach((item) => {
    if (!item.gst_rate) return;
    const key = `${item.hsn_sac || "—"}|${item.gst_rate}`;
    const current = groups.get(key) || { hsn: item.hsn_sac || "—", rate: item.gst_rate, taxable: 0, cgst: 0, sgst: 0, igst: 0 };
    current.taxable += item.taxable_amount;
    current.cgst += Number(item.cgst_amount) || 0;
    current.sgst += Number(item.sgst_amount) || 0;
    current.igst += Number(item.igst_amount) || 0;
    groups.set(key, current);
  });
  return [...groups.values()].sort((left, right) => left.hsn.localeCompare(right.hsn) || left.rate - right.rate);
}

function drawTaxableTotals(doc, estimate, groups, y) {
  const right = PAGE_WIDTH - MARGIN;
  const labelX = right - 64;
  const valueX = right;
  const rows = [];
  const byRate = new Map();
  groups.forEach((group) => {
    const current = byRate.get(group.rate) || { cgst: 0, sgst: 0, igst: 0 };
    current.cgst += group.cgst;
    current.sgst += group.sgst;
    current.igst += group.igst;
    byRate.set(group.rate, current);
  });
  [...byRate.entries()].sort(([left], [rightRate]) => left - rightRate).forEach(([rate, amounts]) => {
    if (amounts.cgst || amounts.sgst) {
      rows.push({ label: `Output CGST ${rate / 2}%`, value: amounts.cgst });
      rows.push({ label: `Output SGST ${rate / 2}%`, value: amounts.sgst });
    }
    if (amounts.igst) rows.push({ label: `Output IGST ${rate}%`, value: amounts.igst });
  });
  const roundOff = Number(estimate.grand_total) - Number(estimate.subtotal) - Number(estimate.tax_total);
  if (Math.abs(roundOff) >= 0.005) rows.push({ label: "Round Off", value: roundOff });
  rows.push({ label: "Total", value: estimate.grand_total, bold: true });

  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.22);
  doc.line(labelX, y, valueX, y);
  y += 1;
  rows.forEach((row) => {
    doc.setFont("helvetica", row.bold ? "bold" : "normal");
    doc.setFontSize(row.bold ? 8 : 6.8);
    doc.setTextColor(...BLACK);
    doc.text(row.label, labelX, y + 3.4);
    doc.text(money(row.value), valueX, y + 3.4, { align: "right" });
    y += row.bold ? 5.5 : 4.7;
  });
  doc.line(labelX, y, valueX, y);
  return y + 3;
}

function drawTaxSummaryHeader(doc, x, y) {
  doc.setFillColor(245, 245, 245);
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.18);
  const height = 9;
  doc.rect(x, y, CONTENT_WIDTH, height, "FD");
  let cellX = x;
  TAX_COLUMNS.forEach((column, index) => {
    const lines = column.label.split("\n");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.7);
    doc.setTextColor(...BLACK);
    doc.text(lines, cellX + column.width / 2, y + (lines.length > 1 ? 3.3 : 5.5), { align: "center", maxWidth: column.width - 1 });
    cellX += column.width;
    if (index < TAX_COLUMNS.length - 1) doc.line(cellX, y, cellX, y + height);
  });
  return y + height;
}

function drawTaxSummaryRow(doc, group, taxMode, x, y) {
  const height = 6;
  const cgstRate = taxMode === "intra" ? group.rate / 2 : 0;
  const sgstRate = taxMode === "intra" ? group.rate / 2 : 0;
  const igstRate = taxMode === "inter" ? group.rate : 0;
  const values = [group.hsn, money(group.taxable), cgstRate ? `${cgstRate}%` : "—", money(group.cgst), sgstRate ? `${sgstRate}%` : "—", money(group.sgst), igstRate ? `${igstRate}%` : "—", money(group.igst), money(group.cgst + group.sgst + group.igst)];
  let cellX = x;
  doc.setDrawColor(...GRID);
  doc.setLineWidth(0.16);
  doc.rect(x, y, CONTENT_WIDTH, height);
  TAX_COLUMNS.slice(0, -1).forEach((column) => {
    cellX += column.width;
    doc.line(cellX, y, cellX, y + height);
  });
  cellX = x;
  values.forEach((value, index) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.8);
    doc.setTextColor(...BLACK);
    doc.text(String(value), cellX + (index === 0 ? 1 : TAX_COLUMNS[index].width - 1.2), y + 4.1, {
      align: index === 0 ? "left" : "right",
      maxWidth: TAX_COLUMNS[index].width - 2,
    });
    cellX += TAX_COLUMNS[index].width;
  });
  return y + height;
}

function drawTaxSummary(doc, estimate, business, groups, y) {
  if (!groups.length) return y;
  const sectionHeight = 5 + 9 + groups.length * 6 + 4;
  if (y + sectionHeight > PAGE_HEIGHT - 68) {
    doc.addPage("a4", "portrait");
    y = drawContinuationHeader(doc, estimate, business, "TAX SUMMARY");
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(...BLACK);
  doc.text("HSN/SAC TAX SUMMARY", MARGIN, y + 3.5);
  y += 5;
  y = drawTaxSummaryHeader(doc, MARGIN, y);
  groups.forEach((group) => {
    if (y + 6 > PAGE_HEIGHT - 68) {
      doc.addPage("a4", "portrait");
      y = drawContinuationHeader(doc, estimate, business, "TAX SUMMARY CONTINUED");
      y = drawTaxSummaryHeader(doc, MARGIN, y);
    }
    y = drawTaxSummaryRow(doc, group, estimate.tax_mode, MARGIN, y);
  });
  return y + 4;
}

function drawWords(doc, label, value, y) {
  const lines = doc.splitTextToSize(String(value), CONTENT_WIDTH - 42);
  const height = Math.max(7, lines.length * 3.2 + 3);
  doc.setDrawColor(...GRID);
  doc.setLineWidth(0.16);
  doc.rect(MARGIN, y, CONTENT_WIDTH, height);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.7);
  doc.setTextColor(...BLACK);
  doc.text(label, MARGIN + 1.5, y + 4.5);
  doc.text(lines, MARGIN + 37, y + 4.5);
  return y + height + 1;
}

function drawEstimateFooter(doc, estimate, business, y) {
  const needed = 48;
  if (y + needed > PAGE_HEIGHT - MARGIN - 4) {
    doc.addPage("a4", "portrait");
    y = drawContinuationHeader(doc, estimate, business, "ESTIMATE DETAILS");
  }

  const columnGap = 2;
  const columnWidth = (CONTENT_WIDTH - columnGap) / 2;
  const rightX = MARGIN + columnWidth + columnGap;
  const infoHeight = 31;
  doc.setDrawColor(...GRID);
  doc.setLineWidth(0.16);
  doc.rect(MARGIN, y, columnWidth, infoHeight);
  doc.rect(rightX, y, columnWidth, infoHeight);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...BLACK);
  doc.setFontSize(6.5);
  doc.text(`Company's PAN : ${business.pan || "—"}`, MARGIN + 2, y + 4.5);
  doc.setFont("helvetica", "bold");
  doc.text("Declaration", MARGIN + 2, y + 9);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.1);
  const declaration = "This estimate is based on the products and rates listed above and is subject to final order confirmation.";
  doc.text(doc.splitTextToSize(declaration, columnWidth - 4).slice(0, 4), MARGIN + 2, y + 12.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.text("Company's Bank Details", rightX + 2, y + 4.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.2);
  doc.text(`Bank Name          : ${business.bankName || "—"}`, rightX + 2, y + 9);
  doc.text(`A/c No.             : ${business.bankAccount || "—"}`, rightX + 2, y + 13);
  doc.text(`Branch & IFS Code : ${business.bankBranchIfsc || "—"}`, rightX + 2, y + 17);

  const signatureY = y + infoHeight;
  doc.rect(MARGIN, signatureY, columnWidth, 17);
  doc.rect(rightX, signatureY, columnWidth, 17);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.3);
  doc.text("Customer's Seal and Signature", MARGIN + 2, signatureY + 4.5);
  doc.setFont("helvetica", "bold");
  doc.text(`for ${business.name || "Mahaveer Enterprises"}`, rightX + columnWidth - 2, signatureY + 4.5, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.text("Authorised Signatory", rightX + columnWidth - 2, signatureY + 14, { align: "right" });
  doc.setFontSize(6.2);
  doc.text("This is a Computer Generated Estimate", PAGE_WIDTH / 2, PAGE_HEIGHT - 4, { align: "center" });
}

function addPageNumbers(doc, business, estimate) {
  const pages = doc.getNumberOfPages();
  if (pages < 2) return;
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.8);
    doc.setTextColor(...MUTED);
    doc.text(`Page ${page} of ${pages} · ${estimate.estimate_number || business.name || "Estimate"}`, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 9, { align: "right" });
  }
}

export function createEstimatePdf(estimate, business = {}) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  doc.setProperties({ title: `Estimate ${estimate.estimate_number || ""}`, subject: business.name || "Mahaveer Enterprises" });
  const items = normalizedItems(estimate.items);
  const groups = groupTaxes(items);
  const itemRows = prepareItemRows(doc, items);
  let y = drawFirstPageHeader(doc, estimate, business);
  y = drawGridHeader(doc, ITEM_COLUMNS, MARGIN, y, 11, itemRows[0]?.fontSize || 6.8);

  itemRows.forEach((row, index) => {
    if (y + row.height > PAGE_HEIGHT - 73) {
      doc.addPage("a4", "portrait");
      y = drawContinuationHeader(doc, estimate, business);
      y = drawGridHeader(doc, ITEM_COLUMNS, MARGIN, y, 11, row.fontSize);
    }
    drawItemRow(doc, row, MARGIN, y, index);
    y += row.height;
  });

  const footerTop = PAGE_HEIGHT - MARGIN - 4 - 48;
  const wordsHeight = Number(estimate.tax_total) > 0 ? 19 : 10;
  if (doc.getNumberOfPages() === 1 && items.length <= 8 && groups.length <= 8 && y < footerTop) {
    const rates = new Set(groups.map((group) => group.rate));
    const taxRows = groups.length ? 2 + rates.size * (estimate.tax_mode === "intra" ? 2 : 1) : 2;
    const taxableTotalsHeight = 1 + Math.max(0, taxRows - 1) * 4.7 + 5.5 + 3;
    const taxSummaryHeight = groups.length ? 5 + 9 + groups.length * 6 + 4 : 0;
    const totalsStart = Math.max(y, footerTop - 7 - taxableTotalsHeight - taxSummaryHeight - wordsHeight - 2);
    drawEmptyItemSpace(doc, MARGIN, y, totalsStart - y);
    y = totalsStart;
  }
  y = drawItemTotalRow(doc, estimate, items, MARGIN, y);
  y = drawTaxableTotals(doc, estimate, groups, y);
  y = drawTaxSummary(doc, estimate, business, groups, y);

  if (y + wordsHeight > footerTop) {
    doc.addPage("a4", "portrait");
    y = drawContinuationHeader(doc, estimate, business, "ESTIMATE TOTALS");
  }
  y = drawWords(doc, "Amount Chargeable (in words) :", amountInWords(estimate.grand_total), y);
  if (Number(estimate.tax_total) > 0) y = drawWords(doc, "Tax Amount (in words) :", amountInWords(estimate.tax_total), y);
  drawEstimateFooter(doc, estimate, business, Math.max(y + 1, footerTop));
  addPageNumbers(doc, business, estimate);
  return doc;
}

export function downloadEstimatePdf(estimate, business) {
  const doc = createEstimatePdf(estimate, business);
  doc.save(`${estimate.estimate_number}.pdf`);
}

export function printEstimatePdf(estimate, business) {
  const doc = createEstimatePdf(estimate, business);
  doc.autoPrint();
  const url = URL.createObjectURL(doc.output("blob"));
  window.open(url, "_blank", "noopener,noreferrer");
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
