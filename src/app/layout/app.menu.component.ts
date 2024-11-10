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
    first = 0;
    rows = 5;
    @Input() model: any[] = [];
    tutorialLink: any[] = [];
    showTutorialLink: boolean = true;
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

    ngOnInit() {
        this.tutorialLink = [
            {
                label: 'Advertise',
                link: 'https://www.youtube.com/embed/ritCbHUx18I?si=HIeJYR5eaDpDAwhY',
            },
            {
                label: 'Demo',
                link: 'https://www.youtube.com/embed/-55qPQH1R-E?si=CW2Fkb-X_PXoaPze',
            },
        ];
    }

    initializeSideNav() {
        this.model = [];
        this.groupedData.forEach((category, i) => {
            const categoryItem = {
                label: category.category,
                icon: 'pi pi-fw pi-folder',
                styleClass: 'category-label', // Assign CSS class
                items: category.subCategories.map((subCategory, j) => ({
                    label: subCategory.subCategory,
                    icon: 'pi pi-star',
                    //  styleClass: 'subcategory-label', // Assign CSS class
                    style: { color: '#ff6384' }, // Assign inline style
                    command: () => this.scrollToSection(i, j),
                })),
            };
            this.model.push(categoryItem);
        });
        this.showTutorialLink = false;
    }
    onPageChange(event: any) {}
    onChangeListbox(event: any) {}
}
