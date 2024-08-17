import { Component, OnInit, ViewChild, ElementRef, TemplateRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, AbstractControl, Validators } from '@angular/forms';
import { CandidateserviceService } from 'app/services/candidateservice.service';
import { AuthenticationService } from "app/services/authentication.service";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//import { MatPaginator, MatSort, MatDatepickerInputEvent, MatInput, MatChipInputEvent, MatTableDataSource, MatDialog, MatSnackBar, MatDialogRef, MatRadioChange, MatCheckbox } from "@angular/material";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatInput } from "@angular/material/input";
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatRadioChange } from "@angular/material/radio";
import { MatCheckbox } from "@angular/material/checkbox";
import { ActivatedRoute } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
//import {FuseProgressBarService} from '../../../../../../@fuse/components/progress-bar/progress-bar.service';
//import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from 'app/shared/alert-dialog/alert-dialog.component';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { StarRatingColor } from 'app/star-rating/star-rating.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import pdfmake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfmake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import { DateRendererComponent } from '../../components/date-renderer.component';
//import {FuseSidebarService} from '@fuse/components/sidebar/sidebar.service';
import { GridOptions } from '@ag-grid-community/all-modules';
import { NewCandidateButtonsRendererComponent } from './components/buttons-renderer.component';
import { DatePipe } from '@angular/common';
import { CandidateService } from 'app/services/candidate.service';
import { interval, Subscription, timer } from 'rxjs';
import { EvaluationserviceService } from 'app/services/evaluationservice.service';
import { RepositoryConstant } from '../../../../constants/Repository.constant';
import { map } from 'lodash';
import * as moment from 'moment';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
// import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';



@Component({
    selector: 'new-candidate',
    templateUrl: './new-candidate.component.html',
    styleUrls: ['./new-candidate.component.scss'],
    providers: [DatePipe],
})
export class NewCandidateComponent implements OnInit, AfterViewChecked {
[x: string]: any;
    public apiUrl: string = RepositoryConstant.apiUrl;
    @ViewChild('profileInput', { static: true }) profileInput;
    @ViewChild('salarycurrent', { static: true }) focussalarycurrent: ElementRef;
    @ViewChild('Rejectmodal', { static: true }) Rejectmodal: TemplateRef<any>;
    @ViewChild('AssignmentCanidate', { static: true }) AssignmentCanidate: TemplateRef<any>;
    @ViewChild('AssignmentInterviewer', { static: true }) AssignmentInterviewer: TemplateRef<any>;
    @ViewChild('HrUsersDialog', { static: true }) HrUsersDialog: TemplateRef<any>;
    @ViewChild('pdfCandidates', { static: true }) pdfCandidates: ElementRef;
    @ViewChild('EditFolderDialog', { static: true }) EditFolderDialog: TemplateRef<any>;
    @ViewChild('TechnicalInterviewerUsersDialog', { static: true }) TechnicalInterviewerUsersDialog: TemplateRef<any>;
    //confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild('InterviewCancelmodal', { static: true }) InterviewCancelmodal: TemplateRef<any>;
    //@ViewChild('item_From_Year',null) fromyear1: ElementRef;
    //item_From_Year: string="";
    //@ViewChild('candidatename',null) candidatename: ElementRef;
    today = new Date();
    ConInterviewType;
    //CurrentYear = this.today.getFullYear();
    context: any;
    public Editor = ClassicEditor;
    editCandidateID;
    private sub: any;
    userID;
    //private  CountReload : number = 0;
    gridOptions: GridOptions;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    newFolderFormGroup: FormGroup;
    EditFolderFormGroup: FormGroup;
    candidateAssesmentFormGroup: FormGroup;
    firstFormGroupSubmitted = false;
    myControl = new FormControl();
    isFirstFormGroupLoaded = false;
    uploadedFiles: any[] = [];
    formPageTitle;
    searchFills: any = {};
    selectedLocationAddress: any;
    location_options = [];
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    Tags: string[] = [];
    TagsEducation: string[] = [];
    selectable = true;
    removable = true;
    candidateID = 0;
    isdeactivateIcon: boolean = false;
    AcId = 0;
    selectedExperience;
    selectedrelocatevalue;
    candidateskills: any;
    selectedDob;
    SelectEducationtoEvent;
    SelectEducationFromEvent;
    SelectExperianceRelivedEvent;
    SelectExperianceJoinnedEvent;
    SelectAwardYearEvent;
    scorresume;
    prevCandidateId;
    nextCandidateId;
    IsRelocate: boolean;
    candidateData: any[] = [];
    selectedAssignJobs = [];
    candidate: any;
    changedDate: any;
    isStep1Completed: boolean = false;
    isStep2Completed: boolean = false;
    isStep3Completed: boolean = false;
    isStep4Completed: boolean = false;
    isStep5Completed: boolean = false;
    isStep6Completed: boolean = false;
    isStep7Completed: boolean = false;
    CandidateProfileImage;
    candidateprofileimageURL;
    UploadCandidateProfileImage: any[] = [];
    IsEdit: boolean = false;
    Islinear: boolean = false;
    resumeselectedFiles: any[] = [];
    resumeList: any[] = [];
    folderList: any[] = [];
    candidateFolderList: any[] = [];
    filepath: any;
    docpath: any;
    IsPdf: boolean = false;
    IsDoc: boolean = false;
    selectCurrentResume: any;
    curFolderId: any;
    curFolder: any;
    curFolderStatus: any;
    InterviewMessageBody: any;
    candidateActivitiesList: any[] = [];
    editCandidateGetData;
    IsEditAnyField: boolean = false;
    ActivitiesGroupdata: any = [];
    recruitersList: any;
    Activejobs: any;
    selectedRecruiters = [];
    selectedHrs = [];
    selectedUserRoles = [];
    selectedInterviewers = [];
    TraitTypes = [];
    TraitData: any = [];
    traitScore = ['1', '2', '3', '4', '5'];
    timers = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
    timeType = ['AM', 'PM'];
    traitExperience = [];
    traitTechnicalQuestions = [];
    traitTechnicalAssignment = [];
    traitResumeReview = [];
    traitBehavioralQuestions = [];
    isVisible: any;
    commonfieldName;
    commonfieldDesignation;
    commonfieldCompany;
    commonfieldEmail;
    commonfieldMobile;
    commonfieldLocation;
    resumeEncoded: any;
    resumeName: any;
    curDate: any;
    defaultAction: any;
    defaultAppliedJobAction: any;
    appliedjobdate: any;
    jobstatus: any;
    defaultinterviewstagechange: any;
    defaultTag: any;
    defaultSelection: any;
    defaultassessmentCall: any;
    defaultassignmentCall: any;
    defaultessentailCall: any;
    rowSelection;
    defaultassessmentRole: any;
    defaultassignmentRole: any;
    defaultessentailRole: any;
    defaultStatus: any;
    defaultTechnicalCall: any;
    defaultTechnicalCallTime: any;
    userName: any;
    defaultSkill;
    defaultLevel;
    defaultRating;
    defaultExpAnswer;
    IsAdvance: boolean = false;
    ApplicationStatusIsAdvance: any;
    RejectInterviewMessageBody: any;
    InterviewTypeCancelModel: any;
    InterviewTypeRejectlModel: any;
    // preselectedSkills: any[];
    ;
    IsInterviewAdvance: boolean = false;
    Isinterviewchange: boolean = false;
    userRole: any;
    userEmail: any;
    hrRoleUsers = [];
    CandidatExperiance = [];
    CandidateAwardsAndCertificate = [];
    CandidatEducationInfo = [];
    selectedUserEmail = [];
    interviewers = [];
    hiringmanagers = [];
    printCandidates = [];
    selectedCandidateIds = [];
    selectedResume;
    gridratesize: number = 10;
    InputMessage;
    test456: any;
    message;
    userName123;
    UserId;
    _Recruiters = new Map();
    _RecruiterEmails = new Map();
    openJobsList: any;
    appliedJobsList: any;
    gridApi;
    gridColumnApi;
    rowData: any;
    selectedRowsCnt = 0;
    gridtotRowCount;
    selectedOpenJobs = [];
    EducationsInfo = [];
    AllCandidates = [];
    isNewFolder = true;
    selectedCount = 0;
    filteredFolderList: any[] = [];
    candidatefolderIds = [];
    defaultColDef;
    selectedQuestion;
    frameworkComponents;
    SelectTechnicalInterviewDate: any;
    TechnicalInterviewDueBy: any;
    InterviewTypeSelected: any;
    skipCandidate: boolean = true;
    InterviewModeSelected = [];
    InterviewTimeFromSelected: any;
    InterviewTimeType: any;
    InterviewTimeToSelected: any;
    selectedjobid: any;
    InterviewWhoSelected: any;
    roomsFilter: any;
    candidateinterviewSchedule: any;
    candidateinterview: boolean = false;
    candidateinterviewScheduled: any;
    AllcandidateinterviewScheduled: any;
    candidateinterviewer: any;
    ModifyInterviewType: any;
    ModifyInterviewMode: any;
    GetInterviewMode: any;
    ModifyScore: any;
    InterviewMode: any;
    ModifyInterviewers: any;
    ModifyInterviewDate: any;
    ModifyInterviewFrom: any;
    ModifyInterviewTimeType: any;
    Selecthruser: any;
    users: any;
    CandidateAddDate: any;
    HiringManager: any;
    selectedusers = [];
    GetCandidateAssigningTo: any;
    private msgSubscription: Subscription;
    CandidateMessage: any[] = [];
    CandidateUnReadMsg: any = 0;
    IsCandidateAssiged: boolean = false;
    ApplicationStatus: any;
    private CountReload: number = 0;
    ModifyInterviewId;
    Qualification: any;
    Educationform: FormGroup;
    Experianceform: FormGroup;
    Awardsform: FormGroup;

    loggedInfo: any
    IsMessagesTabClicked: boolean = false;
    timerSubscription: Subscription;
    reactiveFromArrayitems: FormArray;
    ExperianceformArrayitems: FormArray;
    AwardsformArrayitems: FormArray;
    editCandidateDisable: boolean = false;
    hideFormField: boolean = false;
    hideFormField1: boolean = true;
    // public files: NgxFileDropEntry[] = [];


    // file drop 
    public files: any;

