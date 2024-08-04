import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelRoutingModule } from './excel-routing.module';
import { ExcelPagesComponent } from './excel-pages.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
@NgModule({
    declarations: [ExcelPagesComponent],
    imports: [CommonModule, ExcelRoutingModule, SlickCarouselModule],
})
export class ExcelModule {}
