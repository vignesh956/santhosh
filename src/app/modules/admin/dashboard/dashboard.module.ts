import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {DashboardComponent} from 'app/modules/admin/dashboard/dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRippleModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatChipsModule} from '@angular/material/chips';
import {TranslateModule} from '@ngx-translate/core';

//import {FuseSharedModule} from '@fuse/shared.module';
//import { FuseSidebarModule } from '@fuse/components';
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatStepperModule } from "@angular/material/stepper";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';

//import { FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AgGridModule } from 'ag-grid-angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MaterialModule } from "../../../shared/Material.module";

//import { StarRatingComponent } from '../../../star-rating/star-rating.component';

import {DateRendererComponent} from './components/date-renderer.component';
import {ButtonsRendererComponent} from './components/buttons-renderer.component';
import { JobGridActionbuttonsComponent } from "./components/job-grid-actionbuttons.component";
import { JobTitleLinkComponent } from "./components/job-title-link.component";
import { jqxChartComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxchart';
//import{ jqxSchedulerComponent } from 'jqwidgets-ng/jqxscheduler'; 

import { MatSelect } from '@angular/material/select';

import { jqxSchedulerComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxscheduler';
 //import{ jqxSchedulerComponent } from 'jqwidgets-ng/jqxscheduler';   



import { JobService } from '../../../services/job.service';
import { LineChartModule } from '@swimlane/ngx-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
 const routes: Routes = [
  {
      path: '**',
      component: DashboardComponent
  },
];


@NgModule({
  declarations: [
    DashboardComponent,
    DateRendererComponent,
    ButtonsRendererComponent,
    JobGridActionbuttonsComponent,
   JobTitleLinkComponent,
    jqxChartComponent,
    jqxSchedulerComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule, 
    RouterModule.forChild(routes),
    AgGridModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatMenuModule,
    MatRippleModule,
    MatSelectModule,
    MatToolbarModule,
    MatChipsModule,
    MatCardModule,
    MatDividerModule,
    TranslateModule,
    /*FuseSharedModule,*/
   /* FuseSidebarModule,*/
    MatStepperModule,
    CKEditorModule,
    HttpClientModule,
    MatSnackBarModule,
    /*FuseSearchBarModule*/
    MaterialModule,
    //GooglePlaceModule,
    MatAutocompleteModule,
    CommonModule,
    // NgxChartsModule

  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers:[
    JobService
],
})
export class DashboardModule { }






