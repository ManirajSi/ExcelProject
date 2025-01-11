import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
@Injectable({
    providedIn: 'root',
})
export class ExcelService {
    private workbook: XLSX.WorkBook | null = null;
    private fileName: string = '';

    loadExcelFile(file: File): Promise<any[]> {
        this.fileName = file.name;
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event: any) => {
                const data = new Uint8Array(event.target.result);
                this.workbook = XLSX.read(data, { type: 'array' });
                const sheetName = this.workbook.SheetNames[1];
                const worksheet = this.workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                resolve(jsonData);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });
    }

    saveExcelFile(data: any[], sheetNo: number): void {
        if (!this.workbook) return;
        const worksheet = XLSX.utils.json_to_sheet(data);
        this.workbook.Sheets[this.workbook.SheetNames[sheetNo]] = worksheet;
        const updatedExcel = XLSX.write(this.workbook, {
            bookType: 'xlsx',
            type: 'array',
        });
        saveAs(new Blob([updatedExcel]), this.fileName);
    }
}
