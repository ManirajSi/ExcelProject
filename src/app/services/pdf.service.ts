import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

@Injectable({
    providedIn: 'root',
})
export class PdfService {
    constructor() {}

    downloadPDF(data: any[], title: string) {
        const doc = new jsPDF();
        // Add a title to the PDF
        doc.setFontSize(18);
        doc.text(title, 14, 20);
        // Set font size for questions and answers
        let currentY = 30;
        data.forEach((item, index) => {
            doc.setFontSize(14);
            // doc.text(`Question ${index + 1}:`, 14, currentY);
            currentY += 5;
            doc.setFontSize(12);
            Object.keys(item).forEach((key) => {
                // doc.text(`${key}:`, 10, currentY); // Question
                // currentY += 5;
                doc.text(`${item[key]}`, 20, currentY); // Answer
                currentY += 5;
            });
            currentY += 10; // Add some space between entries
            if (currentY > 270) {
                // If content exceeds page height, add a new page
                doc.addPage();
                currentY = 20;
            }
        });

        // Save the PDF
        doc.save(`${title}.pdf`);
    }
}
