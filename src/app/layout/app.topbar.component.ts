import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { SignalTransService } from './service/signal-trans.service';
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
        private signalTransService: SignalTransService,
        private reactService: ReactService
    ) {}
    onUploadClick() {
        this.fileUpload.basicFileInput.nativeElement.click();
    }
    onFileSelect(event: any) {
        const file: File = event.files[0];
        // this.signalTransService.setFile(file);
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
                // if (workSheet.toLowerCase().includes('page')) {
                // const repName = workSheet.split('|')[0];
                if (count > 0) {
                    this.menuItemForming(workSheet);
                }
                count++;
                // }
            });
            console.log('workSheetsJSON===>', this.workSheetsJSON);
            this.setExcelPageContent(this.workSheetsJSON[1]);
            this.infoSet();
            // this.sideNavItemsForming(this.workSheetsJSON[1]);
        };
        reader.readAsBinaryString(file);
    }
    infoSet() {
        let specDetail = this.workSheetsJSON[0];
        this.webName = specDetail[0]['Actions'];
        this.webLogo = specDetail[1]['Actions'];
    }
    // sideNavItemsForming(workSheetJSON: any) {
    //     let sideNavItems = [];
    //     workSheetJSON.forEach((element: any) => {
    //         const label = element['Category'];
    //         const existingItem = sideNavItems.find(
    //             (item) => item.label === label
    //         );
    //         if (existingItem) {
    //             existingItem.items.push({
    //                 label: element['SubCategory'], // Assuming there's a 'SubAction' property or any other appropriate value
    //                 icon: 'pi pi-fw pi-file',
    //                 command: () => {
    //                     console.log('sub-element===>', element);
    //                 },
    //             });
    //         } else {
    //             sideNavItems.push({
    //                 label: label,
    //                 icon: 'pi pi-fw pi-file',
    //                 items: [
    //                     {
    //                         label: element['SubCategory'], // Assuming there's a 'SubAction' property or any other appropriate value
    //                         icon: 'pi pi-fw pi-file',
    //                         command: () => {
    //                             console.log('sub-element===>', element);
    //                         },
    //                     },
    //                 ],
    //                 command: () => {
    //                     console.log('element===>', element);
    //                 },
    //             });
    //         }
    //     });
    //     // console.log('sideNavItems===>', sideNavItems);
    //     // this.reactService.setMenu(sideNavItems);
    // }
    menuItemForming(menuItemName: string) {
        this.menuItems.push({
            label: menuItemName,
            icon: 'pi pi-star',
            command: () => {
                debugger;
                const index: number = this.workSheetNames.indexOf(menuItemName);
                console.log('this.workSheetNames===>', this.workSheetNames);
                console.log('index===>', index);
                console.log(
                    'this.workSheetsJSON[index]===>',
                    this.workSheetsJSON[index]
                );
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
