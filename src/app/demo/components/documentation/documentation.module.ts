import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentationRoutingModule } from './documentation-routing.module';
import { DocumentationComponent } from './documentation.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
@NgModule({
    imports: [
        CommonModule,
        DocumentationRoutingModule,
        PanelMenuModule,
        MenuModule,
        BadgeModule,
        RippleModule,
        AvatarModule,
    ],
    declarations: [DocumentationComponent],
})
export class DocumentationModule {}
