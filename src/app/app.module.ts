import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { NgxFileDropModule } from 'ngx-file-drop';
const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        // Core module of your application
        CoreModule,
        MatChipsModule,

        // Layout module of your application
        LayoutModule,
        NgxFileDropModule
    ],
    providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
