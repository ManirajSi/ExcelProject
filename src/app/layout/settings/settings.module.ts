import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { AccordionModule } from 'primeng/accordion';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
@NgModule({
    imports: [
        CommonModule,
        SettingsRoutingModule,
        PanelMenuModule,
        MenuModule,
        BadgeModule,
        RippleModule,
        AvatarModule,
        AccordionModule,
        InputSwitchModule,
        FormsModule,
        ButtonModule,
        PanelMenuModule,
        InputTextareaModule,
    ],
    declarations: [SettingsComponent],
})
export class SettingsModule {}
