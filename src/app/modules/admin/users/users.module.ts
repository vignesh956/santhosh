import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { FlexLayoutModule } from '@angular/flex-layout';
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
import { MatCardModule } from "@angular/material/card";
import { MatDividerModule } from "@angular/material/divider";
import { MatStepperModule } from "@angular/material/stepper";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AgGridModule } from 'ag-grid-angular';
import { MatDatepickerModule  } from '@angular/material/datepicker';
import { MaterialModule } from "../../../shared/Material.module";
import { ButtonsRendererComponent } from './components/buttons-renderer.component';
import { DateRendererComponent } from './components/date-renderer.component';


const routes: Routes = [
  {
      path: '**',
      component: UsersComponent
  },
];

@NgModule({
  declarations: [
      UsersComponent,
      DateRendererComponent,
      ButtonsRendererComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule, 
    RouterModule.forChild(routes),
    AgGridModule,
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
    MatStepperModule,
    CKEditorModule,
    HttpClientModule,
    MatSnackBarModule,
    MaterialModule,
    MatAutocompleteModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsersModule { }


