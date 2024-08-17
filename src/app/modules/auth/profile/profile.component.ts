import { Component, OnInit } from "@angular/core";
//import { AuthenticationService } from "../authentication.service";
import { AuthenticationService } from 'app/services/authentication.service';
import { IProfile } from "./IProfile";
import { Profile } from "./profile";
import { Router } from "@angular/router";
//import { CandidateService } from "app/services/candidate.service";
import {CandidateService} from '../../../services/candidate.service'
//import { FuseProgressBarService } from '../../../../../@fuse/components/progress-bar/progress-bar.service';
import { AlertDialogComponent } from 'app/shared/alert-dialog/alert-dialog.component';
import { MatDialog } from "@angular/material/dialog";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatSnackBar } from "@angular/material/snack-bar";
//import { ToolbarComponent} from 'app/layout/components/toolbar/toolbar.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
    selector: 'profile-component',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']

})
export class ProfileComponent implements OnInit {
    loggedUser: any;
    dataSource = new MatTableDataSource();
    logged: any;
lastlogin:any;
modifiedDate:any;
    model: any;
    ProfileImage;
    IsCandidate:boolean = false;
    RecruiterName:any;
    CandidateData:any;
    genders : any;
    isAccountVisible = false;
  isPasswordVisible = false;
  isTimelineVisible = false;
  isAccountDetailsVisible: boolean = true;
  activeTab = 'accountdetails';
  

    constructor(
        private authService: AuthenticationService,
        private router: Router,
        private dialog:MatDialog,
       // private _toolbarComponent:ToolbarComponent,
      //private _fuseProgressBarService: FuseProgressBarService,
      private candidateService:CandidateService
    ) {
        this.model = new Profile();
    }
    ngOnInit() {
        this.setActiveTab(this.activeTab);
        
        this.genders = [
            { value: 'Male', display: 'Male' },
            { value: 'Female', display: 'Female' }
        ];
        this.loggedUser = this.authService.getLoggedInfo();
        
        //this.lastlogin = this.convertToIST(this.loggedUser[".issued"]);
        this.lastlogin = new Date(this.loggedUser[".issued"]);

        debugger;
        var payLoad = {
            id: this.loggedUser.id
        };
        
        this.authService.findByUserId(payLoad).subscribe(data => {
            this.model = data;
            this.modifiedDate=new Date(this.model.ModifiedDate);
        });
     }
convertToIST(dateString: string): Date {
    const gmtDateTime = new Date(dateString);
    const istOffset = 5.5 * 60 * 60 * 1000; 
    const istDateTime = new Date(gmtDateTime.getTime() + istOffset);
    return istDateTime;
}    
        // if(this.loggedUser.Role == 'Candidate')
        // {
        //     this.IsCandidate =true;
        //     var emailpayLoad={
        //         email:this.loggedUser.Email
        //     }
        // // this.candidateService.getCandidatebyEmailId(emailpayLoad).subscribe(res=>{
        // //     this.CandidateData = res;
        // //     this.RecruiterName = this.CandidateData.CreatedBy;
        // // });
        //  }

    
    submit():void{
       

        if(this.model.NewPassword==this.model.ConfirmPassword){
            
       this.model.Password=this.model.NewPassword;
        }
        
     
        this.authService.updateUser(this.model).subscribe(data =>{

            this.loggedUser = this.authService.getLoggedInfo();
            var payLoad={
                id:this.loggedUser.id
            }
            this.authService.findByUserId(payLoad).subscribe(data =>{
                //this._fuseProgressBarService.show();
                if(data != null)
                {
                    var loggedUserFromLocalStorage = JSON.parse(localStorage.getItem("loggedinfo"));

                    loggedUserFromLocalStorage.Email = data.Email;
                    loggedUserFromLocalStorage.FirstName = data.FirstName;
                    loggedUserFromLocalStorage.LastName = data.LastName;
                    loggedUserFromLocalStorage.ProfileImage = data.ProfileImage;
        
                    localStorage.setItem("loggedinfo",JSON.stringify(loggedUserFromLocalStorage));
                        
                }
                //this._toolbarComponent.ngOnInit(); 
            this.router.navigate(['/dashboard']).then(() => {
                 //window.location.reload();
                  });
            });
            Swal.fire(
                'User Updated successfully!',
                '',
                'success'
            );
             
        })
    
   
    }
    onFileInput(event){
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
      
            reader.readAsDataURL(event.target.files[0]); // read file as data url
      
            reader.onload = (event:any) => { // called once readAsDataURL is completed
              this.model.ProfileImage = event.target.result;
            }
          }
    }

   
 
    removeimage(){
        this.model.ProfileImage='';
        this.authService.updateUser(this.model).subscribe(data =>{
            this.loggedUser = this.authService.getLoggedInfo();
            this.loggedUser.ProfileImage ='';
            localStorage.setItem("loggedinfo",JSON.stringify( this.loggedUser));
        });
      }
        cancelProf(): void{
            this.router.navigate(['/dashboard']).then(() => {
                //window.location.reload(); 
            });
        }
        showAccount() {
            this.isAccountVisible = true;
            this.isPasswordVisible = false;
            this.isTimelineVisible = false;
            this.isAccountDetailsVisible = false;
          }
        
          showPassword() {
            this.isAccountVisible = false;
            this.isPasswordVisible = true;
            this.isTimelineVisible = false;
            this.isAccountDetailsVisible = false;
          }
          showTimeline() {
            this.isAccountVisible = false;
            this.isPasswordVisible = false;
            this.isTimelineVisible = true;
            this.isAccountDetailsVisible = false;
          }
          showAccountDetails() {
            this.isAccountDetailsVisible = true;
            this.isAccountVisible = false;
            this.isPasswordVisible = false;
            this.isTimelineVisible = false;
        }
        setActiveTab(tabName: string): void {
            this.activeTab = tabName;
          }
        
    // updateProf(): void{
       
    // }
}