// storage.service.ts
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    constructor(private storage: AngularFireStorage) {}

    // List all files in a specified directory
    listFiles(directory: string): Observable<string[]> {
        const ref = this.storage.ref(directory);
        return ref
            .listAll()
            .pipe(map((result) => result.items.map((item) => item.name)));
    }

    // Download file
    downloadFile(filePath: string): Observable<string> {
        const ref = this.storage.ref(filePath);
        return ref.getDownloadURL();
    }
    downloadFileAsBlob(filePath: string): Observable<Blob> {
        const ref = this.storage.ref(filePath);
        console.log('ref====>', ref);
        console.log('ref.getDownloadURL====>', ref.getDownloadURL());
        return ref.getDownloadURL().pipe(
            tap((url) => console.log('Download URL:', url)), // Log the URL
            switchMap((url) =>
                fetch(url).then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! status: ${response.status}`
                        );
                    }
                    return response.blob();
                })
            ),
            catchError((error) => {
                console.error('Error downloading file:', error);
                return throwError(() => new Error('Failed to download file.'));
            })
        );
    }
}
