import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { TextToSpeechService } from 'src/app/services/text-to-speech.service';
@Component({
    selector: 'app-trump-card',
    standalone: true,
    imports: [CommonModule, PaginatorModule, PanelModule, ButtonModule],
    providers: [TextToSpeechService],
    templateUrl: './trump-card.component.html',
    styleUrl: './trump-card.component.scss',
})
export class TrumpCardComponent {
    @Input() cardData: any[] = [];
    selectedValue: string = '';
    currentCardIndex = 0;
    contentIndexValue = 0;
    cards = [
        {
            name: 'GOLDBERG',
            data: [
                'Rank: 29',
                'Height: 6.4',
                'FightFought: 46',
                'Weight: 285 LBS',
                'FightsWon: 32',
                'Chest: 50',
                'FightsLost: 8',
                'Biceps: 21',
            ],
            images: [
                'https://media.tenor.com/q7mrvL33jT0AAAAM/goldberg-wwe.gif',
                'https://media1.tenor.com/m/9neavmLoVwwAAAAd/goldberg-spit.gif',
                'https://media1.tenor.com/m/r_HjtnG3VnAAAAAd/goldberg-spear.gif',
            ],
        },
        {
            name: 'JOHN CENA',
            data: [
                'Rank: 10',
                'Height: 6.1',
                'FightFought: 95',
                'Weight: 251 LBS',
                'FightsWon: 76',
                'Chest: 50',
                'FightsLost: 19',
                'Biceps: 22',
            ],
            images: [
                'https://media.tenor.com/qb6pENfyzE4AAAAM/abell46s-reface.gif',
                'https://media.tenor.com/RMpevCOck-8AAAAM/john-cena-2007.gif',
            ],
        },
        {
            name: 'THE UNDERTAKER',
            data: [
                'Rank: 2',
                'Height: 6.10',
                'FightFought: 110',
                'Weight: 309 LBS',
                'FightsWon: 84',
                'Chest: 52',
                'FightsLost: 26',
                'Biceps: 22',
            ],
            images: [
                'https://media.tenor.com/7WzdS6z-o-kAAAAM/the-undertaker-wwe.gif',
            ],
        },
        {
            name: 'TRIPLE H',
            data: [
                'Rank: 5',
                'Height: 6.4',
                'FightFought: 80',
                'Weight: 255 LBS',
                'FightsWon: 60',
                'Chest: 52',
                'FightsLost: 20',
                'Biceps: 22',
            ],
            images: [
                'https://media.tenor.com/VfBDoKiRbVgAAAAM/triple-h-entrance.gif',
            ],
        },
        {
            name: 'THE ROCK',
            data: [
                'Rank: 3',
                'Height: 6.5',
                'FightFought: 70',
                'Weight: 260 LBS',
                'FightsWon: 62',
                'Chest: 50',
                'FightsLost: 8',
                'Biceps: 21',
            ],
            images: [
                'https://gifdb.com/images/high/the-rock-come-here-4ilkysml0ze27pcy.gif',
            ],
        },
        {
            name: 'BROCK LESNAR',
            data: [
                'Rank: 1',
                'Height: 6.3',
                'FightFought: 65',
                'Weight: 286 LBS',
                'FightsWon: 59',
                'Chest: 54',
                'FightsLost: 6',
                'Biceps: 23',
            ],
            images: [
                'https://i.pinimg.com/originals/74/d2/8a/74d28afabf9d0970ee4b6edae3a70b0e.gif',
            ],
        },
        {
            name: 'ROMAN REIGNS',
            data: [
                'Rank: 4',
                'Height: 6.3',
                'FightFought: 72',
                'Weight: 265 LBS',
                'FightsWon: 65',
                'Chest: 50',
                'FightsLost: 7',
                'Biceps: 22',
            ],
            images: [
                'https://i.pinimg.com/originals/d1/5c/24/d15c24c38674fb9a6134ed4bd427e9c9.gif',
            ],
        },
        {
            name: 'STONE COLD STEVE AUSTIN',
            data: [
                'Rank: 6',
                'Height: 6.2',
                'FightFought: 83',
                'Weight: 252 LBS',
                'FightsWon: 69',
                'Chest: 52',
                'FightsLost: 14',
                'Biceps: 21',
            ],
            images: [
                'https://media1.tenor.com/m/jg1yipA4-jIAAAAC/stone-cold-steve-austin-beer-bash.gif',
            ],
        },
        {
            name: 'SHAWN MICHAELS',
            data: [
                'Rank: 9',
                'Height: 6.1',
                'FightFought: 100',
                'Weight: 225 LBS',
                'FightsWon: 78',
                'Chest: 48',
                'FightsLost: 22',
                'Biceps: 20',
            ],
            images: [
                'https://media.tenor.com/w36_8BWPDCIAAAAM/shawn-michaels-entrance.gif',
            ],
        },
        {
            name: 'KANE',
            data: [
                'Rank: 7',
                'Height: 7.0',
                'FightFought: 90',
                'Weight: 323 LBS',
                'FightsWon: 65',
                'Chest: 54',
                'FightsLost: 25',
                'Biceps: 22',
            ],
            images: [
                'https://media.tenor.com/NZV4sAcc2aYAAAAM/kane-entrance.gif',
            ],
        },
        {
            name: 'BIG SHOW',
            data: [
                'Rank: 15',
                'Height: 7.0',
                'FightFought: 105',
                'Weight: 383 LBS',
                'FightsWon: 70',
                'Chest: 60',
                'FightsLost: 35',
                'Biceps: 22',
            ],
            images: [
                'https://media.tenor.com/r7SLcyO21n0AAAAM/big-show-wwe.gif',
            ],
        },
    ];
    constructor(private textToSpeechService: TextToSpeechService) {}
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
}
