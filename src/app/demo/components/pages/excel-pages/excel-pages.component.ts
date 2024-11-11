import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { ReactService } from 'src/app/layout/service/react.service';
import {
    DomSanitizer,
    SafeHtml,
    SafeResourceUrl,
    SafeUrl,
} from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/layout/service/storage.service';
import { DataService } from 'src/app/demo/service/data.service';
import { TextToSpeechService } from 'src/app/services/text-to-speech.service';
import { FormControl, FormGroup } from '@angular/forms';
import { PdfService } from 'src/app/services/pdf.service';
import { UtilityService } from 'src/app/services/utility.service';
import { EmailService } from 'src/app/services/email.service';
declare var Prism: any;
interface GroupedData {
    category: string;
    subCategories: Array<{
        subCategory: string;
        contents: (SafeHtml | string[])[];
    }>;
}
@Component({
    selector: 'app-excel-pages',
    templateUrl: './excel-pages.component.html',
    styleUrl: './excel-pages.component.scss',
    providers: [MessageService],
})
export class ExcelPagesComponent implements OnInit, OnDestroy {
    fileSubscription: Subscription = new Subscription();
    sectionNavSubscription: Subscription = new Subscription();
    searchSubscription: Subscription = new Subscription();
    searchExcelText: string = '';
    showWebsiteView: boolean = false;
    selectedFiles: any[] = [];
    data: any[] = [];
    groupedData: GroupedData[] = [];
    slideConfig = {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
    };
    currentIndex: number = 0;
    imageUrls: any[] = [];
    products: any[] = [
        { name: 'Excel1', tags: 'tag1,tag2,tag3', type: 'Template1' },
    ];
    directory = 'excel';
    showAddVideo: boolean = true;
    showExcelsTable: boolean = false;
    showExcelContent: boolean = false;
    images: any[] | undefined;
    responsiveOptions: any[] | undefined;
    messages: Message[] | undefined;
    selectedOption: string = '';
    excelPageForm: any;
    downloadAnsOptions = [
        {
            label: 'Download',
            icon: 'pi pi-download',
            items: [
                {
                    label: 'Excel',
                    icon: 'pi pi-file-excel',
                    command: () => {},
                },
                {
                    label: 'PDF',
                    icon: 'pi pi-file-pdf',
                    command: () => {},
                },
            ],
        },
    ];
    isFooterFixed: boolean = false;
    getUserAnswers: any[] = [];
    checklist: any[] = [
        { label: 'Item 1', value: 'Item 1' },
        { label: 'Item 2', value: 'Item 2' },
        { label: 'Item 3', value: 'Item 3' },
    ];
    selectedItems: string[] = [];
    contentIndexValue: number = 0;
    selectedTabIndex: number = 0;
    templateName: string = 'contentview';
    constructor(
        private reactService: ReactService,
        private sanitizer: DomSanitizer,
        private storageService: StorageService,
        private dataService: DataService,
        private textToSpeechService: TextToSpeechService,
        private pdfService: PdfService,
        private utilityService: UtilityService,
        private emailService: EmailService,
        private messageService: MessageService
    ) {
        //Subscription call for get file from local and cloud
        this.fileSubscription = this.reactService.file$.subscribe((data) => {
            if (data) {
                this.showAddVideo = false;
                this.showExcelContent = true;
                this.templateName = data.specInfo.contentLabel;
                this.showExcelsTable = false;
                this.data = data.excelContents;
                this.groupData();
            }
        });
        this.sectionNavSubscription = this.reactService.sectionNav$.subscribe(
            (navData) => {
                if (navData) {
                    this.scrollToSection(
                        navData.categoryIndex,
                        navData.subCategoryIndex
                    );
                }
            }
        );
        this.searchSubscription = this.reactService.headerSearch$.subscribe(
            (data) => {
                if (data) {
                    this.showAddVideo = false;
                    this.showExcelContent = false;
                    this.showExcelsTable = true;
                    this.products = [];
                    this.selectedFiles = data.selectedFiles;
                    this.searchExcelText = data.searchTags.name;
                    this.selectedFiles.forEach((file) => {
                        this.products.push({
                            name: file,
                            tags: 'tag1,tag2,tag3',
                            type: 'Template1',
                        });
                    });
                }
            }
        );
    }
    textToSpeak: string = '';
    selectedLanguage: string = 'en-US'; // Default to English
    languages = [
        { label: 'English (US)', value: 'en-US' },
        { label: 'Tamil', value: 'ta-IN' },
        // Add more languages if needed
    ];
    showAnswers: boolean = false;
    ngOnInit() {
        this.excelPageForm = new FormGroup({
            checked: new FormControl(''),
            optionSelect: new FormControl(null),
            fixedFooter: new FormControl(''),
            taskControl: new FormControl(null),
        });
        this.getImages();
        this.excelPageForm
            .get('fixedFooter')
            .valueChanges.subscribe((value) => {
                this.isFooterFixed = value;
                this.toggleFooterPosition();
            });
    }
    ngAfterViewInit() {
        Prism.highlightAll(); // Trigger Prism to highlight the code
    }
    getImages() {
        this.dataService.getImages().then((images) => (this.images = images));
        this.responsiveOptions = [
            {
                breakpoint: '1024px',
                numVisible: 5,
            },
            {
                breakpoint: '768px',
                numVisible: 3,
            },
            {
                breakpoint: '560px',
                numVisible: 1,
            },
        ];
    }
    groupData() {
        const categoryMap = new Map<
            string,
            Map<string, (SafeHtml | string[])[]>
        >();
        this.data.forEach((item) => {
            // Common Variables
            let category: string = '';
            let subCategory: string = '';
            // Q&A View Variables
            let snoSet: string[] = [];
            let taskSet: string[] = [];
            let questionSet: string[] = [];
            let optionSet: string[][] = [];
            let answerSet: string[] = [];
            let reasonSet: string[] = [];
            let controlSet: string[] = [];
            // Content View Variables
            let textContent: string[] = [];
            let noteContent: string[] = [];
            let codeContent: string[] = [];
            let imageContent: SafeResourceUrl[] = [];
            let videoContent: SafeResourceUrl[] = [];
            let gifContent: SafeResourceUrl[] = [];
            let urlRefContent: SafeResourceUrl[] = [];
            let pdfContent: SafeResourceUrl[] = [];
            Object.keys(item).forEach((key) => {
                let keyName = key.toLowerCase().trim();
                if (keyName.toLowerCase().includes('xlcategory')) {
                    category = item[key];
                } else if (keyName.toLowerCase().includes('xlsubcategory')) {
                    subCategory = item[key];
                } else {
                    if (keyName.toLowerCase().includes('xlsno')) {
                        if (item[key]) {
                            snoSet.push(item[key]);
                        }
                    }
                    // Content View Data Assign
                    if (keyName.toLowerCase().includes('xlcontent')) {
                        if (item[key]?.trim().toLowerCase() != 'x') {
                            textContent.push(
                                item[key].replace(/\r\n/g, '</br>')
                            );
                        }
                    }
                    if (keyName.toLowerCase().includes('xlcode')) {
                        if (item[key]?.trim().toLowerCase() != 'x') {
                            let codeArr: string[] = item[key]
                                .replace(/\r\n/g, '</br>')
                                .split('!!!');
                            codeArr.forEach((code: any) => {
                                codeContent.push(code);
                            });
                        }
                    }
                    if (keyName.toLowerCase().includes('xlnote')) {
                        if (item[key]?.trim().toLowerCase() != 'x') {
                            let noteArr: string[] = item[key]
                                .replace(/\r\n/g, '</br>')
                                .split('!!!');
                            noteArr.forEach((note: any) => {
                                noteContent.push(note);
                            });
                        }
                    }
                    if (keyName.toLowerCase().includes('xlimage')) {
                        if (item[key]?.trim().toLowerCase() != 'x') {
                            let imgArr: string[] = item[key]
                                .replace(/\r\n/g, '')
                                .split(',');
                            imgArr.forEach((img: any) => {
                                let safeurl: SafeResourceUrl =
                                    this.sanitizer.bypassSecurityTrustResourceUrl(
                                        img
                                    );
                                imageContent.push(safeurl);
                            });
                        }
                    }
                    if (keyName.toLowerCase().includes('xlgif')) {
                        if (item[key]?.trim().toLowerCase() != 'x') {
                            let gifArr: string[] = item[key]
                                .replace(/\r\n/g, '')
                                .split(',');
                            gifArr.forEach((gifimg: any) => {
                                let safeurl: SafeResourceUrl =
                                    this.sanitizer.bypassSecurityTrustResourceUrl(
                                        gifimg
                                    );
                                gifContent.push(safeurl);
                            });
                        }
                    }
                    if (keyName.toLowerCase().includes('xlvideo')) {
                        if (item[key]?.trim().toLowerCase() != 'x') {
                            let videoArr: string[] = item[key]
                                .replace(/\r\n/g, '')
                                .split(',');
                            videoArr.forEach((videodata) => {
                                let safeurl: SafeResourceUrl =
                                    this.sanitizer.bypassSecurityTrustResourceUrl(
                                        videodata
                                    );
                                videoContent.push(safeurl);
                            });
                        }
                    }
                    if (keyName.toLowerCase().includes('xlframe')) {
                        if (item[key]?.trim().toLowerCase() != 'x') {
                            let urlArr: string[] = item[key]
                                .replace(/\r\n/g, '')
                                .split(',');
                            urlArr.forEach((urldata) => {
                                let safeurl: SafeResourceUrl =
                                    this.sanitizer.bypassSecurityTrustResourceUrl(
                                        urldata
                                    );
                                urlRefContent.push(safeurl);
                            });
                        }
                    }
                    if (keyName.toLowerCase().includes('xlpdf')) {
                        if (item[key]?.trim().toLowerCase() != 'x') {
                            let pdfArr: string[] = item[key]
                                .replace(/\r\n/g, '')
                                .split(',');
                            pdfArr.forEach((pdfdata) => {
                                let safeurl: SafeResourceUrl =
                                    this.sanitizer.bypassSecurityTrustResourceUrl(
                                        pdfdata
                                    );
                                pdfContent.push(safeurl);
                            });
                        }
                    }
                    // Q&A View Data Assign
                    if (keyName.toLowerCase().includes('xlquestions')) {
                        if (item[key]?.trim().toLowerCase() != 'x') {
                            questionSet.push(
                                item[key].replace(/\r\n/g, '</br>')
                            );
                        }
                    }
                    if (keyName.toLowerCase().includes('xloptions')) {
                        if (item[key]?.trim().toLowerCase() != 'x') {
                            let strSplt = item[key]
                                .replace(/\r\n/g, '</br>')
                                .split(',');
                            optionSet.push(...strSplt);
                        }
                    }
                    if (keyName.toLowerCase().includes('xlanswers')) {
                        if (item[key]?.trim().toLowerCase() != 'x') {
                            answerSet.push(
                                '<b>Correct Answer: </b>' +
                                    item[key].replace(/\r\n/g, '</br>')
                            );
                        }
                    }
                    if (keyName.toLowerCase().includes('xlreasons')) {
                        if (item[key]?.trim().toLowerCase() != 'x') {
                            reasonSet.push(
                                '<b>Reason: </b>' +
                                    item[key].replace(/\r\n/g, '</br>')
                            );
                        }
                    }
                    if (keyName.toLowerCase().includes('xlcontrols')) {
                        if (item[key]?.trim().toLowerCase() != 'x') {
                            controlSet.push(
                                '<b>Reason:</b>' +
                                    item[key].replace(/\r\n/g, '</br>')
                            );
                        }
                    }
                    // Task View Data Assign
                    if (keyName.toLowerCase().includes('xltask')) {
                        if (item[key]?.trim().toLowerCase() != 'x') {
                            taskSet.push(item[key].replace(/\r\n/g, '</br>'));
                        }
                    }
                }
            });
            //const content = item.column3 + (item.column4 ? '\n' + item.column5 : '');
            // content = this.replaceXLTagsWithHtml(content);
            //const contentWithIframe = this.replaceXframeWithIframe(content);
            //const contentWithImage = this.extractImages(contentWithIframe);
            if (!categoryMap.has(category)) {
                categoryMap.set(
                    category,
                    new Map<string, (SafeHtml | string[])[]>()
                );
            }
            const subCategoryMap = categoryMap.get(category)!;
            if (!subCategoryMap.has(subCategory)) {
                subCategoryMap.set(subCategory, []);
            }
            subCategoryMap.get(subCategory)!.push({
                snoSet: snoSet,
                taskSet: taskSet,
                questionSet: questionSet,
                optionSet: optionSet,
                answerSet: answerSet,
                reasonSet: reasonSet,
                controlSet: controlSet,
                textContent: textContent,
                codeContent: codeContent,
                noteContent: noteContent,
                imageContent: imageContent,
                videoContent: videoContent,
                gifContent: gifContent,
                urlRefContent: urlRefContent,
                pdfContent: pdfContent,
            });
        });
        // Convert Map to Array while preserving order
        this.groupedData = Array.from(categoryMap.entries()).map(
            ([category, subCategoryMap]) => ({
                category,
                subCategories: Array.from(subCategoryMap.entries()).map(
                    ([subCategory, contents]) => ({
                        subCategory,
                        contents,
                    })
                ),
            })
        );
        this.reactService.setMenu(this.groupedData);
    }
    replaceXLTagsWithHtml(content: string): string {
        let updatedContent = content.replace(
            /<xcode>(.*?)<\/xcode>/g,
            (match, code) => {
                return `<div class="code-card">
                                        <pre>
                                            <code class="language-html">
                                            ${code}
                                        </code>
                                        </pre>
                                    </div>`;
            }
        );
        return updatedContent;
    }
    replaceXframeWithIframe(content: string): SafeHtml {
        const updatedContent = content.replace(
            /<xframe>(.*?)<\/xframe>/g,
            (match, url) => {
                return `<iframe src="${url}" width="100%" height="400px" frameborder="0" allowfullscreen></iframe>`;
            }
        );
        return this.sanitizer.bypassSecurityTrustHtml(updatedContent);
    }
    extractImages(content: SafeHtml): string {
        const regex = /<ximage>\[(.*?)\]<\/ximage>/g;
        let htmlContent = content.toString();
        if (regex.test(htmlContent)) {
            // Extract URLs from the content
            const urlsString = htmlContent
                .match(regex)![0]
                .replace(/<ximage>\[|\]<\/ximage>/g, '');
            const urls = urlsString
                .split(',')
                .map((url) => url.trim().replace(/['"]/g, ''));
            this.imageUrls = [...this.imageUrls, ...urls];
            htmlContent = htmlContent.replace(
                /<ximage>(.*?)<\/ximage>/g,
                (match, url) => {
                    return '';
                }
            );
        }
        return htmlContent;
    }
    isImageArray(content: SafeHtml | string[]): content is string[] {
        return Array.isArray(content);
    }
    sanitizeUrl(url: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    onExcelListClick(file: any) {
        if (file) {
            this.showExcelContent = true;
            this.showExcelsTable = false;
            this.searchExcelText = '';
            this.showWebsiteView = true;
            this.reactService.setExcelInfo({ fileName: file.name });
        }
    }
    downloadFile(file: any) {
        const filePath = `${this.directory}/${file.name}`;
        this.storageService.downloadFile(filePath).subscribe((url) => {
            window.open(url, '_blank');
        });
    }
    scrollToSection(categoryIndex: number, subCategoryIndex: number) {
        const sectionId = `section-${categoryIndex}-${subCategoryIndex}`;
        const section = document.getElementById(sectionId);
        if (section) {
            const offset = 70; // Adjust this value to how far down you want the heading to stay.
            const sectionPosition =
                section.getBoundingClientRect().top +
                window.pageYOffset -
                offset;

            window.scrollTo({
                top: sectionPosition,
                behavior: 'smooth',
            });
        }
    }
    checkString(str: string) {
        let strarray: string[] = str.split(':');
        let strval = strarray[0].toLowerCase();
        if (strval.includes('note')) {
            return 'info';
        } else if (strval.includes('caution')) {
            return 'error';
        } else if (strval.includes('warning')) {
            return 'warn';
        } else {
            return 'success';
        }
    }
    onToggle(event: any, text: any) {
        if (event.checked) {
            this.textToSpeechService.speak(
                this.removeHtmlTags(text),
                this.selectedLanguage
            );
        } else {
            this.textToSpeechService.stop();
        }
    }
    removeHtmlTags(stringWithHTML: string) {
        let stringWithoutHTML = stringWithHTML.replace(/<[^>]*>/g, '');
        return stringWithoutHTML;
    }
    downloadAnswer() {}
    toggleFooterPosition() {
        const footerElement = document.querySelector('.layout-footer');
        if (this.isFooterFixed) {
            footerElement.classList.add('fixed-footer');
            footerElement.classList.remove('scroll-footer');
        } else {
            footerElement.classList.remove('fixed-footer');
            footerElement.classList.add('scroll-footer');
        }
    }
    submitAnswer() {
        this.showAnswers = true;
    }
    setUserAnswers(sno: any, question: any, selected: any, answer: any) {
        this.addOrUpdateObject({
            sno: sno,
            question: question,
            selected,
            answer,
        });
    }
    addOrUpdateObject(newObject: any) {
        // Check if the object with the same key already exists
        const index = this.getUserAnswers.findIndex(
            (obj) => obj['sno'] === newObject['sno']
        );
        if (index !== -1) {
            // If the key exists, override the existing object
            this.getUserAnswers[index] = newObject;
        } else {
            // If the key doesn't exist, add the new object
            this.getUserAnswers.push(newObject);
        }
    }
    generatePDF() {
        let pdfFormedData: any[] = this.utilityService.formatDataForPDF(
            this.getUserAnswers
        );
        const title = 'User Information Q&A';
        this.pdfService.downloadPDF(pdfFormedData, title);
    }

    sendEmail(event: Event) {
        let formattedContent = this.utilityService.formatDataForEmail(
            this.getUserAnswers
        );
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = {
            user_name: 'Sathish',
            user_email: 'sathish@gmail.com',
            message: formattedContent,
        };
        this.emailService
            .sendEmail(formData)
            .then((response) => {
                this.showToast(1, 'Email sent successfully!');
            })
            .catch((error) => {
                this.showToast(2, 'Failed to send email!');
                console.error('Email send error:', error);
            });
    }
    showToast(type: number, message: string) {
        switch (type) {
            case 1:
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: message,
                });
                break;
            case 2:
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: message,
                });
                break;
        }
    }
    onContentChange(event: any) {
        this.contentIndexValue = event.page;
    }
    checkIframe(iframeName: string) {
        const iframe = document.getElementById(iframeName) as HTMLIFrameElement;
        setTimeout(() => {
            try {
                const iframeDoc =
                    iframe.contentDocument || iframe.contentWindow?.document;
                if (iframeDoc?.location.href === 'about:blank') {
                    return true;
                } else {
                    return true;
                }
            } catch (e) {
                return true;
            }
        }, 1000);
    }
    onTabChange(event: any) {
        this.selectedTabIndex = event.index;
    }
    ngOnDestroy(): void {
        this.fileSubscription.unsubscribe();
        this.sectionNavSubscription.unsubscribe();
        this.searchSubscription.unsubscribe();
    }
}
