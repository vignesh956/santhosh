import { Component, ViewEncapsulation, TemplateRef, ViewChild, OnInit, AfterContentChecked, ElementRef } from '@angular/core';
import { StarRatingColor } from './star-rating/star-rating.component';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { MatDialog } from '@angular/material/dialog';
import { EvaluationserviceService } from '../../../services/evaluationservice.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { ColDef, CellClickedEvent } from 'ag-grid-community';
import { GridOptions } from '@ag-grid-community/all-modules';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CandidateserviceService } from '../../../services/candidateservice.service'
//import {FuseProgressBarService} from '../../../../@fuse/components/progress-bar/progress-bar.service';
import { QuestionnaireService } from '../../../services/questionnaire.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { forEach } from 'lodash';
import { DatePipe, formatDate } from '@angular/common';
import { Router } from "@angular/router";
//import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { DateRendererComponent } from './components/date-renderer.component';
//import {AngularCountdownTimerComponent} from 'angular8-countdown-timer';
//import { CountdownModule } from 'ngx-countdown';
//import { CountdownTimer } from 'ngx-countdown';
import { CountdownTimer  } from 'ngx-countdown';
import { CandidateService } from '../../../services/candidate.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//import { id } from '@swimlane/ngx-datatable/release/utils';

import { RepositoryConstant } from '../../constants/Repository.constant';
//import {NgxSpinnerService} from 'ngx-spinner';
//import { MatListBase } from '@angular/material/list';
//import { MatSelectionList } from '@angular/material/list';



