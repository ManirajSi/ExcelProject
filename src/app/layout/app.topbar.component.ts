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
    sideBarButton: any = { show: false };
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
                            if (this.isLoggedIn) {
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
                    label: 'Template1',
                    icon: 'pi pi-th-large',
                    command: () => {
                        this.selectedAction = 'Template1';
                        this.dowloadTemplate('Template1');
                    },
                },
                {
                    label: 'Template2',
                    icon: 'pi pi-th-large',
                    command: () => {
                        this.selectedAction = 'Template2';
                        this.dowloadTemplate('Template2');
                    },
                },
                {
                    separator: true,
                },
                {
                    label: 'Template3',
                    icon: 'pi pi-th-large',
                    command: () => {
                        this.selectedAction = 'Template3';
                        this.dowloadTemplate('Template3');
                    },
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
            ],
        },
        {
            separator: true,
        },
        {
            label: 'Quit',
            icon: 'pi pi-fw pi-power-off',
            command: () => {
                this.isLoggedIn = false;
            },
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
    constructor(
        public layoutService: LayoutService,
        private reactService: ReactService,
        private storage: AngularFireStorage,
        private storageService: StorageService,
        private router: Router,
        private http: HttpClient,
        private messageService: MessageService
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
        switch (this.recetAction) {
            case 'Preview':
                this.browseSelectFile();
                break;
            case 'Save':
                if (this.isLoggedIn) {
                    this.saveConfimration();
                }
                break;
            case 'Download':
                this.downloadFile(this.selectedItem.name);
                break;
            case 'Search':
                this.onSearchClick();
                break;
            default:
                break;
        }
    }
    browseSelectFile() {
        this.fileUpload.basicFileInput.nativeElement.click();
    }
    fileSelectAndPreview(ref: any, event: any) {
        this.sideBarButton.show = true;
        const file: File = event.files[0];
        this.selectedFile = file;
        this.selectedFileEvent = event;
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
            this.workSheetNames = wb.SheetNames;
            let count = 0;
            this.workSheetNames.forEach((workSheet: string) => {
                const ws: XLSX.WorkSheet = wb.Sheets[workSheet];
                this.workSheets.push(ws);
                let renamedJson = this.renameKeys(XLSX.utils.sheet_to_json(ws));
                this.workSheetsJSON.push(renamedJson);
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
    renameKeys(jsonData: any) {
        let newJsonData = [];
        jsonData.forEach((row, rowIndex) => {
            const newRow = {};
            let colIndex = 1;
            for (const key in row) {
                const newKey = `col${colIndex}|${key}`;
                newRow[newKey] = row[key];
                colIndex++;
            }
            newJsonData.push(newRow);
        });
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
        this.menuItems.push({
            label: menuItemName,
            icon: 'pi pi-fw pi-file',
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
