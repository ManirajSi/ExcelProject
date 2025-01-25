import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Injectable({
    providedIn: 'root',
})
export class EmailService {
    constructor() {}

    sendEmail(formData: any): Promise<EmailJSResponseStatus> {
        return emailjs.send(
            'service_73ugpre',
            //'template_ehoivmo',
            'template_9p29sjd',
            formData,
            'rNTbDtSwB97dvGzBr'
        );
    }
}
