import { Injectable } from '@angular/core';
// import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class UtilityService {
    constructor() {} //private messageService: MessageService
    removeHtmlTags(htmlString: string): string {
        return htmlString.replace(/<\/?[^>]+(>|$)/g, '');
    }
    formatDataForEmail(emaildata: any) {
        let formattedContent = 'Q&A Results \n';
        emaildata.forEach((item, index) => {
            formattedContent += `Question ${index + 1}: ${item.question}\n`;
            formattedContent += `Answer: ${item.answer}\n`;
        });
        return formattedContent;
    }
    formatDataForPDF(pdfData: any) {
        let pdfFormedData: any[] = [];
        pdfData.forEach((data: any) => {
            // let strsplt: string[] = data.selected.split('|');
            let answer = this.removeHtmlTags(data.answer).replace(
                'Correct Answer:',
                ''
            );
            pdfFormedData.push({
                question: data.sno + '. ' + data.question,
                selected: 'Selected:' + data.selected.replace('|', '.'),
                answer: 'Answer:' + answer,
                status: 'Status:Correct',
            });
        });
        return pdfFormedData;
    }
    // showToast(type: number, message: string) {
    //     switch (type) {
    //         case 1:
    //             this.messageService.add({
    //                 severity: 'success',
    //                 summary: 'Success',
    //                 detail: message,
    //             });
    //             break;
    //         case 2:
    //             this.messageService.add({
    //                 severity: 'error',
    //                 summary: 'Error',
    //                 detail: message,
    //             });
    //             break;
    //     }
    // }
}
