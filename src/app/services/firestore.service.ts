import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FirestoreService {
    constructor(private firestore: AngularFirestore) {}
    // Add data to a collection
    addData(collection: string, data: any) {
        return this.firestore.collection(collection).add(data);
    }

    // Set data with a specific ID
    setData(collection: string, id: string, data: any) {
        return this.firestore.collection(collection).doc(id).set(data);
    }

    // Get all documents in a collection
    getData(collection: string): Observable<any[]> {
        return this.firestore
            .collection(collection)
            .valueChanges({ idField: 'id' });
    }

    // Get a document by ID
    getDataById(collection: string, docId: string): Observable<any> {
        return this.firestore.collection(collection).doc(docId).valueChanges();
    }
}
