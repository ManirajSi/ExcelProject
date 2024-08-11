import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalTransService } from 'src/app/layout/service/signal-trans.service';
import { MenuItem } from 'primeng/api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ReactService } from 'src/app/layout/service/react.service';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/layout/service/storage.service';

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
    // groupedData: Array<{
    //     category: string;
    //     subCategories: Array<{ subCategory: string; contents: SafeHtml[] }>;
    // }> = [];
    groupedData: GroupedData[] = [];
    slideConfig = {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
    };
    images: string[] = [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmEDjAExxzBNFclSu2rLISZKw-0NCzroHepQ&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI8cXM0JZINDcpwaVv91pdLEp7zHw8ObnFpQ&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTet87JrUNU4rB0LaPdsCUzByjZjLIXHhidjA&s',
    ];
    currentIndex: number = 0;
    imageUrls: any[] = [];
    products: any[] = [
        { name: 'Excel1', tags: 'tag1,tag2,tag3', type: 'Template1' },
    ];
    directory = 'excel';
    constructor(
        private reactService: ReactService,
        private sanitizer: DomSanitizer,
        private storageService: StorageService
    ) {
        this.fileSubscription = this.reactService.file$.subscribe((data) => {
            this.data = data.excelContents;
            this.groupData();
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
                this.products = [];
                console.log('searchSubscription===>', data);
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
        );
    }
    ngOnDestroy(): void {
        this.fileSubscription.unsubscribe();
        this.sectionNavSubscription.unsubscribe();
        this.searchSubscription.unsubscribe();
    }

    ngOnInit() {}

    private groupData() {
        const categoryMap = new Map<
            string,
            Map<string, (SafeHtml | string[])[]>
        >();
        this.data.forEach((item) => {
            const {
                Category: category,
                SubCategory: subCategory,
                Content1: content1,
                Content2: content2,
            } = item;
            const content = content1 + (content2 ? '\n' + content2 : '');
            const contentWithIframe = this.replaceXframeWithIframe(content);
            const contentWithImage = this.extractImages(contentWithIframe);
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
            subCategoryMap.get(subCategory)!.push(contentWithImage);
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

    private replaceXframeWithIframe(content: string): SafeHtml {
        const updatedContent = content.replace(
            /<xframe>(.*?)<\/xframe>/g,
            (match, url) => {
                return `<iframe src="${url}" width="100%" height="400px" frameborder="0" allowfullscreen></iframe>`;
            }
        );
        return this.sanitizer.bypassSecurityTrustHtml(updatedContent);
    }

    private extractImages(content: SafeHtml): string {
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

    private sanitizeUrl(url: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    onExcelListClick(file: any) {
        console.log('fileName===>', file.name);
        this.searchExcelText = '';
        this.showWebsiteView = true;
        //  this.downloadFile(file.name);
        this.reactService.setExcelInfo({ fileName: file.name });
    }
    downloadFile(filename: string) {
        const filePath = `${this.directory}/${filename}`;
        this.storageService.downloadFile(filePath).subscribe((url) => {
            window.open(url, '_blank');
        });
    }
    scrollToSection(categoryIndex: number, subCategoryIndex: number) {
        const sectionId = `section-${categoryIndex}-${subCategoryIndex}`;
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
