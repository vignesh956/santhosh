import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthenticationService } from 'app/services/authentication.service';
import { AuthService } from 'app/core/auth/auth.service';
import { IUser } from 'app/interfaces/IUser';
import { CandidateService } from 'app/services/candidate.service';
import { User } from './User';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {
    authenticationToken: any;
    loggedInfo: any;
    tokenUser: IUser;
    candidateId: any;
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signInForm: UntypedFormGroup;
    logInForm: UntypedFormGroup;
    showAlert: boolean = false;
    currentYear: number = new Date().getFullYear();

    /**
     * Constructor
     */
    constructor(
        private authService: AuthService,
        private _authService: AuthenticationService,
        private _activatedRoute: ActivatedRoute,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private candidateService: CandidateService
    ) {
        this.tokenUser = new User();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            UserName: ['', [Validators.required, Validators.email]],
            Password: ['', Validators.required],
            rememberMe: ['']
        });

        this.logInForm = this._formBuilder.group({
            email: ['admin@esntechnologies.co.in'],
            password: ['admin'],
            rememberMe: ['']
        });

        this._authService.clearAll();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        debugger;
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;
        localStorage.clear();

        //const username = this.signInForm.get('UserName').value;
        //const password = this.signInForm.get('Password').value;

        //this.loggedInfo = this._authService.checkUserStatus(username, password);
        //if (!this.loggedInfo) {
        //    throw new Error('Invalid username or password');
        //}
        //this._authService.storeLoggedInfo(this.loggedInfo);
        //this.tokenUser = this._authService.findByUserId({ id: this.loggedInfo.id });



        this._authService.checkUserStatus(this.signInForm.get('UserName').value, this.signInForm.get('Password').value)
            .subscribe((result) => {
                debugger;
                if (result) {
                    this._authService.checkUserStatus(this.signInForm.get('UserName').value, this.signInForm.get('Password').value)
                        .subscribe((result) => {
                            console.log(JSON.stringify(result));
                            this.loggedInfo = result;
                            this._authService.storeLoggedInfo(this.loggedInfo);
                            this.authenticationToken = result;
                            var payLoad = {
                                id: this.loggedInfo.id
                            }
                            this._authService.findByUserId(payLoad).subscribe(res => {
                                //console.log(res);
                                this.tokenUser = res;
                                this.tokenUser.Token = this.loggedInfo.token;
                                this._authService.updateUser(this.tokenUser).subscribe(x => {
                                    this._authService.storeToken(this.authenticationToken.token);
                                    this.authService.signIn(this.logInForm.value)
                                        .subscribe(
                                            () => {

                                                const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                                                // Navigate to the redirect url
                                                if (this.loggedInfo.role == "Administrator") {
                                                    this._router.navigate(['/users']);

                                                }
                                                else if (this.loggedInfo.role == 'Candidate') {
                                                    // debugger;
                                                    // this._router.navigate(['/jobs']);
                                                    this._router.navigate(['/myprofile/edit-candidate/' + this.loggedInfo.candidateId]);
                                                }
                                                else {
                                                    this._router.navigateByUrl(redirectURL);
                                                }
                                            },
                                        );
                                })
                            })
                        },
                            error => {
                                console.log('Authentication Error FAILURE.... ');

                                if (error.status != 200) {
                                    this.alert = {
                                        type: 'error',
                                        message: 'UserName or password is incorrect.'
                                    };
                                }
                                console.log(error.message);
                                // Re-enable the form
                                this.signInForm.enable();

                                // Reset the form
                                this.signInNgForm.resetForm();

                                // Set the alert
                                this.alert = {
                                    type: 'error',
                                    message: 'Wrong email or password'
                                };

                                // Show the alert
                                this.showAlert = true;
                            })
                }
                else {
                    this.alert = {
                        type: 'error',
                        message: this.signInForm.get('UserName').value + ' is not active. Please contact your manager'
                    };
                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: 'Wrong email or password'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            },
            )
        error => {
            console.log('Authentication Error FAILURE.... ');

            if (error.status != 200) {
                this.alert = {
                    type: 'error',
                    message: 'UserName or password is incorrect.'
                };
            }
            console.log(error.message);
            // Re-enable the form
            this.signInForm.enable();

            // Reset the form
            this.signInNgForm.resetForm();

            // Set the alert
            this.alert = {
                type: 'error',
                message: 'Wrong email or password'
            };

            // Show the alert
            this.showAlert = true;
        };
    }

   

   
}

