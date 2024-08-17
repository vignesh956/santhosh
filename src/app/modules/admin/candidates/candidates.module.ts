import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider"
import { MatStepperModule } from "@angular/material/stepper";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DateRendererComponent } from './components/date-renderer.component';
import { ButtonsRendererComponent } from './components/buttons-renderer.component';
import { AgGridModule } from 'ag-grid-angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CandidatesComponent } from 'app/modules/admin/candidates/candidates.component';
import { CandidateLocationFilterPipe } from './candidate-location-filter.pipe';
import { CandidateSkillsFilterPipe } from './candidate-skills-filter.pipe';
import { CandidateDesignationsFilterPipe } from './candidate-designations-filter.pipe';
import { CandidateSearchFilterPipe } from './candidate-search-filter.pipe';
import { CandidateListItemComponent } from 'app/modules/admin/candidates/candidate-list-item/candidate-list-item.component';
import { JobGridActionbuttonsComponent } from "./components/job-grid-actionbuttons.component";
import { JobTitleLinkComponent } from "./components/job-title-link.component";
import { NewCandidateComponent } from 'app/modules/admin/candidates/New-Candidate/new-candidate/new-candidate.component';
import { NewCandidateDateRendererComponent } from './New-Candidate/new-candidate/components/date-renderer.component';
import { NewCandidateButtonsRendererComponent } from './New-Candidate/new-candidate/components/buttons-renderer.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { MaterialModule } from "../../../shared/Material.module";
import { SortDirective } from './New-Candidate/directive/sort.directive';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthenticationService } from 'app/services/authentication.service';
import { CandidateService } from '../../../services/candidate.service';
import { DialogConfirmComponent } from './New-Candidate/new-candidate/dialog-confirm/dialog-confirm.component';
import { FileDragNDropDirective } from './New-Candidate/directive/file-drag-n-drop.directive';



const candidatesRoutes: Routes = [
    {
        path: 'new-candidate',
        component: NewCandidateComponent
    },
    { path: 'edit-candidate/:id', component: NewCandidateComponent },
    {
        path: '**',
        component: CandidatesComponent
    },
];


@NgModule({
    declarations: [
        CandidatesComponent,
        StarRatingComponent,
        CandidateListItemComponent,
        DateRendererComponent,
        ButtonsRendererComponent,
        JobGridActionbuttonsComponent,
        JobTitleLinkComponent,
        CandidateLocationFilterPipe,
        CandidateSkillsFilterPipe,
        CandidateDesignationsFilterPipe,
        CandidateSearchFilterPipe,
        NewCandidateComponent,
        SortDirective,
        NewCandidateDateRendererComponent,
        NewCandidateButtonsRendererComponent,
        DialogConfirmComponent,
        FileDragNDropDirective
    ],
    imports     : [
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        RouterModule.forChild(candidatesRoutes),
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
        MatStepperModule,
        CKEditorModule,
        HttpClientModule,
        MatSnackBarModule,
        NgxDocViewerModule,
        MaterialModule,
        //GooglePlaceModule,
        MatAutocompleteModule,
        CommonModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        AuthenticationService,
        CandidateService
    ],
})
export class CandidatesModule
{
}
