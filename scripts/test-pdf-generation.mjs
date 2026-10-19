import { generateSolarQuotationPdf } from '../src/lib/pdfGenerator.js';
import fs from 'fs';

try {
  const doc = generateSolarQuotationPdf({
    clientName: "Akash Yadav",
    clientPhone: "+91 98765 43210",
    city: "Gurugram, Haryana",
    propertyType: "residential",
    billValue: 7000,
    mode: "bill",
    recommendedKw: 5.5,
    estMonthlyGeneration: 693,
    estAnnualSavings: 70686,
    estPaybackYears: "3.2",
    estSystemCost: 302500,
    subsidyAmount: 78000,
    netCost: 224500,
    panelsCount: 10,
    roofAreaSqFt: 500,
    co2SavingsTonnes: "6.6",
    treesEquivalent: 110,
  });

  const arrayBuffer = doc.output('arraybuffer');
  fs.writeFileSync('/tmp/sample_solar_quotation.pdf', Buffer.from(arrayBuffer));
  console.log('Quotation PDF generated successfully! Size:', arrayBuffer.byteLength, 'bytes');
} catch (err) {
  console.error('Error generating PDF:', err);
  process.exit(1);
}
