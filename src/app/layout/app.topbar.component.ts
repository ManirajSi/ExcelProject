import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import * as XLSX from 'xlsx';
import { ReactService } from './service/react.service';
@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {
    items!: MenuItem[];
    workSheetNames: string[] = [];
    workSheets: any[] = [];
    workSheetsJSON: any[] = [];
    menuItems: MenuItem[] = [];
    @ViewChild('fileUpload') fileUpload: any;
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;
    webLogo: string = '';
    webName: string = '';
    constructor(
        public layoutService: LayoutService,
        private reactService: ReactService
    ) {}
    onUploadClick() {
        this.fileUpload.basicFileInput.nativeElement.click();
    }
    onFileSelect(ref: any, event: any) {
        const file: File = event.files[0];
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
            this.workSheetNames = wb.SheetNames;
            let count = 0;
            this.workSheetNames.forEach((workSheet: string) => {
                const ws: XLSX.WorkSheet = wb.Sheets[workSheet];
                this.workSheets.push(ws);
                this.workSheetsJSON.push(XLSX.utils.sheet_to_json(ws));
                if (count > 0) {
                    this.menuItemForming(workSheet);
                }
                count++;
            });
            this.setExcelPageContent(this.workSheetsJSON[1]);
            this.infoSet();
        };
        reader.readAsBinaryString(file);
        ref.clear();
    }
    infoSet() {
        let specDetail = this.workSheetsJSON[0];
        this.webName = specDetail[0]['Actions'];
        this.webLogo = specDetail[1]['Actions'];
    }
    menuItemForming(menuItemName: string) {
        this.menuItems.push({
            label: menuItemName,
            icon: 'pi pi-star',
            command: () => {
                const index: number = this.workSheetNames.indexOf(menuItemName);
                this.setExcelPageContent(this.workSheetsJSON[index]);
            },
        });
    }

    setExcelPageContent(content: any) {
        this.reactService.setFile({
            excelContents: content,
            specInfo: { contentLabel: ['content'] },
        });
    }
}
