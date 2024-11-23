import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { Subscription } from 'rxjs';
import { ReactService } from 'src/app/layout/service/react.service';
import { TextToSpeechService } from 'src/app/services/text-to-speech.service';
@Component({
    selector: 'app-trump-card',
    standalone: true,
    imports: [
        CommonModule,
        PaginatorModule,
        PanelModule,
        ButtonModule,
        ToggleButtonModule,
        RadioButtonModule,
    ],
    providers: [TextToSpeechService],
    templateUrl: './trump-card.component.html',
    styleUrl: './trump-card.component.scss',
})
export class TrumpCardComponent {
    @Input() data: any[] = [];
    fileSubscription: Subscription = new Subscription();
    selectedValue: string = '';
    currentCardIndex = 0;
    contentIndexValue = 0;
    selectedStatus: any[] = [];
    private audio = new Audio();
    cards: any[] = [];
    constructor(
        private textToSpeechService: TextToSpeechService,
        private reactService: ReactService
    ) {
        this.fileSubscription = this.reactService.file$.subscribe((data) => {
            if (data) {
                this.data = data.excelContents;
                this.setData();
            }
        });
    }
    ngOnInit() {
        this.setData();
    }
    setData() {
        this.cards = [];
        this.data.forEach((val: any) => {
            let name: string = '';
            let status: string = '';
            let data: string[] = [];
            let images: string[] = [];
            Object.keys(val).forEach((key) => {
                let keyName = key.toLowerCase().trim();
                if (keyName.toLowerCase().includes('xlname')) {
                    name = val[key];
                } else if (keyName.toLowerCase().includes('xlstatus')) {
                    status = val[key];
                } else if (keyName.toLowerCase().includes('xldata')) {
                    let strArray = val[key].split(',');
                    if (strArray?.length > 0) {
                        data = strArray;
                    }
                } else if (keyName.toLowerCase().includes('xlimages')) {
                    let strArray = val[key].split(',');
                    if (strArray?.length > 0) {
                        images = strArray;
                    }
                }
            });
            this.cards.push({
                name: name,
                status: status,
                data: data,
                images: images,
            });
        });
    }
    valueClick(value: string) {
        this.selectedValue = value;
        this.textToSpeechService.speak(value);
    }
    onCardClick(index: number): void {
        if (this.currentCardIndex !== index) {
            this.currentCardIndex = index;
        }
    }

    nextCardIndex(): number {
        return (this.currentCardIndex + 1) % this.cards.length;
    }

    previousCardIndex(): number {
        return this.currentCardIndex === 0
            ? this.cards.length - 1
            : this.currentCardIndex - 1;
    }
    submitAnswer(answer: string) {}
    onContentChange(event: any) {
        this.contentIndexValue = event.page;
    }
    onAudioOn(audioOn: boolean) {
        if (audioOn) {
            this.audio.src =
                'https://drive.google.com/uc?export=download&id=1P0DHkAaYLkEpboahTypBVpIgu-lz3TAH';
            this.audio.load();
            this.audio.volume = 0.5;
            this.audio.play();
        } else {
            this.audio.pause();
            this.audio.currentTime = 0; // Reset to start
        }
    }
    updateRadioColors() {}
    onStatusClick(index: number, value: string) {
        this.selectedStatus[index] = value;
    }
}
