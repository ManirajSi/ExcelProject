import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';

@Component({
    templateUrl: './documentation.component.html',
    styleUrls: ['./documentation.component.scss'],
})
export class DocumentationComponent {
    items: MenuItem[] | undefined;
    ngOnInit() {
        this.items = [
            {
                separator: true,
            },
            {
                label: 'Documents',
                items: [
                    {
                        label: 'New',
                        icon: 'pi pi-plus',
                        shortcut: '⌘+N',
                    },
                    {
                        label: 'Search',
                        icon: 'pi pi-search',
                        shortcut: '⌘+S',
                    },
                ],
            },
            {
                label: 'Profile',
                items: [
                    {
                        label: 'Settings',
                        icon: 'pi pi-cog',
                        shortcut: '⌘+O',
                    },
                    {
                        label: 'Messages',
                        icon: 'pi pi-inbox',
                        badge: '2',
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-sign-out',
                        shortcut: '⌘+Q',
                    },
                ],
            },
            {
                separator: true,
            },
        ];
    }
}
