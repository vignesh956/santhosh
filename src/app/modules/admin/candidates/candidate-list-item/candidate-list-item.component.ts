import { Component, Input, Output, EventEmitter, TemplateRef, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { CandidatesComponent } from 'app/modules/admin/candidates/candidates.component';
//import { FuseProgressBarService } from '../../../../../@fuse/components/progress-bar/progress-bar.service';
import { CandidateserviceService } from 'app/services/candidateservice.service';
import { AuthenticationService } from 'app/services/authentication.service';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { MatCheckbox } from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { RepositoryConstant } from '../../../constants/Repository.constant';
import { DatePipe } from '@angular/common';
@Component({
    selector: 'candidate-list-item',
    templateUrl: './candidate-list-item.component.html',
    styleUrls: ['./candidate-list-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe]
})
export class CandidateListItemComponent implements OnInit, OnDestroy {
    public apiUrl: string = RepositoryConstant.apiUrl;
    @Input() candidate: any;
    @ViewChild('EditFolderDialog', { static: true }) EditFolderDialog: TemplateRef<any>;
    constructor(
        public candidatelist: CandidatesComponent,
        private matdialog: MatDialog, private authService: AuthenticationService,
        private candidateService: CandidateserviceService,
        //private _fuseProgressBarService: FuseProgressBarService,
        private sanitizer: DomSanitizer,
        private _formBuilder: FormBuilder,
        private http: HttpClient,
        private router: Router,
    ) {
        this.getRecruiters();
        let loggedInfo = this.authService.getLoggedInfo();
        this.userID = loggedInfo.id;
        this.newFolderFormGroup = this._formBuilder.group({
            newfolder: ['', Validators.required]
        });
        this.EditFolderFormGroup = this._formBuilder.group({
            folderId: ['']
        });
    }
    Candidates;
    selectedCandidate;
    selectedRecruiters = [];
    selectedCandidateIds = [];
    recruitersList: any;
    userID;
    fileType: string;
    resumeEncoded: any;
    resumeName: any;
    IsPdf = false;
    IsDoc = false;
    filepath: any;
    docpath: any;
    selectedCandidates;
    isNewFolder = true;
    candidateFolderList: any[] = [];
    curFolderId: any;
    curFolder: any;
    curFolderStatus: any;
    selectedCount = 0;
    AllCandidates = [];
    newFolderFormGroup: FormGroup;
    EditFolderFormGroup: FormGroup;
    folderList: any[] = [];
    filteredFolderList: any[] = [];
    candidatefolderIds = [];

    ngOnInit() {
        this.getfoldersbyuserid();
        this.getfoldersbyCandidateId();
    }

    ngOnDestroy(): void {
    }
    @Output() onChecked: EventEmitter<any> = new EventEmitter<any>();

    public checkValue(isChecked: MatCheckbox): void {
        this.onChecked.emit(isChecked.checked);
    }
    selectRecord() {
        this.selectedCandidate = this.candidate['Id'];
        this.candidateService.getCandidatelist().subscribe(data => {
            this.selectedCandidates = data.Candidates.filter(x => x.Id == this.selectedCandidate);
        });
    }

    getRecruiters() {
        this.candidateService.getrecuiterslist().subscribe(data => {
            this.recruitersList = data;
        });
    }

    selectedrecruiters(event) {
        this.selectedRecruiters = event.value;
    }

    openNewFolderDialogModal(templateRef: TemplateRef<any>, _width, _height, id: any) {
        this.newFolderFormGroup.reset();
        this.selectedCandidateIds = [];
        this.selectedCandidateIds.push(id);
        this.AllCandidates = [];
        this.candidateService.getCandidatelist().subscribe(data => {
            this.AllCandidates = data.Candidates.filter(x => x.Id == id);
        });
        const dialogRef = this.matdialog.open(templateRef, {
            width: _width,
            height: _height,
            autoFocus: false,
        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }

    openDialogModal(templateRef: TemplateRef<any>, _width, _height) {
        this.EditFolderFormGroup.reset();
        this.selectedCandidateIds = [];
        const dialogRef = this.matdialog.open(templateRef, {
            width: _width,
            height: _height,
            autoFocus: false,
        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }

    openModal(templateRef: TemplateRef<any>) {
        const dialogRef = this.matdialog.open(templateRef, {
            width: '800px',
            height: '600px',
            autoFocus: false,
        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }

    openModalviewresume(templateRef: TemplateRef<any>, resumePath: any) {

        let resumename = resumePath.split('resume/')[1];
        let extension = resumename.split('.')[1];
        this.IsPdf = false;
        this.IsDoc = false;
        this.filepath = '';
        this.docpath = '';
        if (extension == "pdf") {
            this.IsPdf = true;
            this.filepath = this.sanitizer.bypassSecurityTrustResourceUrl(resumePath);
        }
        else {
            this.IsDoc = true;
            this.docpath = this.sanitizer.bypassSecurityTrustResourceUrl("https://docs.google.com/gview?url=" + resumePath + "&embedded=true");
        }

        const dialogRef = this.matdialog.open(templateRef, {
            width: '800px',
            height: '600px',
            autoFocus: false,
        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }

    formatString(val) {
        return val.toString();
    }

    redirectToEditcandidate(id: any) {
        //debugger;
        this.candidatelist.redirectToEditcandidate(id);
    }
    redirectCandidate(id: any) {
        this.matdialog.closeAll();
        this.router.navigate(['/candidates/edit-candidate/', id]);
        //this.router.navigate(['/candidates/edit-candidate/', id]);
    }

    shareCandidate() {
        //this._fuseProgressBarService.show();
        if (this.selectedRecruiters.length != 0) {
            var payLoad = {
                CandidateIds: this.selectedCandidateIds,
                RecruitersIds: this.selectedRecruiters,
                UserId: this.userID
            }
            this.candidateService.sharecandidate(payLoad).subscribe(data => {
                //this._fuseProgressBarService.hide();
                this.matdialog.closeAll();
                Swal.fire(
                    'Candidate(s) info shared successfully!',
                    '',
                    'success'
                );
            });
        }
    }

    printDescription(candidateID) {
        this.candidatelist.printDescription(candidateID);
    }

    DownloadResume(resumePath: any) {
        //this._fuseProgressBarService.show();
        let path = resumePath;
        let resumename = path.split('resume/')[1];
        this.resumeEncoded = path;
        this.resumeName = resumename;
        //let saveAs = require('file-saver');
        //let file = this.resumeName;
        //saveAs(this.resumeEncoded, file);
        //this._fuseProgressBarService.hide();
    }
    chkfolderStatus(event: MatRadioChange) {
        if (event.value)
            this.isNewFolder = true;
        else
            this.isNewFolder = false;
    }
    getfoldersbyCandidateId() {
        var payLoad = {
            candidateId: this.candidate['Id'],
            UserId: this.userID
        }
        this.candidateService.getFoldersbyCandidateId(payLoad).subscribe(res => {
            this.candidateFolderList = [];
            if (res.length > 0) {
                this.curFolderId = res[0].FolderId;
                this.curFolder = res[0].FolderName;
                this.curFolderStatus = res[0].Status;
                this.candidateFolderList = res;
                this.candidatefolderIds = [];
                this.candidateFolderList.forEach(element => {
                    this.candidatefolderIds.push(element.FolderId);
                });
            }
            //this.getfoldersbyuserid();
        });
    }
    getfoldersbyuserid() {
        var payLoad = {
            UserId: this.userID
        }
        this.candidateService.getFoldersbyUserId(payLoad).subscribe(res => {
            this.folderList = [];
            this.filteredFolderList = [];
            this.folderList = res.$values;
            this.filteredFolderList = res.$values.filter(x => !this.candidatefolderIds.includes(x.FolderId));
        });
    }
    getCandidatesbyFoldersId(folder: any) {
        this.selectedCount = 0;
        this.AllCandidates = [];
        this.curFolderId = folder.folderId;
        this.curFolder = folder.folderName;
        this.curFolderStatus = folder.status;
        var payLoad = {
            folderId: folder.folderId
        }
        this.candidateService.getCandidatesbyFolderId(folder.folderId).subscribe(res => {
            this.AllCandidates = res;
        });
        this.openDialogModal(this.EditFolderDialog, '950px', '550px');
    }
    UpdateFolder() {
        // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/UpdateFolder', {
        this.http.post<any>(this.apiUrl + '/api/candidateService/UpdateFolder', {
            CandidateIds: this.selectedCandidateIds,
            FolderId: this.EditFolderFormGroup.get('folderId').value
        }).subscribe(data => {
            this.getfoldersbyCandidateId();
            this.candidatelist.reloadCandidatesPaginationList();
            Swal.fire(
                'Folder updated successfully',
                '',
                'success'
            );
        });
        this.matdialog.closeAll();
    }
    isCandidateChecked(isChecked: MatCheckbox, candidateId: any) {
        if (isChecked.checked) {
            this.selectedCount++;
            this.selectedCandidateIds.push(candidateId);
        }
        else {
            this.selectedCount--;
            this.selectedCandidateIds.forEach((element, index) => {
                if (element == candidateId) this.selectedCandidateIds.splice(index, 1);
            });
        }
    }
    RemoveCandidatesfromFolder() {
        Swal.fire({
            title: 'Are you sure, you want to remove selected candidates from ' + this.curFolder + ' folder?',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/RemoveCandidatesFromCandidateToFolder', {
                this.http.post<any>(this.apiUrl + '/api/candidateService/RemoveCandidatesFromCandidateToFolder', {
                    CandidateIds: this.selectedCandidateIds,
                    FolderId: this.curFolderId
                }).subscribe(data => {
                    this.getfoldersbyCandidateId();
                    this.candidatelist.reloadCandidatesPaginationList();
                    Swal.fire(
                        'Removed selected candidates from ' + this.curFolder + ' folder successfully',
                        '',
                        'success'
                    );
                });
                this.matdialog.closeAll();
            }
        });
    }
    createNewFolder() {
        if (this.isNewFolder) {
            let folderexists = this.folderList.find((x) => x.FolderName === this.newFolderFormGroup.get('newfolder').value);
            if (!folderexists) {
                // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/CreateFolder', {
                this.http.post<any>(this.apiUrl + '/api/candidateService/CreateFolder', {
                    FolderName: this.newFolderFormGroup.get('newfolder').value,
                    UserId: this.userID,
                    CandidateIds: this.selectedCandidateIds,
                    Status: 1
                }).subscribe(data => {
                    this.getfoldersbyCandidateId();
                    Swal.fire(
                        this.newFolderFormGroup.get('newfolder').value + ' folder created successfully',
                        '',
                        'success'
                    );
                });
            }
            else {
                Swal.fire(
                    this.newFolderFormGroup.get('newfolder').value + ' folder already exists',
                    '',
                    'error'
                );
            }
        }
        else {
            // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/CreateFolder', {
            this.http.post<any>(this.apiUrl + '/api/candidateService/CreateFolder', {
                FolderName: this.newFolderFormGroup.get('newfolder').value,
                UserId: this.userID,
                CandidateIds: this.selectedCandidateIds,
                Status: 1
            }).subscribe(data => {
                this.getfoldersbyCandidateId();
                Swal.fire(
                    'Added selected candidates to ' + this.newFolderFormGroup.get('newfolder').value + ' folder',
                    '',
                    'success'
                );
            });
        }
        this.matdialog.closeAll();
    }
    UpdateFolderStatus(status: any) {
        let statusText = status == true ? 'Active' : 'Archive';
        let statusValue = status == true ? 1 : 0;
        Swal.fire({
            title: 'Are you sure, you want to update ' + this.curFolder + ' folder status to ' + statusText + '?',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/UpdateFolderStatus?FolderId=' + parseInt(this.curFolderId) + '&Status=' + statusValue, {}).subscribe(data=>{
                this.http.post<any>(this.apiUrl + '/api/candidateService/UpdateFolderStatus?FolderId=' + parseInt(this.curFolderId) + '&Status=' + statusValue, {}).subscribe(data => {
                    this.getfoldersbyCandidateId();
                    Swal.fire(
                        this.curFolder + ' folder status changed to ' + statusText + ' successfully',
                        '',
                        'success'
                    );
                });
                this.matdialog.closeAll();
            }
        });
    }
    RemoveCandidate(Id: any, frmName: any) {
        this.curFolder = frmName == 'New' ? 'New' : this.curFolder;
        if (frmName == 'New') {
            this.selectedCandidates.forEach((element, index) => {
                if (element.Id == Id) {
                    this.selectedCandidates.splice(index, 1);
                }
            });
            Swal.fire(
                'Removed selected candidates from ' + this.curFolder + ' folder successfully',
                '',
                'success'
            );
        }
        else {
            this.selectedCandidateIds = [];
            this.selectedCandidateIds.push(Id);
            this.RemoveCandidatesfromFolder();
        }
    }
}
