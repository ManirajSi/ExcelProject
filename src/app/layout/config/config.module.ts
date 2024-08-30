import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AppConfigComponent } from './app.config.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AccordionModule } from 'primeng/accordion';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SidebarModule,
        RadioButtonModule,
        ButtonModule,
        InputSwitchModule,
        SplitButtonModule,
        PanelMenuModule,
        AccordionModule,
        DropdownModule,
        AutoCompleteModule,
    ],
    declarations: [AppConfigComponent],
    exports: [AppConfigComponent],
})
export class AppConfigModule {}
