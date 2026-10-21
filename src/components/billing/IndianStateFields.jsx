"use client";

import { useId } from "react";

export const INDIA_GST_STATES = [
  { name: "Andhra Pradesh", code: "37" },
  { name: "Arunachal Pradesh", code: "12" },
  { name: "Assam", code: "18" },
  { name: "Bihar", code: "10" },
  { name: "Chhattisgarh", code: "22" },
  { name: "Goa", code: "30" },
  { name: "Gujarat", code: "24" },
  { name: "Haryana", code: "06" },
  { name: "Himachal Pradesh", code: "02" },
  { name: "Jharkhand", code: "20" },
  { name: "Karnataka", code: "29" },
  { name: "Kerala", code: "32" },
  { name: "Madhya Pradesh", code: "23" },
  { name: "Maharashtra", code: "27" },
  { name: "Manipur", code: "14" },
  { name: "Meghalaya", code: "17" },
  { name: "Mizoram", code: "15" },
  { name: "Nagaland", code: "13" },
  { name: "Odisha", code: "21" },
  { name: "Punjab", code: "03" },
  { name: "Rajasthan", code: "08" },
  { name: "Sikkim", code: "11" },
  { name: "Tamil Nadu", code: "33" },
  { name: "Telangana", code: "36" },
  { name: "Tripura", code: "16" },
  { name: "Uttar Pradesh", code: "09" },
  { name: "Uttarakhand", code: "05" },
  { name: "West Bengal", code: "19" },
  { name: "Andaman and Nicobar Islands", code: "35" },
  { name: "Chandigarh", code: "04" },
  { name: "Dadra and Nagar Haveli and Daman and Diu", code: "26" },
  { name: "Delhi", code: "07" },
  { name: "Jammu and Kashmir", code: "01" },
  { name: "Ladakh", code: "38" },
  { name: "Lakshadweep", code: "31" },
  { name: "Puducherry", code: "34" },
];

const GST_CODE_OPTIONS = [
  ...INDIA_GST_STATES,
  { name: "Daman and Diu (legacy GST code)", code: "25", stateName: "Daman and Diu" },
  { name: "Andhra Pradesh (legacy GST code)", code: "28", stateName: "Andhra Pradesh" },
  { name: "Other Territory", code: "97" },
];

const normalizeName = (value) => String(value || "").trim().replace(/\s+/g, " ").toLocaleLowerCase("en-IN");

export default function IndianStateFields({ stateName, stateCode, onStateNameChange, onStateCodeChange, lang = "hi" }) {
  const id = useId().replace(/:/g, "");
  const nameListId = `india-state-names-${id}`;
  const codeListId = `india-state-codes-${id}`;
  const hi = lang === "hi";
  const inputClass = "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";

  const changeName = (value) => {
    onStateNameChange(value.slice(0, 80));
    const name = normalizeName(value);
    const selected = GST_CODE_OPTIONS.find((state) => normalizeName(state.stateName || state.name) === name && state.code === stateCode)
      || INDIA_GST_STATES.find((state) => normalizeName(state.name) === name);
    if (selected) onStateCodeChange(selected.code);
    else if (value) onStateCodeChange("");
  };

  const changeCode = (value) => {
    const code = value.replace(/\D/g, "").slice(0, 2);
    onStateCodeChange(code);
    const selected = GST_CODE_OPTIONS.find((state) => state.code === code);
    if (selected) onStateNameChange(selected.stateName || selected.name);
  };

  return (
    <>
      <label className="text-xs font-semibold text-slate-700">
        {hi ? "राज्य का नाम" : "State name"}
        <input list={nameListId} value={stateName} onChange={(event) => changeName(event.target.value)} maxLength={80} autoComplete="address-level1" placeholder={hi ? "चुनें या खुद लिखें" : "Choose or type"} className={inputClass} />
        <datalist id={nameListId}>{INDIA_GST_STATES.map((state) => <option key={state.code} value={state.name}>{state.code}</option>)}</datalist>
      </label>
      <label className="text-xs font-semibold text-slate-700">
        {hi ? "राज्य / GST कोड" : "State / GST code"}
        <input list={codeListId} value={stateCode} onChange={(event) => changeCode(event.target.value)} inputMode="numeric" maxLength={2} placeholder={hi ? "चुनें या खुद लिखें" : "Choose or type"} className={inputClass} />
        <datalist id={codeListId}>{GST_CODE_OPTIONS.map((state) => <option key={state.code} value={state.code}>{state.name}</option>)}</datalist>
      </label>
      <p className="text-xs text-slate-500 sm:col-span-2">{hi ? "सूची से राज्य और GST code चुनें, या दोनों फ़ील्ड में manually type करें। पहचाने गए राज्य पर दूसरा फ़ील्ड अपने-आप भर जाएगा।" : "Choose from the state and GST code lists, or type both fields manually. The matching field fills automatically for recognized states."}</p>
    </>
  );
}
