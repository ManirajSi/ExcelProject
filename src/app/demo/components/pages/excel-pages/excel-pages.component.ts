import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalTransService } from 'src/app/layout/service/signal-trans.service';
import { MenuItem } from 'primeng/api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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
    // images: string[] = [
    //     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmEDjAExxzBNFclSu2rLISZKw-0NCzroHepQ&s',
    //     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI8cXM0JZINDcpwaVv91pdLEp7zHw8ObnFpQ&s',
    //     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTet87JrUNU4rB0LaPdsCUzByjZjLIXHhidjA&s',
    // ];
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
    constructor(
        private reactService: ReactService,
        private sanitizer: DomSanitizer,
        private storageService: StorageService,
        private dataService: DataService
    ) {
        //Subscription call for get file from local and cloud
        this.fileSubscription = this.reactService.file$.subscribe((data) => {
            if (data) {
                this.showAddVideo = false;
                this.showExcelContent = true;
                this.showExcelsTable = false;
                this.data = data.excelContents;
                console.log('this.data===>', this.data);
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
    ngOnInit() {
        this.getImages();
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
        console.log('this.data 2===>', this.data);
        const categoryMap = new Map<
            string,
            Map<string, (SafeHtml | string[])[]>
        >();
        this.data.forEach((item) => {
            let category: string = '';
            let subCategory: string = '';
            let textContent: string[] = [];
            let noteContent: string[] = [];
            let codeContent: string[] = [];
            let imageContent: string[] = [];
            let videoContent: SafeResourceUrl[] = [];
            let gifContent: string[] = [];
            let urlRefContent: SafeResourceUrl[] = [];
            Object.keys(item).forEach((key) => {
                let keyName = key.toLowerCase().trim();
                if (keyName.toLowerCase().includes('xlcategory')) {
                    category = item[key]; // Assign the value to category if the key contains "col1"
                } else if (keyName.toLowerCase().includes('xlsubcategory')) {
                    subCategory = item[key]; // Assign the value to subCategory if the key contains "col3"
                } else {
                    if (keyName.toLowerCase().includes('xlcontent')) {
                        textContent.push(item[key].replace(/\r\n/g, '</br>')); // Assign the value to content if the key contains "col5"
                    }
                    if (keyName.toLowerCase().includes('xlcode')) {
                        let codetext: string = item[key].replace(
                            /\r\n/g,
                            '</br>'
                        );
                        codeContent.push(codetext);
                        // codeContent.push(item[key]); // Assign the value to content if the key contains "col5"
                    }
                    if (keyName.toLowerCase().includes('xlnote')) {
                        noteContent.push(
                            '<span style="margin-left: 10px;">' +
                                item[key] +
                                '</span>'
                        ); // Assign the value to content if the key contains "col5"
                    }
                    if (keyName.toLowerCase().includes('xlimage')) {
                        let imgArr: string[] = item[key]
                            .replace(/\r\n/g, '')
                            .split(',');
                        imageContent.push(...imgArr); // Assign the value to content if the key contains "col5"
                    }
                    if (keyName.toLowerCase().includes('xlgif')) {
                        let gifArr: string[] = item[key]
                            .replace(/\r\n/g, '')
                            .split(',');
                        gifContent.push(...gifArr); // Assign the value to content if the key contains "col5"
                    }
                    if (keyName.toLowerCase().includes('xlvideo')) {
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
                        // Assign the value to content if the key contains "col5"
                    }
                    if (keyName.toLowerCase().includes('xlframe')) {
                        let urlArr: string[] = item[key]
                            .replace(/\r\n/g, '')
                            .split(',');
                        urlArr.forEach((videodata) => {
                            let safeurl: SafeResourceUrl =
                                this.sanitizer.bypassSecurityTrustResourceUrl(
                                    videodata
                                );
                            urlRefContent.push(safeurl);
                        });

                        // Assign the value to content if the key contains "col5"
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
                textContent: textContent,
                codeContent: codeContent,
                noteContent: noteContent,
                imageContent: imageContent,
                videoContent: videoContent,
                gifContent: gifContent,
                urlRefContent: urlRefContent,
            });
        });
        console.log('this.groupedData====>', this.groupedData);
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
    ngOnDestroy(): void {
        this.fileSubscription.unsubscribe();
        this.sectionNavSubscription.unsubscribe();
        this.searchSubscription.unsubscribe();
    }
}
