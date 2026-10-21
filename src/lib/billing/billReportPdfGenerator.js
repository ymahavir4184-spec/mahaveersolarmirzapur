import { jsPDF } from "jspdf";
import { siteConfig } from "@/config/site";

const money = (value) => `INR ${(Number(value) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function downloadBillReportPdf(summary = {}, filters = {}, business = {}) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  const left = 14;
  const right = 196;
  let y = 18;

  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  const companyName = business.name || siteConfig.company.legalName || siteConfig.company.name;
  doc.text(companyName + " — Bill Report", left, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Period: ${filters.from || "All dates"} to ${filters.to || "All dates"}`, left, y);
  if (filters.search) doc.text(`Search: ${filters.search}`, left, y + 5);
  y += filters.search ? 14 : 9;

  doc.setDrawColor(30, 30, 30);
  doc.rect(left, y, 182, 27);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`Bills: ${Number(summary.bill_count) || 0}`, left + 4, y + 8);
  doc.text(`Subtotal: ${money(summary.subtotal)}`, left + 4, y + 16);
  doc.text(`GST: ${money(summary.tax_total)}`, left + 94, y + 8);
  doc.setFontSize(12);
  doc.text(`Grand total: ${money(summary.grand_total)}`, left + 94, y + 18);
  y += 37;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Daily summary", left, y);
  y += 5;
  const daily = Array.isArray(summary.daily) ? summary.daily : [];
  const drawHeader = () => {
    doc.setFillColor(242, 242, 242);
    doc.rect(left, y, 182, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("Date", left + 2, y + 4.8);
    doc.text("Bills", left + 105, y + 4.8, { align: "right" });
    doc.text("Amount (INR)", right - 2, y + 4.8, { align: "right" });
    y += 7;
  };
  drawHeader();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  for (const row of daily) {
    if (y > 275) {
      doc.addPage("a4", "portrait");
      y = 18;
      drawHeader();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
    }
    doc.setDrawColor(190, 190, 190);
    doc.line(left, y + 6, right, y + 6);
    doc.text(String(row.date || ""), left + 2, y + 4.5);
    doc.text(String(row.bill_count || 0), left + 105, y + 4.5, { align: "right" });
    doc.text(money(row.grand_total), right - 2, y + 4.5, { align: "right" });
    y += 7;
  }
  if (!daily.length) doc.text("No bills matched this report.", left + 2, y + 5);
  const filename = companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  doc.save(filename + "-bill-report-" + (filters.from || "all") + "-" + (filters.to || "all") + ".pdf");
}
