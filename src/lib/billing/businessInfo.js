import { siteConfig } from "@/config/site";

export function getBusinessInfo() {
  const company = siteConfig.company;
  const gstin = String(process.env.COMPANY_GSTIN || company.gstin || "").trim().toUpperCase();
  const gstinValid = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gstin);
  return {
    name: company.legalName || company.name,
    brandName: company.name,
    address: company.address,
    phone: company.displayPhone,
    mobile: company.mobile || company.phone,
    email: company.email,
    logo: company.logo,
    stateName: company.stateName || "",
    stateCode: company.stateCode || "",
    gstin: gstinValid ? gstin : "",
    pan: gstinValid ? gstin.slice(2, 12) : "",
    bankName: company.bankName || "",
    bankAccount: String(process.env.COMPANY_BANK_ACCOUNT || "").trim(),
    bankBranchIfsc: company.bankBranchIfsc || "",
    gstEnabled: gstinValid,
  };
}
