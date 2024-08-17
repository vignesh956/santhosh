import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EvaluationComponent } from 'app/modules/admin/evaluation/evaluation.component';
import { Route, RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthenticationService } from 'app/services/authentication.service';
import { MaterialModule } from "../../../shared/Material.module";
import {MatRippleModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatChipsModule} from '@angular/material/chips';
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatStepperModule } from "@angular/material/stepper";

import {TranslateModule} from '@ngx-translate/core';
//import {FuseSharedModule} from '@fuse/shared.module';
//import {FuseSidebarModule} from '@fuse/components';

import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

//import { FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AgGridModule } from 'ag-grid-angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { StarRatingComponent } from './star-rating/star-rating.component';


import {DateRendererComponent} from './components/date-renderer.component';
import {ButtonsRendererComponent} from './components/buttons-renderer.component';
import { JobGridActionbuttonsComponent } from "./components/job-grid-actionbuttons.component";
import { JobTitleLinkComponent } from "./components/job-title-link.component";
import { CountdownModule } from 'ngx-countdown';
import { CandidateService } from '../../../services/candidate.service';
//import {AngularCountdownTimerModule} from 'angular8-countdown-timer';
import { from } from 'rxjs';

import { MatListModule } from '@angular/material/list';

const evaluationRoutes: Route[] = [
    {
        path     : '',
        component: EvaluationComponent
    }
];

@NgModule({
    declarations: [
        EvaluationComponent,
        StarRatingComponent,
    DateRendererComponent,
    ButtonsRendererComponent,
    JobGridActionbuttonsComponent,
    JobTitleLinkComponent
    
    ],
    imports     : [
        RouterModule.forChild(evaluationRoutes),
        AgGridModule,
        MatSelectModule,
        MaterialModule,
        MatSnackBarModule,
        MatButtonModule,
        MatCheckboxModule,
        MatRippleModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatToolbarModule,
        MatChipsModule,
        MatCardModule,
        MatDividerModule,
        MatStepperModule,
        CommonModule,
        FlexLayoutModule, 
        CKEditorModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatProgressBarModule,
        CountdownModule,
        MatListModule
        
        


    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers:[
        AuthenticationService,
        CandidateService,
        
        
    ],
})
export class EvaluationModule
{
}
