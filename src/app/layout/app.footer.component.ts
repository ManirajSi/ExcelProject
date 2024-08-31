import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html',
    styleUrls: ['./app.footer.component.scss'],
})
export class AppFooterComponent {
    first: number = 10;
    rows: number = 3;
    constructor(public layoutService: LayoutService) {}
    onPageChange(event: any) {}
}
