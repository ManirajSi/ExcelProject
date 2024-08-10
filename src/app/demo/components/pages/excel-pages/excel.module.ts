import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelRoutingModule } from './excel-routing.module';
import { ExcelPagesComponent } from './excel-pages.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { OrderListModule } from 'primeng/orderlist';
import { RatingModule } from 'primeng/rating';
@NgModule({
    declarations: [ExcelPagesComponent],
    imports: [
        CommonModule,
        ExcelRoutingModule,
        SlickCarouselModule,
        OrderListModule,
        RatingModule,
    ],
})
export class ExcelModule {}
