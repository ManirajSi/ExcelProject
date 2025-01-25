import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { SettingsConst } from 'src/app/language/common.constants';
import { Store } from '@ngrx/store';
import { settingState } from '../../store/state';
import {
    updateSettingsInfo,
    //countUpdateInfo
} from '../../store/actions';
import { tap } from 'rxjs';
@Component({
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
    items: MenuItem[] | undefined;
    paginationChecked: boolean = false;
    sidenavChk: boolean = false;
    // setting$ = this.store.select((state: settingState) => state.settingInfo);
    setting$ = this.store.select((state: any) => state.settings.settingInfo);
    constructor(private store: Store<settingState>) {
        this.setting$
            .pipe(
                tap((settingsInfo) => {
                    console.log('settingsInfo:', settingsInfo);
                })
            )
            .subscribe((settingsInfo) => {
                console.log('settingsInfo:', settingsInfo); // This will log the actual count value
            });
    }
    increment() {
        this.store.dispatch(updateSettingsInfo({ settingInfo: { count: 1 } }));
        // this.store.dispatch(countUpdateInfo({ count: 10 }));
    }

    onSwitch() {
        console.log(' setting$1 ', this.setting$);
        this.increment();
        console.log(' setting$2 ', this.setting$);
    }
    ngOnInit() {
        // this.setting$
        //     .pipe(
        //         tap((settingsInfo) => {
        //
        //             console.log('settingsInfo:', settingsInfo);
        //         })
        //     )
        //     .subscribe((settingsInfo) => {
        //
        //         console.log('settingsInfo:', settingsInfo); // This will log the actual count value
        //     });

        this.items = [
            {
                key: '0',
                label: 'Users',
                icon: 'pi pi-users',
                items: [
                    {
                        key: '0_1',
                        label: 'New',
                        items: [
                            {
                                key: '0_1_0',
                                label: 'Member',
                            },
                            {
                                key: '0_1_1',
                                label: 'Group',
                            },
                        ],
                    },
                    {
                        key: '0_2',
                        label: 'Search',
                    },
                ],
            },
            {
                key: '1',
                label: 'Tasks',
                icon: 'pi pi-server',
                items: [
                    {
                        key: '1_0',
                        label: 'Add New',
                    },
                    {
                        key: '1_1',
                        label: 'Pending',
                    },
                    {
                        key: '1_2',
                        label: 'Overdue',
                    },
                ],
            },
            {
                key: '2',
                label: 'Calendar',
                icon: 'pi pi-calendar',
                items: [
                    {
                        key: '2_0',
                        label: 'New Event',
                    },
                    {
                        key: '2_1',
                        label: 'Today',
                    },
                    {
                        key: '2_2',
                        label: 'This Week',
                    },
                ],
            },
        ];
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
}
