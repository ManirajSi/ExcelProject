import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelRoutingModule } from './excel-routing.module';
import { ExcelPagesComponent } from './excel-pages.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { OrderListModule } from 'primeng/orderlist';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { GalleriaModule } from 'primeng/galleria';
import { PanelModule } from 'primeng/panel';
import { ImageModule } from 'primeng/image';
import { ToggleButtonModule } from 'primeng/togglebutton';

@NgModule({
    declarations: [ExcelPagesComponent],
    imports: [
        CommonModule,
        ExcelRoutingModule,
        SlickCarouselModule,
        OrderListModule,
        RatingModule,
        ButtonModule,
        MessagesModule,
        CardModule,
        TabViewModule,
        GalleriaModule,
        PanelModule,
        ImageModule,
        ToggleButtonModule,
    ],
})
export class ExcelModule {}
