import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-footer',
    templateUrl: './app.footer.component.html',
    styleUrls: ['./app.footer.component.scss'],
})
export class AppFooterComponent {
    first: number = 10;
    rows: number = 3;
    paginationChecked: boolean = false;
    footerForm: FormGroup = this.footerFormGroup();
    isFooterFixed: boolean = false;
    hideFooter: boolean = true;
    constructor(
        public layoutService: LayoutService,
        public formBuilder: FormBuilder
    ) {}
    onPageChange(event: any) {}
    footerFormGroup(): FormGroup {
        return this.formBuilder.group({
            fixedFooter: [this.isFooterFixed],
        });
    }
    onFixFooterChange() {}

    ngOnInit() {
        this.footerForm.get('fixedFooter').valueChanges.subscribe((value) => {
            this.isFooterFixed = value;
            this.toggleFooterPosition();
        });
    }

    toggleFooterPosition() {
        this.hideFooter = true;
        const footerElement = document.querySelector('.layout-footer');
        if (this.isFooterFixed) {
            footerElement.classList.add('fixed-footer');
            footerElement.classList.remove('scroll-footer');
        } else {
            footerElement.classList.remove('fixed-footer');
            footerElement.classList.add('scroll-footer');
        }
    }
}
