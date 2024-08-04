import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SignalTransService {
    constructor() {}
    private fileSignal = signal<any | null>(null);

    setFile(file: any) {
        this.fileSignal.set(file);
    }

    getFile() {
        return this.fileSignal();
    }
}
