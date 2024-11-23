import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root',
})
export class TextToSpeechService {
    private synth: SpeechSynthesis;
    private utterance: SpeechSynthesisUtterance;
    private voices: SpeechSynthesisVoice[];

    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];

        // Load voices asynchronously
        this.loadVoices();
    }

    loadVoices() {
        this.voices = this.synth.getVoices();

        if (this.voices.length === 0) {
            window.speechSynthesis.onvoiceschanged = () => {
                this.voices = window.speechSynthesis.getVoices();
            };
        }
    }

    speak(text: string, lang: string = 'en-US'): void {
        if (this.synth.speaking) {
            console.error('SpeechSynthesis is already speaking.');
            return;
        }

        if (text !== '') {
            this.utterance = new SpeechSynthesisUtterance(text);

            // Set the language dynamically based on input
            this.utterance.lang = lang;

            // Try to find the appropriate voice for the language
            const voice = this.voices.find((v) => v.lang === lang);
            if (voice) {
                this.utterance.voice = voice;
            } else {
                console.warn(
                    `Voice for language ${lang} not found, using default.`
                );
            }

            this.utterance.pitch = 9;
            this.utterance.rate = 0.6;

            this.utterance.onend = () => {
                console.log('SpeechSynthesisUtterance.onend');
            };

            this.utterance.onerror = (event) => {
                console.error('SpeechSynthesisUtterance.onerror', event);
            };

            this.synth.speak(this.utterance);
        }
    }

    stop(): void {
        if (this.synth.speaking) {
            this.synth.cancel();
        }
    }
}
