import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseValidators } from '@fuse/validators';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { RepositoryConstant } from 'app/modules/constants/Repository.constant';
import Swal from 'sweetalert2';



@Component({
    selector     : 'auth-reset-password',
    templateUrl  : './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthResetPasswordComponent implements OnInit
{
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;
    

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    public apiUrl: string = RepositoryConstant.apiUrl;
    resetPasswordForm: UntypedFormGroup;
    showAlert: boolean = false;
    id: any;
  email:any;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private route: ActivatedRoute,
        private _router: Router,
        private http: HttpClient,
        private _formBuilder: UntypedFormBuilder
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
        this.resetPasswordForm = this._formBuilder.group({
                password       : ['', Validators.required],
                passwordConfirm: ['', Validators.required]
            },
            {
                validators: FuseValidators.mustMatch('password', 'passwordConfirm')
            }
        );
        debugger;
        this.email = this.route.snapshot.queryParamMap.get('email');
    this.id = this.route.snapshot.queryParamMap.get('id');
      console.log(this.email); // OUTPUT 123
      console.log(this.id); // OUTPUT modular
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    resetPassword(): void
    {
        debugger;
        // Return if the form is invalid
        if ( this.resetPasswordForm.invalid )
        {
            return;
        }

        // Disable the form
        this.resetPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Send the request to the server
        
        this._authService.resetPassword(this.resetPasswordForm.get('password').value)
            .pipe(
                finalize(() => {
                    debugger;

                    // Re-enable the form
                    this.resetPasswordForm.enable();

                    // Reset the form
                    this.resetPasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                })
            )
            .subscribe(
                (response) => {

                    // Set the alert
                    this.alert = {
                        type   : 'success',
                        message: 'Your password has been reset.'
                    };
                },
                (response) => {

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Something went wrong, please try again.'
                    };
                }
            );
    }
   
    newresetPassword(){
        
       let email=this.email;
       let id=this.id;
       let password=this.resetPasswordForm.get('password').value;
       let confirmPassword= this.resetPasswordForm.get('passwordConfirm').value
       if(password==confirmPassword)
       { 
        this.http.get<any>(this.apiUrl 
            + '/api/userService/resetpassword?email=' + email+'&Id='+id+'&password='+password)
        .subscribe(data => {

            Swal.fire({

                icon: 'success',
                title: 'Password Reset Successfully...',
                confirmButtonColor: "#58ae38"
              })
              this._router.navigate(['/sign-in']);
            })
           

        };
    }
}

