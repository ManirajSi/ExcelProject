import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExcelPagesComponent } from './excel-pages.component';

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild([{ path: '', component: ExcelPagesComponent }]),
    ],
    exports: [RouterModule],
})
export class ExcelRoutingModule {}
