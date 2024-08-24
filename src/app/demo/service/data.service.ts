import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root',
})
export class DataService {
    constructor() {}
    getData() {
        return [
            {
                itemImageSrc:
                    'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg',
                thumbnailImageSrc:
                    'https://primefaces.org/cdn/primeng/images/galleria/galleria1.jpg',
                alt: 'Description for Image 1',
                title: 'Title 1',
            },
            {
                itemImageSrc:
                    'https://primefaces.org/cdn/primeng/images/galleria/galleria2.jpg',
                thumbnailImageSrc:
                    'https://primefaces.org/cdn/primeng/images/galleria/galleria2s.jpg',
                alt: 'Description for Image 2',
                title: 'Title 2',
            },
        ];
    }

    getImages() {
        return Promise.resolve(this.getData());
    }
}
