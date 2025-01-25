import { Component, ElementRef, ViewChild } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html',
    styleUrls: ['./app.sidebar.component.scss'],
})
export class AppSidebarComponent {
    constructor(
        public layoutService: LayoutService,
        public el: ElementRef,
        public formBuilder: FormBuilder
    ) {}
    // @ViewChild('videoElement', { static: false })
    // videoElement!: ElementRef<HTMLVideoElement>;
    // capturedImage: string | null = null;
    isFooterFixed: boolean = false;
    sidebarFormGroup(): FormGroup {
        return this.formBuilder.group({
            fixedFooter: [this.isFooterFixed],
        });
    }
    ngAfterViewInit() {
        // this.startCamera();
    }

    // startCamera() {
    //     navigator.mediaDevices
    //         .getUserMedia({ video: true })
    //         .then((stream) => {
    //             if (this.videoElement) {
    //                 this.videoElement.nativeElement.srcObject = stream;
    //             }
    //         })
    //         .catch((error) => {
    //             console.error('Error accessing camera:', error);
    //         });
    // }

    // captureImage() {
    //     const canvas = document.createElement('canvas');
    //     canvas.width = this.videoElement.nativeElement.videoWidth;
    //     canvas.height = this.videoElement.nativeElement.videoHeight;
    //     const context = canvas.getContext('2d');
    //     if (context) {
    //         context.drawImage(this.videoElement.nativeElement, 0, 0, 300, 300);
    //         this.capturedImage = canvas.toDataURL('image/png'); // Convert the canvas to a base64-encoded image
    //     }
    // }
}