function handleError(error) {
    const errorMessage = getErrorMessage(error);
    this.alert = { type: 'error', message: errorMessage };
    console.error(error);
}
function getRedirectUrlFromQueryParams() {
    // Implement logic to retrieve redirect URL from query params
}

function navigateToAppropriatePage(role, redirectURL) {
    if (role === 'Administrator') {
        this.router.navigate(['/users']);
    } else if (role === 'Candidate') {
        this.router.navigate(['/myprofile/edit-candidate/' + this.userInfo.candidateId]);
    } else {
        this.router.navigateByUrl(redirectURL);
    }
}



function getErrorMessage(error) {
    if (error.status === 401) {
        return 'Username or password is incorrect.';
    } else if (error.message === 'Inactive user') {
        return this.username + ' is not active. Please contact your manager.';
    } else {
        return 'An error occurred during login.';
    }
}
    // Sign in
    // signIn(): void {
    //     localStorage.clear();
    //     this._authService.checkUserStatus(this.signInForm.get('UserName').value, this.signInForm.get('Password').value)
    //     .subscribe((result) => {
    //         if(result == true)
    //         {
    //             this._authService.validateUser(this.signInForm.value)
    //             .subscribe((result) => {
    //             console.log(JSON.stringify(result));
    //             this.loggedInfo=result;
    //             this._authService.storeLoggedInfo(this.loggedInfo);
    //             this.authenticationToken=result;
    //             var payLoad={
    //                 id:this.loggedInfo.id
    //             }
    //             this._authService.findByUserId(payLoad).subscribe(res=>{
    //                 console.log(res);
    //                 this.tokenUser=res;
    //                 this.tokenUser.Token=this.loggedInfo.access_token;
    //                 //this._authService.updateUser(this.tokenUser).subscribe(x=>{
    //                     //this._authService.storeToken(this.authenticationToken.access_token);
    //                     //debugger;
    //                     const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

    // //                  // Navigate to the redirect url
    //                     this._router.navigateByUrl(redirectURL);
    //                     //this._router.navigate(["../jobs"]);
    //                     // if(this.loggedInfo.Role == "Administrator"){
    //                     //     //this.router.navigate(['/user']);
    //                     //     //this.router.navigate(['/analytics']);
    //                     //     this._router.navigateByUrl(redirectURL);
    //                     // }
    //                     // else  if(this.loggedInfo.Role == 'Hiring Manager') {
    //                     //     //this.router.navigate(['/jobgridlist']);
    //                     //     //this.router.navigate(['/analytics']);
    //                     //     // this.router.navigate(['/jobgridlist']).then(() => {
    //                     //     //   });
    //                     //     // this.router.navigate(['/dashboard']).then(() => {
    //                     //     // });

    //                     // }
    //                     // else if(this.loggedInfo.Role == 'Candidate' && this.loggedInfo.candidateId != undefined)
    //                     // {
    //                     //     debugger;
    //                     //    this.candidateService.CreateCandidateActivity(this.loggedInfo.candidateId,'Login','Candidate ' + this.loggedInfo.FirstName + ' ' +this.loggedInfo.FirstName + ' Logged in. '
    //                     //    ,this.loggedInfo.candidateId).subscribe(data=>{
    //                     //   });
    //                     //   this._router.navigateByUrl(redirectURL);
    //                     // }
    //                 //})

    //                 //User user=IUser(res);
    //             })

    //         },
    //         error => {
    //             console.log('Authentication Error FAILURE.... ');

    //             if(error.status != 200)
    //             {
    //                 this.alert = {
    //                     type   : 'error',
    //                     message: 'UserName or password is incorrect.'
    //                 };
    //             }
    //             console.log(error.message);
    //         })
    //     }
    //     else{
    //             this.alert = {
    //                 type   : 'error',
    //                 message: this.signInForm.get('UserName').value + ' is not active. Please contact your manager'
    //             };
    //         }
    //     },
    //     );
    // }


