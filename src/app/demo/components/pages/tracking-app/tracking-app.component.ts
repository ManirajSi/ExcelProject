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
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ExcelService } from 'src/app/services/excel.service';
import { TabViewModule } from 'primeng/tabview';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

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
        ToastModule,
        ReactiveFormsModule,
        TabViewModule,
        ChartModule,
        DropdownModule,
        FormsModule,
    ],
    templateUrl: './tracking-app.component.html',
    styleUrl: './tracking-app.component.scss',
    providers: [MessageService],
})
export class TrackingAppComponent {
    fileSubscription: Subscription = new Subscription();
    @Input() data: any[] = [];
    cards: any[] = [];
    groupedData: GroupedData[] = [];
    visible: boolean = false;
    keyNames: string[] = [];
    dynamicForm: FormGroup;
    excelData: any[] = [];
    columnKeys: string[] = [];
    subCategorySum: number = 0;
    chartData: any;
    chartOptions: any;
    chartTypes = [
        { label: 'line', value: 'line' },
        { label: 'bar', value: 'bar' },
        { label: 'radar', value: 'radar' },
        { label: 'doughnut', value: 'doughnut' },
        { label: 'pie', value: 'pie' },
        { label: 'polarArea', value: 'polarArea' },
        { label: 'bubble', value: 'bubble' },
        { label: 'scatter', value: 'scatter' },
        { label: 'polarArea', value: 'polarArea' },
    ];
    selectedChartType: string = 'line';
    chartEnable: boolean = true;
    constructor(
        private reactService: ReactService,
        private sanitizer: DomSanitizer,
        private fb: FormBuilder,
        private messageService: MessageService,
        private excelService: ExcelService
    ) {
        this.dynamicForm = this.fb.group({});
        this.fileSubscription = this.reactService.file$.subscribe((data) => {
            if (data) {
                this.data = data.excelContents;
                this.excelData = [];
                this.data.forEach((exData: any) => {
                    let newData: any = {};
                    Object.keys(exData).forEach((key: any) => {
                        let keyname = this.getValueFromSplit(key, 1);
                        if (newData) {
                            newData[keyname] = exData[key];
                        } else {
                            newData = { keyname: exData[key] };
                        }
                    });
                    this.excelData.push(newData);
                });
                this.groupData();
            }
        });
    }
    ngOnInit() {
        this.chartData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
            ],
            datasets: [
                {
                    label: 'My First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: '#42A5F5',
                    tension: 0.4,
                },
                {
                    label: 'My Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    borderColor: '#FFA726',
                    tension: 0.4,
                },
            ],
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Line Chart Example',
                },
            },
        };
    }
    groupData() {
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

    onEdit(content: any) {
        this.visible = true;
    }
    addControls() {
        this.keyNames.forEach((control) => {
            this.dynamicForm.addControl(
                control,
                this.fb.control('', Validators.required) // Add validators as needed
            );
        });
    }
    onTextChange(event: any, key: String) {}
    saveData() {
        if (this.dynamicForm.valid) {
            let newData: any = {};
            this.keyNames.forEach((key: string) => {
                if (newData) {
                    newData[key] = this.dynamicForm.get(key)?.value;
                } else {
                    newData = { key: this.dynamicForm.get(key)?.value };
                }
            });
            this.excelData.push(newData);
            this.excelService.saveExcelFile(this.excelData, 1);
            this.showToast(1, 'Succesfully Saved');
            this.visible = false;
        } else {
            this.showToast(2, 'Please fill all mandatry fields');
        }
    }
    showToast(type: number, message: string) {
        switch (type) {
            case 1:
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: message,
                });
                break;
            case 2:
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: message,
                });
                break;
        }
    }
    getType(key: string) {
        let retStr: string = '';
        if (key.toLowerCase() == 'amount' || key.toLowerCase() == 'sno') {
            retStr = 'number';
        } else {
            retStr = 'text';
        }
        return retStr;
    }
    getSumAmount(amount: number, index: number) {
        if (index == 0) {
            this.subCategorySum = 0;
        } else {
            this.subCategorySum = this.subCategorySum + amount;
        }
        return index > 0 ? this.subCategorySum : amount;
        //return this.subCategorySum;
    }
    onTabChange(event: any) {}
    onTypeChange(event: any) {
        this.chartEnable = !this.chartEnable;
        this.selectedChartType = event.value;
    }
}
