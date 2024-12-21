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
import { RadioButtonModule } from 'primeng/radiobutton';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { TrumpCardComponent } from '../trump-card/trump-card.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardBookComponent } from '../card-book/card-book.component';
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
        RadioButtonModule,
        ReactiveFormsModule,
        FormsModule,
        SplitButtonModule,
        InputSwitchModule,
        CheckboxModule,
        ToastModule,
        PaginatorModule,
        TrumpCardComponent,
        ProgressSpinnerModule,
        CardBookComponent,
    ],
})
export class ExcelModule {}
