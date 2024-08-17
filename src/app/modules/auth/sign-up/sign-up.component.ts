import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthenticationService } from 'app/services/authentication.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

export interface JobRolesList {
    value: string;
    viewValue: string;
}

@Component({
    selector     : 'auth-sign-up',
    templateUrl  : './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignUpComponent implements OnInit
{
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signUpForm: UntypedFormGroup;
    showAlert: boolean = false;
    currentYear: number = new Date().getFullYear();

    Roles: JobRolesList[] = [
        { value: 'Hiring Manager', viewValue: 'Hiring Manager' },
        { value: 'Interviewer', viewValue: 'Interviewer' },
        { value: 'HR Manager', viewValue: 'HR Manager' },
        // { value: 'Recruiter', viewValue: 'Recruiter' },
        //{ value: 'Administrator', viewValue: 'Administrator' },
        { value: 'Candidate', viewValue: 'Candidate' },
        //{ value: 'SuperAdmin', viewValue: 'SuperAdmin' },
    ];

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthenticationService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.signUpForm = this._formBuilder.group({
                firstname      : ['', Validators.required],
                lastname      : ['', Validators.required],
                mobile      : ['', Validators.required],
                email     : ['', [Validators.required, Validators.email]],
                password  : ['', Validators.required],
                role  : ['', Validators.required]
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    // signUp(): void
    // {
    //     // Do nothing if the form is invalid
    //     if ( this.signUpForm.invalid )
    //     {
    //         return;
    //     }

    //     // Disable the form
    //     this.signUpForm.disable();

    //     // Hide the alert
    //     this.showAlert = false;

    //     // Sign up
    //     this._authService.signUp(this.signUpForm.value)
    //         .subscribe(
    //             (response) => {

    //                 // Navigate to the confirmation required page
    //                 this._router.navigateByUrl('/confirmation-required');
    //             },
    //             (response) => {

    //                 // Re-enable the form
    //                 this.signUpForm.enable();

    //                 // Reset the form
    //                 this.signUpNgForm.resetForm();

    //                 // Set the alert
    //                 this.alert = {
    //                     type   : 'error',
    //                     message: 'Something went wrong, please try again.'
    //                 };

    //                 // Show the alert
    //                 this.showAlert = true;
    //             }
    //         );
    // }

    signUp(): void {

        if ( this.signUpForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signUpForm.disable();
        this._authService.validateEmailUser(this.signUpForm.get('email').value)
        .subscribe((result) => {
            var res = result;

            if(res != "true")
            {
                this._authService.saveUser(this.signUpForm.value)
                .subscribe((result) => {
                    if(result)
                    {
                        this.signUpForm.enable();
                        this.signUpNgForm.resetForm();

                        Swal.fire({
                            icon: 'info',
                            title: 'Application Tracking System',
                            text: 'User registered successfully.'
                        });
                        this._router.navigate(['/sign-in']);
                    }
                    
                },
                    error => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Application Tracking System',
                            text: error.message
                        });
                    },
                    () => {})
                }
                else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Application Tracking System',
                        text: 'User already exists!'
                    });

                    this.signUpForm.enable();
                    this.signUpNgForm.resetForm();
                }
        });
    }
}
