import { Component, Input } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';
import { MenuService } from '../app.menu.service';
import { MenuItem } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
interface City {
    name: string;
    code: string;
}
interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}
@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html',
    styleUrls: ['./app.config.component.scss'],
})
export class AppConfigComponent {
    @Input() minimal: boolean = false;
    sidenavChk: boolean = false;
    paginationChecked: boolean = false;
    scales: number[] = [12, 13, 14, 15, 16];
    nestedActionitems = [
        {
            label: 'Upload',
            icon: 'pi pi-upload',
            items: [
                {
                    label: 'Preview',
                    icon: 'pi pi-window-maximize',
                    command: () => {},
                },
                {
                    label: 'Save',
                    icon: 'pi pi-save',
                    command: () => {},
                },
            ],
        },
        {
            label: 'Templates',
            icon: 'pi pi-th-large',
            items: [
                {
                    label: 'Template1',
                    icon: 'pi pi-th-large',
                    command: () => {},
                },
                {
                    label: 'Template2',
                    icon: 'pi pi-th-large',
                    command: () => {},
                },
                {
                    separator: true,
                },
                {
                    label: 'Template3',
                    icon: 'pi pi-th-large',
                    command: () => {},
                },
            ],
        },

        {
            label: 'Users',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Login',
                    icon: 'pi pi-fw pi-user-plus',
                    command: () => {},
                },
                {
                    label: 'Logout',
                    icon: 'pi pi-fw pi-user-minus',
                },
            ],
        },
        {
            label: 'RedirectSites',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Create Gif',
                    icon: 'pi pi-fw pi-user-plus',
                    command: () => {},
                },
                {
                    label: 'Goolge Photos Direct Link',
                    icon: 'pi pi-fw pi-user-minus',
                    command: () => {},
                },
            ],
        },
        {
            separator: true,
        },
        {
            label: 'Quit',
            icon: 'pi pi-fw pi-power-off',
        },
    ];
    constructor(
        public layoutService: LayoutService,
        public menuService: MenuService,
        public router: Router
    ) {}
    goToSettings() {
        this.router.navigate(['/settings']);
    }
    get visible(): boolean {
        return this.layoutService.state.configSidebarVisible;
    }
    set visible(_val: boolean) {
        this.layoutService.state.configSidebarVisible = _val;
    }

    get scale(): number {
        return this.layoutService.config().scale;
    }
    set scale(_val: number) {
        this.layoutService.config.update((config) => ({
            ...config,
            scale: _val,
        }));
    }

    get menuMode(): string {
        return this.layoutService.config().menuMode;
    }
    set menuMode(_val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            menuMode: _val,
        }));
    }

    get inputStyle(): string {
        return this.layoutService.config().inputStyle;
    }
    set inputStyle(_val: string) {
        this.layoutService.config().inputStyle = _val;
    }

    get ripple(): boolean {
        return this.layoutService.config().ripple;
    }
    set ripple(_val: boolean) {
        this.layoutService.config.update((config) => ({
            ...config,
            ripple: _val,
        }));
    }

    set theme(val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            theme: val,
        }));
    }
    get theme(): string {
        return this.layoutService.config().theme;
    }

    set colorScheme(val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            colorScheme: val,
        }));
    }
    get colorScheme(): string {
        return this.layoutService.config().colorScheme;
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    changeTheme(theme: string, colorScheme: string) {
        this.theme = theme;
        this.colorScheme = colorScheme;
    }

    decrementScale() {
        this.scale--;
    }

    incrementScale() {
        this.scale++;
    }
    recentActionCall() {}
    items: MenuItem[];

    ngOnInit() {
        this.formGroup = new FormGroup({
            selectedCountry: new FormControl<object | null>(null),
        });
        this.cities = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' },
        ];
        // this.items = [
        //     {
        //         label: 'Mail',
        //         icon: 'pi pi-envelope',
        //         badge: '5',
        //         items: [
        //             {
        //                 label: 'Compose',
        //                 icon: 'pi pi-file-edit',
        //                 shortcut: '⌘+N',
        //                 items: [
        //                     {
        //                         label: 'Profile',
        //                         icon: 'pi pi-user',
        //                         shortcut: '⌘+W',
        //                         items: [
        //                             {
        //                                 label: 'Settings',
        //                                 icon: 'pi pi-cog',
        //                                 shortcut: '⌘+O',
        //                             },
        //                             {
        //                                 label: 'Privacy',
        //                                 icon: 'pi pi-shield',
        //                                 shortcut: '⌘+P',
        //                             },
        //                             {
        //                                 label: 'Switch Option',
        //                                 icon: 'pi pi-fw pi-cog',
        //                                 template: (item) => {
        //                                     return `
        //                                     <div class="p-field-checkbox">
        //                                       <p-inputSwitch [(ngModel)]="switchValue"></p-inputSwitch>
        //                                       <label for="switch">Enable Option</label>
        //                                     </div>
        //                                   `;
        //                                 },
        //                             },
        //                         ],
        //                     },
        //                 ],
        //             },
        //             {
        //                 label: 'Inbox',
        //                 icon: 'pi pi-inbox',
        //                 badge: '5',
        //                 template: (item) => {
        //                     return `
        //                     <div class="p-field-checkbox">
        //                       <p-inputSwitch [(ngModel)]="switchValue"></p-inputSwitch>
        //                       <label for="switch">Enable Option</label>
        //                     </div>
        //                   `;
        //                 },
        //             },
        //             {
        //                 label: 'Sent',
        //                 icon: 'pi pi-send',
        //                 shortcut: '⌘+S',
        //                 items: [],
        //             },
        //             {
        //                 label: 'Trash',
        //                 icon: 'pi pi-trash',
        //                 shortcut: '⌘+T',
        //                 items: [],
        //             },
        //         ],
        //     },
        //     {
        //         label: 'Reports',
        //         icon: 'pi pi-chart-bar',
        //         shortcut: '⌘+R',
        //         items: [
        //             {
        //                 label: 'Sales',
        //                 icon: 'pi pi-chart-line',
        //                 badge: '3',
        //             },
        //             {
        //                 label: 'Products',
        //                 icon: 'pi pi-list',
        //                 badge: '6',
        //             },
        //         ],
        //     },
        // ];
    }
    countries: any[] | undefined;

    formGroup: FormGroup | undefined;

    filteredCountries: any[] | undefined;

    filterCountry(event: AutoCompleteCompleteEvent) {
        let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < (this.countries as any[]).length; i++) {
            let country = (this.countries as any[])[i];
            if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }

        this.filteredCountries = filtered;
    }

    toggleAll() {
        const expanded = !this.areAllItemsExpanded();
        this.items = this.toggleAllRecursive(this.items, expanded);
    }

    private toggleAllRecursive(
        items: MenuItem[],
        expanded: boolean
    ): MenuItem[] {
        return items.map((menuItem) => {
            menuItem.expanded = expanded;
            if (menuItem.items) {
                menuItem.items = this.toggleAllRecursive(
                    menuItem.items,
                    expanded
                );
            }
            return menuItem;
        });
    }

    private areAllItemsExpanded(): boolean {
        return this.items.every((menuItem) => menuItem.expanded);
    }

    cities: City[] | undefined;

    selectedCity: City | undefined;
}
