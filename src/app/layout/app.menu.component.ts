import { Input, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { ReactService } from './service/react.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    oldmodel: any[] = [];
    menu: any[] = [];
    groupedData: any[] = [];
    @Input() model: any[] = [];

    constructor(
        public layoutService: LayoutService,
        private reactService: ReactService
    ) {
        this.reactService.menu$.subscribe((menu) => {
            if (menu) {
                this.groupedData = [];
                this.groupedData = menu;
                this.initializeSideNav();
            }
        });
    }
    scrollToSection(categoryIndex: number, subCategoryIndex: number) {
        this.reactService.setSectionNav({
            categoryIndex: categoryIndex,
            subCategoryIndex: subCategoryIndex,
        });
    }

    ngOnInit() {}

    initializeSideNav() {
        this.model = [];
        this.groupedData.forEach((category, i) => {
            const categoryItem = {
                label: category.category,
                icon: 'pi pi-fw pi-folder',
                items: category.subCategories.map((subCategory, j) => ({
                    label: subCategory.subCategory,
                    icon: 'pi pi-fw pi-file',
                    command: () => this.scrollToSection(i, j),
                })),
            };
            this.model.push(categoryItem);
        });
    }
}
