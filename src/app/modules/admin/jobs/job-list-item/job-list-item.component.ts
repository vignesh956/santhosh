import { Component, Input, Output, EventEmitter, OnDestroy, OnInit, ViewEncapsulation, TemplateRef } from '@angular/core';
import { JobsComponent } from '../jobs.component';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckbox } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RepositoryConstant } from '../../../constants/Repository.constant';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'app/services/authentication.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    selector: 'job-list-item',
    templateUrl: './job-list-item.component.html',
    styleUrls: ['./job-list-item.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class JobListItemComponent implements OnInit, OnDestroy {
    public apiUrl: string = RepositoryConstant.apiUrl;
    @Input() job: any;
    form: FormGroup;
    PreQualifyQuestonFormArray: FormArray
    PreQualifyQuestonitems: FormGroup;
    PreQualifyQuestonChecked: boolean = true;

    constructor(
        private formBuilder: FormBuilder,
        public joblist: JobsComponent,
        private route: Router,
        private http: HttpClient,
        private matdialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _authService: AuthenticationService
    ) {
        this.form = this.formBuilder.group({
            PreQualifyQuestonForm: this.formBuilder.array([], [Validators.required])
        })
    }
    Jobs;
    selectedJob;
    hours: any;
    JobDescription: string;
    Title: string;
    JobId: string;
    CandidateId = 0;
    Location: string;
    Vacancies: string;
    Worksite: any;
    ChkJobCount = 0;
    CompanyOverview: string;
    Status: string;
    JobApplied: any;
    List_JobApplied: [];
    CompanyImage: any;
    Benefits: any;
    FArea: any;
    Skills: any;
    Salary: any;
    JobType: any;
    Industries: any;
    QuestionareCount: any;
    PreQualifyQueston: any;
    SeniorityLevel: string;
    minutes: any;
    jobDetails: any;
    IsCandidateRole: boolean = false;
    IsHiringManager: boolean = false;
    seconds: any;
    recruitersList: any;
    selectedCount = 0;
    selectedJobIds = [];
    selectedRecruiters = [];
    public isallChecked: boolean;
    openStatusCount = 0;
    archiveStatusCount = 0;
    otherStatusCount = 0;
    isBulkAction: boolean;
    loggedUserId;
    ngOnInit(): void {
        this.getRecruiters();
        let loggedInfo = this._authService.getLoggedInfo();
        this.loggedUserId = loggedInfo.id;
        if (loggedInfo.role == 'Candidate') {
            this.IsCandidateRole = true;
            this.CandidateId = loggedInfo.candidateId;
        }
        if (loggedInfo.role == 'Hiring Manager') {
            this.IsHiringManager = true;
        }
    }

    ngOnDestroy(): void {
    }

    @Output() onChecked: EventEmitter<any> = new EventEmitter<any>();

    public checkValue(isChecked: MatCheckbox): void {
        this.onChecked.emit(isChecked.checked);
        if (isChecked.checked)
            this.ChkJobCount = this.ChkJobCount + 1;
        if (!isChecked.checked && this.ChkJobCount != 0)
            this.ChkJobCount = this.ChkJobCount - 1;
    }

    formatString(val) {
        return val.toString()
    }

    selectedrecruiters(event) {
        this.selectedRecruiters = event.value;
    }

    bulkReassignListJobs(Id: any) {
        let jobIds = [];
        this.selectedJobIds.push(Id);
        // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/reassignJobRecruiters', {
        this.http.post<any>(this.apiUrl + '/api/jobService/reassignJobRecruiters', {
            JobIds: this.selectedJobIds,
            RecruitersIds: this.selectedRecruiters
        }).subscribe(data => {
            this.selectedCount = 0;
            this.selectedJobIds = [];
            this.selectedRecruiters = [];

            //this._fuseProgressBarService.hide();
            this.matdialog.closeAll();
            this.joblist.reloadJobsPaginationList();
            this._snackBar.open('Recruiters updated successfully!', '', {
                duration: 3000
            });
            // Swal.fire(
            //     'Recruiters updated successfully!',
            //     '',
            //     'success'
            // );
        });
    }

    ShareJobs(Id: any) {
        //debugger;
        this.selectedJobIds.push(Id);
        // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/reassignJobRecruiters', {
        this.http.post<any>(this.apiUrl + '/api/jobService/sharejob', {
            JobIds: this.selectedJobIds,
            RecruitersIds: this.selectedRecruiters,
            sender: this.loggedUserId
        }).subscribe(data => {
            this.selectedCount = 0;
            this.selectedJobIds = [];
            this.selectedRecruiters = [];

            //this._fuseProgressBarService.hide();
            this.matdialog.closeAll();
            this.joblist.reloadJobsPaginationList();
            this._snackBar.open('Job(s) info shared successfully!', '', {
                duration: 3000
            });
            // Swal.fire(
            //     'Recruiters updated successfully!',
            //     '',
            //     'success'
            // );
        });
    }

    updateJobStatus(Id: any, status: any) {
        this.joblist.updateJobStatus(Id, status);
    }

    cloneJob(jobID) {
        this.joblist.cloneJob(jobID);
    }

    selectRecord() {
        this.selectedJob = this.job['id'];
    }

    redirectToEditJob(id: any) {
        this.updateTimeStamp(id);
        this.joblist.redirectToEditJob(id);
        Swal.fire({
            title: 'Are you sure want to edit the job?',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                this.matdialog.closeAll();
                this.route.navigate(['/post-job'], {queryParams: {Id: id}});
            }
        });
    }

    updateTimeStamp(Id: any) {
        //debugger;
        this.joblist.updateTimeStamp(Id);
    }

    printDescription(jobID) {
        this.joblist.printDescription(jobID);
    }

    compare(a, b, isAsc) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
    calculateTimeStampDiff(TimeStamp: any): string {
        const timestampDate: any = new Date(TimeStamp);
        const current_time: any = new Date();

        const totalSeconds = Math.floor((current_time - timestampDate) / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);

        this.hours = totalHours - (totalDays * 24);
        this.minutes = totalMinutes - (totalDays * 24 * 60) - (this.hours * 60);
        this.seconds = totalSeconds - (totalDays * 24 * 60 * 60) - (this.hours * 60 * 60) - (this.minutes * 60);
        const totDiff = totalDays > 0 ? totalDays == 1 ? totalDays + ' day ' : totalDays + ' days ' : '';
        const totDiffhrs = this.hours > 0 ? this.hours == 1 ? this.hours + ' hr ' : this.hours + ' hrs ' : '';
        const totDiffmins = this.minutes == 1 ? this.minutes + ' min' : this.minutes + ' mins';
        return 'Last Viewed : ' + totDiff + totDiffhrs + totDiffmins;
    }

    public openViewJobModal(templateRef: TemplateRef<any>, jobID: any) {
        this.updateTimeStamp(jobID);
        const dialogRef = this.matdialog.open(templateRef, {
            width: '800px',
            height: '600px',
            autoFocus: false,
        });
        this.getjobdetailsbyJobId(jobID);
        dialogRef.afterClosed().subscribe(result => {
        });
    }
    public openApplyModal(templateRef: TemplateRef<any>, jobID: any) {
        const dialogRef = this.matdialog.open(templateRef, {
            width: '800px',
            height: '600px',
            autoFocus: false,
        });
        this.getjobdetailsbyJobId(jobID);
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    getjobdetailsbyJobId(id) {
        let cid = this.CandidateId;
        // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/GetJobDetailsbyJobCandaiateId?JobId=' + id +'&CandidateId='+ cid).subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/jobService/GetJobDetailsbyJobCandaiateId?JobId=' + id + '&CandidateId=' + cid).subscribe(data => {
            this.CompanyImage = data.CompanyImage;
            this.CompanyOverview = data.CompanyOverview;
            this.jobDetails = data.Table;
            this.Benefits = data.Table6;
            this.FArea = data.Table2;
            this.Industries = data.Table1;
            this.Skills = data.Table4;
            this.Salary = data.Table8;
            this.JobType = data.Table5[0].Name;
            this.PreQualifyQueston = data.Table10;
            if (this.PreQualifyQueston.length > 0) {
                this.PreQualifyQuestonChecked = true;
            }
        });
        this.GetCheckedQuestionnaireList(id);
    }

    onCheckboxChange(e) {
        this.PreQualifyQuestonFormArray = this.form.get('PreQualifyQuestonForm') as FormArray;
        if (e.target.checked) {
            this.PreQualifyQuestonFormArray.push(new FormControl(e.target.value));
        } else {
            const index = this.PreQualifyQuestonFormArray.controls.findIndex(x => x.value === e.target.value);
            this.PreQualifyQuestonFormArray.removeAt(index);
        }

        if (this.PreQualifyQueston.length == this.PreQualifyQuestonFormArray.controls.length) {
            this.PreQualifyQuestonChecked = false;
        }
        else {
            this.PreQualifyQuestonChecked = true;
        }
    }

    ApplyIndividualJob(Jobid: any) {
        let jobid = Jobid;
        let cid = this.CandidateId;
        this.joblist.AssignPreQualifyQuestonstoCandidate(cid, jobid, this.PreQualifyQuestonFormArray);
        this.joblist.ApplySingleJob(cid, jobid);
        //debugger;
    }


    GetCheckedQuestionnaireList(jobid) {
        //this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/GetCheckedQuestionnaireList?JobId='+ jobid).subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/jobService/GetCheckedQuestionnaireList?JobId=' + jobid).subscribe(data => {
            this.QuestionareCount = data.Table1[0].QuestionareCount;
        });
    }

    getRecruiters() {
        //this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/getlistOfRecruiters').subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/jobService/getlistOfRecruiters').subscribe(data => {
            this.recruitersList = data.$values;
        });
    }

    navigatetoevaluation(jobId: any) {
        sessionStorage.setItem('evaluationcandidatejobid', jobId);
        this.route.navigate(['/evaluation']);
    }

    openModal(templateRef: TemplateRef<any>) {
        const dialogRef = this.matdialog.open(templateRef, {
            width: '500px',
            height: '300px',
            autoFocus: false,
        });

        dialogRef.afterClosed().subscribe(result => {
            this.route.navigate(['/jobs']);
        });
    }
}
