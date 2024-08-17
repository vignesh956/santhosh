import { NgModule } from "@angular/core";
import { CdkDetailRowDirective } from "../directives/cdk-detail-row.directive";
import { AutofocusDirective } from "./auto-focus/auto-focus.directive";
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AgGridModule } from "ag-grid-angular";
import { DeleteButtonsRendererComponent } from "./ag-components/deletebuttons-renderer.component";
import { ImageFormatterComponent } from "./ag-components/image-formatter.component";
import { IconFormatterComponent } from "./ag-components/icon-formatter.component";
import { CheckboxRendererComponent } from "./ag-components/checkbox-renderer.component";
import { ApplyJobButtonsRendererComponent } from "./ag-components/ApplyJobbuttons-renderer.component";
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations:[
        CdkDetailRowDirective,
        AutofocusDirective,
        DeleteButtonsRendererComponent,
        ImageFormatterComponent,
        IconFormatterComponent,
        CheckboxRendererComponent,
        ApplyJobButtonsRendererComponent
    ],
    imports: [
        MatIconModule,
        MatDialogModule,
        AgGridModule,
        RouterModule,
    ],
    providers:[],
    exports:[
        CdkDetailRowDirective,
        AutofocusDirective,
        AgGridModule,
        DeleteButtonsRendererComponent,
        ImageFormatterComponent,
        IconFormatterComponent,
        CheckboxRendererComponent,
        ApplyJobButtonsRendererComponent
    ]
})
export class SharedModule {}
