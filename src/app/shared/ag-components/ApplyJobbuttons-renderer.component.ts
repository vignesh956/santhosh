import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
//import { JobService } from 'app/main/pages/jobs/joblist/JobService';
//import { ICandidateActivity } from 'app/main/pages/Candidates/Activity/ICandidateActivity';
//import { CandidateActivity } from 'app/main/pages/Candidates/Activity/CandidateActivity';
import { AlertDialogComponent } from 'app/shared/alert-dialog/alert-dialog.component';
import { MatDialog } from "@angular/material/dialog";
//import { AuthenticationService } from 'app/main/pages/authentication/authentication.service';
//import { Candidate } from 'app/main/pages/Candidates/Candidate';
//import { CandidateDialog } from 'app/main/pages/Candidates/candidate.dialog';


@Component({
    selector: 'jbuttons',
    // template: `<mat-icon aria-hidden="false" aria-label="Example home icon" style="font-size: 20px;cursor:pointer;" (click)="btnClickedHandler($event)">delete</mat-icon>`,
    // template: `<button mat-raised-button;  style="font-size: 20px;cursor:pointer" (click)="btnClickedHandler($event)" >
    // <span>Apply Now</span></button>`,
    template: `<a type="" (click)="btnClickedHandler()" 
      id="bt">ApplyStatus</a>`
    ,

})
export class ApplyJobButtonsRendererComponent implements ICellRendererAngularComp {
    public params: any;
    //candidateActivity: ICandidateActivity;
    //CandidateActivitiesCriteria: CandidateActivity;
    loggedInfo: any;
    ApplyStatus: any;
    constructor( private dialog: MatDialog) {

        //this.loggedInfo = this.authService.getLoggedInfo();


    }

    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }

    btnClickedHandler() {
        //debugger;
        this.params.clicked(this.params);
        //        alert('Edit  btnClickedHandler ' + this.params)
        //console.log(xyz);
       // debugger;
        var CandidateId = {
            id: this.loggedInfo.id
        }

    //    this._Jobservice.getByCandidateId(CandidateId).subscribe(res => {

    //        if (res == null) {
    //            const dialogRef = this.dialog.open(CandidateDialog, {
    //                width: '1200px',
    //                data: res
    //            });
    //            dialogRef.afterClosed().subscribe(result => {

    //            });
    //        }
    //        else {
    //            this.AppylyJob(this.params.data);
    //        }
    //    });



    }



    //AppylyJob(data: any) {
    //    debugger;



    //    this.CandidateActivitiesCriteria = new CandidateActivity();
    //    this.CandidateActivitiesCriteria.JobId = data.JobID;
    //    this.CandidateActivitiesCriteria.CandidateId = this.loggedInfo.id;
    //    this.CandidateActivitiesCriteria.reviewType = 'Applied';
    //    this.CandidateActivitiesCriteria.RecruiterId = this.loggedInfo.id;
    //    this.CandidateActivitiesCriteria.RecruiterName = this.loggedInfo.FirstName;
    //    this.CandidateActivitiesCriteria.RecriterNotes = 'Job Applied';
    //    this.CandidateActivitiesCriteria.CreatedBy = this.loggedInfo.id;
    //    this.CandidateActivitiesCriteria.ReviewStatus = 'Applied';
    //    this.CandidateActivitiesCriteria.ReviewDate = new Date();
    //    this.CandidateActivitiesCriteria.CreatedDate = new Date();
    //    this._Jobservice.ApplyJobByCandidate(this.CandidateActivitiesCriteria).subscribe(res => {
    //        const dialogRef = this.dialog.open(AlertDialogComponent, {
    //            width: '300px',
    //            data: {
    //                title: "Applied",
    //                message: 'You Have Successfully Applied For Job.',
    //                buttonText: {
    //                    cancel: 'OK'
    //                }
    //            },
    //        });
    //    })


    //}


}
