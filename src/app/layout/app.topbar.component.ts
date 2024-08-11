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
            label: 'Templates',
            icon: 'pi pi-th-large',
            command: () => {
                !this.selectedAction.includes('Template')
                    ? (this.selectedAction = 'Template1')
                    : this.selectedAction;
                this.dowloadTemplate();
            },
            items: [
                {
                    label: 'Template1',
                    icon: 'pi pi-th-large',
                    command: () => {
                        this.selectedAction = 'Template1';
                        this.dowloadTemplate();
                    },
                },
                {
                    label: 'Template2',
                    icon: 'pi pi-th-large',
                    command: () => {
                        this.selectedAction = 'Template2';
                        this.dowloadTemplate();
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
                    },
                },
            ],
        },
        {
            label: 'Edit',
            icon: 'pi pi-fw pi-pencil',
            items: [
                {
                    label: 'Left',
                    icon: 'pi pi-fw pi-align-left',
                    items: [
                        {
                            label: 'Bookmark',
                            icon: 'pi pi-fw pi-bookmark',
                        },
                        {
                            label: 'Video',
                            icon: 'pi pi-fw pi-video',
                        },
                    ],
                },
                {
                    label: 'Right',
                    icon: 'pi pi-fw pi-align-right',
                },
                {
                    label: 'Center',
                    icon: 'pi pi-fw pi-align-center',
                },
                {
                    label: 'Justify',
                    icon: 'pi pi-fw pi-align-justify',
                },
            ],
        },
        {
            label: 'Users',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-user-plus',
                },
                {
                    label: 'Delete',
                    icon: 'pi pi-fw pi-user-minus',
                },
                {
                    label: 'Search',
                    icon: 'pi pi-fw pi-users',
                    items: [
                        {
                            label: 'Filter',
                            icon: 'pi pi-fw pi-filter',
                            items: [
                                {
                                    label: 'Print',
                                    icon: 'pi pi-fw pi-print',
                                },
                            ],
                        },
                        {
                            icon: 'pi pi-fw pi-bars',
                            label: 'List',
                        },
                    ],
                },
            ],
        },
        {
            label: 'Events',
            icon: 'pi pi-fw pi-calendar',
            items: [
                {
                    label: 'Edit',
                    icon: 'pi pi-fw pi-pencil',
                    items: [
                        {
                            label: 'Save',
                            icon: 'pi pi-fw pi-calendar-plus',
                        },
                        {
                            label: 'Delete',
                            icon: 'pi pi-fw pi-calendar-minus',
                        },
                    ],
                },
                {
                    label: 'Archieve',
                    icon: 'pi pi-fw pi-calendar-times',
                    items: [
                        {
                            label: 'Remove',
                            icon: 'pi pi-fw pi-calendar-minus',
                        },
                    ],
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
    constructor(
        public layoutService: LayoutService,
        private reactService: ReactService,
        private storage: AngularFireStorage,
        private storageService: StorageService,
        private router: Router, // private messageService: MessageService
        private http: HttpClient
    ) {
        this.loginSubscription = this.reactService.loginInfo$.subscribe(
            (data) => {
                this.isLoggedIn = data.isLoggedIn;
            }
        );
        this.selectedExcelInfoSubscription =
            this.reactService.selectedExcelInfo$.subscribe((data) => {
                console.log('selectFileSubscription==>', data);
                // this.downloadAndReadFile(data.fileName);
                this.readExcelFile('');
            });
    }
    ngOnInit() {
        this.loadFiles();
    }
    ngOnDestroy(): void {
        this.loginSubscription.unsubscribe();
        this.selectedExcelInfoSubscription.unsubscribe();
    }
    loadFiles() {
        this.autoCompleteitems = [];
        this.storageService.listFiles(this.directory).subscribe((files) => {
            console.log('files====>', files);
            this.files = files;
            this.files.forEach((file: any) => {
                this.autoCompleteitems.push({ name: file });
                console.log(
                    'this.autoCompleteitems===>s',
                    this.autoCompleteitems
                );
            });
        });
    }
    readExcelFile(url: string) {
        this.http
            .get(
                'https://firebasestorage.googleapis.com/v0/b/excelendsite.appspot.com/o/excel%2FMyTrainerWebsite.xlsx?alt=media&token=8bd777d6-37b1-456d-9d59-ff61146a6622',
                { responseType: 'arraybuffer' }
            )
            .subscribe((data) => {
                const workbook = XLSX.read(new Uint8Array(data), {
                    type: 'array',
                });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const excelData = XLSX.utils.sheet_to_json(worksheet, {
                    header: 1,
                });
                console.log(excelData);
            });
    }
    downloadAndReadFile(filename: string) {
        const filePath = `${this.directory}/${filename}`;
        console.log('filePath===>', filePath);
        this.storageService.downloadFileAsBlob(filePath).subscribe((blob) => {
            console.log('blob===>', blob);
            debugger;
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const bstr: string = e.target.result;
                const workbook = XLSX.read(bstr, { type: 'binary' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                this.excelData = XLSX.utils.sheet_to_json(worksheet, {
                    header: 1,
                });
                console.log('this.excelData====>', this.excelData);
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
    uploadFile(event: any) {
        const file = event.files[0];
        const filePath = `excel/${file.name}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, file);
        task.snapshotChanges()
            .pipe(
                finalize(() => {
                    fileRef.getDownloadURL().subscribe((url) => {
                        this.downloadURL = url;
                        debugger;
                        console.log('File available at: ', this.downloadURL);
                        debugger;
                    });
                })
            )
            .subscribe();
    }
    onUploadClick() {
        this.fileUpload.basicFileInput.nativeElement.click();
    }
    onFileSelect(ref: any, event: any) {
        this.uploadFile(event);
        // const file: File = event.files[0];
        // const reader: FileReader = new FileReader();
        // reader.onload = (e: any) => {
        //     const bstr: string = e.target.result;
        //     const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        //     this.workSheetNames = wb.SheetNames;
        //     let count = 0;
        //     this.workSheetNames.forEach((workSheet: string) => {
        //         const ws: XLSX.WorkSheet = wb.Sheets[workSheet];
        //         this.workSheets.push(ws);
        //         this.workSheetsJSON.push(XLSX.utils.sheet_to_json(ws));
        //         if (count > 0) {
        //             this.menuItemForming(workSheet);
        //         }
        //         count++;
        //     });
        //     this.setExcelPageContent(this.workSheetsJSON[1]);
        //     this.infoSet();
        // };
        // reader.readAsBinaryString(file);
        // ref.clear();
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
                console.log('file====>', file);
                selectedFiles.push(file);
            }
        });
        this.reactService.setHeaderSearchSubject({
            searchTags: this.selectedItem,
            selectedFiles: selectedFiles,
        });
    }
    selectedActionCall() {}
    dowloadTemplate() {
        if (this.selectedAction.includes('Template')) {
            // this.messageService.add({
            //     severity: 'success',
            //     summary: 'Success',
            //     detail: this.selectedAction + 'Downloaded successfully',
            // });
        } else {
            // this.messageService.add({
            //     severity: 'error',
            //     summary: 'Error',
            //     detail: 'Invalid Action',
            // });
        }
    }
}
