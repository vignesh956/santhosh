import { NgModule } from '@angular/core';
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
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { JobsComponent } from './jobs/jobs.component';
import { CompanyComponent } from './company/company.component';
import { AgGridModule } from 'ag-grid-angular';
import { JobsGridActionbuttonsComponent } from './jobs/components/jobs-grid-actionbuttons.component';
import { CompanyGridActionbuttonsComponent } from './company/components/company-grid-actionbuttons.component';
import { MaterialModule } from '../../../shared/Material.module';
import { ImageRendererComponent } from './company/components/company-grid-imagerenderer.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
    {
        path: 'jobs',
        component: JobsComponent
    },
    { path: 'company', component: CompanyComponent },
    {
        path: '**',
        component: JobsComponent
    },
];

@NgModule({
    declarations: [
        JobsComponent,
        CompanyComponent,
        JobsGridActionbuttonsComponent,
        CompanyGridActionbuttonsComponent,
        ImageRendererComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        AgGridModule,
        RouterModule.forChild(routes),
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
        HttpClientModule,
        MatSnackBarModule,
        // GooglePlaceModule,
        MatAutocompleteModule,
        CommonModule
    ],
    providers: [],
})
export class ConfigurationModule { }
