import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { QuestionnaireComponent } from './questionnaire.component';
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
//import {FuseSidebarModule} from '@fuse/components';
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
import { MatDatepickerModule  } from '@angular/material/datepicker';
import { MaterialModule } from "../../../shared/Material.module";
import { StarRatingComponent } from '../../../star-rating/star-rating.component';
import {DateRendererComponent} from './components/date-renderer.component';
import {ButtonsRendererComponent} from './components/buttons-renderer.component';
import { JobGridActionbuttonsComponent } from "./components/job-grid-actionbuttons.component";
import { JobTitleLinkComponent } from "./components/job-title-link.component";


const routes: Routes = [
  {
      path: '**',
      component: QuestionnaireComponent
  },
];

@NgModule({
  declarations: [
    QuestionnaireComponent,
    DateRendererComponent,
     ButtonsRendererComponent,
    JobGridActionbuttonsComponent,
     JobTitleLinkComponent,
     StarRatingComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule, 
    RouterModule.forChild(routes),
    AgGridModule,
    // DateRendererComponent,
    // ButtonsRendererComponent,
    // JobGridActionbuttonsComponent,
    // JobTitleLinkComponent,
    //AgGridModule.withComponents([DateRendererComponent, ButtonsRendererComponent, JobGridActionbuttonsComponent, JobTitleLinkComponent]),
    MatButtonModule,
    CommonModule,
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
    //FuseSharedModule,
   //FuseSidebarModule,
    MatStepperModule,
    CKEditorModule,
    HttpClientModule,
    MatSnackBarModule,
    //FuseSearchBarModule,
    MaterialModule,
    //GooglePlaceModule,
    MatAutocompleteModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QuestionnaireModule { }


