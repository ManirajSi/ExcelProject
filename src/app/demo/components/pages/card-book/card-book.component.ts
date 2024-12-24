import { Component, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { FlipBook, FlipBookConfig } from 'page-flip';
import { PageFlip, FlipSetting } from 'page-flip';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ReactService } from 'src/app/layout/service/react.service';
import { ButtonModule } from 'primeng/button';
@Component({
    selector: 'app-card-book',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    templateUrl: './card-book.component.html',
    styleUrl: './card-book.component.scss',
})
export class CardBookComponent {
    private pageFlip!: PageFlip;
    pageData: any[] = [];
    @Input() data: any[] = [];
    fileSubscription: Subscription = new Subscription();
    isItInitalLoad: boolean = true;
    constructor(private reactService: ReactService) {
        this.fileSubscription = this.reactService.file$.subscribe((data) => {
            if (data) {
                this.data = [];
                this.data = data.excelContents;
                this.setData();
                if (!this.isItInitalLoad) {
                    this.ngAfterViewInit();
                }
            }
        });
    }

    ngAfterViewInit(): void {
        const flipSettings: FlipSetting = {
            width: 400, // Page width
            height: 500, // Page height
            size: 'stretch', // Auto-size pages
            showCover: true,
            maxShadowOpacity: 0.5,
            mobileScrollSupport: false,
        };

        this.pageFlip = new PageFlip(
            document.getElementById('page-flip')!,
            flipSettings
        );

        // Initialize PageFlip from existing DOM elements
        this.pageFlip.loadFromHTML(
            document.querySelectorAll('.page') as NodeListOf<HTMLElement>
        );
    }
    setData() {
        this.pageData = [];
        this.data.forEach((val: any) => {
            let data: string[] = [];
            Object.keys(val).forEach((key) => {
                let keyName = key.toLowerCase().trim();
                if (keyName.toLowerCase().includes('xlcontent')) {
                    data = val[key];
                }
            });
            this.pageData.push(data);
        });
        this.isItInitalLoad = false;
    }
    onSpeakerClick() {
        console.log('Speaker button clicked!');
        // Add your logic here, e.g., play a sound or perform an action
    }
    ngOnDestroy(): void {
        if (this.pageFlip) {
            this.pageFlip.destroy();
        }
    }
}