@Component({
    selector: 'evaluation',
    templateUrl: './evaluation.component.html',
    styleUrls: ['./evaluation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe]
})
export class EvaluationComponent implements OnInit, AfterContentChecked {
    public apiUrl: string = RepositoryConstant.apiUrl;
    rowData: any;
    txtEmailBody: any;
    gridApi;
    defaultColDef;
    gridColumnApi;
    context: any;
    searchInput: FormControl;
    candidatesDrpdwnformControl;
    candidatesDrpdwnColumns: any;
    gridOptions: GridOptions;
    InterviewTotalScor: number = 0;
    tracking: any;
    gridtotRowCount;
    rowSelection;
    frameworkComponents;
    hrTimer: any;
    ConInterviewType;
    hrbtshowhide : boolean = false;
    Techbtshowhide : boolean = false;
    assignbtshowhide : boolean = false;
    assessbtshowhide : boolean = false;
    managebtshowhide : boolean = false;
    // @ViewChild(MatSelectionList) matselectionList: MatSelectionList;
    @ViewChild('ViewSummaryAgGrid', { static: true }) ViewSummaryAgGrid: TemplateRef<any>;
    @ViewChild('videoPlayer', { static: true }) videoplayer: ElementRef;
    @ViewChild('HrUsersDialog', { static: true }) HrUsersDialog: TemplateRef<any>;
    @ViewChild('Rejectmodal', { static: true }) Rejectmodal: TemplateRef<any>;
    @ViewChild('InterviewRejectmodal', { static: true }) InterviewRejectmodal: TemplateRef<any>;
    @ViewChild('InterviewCancelmodal', { static: true }) InterviewCancelmodal: TemplateRef<any>;
   // @ViewChild('cdt', { static: false }) private countdown: AngularCountdownTimerComponent;
    @ViewChild('cdt', { static: false }) private countdown: CountdownTimer ;
    //  @ViewChild('TechnicalInterviewerUsersDialog', { static: false }) private TechnicalInterviewerUsersDialog: TemplateRef<any>;
    @ViewChild('TechnicalInterviewerUsersDialog', { static: true }) TechnicalInterviewerUsersDialog: TemplateRef<any>;
    today = new Date();
    defaultAction;
    defaultLevel;
    assignmentdefaultLevel;
    defaultSkill:any;
    assignmentdefaultSkill:any;
    defaultappliedAction;
    curDate: any;
    safeURL;
    appliedjobdate: any;
    IshiringManager: boolean = false;
    IsInterviewer: boolean = false;
    IsCandidate: boolean = false;
    form: FormGroup;
    someDate: Date;
    assignmentCount: Date;
    assessmentform: FormGroup;
    assessmentSubmitedform: FormGroup;
    AssignmentSubmitedform: FormGroup;
    hrcandidateform: FormGroup;
    Technicaldataform: FormGroup;
    managementdateform: FormGroup;
    AssignmentQuestionsList;
    InterviewTypeRejectModel = '';
    InterviewTypeCancelModel = '';
    AssessmentQuestionsList;
    rating: number = 0;
    CorrectAnswerscount = 0;
    selectappliedjob;
    Percentageval: number = 0;
    evaluationAssignmentPercentageval: number = 0;
    HrPercentageval: number = 0;
    TechnicalPercentageval: number = 0;
    ManagementPercentageval: number = 0;
    SkillsList = [];
    saveassessmentvaluesarray = [];
    savehrratingvaluesarray = [];
    savetechnicalratingvaluesarray = [];
    savemanagementratingvaluesarray = [];
    NoofQuestions = 0;
    candidateId = 0;
    jobDetails: any;
    Benefits: any;
    FArea: any;
    Skills: any;
    Salary: any;
    JobType: any;
    Industries: any;

    CandidateAssignmentResultList = [];
    CandidateGeeralResultList = [];
    CandidateEvalutionInterviewInfoList = [];
    CandidateHrResultList = [];
    CandidateTechnicalResultList = [];
    CandidateManagementResultList = [];
    IsAssignmentTestDonebyCandidate = false;
    IsAssessmentTestDonebyCandidate = false;
    IsHrTestDonebyCandidate = false;
    IsTechnicalTestDonebyCandidate = false;
    IsManagementTestDonebyCandidate = false;
    SelectedAssignmentAnswers: string[] = [];
    SelectedSkillsforQuestionnaire: string[] = [];
    JudgeforcandidateAssessmentResult = [];
    scoreappendtoassessmentquestionslist: any = [];
    candidateAssessmentResultList = [];
    educationstarCount: number = 5;
    IsSubmit: boolean = false;
    ActiveJobs: [] = [];
    candidateData: any[] = [];
    AppliedCandidate: [] = [];
    getfindcandidaterecord;
    AppliedCandidateDummy: [] = [];
    isVisible: any = false;
    TestResultStatus;
    candidateprofileimageURL;
    commonfieldName;
    commonfieldDesignation;
    commonfieldCompany;
    commonfieldEmail;
    commonfieldMobile;
    commonfieldLocation;
    resumeList: any[] = [];
    folderList: any[] = [];
    IsPdf: boolean = false;
    IsDoc: boolean = false;
    //isVisible: boolean = false;
    showQuestiontoCandidate: boolean = false;
    showAssignmentQuestiontoCandidate: boolean = false;
    filepath: any;
    docpath: any;
    defaultAppliedJobAction: any;
    candidateFolderList: any[] = [];
    candidateActivitiesList: any[] = [];
    overallrankstarCount: number = 5;
    jobexpstarCount: number = 5;
    techskillsstarCount: number = 5;
    AppliedJobsList: any = [];
    selectCurrentResume: any;
    resumeselectedFiles = [];
    question2: number = 5;
    question3: number = 5;
    question4: number = 5;
    question5: number = 5;
    InterviewsList: any = [];
    PresentJobId: any;
    PresentCandidaiteId: any;
    evaluationHrQuestionsList: any = [];
    evaluationTechnicalQuestionsList: any = [];
    RejectInterviewMessageBody: any;
    evaluationManagementQuestionsList: any = [];
    evaluationAssessmentQuestionsList: any = [];
    evaluationassessmentquestionsbyLevel: any = [];
    evaluationassignmentquestionsbyLevel: any = [];
    evaluationAssignmentQuestionsList: any = [];
    candidateAssessmentresultList: any = [];
    AddEditdefaultRating;
    InterviewTypeSelected: any;
    IsInterviewAdvance: boolean = false;
    Isinterviewchange: boolean = false;
    defaultinterviewstagechange: any;
    userID: any;
    ModifyInterviewMode: any;
    SelectTechnicalInterviewDate: any;
    InterviewTimeToSelected: any;
    AssignedAssessmentQuestions: any = [];
    AssignedAssessmentConductedBy: any = [];
    AssignedAssessmentscheduleon: any;
    AssignedAssessmentFrom: any;
    AssignedAssignmentQuestions: any = [];
    AssignedAssignmentConductedBy: any = [];
    AssignedAssignmentscheduleon: any;
    AssignedAssignmentFrom: any;
    InterviewTimeFromSelected: any;
    ModifyInterviewers: any;
    ModifyInterviewType: any;
    InterviewModeSelected = [];
    InterviewMode: any;
    ModifyInterviewDate: any;
    _candidateprofilejobid: any;
    _candidateidDashboard: any;
    ModifyInterviewFrom: any;
    timers = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
    timeType = ['AM', 'PM'];
    InterviewTimeType: any;
    interviewers = [];
    GetCandidatesEvaluationDetails = [];
    selectedInterviewers = [];
    InterviewMessageBody: any;
    hrRoleUsers = [];
    evaluationAssessmentTestStatus: any;
    evaluationAssignmentTestStatus: any;
    ConuductedByHrInterviews = [];
    ConuductedBTechnicalInterviews = [];
    ConuductedByManagementInterviews = [];
    ConuductedByAssessmentInterviews = [];
    ConuductedByAssignmentInterviews = [];

    ScheduledHrInterviewon;
    ScheduledTechnicalInterviewon;
    ScheduledManagementInterviewon;
    ScheduledAssessmentInterviewon;
    ScheduledAssignmentInterviewon;

    ScheduledHrStatus;
    ScheduledTechnicalStatus;
    ScheduledManagementStatus;
    ScheduledAssessmentStatus;
    ScheduledAssignmentStatus;

    ScheduledHrStatusTime;
    ScheduledTechnicalStatusTime;
    ScheduledManagementStatusTime;
    ScheduledAssessmentStatusTime;
    ScheduledAssignmentStatusTime;

    TimeScheduledHrInterviewon;
    TimeScheduledTechnicalInterviewon;
    TimeScheduledManagementInterviewon;
    TimeScheduledAssessmentInterviewon;
    TimeScheduledAssignmentInterviewon;
    RatingPercentageAssignmentInterview;
    RatingPercentageAssessmentInterview;
    RatingPercentageTechnicalInterview;
    RatingPercentageManagementInterview;
    IsAnyInterviewRejected: boolean = false;
    RatingPercentageHrInterview;

    HrInterviewModes = [];
    TechnicalInterviewModes = [];
    ManagementInterviewModes = [];
    AssessmentInterviewModes = [];
    AssignmentInterviewModes = [];

    ApplicationStatus: any;
    GetCandidateAssigningTo: any;
    ApplicationStatusIsAdvance: any;
    selectedUserEmail: any;
    selectedHrs = [];
    Selecthruser: any;
    userName: any;
    userEmail: any;
    // UserId:any;
    _Recruiters = new Map();
    selectedUserRoles = [];
    selectedRowsCnt = 0;
    IsCandidateAssiged: boolean = false;
    candidateinterviewSchedule: any;
    AllcandidateinterviewScheduled: any;
    candidateinterview: boolean = false;
    candidateinterviewer: any;
    GetInterviewMode: any;
    CandidateMessage: any[] = [];
    CandidateUnReadMsg: any = 0;
    loggedInfo: any
    public Editor = ClassicEditor;
    InputMessage;
    selectSortBy = '';
    defaultSort = 'Name';
    SelectedJobId: number;

    starColor: StarRatingColor = StarRatingColor.accent;
    starColorP: StarRatingColor = StarRatingColor.primary;
    starColorW: StarRatingColor = StarRatingColor.warn;
    YtubevideoUrl = 'https://www.youtube.com/embed/YybSOji9YSA&ab_channel=ElowieeeJoy';
    changedDate: any;
    changedDate1: any;
    SelectedCandidateId: string;
    startTime: number = 1;
    // hrInterval: NodeJS.Timer;
    hrInterviewStarted: boolean = false;
    hrInterviewStartbtnText: string;
    hrStartTime: any = null;
    hrEndTime: any;
    showHrStartStopBtn: boolean = true;
    technicalStartTime: any;
    technicalInterviewStarted: boolean;
    technicalInterviewStartbtnText: string;
    technicalEndTime: any;
    showTechnicalStartStopBtn: boolean;
    assignmentStartTime: any;
    assignmentInterviewStarted: boolean;
    assignmentInterviewStartbtnText: string;
    showAssignmentStartStopBtn: boolean = true;
    assignmentEndTime: any;
    assessmentStartTime: any;
    assessmentInterviewStarted: boolean;
    assessmentInterviewStartbtnText: string;
    assessmentEndTime: any;
    showAssessmentStartStopBtn: boolean = true;
    showManagementStartStopBtn: boolean = true;
    managementStartTime: any;
    managementEndTime: any;
    managementInterviewStarted: boolean;
    managementInterviewStartbtnText: string;
    managementDuration: any = null;
    assessmentDuration: any = null;
    assignmentDuration: any = null;
    technicalDuration: any = null;
    hrDuration: any = null;


    //@ViewChild('ViewSummaryAgGrid', {​​​​​static:true}​​​​​) ViewSummaryAgGrid: TemplateRef<any>;

    public columnDefs: ColDef[] = [

        { field: 'candidateName', headerName: 'Candidate', width: 150, headerTooltip: 'candidate', tooltipField: 'candidateName', filter: true, filterParams: stdFilterParams },
        { field: 'appliedOn', headerName: 'Applied On', width: 200, headerTooltip: 'applied On', tooltipField: 'appliedOn', filter: true, filterParams: stdFilterParams },
        { field: 'lastUpdate', headerName: 'Last Update', width: 200, headerTooltip: 'last Update', tooltipField: 'lastUpdate', filter: true, filterParams: stdFilterParams },
        { field: 'status', headerName: 'Status', width: 140, headerTooltip: 'status', tooltipField: 'status', filter: true, filterParams: stdFilterParams },
        { field: 'hr', headerName: 'HR', width: 150, headerTooltip: 'HR', tooltipField: 'hR', filter: true, filterParams: stdFilterParams },
        { field: 'technical', headerName: 'Technical', width: 150, headerTooltip: 'technical', tooltipField: 'technical', filter: true, filterParams: stdFilterParams },
        { field: 'assessment', headerName: 'Assessment', width: 150, headerTooltip: 'assessment', tooltipField: 'assessment', filter: true, filterParams: stdFilterParams },
        { field: 'assignment', headerName: 'Assignment', width: 150, headerTooltip: 'assignment', tooltipField: 'assignment', filter: true, filterParams: stdFilterParams },
        { field: 'management', headerName: 'Management', width: 150, headerTooltip: 'management', tooltipField: 'management', filter: true, filterParams: stdFilterParams },
        { field: 'overAll', headerName: 'OverAll', width: 150, headerTooltip: 'overAll', tooltipField: 'overAll', filter: true, filterParams: stdFilterParams },

    ];

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
            headerName: 'Candidate',
            field: 'candidateName',
            filter: 'agTextColumnFilter',
            tooltipField: 'CandidateName',
            width: 250,
            dropdownItem: true
        },
        {
            headerName: 'Applied On',
            cellClass: "grid-cell-centered",
            field: 'appliedOn',
            resizable: true,
            sortable: true,
            filter: 'agDateColumnFilter',
            tooltipField: 'AppliedOn',
            width: 120,
            dropdownItem: true
        },
        {
            headerName: 'Last Active',
            field: 'lastUpdate',
            cellClass: "grid-cell-centered",
            columnGroupShow: 'closed',
            filter: 'agDateColumnFilter',
            tooltipField: 'LastUpdate',
            width: 120,
            dropdownItem: true
        },
        {
            headerName: 'Status',
            cellClass: "grid-cell-centered",
            field: 'status',
            resizable: true,
            filter: 'agTextColumnFilter',
            width: 140,
            dropdownItem: true
        },
        {
            headerName: 'HR',
            cellClass: "grid-cell-centered",
            field: 'hr',
            resizable: true,
            filter: 'agTextColumnFilter',
            width: 150,
            dropdownItem: true
        },
        {
            headerName: 'Technical',
            cellClass: "grid-cell-centered",
            field: 'technical',
            resizable: true,
            filter: 'agTextColumnFilter',
            width: 150,
            dropdownItem: true
        },
        {
            headerName: 'Assessment',
            cellClass: "grid-cell-centered",
            field: 'assessment',
            resizable: true,
            filter: 'agTextColumnFilter',
            width: 150,
            dropdownItem: true
        },
        {
            headerName: 'Assignment',
            cellClass: "grid-cell-centered",
            field: 'assignment',
            resizable: true,
            filter: 'agTextColumnFilter',
            width: 150,
            dropdownItem: true
        },
        {
            headerName: 'Management',
            cellClass: "grid-cell-centered",
            field: 'management',
            resizable: true,
            filter: 'agTextColumnFilter',
            width: 150,
            dropdownItem: true
        },
        {
            headerName: 'OverAll',
            cellClass: "grid-cell-centered",
            field: 'overAll',
            resizable: true,
            filter: 'agTextColumnFilter',
            width: 150,
            dropdownItem: true
        }


    ];
    // public defaultColDef: ColDef = {
    //   width: 170,
    //   sortable: true,
    //   filter: true,
    //   resizable: true

    // };
    /**
     * Constructor
     */
    constructor(

        private fb: FormBuilder,
        private authService: AuthenticationService,
        private http: HttpClient,
        private sanitizer: DomSanitizer,
        private candidateservice: CandidateserviceService,
        private _questionnaireService: QuestionnaireService,
        private matdialog: MatDialog,
        public DatePipe : DatePipe,
        private candidateServices: CandidateService,
        public Router: Router,
        // private _fuseProgressBarService: FuseProgressBarService,
        // public _fuseSidebarService: FuseSidebarService,
        private evaluationservice: EvaluationserviceService,
        private _sanitizer: DomSanitizer,
        //private _matlistbase:MatListBase,
        //private spinnerService: NgxSpinnerService,
    ) {

        this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(this.YtubevideoUrl);
        let loggedInfo = this.authService.getLoggedInfo();
       
        this.userName = loggedInfo.FfirstName + ' ' + loggedInfo.lastName;
        this.userEmail = loggedInfo.email;
        this.userID = loggedInfo.id;
        //this._fuseProgressBarService.show();
        
        if (loggedInfo.role == 'Hiring Manager' || loggedInfo.role == 'Administrator' 
            || loggedInfo.role == 'Interviewer' || loggedInfo.role == 'Recruiter') {
            this.IshiringManager = true;
            this.context = {
                componentParent: this
            };
            this.defaultColDef = {
                sortable: true,
                resizable: true,
                width: 'auto'
            };
            // this._fuseSidebarService.getSidebar('navbar').toggleFold();
            this.gridOptions = <GridOptions>{
                enableSorting: true,
                enableFilter: true,

            };

            this.rowSelection = 'multiple';
            this.gridOptions.columnDefs = this.webColumns;
            this.gridOptions.pagination = true;
            this.gridOptions.skipHeaderOnAutoSize = true;

            this.frameworkComponents = {
                DateRendererComponent: DateRendererComponent
            };
            this.candidatesDrpdwnformControl = new FormControl([
                'Id',
                'JobTitle',
                'CandidatesApplied',
                'HRReview',
                'T.Interview',
                'Assessment',
                'Assignment',
                'Evaluation',
                'ActionItem'
            ]);

            let arr = [];
            let arr2 = [];
            for (var val of this.webColumns) {
                if (val.dropdownItem) {
                    arr.push(val);
                    arr2.push(val.field);
                }
            }
            this.candidatesDrpdwnColumns = arr;
            this.searchInput = new FormControl('');
        }

        if (loggedInfo.Role == 'Interviewer') {
            this.IsInterviewer = true;
        }

        if (loggedInfo.Role == 'Candidate') {
            this.candidateId = loggedInfo.candidateId;
            this.IsCandidate = true;
        }

        this.GethrRoleUsers();
        this.form = this.fb.group({
            checkArray: this.fb.array([])
        });
        this.hrcandidateform = new FormGroup({})
        this.managementdateform = new FormGroup({})
        this.Technicaldataform = new FormGroup({})
        this.assessmentform = new FormGroup({}) //<--create the formGroup
        this.assessmentSubmitedform = new FormGroup({})
        this.AssignmentSubmitedform = new FormGroup({})
        this._questionnaireService.GetdefaultQuestionnaireList().subscribe(data => {
            this.evaluationHrQuestionsList = data.Table.filter(i => i.QuestionnaireType === 'HR');
            this.evaluationTechnicalQuestionsList = data.Table.filter(i => i.QuestionnaireType === 'Technical');
            this.evaluationManagementQuestionsList = data.Table.filter(i => i.QuestionnaireType === 'Management');
            this.evaluationAssessmentQuestionsList = data.Table.filter(i => i.QuestionnaireType === 'Assessment');
            //this.evaluationAssessmentQuestionsList = [];
            //this.evaluationAssignmentQuestionsList = [];

            this.evaluationAssignmentQuestionsList = data.Table.filter(i => i.QuestionnaireType === 'Assignment');


            for (let formModule of this.evaluationHrQuestionsList) {
                this.hrcandidateform.addControl(formModule.Id, new FormControl('', Validators.required))
            }
            for (let formModule of this.evaluationTechnicalQuestionsList) {
                this.Technicaldataform.addControl(formModule.Id, new FormControl('', Validators.required))
            }
            for (let formModule of this.evaluationManagementQuestionsList) {
                this.managementdateform.addControl(formModule.Id, new FormControl('', Validators.required))
            }
        });
        //this._fuseProgressBarService.hide(); 

    }  //constructor

    ngAfterContentChecked(): void {
        if (document.getElementById('hrInterviewStartTimer_' + this.SelectedCandidateId) != null && this.hrStartTime != null) {
            document.getElementById('hrInterviewStartTimer_' + this.SelectedCandidateId).innerText = "Start Time : " + new Date(this.hrStartTime).toLocaleTimeString();
        }
        if (document.getElementById('hrInterviewEndTimer_' + this.SelectedCandidateId) != null && this.hrEndTime != null) {
            document.getElementById('hrInterviewEndTimer_' + this.SelectedCandidateId).innerText = "End Time : " + new Date(this.hrEndTime).toLocaleTimeString();
        }
        if (document.getElementById('hrInterviewDuration_' + this.SelectedCandidateId) != null && this.hrDuration != null) {
            document.getElementById('hrInterviewDuration_' + this.SelectedCandidateId).innerText = "Duration : " + this.hrDuration;
        }

        if (document.getElementById('technicalInterviewStartTimer_' + this.SelectedCandidateId) != null && this.technicalStartTime != null) {
            document.getElementById('technicalInterviewStartTimer_' + this.SelectedCandidateId).innerText = "Start Time : " + new Date(this.technicalStartTime).toLocaleTimeString();
        }
        if (document.getElementById('technicalInterviewEndTimer_' + this.SelectedCandidateId) != null && this.technicalEndTime != null) {
            document.getElementById('technicalInterviewEndTimer_' + this.SelectedCandidateId).innerText = "End Time : " + new Date(this.technicalEndTime).toLocaleTimeString();
        }

        if (document.getElementById('technicalInterviewDuration_' + this.SelectedCandidateId) != null && this.technicalDuration != null) {
            document.getElementById('technicalInterviewDuration_' + this.SelectedCandidateId).innerText = "Duration : " + this.technicalDuration;
        }

        if (document.getElementById('assignmentInterviewStartTimer_' + this.SelectedCandidateId) != null && this.assignmentStartTime != null) {
            document.getElementById('assignmentInterviewStartTimer_' + this.SelectedCandidateId).innerText = "Start Time : " + new Date(this.assignmentStartTime).toLocaleTimeString();
        }
        if (document.getElementById('assignmentInterviewEndTimer_' + this.SelectedCandidateId) != null && this.assignmentEndTime != null) {
            document.getElementById('assignmentInterviewEndTimer_' + this.SelectedCandidateId).innerText = "End Time : " + new Date(this.assignmentEndTime).toLocaleTimeString();
        }

        if (document.getElementById('assessmentInterviewDuration_' + this.SelectedCandidateId) != null && this.assessmentDuration != null) {
            document.getElementById('assessmentInterviewDuration_' + this.SelectedCandidateId).innerText = "Duration : " + this.assessmentDuration;
        }

        if (document.getElementById('assignmentInterviewDuration_' + this.SelectedCandidateId) != null && this.assignmentDuration != null) {
            document.getElementById('assignmentInterviewDuration_' + this.SelectedCandidateId).innerText = "Duration : " + this.assignmentDuration;
        }

        if (document.getElementById('assessmentInterviewStartTimer_' + this.SelectedCandidateId) != null && this.assessmentStartTime != null) {
            document.getElementById('assessmentInterviewStartTimer_' + this.SelectedCandidateId).innerText = "Start Time : " + new Date(this.assessmentStartTime).toLocaleTimeString();
        }
        if (document.getElementById('assessmentInterviewEndTimer_' + this.SelectedCandidateId) != null && this.assessmentEndTime != null) {
            document.getElementById('assessmentInterviewEndTimer_' + this.SelectedCandidateId).innerText = "End Time : " + new Date(this.assessmentEndTime).toLocaleTimeString();
        }



        if (document.getElementById('managementInterviewStartTimer_' + this.SelectedCandidateId) != null && this.managementStartTime != null) {
            document.getElementById('managementInterviewStartTimer_' + this.SelectedCandidateId).innerText = "Start Time : " + new Date(this.managementStartTime).toLocaleTimeString();
        }
        if (document.getElementById('managementInterviewEndTimer_' + this.SelectedCandidateId) != null && this.managementEndTime != null) {
            document.getElementById('managementInterviewEndTimer_' + this.SelectedCandidateId).innerText = "End Time : " + new Date(this.managementEndTime).toLocaleTimeString();
        }
        if (document.getElementById('managementInterviewDuration_' + this.SelectedCandidateId) != null && this.managementDuration != null) {
            document.getElementById('managementInterviewDuration_' + this.SelectedCandidateId).innerText = "Duration : " + this.managementDuration;
        }


        if (this.CandidateEvalutionInterviewInfoList != undefined && this.CandidateEvalutionInterviewInfoList.length > 0) {
            this.CandidateEvalutionInterviewInfoList.forEach(obj => {
                if (obj.Status == 'Completed') {
                    if (document.getElementById(obj.InterviewerId) != null) {
                        document.getElementById(obj.InterviewerId).innerText = "Completed";
                    }
                    if (document.getElementById('interview_' + obj.InterviewerId) != null) {
                        document.getElementById('interview_' + obj.InterviewerId).innerText = "Completed";
                    }
                    return;
                }
                var currentDate = new Date();
                var targetDate = new Date(obj.InterviewDate);
                var cDateMillisecs = currentDate.getTime();
                var tDateMillisecs = targetDate.getTime();
                var difference = tDateMillisecs - cDateMillisecs;
                var seconds = Math.floor(difference / 1000);
                var minutes = Math.floor(seconds / 60);
                let hours = Math.floor(minutes / 60);
                var days = Math.floor(hours / 24);
                hours %= 24;
                minutes %= 60;
                seconds %= 60;
                var secondsString = null;
                var hoursString = null;
                var minutesString = null;
                if (seconds < 10) {
                    secondsString = "0" + seconds;
                }
                else {
                    secondsString = seconds;
                }
                if (hours < 10) {
                    hoursString = "0" + hours;
                }
                else {
                    hoursString = hours;
                }
                if (minutes < 10) {
                    minutesString = "0" + minutes;
                }
                else {
                    minutesString = minutes;
                }
                if (document.getElementById(obj.InterviewerId) != null) {
                    if (hours < 0 && minutes < 0) {
                        document.getElementById(obj.InterviewerId).innerText = "Time up!";
                    }
                    else {
                        document.getElementById(obj.InterviewerId).innerText = days + " Days " + hoursString + ':' + minutesString + ':' + secondsString;
                    }
                }
                if (document.getElementById('interview_' + obj.InterviewerId) != null) {
                    if (hours < 0 && minutes < 0) {
                        document.getElementById('interview_' + obj.InterviewerId).innerText = "Time up!";
                    }
                    else {
                        document.getElementById('interview_' + obj.InterviewerId).innerText = days + " Days " + hoursString + ':' + minutesString + ':' + secondsString;
                    }
                }
                setInterval(this.ngAfterContentChecked, 1000);
            })
        }
    }
    onTabChanged($event) {
        this.ngAfterContentChecked();
    }

    InterviewTimeTypeEvent(selectvalue: any) {
        this.InterviewTimeType = selectvalue;
    }
    ModifyInterviewersEvent(selectvalue: any) {
        this.ModifyInterviewers = selectvalue;
    }

    onCellClicked(e: CellClickedEvent): void {
        console.log('cellClicked', e);
    }
    CloseDialogbox() {
        this.matdialog.closeAll();
    }




    ngOnInit() {
        this.curDate = new Date();

        this.defaultLevel = "Select";
        this.defaultappliedAction = "Select";
        this.defaultAction = "Select";
        this.assignmentdefaultLevel = "Select";
        this.defaultinterviewstagechange = "Select";
        this.defaultSkill = "";
        this.assignmentdefaultSkill = "";
        this.defaultappliedAction = "Select";
        this.AddEditdefaultRating = "Select";
        this.ModifyInterviewType = "Select";
        //this.ModifyInterviewMode = "Select";
        //this.ModifyInterviewers = "Select";

        this.getInterviewMode();
        this.getinterviewers();
        this.loggedInfo = this.authService.getLoggedInfo();
        this.userID = this.loggedInfo.id; //1
        this.InputMessage = '';
        //this.curDate = new Date();
        //debugger;
        if (this.IsCandidate) {
            this.isVisible = true;
            this.evaluationservice.getappliedjoblist(this.candidateId).subscribe(data => {
                // this.evaluationservice.getappliedjoblist(1).subscribe(data=>{
                this.AppliedJobsList = data.Table;

                if (this.AppliedJobsList.length > 0) {
                    this.defaultappliedAction = this.AppliedJobsList[0].JobId;
                    this.SelectedJobId = this.AppliedJobsList[0].JobId;
                    this.appliedjobdate = this.AppliedJobsList[0].CreatedDate;
                    this.userID = 0;
                    this.GetInterviewtasksbyJobId(this.defaultappliedAction);
                    this.getacitivitieslist(this.candidateId);
                }

                this.GetCandidatesEvaluationInfo(this.defaultappliedAction, this.candidateId);
                this.getgeneralresultbycandidateid(this.candidateId, this.defaultappliedAction);
                this.isVisible = false;
            });
            this.getcandidatedetailsbyid(this.candidateId);
            this.getresumeslist(this.candidateId);
            //this.getacitivitieslist(this.candidateId);

            this.GetAssessmentQuestionsbyCandidateidjobid(this.defaultappliedAction, this.candidateId);
            this.GetAssignmentQuestionsbyCandidateidjobid(this.defaultappliedAction, this.candidateId);
            this.isVisible = false;
            
           // this.getMessage(this.candidateId, this.userID);
             this.getMessage(this.candidateId,null);


        }

        if (this.IshiringManager) {
            this.getMessage(this.candidateId, this.userID);
            this.isVisible = true;
            this.candidateservice.getAllSkillslist().subscribe(data => {
                this.SkillsList = data;
                this.isVisible = false;
            });

            let jobidfromjoblist = sessionStorage.getItem('evaluationcandidatejobid'); //2;
            sessionStorage.setItem('evaluationcandidatejobid', null);

            if (jobidfromjoblist != "null" && jobidfromjoblist != "") {
                this.AppliedCandidate = [];
                if (jobidfromjoblist != null) {
                    this.evaluationservice.getappliedcandidatesbyjobid(jobidfromjoblist).subscribe(data => {

                        this.AppliedCandidate = data.Table;
                        this.isVisible = false;

                    },
                        error => {
                            //this.errors = error;
                        });
                }
            }

            this.evaluationservice.getactivejobslist().subscribe(data => {

                this.ActiveJobs = data.jobs.$values;
                this.defaultAction = data.jobs.$values[0].JobId;
                let jobidfromcandidateprofile = (localStorage.getItem("_candidateprofilejobid") != "") ? localStorage.getItem("_candidateprofilejobid") : data.jobs.$values[0].JobId; //2; //localStorage.getItem("_candidateprofilejobid");
                //if(jobidfromcandidateprofile !=null && jobidfromcandidateprofile !="")    
                if (jobidfromcandidateprofile != null) {
                    this.defaultAction = jobidfromcandidateprofile;
                    this.GetCandidatebyJobId(this.defaultAction);
                    this._candidateprofilejobid = (localStorage.getItem("_candidateprofilejobid") != "") ? localStorage.getItem("_candidateprofilejobid") : data.jobs.$values[0].JobId; //2; //localStorage.getItem("_candidateprofilejobid");
                    this._candidateidDashboard = localStorage.getItem("_candidateidDashboard"); //44; //localStorage.getItem("_candidateidDashboard");

                    if (this._candidateidDashboard != "" && this._candidateidDashboard != "null") {
                        this.candidateId = this._candidateidDashboard;
                        this.getcandidatedetailsbyid(this._candidateidDashboard);
                    }
                }
                else {
                    this.defaultAction = data.jobs.$values[0].JobId;
                    if (this.defaultAction != null && this.defaultAction != "") {
                        this.GetCandidatebyJobId(this.defaultAction);
                    }
                }

                //this.aggridbind();
                //this._fuseProgressBarService.hide();
                this.isVisible = false;

            });

            //this.getMessage(this.candidateId, null);
        }
        //debugger;
        if(this.candidateId != 0)
        {
            this.getMessage(this.candidateId, null);
        }
    }



    GetAssessmentQuestionsbyCandidateidjobid(jobid: any, cid: any) {
        this.AssignedAssessmentQuestions = [];
        this.AssignedAssessmentConductedBy = '';
        this.AssignedAssessmentscheduleon = '';
        this.AssignedAssessmentFrom = '';
        if (jobid != 'Select' && jobid != null) {
            this.evaluationservice.getassessmentassignedquestionby(jobid, cid, 'Assigned').subscribe(data => {
                this.AssignedAssessmentQuestions = data.Table.length > 0 ? data.Table : "";
                this.AssignedAssessmentConductedBy = data.Table2.length > 0 ? data.Table2 : "";
                this.AssignedAssessmentscheduleon = data.Table1.length > 0 ? data.Table1[0].InterviewDate : "";
                this.AssignedAssessmentFrom = data.Table1.length > 0 ? data.Table1[0].From : "";
                for (let formModule of this.AssignedAssessmentQuestions) {
                    this.assessmentSubmitedform.addControl(formModule.Id, new FormControl('', Validators.required))
                }
            });
        }
    }

    GetAssignmentQuestionsbyCandidateidjobid(jobid: any, cid: any) {
        //debugger;
        if (jobid != 'Select' && jobid != null) {
            this.evaluationAssignmentQuestionsList = [];
            this.AssignedAssignmentConductedBy = '';
            this.AssignedAssignmentscheduleon = '';
            this.AssignedAssignmentFrom = '';
            this.evaluationservice.getAssignmentassignedquestionby(jobid, cid, 'Assigned').subscribe(data => {
                this.evaluationAssignmentQuestionsList = data.Table;
                this.AssignedAssignmentConductedBy = data.Table2;
                if (data.Table1.length > 0) {
                    this.AssignedAssignmentscheduleon = data.Table1[0].InterviewDate;
                    this.AssignedAssignmentFrom = data.Table1[0].From;
                }
                for (let formModule of this.evaluationAssignmentQuestionsList) {
                    this.AssignmentSubmitedform.addControl(formModule.Id, new FormControl('', Validators.required))
                }
            });
        }
    }
    GetCandidateInfoByJobIdWithInterviewInfo(Cid: any) {
        
        this.hrStartTime = null;
        this.hrEndTime = null;
        this.showHrStartStopBtn = true;
        this.hrDuration = null;

        this.technicalStartTime = null;
        this.technicalEndTime = null;
        this.showTechnicalStartStopBtn = true;
        this.technicalDuration = null;

        this.assessmentEndTime = null;
        this.assessmentStartTime = null;
        this.showAssessmentStartStopBtn = true;
        this.assessmentDuration = null;

        this.assignmentStartTime = null;
        this.assignmentEndTime = null;
        this.showAssignmentStartStopBtn = true;
        this.assignmentDuration = null;

        this.managementStartTime = null;
        this.managementEndTime = null;
        this.showManagementStartStopBtn = true;
        this.managementDuration = null;

        this.SelectedCandidateId = Cid;
        let jobid = this.SelectedJobId;
        
        this.evaluationservice.GetCandidateInfoByJobIdWithInterviewInfo(jobid, Cid, this.userID).subscribe(data => {
            this.InterviewsList = [];
           
               if (data && data.Table.length > 0) {
                let hritem = data.Table.filter(x => x.InterviewType == 'HR');
                if (hritem.length != 0) {
                    this.InterviewsList.push(hritem[0]);
                    if (this.InterviewsList.filter(x => x.InterviewType == 'HR')[0].StartTime != null) {
                        this.hrStartTime = this.InterviewsList.filter(x => x.InterviewType == 'HR')[0].StartTime;
                        this.hrInterviewStarted = true;
                        this.hrInterviewStartbtnText = 'Stop';
                        if (this.InterviewsList.filter(x => x.InterviewType == 'HR')[0].EndTime != null) {
                            this.hrEndTime = this.InterviewsList.filter(x => x.InterviewType == 'HR')[0].EndTime;
                            this.hrDuration = this.InterviewsList.filter(x => x.InterviewType == 'HR')[0].Duration;
                            this.showHrStartStopBtn = false;
                        }
                        if(hritem.filter(x => x.InterviewType == 'HR')[0].InterviewerId != this.loggedInfo.id)
                        {
                            this.hrbtshowhide = true;
                        }
                        else{
                            this.hrbtshowhide = false;
                        }
                    }
                    else {
                        this.hrInterviewStarted = false;
                       
                        this.hrInterviewStartbtnText = 'Start';
                        if(hritem.filter(x => x.InterviewType == 'HR')[0].InterviewerId != this.loggedInfo.id)
                        {
                            this.hrbtshowhide = true;
                        }
                        else{
                            this.hrbtshowhide = false;
                        }
                    }
                }

                let technicalitem = data.Table.filter(x => x.InterviewType == 'Technical');
                
                if (technicalitem.length != 0) {
                    this.InterviewsList.push(technicalitem[0]);
                    if (this.InterviewsList.filter(x => x.InterviewType == 'Technical')[0].StartTime != null) {
                        this.technicalStartTime = this.InterviewsList.filter(x => x.InterviewType == 'Technical')[0].StartTime;
                        this.technicalInterviewStarted = true;
                        this.technicalInterviewStartbtnText = 'Stop';
                        if (this.InterviewsList.filter(x => x.InterviewType == 'Technical')[0].EndTime != null) {
                            this.technicalEndTime = this.InterviewsList.filter(x => x.InterviewType == 'Technical')[0].EndTime;
                            this.showTechnicalStartStopBtn = false;
                            this.technicalDuration = this.InterviewsList.filter(x => x.InterviewType == 'Technical')[0].Duration;

                        }
                        if(technicalitem.filter(x => x.InterviewType == 'Technical')[0].InterviewerId != this.loggedInfo.id)
                        {
                            this.Techbtshowhide = true;
                        }
                        else{
                            this.Techbtshowhide = false;
                        }
                    }
                    else {
                        this.technicalInterviewStarted = false;
                        this.technicalInterviewStartbtnText = 'Start';
                        //debugger;
                        if(technicalitem.filter(x => x.InterviewType == 'Technical')[0].InterviewerId != this.loggedInfo.id)
                        {
                            this.Techbtshowhide = true;
                        }
                        else{
                            this.Techbtshowhide = false;
                        }
                        
                    }
                }

                let assignmentitem = data.Table.filter(x => x.InterviewType == 'Assignment');
                if (assignmentitem.length != 0) {
                    this.InterviewsList.push(assignmentitem[0]);
                    if (this.InterviewsList.filter(x => x.InterviewType == 'Assignment')[0].StartTime != null) {
                        this.assignmentStartTime = this.InterviewsList.filter(x => x.InterviewType == 'Assignment')[0].StartTime;
                        this.assignmentInterviewStarted = true;
                        this.assignmentInterviewStartbtnText = 'Stop';
                        if (this.InterviewsList.filter(x => x.InterviewType == 'Assignment')[0].EndTime != null) {
                            this.assignmentEndTime = this.InterviewsList.filter(x => x.InterviewType == 'Assignment')[0].EndTime;
                            this.showAssignmentStartStopBtn = false;
                            this.assignmentDuration = this.InterviewsList.filter(x => x.InterviewType == 'Assignment')[0].Duration;

                        }
                        if(assignmentitem.filter(x => x.InterviewType == 'Assignment')[0].InterviewerId != this.loggedInfo.id)
                        {
                            this.assignbtshowhide = true;
                        }
                        else{
                            this.assignbtshowhide = false;
                        }
                    }
                    else {
                        this.assignmentInterviewStarted = false;
                        this.assignmentInterviewStartbtnText = 'Start';
                        if(assignmentitem.filter(x => x.InterviewType == 'Assignment')[0].InterviewerId != this.loggedInfo.id)
                        {
                            this.assignbtshowhide = true;
                        }
                        else{
                            this.assignbtshowhide = false;
                        }
                    }
                }

                let assessmentitem = data.Table.filter(x => x.InterviewType == 'Assessment');
                if (assessmentitem.length != 0) {
                    this.InterviewsList.push(assessmentitem[0]);
                    if (this.InterviewsList.filter(x => x.InterviewType == 'Assessment')[0].StartTime != null) {
                        this.assessmentStartTime = this.InterviewsList.filter(x => x.InterviewType == 'Assessment')[0].StartTime;
                        this.assessmentInterviewStarted = true;
                        this.assessmentInterviewStartbtnText = 'Stop';
                        if (this.InterviewsList.filter(x => x.InterviewType == 'Assessment')[0].EndTime != null) {
                            this.assessmentEndTime = this.InterviewsList.filter(x => x.InterviewType == 'Assessment')[0].EndTime;
                            this.showAssessmentStartStopBtn = false;
                            this.assessmentDuration = this.InterviewsList.filter(x => x.InterviewType == 'Assessment')[0].Duration;

                        }
                        if(assessmentitem.filter(x => x.InterviewType == 'Assessment')[0].InterviewerId != this.loggedInfo.id)
                        {
                            this.assessbtshowhide = true;
                        }
                        else{
                            this.assessbtshowhide = false;
                        }
                    }
                    else {
                        this.assessmentInterviewStarted = false;
                        this.assessmentInterviewStartbtnText = 'Start';
                        if(assessmentitem.filter(x => x.InterviewType == 'Assessment')[0].InterviewerId != this.loggedInfo.id)
                        {
                            this.assessbtshowhide = true;
                        }
                        else{
                            this.assessbtshowhide = false;
                        }
                    }
                }

                let managementitem = data.Table.filter(x => x.InterviewType == 'Management');
                //debugger;
                if (managementitem.length != 0) {
                    this.InterviewsList.push(managementitem[0]);
                    if (this.InterviewsList.filter(x => x.InterviewType == 'Management')[0].StartTime != null) {
                        this.managementStartTime = this.InterviewsList.filter(x => x.InterviewType == 'Management')[0].StartTime;
                        this.managementInterviewStarted = true;
                        this.managementInterviewStartbtnText = 'Stop';
                        if (this.InterviewsList.filter(x => x.InterviewType == 'Management')[0].EndTime != null) {
                            this.managementEndTime = this.InterviewsList.filter(x => x.InterviewType == 'Management')[0].EndTime;
                            this.showManagementStartStopBtn = false;
                            this.managementDuration = this.InterviewsList.filter(x => x.InterviewType == 'Management')[0].Duration;

                        }
                        if(managementitem.filter(x => x.InterviewType == 'Management')[0].InterviewerId != this.loggedInfo.id)
                        {
                            this.managebtshowhide = true;
                        }
                        else{
                            this.managebtshowhide = false;
                        }
                    }
                    else {
                        this.managementInterviewStarted = false;
                        this.managementInterviewStartbtnText = 'Start';
                        if(managementitem.filter(x => x.InterviewType == 'Management')[0].InterviewerId != this.loggedInfo.id)
                        {
                            this.managebtshowhide = true;
                        }
                        else{
                            this.managebtshowhide = false;
                        }
                        
                    }
                }
            }
            this.evaluationAssignmentPercentageval = 0;
            this.evaluationAssignmentQuestionsList = [];
            this.evaluationAssignmentTestStatus = '';
            this.evaluationAssessmentTestStatus = '';
            this.evaluationAssessmentQuestionsList = [];
            this.Percentageval = 0;
            if (data && data.Table2.length > 0) {
                this.evaluationAssignmentTestStatus = data.Table2[0].TestStatus;

                if (this.evaluationAssignmentTestStatus == 'Submitted' || this.evaluationAssignmentTestStatus == 'ScoreSubmitted' || this.evaluationAssignmentTestStatus == 'Completed') {
                    this.evaluationAssignmentQuestionsList = data.Table2;
                    this.evaluationAssignmentPercentageval = data.Table2[0].Score;

                }
            }
            if (data && data.Table1.length > 0) {
                this.evaluationAssessmentTestStatus = data.Table1[0].TestStatus;
                if (this.evaluationAssessmentTestStatus == 'Submitted' || this.evaluationAssessmentTestStatus == 'ScoreSubmitted' || this.evaluationAssessmentTestStatus == 'Completed') {
                    this.evaluationAssessmentQuestionsList = data.Table1;
                    this.Percentageval = data.Table1[0].Score;

                }
            }
        });
    }
    getquestionairebyselectassignmentlevelevent(level: any) {
        this.assignmentdefaultSkill = "";
        this.evaluationAssignmentQuestionsList = [];
        this.evaluationassignmentquestionsbyLevel = [];

        if (level == '') {
            this.evaluationassignmentquestionsbyLevel = [];
            this.evaluationAssessmentQuestionsList = [];
            this.assignmentdefaultSkill = "";
            Swal.fire(
                'Please Select Level',
                '',
                'success'
            );
        }
        if (level != 'Select') {

            var payLoad = {
                "Level": level

            }
            this.evaluationservice.getAssignmentquestionsbyLevel(payLoad.Level).subscribe(data => {
                this.evaluationassignmentquestionsbyLevel = [];
                this.evaluationAssignmentQuestionsList = [];
                this.assignmentdefaultSkill = "";
                this.evaluationassignmentquestionsbyLevel = data;
            });
        }
    }

    getquestionairebyselectassignmentskill(skill: any) {
        if (this.assignmentdefaultSkill == '') {
            Swal.fire(
                'Please Select Skill',
                '',
                'success'
            );
        }
        if (this.assignmentdefaultLevel != 'Select' && this.assignmentdefaultSkill != '') {
            this.getAssignmentquestionnaires(this.assignmentdefaultLevel, this.assignmentdefaultSkill);
        }
    }
    getAssignmentquestionnaires(lvl: any, skl: any) {
        if (lvl == 'Select') {
            Swal.fire(
                'Please Select Level',
                '',
                'success'
            );
        }

        if (this.assignmentdefaultSkill == '') {
            Swal.fire(
                'Please Select Skill',
                '',
                'success'
            );
        }
        var payLoad = {
            "Level": lvl,
            "Skills": skl,
            "CandidateId": this.candidateId,
            "JobId": this.defaultAction

            //"Level":"Lead",
            //"Skills":[".net", "angular"]
        }
        this.evaluationservice.getAssignmentquestionsbylvlandskill(payLoad).subscribe(data => {
            this.evaluationAssignmentQuestionsList = [];
            this.evaluationAssignmentQuestionsList = data.Table;
            this.evaluationAssignmentTestStatus = this.evaluationAssignmentQuestionsList[0].TestStatus;
        });
    }


    getquestionairebyselectlevelevent(level: any) {

        this.defaultSkill = "";
        this.evaluationAssessmentQuestionsList = [];
        this.evaluationassessmentquestionsbyLevel = [];

        if (level == '') {
            this.evaluationassessmentquestionsbyLevel = [];
            this.evaluationAssessmentQuestionsList = [];
            this.defaultSkill = "";
            Swal.fire(
                'Please Select Level',
                '',
                'success'
            );
        }
        if (level != 'Select') {

            var payLoad = {
                "Level": level

            }
            this.evaluationservice.getassessmentquestionsbyLevel(payLoad.Level).subscribe(data => {
                this.evaluationassessmentquestionsbyLevel = [];
                this.evaluationAssessmentQuestionsList = [];
                this.defaultSkill = "";
                this.evaluationassessmentquestionsbyLevel = data;
            });

            ///    this.getassessmentquestionnaires(level, this.defaultSkill);
        }
    }

    getquestionairebyselectskill(skill: any) {
        if (this.defaultSkill == '') {
            Swal.fire(
                'Please Select Skill',
                '',
                'success'
            );
        }
        if (this.defaultLevel != 'Select' && this.defaultSkill != '') {
            this.getassessmentquestionnaires(this.defaultLevel, this.defaultSkill);
        }
    }

    getassessmentquestionnaires(lvl: any, skl: any) {
        if (lvl == 'Select') {
            Swal.fire(
                'Please Select Level',
                '',
                'success'
            );
        }

        if (this.defaultSkill == '') {
            Swal.fire(
                'Please Select Skill',
                '',
                'success'
            );
        }
        var payLoad = {
            "Level": lvl,
            "Skills": skl,
            "CandidateId": this.candidateId,
            "JobId": this.defaultAction

            //"Level":"Lead",
            //"Skills":[".net", "angular"]
        }
        this.evaluationservice.getassessmentquestionsbylvlandskill(payLoad).subscribe(data => {
            this.evaluationAssessmentQuestionsList = [];
            this.evaluationAssessmentQuestionsList = data.Table;
            this.evaluationAssessmentTestStatus = this.evaluationAssessmentQuestionsList[0].TestStatus;
        });
    }

    AssignassessmentToCandidate() {

        // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/InterviewQuestionAnswersByCandidate', 
        this.http.post<any>(this.apiUrl + '/api/jobService/InterviewQuestionAnswersByCandidate',
            {
                CandidateId: this.candidateId,
                JobId: this.defaultAction,
                Skills: this.defaultSkill,
                Level: this.defaultLevel
            }
        ).subscribe(data => {
            this.evaluationAssessmentQuestionsList = [];
            this.IsAssessmentTestDonebyCandidate = true;
            Swal.fire(
                'Assigned Test to Candiate Successfully',
                '',
                'success'
            );
        });

    }

    AssignAssignmentToCandidate() {

        // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/AssignmentInterviewQuestionAnswersByCandidate', 
        this.http.post<any>(this.apiUrl + '/api/jobService/AssignmentInterviewQuestionAnswersByCandidate',
            {
                CandidateId: this.candidateId,
                JobId: this.defaultAction,
                Skills: this.assignmentdefaultSkill,
                Level: this.assignmentdefaultLevel
            }
        ).subscribe(data => {
            this.evaluationAssignmentQuestionsList = [];
            this.IsAssignmentTestDonebyCandidate = true;
            Swal.fire(
                'Assigned Test to Candiate Successfully',
                '',
                'success'
            );
        });

    }


    getcandidatealldetailsbycid(cid: any) {
        //debugger;
        this.isVisible = true;
        this.defaultSkill = "";
        this.defaultLevel = "Select";
        this.assignmentdefaultLevel = "Select";
        this.assignmentdefaultSkill = "";
        this.Percentageval = 0;
        this.JudgeforcandidateAssessmentResult = [];
        this.evaluationAssessmentQuestionsList = [];
        this.evaluationassessmentquestionsbyLevel = [];
        this.candidateId = cid;
        this.GetCandidateInfoByJobIdWithInterviewInfo(cid);
        this.getCandidateSheduleInterviewInfo();
        // //debugger;
        this._candidateidDashboard = cid;//40; //localStorage.getItem("_candidateidDashboard");
        if (this._candidateidDashboard != null && this._candidateidDashboard != "") {
            this.getcandidatedetailsbyid(this._candidateidDashboard);
            this.getresumeslist(this._candidateidDashboard);

            this.getacitivitieslist(this._candidateidDashboard);

            this.getgeneralresultbycandidateid(this._candidateidDashboard, this.SelectedJobId);
            this.GetCandidatesEvaluationInfo(this.SelectedJobId, this._candidateidDashboard);
            this.isVisible = false;
            //this.getcandidatedetailsbyid(this._candidateidDashboard);  //Same function called 2 times
            localStorage.setItem("_candidateprofilejobid", "");
            localStorage.setItem("_candidateidDashboard", "");

        }
        else {

            this.getcandidatedetailsbyid(cid);
            this.getresumeslist(cid);
            this.getacitivitieslist(cid);

            this.getgeneralresultbycandidateid(cid, this.SelectedJobId);
            this.GetCandidatesEvaluationInfo(this.SelectedJobId, this.candidateId);
            this.isVisible = false;
            this._candidateidDashboard = cid;

        }
    }

    showResult(id: any, jobid: any, type: any) {
        if (jobid != "Select") {
            this.evaluationservice.getgeneraltestresultby(id, jobid, this.userID).subscribe(data => {
                this.CandidateAssignmentResultList = data.Table2;
                if (type == "Assignment") {
                    let passMarks = 0;
                    for (let i = 0; i < this.CandidateAssignmentResultList.length; i++) {
                        if (this.CandidateAssignmentResultList[i].Result == "Pass") {
                            passMarks = passMarks + 1;
                        }
                    }
                    Swal.fire({
                        title: 'Your score is ' + passMarks + '/' + this.CandidateAssignmentResultList.length,
                        icon: 'success',
                        showDenyButton: false,
                        showCancelButton: false,
                        confirmButtonText: 'Ok',
                    })
                }
            });
        }
    }
    getgeneralresultbycandidateid(id: any, jobid: any) {
        if (jobid != "Select") {
            this.evaluationservice.getgeneraltestresultby(id, jobid, this.userID).subscribe(data => {
                this.HrPercentageval = 0;
                if (!data) {
                    return;
                }
                this.TechnicalPercentageval = 0;
                this.IsAnyInterviewRejected = false;
                this.ManagementPercentageval = 0;
                this.IsHrTestDonebyCandidate = false;
                this.IsTechnicalTestDonebyCandidate = false;
                this.IsManagementTestDonebyCandidate = false;
                if (data) {
                    this.CandidateEvalutionInterviewInfoList = data.Table1;
                }
                
                this.InterviewTotalScor = 0;
                if (this.CandidateEvalutionInterviewInfoList.length == 5) {
                    for (let i = 0; i < this.CandidateEvalutionInterviewInfoList.length; i++) {
                        this.InterviewTotalScor = this.InterviewTotalScor + this.CandidateEvalutionInterviewInfoList[i].RatingPercentage;
                        if (this.CandidateEvalutionInterviewInfoList[i].Status == "Rejected") {
                            this.defaultinterviewstagechange = 'Reject';
                        }
                    }
                    this.InterviewTotalScor = this.InterviewTotalScor / 5;
                }
                else {
                    for (let i = 0; i < this.CandidateEvalutionInterviewInfoList.length; i++) {
                        if (this.CandidateEvalutionInterviewInfoList[i].Status == "Rejected") {
                            this.defaultinterviewstagechange = 'Reject';
                        }
                    }
                }

                this.CandidateHrResultList = data.Table.filter(i => i.QuestionnaireType === 'HR');
                if (this.CandidateHrResultList.length > 0) {

                    this.IsHrTestDonebyCandidate = true;
                    this.HrPercentageval = this.CandidateHrResultList[0].Score;
                }
                this.CandidateTechnicalResultList = data.Table.filter(i => i.QuestionnaireType === 'Technical');
                if (this.CandidateTechnicalResultList.length > 0) {
                    this.IsTechnicalTestDonebyCandidate = true;
                    this.TechnicalPercentageval = this.CandidateTechnicalResultList[0].Score;
                }
                this.CandidateManagementResultList = data.Table.filter(i => i.QuestionnaireType === 'Management');
                if (this.CandidateManagementResultList.length > 0) {
                    this.IsManagementTestDonebyCandidate = true;
                    this.ManagementPercentageval = this.CandidateManagementResultList[0].Score;
                }
                this.CandidateAssignmentResultList = data.Table2;
                this.candidateAssessmentresultList = data.Table3;

                let _hrinterviewOn = data.Table1.filter(i => i.InterviewType == 'HR');
                if (_hrinterviewOn.length > 0) {
                    this.ScheduledHrInterviewon = _hrinterviewOn[0].InterviewDate;
                    this.TimeScheduledHrInterviewon = _hrinterviewOn[0].From;
                    this.RatingPercentageHrInterview = _hrinterviewOn[0].RatingPercentage;
                    this.ScheduledHrStatus = _hrinterviewOn[0].Status;
                    this.ScheduledHrStatusTime = _hrinterviewOn[0].StatusTime;
                }
                let _technicalinterviewOn = data.Table1.filter(i => i.InterviewType == 'Technical');
                if (_technicalinterviewOn.length > 0) {
                    this.ScheduledTechnicalInterviewon = _technicalinterviewOn[0].InterviewDate;
                    this.TimeScheduledTechnicalInterviewon = _technicalinterviewOn[0].From;
                    this.RatingPercentageTechnicalInterview = _technicalinterviewOn[0].RatingPercentage;
                    this.ScheduledTechnicalStatus = _technicalinterviewOn[0].Status;
                    this.ScheduledTechnicalStatusTime = _technicalinterviewOn[0].StatusTime;
                }
                let _managementinterviewOn = data.Table1.filter(i => i.InterviewType == 'Management');
                if (_managementinterviewOn.length > 0) {
                    this.ScheduledManagementInterviewon = _managementinterviewOn[0].InterviewDate;
                    this.TimeScheduledManagementInterviewon = _managementinterviewOn[0].From;
                    this.RatingPercentageManagementInterview = _managementinterviewOn[0].RatingPercentage;
                    this.ScheduledManagementStatus = _managementinterviewOn[0].Status;
                    this.ScheduledManagementStatusTime = _managementinterviewOn[0].StatusTime;
                }
                let _assessmentinterviewOn = data.Table1.filter(i => i.InterviewType == 'Assessment');
                if (_assessmentinterviewOn.length > 0) {
                    this.ScheduledAssessmentInterviewon = _assessmentinterviewOn[0].InterviewDate;
                    this.TimeScheduledAssessmentInterviewon = _assessmentinterviewOn[0].From;
                    this.RatingPercentageAssessmentInterview = _assessmentinterviewOn[0].RatingPercentage;
                    this.ScheduledAssessmentStatus = _assessmentinterviewOn[0].Status;
                    this.ScheduledAssessmentStatusTime = _assessmentinterviewOn[0].StatusTime;
                }
                let _assignmentinterviewOn = data.Table1.filter(i => i.InterviewType == 'Assignment');
                if (_assignmentinterviewOn.length > 0) {
                    this.ScheduledAssignmentInterviewon = _assignmentinterviewOn[0].InterviewDate;
                    this.TimeScheduledAssignmentInterviewon = _assignmentinterviewOn[0].From;
                    this.RatingPercentageAssignmentInterview = _assignmentinterviewOn[0].RatingPercentage;
                    this.ScheduledAssignmentStatus = _assignmentinterviewOn[0].Status;
                    this.ScheduledAssignmentStatusTime = _assignmentinterviewOn[0].StatusTime;
                }

                this.ConuductedByHrInterviews = data.Table4.filter(i => i.InterviewType == 'HR');
                this.ConuductedBTechnicalInterviews = data.Table4.filter(i => i.InterviewType == 'Technical');
                this.ConuductedByManagementInterviews = data.Table4.filter(i => i.InterviewType == 'Management');
                this.ConuductedByAssessmentInterviews = data.Table4.filter(i => i.InterviewType == 'Assessment');
                this.ConuductedByAssignmentInterviews = data.Table4.filter(i => i.InterviewType == 'Assignment');

                this.HrInterviewModes = data.Table5.filter(i => i.InterviewType == 'HR');
                this.TechnicalInterviewModes = data.Table5.filter(i => i.InterviewType == 'Technical');
                this.ManagementInterviewModes = data.Table5.filter(i => i.InterviewType == 'Management');
                this.AssessmentInterviewModes = data.Table5.filter(i => i.InterviewType == 'Assessment');
                this.AssignmentInterviewModes = data.Table5.filter(i => i.InterviewType == 'Assignment');

            });
        }
    }

    getInnerHTML(val) {
        if (val != null)
            return val.replace(/(<([^>]+)>)/ig, '');
    }
    selectedinterviewers(event) {
        this.selectedInterviewers = event.value;
    }
    getinterviewers() {
        // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/GetInterviewersList').subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/jobService/GetInterviewersList').subscribe(data => {
            this.interviewers = data.Table;

        });
    }

    GetCandidatesEvaluationInfo(JobId: any, CandidateId: any) {
        if (JobId != 'Select') {
            this.http.get<any>(this.apiUrl + '/api/candidateService/GetCandidatesEvaluationInfo?JobId=' + JobId + "&CandidateId=" + CandidateId).subscribe(data => {
                this.GetCandidatesEvaluationDetails = data.Table;

            });
        }
    }
    getInterviewMode() {
        this.http.get<any>(this.apiUrl + '/api/interviewService/getInterviewMode').subscribe(data => {
            this.InterviewMode = data.Table;

        });
    }

    openInterviewModal(templateRef: TemplateRef<any>) {
        const dialogRef = this.matdialog.open(templateRef, {
            width: '900px',
            height: '600px',
            autoFocus: false,
        });
        this.InterviewMessageBody = "Dear " + this.commonfieldName + "," + "\n\n" + " Your profile is selected for 'Advance' and please carry forward hiring process."
            + "\n" + "Link :" + "<a href='" + "https://atswebapi.azurewebsites.net/apps/candidate/edit-candidate/" + this.candidateId + "'>" +
            "https://atswebapi.azurewebsites.net/apps/candidate/edit-candidate/" + this.candidateId + "</a>" + "\n\n"
            + "Regards" + "\n" + this.hrRoleUsers[0].Name

    }

    ChangeInterviewType(selectvalue: any) {
        this.ModifyInterviewType = selectvalue;
    }
    ChangeInterviewMode(selectvalue: any) {
        this.ModifyInterviewMode = selectvalue;
    }
    TechnicalInterviewDate(selectvalue: any) {
        //debugger;
        this.SelectTechnicalInterviewDate = selectvalue;
    }
    InterviewTimeTo(selectvalue: any) {
        this.InterviewTimeToSelected = selectvalue;
    }

    InterviewTimeFrom(selectvalue: any) {
        this.InterviewTimeFromSelected = selectvalue;
    }

    interviewselectcall(selectvalue: any) {
        this.InterviewModeSelected = selectvalue;
    }

    inputEvent(event) {
        //this.SelectTechnicalInterviewDate = new Date(this.DatePipe.transform(event.value, 'dd/MM/yyyy'));
        this.SelectTechnicalInterviewDate = event.value;
    }
    changeEvent(event) {
        //debugger;
        this.changedDate = event.value;
        this.SelectTechnicalInterviewDate = event.value;
        const convertedDate = this.SelectTechnicalInterviewDate.setHours(23, 59, 59, 999);
       //this.SelectTechnicalInterviewDate = new Date(this.DatePipe.transform(event.value,'dd/MM/yyyy'));
    }

    // convertUatToDate(uatDate: string): Date {
    //     const uatDateObj = new Date(uatDate);
      
    //     // Get the time zone offset in minutes
    //     const timeZoneOffset = uatDateObj.getTimezoneOffset();
      
    //     // Adjust the date based on the time zone offset
    //     const convertedDate = new Date(uatDateObj.getTime() + (-timeZoneOffset * 60 * 1000));
      
    //     return convertedDate;
    //   }
    SubmitInterview() {
       // debugger;
        var dateTime = null;
        if (this.InterviewTimeType == 'PM') {
            if (this.InterviewTimeFromSelected!="")
            dateTime = new Date(new Date(this.changedDate).getFullYear(), new Date(this.changedDate).getMonth(), new Date(this.changedDate).getDate(), parseInt(this.InterviewTimeFromSelected.split(':')[0]) + 12, this.InterviewTimeFromSelected.split(':')[1], 0);
        }
        else {
            if (this.InterviewTimeFromSelected != "")
            dateTime = new Date(new Date(this.changedDate).getFullYear(), new Date(this.changedDate).getMonth(), new Date(this.changedDate).getDate(), this.InterviewTimeFromSelected.split(':')[0], this.InterviewTimeFromSelected.split(':')[1], 0);
        }
        if (dateTime < new Date()) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Please select valid date and time!',
            })
            return;
        }
        //debugger;
        this.CandidateEvalutionInterviewInfoList.forEach(element => {
            this.ConInterviewType = this.CandidateEvalutionInterviewInfoList.find(element => element.InterviewType == this.ModifyInterviewType);
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
        // this._fuseProgressBarService.hide();  remove later
        this.matdialog.closeAll();


    }
    SaveScheduleInterview() {
        //debugger;
        // this.spinnerService.show();
        //this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/interviewService/SaveScheduleInterview', {
        this.http.post<any>(this.apiUrl + '/api/interviewService/SaveScheduleInterview', {
            // this.http.post<any>('http://localhost:50274/api/interviewService/SaveScheduleInterview', {
            CandidateId: this.candidateId,
            JobId: this.SelectedJobId,
            InterviewType: this.ModifyInterviewType,
            CreatedBy: this.userID,
            interviewModel: this.ModifyInterviewMode,
           // InterviewDate: new Date(this.SelectTechnicalInterviewDate),
            InterviewDate: this.SelectTechnicalInterviewDate,
            To: this.InterviewTimeToSelected,
            From: this.InterviewTimeFromSelected,
            Interviewer: this.ModifyInterviewers,
            SendEmailToInterviewer: true,
            SendEmailToCandidate: true,
            Status: true,
            TimeType: this.InterviewTimeType,
            Message: this.InterviewMessageBody

        }).subscribe(data => {
            //debugger;
            this.selectedRowsCnt = 0;
            Swal.fire(
                'Schedule Interview Saved successfully!',
                '',
                'success'
            );

            this.ModifyInterviewMode = "";
            this.SelectTechnicalInterviewDate = "";
            this.InterviewTimeToSelected = "";
            this.ModifyInterviewFrom = "";
            this.ModifyInterviewers = "";
            this.matdialog.closeAll();
            // this._fuseProgressBarService.hide();  remove later
            this.getcandidatealldetailsbycid(this.candidateId);
            this.ModifyInterviewType = "";
        });
        // this.spinnerService.hide();
    }

    getassignmentresultbycandidateid(id: any, jobid: any) {
        this.evaluationservice.getassignmentresultlist(id, jobid).subscribe(data => {
            this.CandidateAssignmentResultList = data.Table;
        });
    }
    getassessmentresultbycandidateid(id: any, jobid: any) {
        this.evaluationservice.getassessmentresultlist(id, jobid).subscribe(data => {
            this.candidateAssessmentresultList = data.Table;
        });
    }
    sortChanged(event) {
        this.SelectedJobId;
        this.isVisible = false;
        if (event.value === 'Name')
            this.selectSortBy = event.value;
        else if (event.value === 'NewesttoOldest')
            this.selectSortBy = 'Newest to Oldest';
        else if (event.value === 'OldesttoNewest')
            this.selectSortBy = 'Oldest to Newest';
    }
    getcandidatedetailsbyid(cid: any) {

        this.isVisible = true;
        if (cid != null && cid != 0) {
            this.candidateservice.getByCandidateId(cid).subscribe(data => {

                this.candidateData[0] = data['$values'][0];
                this.commonfieldName = this.candidateData[0].name;
                this.commonfieldDesignation = this.candidateData[0].designation;
                this.commonfieldCompany = this.candidateData[0].currentEmployer;
                this.commonfieldEmail = this.candidateData[0].email;
                this.commonfieldMobile = this.candidateData[0].mobileNumber;
                this.commonfieldLocation = this.candidateData[0].location;

                this.PresentJobId = this.SelectedJobId;
                this.PresentCandidaiteId = cid;
            });
        }
        this.isVisible = false;
    }

    getresumeslist(cid: any) {
        var CandidateidpayLoad = {
            id: cid,
        }
        this.candidateservice.getResumesByCandidateId(CandidateidpayLoad).subscribe(res => {
            this.resumeList = [];
            this.resumeList = res;
            this.IsPdf = false;
            this.IsDoc = false;
            this.resumeselectedFiles = [];
            if (this.resumeList.length > 0) {
                this.selectCurrentResume = this.resumeList[0].ResumeName;
                let extension = this.resumeList[0].ResumeName.split('.')[1];
                if (extension == "pdf") {
                    this.IsPdf = true;
                    this.filepath = this.sanitizer.bypassSecurityTrustResourceUrl(this.resumeList[0].ResumePath);
                }
                else {
                    this.IsDoc = true;
                    this.docpath = this.sanitizer.bypassSecurityTrustResourceUrl("https://docs.google.com/gview?url=" + this.resumeList[0].ResumePath + "&embedded=true");
                }
                this.isVisible = false;
            }
        });
    }

    getMessage(candidateID: any, UserId: any) {
        // debugger;
        if (!this.SelectedJobId) { return; }
        this.candidateServices.getMessage(candidateID, UserId,this.SelectedJobId).subscribe(msg => {
            //debugger;
            this.CandidateMessage = msg.Table;
            this.CandidateUnReadMsg = msg.Table1[0].UnReadMsg;
        });
    }
    MessageTabClicked() {
        //debugger;
        if (this.loggedInfo.role == "Candidate") {
            this.candidateServices.updateMessage(this.candidateId, null).subscribe(msg => {
                this.candidateServices.getMessage(this.candidateId, null,this.SelectedJobId).subscribe(msg => {
                   this.CandidateMessage = msg.Table;
                   this.CandidateUnReadMsg = msg.Table1[0].UnReadMsg;
                });
            })
             //this.getMessage(this.candidateId, null);
        }
        else {
            //debugger
            this.candidateServices.updateMessage(this.candidateId, this.loggedInfo.id).subscribe(msg => {
                this.candidateServices.getMessage(this.candidateId, this.loggedInfo.id,this.SelectedJobId).subscribe(msg => {
                   this.CandidateMessage = msg.Table;
                   this.CandidateUnReadMsg = msg.Table1[0].UnReadMsg;
                });
            })
             //this.getMessage(this.candidateId, this.loggedInfo.id);
        }
    }

    onSubmit() {
        var payLoad = {
            CandidateId: this.candidateId,
            Messages: this.InputMessage,
            UserId: this.loggedInfo.id
        }

        if (this.loggedInfo.role == "Candidate") {
            // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/CreateMessage', {
            this.http.post<any>(this.apiUrl + '/api/candidateService/CreateMessage', {
                CandidateId: this.candidateId,
                Messages: this.InputMessage,
                UserId: null,
                JobId: this.SelectedJobId
            }).subscribe(data => {
                this.InputMessage = "";
                this.getMessage(this.candidateId, this.loggedInfo.id);
            });
        }
        else {
            // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/CreateMessage', {
            this.http.post<any>(this.apiUrl + '/api/candidateService/CreateMessage', {
                CandidateId: this.candidateId,
                Messages: this.InputMessage,
                UserId: this.loggedInfo.id,
                JobId: this.SelectedJobId
            }).subscribe(data => {
                //     this.isVisible = true;

                this.InputMessage = "";
                this.getMessage(this.candidateId, this.loggedInfo.id);
            });
        }
    }

    getacitivitieslist(cid: any) {
       //debugger;
        this.isVisible = true;
        if (this.SelectedJobId != undefined && this.SelectedJobId != null) {
            this.candidateservice.getCandidateActivitiesbyId(cid, this.SelectedJobId, this.userID).subscribe(data => {
                this.candidateActivitiesList = data.$values;
                var groups = new Set(this.candidateActivitiesList.map(item => item.createdBy)),
                    results = [];
                groups.forEach(g =>
                    results.push({
                        name: g,
                        values: this.candidateActivitiesList.filter(i => i.createdBy === g)
                    }
                    ))
                this.isVisible = false;
            });
        }
    }
    video() {
        console.log('im Play!');
        this.videoplayer.nativeElement.Play();
    }
    onRatingChanged(rating) {
        this.rating = rating;
    }

    formatString(val) {
        return val.toString();
    }
    selectresultchecked(event: any, questionid: any, SelectedJobId: any, CandidateId: any, Result: any) {
        let selectedvalue = event.value;   //passing candidateid,questionid,selected option from UI.
        let qid = questionid;
        let candidateAssessmentResult = CandidateId + ',' + SelectedJobId + ',' + questionid + ',' + Result + ',' + this.userName + ',' + this.userID;

        if (this.JudgeforcandidateAssessmentResult.length == 0) {
            this.JudgeforcandidateAssessmentResult.push(selectedvalue);
            this.candidateAssessmentResultList.push(candidateAssessmentResult);
        }
        else {
            this.JudgeforcandidateAssessmentResult.forEach((element, index) => {
                let getqidofeach = element.split(',')[1];
                if (qid == getqidofeach) {
                    delete this.JudgeforcandidateAssessmentResult[index];
                }
            })
            this.JudgeforcandidateAssessmentResult.push(selectedvalue);

            this.candidateAssessmentResultList.push(candidateAssessmentResult);
        }
        this.calculatescore();
    }

    calculatescore() {
        let passcount = 0;
        this.Percentageval = 0;

        this.JudgeforcandidateAssessmentResult.forEach((element, index) => {
            let result = element.split(',')[0];
            if (result == "Pass") {
                passcount = passcount + 1;
            }
        })

        let noofquestions = 100 / this.evaluationAssessmentQuestionsList.length;
        this.Percentageval = passcount * noofquestions;
    }
    selectanswerchecked(event: any, itemid: any) {
        //debugger;
        //let selectedvalue = event.target.defaultValue;   //passing candidateid,questionid,selected option from UI.
        let qid = itemid;
        let selectedvalue = event.value + "," + this.userName + "," + this.userID;
        if (this.SelectedAssignmentAnswers.length == 0) {
            this.SelectedAssignmentAnswers.push(selectedvalue);
        }
        else {
            this.SelectedAssignmentAnswers.forEach((element, index) => {
                let getqidofeach = element.split(',')[2];
                if (qid == getqidofeach) {
                    delete this.SelectedAssignmentAnswers[index];
                }
            })
            this.SelectedAssignmentAnswers.push(selectedvalue)
        }

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
        let cid = this.candidateId;
        //this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/GetJobDetailsbyJobCandaiateId?JobId=' + id +'&CandidateId='+ cid).subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/jobService/GetJobDetailsbyJobCandaiateId?JobId=' + id + '&CandidateId=' + cid).subscribe(data => {
            this.jobDetails = data.Table;
            this.Benefits = data.Table6;
            this.FArea = data.Table2;
            this.Industries = data.Table1;
            this.Skills = data.Table4;
            this.Salary = data.Table8;
            this.JobType = data.Table5;
        });
    }
    cancelAssignmentPaper() {
        this.SelectedAssignmentAnswers = [];
        this.AssignmentQuestionsList = [];
        this.evaluationservice.getassignmentquestions().subscribe(data => {
            this.AssignmentQuestionsList = data;
            this.NoofQuestions = this.AssignmentQuestionsList.length;
        });
    }

    SubmitAssignmentPaper() {
        //debugger;
        //this._fuseProgressBarService.show();
        var payLoad = this.SelectedAssignmentAnswers;
        //this.http.post("https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/CreateCandidateToAssignment", payLoad, {
        this.http.post(this.apiUrl + "/api/candidateService/CreateCandidateToAssignment", payLoad, {
        }).subscribe(data => {
            Swal.fire(
                'Assignment Submitted successfully!',
                '',
                'success'
            );
            //this._fuseProgressBarService.hide();
            this.IsAssignmentTestDonebyCandidate = true;
            this.showResult(this.candidateId, this.selectappliedjob, "Assignment");
        });
        this.SelectedAssignmentAnswers = [];
        //this.AssignmentQuestionsList=[];

    }
    cancelAssessmentPaper() {
        //this.assessmentform.reset();
    }
    AddEditSelectHrRating(val: any, qid: any) {
        //let hrrating = this.candidateId+','+qid+','+this.selectappliedjob+','+val + ',' + 'HR';
        let hrrating = this.PresentCandidaiteId + ',' + qid + ',' + this.PresentJobId + ',' + val + ',' + 'HR' + ',' + this.userName + ',' + this.userID;
        if (this.savehrratingvaluesarray.length == 0) {
            this.savehrratingvaluesarray.push(hrrating);
        }
        else {
            this.savehrratingvaluesarray.forEach((element, index) => {
                let getqidofeach = element.split(',')[1];
                if (qid == getqidofeach) {
                    //delete this.savehrratingvaluesarray[index];
                    this.savehrratingvaluesarray.splice(index, 1);
                }
            })
            this.savehrratingvaluesarray.push(hrrating)
        }
        this.calculateHrScore();
    }
    calculateHrScore() {
        let passcount = 0;
        this.HrPercentageval = 0;

        this.savehrratingvaluesarray.forEach((element, index) => {
            let result = Number(element.split(',')[3]);
            passcount = passcount + result;
        })

        let noofquestions = this.savehrratingvaluesarray.length * 5;
        this.HrPercentageval = (passcount / noofquestions) * 100;
    }

    AddEditSelectTechnicalRating(val: any, qid: any) {
        //let technicalrating = this.candidateId+','+qid+','+this.selectappliedjob+','+val + ',' + 'Technical';
        let technicalrating = this.PresentCandidaiteId + ',' + qid + ',' + this.PresentJobId + ',' + val + ',' + 'Technical' + ',' + this.userName + ',' + this.userID;
        //this.savetechnicalratingvaluesarray.push(technicalrating);
        if (this.savetechnicalratingvaluesarray.length == 0) {
            this.savetechnicalratingvaluesarray.push(technicalrating);
        }
        else {
            this.savetechnicalratingvaluesarray.forEach((element, index) => {
                let getqidofeach = element.split(',')[1];
                if (qid == getqidofeach) {
                    //delete this.savetechnicalratingvaluesarray[index];
                    this.savetechnicalratingvaluesarray.splice(index, 1);
                }
            })
            this.savetechnicalratingvaluesarray.push(technicalrating)
        }
        this.calculateTechnicalScore();
    }

    calculateTechnicalScore() {
        let passcount = 0;
        this.TechnicalPercentageval = 0;

        this.savetechnicalratingvaluesarray.forEach((element, index) => {
            let result = Number(element.split(',')[3]);
            passcount = passcount + result;
        })

        let noofquestions = this.savetechnicalratingvaluesarray.length * 5;
        this.TechnicalPercentageval = (passcount / noofquestions) * 100;
    }
    AddEditSelectManagementRating(val: any, qid: any) {
        //let managementrating = this.candidateId+','+qid+','+this.selectappliedjob+','+val + ',' + 'Management';
        let managementrating = this.PresentCandidaiteId + ',' + qid + ',' + this.PresentJobId + ',' + val + ',' + 'Management' + ',' + this.userName + ',' + this.userID;
        //this.savemanagementratingvaluesarray.push(managementrating);
        if (this.savemanagementratingvaluesarray.length == 0) {
            this.savemanagementratingvaluesarray.push(managementrating);
        }
        else {
            this.savemanagementratingvaluesarray.forEach((element, index) => {
                let getqidofeach = element.split(',')[1];
                if (qid == getqidofeach) {
                    //delete this.savemanagementratingvaluesarray[index];
                    this.savemanagementratingvaluesarray.splice(index, 1);
                }
            })
            this.savemanagementratingvaluesarray.push(managementrating)
        }
        this.calculateManagementScore();
    }

    calculateManagementScore() {
        let passcount = 0;
        this.ManagementPercentageval = 0;

        this.savemanagementratingvaluesarray.forEach((element, index) => {
            let result = Number(element.split(',')[3]);
            passcount = passcount + result;
        })

        let noofquestions = this.savemanagementratingvaluesarray.length * 5;
        this.ManagementPercentageval = (passcount / noofquestions) * 100;
    }

    StartHrInterview(event, SelectedCandidateId) {
        if (event.currentTarget.innerText == 'Start') {
            event.currentTarget.innerText = 'Stop';
            document.getElementById('hrInterviewStartTimer_' + this.SelectedCandidateId).innerText = "Start Time : " + new Date().toLocaleTimeString();
            var payLoad = {
                CandidateId: this.SelectedCandidateId,
                JobId: this.SelectedJobId,
                Type: 'HR',
                StartHour: new Date().getHours(),
                StartMinutes: new Date().getMinutes(),
                StartSeconds: new Date().getSeconds()
            };
            // this.http.post("https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/StartCandidateInterview", payLoad, {
            this.http.post(this.apiUrl + "/api/candidateService/StartCandidateInterview", payLoad, {
            }).subscribe(data => {
            });
        }
        else if (event.currentTarget.innerText == 'Stop') {
            this.showHrStartStopBtn = false;
            document.getElementById('hrInterviewEndTimer_' + this.SelectedCandidateId).innerText = "End Time : " + new Date().toLocaleTimeString();
            var dataLoad = {
                CandidateId: this.SelectedCandidateId,
                JobId: this.SelectedJobId,
                Type: 'HR',
                EndHour: new Date().getHours(),
                EndMinutes: new Date().getMinutes(),
                EndSeconds: new Date().getSeconds()
            };
            // this.http.post("https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/EndCandidateInterview", dataLoad, {
            this.http.post(this.apiUrl + "/api/candidateService/EndCandidateInterview", dataLoad, {
            }).subscribe(data => {
                this.GetCandidateInfoByJobIdWithInterviewInfo(this.SelectedCandidateId);

            });
        }
    }

    StartManagementInterview(event, SelectedCandidateId) {
        if (event.currentTarget.innerText == 'Start') {
            event.currentTarget.innerText = 'Stop';
            document.getElementById('managementInterviewStartTimer_' + this.SelectedCandidateId).innerText = "Start Time : " + new Date().toLocaleTimeString();
            var payLoad = {
                CandidateId: this.SelectedCandidateId,
                JobId: this.SelectedJobId,
                Type: 'Management',
                StartHour: new Date().getHours(),
                StartMinutes: new Date().getMinutes(),
                StartSeconds: new Date().getSeconds()
            };
            // this.http.post("https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/StartCandidateInterview", payLoad, {
            this.http.post(this.apiUrl + "/api/candidateService/StartCandidateInterview", payLoad, {
            }).subscribe(data => {
            });
        }
        else if (event.currentTarget.innerText == 'Stop') {
            this.showManagementStartStopBtn = false;
            document.getElementById('managementInterviewEndTimer_' + this.SelectedCandidateId).innerText = "End Time : " + new Date().toLocaleTimeString();
            var dataLoad = {
                CandidateId: this.SelectedCandidateId,
                JobId: this.SelectedJobId,
                Type: 'Management',
                EndHour: new Date().getHours(),
                EndMinutes: new Date().getMinutes(),
                EndSeconds: new Date().getSeconds()
            };
            //this.http.post("https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/EndCandidateInterview", dataLoad, {
            this.http.post(this.apiUrl + "/api/candidateService/EndCandidateInterview", dataLoad, {
            }).subscribe(data => {
                this.GetCandidateInfoByJobIdWithInterviewInfo(this.SelectedCandidateId);

            });
        }

    }
    StartAssessmentInterview(event, SelectedCandidateId) {
        if (event.currentTarget.innerText == 'Start') {
            event.currentTarget.innerText = 'Stop';
            document.getElementById('assessmentInterviewStartTimer_' + this.SelectedCandidateId).innerText = "Start Time : " + new Date().toLocaleTimeString();
            var payLoad = {
                CandidateId: this.SelectedCandidateId,
                JobId: this.SelectedJobId,
                Type: 'Assessment',
                StartHour: new Date().getHours(),
                StartMinutes: new Date().getMinutes(),
                StartSeconds: new Date().getSeconds()
            };
            //this.http.post("https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/StartCandidateInterview", payLoad, {
            this.http.post(this.apiUrl + "/api/candidateService/StartCandidateInterview", payLoad, {
            }).subscribe(data => {
            });
        }
        else if (event.currentTarget.innerText == 'Stop') {
            this.showAssessmentStartStopBtn = false;
            document.getElementById('assessmentInterviewEndTimer_' + this.SelectedCandidateId).innerText = "End Time : " + new Date().toLocaleTimeString();
            var dataLoad = {
                CandidateId: this.SelectedCandidateId,
                JobId: this.SelectedJobId,
                Type: 'Assessment',
                EndHour: new Date().getHours(),
                EndMinutes: new Date().getMinutes(),
                EndSeconds: new Date().getSeconds()
            };
            // this.http.post("https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/EndCandidateInterview", dataLoad, {
            this.http.post(this.apiUrl + "/api/candidateService/EndCandidateInterview", dataLoad, {
            }).subscribe(data => {
                this.GetCandidateInfoByJobIdWithInterviewInfo(this.SelectedCandidateId);

            });
        }

    }
    StartAssignmentInterview(event, SelectedCandidateId) {
        if (event.currentTarget.innerText == 'Start') {
            event.currentTarget.innerText = 'Stop';
            document.getElementById('assignmentInterviewStartTimer_' + this.SelectedCandidateId).innerText = "Start Time : " + new Date().toLocaleTimeString();
            var payLoad = {
                CandidateId: this.SelectedCandidateId,
                JobId: this.SelectedJobId,
                Type: 'Assignment',
                StartHour: new Date().getHours(),
                StartMinutes: new Date().getMinutes(),
                StartSeconds: new Date().getSeconds()
            };
            //this.http.post("https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/StartCandidateInterview", payLoad, {
            this.http.post(this.apiUrl + "/api/candidateService/StartCandidateInterview", payLoad, {
            }).subscribe(data => {
            });
        }
        else if (event.currentTarget.innerText == 'Stop') {
            this.showAssignmentStartStopBtn = false;
            document.getElementById('assignmentInterviewEndTimer_' + this.SelectedCandidateId).innerText = "End Time : " + new Date().toLocaleTimeString();
            var dataLoad = {
                CandidateId: this.SelectedCandidateId,
                JobId: this.SelectedJobId,
                Type: 'Assignment',
                EndHour: new Date().getHours(),
                EndMinutes: new Date().getMinutes(),
                EndSeconds: new Date().getSeconds()
            };
            // this.http.post("https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/EndCandidateInterview", dataLoad, {
            this.http.post(this.apiUrl + "/api/candidateService/EndCandidateInterview", dataLoad, {
            }).subscribe(data => {
                this.GetCandidateInfoByJobIdWithInterviewInfo(this.SelectedCandidateId);

            });
        }

    }
    StartTechnicalInterview(event, SelectedCandidateId) {
        if (event.currentTarget.innerText == 'Start') {
            event.currentTarget.innerText = 'Stop';
            document.getElementById('technicalInterviewStartTimer_' + this.SelectedCandidateId).innerText = "Start Time : " + new Date().toLocaleTimeString();
            var payLoad = {
                CandidateId: this.SelectedCandidateId,
                JobId: this.SelectedJobId,
                Type: 'Technical',
                StartHour: new Date().getHours(),
                StartMinutes: new Date().getMinutes(),
                StartSeconds: new Date().getSeconds()
            };
            // this.http.post("https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/StartCandidateInterview", payLoad, {
            this.http.post(this.apiUrl + "/api/candidateService/StartCandidateInterview", payLoad, {
            }).subscribe(data => {
            });
        }
        else if (event.currentTarget.innerText == 'Stop') {
            this.showTechnicalStartStopBtn = false;
            document.getElementById('technicalInterviewEndTimer_' + this.SelectedCandidateId).innerText = "End Time : " + new Date().toLocaleTimeString();
            var dataLoad = {
                CandidateId: this.SelectedCandidateId,
                JobId: this.SelectedJobId,
                Type: 'Technical',
                EndHour: new Date().getHours(),
                EndMinutes: new Date().getMinutes(),
                EndSeconds: new Date().getSeconds()
            };
            // this.http.post("https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/EndCandidateInterview", dataLoad, {
            this.http.post(this.apiUrl + "/api/candidateService/EndCandidateInterview", dataLoad, {
            }).subscribe(data => {
                this.GetCandidateInfoByJobIdWithInterviewInfo(this.SelectedCandidateId);

            });
        }

    }

    SubmitHRInterview() {
        debugger;
        // this._fuseProgressBarService.show();
        let hrquestionswithscore = [];
        if (this.savehrratingvaluesarray.length > 0) {
            this.savehrratingvaluesarray.forEach((element, index) => {
                element = element + ',' + this.HrPercentageval;
                hrquestionswithscore.push(element);
            });
        }
        var payLoad = hrquestionswithscore;
        //this.http.post("https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/CreateCandidateGeneralTestResult", payLoad, {
        this.http.post(this.apiUrl + "/api/candidateService/CreateCandidateGeneralTestResult", payLoad, {
        }).subscribe(data => {
            Swal.fire(
                'Hr interview Submitted successfully!',
                '',
                'success'
            );
            //  this._fuseProgressBarService.hide();
            this.IsHrTestDonebyCandidate = true;
        });

    }
    SubmitTechnicalInterview() {
        // this._fuseProgressBarService.show();
        let technicalquestionswithscore = [];
        if (this.savetechnicalratingvaluesarray.length > 0) {
            this.savetechnicalratingvaluesarray.forEach((element, index) => {
                element = element + ',' + this.TechnicalPercentageval;
                technicalquestionswithscore.push(element);
            });
        }
        var payLoad = technicalquestionswithscore;

        //this.http.post("https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/CreateCandidateGeneralTestResult", payLoad, {
        this.http.post(this.apiUrl + "/api/candidateService/CreateCandidateGeneralTestResult", payLoad, {
        }).subscribe(data => {
            Swal.fire(
                'Technical interview Submitted successfully!',
                '',
                'success'
            );
            //  this._fuseProgressBarService.hide();
            this.IsTechnicalTestDonebyCandidate = true;
        });

        this.savetechnicalratingvaluesarray = [];
    }
    SubmitManagementInterview() {
        // this._fuseProgressBarService.show();
        let managementquestionswithscore = [];
        if (this.savemanagementratingvaluesarray.length > 0) {
            this.savemanagementratingvaluesarray.forEach((element, index) => {
                element = element + ',' + this.ManagementPercentageval;
                managementquestionswithscore.push(element);
            });
        }
        var payLoad = managementquestionswithscore;

        //this.http.post("https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/CreateCandidateGeneralTestResult", payLoad, {
        this.http.post(this.apiUrl + "/api/candidateService/CreateCandidateGeneralTestResult", payLoad, {}).subscribe(data => {
            Swal.fire(
                'Management interview Submitted successfully!',
                '',
                'success'
            );
            //  this._fuseProgressBarService.hide();
            this.IsManagementTestDonebyCandidate = true;
        });

        this.savemanagementratingvaluesarray = [];
    }
    SubmitAssessmentPaper() {
        // this._fuseProgressBarService.show();
        for (let i = 0; i < this.AssignedAssessmentQuestions.length; i++) {
            let cid = this.candidateId;
            let jid = this.selectappliedjob;
            let qid = this.AssignedAssessmentQuestions[i].Id;
            let answer = this.assessmentSubmitedform.get(qid.toString()).value;
            let input = jid + ',' + cid + ',' + qid + ',' + answer + ',' + 'Assessment' + ',' + this.userName + ',' + this.userID;
            this.saveassessmentvaluesarray.push(input.toString());
        }

        var payLoad = this.saveassessmentvaluesarray;
        // this.http.post("https://hiringmanagerwebapi.azurewebsites.net/api/jobService/SubmittedCandidateTestQuestion", payLoad, {
        this.http.post(this.apiUrl + "/api/jobService/SubmittedCandidateTestQuestion", payLoad, {
        }).subscribe(data => {
            Swal.fire(
                'Assessment Submitted successfully!',
                '',
                'success'
            );
            // this._fuseProgressBarService.hide();
            this.IsAssessmentTestDonebyCandidate = true;
        });

    }
    SaveAssessmentPaper() {
        // this._fuseProgressBarService.show();
        if (this.candidateAssessmentResultList.length > 0) {
            this.candidateAssessmentResultList.forEach((element, index) => {
                element = element + ',' + this.Percentageval;
                this.scoreappendtoassessmentquestionslist.push(element);
            });
        }
        var payLoad = this.scoreappendtoassessmentquestionslist;
        //this.http.post("https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/SaveCandidateToAssessment", payLoad, {
        this.http.post(this.apiUrl + "/api/candidateService/SaveCandidateToAssessment", payLoad, {
        }).subscribe(data => {
            Swal.fire(
                'Assessment Submitted successfully!',
                '',
                'success'
            );
            //  this._fuseProgressBarService.hide();
            this.getcandidatealldetailsbycid(this.candidateId);
        });
    }

    GetCandidatebyJobId(id: any) {
        //debugger;
        this.defaultSkill = "";
        this.defaultLevel = "Select";
        this.assignmentdefaultSkill = "";
        this.assignmentdefaultLevel = "Select";
        this.Percentageval = 0;
        this.JudgeforcandidateAssessmentResult = [];
        this.evaluationAssessmentQuestionsList = [];
        this.evaluationAssignmentQuestionsList = [];
        this.evaluationassessmentquestionsbyLevel = [];
        this.SelectedJobId = id;
        this.AppliedCandidate = [];
        //debugger;
        if (id != null && id != "" && id != undefined) {
            // debugger
            this.evaluationservice.getappliedcandidatesbyjobid(id).subscribe(data => {
                // debugger;
                this.isVisible = false;

                this.AppliedCandidate = data.Table;
                //  debugger;
                if (this.AppliedCandidate.length != 0) {
                    this.isVisible = false;
                    let cid = data.Table[0].CandidateId;
                    if (cid != 0 && cid != null) {
                        this.getcandidatealldetailsbycid(cid);
                        //this.GetCandidatesEvaluationInfo(this.SelectedJobId, cid);
                    }
                    if (!this.IsCandidate) {
                        for (let index = 0; index < 1; index++) {

                            this.candidateData[0] = this.AppliedCandidate[index];
                            this.commonfieldName = this.candidateData[0].CandidateName == null ? "" : this.candidateData[0].CandidateName;
                            this.commonfieldDesignation = this.candidateData[0].Designation == null ? "" : this.candidateData[0].Designation;
                            this.commonfieldCompany = this.candidateData[0].CurrentEmployer == undefined ? "" : this.candidateData[0].CurrentEmployer;
                            this.commonfieldEmail = this.candidateData[0].Email == undefined ? "" : this.candidateData[0].Email;
                            this.commonfieldMobile = this.candidateData[0].MobileNumber == undefined ? "" : this.candidateData[0].MobileNumber;
                            this.commonfieldLocation = this.candidateData[0].Location == undefined ? "" : this.candidateData[0].Location;
                            this.PresentJobId = this.SelectedJobId;
                            this.PresentCandidaiteId = this.candidateData[0].CandidateId;
                        }
                        this.isVisible = false;
                    }

                    let candidateidfromcandiateprofile = data.Table[0].CandidateId; //localStorage.getItem("_candidateprofilecandidateid");

                    // if(candidateidfromcandiateprofile!="")
                    if (candidateidfromcandiateprofile != null && candidateidfromcandiateprofile != 0) {
                        this.isVisible = false;
                        this.AppliedCandidateDummy = this.AppliedCandidate;

                        //this.getfindcandidaterecord = data.Table.filter(element => element.CandidateId === Number(candidateidfromcandiateprofile));
                        //data.Table[0].filter(element => element.Id === Number(candidateidfromcandiateprofile));

                        cid = data.Table[0].CandidateId//this.getfindcandidaterecord[0].Id;

                        //localStorage.setItem("_candidateprofilecandidateid", "");
                    }

                    this.isVisible = false;
                }
            },
                error => {
                    console.log("");
                    //this.errors = error;
                });
        }
        this.isVisible = false;
    }
    GetCandidatebyJobIdSortBy(SortBy: any) {

        this.AppliedCandidate = [];
        this.evaluationservice.getappliedcandidatesbyjobidSortBy(this.SelectedJobId, SortBy.value).subscribe(data => {

            this.AppliedCandidate = data.candidates;

        });
    }

    GetInterviewtasksbyJobId(id: any) {
        //debugger;
        this.isVisible = true;
        let candidateid = this.candidateId; //getting from loggedInfo.candidateId = 1; //
        let jobid = id;
        this.selectappliedjob = jobid;
        this.SelectedJobId = id;
        this.evaluationservice.GetCandidateInfoByJobIdWithInterviewInfo(jobid, candidateid, this.userID).subscribe(data => {

            this.InterviewsList = [];

            if (data) {
                if (data.Table.length > 0) {
                    let hritem = data.Table.filter(x => x.InterviewType == 'HR');
                    if (hritem.length != 0)
                        this.InterviewsList.push(hritem[0]);

                    let technicalitem = data.Table.filter(x => x.InterviewType == 'Technical');
                    if (technicalitem.length != 0)
                        this.InterviewsList.push(technicalitem[0]);

                    let assignmentitem = data.Table.filter(x => x.InterviewType == 'Assignment');
                    if (assignmentitem.length != 0)
                        this.InterviewsList.push(assignmentitem[0]);

                    let assessmentitem = data.Table.filter(x => x.InterviewType == 'Assessment');
                    if (assessmentitem.length != 0)
                        this.InterviewsList.push(assessmentitem[0]);

                    let managementitem = data.Table.filter(x => x.InterviewType == 'Management');
                    if (managementitem.length != 0)
                        this.InterviewsList.push(managementitem[0]);
                }
            }
        });
        this.getgeneralresultbycandidateid(candidateid, jobid);
        this.GetAssessmentQuestionsbyCandidateidjobid(jobid, candidateid);
        this.GetAssignmentQuestionsbyCandidateidjobid(jobid, candidateid);
        this.getacitivitieslist(candidateid);
        this.isVisible = false;
    }

    EditCandidatenavigate() {
        this.isVisible = false;
        this.Router.navigate(['/candidates/edit-candidate/', this.candidateId]);
        // this.Router.navigate(['/candidates/edit-candidate/', this.candidateId]);
    }
    ViewSummaryPopup() {
        this.openQuestionnaireModal(this.ViewSummaryAgGrid);
    }

    openQuestionnaireModal(templateRef: TemplateRef<any>) {
        const dialogRef = this.matdialog.open(templateRef, {
            width: '2000px',
            height: '600px',
            autoFocus: false,
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }


    aggridbind() {
        if (this.defaultAction != null) {
            // this.evaluationservice.GetJobSummaryInfo(2).subscribe(data=>{

            this.evaluationservice.GetJobSummaryInfo(this.defaultAction).subscribe(data => {
                this.rowData = data.Table;
                this.rowData.forEach(element => {

                    element.AppliedOn=element.AppliedOn==null?null:formatDate(element.AppliedOn, 'MMM dd yyyy', 'en-US');
                    element.LastUpdate=element.LastUpdate==null?null:formatDate(element.LastUpdate, 'MMM dd yyyy', 'en-US');
                   
                    
                     });
            });
        }
    }
    onGridReady(params: any) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridColumnApi.autoSizeColumns();
        this.gridApi.setDomLayout('autoHeight');
        this.aggridbind();
        //this.evaluationservice.GetJobSummaryInfo(this.defaultAction)
        //    .subscribe(data => {

        //        this.rowData = data.Table;
        //    });
    }
    onGridFilterChanged() {
        this.gridtotRowCount = this.gridOptions.api.getDisplayedRowCount();
    }
    Starttest() {
        this.showQuestiontoCandidate = true;
        this.IsAssessmentTestDonebyCandidate = false;
        this.startTrackingLoop('assesment');
        this.someDate = new Date(Date.now() + (69 * 60 + 60) * 1000);
    }

    StartAssignmenttest() {
        this.showAssignmentQuestiontoCandidate = true;
        this.IsAssignmentTestDonebyCandidate = false;
        this.startTrackingLoop('assignment');
        this.assignmentCount = new Date(Date.now() + (69 * 60 + 60) * 1000);
    }

    startTrackingLoop(type) {
        this.tracking = setInterval(() => {
            Swal.fire({
                title: 'Time up!',
                text: 'Test will be submitted automatically.',
                icon: 'info',
                showDenyButton: false,
                showCancelButton: false,
                confirmButtonText: 'Ok',
            }).then((result) => {
                if (result.isConfirmed) {
                    if (type == 'assignment') {
                        this.SubmitAssignmentPaper();
                    }
                    else {
                        this.SubmitAssessmentPaper();
                    }
                }
            })
        }, ((69 * 60 + 60) * 1000));
    }

    stop() {
        // let x = this.countdown.text;
        // alert(x);
        // this.someDate = new Date(x);
        //this.someDate = new Date(Date.now() + (69 * 60 + 60) * 1000);
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

    GetCandidateAssigningToInfo() {
        // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/GetCandidateAssigningToInfo?CandidateId='+this.candidateId+'&JobId='+ this.SelectedJobId).subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/candidateService/GetCandidateAssigningToInfo?CandidateId=' + this.candidateId + '&JobId=' + this.SelectedJobId).subscribe(data => {

            if (data.$values.length > 0) {
                this.GetCandidateAssigningTo = data.Table;
                this.Selecthruser = this.GetCandidateAssigningTo.map(t => t.AssigningTo);
                this.selectedHrs = this.Selecthruser;
                if (this.GetCandidateAssigningTo.length != 0) {
                    this.defaultinterviewstagechange = this.GetCandidateAssigningTo[0].ApplicationStatus;
                    this.IsInterviewAdvance = false;
                    if (this.defaultinterviewstagechange == 'Advance') {
                        this.IsInterviewAdvance = true;
                    }
                }
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

    GetrejectInterviewbody() {
        this.RejectInterviewMessageBody = "To: " + this.commonfieldName + "," + " <br/><br/> &nbsp;&nbsp;&nbsp;  " + "Subject:" +
            "Your Application to " + this.commonfieldCompany + "<br/><br/>" +
            "Hi " + this.commonfieldName + "," + "<br/><br/>" +
            "Thank you for taking the time to apply for the " + this.commonfieldDesignation + "role at" + this.commonfieldCompany + "." +
            "We appreciate your interest in joining the company! At this time, we will not be moving forward with your application." + "<br/>" +
            "We will get in touch with you whenever there is any new requirement that matches your profile." + "<br/>" +
            "Once again Thank you for your time and we wish you all the best in your job search and future career endeavours." + "<br/><br/>" +
            "Regards," + "<br/>" +
            this.userName
    }
    openInterviewRejectModal(interviewtype: any) {

        this.InterviewTypeRejectModel = '';
        this.InterviewTypeRejectModel = interviewtype;
        this.GetrejectInterviewbody();
        this.openRejectModal(this.InterviewRejectmodal);
    }

    openInterviewCancelModal(interviewtype: any) {
        this.InterviewTypeCancelModel = '';
        this.InterviewTypeCancelModel = interviewtype;
        this.GetrejectInterviewbody();
        this.openRejectModal(this.InterviewCancelmodal);
    }

    changeApplicationStatus(selectvalue: any) {

        this.ApplicationStatus = selectvalue;
        var btnIntrvshld = document.getElementById('btnScheduleInterview');
        var btnScheduleInterviewReject = document.getElementById('btnScheduleInterviewReject');
        var btnScheduleInterview = document.getElementById('btnScheduleNextInterview');
        this.IsInterviewAdvance = false;

        if (selectvalue == 'Advance') {
            this.GetCandidateAssigningToInfo();
            this.selectedUserEmail = [];
            this.selectedHrs.forEach(element => {
                let email = this.hrRoleUsers.find(a => a.Name == element).Email;
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
            this.openInterviewModal(this.TechnicalInterviewerUsersDialog);

        }
        else if (selectvalue == 'Reject') {
            this.openRejectModal(this.Rejectmodal);
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
        this.isVisible = false;
    }
    GethrRoleUsers() {
        /// this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/GethrRoleUsers').subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/candidateService/GethrRoleUsers').subscribe(data => {
            this.hrRoleUsers = data.$values;
        });
    }

    getRecruiterRole(id) {
        return this._Recruiters.get(id);
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
            CandidateId: this.candidateId,
            JobId: this.SelectedJobId,
            AssigningTo: this.Selecthruser,
            ApplicationStatus: this.ApplicationStatus


        }).subscribe(data => {
            this.selectedRowsCnt = 0;
            // this._fuseProgressBarService.hide();
            this.matdialog.closeAll();
            Swal.fire(
                'Schedule Interview Saved successfully!',
                '',
                'success'
            );
        });
        this.CandidateAssigningTo();
        this.getCandidateSheduleInterviewInfo();
        this.IsInterviewAdvance = true;
        // this._fuseProgressBarService.hide();  
        //this.CandidateAssigningTo();
        //this.getCandidateSheduleInterviewInfo();
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

    getCandidateSheduleInterviewInfo() {

        this.http.get<any>(this.apiUrl + '/api/interviewService/getInterviewScheduleInfo?CandidateId=' + this.candidateId + '&JobId=' + this.SelectedJobId + '&InterviewerId=' + this.userID).subscribe(data => {
            this.getInterviewMode();

            this.candidateinterviewSchedule = data;

            this.AllcandidateinterviewScheduled = this.candidateinterviewSchedule.Table;

            this.candidateinterview = false;
            this.candidateinterviewer = this.candidateinterviewSchedule.Table1;

            this.GetInterviewMode = this.candidateinterviewSchedule.Table2;

            this.ModifyInterviewMode = "";

            if (this.candidateinterviewSchedule.Table3.length != 0) {
                this.defaultinterviewstagechange = this.candidateinterviewSchedule.Table3[0].ApplicationStatus;
                this.IsInterviewAdvance = false;
                if (this.defaultinterviewstagechange == 'Advance') {
                    this.IsInterviewAdvance = true;
                }
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
            }


            if (this.AllcandidateinterviewScheduled.length != 0) {
                this.candidateinterview = true;
                this.defaultinterviewstagechange = this.AllcandidateinterviewScheduled[0].ApplicationStatus;
                this.IsInterviewAdvance = false;
                if (this.defaultinterviewstagechange == 'Advance') {
                    this.IsInterviewAdvance = true;
                }
            }

        });
        this.GetCandidateAssigningToInfo();

    }

    RejectInterview() {

        let cid = this.candidateId;
        let jobid = this.defaultAction;
        let interviewtype = this.InterviewTypeRejectModel;
        let status = 'Rejected';
        this.evaluationservice.rejectinterviewcandidate(jobid, cid, interviewtype, status).subscribe(data => {
            Swal.fire(
                'Interview Rejected',
                '',
                'success'
            );
            this.GetCandidateInfoByJobIdWithInterviewInfo(cid);
            this.matdialog.closeAll();
        });

    }
    CancelInterview() {
        let cid = this.candidateId;
        let jobid = this.defaultAction;
        let interviewtype = this.InterviewTypeCancelModel;
        let status = 'Cancelled';
        this.evaluationservice.rejectinterviewcandidate(jobid, cid, interviewtype, status).subscribe(data => {
            Swal.fire(
                'Interview Cancelled',
                '',
                'success'
            );
            this.GetCandidateInfoByJobIdWithInterviewInfo(cid);
            this.matdialog.closeAll();
            this.getgeneralresultbycandidateid(cid, jobid);
        });

    }

    RejectCandidateProfile() {

        let cid = this.candidateId;
        let jobid = this.defaultAction;
        let RejectionReason = (<HTMLInputElement>document.getElementById('txtEmailBody')).value
        //this.RejectInterviewMessageBody;
        let status = 'Rejected';

        this.evaluationservice.UpdateCandidateRejectReasion(jobid, cid, RejectionReason, status, this.userID).subscribe(data => {

            let result = data;
            Swal.fire(
                'Interview Rejected',
                '',
                'success'
            );
            // this.getCandidateSheduleInterviewInfo();
            this.defaultinterviewstagechange = 'Reject';
            this.matdialog.closeAll();
        });

    }
    CloseWindow() {
        this.defaultinterviewstagechange = 'Select';
        this.matdialog.closeAll();
    }








}

var stdFilterParams = {
    buttons: ['apply', 'reset'],
    closeOnApply: true
};
