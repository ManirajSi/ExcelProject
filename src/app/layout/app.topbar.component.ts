import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import * as XLSX from 'xlsx';
import { ReactService } from './service/react.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, map, switchMap } from 'rxjs/operators';
import { StorageService } from './service/storage.service';
import { HttpClient } from '@angular/common/http';
import * as ExcelJS from 'exceljs';
import { SettingsConst } from '../language/common.constants';
import { settingState } from '../store/state';
import { Store } from '@ngrx/store';
import { updateSettingsInfo } from '../store/actions';
import { ExcelService } from '../services/excel.service';
@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrl: './app.topbar.component.scss',
    providers: [MessageService],
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
    webName: string = 'Excelend Site';
    sideBarButton: any = { show: true };
    filteredItems: any[];
    selectedItem: any;
    isLoggedIn: boolean = false;
    autoCompleteitems = [];
    selectedAction: string = 'Template1';
    speedDialitems = [
        {
            icon: 'pi pi-download',
            command: () => {},
        },
        {
            icon: 'pi pi-refresh',
            command: () => {},
        },
        {
            icon: 'pi pi-trash',
            command: () => {},
        },
        {
            icon: 'pi pi-upload',
            routerLink: ['/fileupload'],
        },
        {
            icon: 'pi pi-external-link',
            target: '_blank',
            url: 'http://angular.io',
        },
    ];
    nestedActionitems = [
        {
            label: 'Upload',
            icon: 'pi pi-upload',
            command: () => {},
            items: [
                {
                    label: 'Preview',
                    icon: 'pi pi-window-maximize',
                    command: () => {
                        this.browseSelectFile();
                    },
                },
                {
                    label: 'Save',
                    icon: 'pi pi-save',
                    command: () => {
                        if (!this.selectedFile) {
                            this.showToast(2, 'File not selected for saving');
                            this.browseSelectFile();
                        } else {
                            if (
                                localStorage.getItem('email') ==
                                    'test@mail.com' &&
                                localStorage.getItem('password') == 'test123'
                            ) {
                                this.saveConfimration();
                            } else {
                                this.showToast(
                                    2,
                                    'Please login to save the file'
                                );
                            }
                        }
                    },
                },
            ],
        },
        {
            label: 'Templates',
            icon: 'pi pi-th-large',
            items: [
                {
                    label: 'AllInOne',
                    icon: 'pi pi-th-large',
                    command: () => {
                        this.selectedAction = 'Template1';
                        this.dowloadTemplate('AllInOne');
                    },
                },
                {
                    separator: true,
                },
                {
                    label: 'WebContent',
                    icon: 'pi pi-th-large',
                    command: () => {
                        this.selectedAction = 'Template3';
                        this.showToast(2, 'Template under construction');
                        //this.dowloadTemplate('Template3');
                    },
                },
                {
                    label: 'Q&A',
                    icon: 'pi pi-th-large',
                    command: () => {
                        this.selectedAction = 'Template2';
                        this.showToast(2, 'Template under construction');
                    },
                },
                {
                    label: 'TrumpCard',
                    icon: 'pi pi-th-large',
                    command: () => {
                        this.selectedAction = 'Template2';
                        this.showToast(2, 'Template under construction');
                    },
                },
            ],
        },
        {
            label: 'RedirectSites',
            icon: 'pi pi-fw pi-directions',
            items: [
                {
                    label: 'Create Gif',
                    icon: 'pi pi-fw pi-user-plus',
                    command: () => {
                        this.urlRedirection('https://ezgif.com/maker');
                    },
                },
                {
                    label: 'Goolge Photos Direct Link',
                    icon: 'pi pi-fw pi-user-minus',
                    command: () => {
                        this.urlRedirection(
                            'https://www.labnol.org/embed/google/photos/'
                        );
                    },
                },
                {
                    label: 'imgur Link for gif and image',
                    icon: 'pi pi-fw pi-user-minus',
                    command: () => {
                        this.urlRedirection('https://imgur.com/');
                    },
                },
            ],
        },
        {
            separator: true,
        },
        {
            label: 'Users',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Login',
                    icon: 'pi pi-fw pi-user-plus',
                    command: () => {
                        this.loginRedirect();
                    },
                },
                {
                    label: 'Logout',
                    icon: 'pi pi-fw pi-user-minus',
                    command: () => {
                        localStorage.removeItem('email');
                        localStorage.removeItem('password');
                    },
                },
            ],
        },
    ];
    loginSubscription: Subscription = new Subscription();
    selectedExcelInfoSubscription: Subscription = new Subscription();
    filePath: string;
    downloadURL: string;
    files: string[] = [];
    directory = 'excel';
    excelData: any;
    recetAction: string = 'Upload';
    selectedFile: File = new File([], '');
    selectedFileEvent: any;
    visible: boolean = false;
    dialogboxContent: string[] = [];
    dialogAction: string = 'save';
    templateSettings: any;
    sheets: any[] = [];
    templateSetting: any;
    constructor(
        public layoutService: LayoutService,
        private reactService: ReactService,
        private storage: AngularFireStorage,
        private storageService: StorageService,
        private router: Router,
        private http: HttpClient,
        private messageService: MessageService,
        private excelService: ExcelService,
        private store: Store<{ settingsInfo: settingState }>
    ) {
        this.loginSubscription = this.reactService.loginInfo$.subscribe(
            (data) => {
                if (data) {
                    this.isLoggedIn = data.isLoggedIn;
                }
            }
        );
        this.selectedExcelInfoSubscription =
            this.reactService.selectedExcelInfo$.subscribe((data) => {
                if (data) {
                    this.downloadAndReadFile(data.fileName);
                }
            });
    }
    ngOnInit() {
        this.loadFiles();
    }
    urlRedirection(url: string) {
        window.open(url, '_blank');
    }
    gotoHome() {
        this.router.navigate(['']);
    }
    recentActionCall() {
        this.browseSelectFile();
        // switch (this.recetAction) {
        //     case 'Preview':
        //         this.browseSelectFile();
        //         break;
        //     case 'Save':
        //         if (this.isLoggedIn) {
        //             this.saveConfimration();
        //         }
        //         break;
        //     case 'Download':
        //         this.downloadFile(this.selectedItem.name);
        //         break;
        //     case 'Search':
        //         this.onSearchClick();
        //         break;
        //     default:
        //         break;
        // }
    }
    browseSelectFile() {
        this.fileUpload.basicFileInput.nativeElement.click();
    }
    fileSelectAndPreview(ref: any, event: any) {
        this.sideBarButton.show = true;
        const file: File = event.files[0];
        this.selectedFile = file;
        this.selectedFileEvent = event;
        this.workSheetNames = [];
        this.workSheets = [];
        this.workSheetsJSON = [];
        this.sheets = [];
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
            this.readFiles(wb);
        };
        reader.readAsBinaryString(file);
        this.excelService.loadExcelFile(file);
        ref.clear();
    }
    readFiles(wb: any) {
        this.workSheetNames = wb.SheetNames;
        let count = 0;
        let worksheetIndex: number = 0;
        this.menuItems = [];
        this.workSheetNames.forEach((workSheet: string) => {
            const ws: XLSX.WorkSheet = wb.Sheets[workSheet];
            this.workSheets.push(ws);
            if (
                worksheetIndex == 0 &&
                workSheet.toLowerCase() == 'templatesettings'
            ) {
                sessionStorage.setItem(
                    'templateSetting',
                    JSON.stringify(XLSX.utils.sheet_to_json(ws))
                );
                this.templateSettings = XLSX.utils.sheet_to_json(ws);
                this.templateSettings.forEach((rowdata: any) => {
                    if (rowdata.XLKeys.toLowerCase().includes('sheet')) {
                        try {
                            this.sheets.push(JSON.parse(rowdata['XLValues']));
                        } catch {
                            this.showToast(
                                2,
                                'Please check the Template Settings sheet unable to Parse sheet information "!..Check any ,,COMMOS,, missed or Miss placed at last..!" '
                            );
                        }
                    }
                });
            }
            let renamedJson = this.renameKeys(
                XLSX.utils.sheet_to_json(ws),
                worksheetIndex
            );
            this.workSheetsJSON.push(renamedJson);
            if (count > 0) {
                this.menuItemForming(workSheet);
            }
            count++;
            worksheetIndex++;
        });
        // wb.SheetNames.forEach((sheetName) => {
        //     const worksheet = wb.Sheets[sheetName];
        //     const sheetId = wb.SheetNames.indexOf(sheetName);
        //     const sheetData: any[] = [];
        //     worksheet.eachRow((row, rowIndex) => {
        //         const rowData: any = {};
        //         row.eachCell((cell, colNumber) => {
        //             let cellValue = cell.text;
        //             if (cell.font && cell.font.bold) {
        //                 cellValue = `<b>${cellValue}</b>`;
        //             }
        //             rowData[`Column${colNumber}`] = cellValue;
        //         });
        //         sheetData.push(rowData);
        //     });
        // });
        // this.store.dispatch(
        //     updateSettingsInfo({ settingsInfo: this.workSheetsJSON[0] })
        // );
        this.store.dispatch(updateSettingsInfo({ settingInfo: { count: 1 } }));
        this.setExcelPageContent(this.workSheetsJSON[1], 1);
        this.infoSet();
    }
    setSettingInfo(content: any) {
        SettingsConst.excelInput = content;
    }
    renameKeys(jsonData: any, sheetIndex: number) {
        let newJsonData = [];
        let templcols: any[] = [];
        if (sheetIndex != 0) {
            sheetIndex = sheetIndex - 1;
            templcols = this.sheets[sheetIndex]['Columns'];
            jsonData.forEach((row, rowIndex) => {
                const newRow = {};
                let colIndex = 0;
                for (const key in row) {
                    try {
                        const newKey = `col${colIndex}|${key}|${templcols[colIndex]['type']}`;
                        newRow[newKey] = row[key];
                        colIndex++;
                    } catch {
                        this.showToast(
                            2,
                            'Please check the Template Settings sheet in excel some of the columns may not defined'
                        );
                    }
                }
                newJsonData.push(newRow);
            });
        } else {
            newJsonData = jsonData;
        }
        return newJsonData;
    }
    saveConfimration() {
        let content = ['Are you sure you want to save the file?'];
        this.dialogAction = 'save';
        this.showDialog(content);
    }
    saveFileInCloud() {
        const file = this.selectedFileEvent.currentFiles[0];
        const filePath = `excel/${file.name}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);
        task.snapshotChanges()
            .pipe(
                finalize(() => {
                    fileRef.getDownloadURL().subscribe((url) => {
                        this.downloadURL = url;
                        this.showToast(1, 'File saved successfully');
                    });
                })
            )
            .subscribe();
    }
    loadFiles() {
        this.autoCompleteitems = [];
        this.storageService.listFiles(this.directory).subscribe((files) => {
            this.files = files;
            this.files.forEach((file: any) => {
                this.autoCompleteitems.push({ name: file });
            });
        });
    }
    downloadAndReadFile(filename: string) {
        const filePath = `${this.directory}/${filename}`;
        this.storageService.downloadFileAsBlob(filePath).subscribe((blob) => {
            const reader = new FileReader();
            this.workSheetNames = [];
            this.workSheets = [];
            this.workSheetsJSON = [];
            reader.onload = (e: any) => {
                const bstr: string = e.target.result;
                const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
                this.readFiles(wb);
            };
            reader.readAsBinaryString(blob);
        });
    }
    downloadFile(filename: string) {
        const filePath = `${this.directory}/${filename}`;
        this.storageService.downloadFile(filePath).subscribe((url) => {
            window.open(url, '_blank');
        });
    }
    infoSet() {
        let specDetail = this.workSheetsJSON[0];
        this.webName = specDetail[0]['Actions'];
        this.webLogo = specDetail[1]['Actions'];
    }
    menuItemForming(menuItemName: string) {
        this.templateSetting = JSON.parse(
            sessionStorage.getItem('templateSetting')
        );
        this.menuItems.push({
            label: menuItemName,
            icon: 'pi pi-fw pi-file',
            command: () => {
                const index: number = this.workSheetNames.indexOf(menuItemName);
                this.setExcelPageContent(this.workSheetsJSON[index], index);
            },
        });
    }
    setExcelPageContent(content: any, index: number) {
        try {
            let xlvaues = JSON.parse(
                this.templateSetting[0].XLValues.replace(/'/g, '"').replace(
                    /(\w+):/g,
                    '"$1":'
                )
            );
            let contentType = xlvaues['Sheet' + index];
            this.reactService.setFile({
                excelContents: content,
                specInfo: { contentLabel: contentType.toLowerCase() },
            });
        } catch (e) {
            this.showToast(
                2,
                'In the TemplateSetting sheet JSON format issue, Please check is any additional Commas at last'
            );
        }
    }
    loginRedirect() {
        this.router.navigate(['login']);
    }
    searchItems(event: any) {
        const query = event.query.toLowerCase();
        this.filteredItems = this.autoCompleteitems.filter((item) =>
            item.name.toLowerCase().includes(query)
        );
    }
    onSearchClick() {
        let selectedFiles: any[] = [];
        this.files.forEach((file: any) => {
            if (file.includes(this.selectedItem.name)) {
                selectedFiles.push(file);
            }
        });
        this.reactService.setHeaderSearchSubject({
            searchTags: this.selectedItem,
            selectedFiles: selectedFiles,
        });
    }
    dowloadTemplate(templateName: string) {
        let directory = 'templates';
        const filePath = `${directory}/${templateName}.xlsx`;
        this.storageService.downloadFile(filePath).subscribe((url) => {
            window.open(url, '_self');
        });
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
    showDialog(content: string[] = []) {
        this.dialogboxContent = content;
        this.visible = true;
    }
    dialogConfirm() {
        if (this.dialogAction === 'save') {
            this.saveFileInCloud();
        }
        this.visible = false;
    }
    ngOnDestroy(): void {
        this.loginSubscription.unsubscribe();
        this.selectedExcelInfoSubscription.unsubscribe();
    }
}