    public webColumns = [
        {
            headerName: '',
            field: '',
            showCol: false,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            width: 50,
            dropdownItem: false
        },
        {
            headerName: 'Action',
            field: 'skill',
            cellRenderer: 'ButtonsRendererComponent',
            width: 100,
            valueGetter: function (params) {
                return {
                    Id: params.data.Id,
                    Title: params.data.Title,
                    params: params
                };
            },
            dropdownItem: false
        },
        {
            headerName: 'Skill',
            field: 'skill',
            filter: 'agTextColumnFilter',
            tooltipField: 'skill',
            width: 100,
            dropdownItem: true
        },
        {
            headerName: 'Added By',
            cellClass: "grid-cell-centered",
            field: 'addedby',
            resizable: true,
            sortable: true,
            filter: 'agTextColumnFilter',
            tooltipField: 'addedby',
            width: 120,
            dropdownItem: true
        },
        {
            headerName: 'Level',
            field: 'level',
            cellClass: "grid-cell-centered",
            columnGroupShow: 'closed',
            filter: 'agTextColumnFilter',
            tooltipField: 'level',
            width: 120,
            dropdownItem: true
        },
        {
            headerName: 'Question Descriptor',
            cellClass: "grid-cell-centered",
            field: 'questiondescriptor',
            resizable: true,
            filter: 'agTextColumnFilter',
            width: 350,
            dropdownItem: true
        },
        {
            headerName: 'Rating',
            cellClass: "grid-cell-centered",
            field: 'rating',
            resizable: true,
            filter: 'agTextColumnFilter',
            width: 100,
            dropdownItem: true
        }
    ];
    constructor(
        private _formBuilder: FormBuilder,
        private http: HttpClient,
        private matdialog: MatDialog,
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private candidateService: CandidateserviceService,
        private route: ActivatedRoute,
        //private _fuseProgressBarService: FuseProgressBarService,
        private authService: AuthenticationService,
        private sanitizer: DomSanitizer,
        private router: Router,
        //public _fuseSidebarService: FuseSidebarService,
        public DatePipe: DatePipe,
        private candidateServices: CandidateService,
        private EvaluationserviceService: EvaluationserviceService,
        private cdRef: ChangeDetectorRef
    ) {
        this.newFolderFormGroup = this._formBuilder.group({
            newfolder: ['', Validators.required]
        });
        this.EditFolderFormGroup = this._formBuilder.group({
            folderId: ['']
        });
        this.context = {
            componentParent: this
        };
        this.defaultColDef = {
            sortable: true,
            resizable: true,
            width: 'auto'
        };
        //this._fuseSidebarService.getSidebar('navbar').toggleFold();//
        this.gridOptions = <GridOptions>{
            enableSorting: true,
            enableFilter: true,
        };
        this.rowSelection = 'multiple';
        this.gridOptions.columnDefs = this.webColumns;
        this.gridOptions.pagination = true;
        this.gridOptions.skipHeaderOnAutoSize = true;
        this.frameworkComponents = {
            DateRendererComponent: DateRendererComponent,
            ButtonsRendererComponent: NewCandidateButtonsRendererComponent
        };

        this.Educationform = _formBuilder.group(
            {
                items:
                    this._formBuilder.array([

                    ])
            });

        this.Experianceform = _formBuilder.group(
            {
                items:
                    this._formBuilder.array([
                    ])
            });

        this.Awardsform = _formBuilder.group(
            {
                items:
                    this._formBuilder.array([
                    ])
            });

    }
    ngAfterViewChecked(): void {
        //throw new Error('Method not implemented.');
        let editCandidateDisable = (this.firstFormGroup.invalid || this.Educationform.invalid || this.Experianceform.invalid || this.Awardsform.invalid);
        if (editCandidateDisable != this.editCandidateDisable) { // check if it change, tell CD update view
            this.editCandidateDisable = editCandidateDisable;
            this.cdRef.detectChanges();
        }
    }

    get items() {
        return this.Educationform.get('items') as FormArray;
    }


    RemoveEducationItem(ItemId) {
        this.items.removeAt(ItemId);
    }


    AddEducationItem() {
        const itemLenght = this.items.length;

        const newitem =
            this._formBuilder.group({
                CandidateId: this.editCandidateID,
                itemId: [itemLenght + 1],
                Item_Qualification: ['', Validators.required],
                item_College_University: ['', Validators.required],
                item_From_Year: ['', Validators.required],
                item_To_Year: ['', Validators.required],
                item_Score: ['', Validators.required]
            })

        this.items.push(newitem);
    }



    get Experianceformitems() {
        return this.Experianceform.get('items') as FormArray;
    }

    get Awardsformitems() {
        return this.Awardsform.get('items') as FormArray;
    }



    RemoveExperianceItem(ItemId) {
        this.Experianceformitems.removeAt(ItemId);
    }

    RemoveAwardsformItem(ItemId) {
        this.Awardsformitems.removeAt(ItemId);
    }


    AwardsformAddItem() {

        const AwardsitemLenght = this.Awardsformitems.length;
        const Awardsnewitem =

            this._formBuilder.group({
                CandidateId: this.editCandidateID,
                AwardId: [AwardsitemLenght + 1],
                AwardsAndCertificate: ['', Validators.required],
                AwardYear: ['', Validators.required],
                AwardsAndCertificateDetails: ['', Validators.required]
            })


        this.Awardsformitems.push(Awardsnewitem);
    }


    ExperianceformAddItem() {

        const itemLenght = this.Experianceformitems.length;
        const newitem =

            this._formBuilder.group({
                CandidateId: this.editCandidateID,
                ExperianceId: [itemLenght + 1],
                CompanyName: ['', Validators.required],
                Joinned: ['', Validators.required],
                Relived: ['', Validators.required],
                Place: ['', Validators.required],
                Designation: ['', Validators.required]
            })

        this.Experianceformitems.push(newitem);
    }

    ngOnInit() {
        //debugger;
        // this.candidatename.nativeElement.focus();
        //this.IsRelocate = false;
        this.firstFormGroup = this._formBuilder.group({
            candidateName: "",
            currentEmployer: "",
            email: "",
            desiredsalary: "",
            preselectedSkills: "",
            experience: "",
            nationality: "",
            relocate: "",
            designation: "",
            candidate_location: "",
            dob: "",
            overview: "",
            //skills: [[], Validators.required],
            mobileno: "",
            facebook: "",
            linkedin: "",
            twitter: "",
            github: "",
            stackoverflow: "",
        });
        this.InputMessage = '';
        this.sub = this.route.params.subscribe(params => {
            this.editCandidateID = +params['id'];

        });
        this.searchFills = this.candidateService.getSearchFills();
        let loggedInfo = this.authService.getLoggedInfo();
        this.userID = loggedInfo.id;
        this.selectedHrs.push(loggedInfo.id.toString());
        if (loggedInfo.role == 'HR Manager' || loggedInfo.role == 'Hiring Manager')
            this.selectedUserRoles.push(loggedInfo.role);
        this.userRole = loggedInfo.role;
        this.userName = loggedInfo.firstName + ' ' + loggedInfo.lastName;
        this.userEmail = loggedInfo.email;
        // this.UserId = loggedInfo.Id;
        //this.curDate = new Date();
        this.defaultAction = "Select";
        //this.defaultAppliedJobAction ="Select";
        this.defaultAppliedJobAction = 0;
        this.defaultSkill = "Select";
        this.defaultLevel = "Select";
        this.defaultRating = "Select";
        this.defaultExpAnswer = "Select";
        this.defaultinterviewstagechange = "Select";
        this.defaultassessmentCall = "Select";
        this.defaultassignmentCall = "Select";
        this.defaultessentailCall = "Select";
        this.ModifyInterviewType = "Select";
        this.defaultassessmentRole = "Select";
        this.defaultassignmentRole = "Select";
        this.defaultessentailRole = "Select";
        this.defaultStatus = "Active";
        this.defaultTag = "None";
        this.defaultSelection = "In Progress";
        this.defaultTechnicalCall = "TeamsCall";
        this.defaultTechnicalCallTime = "EasternTime";
        this.candidateinterview = false;
        this.ApplicationStatusIsAdvance = "Select";
        this.selectedAssignJobs = [];
        this.getinterviewers();
        this.GethrRoleUsers();
        this.getRecruiters();
        this.getopenJobs(this.editCandidateID);
        this.getcandidateappliedJobs();
        this.GetCandidateAssigningToInfo();
        this.getCandidateSheduleInterviewInfo();
        this.getInterviewMode();
        this.getfoldersbyCandidateId();
        this.getfoldersbyuserid();
        this.gethrUsers();
        this.getcandidateskills();
        this.GetCandidatExperiance_EducationInfo();
        this.loggedInfo = this.authService.getLoggedInfo();

        this.CandidateAddDate = new Date().toLocaleString();
       // debugger;
        if (loggedInfo.role == "Candidate") {
            localStorage.setItem('ClickCount', this.CountReload.toString());
            this.hideFormField = true;
            this.hideFormField1 = false;
            //this.GetCandidatesEvaluationInfo(this.defaultAppliedJobAction,this.editCandidateID);
        }
        
        if (loggedInfo != null) {
            this.HiringManager = this.loggedInfo.firstName + ' ' + this.loggedInfo.lastName
            //debugger;
            if (localStorage.getItem('ClickCount') == '0') {
                if (loggedInfo.role == 'Candidate' && loggedInfo.currentCandidateDesignation == '') {
                    let elementbtnEditCandidateDialog: HTMLElement = document.getElementById('btnEditCandidateDialog') as HTMLElement;
                    let inputcandidateName = document.getElementById('candidatename');
                    elementbtnEditCandidateDialog.click();
                    localStorage.setItem('ClickCount', localStorage.getItem('ClickCount') + 1);
                    // inputcandidateName.focus();
                }

                else if (loggedInfo.role == 'Candidate' && loggedInfo.currentCandidateResume == '') {
                    let elementbtnUploadCandidateResume: HTMLElement = document.getElementById('btnUploadCandidateResume') as HTMLElement;
                    elementbtnUploadCandidateResume.click();
                }
            }
        }


        if (loggedInfo.role == "Candidate") {
            this.skipCandidate = false;
        }
        //debugger;
        if (!isNaN(this.editCandidateID)) {
            this.IsEdit = true;
            this.Islinear = false;
            this.isStep1Completed = true;
            this.isStep2Completed = true;
            this.isStep3Completed = true;
            this.isStep4Completed = true;
            this.isStep5Completed = true;
            this.isStep6Completed = true;
            this.isStep7Completed = true;
            //this._fuseProgressBarService.show();
            //debugger;
            this.candidateService.getByCandidateId(this.editCandidateID).subscribe(data => {
                //  debugger;
                this.candidateData[0] = data['$values'][0];

                this.candidate = this.candidateData[0];

                this.scorresume = this.candidateData[0].score;
                this.prevCandidateId = this.candidateData[0].previousCandidateId;
                this.nextCandidateId = this.candidateData[0].nextCandidateId;
                //this._fuseProgressBarService.hide();
                if ((this.candidateData[0].skills || '').trim()) {
                    let exist = this.candidateData[0].skills.includes(',');
                    this.Tags = [];
                    // this.preselectedSkills=[];
                    if (exist) {
                        let tagsvalues = this.candidateData[0].skills.split(',');
                        for (let i = 0; i < tagsvalues.length; i++) {
                            this.Tags.push(tagsvalues[i]);
                            // this.preselectedSkills.push(tagsvalues[i]);  
                        }
                    }
                    if (!exist) {
                        this.Tags.push(this.candidateData[0].skills);
                        //  this.preselectedSkills.push(this.candidateData[0].Skills);  
                    }
                }
                let dob = new Date((this.candidateData[0].dateOfBirth - 3888000000));
                this.candidateID = data['$values'][0]['id'];
                this.selectedExperience = data['$values'][0]['experience'];
                this.IsRelocate = data['$values'][0]['relocate'];
                this.selectedDob = data['$values'][0]['dateOfBirth'];
                this.CandidateProfileImage = data['$values'][0]['profileImage'];
                this.candidateprofileimageURL = data['$values'][0]['profileImage'];
                this.rating = data['$values'][0]['rating'];
                this.firstFormGroup = this._formBuilder.group({
                    candidateName: [data['$values'][0]['name'], Validators.required],
                    currentEmployer: [data['$values'][0]['currentEmployer'], Validators.required],
                    email: [data['$values'][0]['email'], Validators.required],
                    desiredsalary: [data['$values'][0]['salary'], Validators.required],
                    preselectedSkills: (data['$values'][0]['skills'] == null || data['$values'][0]['skills']=="")?"": [data['$values'][0]['skills'].split(',')],
                    experience: [data['$values'][0]['experience'], Validators.required],
                    nationality: [data['$values'][0]['name'], Validators.required],
                    relocate: [data['$values'][0]['relocate'], Validators.required],
                    designation: [data['$values'][0]['designation'], Validators.required],
                    candidate_location: [data['$values'][0]['location'], Validators.required],
                    dob: [this.selectedDob, [Validators.required, this.dateValidator]],
                    overview: [data['$values'][0]['overview'], Validators.required],
                    //skills: [[], Validators.required],
                    mobileno: [data['$values'][0]['mobileNumber'], Validators.required],
                    facebook: [data['$values'][0]['facebook']],
                    linkedin: [data['$values'][0]['linkedIn']],
                    twitter: [data['$values'][0]['twitter']],
                    github: [data['$values'][0]['gitHub']],
                    stackoverflow: [data['$values'][0]['stackOverflow']],
                });
                this.editCandidateGetData = this.candidateData[0];
                //debugger;
                //console.log('edit data ' + this.editCandidateGetData);
                this.isFirstFormGroupLoaded = true;

                this.commonfieldName = this.editCandidateGetData.Name;
                this.commonfieldDesignation = this.editCandidateGetData.Designation;
                this.commonfieldCompany = this.editCandidateGetData.CurrentEmployer;
                this.commonfieldEmail = this.editCandidateGetData.Email;
                this.commonfieldMobile = this.editCandidateGetData.MobileNumber;
                this.commonfieldLocation = this.editCandidateGetData.Location;
                this.getresumesbycandidateid(this.editCandidateID);
                this.submitForm2();
            });
            //this.getresumesbycandidateid(this.editCandidateID);
            //this.submitForm2();
        }
        //debugger;
        if (this.loggedInfo.role == "Candidate") {
            setInterval(() => this.getMessage(this.editCandidateID, null), 5000);
        }
        else {

            setInterval(() => this.getMessage(this.editCandidateID, this.loggedInfo.id), 5000);
        }
    }
    //Eswari
    // ValidateYear(event: any)
    MaxYear(control: FormControl): { [s: string]: boolean } {
        //debugger;
        let inputYear = control.value;
        let currentYear = new Date().getFullYear();
        if (inputYear.length == 4) {
            if (inputYear > currentYear) {
                alert('Year should not exceed current year. ');
                return { 'invalidDate': true };
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
    dateValidator(control: FormControl): { [s: string]: boolean } {
        //debugger;
        if (control.value) {
            const birthDate = moment(control.value);
            const today = moment();
            let age = today.year() - birthDate.year();
            let month = today.month() - birthDate.month();
            let Tdate = today.date();
            let Bdate = birthDate.date();
            if (month < 0 || (month === 0 && Tdate < Bdate)) {
                age--;
            }
            if (age < 22) {
                alert('Age Should be greater than 22 years.');
                return { 'invalidDate': true };
            }
            else {
                return null;
            }

        }
    }
    ValidateYear(event: any) //: { [s: string]: boolean }
    {
        //debugger;
        var FromYear = event.target.value;//control.value; //event.target.value;
        var date = new Date();
        var Year = date.getFullYear();
        if (Year < FromYear) {
            event.target.value = null;
            alert('Year should not greater than Current Year');
            return false;
        }
        else {
            return null;
        }

    }
    //Eswari 


    getMessage(candidateID: any, UserId: any) {
        //debugger;
        if (localStorage.getItem("token") != null) {
            this.candidateServices.getMessage(candidateID, UserId, this.defaultAppliedJobAction).subscribe(msg => {
                this.CandidateMessage = msg.Table;
                this.CandidateUnReadMsg = msg.Table1[0].UnReadMsg;
            });
        }
    }


    MessageTabClicked() {
        //debugger;
        if (this.loggedInfo.role == "Candidate") {
            this.candidateServices.updateMessage(this.candidateID, null).subscribe(msg => {
                this.candidateServices.getMessage(this.candidateID, null,this.defaultAppliedJobAction).subscribe(msg => {
                    this.CandidateMessage = msg.Table;
                    this.CandidateUnReadMsg = msg.Table1[0].UnReadMsg;
                });
            })
            this.getMessage(this.candidateID, null);
        }
        else {
            this.candidateServices.updateMessage(this.candidateID, this.loggedInfo.id).subscribe(msg => {
                this.candidateServices.getMessage(this.candidateID, this.loggedInfo.id,this.defaultAppliedJobAction).subscribe(msg => {
                    this.CandidateMessage = msg.Table;
                    this.CandidateUnReadMsg = msg.Table1[0].UnReadMsg;
                });
            })
            this.getMessage(this.candidateID, this.loggedInfo.id);
        }
    }

    onSubmit() {
        var payLoad = {
            CandidateId: this.candidateID,
            Messages: this.InputMessage,
            UserId: this.loggedInfo.id
        }

        if (this.loggedInfo.role == "Candidate") {
            //this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/CreateMessage', {
            this.http.post<any>(this.apiUrl + '/api/candidateService/CreateMessage', {
                CandidateId: this.candidateID,
                Messages: this.InputMessage,
                UserId: null,
                JobId: this.defaultAppliedJobAction
            }).subscribe(data => {
                this.isVisible = true;

                this.InputMessage = "";
                this.getMessage(this.editCandidateID, this.loggedInfo.id);
            });
        }
        else {
            // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/CreateMessage', {
            this.http.post<any>(this.apiUrl + '/api/candidateService/CreateMessage', {
                CandidateId: this.candidateID,
                Messages: this.InputMessage,
                UserId: this.loggedInfo.id,
                JobId: this.defaultAppliedJobAction
            }).subscribe(data => {
                this.isVisible = true;

                this.InputMessage = "";
                this.getMessage(this.editCandidateID, this.loggedInfo.id);
            });
        }
    }


    CloseAllmatdialog() {
        localStorage.setItem('ClickCount', localStorage.getItem('ClickCount') + 1);
        this.matdialog.closeAll();

        //this.router.navigateByUrl('candidatesI/edit-candidate/' + this.editCandidateID).then(() => {
        this.router.navigateByUrl('/candidates/edit-candidate/' + this.editCandidateID).then(() => {
            //    window.location.reload();
        });
    }

    aggridbind() {
        let assignmentinterviewerlist = this.candidateService.getsampleassignmentinterviewer();
        this.rowData = assignmentinterviewerlist.assignmentinterviewerlist;
    }
    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.rowData = [];
        this.aggridbind();
    }
    onGridFilterChanged() {
        this.gridtotRowCount = this.gridOptions.api.getDisplayedRowCount();
    }

    rating: number = 0;
    starCount: number = 5;
    starColor: StarRatingColor = StarRatingColor.accent;
    starColorP: StarRatingColor = StarRatingColor.primary;
    starColorW: StarRatingColor = StarRatingColor.warn;
    // mat star rating var declare end


    // mat star rating start
    onRatingChanged(rating) {
        this.rating = rating;
    }

    onSelectionChanged(event) {
        let selectedRows = this.gridApi.getSelectedRows();
        if (selectedRows.length == 1) {
            this.selectedQuestion = true;
            //this.viewJob(selectedRows[0]);
        } else {
            this.selectedQuestion = false;
        }
        this.selectedRowsCnt = selectedRows.length;
    }


    ngAfterViewInit() {
        if (!this.isVisible) {
            setTimeout(() => {
                this.isVisible = true;
            }, 900);
        }

        if (this.focussalarycurrent != undefined) {
            this.focussalarycurrent.nativeElement.focus();
        }

    }

    onOverviewChange() {
        if (this.firstFormGroup.get('overview').value == null || this.firstFormGroup.get('overview').value == '') {
            document.getElementById('divOverview').style.border = "red 1px solid";
        }
        else {
            document.getElementById('divOverview').style.border = "";
        }
    }

    searchPlaces(val) {
        if (val.length > 3) {
            this.selectedLocationAddress = '';
            this.location_options = [];
            this.candidateService.googlelocations(val).subscribe(data => {
                for (const rec of data) {
                    const obj = {
                        display_name: rec['display_name'],
                        address: rec['address']
                    };
                    this.location_options.push(obj);
                }
            });
        }
    }

    selectedLocation(location) {
        this.selectedLocationAddress = location['address'];
        this.firstFormGroup.patchValue({
            candidate_location: location['display_name']
        });

    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        if ((value || '').trim()) {
            this.Tags.push(value);
        }
        if (input) {
            input.value = '';
        }
    }

    remove(tag: string): void {
        const index = this.Tags.indexOf(tag);
        if (index >= 0) {
            this.Tags.splice(index, 1);
        }
    }
    onFileInput(event) {
        if (event.target.files && event.target.files[0]) {
            this.UploadCandidateProfileImage.push(event.target.files[0])
            if (this.UploadCandidateProfileImage.length > 0) {
                this.saveuploadBlobProfileImage();
            }
        }
    }



    selectedAreas(event) {
        this.selectedExperience = '';
        this.selectedExperience = event.value;
    }

    selectedrelocate(event) {
        this.selectedrelocatevalue = '';
        this.selectedrelocatevalue = event.value;
        this.IsRelocate;
        if (this.selectedrelocatevalue == "true") {
            this.IsRelocate = true;
        }
        else {
            this.IsRelocate = false;
        }
    }

    getresumesbycandidateid(candidateid: any) {
        this.isVisible = false;
        var CandidateidpayLoad = {
            id: candidateid
        }
        this.candidateService.getResumesByCandidateId(CandidateidpayLoad).subscribe(res => {
            this.resumeList = [];
            this.resumeList = res.$values;
            this.IsPdf = false;
            this.IsDoc = false;
            this.resumeselectedFiles = [];
            if (this.resumeList.length > 0) {
                this.selectCurrentResume = this.resumeList[0].resumeName;
                let extension = this.resumeList[0].resumeName.split('.')[1];
                if (extension == "pdf") {
                    this.IsPdf = true;
                    this.filepath = this.sanitizer.bypassSecurityTrustResourceUrl(this.resumeList[0].resumePath);
                }
                else {
                    this.IsDoc = true;
                    this.docpath = this.sanitizer.bypassSecurityTrustResourceUrl("https://docs.google.com/gview?url=" + this.resumeList[0].resumePath + "&embedded=true");
                }
                this.isVisible = true;
            }
        });
    }

    ResumeClick(element: any) {
        this.isVisible = false;
        this.filepath = '';
        this.docpath = '';
        this.IsDoc = false;
        this.IsPdf = false;
        this.selectCurrentResume = element.ResumeName;
        let extension = element.ResumeName.split('.')[1];
        if (extension == "pdf") {
            this.IsPdf = true;
            this.filepath = this.sanitizer.bypassSecurityTrustResourceUrl(element.ResumePath);
        }
        else {
            this.IsDoc = true;
            this.docpath = this.sanitizer.bypassSecurityTrustResourceUrl("https://docs.google.com/gview?url=" + element.ResumePath + "&embedded=true");
            console.log(this.docpath);
        }
        this.isVisible = true;
    }

    deleteblobresumefile(resumeid, selectresumename) {
        //this._fuseProgressBarService.show();
        var payLoad = {
            resumeId: resumeid,
            resumePath: selectresumename.ResumePath,
        }
        Swal.fire({
            title: 'Are you sure, you want to delete "' + selectresumename.ResumeName + '"  resume?',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                this.isVisible = false;
                this.candidateService.deleteblobResumes(payLoad).subscribe(res => {
                    Swal.fire(
                        'Resume deleted successfully.',
                        '',
                        'success'
                    );
                    this.getresumesbycandidateid(this.candidateID);
                    this.isVisible = true;
                });
            }
            else {
                this.ngOnInit();
            }
        });
    }

    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        this.selectedDob = '';
        this.selectedDob = event.value;

    }



    getRecruiters() {

        //this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/getlistOfRecruiters').subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/jobService/getlistOfRecruiters').subscribe(data => {

            this.recruitersList = data;
        });
    }

    getInterviewMode() {

        // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/interviewService/getInterviewMode').subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/interviewService/getInterviewMode').subscribe(data => {

            this.InterviewMode = data.Table;

        });
    }

    CreateCandidateAwardsAndCertificateItem(i: any): FormGroup {

        return this._formBuilder.group({
            itemId: [i.CandidateId],
            AwardsAndCertificate: [i.AwardsAndCertificate],
            // AwardYear : moment(i.AwardYear).format('YYYY-MM-DD'),
            AwardYear: [i.AwardYear],
            AwardsAndCertificateDetails: [i.AwardsAndCertificateDetails]
        });
    }

    CreateCandidatEducationInfoItem(i: any): FormGroup {

        return this._formBuilder.group({
            CandidateId: [i.CandidateId],
            itemId: [i.CandidateId],
            Item_Qualification: [i.Qualification],
            item_College_University: [i.College_University],
            item_From_Year: [i.From_Year],
            item_To_Year: [i.To_Year],

            //  item_From_Year: moment(i.From_Year).format('YYYY-MM-DD'),
            //  item_To_Year:moment(i.To_Year).format('YYYY-MM-DD'),
            item_Score: [i.Score]
        });
    }

    CreateCandidatExperianceItem(i: any): FormGroup {

        return this._formBuilder.group({
            CandidateId: [i.CandidateId],
            ExperianceId: [i.CandidateId],
            CompanyName: [i.CompanyName],
            Joinned: [i.Joinned],
            Relived: [i.Relived],
            // Joinned : moment(i.Joinned).format('YYYY-MM-DD'),
            // Relived: moment(i.Relived).format('YYYY-MM-DD'),
            Place: [i.Place],
            Designation: [i.Designation]
        });
    }


    GetCandidatExperiance_EducationInfo() {
        this.http.get<any>(this.apiUrl + '/api/candidateService/GetCandidatExperianceEducationInfo?CandidateId=' + this.editCandidateID).subscribe
            (data => {
                // debugger;
                this.CandidatExperiance = data.Table;
                this.CandidatEducationInfo = data.Table1;
                this.CandidateAwardsAndCertificate = data.Table2;



                if (this.CandidateAwardsAndCertificate.length > 0) {
                    let arr_CandidateAwardsAndCertificate = [];
                    for (let i = 0; i < this.CandidateAwardsAndCertificate.length; i++) {
                        arr_CandidateAwardsAndCertificate.push(this.CreateCandidateAwardsAndCertificateItem(this.CandidateAwardsAndCertificate[i]))
                    }

                    this.Awardsform = this._formBuilder.group
                        ({
                            items: this._formBuilder.array(arr_CandidateAwardsAndCertificate)
                        })
                }


                if (this.CandidatEducationInfo.length > 0) {
                    let arr_CandidatEducationInfo = [];
                    for (let i = 0; i < this.CandidatEducationInfo.length; i++) {
                        arr_CandidatEducationInfo.push(this.CreateCandidatEducationInfoItem(this.CandidatEducationInfo[i]))
                    }

                    this.Educationform = this._formBuilder.group
                        ({
                            items: this._formBuilder.array(arr_CandidatEducationInfo)
                        })
                }


                if (this.CandidatExperiance.length > 0) {
                    let arr_CandidatExperiance = [];
                    for (let i = 0; i < this.CandidatExperiance.length; i++) {
                        arr_CandidatExperiance.push(this.CreateCandidatExperianceItem(this.CandidatExperiance[i]))
                    }

                    this.Experianceform = this._formBuilder.group
                        ({
                            items: this._formBuilder.array(arr_CandidatExperiance)
                        })
                }
            }
            )

    }


    getinterviewers() {
        //debugger;
        // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/GetInterviewersList').subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/jobService/GetInterviewersList').subscribe(data => {
            // debugger;
            this.interviewers = data.Table;
        });
    }

    getCandidateSheduleInterviewInfo() {
        //debugger;
        // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/interviewService/getInterviewScheduleInfo?CandidateId='+this.editCandidateID+'&JobId='+ this.defaultAppliedJobAction).subscribe(data => {
        //  this.http.get<any>('http://localhost:50274//api/interviewService/getInterviewScheduleInfo?CandidateId='+this.editCandidateID+'&JobId='+ this.defaultAppliedJobAction+ '&InterviewerId='+ this.userID).subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/interviewService/getInterviewScheduleInfo?CandidateId=' + this.editCandidateID + '&JobId=' + this.defaultAppliedJobAction + '&InterviewerId=' + this.userID).subscribe(data => {
            this.getInterviewMode();
            this.candidateinterviewSchedule = data;
            //debugger;
            this.AllcandidateinterviewScheduled = this.candidateinterviewSchedule.Table;
            this.candidateinterview = false;
            this.candidateinterviewer = this.candidateinterviewSchedule.Table1;

            this.GetInterviewMode = this.candidateinterviewSchedule.Table2;

            this.ModifyInterviewMode = "";
            if (this.candidateinterviewSchedule.Table3.length != 0) {
                this.IsCandidateAssiged = true;
                var btnIntrvshld = document.getElementById('btnScheduleInterview');
                var btnScheduleInterviewReject = document.getElementById('btnScheduleInterviewReject');
                var btnScheduleInterview = document.getElementById('btnScheduleNextInterview');

                if (btnIntrvshld != null) {
                    btnIntrvshld.style.backgroundColor = "#039be5";
                }
                if (btnScheduleInterviewReject != null) {
                    btnScheduleInterviewReject.style.backgroundColor = "#039be5";
                }
                if (btnScheduleInterview != null) {
                    btnScheduleInterview.style.backgroundColor = "#039be5";
                }
                this.ApplicationStatusIsAdvance = this.candidateinterviewSchedule.Table3[0].Status;
            }

            if (this.AllcandidateinterviewScheduled.length != 0) {
                this.candidateinterview = true;
                this.IsCandidateAssiged = true;
                this.ApplicationStatusIsAdvance = this.AllcandidateinterviewScheduled[0].ApplicationStatus;
            }

        });
        this.GetCandidateAssigningToInfo();

    }

    gethrUsers() {
        this.candidateService.getAllUsers().subscribe(data => {
            this.users = data.$values;
            //this.hrRoleUsers = data.filter(user => user.Role == 'HR Manager' || user.Role == 'Hiring Manager');
            this.hiringmanagers = data.$values.filter(user => user.role == 'Hiring Manager');

            for (const rec of this.hiringmanagers) {
                this._RecruiterEmails.set(rec['name'].toString(), rec['email']);
                this._Recruiters.set(rec['id'].toString(), rec['role']);
            }
        });
    }
    
    getcandidateskills() {
        //debugger;
        this.candidateService.getcandidateskills().subscribe(data => {
            //debugger;  
            this.candidateskills = data.Table;
            // debugger;
        });
    }
    openInterviewCancelModal(interviewtype: any) {
        this.InterviewTypeCancelModel = '';
        this.InterviewTypeCancelModel = interviewtype;
        this.GetrejectInterviewbody();
        this.openRejectModal(this.InterviewCancelmodal);
    }

    openInterviewRejectModal(interviewtype: any) {
        this.InterviewTypeRejectlModel = '';
        this.InterviewTypeRejectlModel = interviewtype;
        this.GetrejectInterviewbody();
        this.openRejectModal(this.Rejectmodal);
    }

    GetrejectInterviewbody() {
        this.RejectInterviewMessageBody = "To: " + this.commonfieldName + "," + " <br/><br/> &nbsp;&nbsp;&nbsp;  " + "Subject:" +
            "Your Application to " + this.commonfieldCompany + "<br/><br/>" +
            "Hi " + this.commonfieldName + "," + "<br/><br/>" +
            "Thank you for taking the time to apply for the " + this.commonfieldDesignation + "role at" + this.commonfieldCompany + "." +
            "We appreciate your interest in joining the company! At this time, we will not be moving forward with your application." + "<br/>" +
            "We will hold on to your resume and will reach out again if anything changes on our end." + "<br/>" +
            "We wish you all the best in your job search and future professional endeavors." + "<br/><br/>" +
            "Beat," + "<br/>" +
            this.userName
    }

    updateSetting(event) {
        this.gridratesize = event.value;
    }

    selectedrecruiters(event) {
        this.selectedRecruiters = event.value;
    }

    assessmentcallddl(event) {
        //this.selectedRecruiters = event.value;
    }
    assessmentroleddl(event) {
        //this.selectedRecruiters = event.value;
    }
    assignmentcallddl(event) {
        //this.selectedRecruiters = event.value;
    }
    assignmentroleddl(event) {
        //this.selectedRecruiters = event.value;
    }
    evaluationcallddl(event) {
        //this.selectedRecruiters = event.value;
    }
    evaluationroleddl(event) {
        //this.selectedRecruiters = event.value;
    }


    selectedhr(event) {
        this.selectedUserRoles = [];
        this.selectedHrs = event.value;
        this.selectedUserEmail = [];
        this.selectedHrs.forEach(element => {
            let email = this.hrRoleUsers.find(a => a.Name == element).Email;
            if (email != undefined) {
                this.selectedUserEmail.push(email);
            }
            let userRole = this.getRecruiterRole(element);
            if (this.selectedUserRoles.indexOf(userRole) != -1) {
            }
            else {
                this.selectedUserRoles.push(userRole);
            }
        });
    }

    selectedinterviewers(event) {
        this.selectedInterviewers = event.value;
    }

    topFunction() {
        var myDiv = document.getElementById('mat-dialog-1');
        myDiv.scrollTop = 0;
    }

    saveuploadBlobProfileImage() {
        this.isVisible = false;
        //this._fuseProgressBarService.show();
        let formData = new FormData();
        let extension = this.UploadCandidateProfileImage[0].name.split('.')[1];
        if (extension == "jpeg" || extension == "jpg" || extension == "png" || extension == "gif") {
            formData.append('FileUpload', this.UploadCandidateProfileImage[0]);
            if (this.candidateID == 0) {
                this.candidateService.SaveBlobProfileImage(formData).subscribe(result => {
                    this.candidateprofileimageURL = '';
                    this.UploadCandidateProfileImage = [];
                    this.candidateprofileimageURL = result;
                    this.isVisible = true;
                    //this._fuseProgressBarService.hide();
                    this._snackBar.open('Profile Image Uploaded successfully', null, {
                        duration: 3000
                    });
                });
            }
            else {
                formData.append('cid', this.candidateID.toString());
                this.candidateService.EditCandidateProfileImageUpdation(formData).subscribe(result => {
                    this.candidateprofileimageURL = '';
                    this.UploadCandidateProfileImage = [];
                    this.candidateprofileimageURL = result;
                    this.isVisible = true;
                    //this._fuseProgressBarService.hide();
                    this._snackBar.open('Profile Image Uploaded successfully', null, {
                        duration: 3000
                    });
                });
            }
        }
        else {
            this._snackBar.open('Please Upload Resume with jpeg, jpg, png, gif Formats.', null, {
                duration: 1000
            });
        }
    }



 

    formatString(val) {
        return val.toString();
    }

    selectedjobs(event) {
        this.selectedAssignJobs = event.value;
    }

    changeApplicationStatus(selectvalue: any) {
        if (this.defaultAppliedJobAction != 0) {
            this.ApplicationStatus = selectvalue;
            var btnIntrvshld = document.getElementById('btnScheduleInterview');
            var btnScheduleInterviewReject = document.getElementById('btnScheduleInterviewReject');
            var btnScheduleInterview = document.getElementById('btnScheduleNextInterview');

            if (selectvalue == 'Advance') {
                this.selectedUserEmail = [];
                this.selectedHrs.forEach(element => {
                    let email = this.hrRoleUsers.find(a => a.Id == element).Email;
                    if (email != undefined) {
                        this.selectedUserEmail.push(email);
                    }
                });

                if (btnIntrvshld != null) {
                    btnIntrvshld.style.backgroundColor = "#039be5";
                }
                if (btnScheduleInterviewReject != null) {
                    btnScheduleInterviewReject.style.backgroundColor = "#039be5";
                }
                if (btnScheduleInterview != null) {
                    btnScheduleInterview.style.backgroundColor = "#039be5";
                }
                //this.openInterviewModal(this.HrUsersDialog);
                this.openInterviewModal(this.TechnicalInterviewerUsersDialog);
            }
            else if (selectvalue == 'In Complete') {
                this.openRejectModal(this.Rejectmodal);
            }
            else {
                if (btnIntrvshld != null) {
                    btnIntrvshld.style.backgroundColor = "grey";
                }
                if (btnScheduleInterviewReject != null) {
                    btnScheduleInterviewReject.style.backgroundColor = "grey";
                }
                if (btnScheduleInterview != null) {
                    btnScheduleInterview.style.backgroundColor = "grey";
                }

            }
        }
        else {
            Swal.fire(
                ' This Candidate is not having any Job. Please Assign a Job.',
                '',
                'success'
            );
        }

    }

    changestage(selectvalue: any) {

        this.IsAdvance = false;
        if (selectvalue == 'Advance') {
            this.IsAdvance = true;
            //this.openModal(this.HrUsersDialog);
            this.openInterviewModal(this.HrUsersDialog);
        }
        if (selectvalue == 'Reject') {
            this.openRejectModal(this.Rejectmodal);
        }
        if (selectvalue == 'Assignment Canidate') {
            this.openRejectModal(this.AssignmentCanidate);
        }
        if (selectvalue == 'Assignment Interviewer') {
            this.openAssignmentInterviewerModal(this.AssignmentInterviewer);
        }
    }
    InterviewTimeFrom(selectvalue: any) {
        this.InterviewTimeFromSelected = selectvalue;
    }
    InterviewTimeTypeEvent(selectvalue: any) {
        this.InterviewTimeType = selectvalue;
    }

    InterviewTimeTo(selectvalue: any) {


        this.InterviewTimeToSelected = selectvalue;
    }


    interviewselectcall(selectvalue: any) {


        this.InterviewModeSelected = selectvalue;
    }

    ChangeInterviewType(selectvalue: any) {


        this.ModifyInterviewType = selectvalue;
    }

    TechnicalInterviewDate(selectvalue: any) {
        this.SelectTechnicalInterviewDate = selectvalue;
    }


    // addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    //   this.events.push(`${type}: ${event.value}`);
    // }


    UpdateInterview() {

        // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/interviewService/UpdateInterview', {
        this.http.post<any>(this.apiUrl + '/api/interviewService/UpdateInterview', {
            CandidateId: this.candidateID,
            JobId: this.defaultAppliedJobAction,
            InterviewType: this.ModifyInterviewType,
            CreatedBy: this.userID,
            InterviewMode: this.ModifyInterviewMode,
            InterviewDate: this.SelectTechnicalInterviewDate,
            To: this.InterviewTimeToSelected,
            From: this.InterviewTimeFromSelected,
            TimeType: this.InterviewTimeType,
            Interviewer: this.ModifyInterviewers,
            SendEmailToInterviewer: true,
            SendEmailToCandidate: true,
            Status: true,
            Id: this.ModifyInterviewId

        }).subscribe(data => {
            this.selectedRowsCnt = 0;

            //this._fuseProgressBarService.hide();
            Swal.fire(
                ' Saved successfully!',
                '',
                'success'
            );
            this.getCandidateSheduleInterviewInfo();

        });

        //this._fuseProgressBarService.hide();  
        this.matdialog.closeAll();
    }

    RejectInterview() {
        //debugger;
        let cid = this.candidateID;
        let jobid = this.defaultAppliedJobAction;
        let interviewtype = this.InterviewTypeRejectlModel; //this.ModifyInterviewType;
        let status = 'Rejected';
        this.EvaluationserviceService.rejectinterviewcandidate(jobid, cid, interviewtype, status).subscribe(data => {
            Swal.fire(
                'Interview Rejected',
                '',
                'success'
            );
            this.getCandidateSheduleInterviewInfo();
            this.matdialog.closeAll();
        });

    }
    CancelInterview() {

        /// this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/interviewService/CancelInterview', {
        this.http.post<any>(this.apiUrl + '/api/interviewService/CancelInterview', {
            CandidateId: this.candidateID,
            JobId: this.defaultAppliedJobAction,
            InterviewType: this.ModifyInterviewType,
            CreatedBy: this.userID,
            InterviewMode: this.ModifyInterviewMode,
            InterviewDate: this.SelectTechnicalInterviewDate,
            To: this.InterviewTimeToSelected,
            From: this.InterviewTimeFromSelected,
            TimeType: this.InterviewTimeType,
            Interviewer: this.ModifyInterviewers,
            SendEmailToInterviewer: true,
            SendEmailToCandidate: true,
            Status: true,
            Id: this.ModifyInterviewId

        }).subscribe(data => {
            this.selectedRowsCnt = 0;

            //this._fuseProgressBarService.hide();
            Swal.fire(
                ' Saved successfully!',
                '',
                'success'
            );
            this.getCandidateSheduleInterviewInfo();

        });

        //this._fuseProgressBarService.hide();  
        this.matdialog.closeAll();
    }

    SubmitInterview() {
        //debugger;
        var dateTime = null;
        if (this.InterviewTimeType == 'PM') {
            dateTime = new Date(new Date(this.changedDate).getFullYear(), new Date(this.changedDate).getMonth(), new Date(this.changedDate).getDate(), parseInt(this.InterviewTimeFromSelected.split(':')[0]) + 12, this.InterviewTimeFromSelected.split(':')[1], 0);
        }
        else {
            dateTime = new Date(new Date(this.changedDate).getFullYear(), new Date(this.changedDate).getMonth(), new Date(this.changedDate).getDate(), this.InterviewTimeFromSelected.split(':')[0], this.InterviewTimeFromSelected.split(':')[1], 0);
        }
        if (dateTime < new Date()) {
            alert('Please select valid date and time');
            // Swal.fire({
            //   icon: 'error',
            //   title: 'Error',
            //   text: 'Please select valid time!',
            // })
            return;
        }
        this.AllcandidateinterviewScheduled.forEach(element => {
            this.ConInterviewType = this.AllcandidateinterviewScheduled.find(element => element.InterviewType == this.ModifyInterviewType);
        });
        if (this.ConInterviewType != undefined) {
            const result = confirm('Already ' + this.ModifyInterviewType + ' Interview Schedule for this candidate. Do You want to update the details.?');
            if (result) {
                this.SaveScheduleInterview();
            }
            else {
                //alert('No update');
            }
        }
        else {
            this.SaveScheduleInterview();
        }

        //this._fuseProgressBarService.hide();  
        this.matdialog.closeAll();
    }

    SaveScheduleInterview() {
        //debugger;
        if (this.ModifyInterviewType != "Select") {
            // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/interviewService/SaveScheduleInterview', {
            this.http.post<any>(this.apiUrl + '/api/interviewService/SaveScheduleInterview', {
                // this.http.post<any>('http://localhost:50274/api/interviewService/SaveScheduleInterview', {
                CandidateId: this.candidateID,
                JobId: this.defaultAppliedJobAction,
                InterviewType: this.ModifyInterviewType,
                CreatedBy: this.userID,
                InterviewMode: this.ModifyInterviewMode,
                InterviewDate: this.SelectTechnicalInterviewDate,
                To: this.InterviewTimeToSelected,
                From: this.InterviewTimeFromSelected,
                TimeType: this.InterviewTimeType,
                Interviewer: this.ModifyInterviewers,
                SendEmailToInterviewer: true,
                SendEmailToCandidate: true,
                Status: true

            }).subscribe(data => {
                //debugger;
                this.selectedRowsCnt = 0;

                //this._fuseProgressBarService.hide();
                Swal.fire(
                    'Schedule Interview Saved successfully!',
                    '',
                    'success'
                );
                //debugger;
                this.getCandidateSheduleInterviewInfo();
                this.ModifyInterviewType = "Select";
                this.ModifyInterviewMode = "";
                this.SelectTechnicalInterviewDate = "";
                this.InterviewTimeToSelected = "";
                this.ModifyInterviewFrom = "";
                this.ModifyInterviewTimeType = "";
                this.ModifyInterviewers = "";

            });
        }
        else {
            Swal.fire(
                'Please Select Interview Type!',
                '',
                'success'
            );
        }

    }

    inputEvent(event) {
        // this.SelectTechnicalInterviewDate = this.DatePipe.transform(event.value,'dd/MM/yyyy');
    }
    changeEvent(event) {
        // debugger;
        this.changedDate = event.value;
        this.SelectTechnicalInterviewDate.fromDate = event.value;
    }

    changeinterviewstage(selectvalue: any) {
        this.IsInterviewAdvance = false;
        this.Isinterviewchange = true;
        if (selectvalue == 'Advance') {
            this.IsInterviewAdvance = true;
        }
        if (selectvalue == 'Select') {
            this.Isinterviewchange = false;
        }
    }

    openModal(templateRef: TemplateRef<any>) {
        this.selectedAssignJobs = [];
        const dialogRef = this.matdialog.open(templateRef, {
            width: '500px',
            height: '300px',
            autoFocus: false,
        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }

    openInterviewModal(templateRef: TemplateRef<any>) {
        const dialogRef = this.matdialog.open(templateRef, {
            width: '900px',
            height: '600px',
            autoFocus: false,
        });


        this.InterviewMessageBody = "Dear " + this.hrRoleUsers[0].Name + "," + " <br></br> &nbsp;&nbsp;&nbsp;  " + "Mr."
            + this.commonfieldName + "profile is selected for 'Advance' and please carry forward hiring process."
            + " <br>&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; " + "Link :" + "<a href='" + "https://atswebapi.azurewebsites.net/apps/candidate/edit-candidate/" + this.editCandidateID + "'>" +
            "https://atswebapi.azurewebsites.net/apps/candidate/edit-candidate/" + this.editCandidateID + "</a>" + "<br>" + "<br>" +
            + "Regards" + "," + "<br>" + this.hiringmanagers[0].Name;
    }

    ModifyInterviewModal(templateRef: TemplateRef<any>, InterviewId: any, JobId: any, CandidateId: any) {

        const dialogRef = this.matdialog.open(templateRef, {
            width: '900px',
            height: '600px',
            //autoFocus: true,
        });
        //  this.InterviewMessageBody = "Dear " + this.userEmail +"," + " <br></br> &nbsp;&nbsp;&nbsp;  " + "Mr."
        //                              + this.commonfieldName + "profile is selected for 'Advance' and please carry forward hiring process."
        //                              +" <br>&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; " + "Link :" +"<a href='"+"https://atswebapi.azurewebsites.net/apps/candidate/edit-candidate/"+ this.editCandidateID+"'>"+
        //                              "https://atswebapi.azurewebsites.net/apps/candidate/edit-candidate/"+ this.editCandidateID +"</a>" +"<br>" + "<br>" +
        //                              + "Regards" + "," + "<br>" + this.hiringmanagers[0].Name;
        this.GetModifyCandidateSheduleInterviewInfo(InterviewId, JobId, CandidateId);
    }

    DeleteInterviewModal(templateRef: TemplateRef<any>, InterviewId: any, JobId: any, CandidateId: any) {

        const dialogRef = this.matdialog.open(templateRef, {
            width: '900px',
            height: '600px',
            //autoFocus: true,
        });
        this.DeleteCandidateSheduleInterviewInfo(InterviewId, JobId, CandidateId);

    }

    GethrRoleUsers() {
        //debugger;
        // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/GethrRoleUsers').subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/candidateService/GethrRoleUsers').subscribe(data => {
            // debugger;
            this.hrRoleUsers = data.Table;
        });
    }

    GetCandidateAssigningToInfo() {
        //debugger;
        // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/GetCandidateAssigningToInfo?CandidateId='+this.candidateID+'&JobId='+ this.defaultAppliedJobAction ).subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/candidateService/GetCandidateAssigningToInfo?CandidateId=' + this.candidateID + '&JobId=' + this.defaultAppliedJobAction).subscribe(data => {
            // debugger;
            if (data.$values.length > 0) {
                this.GetCandidateAssigningTo = data.$values;
                this.Selecthruser = this.GetCandidateAssigningTo.map(t => t.AssigningTo);
                this.selectedHrs = this.Selecthruser;
                this.ApplicationStatusIsAdvance = this.GetCandidateAssigningTo[0].ApplicationStatus;
            }
        });

    }

    GetModifyCandidateSheduleInterviewInfo(_InterviewId: any, _JobId: any, _CandidateId: any) {
        //this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/interviewService/getScheduledInterview?CandidateId='+_CandidateId+'&JobId='+ _JobId +'&InterviewId=' + _InterviewId).subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/interviewService/getScheduledInterview?CandidateId=' + _CandidateId + '&JobId=' + _JobId + '&InterviewId=' + _InterviewId).subscribe(data => {
            this.candidateinterviewSchedule = data;
            this.getInterviewMode();

            this.candidateinterviewScheduled = this.candidateinterviewSchedule.Table;

            this.ModifyInterviewDate = this.candidateinterviewScheduled[0].InterviewDate;
            this.ModifyInterviewFrom = this.candidateinterviewScheduled[0].From;
            this.ModifyInterviewTimeType = this.candidateinterviewScheduled[0].TimeType;
            this.ModifyInterviewId = '';
            this.ModifyInterviewId = _InterviewId;

            this.ModifyInterviewType = this.candidateinterviewScheduled[0].InterviewType;
            this.ModifyScore = 0;

            var InterviewMode = this.candidateinterviewSchedule.Table2;

            this.ModifyInterviewMode = InterviewMode.map(t => t.Mode);

            var ModifyInterviewer = this.candidateinterviewSchedule.Table1;

            this.ModifyInterviewers = ModifyInterviewer.map(t => t.Interviewer);


            if (this.candidateinterviewScheduled.JobId != '') {

                this.candidateinterview = true;
                this.candidateinterviewer = this.candidateinterviewSchedule.Table1;

            }

        });
    }


    DeleteCandidateSheduleInterviewInfo(_InterviewId: any, _JobId: any, _CandidateId: any) {
        // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/interviewService/CancelInterview?CandidateId='+_CandidateId+'&JobId='+ _JobId +'&InterviewId=' + _InterviewId).subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/interviewService/CancelInterview?CandidateId=' + _CandidateId + '&JobId=' + _JobId + '&InterviewId=' + _InterviewId).subscribe(data => {
            this.candidateinterviewSchedule = data;
            this.getInterviewMode();

            this.candidateinterviewScheduled = this.candidateinterviewSchedule.Table;

            this.ModifyInterviewDate = this.candidateinterviewScheduled[0].InterviewDate;
            this.ModifyInterviewFrom = this.candidateinterviewScheduled[0].From;
            this.ModifyInterviewTimeType = this.candidateinterviewScheduled[0].TimeType;
            this.ModifyInterviewId = '';
            this.ModifyInterviewId = _InterviewId;

            this.ModifyInterviewType = this.candidateinterviewScheduled[0].InterviewType;
            this.ModifyScore = 0;

            var InterviewMode = this.candidateinterviewSchedule.Table2;

            this.ModifyInterviewMode = InterviewMode.map(t => t.Mode);

            var ModifyInterviewer = this.candidateinterviewSchedule.Table1;

            this.ModifyInterviewers = ModifyInterviewer.map(t => t.Interviewer);


            if (this.candidateinterviewScheduled.JobId != '') {

                this.candidateinterview = true;
                this.candidateinterviewer = this.candidateinterviewSchedule.Table1;

            }

        });
    }

    openRejectModal(templateRef: TemplateRef<any>) {
        const dialogRef = this.matdialog.open(templateRef, {
            width: '600px',
            height: '500px',
            autoFocus: false,
        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }


    openAssignmentInterviewerModal(templateRef: TemplateRef<any>) {
        const dialogRef = this.matdialog.open(templateRef, {
            width: '1000px',
            height: '600px',
            autoFocus: false,
        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }

    getInnerHTML(val) {
        if (val != null)
            return val.replace(/(<([^>]+)>)/ig, '');
    }

    submitForm1() {
        //debugger;
        this.isVisible = false;
        this.firstFormGroupSubmitted = true;
        if (this.firstFormGroup.valid) {
            let selectedskills = '';
            for (let i = 0; i < this.Tags.length; i++) {
                let tagvalue = this.Tags[i];
                if (i == 0)
                    selectedskills = selectedskills + tagvalue;
                else
                    selectedskills = selectedskills + ',' + tagvalue;
            }

            let cname = this.firstFormGroup.get('candidateName').value;
            let ccompany = this.firstFormGroup.get('currentEmployer').value;
            let clocation = this.firstFormGroup.get('candidate_location').value;
            let cdesignation = this.firstFormGroup.get('designation').value;
            let csalary = this.firstFormGroup.get('desiredsalary').value;
            let cskills = this.firstFormGroup.get('preselectedSkills').value.toString();
            let cdob = this.firstFormGroup.get('dob').value;
            let cemail = this.firstFormGroup.get('email').value;
            let cexp = this.firstFormGroup.get('experience').value;
            let cmobileno = this.firstFormGroup.get('mobileno').value;
            let coverview = this.firstFormGroup.get('overview').value;
            let crelocate = this.firstFormGroup.get('relocate').value;
            let checkprofileurl = this.candidateprofileimageURL;
            let cfacebookurl = this.firstFormGroup.get('facebook').value;
            let clinkedinurl = this.firstFormGroup.get('linkedin').value;
            let ctwitterurl = this.firstFormGroup.get('twitter').value;
            let cgithuburl = this.firstFormGroup.get('github').value;
            let cstackoverflowurl = this.firstFormGroup.get('stackoverflow').value;
            if (cname != this.editCandidateGetData.Name ||
                clocation != this.editCandidateGetData.Location ||
                ccompany != this.editCandidateGetData.CurrentEmployer ||
                cdesignation != this.editCandidateGetData.Designation ||
                csalary != this.editCandidateGetData.Salary ||
                cdob != this.editCandidateGetData.DateOfBirth ||
                cskills != this.candidateData[0].Skills ||
                cemail != this.editCandidateGetData.Email ||
                cexp != this.editCandidateGetData.Experience ||
                cmobileno != this.editCandidateGetData.MobileNumber ||
                coverview != this.editCandidateGetData.Overview ||
                crelocate != this.editCandidateGetData.Relocate ||
                selectedskills != this.editCandidateGetData.Skills ||
                checkprofileurl != this.editCandidateGetData.ProfileImage ||
                cfacebookurl != this.editCandidateGetData.Facebook ||
                clinkedinurl != this.editCandidateGetData.LinkedIn ||
                ctwitterurl != this.editCandidateGetData.Twitter ||
                cgithuburl != this.editCandidateGetData.GitHub ||
                cstackoverflowurl != this.editCandidateGetData.StackOverflow
                || this.Educationform.value.items.length > 0
                || this.Experianceform.value.items.length > 0
                || this.Awardsform.value.items.length > 0) {
                this.IsEditAnyField = true;
            }
            if (this.IsEditAnyField) {
                this.isVisible = false;

                if (this.Educationform.value.items.length > 0) {
                    let saveaCandidateInfo = [];

                    for (let i = 0; i < this.Educationform.value.items.length; i++) {


                        let CandidateId = this.candidateID;
                        let itemId = this.Educationform.value.items[i].itemId;
                        let item_College_University = this.Educationform.value.items[i].item_College_University;
                        let Item_Qualification = this.Educationform.value.items[i].Item_Qualification;
                        let item_From_Year = this.Educationform.value.items[i].item_From_Year;
                        let item_To_Year = this.Educationform.value.items[i].item_To_Year;
                        let item_Score = this.Educationform.value.items[i].item_Score;
                        let input = CandidateId + ',' + item_College_University + ',' + Item_Qualification + ',' + item_To_Year + ',' + item_From_Year + ',' + item_Score;
                        saveaCandidateInfo.push(input.toString());
                    }

                    //this.http.post('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/createCandidatEducationInfo', saveaCandidateInfo, {
                    this.http.post(this.apiUrl + '/api/candidateService/createCandidatEducationInfo', saveaCandidateInfo, {
                    }).subscribe(data => {
                    });
                }

                if (this.Experianceform.value.items.length > 0) {
                    let saveaCandidateExperianceformInfo = [];

                    for (let i = 0; i < this.Experianceform.value.items.length; i++) {


                        let CandidateId = this.candidateID;
                        let CompanyName = this.Experianceform.value.items[i].CompanyName;
                        let Place = this.Experianceform.value.items[i].Place;
                        let Designation = this.Experianceform.value.items[i].Designation;
                        let Joinned = this.Experianceform.value.items[i].Joinned;
                        let Relived = this.Experianceform.value.items[i].Relived;


                        let input = CandidateId + ',' + CompanyName + ',' + Joinned + ',' + Relived + ',' + Place + ',' + Designation;
                        saveaCandidateExperianceformInfo.push(input.toString());
                    }
                    // this.http.post("https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/createCandidatExperianceInfo", saveaCandidateExperianceformInfo, {
                    this.http.post(this.apiUrl + "/api/candidateService/createCandidatExperianceInfo", saveaCandidateExperianceformInfo, {
                    }).subscribe(data => {
                    });
                }


                if (this.Awardsform.value.items.length > 0) {
                    let saveaCandidateAwardsformInfo = [];

                    for (let i = 0; i < this.Awardsform.value.items.length; i++) {


                        let CandidateId = this.candidateID;
                        let AwardsAndCertificate = this.Awardsform.value.items[i].AwardsAndCertificate;
                        let SelectAwardYearEvent = this.Awardsform.value.items[i].AwardYear;
                        let AwardsAndCertificateDetails = this.Awardsform.value.items[i].AwardsAndCertificateDetails;


                        let input = CandidateId + ',' + AwardsAndCertificate + ',' + SelectAwardYearEvent + ',' + AwardsAndCertificateDetails;
                        saveaCandidateAwardsformInfo.push(input.toString());
                    }

                    // this.http.post("https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/createCandidatAwardsAndCertificateInfo", saveaCandidateAwardsformInfo, {
                    this.http.post(this.apiUrl + "/api/candidateService/createCandidatAwardsAndCertificateInfo", saveaCandidateAwardsformInfo, {
                    }).subscribe(data => {
                    });
                }


                // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/updatecandidate', {
                this.http.post<any>(this.apiUrl + '/api/candidateService/updatecandidate', {
                    Id: this.candidateID,
                    Name: this.firstFormGroup.get('candidateName').value,
                    Designation: this.firstFormGroup.get('designation').value,
                    CurrentEmployer: this.firstFormGroup.get('currentEmployer').value,
                    Email: this.firstFormGroup.get('email').value,
                    Experience: this.selectedExperience,
                    Overview: this.firstFormGroup.get('overview').value,
                    Location: this.firstFormGroup.get('candidate_location').value,
                    Relocate: this.IsRelocate,
                    DateOfBirth: this.selectedDob,
                    MobileNumber: this.firstFormGroup.get('mobileno').value,
                    Salary: this.firstFormGroup.get('desiredsalary').value,
                    Skills: cskills,
                    ProfileImage: this.candidateprofileimageURL,
                    UserId: this.userID,
                    Facebook: this.firstFormGroup.get('facebook').value,
                    LinkedIn: this.firstFormGroup.get('linkedin').value,
                    Twitter: this.firstFormGroup.get('twitter').value,
                    GitHub: this.firstFormGroup.get('github').value,
                    List_CanddateInfo: this.Educationform.value,
                    StackOverflow: this.firstFormGroup.get('stackoverflow').value
                }).subscribe(data => {
                    this.editCandidateGetData.ProfileImage = this.candidateprofileimageURL;
                    this.isVisible = true;
                    //this._fuseProgressBarService.hide();
                    this._snackBar.open('Candidate updated successfully', null, {
                        duration: 3000
                    });
                });

            }
            this.commonfieldName = this.firstFormGroup.get('candidateName').value;
            this.commonfieldDesignation = this.firstFormGroup.get('designation').value;
            this.commonfieldEmail = this.firstFormGroup.get('email').value;
            this.commonfieldMobile = this.firstFormGroup.get('mobileno').value;
            this.commonfieldLocation = this.firstFormGroup.get('candidate_location').value;
            this.isStep1Completed = true;
        }
        // debugger;
        this.matdialog.closeAll();
        if (this.userRole == 'Candidate' && this.loggedInfo.currentCandidateResume == '') {
            let elementbtnUploadCandidateResume: HTMLElement = document.getElementById('btnUploadCandidateResume') as HTMLElement;
            elementbtnUploadCandidateResume.click();
        }
        this.ngOnInit();
        this.GetCandidatExperiance_EducationInfo();
    }

    submitForm2() {
        //debugger;
        this.isVisible = false;
        this.isStep2Completed = true;
        //debugger;

        //this._fuseProgressBarService.show();
        this.candidateService.getCandidateActivitiesbyId(this.editCandidateID, this.AcId, 0).subscribe(data => {
            this.candidateActivitiesList = data.$values;
            var groups = new Set(this.candidateActivitiesList.map(item => item.createdBy)),
                results = [];
            groups.forEach(g =>
                results.push({
                    name: g,
                    values: this.candidateActivitiesList.filter(i => i.createdBy === g)
                }
                ))
            this.ActivitiesGroupdata = results;
            this.isVisible = true;
            //this._fuseProgressBarService.hide();
        });
    }

    submitForm3() {
        this.isStep3Completed = true;
    }
    submitForm4() {
        this.isStep4Completed = true;
    }
    submitForm5() {
        this.isStep5Completed = true;
    }
    submitForm6() {
        this.isStep6Completed = true;
    }
    submitForm7() {
        this.isStep7Completed = true;
    }

    selectionChange(event: StepperSelectionEvent) {
        let index = event.selectedIndex;

        if (this.IsEdit || (!this.IsEdit && this.firstFormGroup.valid)) {
            if (index == 0)
                this.submitForm1();
            else if (index == 1)
                this.submitForm2();
            else if (index == 2)
                this.submitForm3();
            else if (index == 3)
                this.submitForm4();
            else if (index == 4)
                this.submitForm5();
            else if (index == 5)
                this.submitForm6();
            else if (index == 6)
                this.submitForm7();
        }
        else {
            this.isStep1Completed = false;
            this.isStep2Completed = false;
            this.isStep3Completed = false;
            this.isStep4Completed = false;
            this.isStep5Completed = false;
            this.isStep6Completed = false;
            this.isStep7Completed = false;
        }
    }

    DownloadResume(resume: any) {
        //this._fuseProgressBarService.show();
        let path = resume.ResumePath;
        let resumename = path.split('resume/')[1];
        this.resumeEncoded = path;
        this.resumeName = resumename;
        //let saveAs = require('file-saver');
        //let file = this.resumeName;
        //saveAs(this.resumeEncoded, file);
        //this._fuseProgressBarService.hide();//
    }
    ViewDownloadResume(resumePath: any) {
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
    // redirectCandidate(id: any) {
    //   this.matdialog.closeAll();
    //   this.router.navigate(['/candidates/edit-candidate/',id]);
    // }
    print(resume: any) {
        let w = window;
        w.opener = null;
        let extension = resume.ResumeName.split('.')[1];
        if (extension == "pdf")
            w.open(resume.ResumePath);
        else
            w.open('https://docs.google.com/gview?url=' + resume.ResumePath, '_blank');
    }


    deleteCandidate() {
        //debugger;
        Swal.fire({
            title: 'Are you sure want to delete ' + this.commonfieldName + '?',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                //debugger;
                this.candidateService.deleteCandidate(this.editCandidateID).subscribe(data => {
                    //debugger;
                    this._snackBar.open(this.commonfieldName + ' deleted successfully', null, {
                        duration: 3000
                    });
                    this.router.navigate(['/candidatesI']);
                });
            }
        });
    }

    printDescription() {
        this.generatePdf();
    }

    generatePdf() {
        this.printCandidates = [];
        Swal.fire({
            title: 'Are you sure you want to print this Candidate information?',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                this.printCandidates.push(this.editCandidateGetData);
                this.printCandidatesPdf();
            }
        });
    }

    printCandidatesPdf() {

        const pdfCandidates = this.pdfCandidates.nativeElement;
        setTimeout(function () {
            const documentDefinition = {
                content: htmlToPdfmake(pdfCandidates.innerHTML),
                footer: function (currentPage, pageCount) {
                    return {
                        table: {
                            body: [
                                [
                                    {
                                        text: 'Page ' + currentPage.toString() + ' of ' + pageCount,
                                        alignment: 'right',
                                        style: 'normalText',
                                        margin: [5, 20, 50, 0]
                                    }
                                ],
                            ]
                        },
                        layout: 'noBorders'
                    };
                },

            };
            pdfmake.createPdf(documentDefinition).print();
        }, 1000);
    }

    openNewFolderDialogModal(templateRef: TemplateRef<any>, _width, _height) {
        this.newFolderFormGroup.reset();
        this.selectedCandidateIds = [];
        this.selectedCandidateIds.push(this.editCandidateID);
        this.AllCandidates = [];
        this.candidateService.getCandidatelist().subscribe(data => {
            this.AllCandidates = data.candidates.$values.filter(x => x.Id  == this.editCandidateID);
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
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }

    openResumeDialogModal(templateRef: TemplateRef<any>, _width, _height, resume: any) {
        this.selectedCandidateIds = [];
        this.selectedCandidateIds.push(this.editCandidateID);
        this.selectedResume = resume.ResumePath;
        const dialogRef = this.matdialog.open(templateRef, {
            width: _width,
            height: _height,
            autoFocus: false,
        });

        dialogRef.afterClosed().subscribe(result => {
        });
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

    shareCandidateresume() {
        if (this.selectedRecruiters.length != 0) {
            var payLoad = {
                CandidateId: this.editCandidateID,
                ResumePath: this.selectedResume,
                RecruitersIds: this.selectedRecruiters,
                UserId: this.userID
            }
            this.candidateService.sharecandidateresume(payLoad).subscribe(data => {
                //this._fuseProgressBarService.hide();
                this.matdialog.closeAll();
                Swal.fire(
                    'Candidate resume shared successfully!',
                    '',
                    'success'
                );
            });
        }
    }

    ChangeCandidateStatus(status: boolean) {
        this.selectedCandidateIds = [];
        this.selectedCandidateIds.push(this.editCandidateID);
        let active = status == true ? 'activate' : 'archive';
        Swal.fire({
            title: 'Are you sure you want to ' + active + ' this Candidate?',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                //this._fuseProgressBarService.show();
                var payLoad = {
                    CandidateIds: this.selectedCandidateIds,
                    Active: status,
                    UserId: this.userID
                }
                this.candidateService.changecandidatestatus(payLoad).subscribe(data => {
                    //this._fuseProgressBarService.hide();
                    this.router.navigate(['/candidatesI']);
                    Swal.fire(
                        'Candidate ' + active + 'd successfully!',
                        '',
                        'success'
                    );
                });
            }
        });
    }
    chkResumeScore(event) {
        if (event.target.value > 100 || event.target.value < 0) {
            event.target.focus();
            Swal.fire(
                'Resume score must be between 0 to 100',
                '',
                'error'
            );
            event.target.value = '';
        }
        else {
            let score = Number(event.target.value);
            let cid = this.candidateID.toString();
            var payLoad = {
                Score: score,
                candidateId: cid
            }
            this.candidateService.saveResumeScore(payLoad).subscribe(res => {
            });
        }
    }

    removeProfileImage() {
        Swal.fire({
            title: 'Are you sure, you want to remove Profile Image',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                this.isVisible = false;
                this.candidateService.removeprofileimage(this.candidateID, this.candidateprofileimageURL).subscribe(res => {
                    Swal.fire(
                        'Profile Image removed Successfully',
                        '',
                        'success'
                    );
                    this.candidateprofileimageURL = '';
                });
            }
        });
    }
    PreviousNextCandidate(nextorpreviousid: any) {
        //this.router.navigate(['/candidates/edit-candidate', nextorpreviousid]).then(page => 
        // this.router.navigate(['/candidates/edit-candidate', nextorpreviousid]).then(page => 
        this.router.navigate(['/candidates/edit-candidate', nextorpreviousid]).then(page => {
            this.ngOnInit();
        });
    }

    redirecttoSocialNetwork(url: any) {
        if (url != null) {
            if (url.includes('https://') || url.includes('http://')) {
                window.open(url, '_blank');
            }
            else {
                let link = 'https://' + url;
                window.open(link, '_blank');
            }
        }
    }
    getRecruiterRole(id) {
        return this._Recruiters.get(id);
    }
    getRecruiterEmail(id) {
        return this._RecruiterEmails.get(id);
    }
    getopenJobs(CandidateID) {
        //debugger;
        this.candidateService.getopenjobslistbyCandidateId(CandidateID).subscribe(data => {
            this.openJobsList = data.Table;
        });
    }

    getcandidateappliedJobs() {
        let cid = this.editCandidateID;
        this.candidateService.getappliedjobslist(cid).subscribe(data => {
            if (data != null) {
                this.appliedJobsList = data.Table;
                if (this.appliedJobsList.length > 0) {
                    this.defaultAppliedJobAction = this.appliedJobsList[0].JobId;
                    this.selectedjobid = this.appliedJobsList[0].JobId;
                    this.curDate = this.appliedJobsList[0].CreatedDate;

                    this.getCandidateSheduleInterviewInfo();
                    this.GetCandidatesEvaluationInfo(this.selectedjobid, cid);
                }
            }
        });
    }

    navigatetoEvaluation() {
        localStorage.removeItem("_candidateprofilejobid");
        localStorage.removeItem("_candidateprofilecandidateid");
        localStorage.setItem("_candidateprofilejobid", this.selectedjobid);
        localStorage.setItem("_candidateprofilecandidateid", JSON.stringify(this.candidateID));
        this.router.navigate(['/evaluation']);
        //this.router.navigate(['/ManageEvaluation']);
    }

    selectedopenjobs(selectvalue: any) {
        this.ApplicationStatusIsAdvance = "Select";
        this.selectedOpenJobs = selectvalue;
        this.selectedjobid = selectvalue;
        this.getCandidateSheduleInterviewInfo();
        this.GetCandidateAssigningToInfo();
        let selectedjobiddate = '';

        var btnIntrvshld = document.getElementById('btnScheduleInterview');
        var btnScheduleInterviewReject = document.getElementById('btnScheduleInterviewReject');
        var btnScheduleInterview = document.getElementById('btnScheduleNextInterview');

        if (btnIntrvshld != null) {
            btnIntrvshld.style.backgroundColor = "grey";
        }
        if (btnScheduleInterviewReject != null) {
            btnScheduleInterviewReject.style.backgroundColor = "grey";
        }
        if (btnScheduleInterview != null) {
            btnScheduleInterview.style.backgroundColor = "grey";
        }

        this.appliedJobsList.forEach(function (item) {
            if (item.JobId === this.selectedjobid) {
                selectedjobiddate = item.CreatedDate;
            }
        });
        //this.appliedjobdate = selectedjobiddate;
    }
    resetAdvance() {
        this.IsAdvance = false;
    }


    CandidateAssigningTo() {
        var btnIntrvshld = document.getElementById('btnScheduleInterview');
        var btnScheduleInterviewReject = document.getElementById('btnScheduleInterviewReject');
        var btnScheduleInterview = document.getElementById('btnScheduleNextInterview');

        this.IsCandidateAssiged = false;
        for (let index = 0; index < this.Selecthruser.length; index++) {
            const element = this.Selecthruser[index];

            if (element == this.userName) {
                this.IsCandidateAssiged = true;

                if (btnIntrvshld != null) {
                    btnIntrvshld.style.backgroundColor = "#039be5";
                }
                if (btnScheduleInterviewReject != null) {
                    btnScheduleInterviewReject.style.backgroundColor = "#039be5";
                }
                if (btnScheduleInterview != null) {
                    btnScheduleInterview.style.backgroundColor = "#039be5";
                }

            }
        }
    }

    SubmitCandidateAssigningTo() {

        let countforselectedusers = 0;
        for (let index = 0; index < this.Selecthruser.length; index++) {
            const element = this.Selecthruser[index];

            if (element == this.userName) {
                countforselectedusers = 1;
            }
        }
        if (countforselectedusers == 0) {
            this.Selecthruser.push(this.userName);

        }

        // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/SaveCandidateAssigningTo', {
        this.http.post<any>(this.apiUrl + '/api/candidateService/SaveCandidateAssigningTo', {
            CandidateId: this.candidateID,
            JobId: this.defaultAppliedJobAction,
            AssigningTo: this.Selecthruser,
            ApplicationStatus: this.ApplicationStatus


        }).subscribe(data => {
            this.selectedRowsCnt = 0;
            //this._fuseProgressBarService.hide();
            this.CandidateAssigningTo();
            this.getCandidateSheduleInterviewInfo();

            Swal.fire(
                'Schedule Interview Saved successfully!',
                '',
                'success'
            );
        });

        //this._fuseProgressBarService.hide();  
        this.matdialog.closeAll();
        this.CandidateAssigningTo();
        this.getCandidateSheduleInterviewInfo();


    }


    chkfolderStatus(event: MatRadioChange) {
        if (event.value)
            this.isNewFolder = true;
        else
            this.isNewFolder = false;
    }
    getfoldersbyCandidateId() {
        this.isVisible = false;
        var payLoad = {
            candidateId: this.editCandidateID,
            UserId: this.userID
        }
        this.candidateService.getFoldersbyCandidateId(payLoad).subscribe(res => {
            //debugger;
            if (res.$values.length > 0) {
                this.candidateFolderList = [];
                this.curFolderId = res.$values[0].folderId;
                this.curFolder = res.$values[0].folderName;
                this.curFolderStatus = res.$values[0].status;
                this.candidateFolderList = res.$values;
                this.candidatefolderIds = [];
                this.candidateFolderList.forEach(element => {
                    this.candidatefolderIds.push(element.folderId);
                });
            }
            this.getfoldersbyuserid();
            this.isVisible = true;
        });
    }
    createNewFolder() {
        this.isVisible = false;
        if (this.isNewFolder) {
            let folderexists = this.folderList.find((x) => x.FolderName === this.newFolderFormGroup.get('newfolder').value);
            if (!folderexists) {
                //this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/CreateFolder', {
                this.http.post<any>(this.apiUrl + '/api/candidateService/CreateFolder', {
                    FolderName: this.newFolderFormGroup.get('newfolder').value,
                    UserId: this.userID,
                    CandidateIds: this.selectedCandidateIds,
                    Status: 1
                }).subscribe(data => {
                    this.getfoldersbyCandidateId();
                    this.isVisible = true;
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
        this.isVisible = true;
        this.matdialog.closeAll();
    }
    getfoldersbyuserid() {
        this.isVisible = false;
        var payLoad = {
            UserId: this.userID
        }
        this.candidateService.getFoldersbyUserId(payLoad).subscribe(res => {
            //debugger;
            if (res.$values.length > 0) {
                this.folderList = [];
                this.filteredFolderList = [];
                this.folderList = res.$values;
                this.filteredFolderList = res.$values;
                // this.filteredFolderList = res.$values.filter(x => this.candidatefolderIds.includes(x.folderId));
            }
            this.isVisible = true;
        });
        

    }
    getCandidatesbyFoldersId(folder: any) {
        //debugger;
        this.isVisible = false;
        this.selectedCount = 0;
        this.AllCandidates = [];
        this.curFolderId = folder.FolderId;
        this.curFolder = folder.FolderName;
        this.curFolderStatus = folder.Status;
        //this.getfoldersbyuserid();
        var payLoad = {
            folderId: folder.FolderId
        }
        //this.candidateService.getCandidatesbyFolderId(payLoad).subscribe(res=>{
        this.candidateService.getCandidatesbyFolderId(folder.FolderId).subscribe(res => {
            //debugger;
            this.AllCandidates = res;
            this.isVisible = true;
        });
        this.openDialogModal(this.EditFolderDialog, '950px', '550px');
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
    UpdateFolder() {
        this.isVisible = false;
        // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/UpdateFolder', {
        this.http.post<any>(this.apiUrl + '/api/candidateService/UpdateFolder', {
            CandidateIds: this.selectedCandidateIds,
            FolderId: this.EditFolderFormGroup.get('folderId').value
        }).subscribe(data => {
            this.getfoldersbyCandidateId();
            this.isVisible = true;
            Swal.fire(
                'Folder updated successfully',
                '',
                'success'
            );
        });
        this.isVisible = true;
        this.matdialog.closeAll();
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
                this.isVisible = false;
                // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/RemoveCandidatesFromCandidateToFolder', {
                this.http.post<any>(this.apiUrl + '/api/candidateService/RemoveCandidatesFromCandidateToFolder', {
                    CandidateIds: this.selectedCandidateIds,
                    FolderId: this.curFolderId
                }).subscribe(data => {
                    this.getfoldersbyCandidateId();
                    this.isVisible = true;
                    Swal.fire(
                        'Removed selected candidates from ' + this.curFolder + ' folder successfully',
                        '',
                        'success'
                    );
                });
                this.matdialog.closeAll();
                this.isVisible = true;
            }
        });
    }



    CancelcandidateInterview() {
        //debugger;
        let cid = this.candidateID;
        let jobid = this.selectedjobid;
        let interviewtype = this.InterviewTypeCancelModel;
        let status = 'Cancelled';
        this.EvaluationserviceService.rejectinterviewcandidate(jobid, cid, interviewtype, status).subscribe(data => {
            Swal.fire(
                'Interview Cancelled',
                '',
                'success'
            );

            this.matdialog.closeAll();
            this.getCandidateSheduleInterviewInfo();
        });

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
                //  this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/UpdateFolderStatus?FolderId=' + parseInt(this.curFolderId) + '&Status=' + statusValue, {}).subscribe(data=>{
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
            this.AllCandidates.forEach((element, index) => {
                if (element.Id == Id) {
                    this.AllCandidates.splice(index, 1);
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

    ApplyMultipleJobs() {
        //this._fuseProgressBarService.show();
        //this.http.post('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/ApplyJobByCandidate',
        this.http.post(this.apiUrl + '/api/candidateService/ApplyJobByCandidate',
            {
                CandidateId: this.candidateID,
                JobIds: this.selectedAssignJobs,
                CandidateIds: null
            }).subscribe(data => {
                Swal.fire(
                    'Jobs Assigned successfully!',
                    '',
                    'success'
                );
                //this._fuseProgressBarService.hide();
                this.getcandidateappliedJobs();
            });
        this.selectedAssignJobs = [];
        this.matdialog.closeAll();
        //this._fuseProgressBarService.hide();      
    }

    GetCandidatesEvaluationInfo(JobId: any, CandidateId: any) {

        // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/GetCandidatesEvaluationInfo?JobId=' +JobId + "&CandidateId=" +CandidateId ).subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/candidateService/GetCandidatesEvaluationInfo?JobId=' + JobId + "&CandidateId=" + CandidateId).subscribe(data => {
            this.appliedjobdate = data.Table[0].AppliedOn;
            this. jobstatus = data.Table[0].Status;
        });
    }


    // onFileChange(event:any){
    //     onFileChange(pFileList: File[]){
    //     // this.isVisible = false;
    //     //  if (event.target.files && event.target.files[0]) {
    //     //      this.resumeselectedFiles.push(event.target.files[0]);
    //     //      if (this.resumeselectedFiles.length > 0) {
    //     //          this.saveuploadBlobResume();
    //     //      }
    //     //  }
    //     //  this.CloseAllmatdialog();
    //     //  this.isVisible = true;
    //     this.files = Object.keys(pFileList).map(key => pFileList[key]);
    //       this.isVisible = false;
    //       console.log(this.files)
    //      if (this.files && this.files.files[0]) {
    //          this.resumeselectedFiles.push(this.files.files[0]);
    //          if (this.resumeselectedFiles.length >  0) {
    //              this.saveuploadBlobResume();
    //          }
    //      }
    //      this.CloseAllmatdialog();
    //      this.isVisible = true;
    //     console.log(this.files , 'this.files')
    //     this._snackBar.open("Successfully upload!", 'Close', {
    //       duration: 2000,
    //     });
    //   }
    // onFileChange(event: Event): void {
    //     const input = event.target as HTMLInputElement;
    //     if (input.files) {
    //         this.files = Array.from(input.files);
    //         this.isVisible = false;
    //         console.log(this.files);
    
    //         if (this.files.length > 0) {
    //             this.resumeselectedFiles.push(this.files[0]);
    //             if (this.resumeselectedFiles.length > 0) {
    //                 this.saveuploadBlobResume();
    //             }
    //         }
    
    //         this.CloseAllmatdialog();
    //         this.isVisible = true;
    //         console.log(this.files, 'this.files');
    
    //         this._snackBar.open("Successfully upload!", 'Close', {
    //             duration: 2000,
    //         });
    //     }
    // }

    onFileChange(event: Event | DragEvent): void {
        let files: FileList | null = null;
    
        if (event instanceof DragEvent) {
            // Handle drag-and-drop event
            files = event.dataTransfer?.files || null;
        } else if (event instanceof Event) {
            // Handle file input change event
            const input = event.target as HTMLInputElement;
            files = input.files;
        }
    
        if (files) {
            this.files = Array.from(files);
            this.isVisible = false;
            console.log(this.files);
    
            if (this.files.length > 0) {
                this.resumeselectedFiles.push(this.files[0]);
                if (this.resumeselectedFiles.length > 0) {
                    this.saveuploadBlobResume();
                }
            }
    
            this.CloseAllmatdialog();
            this.isVisible = true;
            console.log(this.files, 'this.files');
    
            this._snackBar.open("Successfully uploaded!", 'Close', {
                duration: 2000,
            });
        }
    }
    onDragOver(event: DragEvent): void {
        event.preventDefault(); // Necessary to allow dropping
    }
    
    onDrop(event: DragEvent): void {
        event.preventDefault();
        this.onFileChange(event); // Use the existing file change handler
    }
    
      deleteFile(f){
        this.files = this.files.filter(function(w){ return w.name != f.name });
        this._snackBar.open("Successfully delete!", 'Close', {
          duration: 2000,
        });
      }
    
      openConfirmDialog(pIndex): void {
        const dialogRef = this.dialog.open(DialogConfirmComponent, {
          panelClass: 'modal-xs'
        });
        dialogRef.componentInstance.fName = this.files[pIndex].name;
        dialogRef.componentInstance.fIndex = pIndex;
    
    
        dialogRef.afterClosed().subscribe(result => {
          if (result !== undefined) {
            this.deleteFromArray(result);
          }
        });
      }
    
      deleteFromArray(index) {
        console.log(this.files);
        this.files.splice(index, 1);
      }

      onBlobFileInput(event) {
        // debugger;
      
         this.isVisible = false;
         if (event.target.files && event.target.files[0]) {
             this.resumeselectedFiles.push(event.target.files[0]);
             if (this.resumeselectedFiles.length > 0) {
                 this.saveuploadBlobResume();
             }
         }
         this.CloseAllmatdialog();
         this.isVisible = true;
     }
      saveuploadBlobResume() {
        //debugger;
        this.isVisible = false;
        //this._fuseProgressBarService.show();
        let formData = new FormData();
        let extension = this.resumeselectedFiles[0].name.split('.')[1];
        if (extension == "pdf" || extension == "docx" || extension == "doc" || extension == "txt") {
            formData.append('FileUpload', this.resumeselectedFiles[0]);
            formData.append('CreatedBy', this.userID);
            let cid = this.candidateID;
            formData.append('UserId', this.candidateID.toString());
            this.candidateService.SaveBlobResume(formData).subscribe(result => {
                this.resumeselectedFiles = [];
                this.isVisible = true;
                //this._fuseProgressBarService.hide();
                this._snackBar.open('Resume saved successfully', null, {
                    duration: 3000
                });
                this.getresumesbycandidateid(this.candidateID);
            })
        }
        else {
            this._snackBar.open('Please Upload Resume with Pdf, Doc, Docx, Txt Formats.', null, {
                duration: 1000
            });
        }
    }
}
