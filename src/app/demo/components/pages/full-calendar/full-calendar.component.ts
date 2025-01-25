import { Component, Input } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular'; // Import FullCalendarModule
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid'; // Import the dayGrid plugin
import timeGridPlugin from '@fullcalendar/timegrid'; // Optional: for time grid view
import interactionPlugin from '@fullcalendar/interaction'; // Optional: for drag & drop and selectable functionality
import { Subscription } from 'rxjs';
import { ReactService } from 'src/app/layout/service/react.service';
import * as dayjs from 'dayjs';
interface GroupedData {
    category: string;
    subCategories: Array<{
        subCategory: string;
        contents: (string | string[])[];
    }>;
}
@Component({
    selector: 'app-full-calendar',
    standalone: true,
    imports: [FullCalendarModule],
    templateUrl: './full-calendar.component.html',
    styleUrl: './full-calendar.component.scss',
})
export class FullCalendarComponent {
    @Input() data: any[] = [];
    excelData: any[] = [];
    fileSubscription: Subscription = new Subscription();
    groupedData: GroupedData[] = [];
    eventsInfo: any[] = [
        {
            title: 'Morning Meeting',
            start: '2025-01-20T09:00:00',
            end: '2025-01-20T10:00:00',
            backgroundColor: '#f54242', // Custom background color
            textColor: '#ffffff', // Custom text color
            borderColor: '#f54242',
            isFixed: true,
        },
    ];
    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin], // Register the plugins here
        initialView: 'dayGridMonth',
        events: this.eventsInfo,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        editable: true,
        selectable: true,
    };
    keyNames: string[] = [];

    constructor(private reactService: ReactService) {
        this.fileSubscription = this.reactService.file$.subscribe((data) => {
            if (data) {
                this.data = data.excelContents;
                this.excelData = [];
                console.log('this.data ===>', this.data);
                this.dataExtract(this.data);
            }
        });
    }

    ngOnInit() {}
    dataExtract(data: any[]) {
        data.forEach((xldata: any) => {
            let newObject: any = {};
            Object.keys(xldata).forEach((keyname: string) => {
                let eventName = '';
                let keyNameFormed = keyname.toLowerCase().trim();
                if (keyNameFormed.includes('xlstartdatetime')) {
                    newObject['start'] = this.dateParse(xldata[keyname]);
                } else if (keyNameFormed.includes('xlenddatetime')) {
                    newObject['end'] = this.dateParse(xldata[keyname]);
                } else if (keyNameFormed.includes('xleventname')) {
                    newObject['title'] =
                        newObject['title'] == undefined
                            ? '-' + xldata[keyname]
                            : newObject['title'] + '-' + xldata[keyname];
                } else if (keyNameFormed.includes('xlcategory')) {
                    newObject['title'] =
                        newObject['title'] == undefined
                            ? '-' + xldata[keyname]
                            : newObject['title'] + '-' + xldata[keyname];
                } else if (keyNameFormed.includes('xleventstyle')) {
                    let splitedArray1: string[] = xldata[keyname]
                        .replace(/\r\n/g, '')
                        .split(',');
                    splitedArray1.forEach((str: string) => {
                        let splitedArray2: string[] = str.split(':');
                        if (splitedArray2[0] == 'isFixed') {
                            if (splitedArray2[1] == 'true') {
                                newObject[splitedArray2[0]] = true;
                            } else {
                                newObject[splitedArray2[0]] = false;
                            }
                        } else {
                            newObject[splitedArray2[0]] = splitedArray2[1];
                        }
                    });
                }
            });
            if (newObject['title']) {
                newObject['title'] = newObject['title'].replace(/^-/, '');
            }
            this.eventsInfo.push(newObject);
        });
        console.log('this.eventsInfo==>', this.eventsInfo);
    }
    dateParse(getDate: string) {
        const parsedDate = dayjs(getDate, 'DD/MM/YYYY HH:mm:ss');
        const formattedDate = parsedDate.format('YYYY-MM-DD[T]HH:mm:ss');
        return formattedDate;
    }
    getValueFromSplit(getStr: string, index: number) {
        let retStr = getStr.split('|');
        return retStr[index];
    }

    keyNamesUpdate() {
        let corrected: string[] = [];
        this.keyNames.forEach((name: string) => {
            corrected.push(this.getValueFromSplit(name, 1));
        });
        this.keyNames = corrected;
    }
}
