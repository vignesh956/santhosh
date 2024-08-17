import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { JobsComponent } from 'app/modules/admin/jobs/jobs.component';
import { JobLocationFilterPipe } from './job-location-filter.pipe';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthenticationService } from 'app/services/authentication.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { JobListItemComponent } from './job-list-item/job-list-item.component';
import { PostJobComponent } from '../post-job/post-job.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatStepperModule } from "@angular/material/stepper";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DateRendererComponent } from './components/date-renderer.component';
import { ButtonsRendererComponent } from './components/buttons-renderer.component';
import { AgGridModule } from 'ag-grid-angular';
import { JobSearchFilterPipe } from './job-search-filter.pipe';
import { JobGridActionbuttonsComponent } from "./components/job-grid-actionbuttons.component";
import { JobTitleLinkComponent } from "./components/job-title-link.component";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CandidateService } from 'app/services/candidate.service';

const jobRoutes: Route[] = [
    {
        path     : '**',
        component: JobsComponent
    },
    { 
        path: 'post-job/:id', 
        component: PostJobComponent 
     }
    // {
    //     path     : 'jobs-grid-view',
    //     component: ManageJobsComponent
    // }
];

@NgModule({
    declarations: [
        JobsComponent,
        JobListItemComponent,
        DateRendererComponent,
        ButtonsRendererComponent,
        JobSearchFilterPipe,
        JobLocationFilterPipe,
        JobGridActionbuttonsComponent,
        JobTitleLinkComponent
    ],
    imports     : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule.forChild(jobRoutes),
        AgGridModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatSelectModule,
        MatToolbarModule,
        MatCardModule,
        MatDividerModule,
        TranslateModule,
        MatStepperModule,
        CKEditorModule,
        HttpClientModule,
        MatSnackBarModule,
        MatAutocompleteModule,
        MatPaginatorModule,
        MatProgressBarModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers:[
        AuthenticationService,
        DatePipe,
        CandidateService
    ],
})
export class JobsModule
{
}
