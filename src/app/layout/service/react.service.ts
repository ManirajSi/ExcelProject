import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class ReactService {
    constructor() {}
    private fileSubject = new BehaviorSubject<any | null>(null);
    file$ = this.fileSubject.asObservable();

    private menuSubject = new BehaviorSubject<any | null>(null);
    menu$ = this.menuSubject.asObservable();

    private sectionNavSubject = new BehaviorSubject<any | null>(null);
    sectionNav$ = this.sectionNavSubject.asObservable();

    private headerSearchSubject = new BehaviorSubject<any | null>(null);
    headerSearch$ = this.headerSearchSubject.asObservable();

    private loginInfoSubject = new BehaviorSubject<any | null>(null);
    loginInfo$ = this.loginInfoSubject.asObservable();

    setFile(file: any): void {
        this.fileSubject.next(file);
    }
    setMenu(menu: any): void {
        this.menuSubject.next(menu);
    }
    setSectionNav(navData: any): void {
        this.sectionNavSubject.next(navData);
    }
    setHeaderSearchSubject(searchData: any): void {
        this.headerSearchSubject.next(searchData);
    }
    setLoginInfo(loginInfo: any): void {
        this.loginInfoSubject.next(loginInfo);
    }
}
