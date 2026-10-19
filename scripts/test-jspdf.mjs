import { jsPDF } from 'jspdf';
import fs from 'fs';

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4',
});

doc.setFillColor(11, 25, 44); // Deep Navy
doc.rect(0, 0, 210, 32, 'F');

doc.setTextColor(255, 255, 255);
doc.setFont('helvetica', 'bold');
doc.setFontSize(18);
doc.text('AURASUN SOLAR SOLUTIONS', 14, 15);

doc.setFontSize(9);
doc.setFont('helvetica', 'normal');
doc.setTextColor(14, 165, 233);
doc.text('High-Efficiency Rooftop Solar EPC & Clean Energy Solutions', 14, 22);

const output = doc.output('arraybuffer');
fs.writeFileSync('/tmp/test_solar_pdf.pdf', Buffer.from(output));
console.log('PDF generated successfully! Size:', output.byteLength, 'bytes');
