import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
    DomSanitizer,
    SafeHtml,
    SafeResourceUrl,
} from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ReactService } from 'src/app/layout/service/react.service';
import { CardModule } from 'primeng/card';
import { StringOperationPipe } from 'src/app/pipes/string-operation.pipe';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface GroupedData {
    category: string;
    subCategories: Array<{
        subCategory: string;
        contents: (SafeHtml | string[])[];
    }>;
}
@Component({
    selector: 'app-tracking-app',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        StringOperationPipe,
        ButtonModule,
        DialogModule,
        InputTextModule,
    ],
    templateUrl: './tracking-app.component.html',
    styleUrl: './tracking-app.component.scss',
})
export class TrackingAppComponent {
    fileSubscription: Subscription = new Subscription();
    @Input() data: any[] = [];
    cards: any[] = [];
    groupedData: GroupedData[] = [];
    visible: boolean = false;
    keyNames: string[] = [];
    dynamicForm: FormGroup;
    constructor(
        private reactService: ReactService,
        private sanitizer: DomSanitizer,
        private fb: FormBuilder
    ) {
        this.dynamicForm = this.fb.group({});
        this.fileSubscription = this.reactService.file$.subscribe((data) => {
            if (data) {
                this.data = data.excelContents;
                console.log('this.data==>', this.data);
                debugger;
                this.groupData();
            }
        });
    }
    ngOnInit() {
        // this.setData();
    }
    groupData() {
        debugger;
        const categoryMap = new Map<
            string,
            Map<string, (SafeHtml | string[])[]>
        >();
        this.data.forEach((item) => {
            let snoSet: string[] = [];
            let category: string = '';
            let subCategory: string = '';
            let innerHeader: SafeHtml[] = [];
            let headerNote: SafeHtml[] = [];
            let detail: SafeHtml[] = [];
            let sideNote: SafeHtml[] = [];
            let value: SafeHtml[] = [];
            this.keyNames = Object.keys(item);
            Object.keys(item).forEach((key) => {
                let keyName = key.toLowerCase().trim();
                if (keyName.toLowerCase().includes('xlcategory')) {
                    category = item[key];
                } else if (keyName.toLowerCase().includes('xlsubcategory')) {
                    subCategory = item[key];
                } else {
                    if (keyName.toLowerCase().includes('xlsno')) {
                        if (item[key]) {
                            snoSet.push(item[key]);
                        }
                    } else if (
                        keyName.toLowerCase().includes('xlinnerheader')
                    ) {
                        if (item[key]?.trim().toLowerCase() != 'x') {
                            let safehtml: SafeHtml =
                                this.sanitizer.bypassSecurityTrustHtml(
                                    this.applyStyle(
                                        `<span class='font-bold'>`,
                                        this.getValueFromSplit(key, 1),
                                        `<span>`
                                    ) +
                                        ' : ' +
                                        item[key].replace(/\r\n/g, '</br>')
                                );
                            innerHeader.push(safehtml);
                        }
                    } else if (keyName.toLowerCase().includes('xlheadernote')) {
                        if (item[key]?.trim().toLowerCase() != 'x') {
                            let safehtml: SafeHtml =
                                this.sanitizer.bypassSecurityTrustHtml(
                                    item[key].replace(/\r\n/g, '</br>')
                                );
                            headerNote.push(safehtml);
                        }
                    } else if (keyName.toLowerCase().includes('xldetail')) {
                        if (item[key]?.trim().toLowerCase() != 'x') {
                            let detailArr: string[] = item[key]
                                .replace(/\r\n/g, '</br>')
                                .split('!!!');
                            detailArr.forEach((code: any) => {
                                detail.push(
                                    this.applyStyle(
                                        `<span class='font-bold'>`,
                                        this.getValueFromSplit(key, 1),
                                        `<span>`
                                    ) +
                                        ' : ' +
                                        code
                                );
                            });
                        }
                    } else if (keyName.toLowerCase().includes('xlsidenote')) {
                        console.log('item[key]===>', item[key]);
                        if (item[key]?.trim().toLowerCase() != 'x') {
                            let sideNoteArr: string[] = item[key]
                                .replace(/\r\n/g, '</br>')
                                .split('!!!');
                            sideNoteArr.forEach((code: any) => {
                                sideNote.push(code);
                            });
                        }
                    } else if (keyName.toLowerCase().includes('xlvalue')) {
                        value.push(item[key]);
                    }
                }
            });
            if (!categoryMap.has(category)) {
                categoryMap.set(
                    category,
                    new Map<string, (SafeHtml | string[])[]>()
                );
            }
            const subCategoryMap = categoryMap.get(category)!;
            if (!subCategoryMap.has(subCategory)) {
                subCategoryMap.set(subCategory, []);
            }
            subCategoryMap.get(subCategory)!.push({
                snoSet: snoSet,
                innerHeader: innerHeader,
                headerNote: headerNote,
                detail: detail,
                sideNote: sideNote,
                value: value,
            });
        });
        // Convert Map to Array while preserving order
        this.groupedData = Array.from(categoryMap.entries()).map(
            ([category, subCategoryMap]) => ({
                category,
                subCategories: Array.from(subCategoryMap.entries()).map(
                    ([subCategory, contents]) => ({
                        subCategory,
                        contents,
                    })
                ),
            })
        );
        this.keyNamesUpdate();
        this.reactService.setMenu(this.groupedData);
    }
    applyStyle(styleStart: string, text: string, styleEnd: string) {
        return `<span class='font-bold'>` + text + `<span>`;
    }
    getValueFromSplit(getStr: string, index: number) {
        let retStr = getStr.split('|');
        return retStr[index];
    }
    onAddClick() {
        this.visible = true;
    }
    keyNamesUpdate() {
        let corrected: string[] = [];
        this.keyNames.forEach((name: string) => {
            corrected.push(this.getValueFromSplit(name, 1));
        });
        this.keyNames = corrected;
        this.addControls();
    }

    onEdit(content: any) {}
    addControls() {
        this.keyNames.forEach((control) => {
            this.dynamicForm.addControl(
                control,
                this.fb.control('', Validators.required) // Add validators as needed
            );
        });
    }
    saveData() {
        if (this.dynamicForm.valid) {
            console.log(this.dynamicForm.value);
        } else {
            console.log('Form is invalid');
        }
    }
}
