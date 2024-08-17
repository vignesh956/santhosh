import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Route, RouterModule } from '@angular/router';
import { PostJobComponent } from 'app/modules/admin/post-job/post-job.component';
import { AuthenticationService } from '../../../services/authentication.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRippleModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from "@angular/material/stepper";
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { QuillModule } from 'ngx-quill';

const postJobRoutes: Route[] = [
    {
        path     : '',
        component: PostJobComponent
    }
];

@NgModule({
    declarations: [
        PostJobComponent
    ],
    imports     : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
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
        MatStepperModule,
        MatSnackBarModule,
        MatAutocompleteModule,
        MatPaginatorModule,
        MatProgressBarModule,
        CKEditorModule,
        QuillModule,
        RouterModule.forChild(postJobRoutes)
    ],
    providers:[
        AuthenticationService
    ],
})
export class PostJobModule
{
}
