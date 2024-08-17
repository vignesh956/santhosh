import { Component, OnDestroy, ViewChild, OnInit, Input, Output, ElementRef, TemplateRef, EventEmitter, ViewEncapsulation, HostBinding, AfterViewInit } from '@angular/core';
//import { CandidateserviceService } from 'app/services/candidateservice.service';
import { CommonModule } from '@angular/common';
import { CandidateserviceService } from '../../../services/candidateservice.service';
//import { FuseProgressBarService } from '../../../../@fuse/components/progress-bar/progress-bar.service';
import { GridOptions } from '@ag-grid-community/all-modules';
import { DateRendererComponent } from './components/date-renderer.component';
import { DatePipe, formatDate } from '@angular/common';
//import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
//import { MatCheckbox, MatCheckboxChange, MatRadioChange, MatRadioButton, MatDatepickerInputEvent, MatChipInputEvent, MatSnackBar, MatSelectChange } from '@angular/material';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioChange, MatRadioButton } from '@angular/material/radio';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange } from '@angular/material/select';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from "@angular/router";
// import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import pdfmake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfmake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { RepositoryConstant } from '../../constants/Repository.constant';
import * as moment from 'moment';
import { DialogConfirmComponent } from './New-Candidate/new-candidate/dialog-confirm/dialog-confirm.component';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
@Component({
    selector: 'candidates',
    templateUrl: './candidates.component.html',
    styleUrls: ['./candidates.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe]
})

export class CandidatesComponent implements OnInit {

openPopup(templateRef: TemplateRef<any>, _width, _height) {
        this.newFolderFormGroup.reset();
        const dialogRef = this.matdialog.open(templateRef, {
            width: _width,
            height: _height,
            autoFocus: false,
        });

        dialogRef.afterClosed().subscribe(result => {
        });
}

    public apiUrl: string = RepositoryConstant.apiUrl;
    @ViewChild('pdfCandidates', { static: true }) pdfCandidates: ElementRef;
    @ViewChild('profileInput', { static: true }) profileInput;
    @ViewChild('mobileno', { static: true }) mobileno1: ElementRef; //Eswari
    @ViewChild('candidatename', { static: true }) candidatename1: ElementRef;
    @ViewChild('inputFile', { static: true }) myInputVariable: ElementRef;
    @ViewChild("fileInput", { static: false }) uploadfile: ElementRef;
    @ViewChild('fileInput') fileInput: any;
    @Input()
    checked: Boolean;
    Locations;
    mobileno: number;
    mob2 = "^[789]\d{9}$";
    today = new Date();
    Count = 0;
    Reslen = -1;
    //Eswari
    imageUrl;
    fileToUpload: File | null = null;
    resumeselectedFiles: any[] = [];
    ResumefieldName;
    //ResumeFormGroup: FormGroup;
    //ResumeFormGroupArrayitems: FormArray;
    Designations;
    Skills;
    AllCandidates;
    selectedCandidate;
    selectedView: any;
    selectedCandidateSkills: [];
    selectedCandidates: any[] = [];
    ResumeParseData: any = [];
    gridtotRowCount;
    private gridApi;
    private selectedskills: any;
    private gridColumnApi;
    private frameworkComponents;
    private gridOptions: GridOptions;
    rowData: any;
    context: any;
    selectedCount = 0;
    selectedRowsCnt = 0;
    selectedCandidateIds: number[] = []; 
    _Skills = new Map();
    private defaultColDef;
    candidateListSearchFilter = '';
    candidateGridSearchFilter = '';
    locationFilter = '';
    skillFilter = '';
    designationFilter = '';
    public isallChecked: boolean;
    defaultSort = 'NewesttoOldest';

    isVisible: any = false;
    allLocationsSelected = [];
    allDesignationsSelected = [];
    allSkillsSelected = [];
    allFoldersSelected = [];
    candidateskills = [];
    selectedsSkillData = [];
    selectedData: { value: string; text: string };
    locationFormGroup: FormGroup;
    newFolderFormGroup: FormGroup;
    searchInput: FormControl;
    loggedUserId;
    userSavedViews: any;
    selectedUserView: any;
    IsCandidateActivate: boolean = true;
    recruitersList: any;
    openJobsList: any;
    selectedRecruiters = [];
    selectedOpenJobs = [];
    ActiveCandidates = [];
    InactiveCandidates = [];
    userID;
    printCandidates = [];
    candidatelistLoader = false;
    candidatesGridLoader = false;
    ResumeParsingLoader = false;
    filterApplied = false;
    paginationCurrentPage = 0;
    paginationPageRecordsCntDisplay = 5;
    paginationTotalRecords = 0;
    paginationTotalPages = 0;
    numbers = [];
    searchFills: any = {};
    selectSortBy = '';
    candidatesDrpdwnColumns: any;
    candidatesDrpdwnformControl: any;
    rowSelection;
    firstFormGroup: FormGroup;
    Tags: string[] = [];
    candidateID;
    selectedExperience;
    IsRelocate: boolean;
    selectedrelocatevalue;
    selectedDob;
    SelectEducationtoEvent;
    SelectEducationFromEvent;
    candidateprofileimageURL;
    UploadCandidateProfileImage: any[] = [];
    commonfieldName;
    commonfieldDesignation;
    commonfieldCompany;
    commonfieldEmail;
    commonfieldMobile;
    commonfieldLocation;
    removable = true;
    location_options = [];
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    selectedLocationAddress: any;
    // selectedCandidates;
    isNewFolder = true;
    folderList: any[] = [];
    defaultStatus: any;
    List_JobApplied: any[] = [];
    Educationform: FormGroup;
    Experianceform: FormGroup;
    Awardsform: FormGroup;
    editCandidateID: any = 1;
    CandidatExperiance = [];
    CandidateAwardsAndCertificate = [];
    CandidatEducationInfo = [];

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
        // {
        //     headerName: "Action",
        //     cellClass: "grid-cell-centered",
        //     field: "",
        //     sortable: false,
        //     cellRenderer: "JobGridActionbuttonsComponent",
        //     width: 90,
        //     valueGetter: function(params) {
        //         return {
        //             Id: params.data.Id,
        //             Title: params.data.Title,
        //             params: params
        //         };
        //     },
        //     dropdownItem: false
        // },
        // {
        //     headerName: 'Id',
        //     field: 'Id',
        //     cellClass: "grid-cell-centered",
        //     filter: 'agTextColumnFilter',
        //     width: 80,
        //     dropdownItem: true
        // },
        {
            headerName: 'Name',
            field: 'Name',
            filter: 'agTextColumnFilter',
            tooltipField: 'Name',
            width: 250,
            dropdownItem: true
        },
        {
            headerName: 'Designation',
            cellClass: "grid-cell-centered",
            field: 'Designation',
            resizable: true,
            sortable: true,
            filter: 'agTextColumnFilter',
            tooltipField: 'Designation',
            width: 120,
            dropdownItem: true
        },
        {
            headerName: 'Email',
            field: 'Email',
            cellClass: "grid-cell-centered",
            columnGroupShow: 'closed',
            filter: 'agTextColumnFilter',
            tooltipField: 'Email',
            width: 120,
            dropdownItem: true
        },
        {
            headerName: 'CurrentEmployer',
            cellClass: "grid-cell-centered",
            field: 'CurrentEmployer',
            resizable: true,
            filter: 'agTextColumnFilter',
            width: 140,
            dropdownItem: true
        },
        {
            headerName: 'Created Date',
            cellClass: "grid-cell-centered",
            field: 'CreatedDate',
            resizable: true,
            cellRenderer: 'DateRendererComponent',
            filter: 'agDateColumnFilter',
            width: 150,
            dropdownItem: true
        }


    ];
     showPopup: any;
    public files: any;
    constructor(private candidateService: CandidateserviceService,
        //public _fuseSidebarService: FuseSidebarService,
        //private _fuseProgressBarService: FuseProgressBarService,
        private http: HttpClient, private authService: AuthenticationService,
        private formBuilder: FormBuilder, private router: Router, private matdialog: MatDialog,
        public datepipe: DatePipe,
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        private dialog: MatDialog,) {
        if (sessionStorage.getItem('candidateview') == null || sessionStorage.getItem('candidateview') == 'list') {
            this.selectedView = 'list';
        }
        else {
            this.selectedView = 'grid';
            this.aggridbind();
        }

        this.loggedUserId = 5;
        let loggedInfo = this.authService.getLoggedInfo();
        this.userID = loggedInfo.id;

        //this._fuseSidebarService.getSidebar('navbar').toggleFold();
        this.gridOptions = <GridOptions>{
            enableSorting: true,
            enableFilter: true,

        };

        this.context = {
            componentParent: this
        };
        this.defaultColDef = {
            sortable: true,
            resizable: true,
            width: 'auto'
        };
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
            'Name',
            'Designation',
            'CurrentEmployer',
            'Email',
            'CreatedDate'
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
        this.selectedDob = '';

        this.firstFormGroup = this._formBuilder.group({

            candidateName: ['', Validators.required],
            designation: ['', [Validators.required, Validators.minLength(5)]],
            currentEmployer: ['', Validators.required],
            email: ['', Validators.required],
            experience: ['', Validators.required],
            skills: ['', Validators.required],
            overview: ['', Validators.required],
            candidate_location: ['', Validators.required],
            mobileno: ['', Validators.required],
            desiredsalary: ['', Validators.required],
            dob: ['', [Validators.required, this.dateValidator]],
            relocate: ['', Validators.required],
            facebook: [''],
            linkedin: [''],
            twitter: [''],
            github: [''],
            stackoverflow: [''],
        });
        //},{validator: [this.AgeCheck('selectedDob')]});
        this.newFolderFormGroup = this._formBuilder.group({
            newfolder: ['', Validators.required]
        });


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

        //this.candidatename1.nativeElement.focus(); 
        //this.getcandidates();
        this.showView('list');
        this.getRecruiters();
        this.getopenJobs();
        this.getcandidateskills();
        //this.getfoldersbyuserid();
        this.defaultStatus = "Active";
        this.locationFormGroup = this.formBuilder.group({
            Locations: this.formBuilder.array([]),
            skills: this.formBuilder.array([]),
            Designations: this.formBuilder.array([]),
            Folders: this.formBuilder.array([])
        });

        this.searchFills = this.candidateService.getSearchFills();
        //Getting all locations
        // debugger;
        this.candidateService.getAllLocationslist().subscribe(data => {
            this.Locations = data.$values;
            // debugger;
            const locations = <FormArray>this.locationFormGroup.get('Locations') as FormArray;
            this.Locations.forEach(row => {
                this.allLocationsSelected.push(row);
                locations.push(new FormControl(row));
            });
        });

        this.candidateService.getAllDesignationslist().subscribe(data => {
            this.Designations = data.$values;
            const designations = <FormArray>this.locationFormGroup.get('Designations') as FormArray;
            this.Designations.forEach(row => {
                this.allDesignationsSelected.push(row);
                designations.push(new FormControl(row));
            });
        });

        //Getting all Skills
        this.candidateService.getAllSkillslist().subscribe(data => {
            this.Skills = data.$values;
            const skills = <FormArray>this.locationFormGroup.get('skills') as FormArray;
            this.Skills.forEach(row => {
                this.allSkillsSelected.push(row);
                skills.push(new FormControl(row));
            });
        });

        var CandidateidpayLoad = {
            UserId: this.userID
        }

        this.candidateService.getFoldersbyUserId(CandidateidpayLoad).subscribe(res => {
            this.folderList = [];
            this.folderList = res.$values;
            const folders = <FormArray>this.locationFormGroup.get('Folders') as FormArray;
            this.folderList.forEach(row => {
                this.allFoldersSelected.push(row.folderName);
                folders.push(new FormControl(row.folderName));
            });
            this.isVisible = true;
        });

    }
    @Output() onallChecked: EventEmitter<any> = new EventEmitter<any>();
    public allActivesChecked(event: MatCheckbox): void {
        this.isallChecked = false;
        this.selectedCandidateIds = [];
        this.IsCandidateActivate = true;
        this.selectedCount = 0;
        this.isallChecked = event.checked;
        this.ActiveCandidates = [];
        if (this.isallChecked) {
            this.ActiveCandidates = this.AllCandidates;
            this.selectedCount = this.ActiveCandidates.length;
            for (let i = 0; i < this.ActiveCandidates.length; i++) {
                let cid = this.ActiveCandidates[i].Id;
                this.selectedCandidateIds.push(cid);
            }
        }
    }
    public allInActivesChecked(event: MatCheckbox): void {
        this.isallChecked = false;
        this.selectedCandidateIds = [];
        this.IsCandidateActivate = false;
        this.selectedCount = 0;
        this.isallChecked = event.checked;
        this.InactiveCandidates = [];
        if (this.isallChecked) {
            this.InactiveCandidates = this.AllCandidates;
            this.selectedCount = this.InactiveCandidates.length;
            for (let i = 0; i < this.InactiveCandidates.length; i++) {
                let cid = this.InactiveCandidates[i].Id;
                this.selectedCandidateIds.push(cid);
            }
        }
    }
    getcandidates() {

        //this._fuseProgressBarService.show();
        this.candidatesGridLoader = true;
        this.candidatelistLoader = true;
        this.selectedCount = 0;
        this.AllCandidates = [];
        this.ActiveCandidates = [];
        this.InactiveCandidates = [];
        this.candidateService.getCandidatelist().subscribe(data => {
            let allCandidates = data.Candidates;
            for (var i = 0; i < allCandidates.length; i++) {
                if (allCandidates[i].Active == true) {
                    this.ActiveCandidates.push(allCandidates[i]);
                }
                else {
                    this.InactiveCandidates.push(allCandidates[i]);
                }
            }
            this.AllCandidates = [];
            if (this.IsCandidateActivate) {
                this.AllCandidates = this.ActiveCandidates;
            }
            else {
                this.AllCandidates = this.InactiveCandidates;
            }

            this.selectedCandidate = this.AllCandidates[0];
            this.selectedCandidateSkills = this.selectedCandidate.Skills.split(',');
            //this._fuseProgressBarService.hide();
            this.candidatesGridLoader = false;
            this.candidatelistLoader = false;

            if (this.selectedView === 'grid') {
                this.aggridbind();
                //this.gridOptions.api.setRowData(data.Candidates);
                //this.gridtotRowCount = this.gridOptions.api.getDisplayedRowCount();
            }
        });
        this.getUserViews();
    }

    getUserViews() {
        // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/getCandidateViewByUserId?UserId=' + this.loggedUserId).subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/candidateService/getCandidateViewByUserId?UserId=' + this.loggedUserId).subscribe(data => {
            this.userSavedViews = data;
        });
    }

    showUserView() {
        //  alert(this.selectedUserView);
        if (this.selectedUserView === 'defaultUserView') {
            this.gridApi.setColumnDefs([]);
            this.gridApi.setColumnDefs(this.webColumns);
            this.getcandidates();
        }
        else {
            //alert();
        }
    }

    saveUserView() {
        let userInputViewName = window.prompt("Please enter view name", "Hyderabad Candidate List");

        let viewName = userInputViewName.trim();
        //alert(viewName);

        if (viewName != null && viewName.length > 0) {

            let viewNameCheck = false;
            this.userSavedViews.forEach(function (item) {
                if (item['ViewName'] == viewName) {
                    viewNameCheck = true;
                }
            });

            if (viewNameCheck) {
                Swal.fire(
                    'A view already exists with the name ' + viewName,
                    '',
                    'error'
                );
                return false;
            } else {
                let colState = this.gridColumnApi.getColumnState();
                let filterState = this.gridOptions.api.getFilterModel();
                let _colState = [];
                colState.forEach(function (item) {
                    if (item['colId'] != 0 && item['colId'] != 1) {
                        _colState.push(item);
                    }
                });

                let filterArr = [];
                if (filterState['Name']) {
                    const name = {
                        filterId: "Name",
                        filterType: filterState['Name']['type'],
                        type: filterState['Name']['type'],
                        filter: filterState['Name']['filter']
                    };
                    filterArr.push(name);
                }

                if (filterState['Id']) {
                    const jobId = {
                        filterId: "Id",
                        filterType: filterState['Id']['type'],
                        type: filterState['Id']['type'],
                        filter: filterState['Id']['filter']
                    };
                    filterArr.push(jobId);
                }

                if (filterState['Designation']) {
                    const designation = {
                        filterId: "Designation",
                        filterType: filterState['Designation']['type'],
                        type: filterState['Designation']['type'],
                        filter: filterState['Designation']['filter']
                    };
                    filterArr.push(designation);
                }

                if (filterState['Email']) {
                    const email = {
                        filterId: "Email",
                        filterType: filterState['Email']['type'],
                        type: filterState['Email']['type'],
                        filter: filterState['Email']['filter']
                    };
                    filterArr.push(email);
                }

                if (_colState.length > 0) {
                    const headers = { "content-type": "application/json" };
                    const body = JSON.stringify({
                        GridName: "Candidate",
                        ViewName: viewName,
                        UserId: this.loggedUserId,
                        ColumnState: _colState,
                        FilterState: filterArr,
                        ViewType: "public"
                    });

                    //this._fuseProgressBarService.show();
                    //  this.http.post("https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/saveCandidatesView", body, {
                    this.http.post(this.apiUrl + "/api/candidateService/saveCandidatesView", body, {
                        headers: headers
                    })
                        .subscribe(data => {
                            //this._fuseProgressBarService.hide();
                            Swal.fire(
                                'View created successfully!',
                                '',
                                'success'
                            );

                            this.getUserViews();
                        });
                } else {
                    Swal.fire(
                        'Please select column(s)!',
                        '',
                        'warning'
                    );
                }

            }


        } else {
            Swal.fire(
                'Please enter view name',
                '',
                'error'
            );
        }

    }

    showView(viewName: any) {
        if (viewName === 'grid') {
            this.selectedView = 'grid';
            this.getcandidates();
            sessionStorage.setItem('candidateview', 'grid');
        } else {
            this.selectedView = 'list';
            this.reloadCandidatesPaginationList();
            sessionStorage.setItem('candidateview', 'list');
        }
    }
    //Eswari

    // get Experianceformitems (){
    //     return  this.ResumeFormGroup.get('items') as FormArray;
    //     }

    GetResumeData() {

        //this.ResumeParsingLoader = true
        // this.resumeselectedFiles.push("Raju_resume.pdf");
        this.isVisible = true;
        console.log(this.resumeselectedFiles , 'this.resumeselectedFiles[0].name;')
        if (this.resumeselectedFiles.length > 0) {

            this.candidateService.getResumeParsedatelist(this.ResumefieldName).subscribe(data => {
                // debugger;
                //    this.candidateService.getResumeParsedatelist(formData).subscribe(data=>{  
                //  debugger;
                //if(data != null && data != '')
                if (data !== null) {
                    // debugger;
                    // document.getElementById('tdresume').style.display = 'block';
                    this.ResumeParseData = data.$values
                    // this.ResumeParseData = data.Result;
                    //this.ResumeParseData = data;
                }
                else {
                    //document.getElementById('tdresume').style.display = 'none';
                    Swal.fire(
                        'Resume is too large, Please remove projects information. While uploading CV through resume parsing, no need of projects..',
                        '',
                        'success'
                    );
                    this.ResumefieldName = '';
                    this.fileInput.nativeElement.value = null;
                    this.resumeselectedFiles = [];
                }
                //this.isVisible = false;
            });
        }
        else {
            alert('No File is chosen');
            return false;
        }
        // this.ResumeParsingLoader = false;
        this.isVisible = false;
    }
    ClearResumeData() {

        let currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
            this.ngOnInit();
        });
    }
    EditResumeDate(event, index) {

        this.firstFormGroup = this._formBuilder.group({

            candidateName: [event.Name, Validators.required],
            designation: ['', [Validators.required, Validators.minLength(5)]],
            currentEmployer: ['', Validators.required],
            email: [event.Email, Validators.required],
            experience: ['', Validators.required],
            skills: ['', Validators.required],
            overview: ['', Validators.required],
            candidate_location: ['', Validators.required],
            mobileno: [event.Mobile, Validators.required],
            desiredsalary: ['', Validators.required],
            dob: ['', [Validators.required, this.dateValidator]],
            relocate: ['', Validators.required],
            facebook: [''],
            linkedin: [''],
            twitter: [''],
            github: [''],
            stackoverflow: [''],
        });
    }
    DeleteResumeData(event, index) {

        this.ResumeParseData.splice(index, 1);
        if (this.ResumeParseData.length == 0) {

            this.ResumefieldName = "";
            document.getElementById('tdresume').style.display = 'none';
            //  document.getElementById("fileinput").remove();
            // this.isVisible = false; 
            this.uploadfile.nativeElement.value = "";
            this.ClearResumeData();
        }
        //this.isVisible = false; 
    }
    SubmitResumeData(event, index) {

        //this.CreateResumeParseDialog.show()
        // this.http.post<any>("https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/createCandidate", {
        this.http.post<any>(this.apiUrl + "/api/candidateService/createCandidate", {
            // this.http.post<any>("http://localhost:50274/api/candidateService/createCandidate", {
            Id: this.candidateID,
            Name: event.Name,
            Designation: '',
            CurrentEmployer: '',
            Email: event.Email,
            Experience: '',
            Overview: '',
            Location: '',
            Relocate: '',
            DateOfBirth: '',
            MobileNumber: event.ContactDetails,
            Salary: '',
            Skills: '', //event.Skills,
            ProfileImage: '',
            UserId: this.userID,
            Facebook: '',
            LinkedIn: '',
            Twitter: '',
            GitHub: '',
            StackOverflow: '',
        }).subscribe(data => {

            //Hide
            this.candidateID = data;
            if (this.candidateID == 0 || this.candidateID === undefined || this.candidateID === null) {
                alert('something went wrong');
            }
            else {
                Swal.fire(
                    'Candidate info saved successfully.',
                    '',
                    'success'
                );

            }

            this.DeleteResumeData(event, index)
            // this.candidatesGridLoader = false;
            // this.isVisible = false;

        });
    }
    // onGridReady1(params){
    //     this.gridApi = params.api;
    //   this.gridColumnApi = params.columnApi;
    //   //this.rowData = [];
    //   this.GetResumeData();
    // }
    //Eswari
    // aggridbind() {
    //     this.candidateService.getCandidatelist().subscribe(data => {
    //         this.rowData = data.Candidates;
    //     });
        // this.candidateService.getResumeParsedatelist().subscribe(data=>{
        //     this.rowData = data.Table;
        //   });
    // }


aggridbind() {
    this.candidateService.getCandidatelist().subscribe(data => {
        this.rowData = data.candidates.$values;
    });
}
    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
        this.rowData = [];
        this.aggridbind();

        //this.GetResumeData();
    }
    onRowSelected(event) {
        // console.log("row selected: " + event);
        // console.log("row selected node: " + event.node.selected);
        // console.log("row selected index: " +event.rowIndex);
    }
    onSelectionChanged(event) {
        let selectedRows = this.gridApi.getSelectedRows();
        // console.log(selectedRows);
        if (selectedRows.length == 1) {
            this.selectedCandidate = true;
            this.viewJob(selectedRows[0]);
        } else {
            this.selectedCandidate = false;
        }
        this.selectedRowsCnt = selectedRows.length;
    }

    viewJob(rec: any) {
        this.selectedCandidate = rec;
        sessionStorage.setItem('view', 'list');
    }

    onGridFilterChanged() {
        this.gridtotRowCount = this.gridOptions.api.getDisplayedRowCount();
    }

    formatRecord(candidate) {
        let createdDateTime = new Date(candidate['CreatedDate']); // Convert to Date object
        //let createdDate = createdDateTime.toISOString().substring(0, 10); // Extract date portion
        let rec = {
            Id: candidate.id,
            Name: candidate.name,
            Designation: candidate.designation,
            Email: candidate.email,
            MobileNumber: candidate.mobileNumber,
            CurrentEmployer: candidate.currentEmployer,
            CreatedDate: candidate.createdDate,
            Experience: candidate.experience,
            resumepath: candidate.resumepath,
            ProfileImage: candidate.profileImage,
            Skills: candidate.skills.split(','),
            Salary: candidate.salary,
            Location: candidate.location,
            Overview: candidate.overview,
            List_JobApplied: candidate.list_JobApplied
        };

        return rec;
    }



    viewCandidate(rec: any) {
        this.selectedCandidate = rec;
        this.selectedCandidateSkills = [];
        this.selectedCandidateSkills = this.selectedCandidate.skills.split(',');
        sessionStorage.setItem('view', 'list');
    }

    getSkillName(id) {
        return this._Skills.get(id);
    }

    childOnChecked(isChecked: boolean, candidateId: any) {
        if (isChecked) {
            this.selectedCount++;
            this.selectedCandidateIds.push(candidateId);
        }
        else {
            this.selectedCount--;
            this.selectedCandidateIds.forEach((element, index) => {
                if (element == candidateId) this.selectedCandidateIds.splice(index, 1);
            });
        }
        this.candidateService.getCandidatelist().subscribe(data => {
            const candidates = data?.Candidates ?? [];
            this.selectedCandidates = candidates.filter(x => this.selectedCandidateIds.includes(x.Id));
          
          
        });
        //console.log(this.selectedCandidateIds);
    }
    isLocationChecked() {
        if (this.Locations != undefined) {
            return this.allLocationsSelected.length === this.Locations.length;
        }
    }
    locationIndeterminate() {
        return (this.allLocationsSelected.length > 0 && !this.isLocationChecked());
    }

    toggleAllLocations(event: MatCheckboxChange) {
        // debugger;
        this.isVisible = false;
        const locations = <FormArray>this.locationFormGroup.get('Locations') as FormArray;
        if (event.checked) {
            this.Locations.forEach(row => {
                this.allLocationsSelected.push(row);
                locations.push(new FormControl(row));
            });
        } else {
            this.allLocationsSelected.length = 0;
            const i = locations.controls.findIndex(x => x.value === event.source.value);
            locations.removeAt(i);
        }
        this.selectedCandidate = false;
        this.selectedRowsCnt = 0;
        this.selectedCount = 0;
        this.selectedCandidateIds = [];
    }

    toggleLocations(item, event: MatCheckboxChange) {
        const locations = <FormArray>this.locationFormGroup.get('Locations') as FormArray;
        if (event.checked) {
            locations.push(new FormControl(event.source.value));
            this.allLocationsSelected.push(item);
        } else {
            const i = locations.controls.findIndex(x => x.value === event.source.value);
            locations.removeAt(i);
            const index = this.allLocationsSelected.indexOf(item);
            if (index >= 0) {
                this.allLocationsSelected.splice(index, 1);
            }
        }
        this.selectedRowsCnt = 0;
        this.selectedCount = 0;
        this.selectedCandidateIds = [];
    }

    locationexists(item) {
        // debugger;
        return this.allLocationsSelected.indexOf(item) > -1;
    }

    isSkillsChecked() {
        if (this.Skills != undefined) {
            return this.allSkillsSelected.length === this.Skills.length;
        }
    }
    skillIndeterminate() {
        return (this.allSkillsSelected.length > 0 && !this.isSkillsChecked());
    }

    isDesignationssChecked() {
        if (this.Designations != undefined) {
            return this.allDesignationsSelected.length === this.Designations.length;
        }
    }
    designationIndeterminate() {
        return (this.allDesignationsSelected.length > 0 && !this.isDesignationssChecked());
    }

    designationexists(item) {
        return this.allDesignationsSelected.indexOf(item) > -1;
    }

    skillexists(item) {
        return this.allSkillsSelected.indexOf(item) > -1;
    }

    isFoldersChecked() {
        if (this.folderList != undefined) {
            return this.allFoldersSelected.length === this.folderList.length;
        }
    }

    folderIndeterminate() {
        return (this.allFoldersSelected.length > 0 && !this.isFoldersChecked());
    }

    foldersexists(item) {
        return this.allFoldersSelected.indexOf(item) > -1;
    }

    redirectToEditcandidate(id: any) {
        // debugger;
        Swal.fire({
            title: 'Are you sure want to edit the candidate?',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                sessionStorage.setItem('view', this.selectedView);
                this.router.navigate(['/candidates/edit-candidate/', id]);
                //this.router.navigate(['/candidates/edit-candidate/', id]);
            }
        });
    }

    openModal(templateRef: TemplateRef<any>) {
        const dialogRef = this.matdialog.open(templateRef, {
            width: '500px',
            height: '300px',
            autoFocus: false,
        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }

    // tslint:disable-next-line:typedef
    openDialogModal(templateRef: TemplateRef<any>, _width, _height) {
        this.newFolderFormGroup.reset();
        const dialogRef = this.matdialog.open(templateRef, {
            width: _width,
            height: _height,
            autoFocus: false,
        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }

    getRecruiters() {
        this.candidateService.getrecuiterslist().subscribe(data => {
            this.recruitersList = data;
        });
    }

    getopenJobs() {
        this.candidateService.getopenjobslist().subscribe(data => {
            this.openJobsList = data;
        });
    }

    getcandidateskills() {
        //debugger;
        this.candidateService.getcandidateskills().subscribe(data => {
            console.log(data , 'data candidateskills')
            this.candidateskills = data.$values;

        });
    }

    selectedValue(event: MatSelectChange) {
        this.selectedsSkillData = event.value;
        this.selectedData = {
            value: event.value,
            text: event.source.triggerValue
        };

    }

    selectedrecruiters(event) {
        this.selectedRecruiters = event.value;
    }

    selectedopenjobs(event) {
        this.selectedOpenJobs = event.value;
    }
    formatString(val) {
        return val.toString();
    }

    onQuickFilterChanged() {
        this.gridOptions.api.setQuickFilter(this.candidateGridSearchFilter);
    }

    resetFilters() {
        this.resetPaginationControls();
        this.IsCandidateActivate = true;
        this.filterApplied = false;
        this.candidateGridSearchFilter = '';
        this.candidateListSearchFilter = '';
        this.locationFilter = '';
        this.selectedRowsCnt = 0;
        this.allSkillsSelected = [];
        this.allLocationsSelected = [];
        this.allDesignationsSelected = [];
        this.allFoldersSelected = [];
        this.searchFills = {};
        this.selectSortBy = 'NewesttoOldest';
        this.searchFills = this.candidateService.getSearchFills();
        const skills = <FormArray>this.locationFormGroup.get('skills') as FormArray;
        skills.clear();
        this.Skills.forEach(row => {
            this.allSkillsSelected.push(row);
            skills.push(new FormControl(row));
        });
        const locations = <FormArray>this.locationFormGroup.get('Locations') as FormArray;
        locations.clear();
        this.Locations.forEach(row => {
            this.allLocationsSelected.push(row);
            locations.push(new FormControl(row));
        });
        const designations = <FormArray>this.locationFormGroup.get('Designations') as FormArray;
        designations.clear();
        this.Designations.forEach(row => {
            this.allDesignationsSelected.push(row);
            designations.push(new FormControl(row));
        });
        const folders = <FormArray>this.locationFormGroup.get('Folders') as FormArray;
        folders.clear();
        this.folderList.forEach(row => {
            this.allFoldersSelected.push(row);
            folders.push(new FormControl(row));
        });
        this.reloadCandidatesPaginationList();
    }
    activedeactiveradioValueCheck(event: MatRadioChange) {
        this.IsCandidateActivate = event.value;
        this.AllCandidates = [];
        this.selectedCandidateIds = [];
        this.isallChecked = false;
        this.selectedCount = 0;
        this.paginationCurrentPage = 0;
        this.getLimitCandidatefilterBy(0);
        //  if(this.IsCandidateActivate)
        //  {
        //     this.AllCandidates= this.ActiveCandidates;
        //  }
        //  else
        //  {
        //     this.AllCandidates = this.InactiveCandidates;
        //  }
    }

    ChangeCandidateStatus(status: boolean) {

        if (this.selectedCandidateIds.length == 0) {
            Swal.fire(
                'Please select atleast one candidate!',
                '',
                'success'
            );
        }
        else {
            this.IsCandidateActivate = status;
            //this._fuseProgressBarService.show();
            var payLoad = {
                CandidateIds: this.selectedCandidateIds,
                Active: status,
                UserId: this.userID
            }
            this.candidateService.changecandidatestatus(payLoad).subscribe(data => {
                this.reloadCandidatesPaginationList();
                //this._fuseProgressBarService.hide();
                Swal.fire(
                    'Candidate(s) status changed successfully!',
                    '',
                    'success'
                );
            });
        }
    }

    ChangeGridCandidateStatus(status: boolean) {
        if (this.selectedRowsCnt == 0) {
            Swal.fire(
                'Please select atleast one candidate!',
                '',
                'success'
            );
        }
        else {
            this.IsCandidateActivate = status;
            //this._fuseProgressBarService.show();
            let candidateIds = [];
            let selectedRows = this.gridApi.getSelectedRows();
            for (let i = 0; i < selectedRows.length; i++) {
                candidateIds[i] = selectedRows[i].Id;
            }
            var payLoad = {
                CandidateIds: candidateIds,
                Active: status,
                UserId: this.userID
            }
            this.candidateService.changecandidatestatus(payLoad).subscribe(data => {
                this.selectedRowsCnt = 0;
                if (this.selectedView === 'list') {
                    this.reloadCandidatesPaginationList();
                } else {
                    this.getcandidates();
                }
                //this._fuseProgressBarService.hide();
                Swal.fire(
                    'Candidate(s) status changed successfully!',
                    '',
                    'success'
                );
            });
        }
    }

    shareCandidate() {
        //this._fuseProgressBarService.show();
        const candidateIds = [];

        if (this.selectedView === 'list') {
            const selectedRows = this.selectedCandidateIds;

            for (let i = 0; i < selectedRows.length; i++) {
                candidateIds[i] = selectedRows[i];
            }
        } else {
            const selectedRows = this.gridApi.getSelectedRows();
            for (let i = 0; i < selectedRows.length; i++) {
                candidateIds[i] = selectedRows[i].Id;
            }
        }

        var payLoad = {
            CandidateIds: candidateIds,
            RecruitersIds: this.selectedRecruiters,
            UserId: this.userID
        }
        this.candidateService.sharecandidate(payLoad).subscribe(data => {
            this.selectedRowsCnt = 0;
            this.selectedRecruiters = [];
            if (this.selectedView === 'list') {
                this.reloadCandidatesPaginationList();
                //this.getcandidates();
            } else {
                this.getcandidates();
            }
            //this._fuseProgressBarService.hide();
            this.matdialog.closeAll();
            Swal.fire(
                'Candidate(s) info shared successfully!',
                '',
                'success'
            );
        });
    }


    TagOpenJobCandidate() {
        //this._fuseProgressBarService.show();
        const candidateIds = [];

        if (this.selectedView === 'list') {
            const selectedRows = this.selectedCandidateIds;

            for (let i = 0; i < selectedRows.length; i++) {
                candidateIds[i] = selectedRows[i];
            }
        } else {
            const selectedRows = this.gridApi.getSelectedRows();
            for (let i = 0; i < selectedRows.length; i++) {
                candidateIds[i] = selectedRows[i].Id;
            }
        }

        var payLoad = {
            CandidateIds: candidateIds,
            JobIds: this.selectedOpenJobs,
        }
        this.candidateService.posttaggedjobs(payLoad).subscribe(data => {
            this.selectedRowsCnt = 0;
            this.selectedOpenJobs = [];
            if (this.selectedView === 'list') {
                this.reloadCandidatesPaginationList();
                //this.getcandidates();
            } else {
                this.getcandidates();
            }
            //this._fuseProgressBarService.hide();
            this.matdialog.closeAll();
            Swal.fire(
                'Candidate(s) Jobs tagged successfully!',
                '',
                'success'
            );
        });
    }


    bulkAssignListCandidates() {
        //this._fuseProgressBarService.show();
        let candidateIds = [];
        let selectedRows = this.selectedCandidateIds;

        for (let i = 0; i < selectedRows.length; i++) {
            candidateIds[i] = selectedRows[i];

        }
        var payLoad = {
            CandidateIds: candidateIds,
            RecruitersIds: this.selectedRecruiters,
            UserId: this.userID
        }
        this.candidateService.assigncandidate(payLoad).subscribe(data => {
            this.selectedCount = 0;
            // this.openStatusCount = 0;
            // this.archiveStatusCount = 0;
            // this.otherStatusCount = 0;
            this.selectedCandidateIds = [];
            this.selectedRecruiters = [];
            this.isVisible = true;
            if (this.selectedView === 'list') {
                this.reloadCandidatesPaginationList();
                //this.getcandidates();
            } else {
                this.getcandidates();
            }

            //this._fuseProgressBarService.hide();
            this.matdialog.closeAll();
            Swal.fire(
                'Recruiters updated successfully!',
                '',
                'success'
            );
        });
    }

    bulkAssignGridCandidates() {
        //this._fuseProgressBarService.show();
        let candidateIds = [];
        let selectedRows = this.gridApi.getSelectedRows();

        for (let i = 0; i < selectedRows.length; i++) {
            candidateIds[i] = selectedRows[i].Id;
        }
        var payLoad = {
            CandidateIds: candidateIds,
            RecruitersIds: this.selectedRecruiters,
            UserId: this.userID
        }
        this.candidateService.assigncandidate(payLoad).subscribe(data => {
            this.selectedRowsCnt = 0;
            this.selectedRecruiters = [];
            if (this.selectedView === 'list') {
                this.reloadCandidatesPaginationList();
                //this.getcandidates();
            } else {
                this.getcandidates();
            }
            //this._fuseProgressBarService.hide();
            this.matdialog.closeAll();
            Swal.fire(
                'Recruiters updated successfully!',
                '',
                'success'
            );
        });
    }

    printDescription(candidateID) {
        this.generatePdf(candidateID);
    }

    generatePdf(candidateID) {
        this.printCandidates = [];
        Swal.fire({
            title: 'Are you sure you want to print the Candidate?',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                let candidates = this.AllCandidates;
                let selectedCandidate;
                for (let candidate of candidates) {
                    if (candidateID == candidate['Id']) {
                        this.printCandidates.push(candidate);
                        break;
                    }
                }
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

    sortChanged(event) {
        this.isVisible = false;
        if (event.value === 'Name')
            this.selectSortBy = event.value;
        else if (event.value === 'NewesttoOldest')
            this.selectSortBy = 'Newest to Oldest';
        else if (event.value === 'OldesttoNewest')
            this.selectSortBy = 'Oldest to Newest';

        this.paginationCurrentPage = 0;
        this.getLimitCandidatefilterBy(0);
    }

    reloadCandidatesPaginationList() {
        this.onClickCandidatesListPage(this.paginationCurrentPage);
    }

    onClickCandidatesListPage(number) {
        this.paginationCurrentPage = number;
        this.isVisible = false;
        if (this.filterApplied) {
            if (number === 0) {
                this.getLimitCandidatefilterBy(0);
            } else {
                number = number * this.paginationPageRecordsCntDisplay;
                this.getLimitCandidatefilterBy(number);
            }
        } else {
            if (number === 0) {
                this.getDefaultCandidatesListPagination(0);
            } else {
                number = number * this.paginationPageRecordsCntDisplay;
                this.getDefaultCandidatesListPagination(number);
            }
        }
    }

    getLimitCandidatefilterBy(start) {
        // debugger;
        this.candidatelistLoader = true;
        this.AllCandidates = [];
        var payLoad = {
            start: start,
            length: this.paginationPageRecordsCntDisplay,
            Locations: this.locationFormGroup.get('Locations').value,
            Skills: this.locationFormGroup.get('skills').value,
            Status: this.IsCandidateActivate ? 1 : 0,
            Designation: this.locationFormGroup.get('Designations').value,
            Folders: this.locationFormGroup.get('Folders').value,
            SearchKeyword: this.candidateListSearchFilter,
            SortBy: this.selectSortBy
        }
        this.candidateService.getCandidateListbyFilter(payLoad).subscribe(data => {

            this.candidatelistLoader = false;
            this.isVisible = true;
            this.AllCandidates = data.data.$values;
            this.rowData = data.data.$values;
            this.paginationTotalRecords = data['recordsTotal'];
            this.paginationTotalPages = data['TotalPages'];
            this.numbers = Array(this.paginationTotalPages).fill(0).map((x, i) => i);
        });

        this.selectedRowsCnt = 0;
        this.selectedCount = 0;
        this.selectedCandidateIds = [];
    }

    getDefaultCandidatesListPagination($start) {
        this.AllCandidates = [];
        this.candidatelistLoader = true;
        var payLoad = {
            start: $start,
            length: this.paginationPageRecordsCntDisplay,
            Locations: ['All'],
            Skills: ['All'],
            SearchKeyword: '',
            Status: true ? 1 : 0,
            Designation: ['All'],
            Folders: ['All'],
            SortBy: this.selectSortBy,
        }
        this.candidateService.getCandidateListbyFilter(payLoad).subscribe(data => {
            this.candidatelistLoader = false;
            this.AllCandidates = data.data.$values;
            this.rowData = data.data.$values;
            this.paginationTotalRecords = data['recordsTotal'];
            this.paginationTotalPages = data['TotalPages'];
            this.numbers = Array(this.paginationTotalPages).fill(0).map((x, i) => i);
            this.isVisible = true;
        });

        this.selectedRowsCnt = 0;
        this.selectedCount = 0;
        this.selectedCandidateIds = [];
    }
    onPaginateChange($event) {
        this.onClickCandidatesListPage($event['pageIndex']);
    }
    resetPaginationControls() {
        this.paginationTotalRecords = 0;
        this.paginationTotalPages = 0;
        this.paginationCurrentPage = 0;
    }
    candidatesKeywordSearchFilter() {
        this.resetPaginationControls();
        this.isVisible = false;
        this.filterApplied = true;
        this.getLimitCandidatefilterBy(0);
    }

    toggleFilters(filterType, item: any, event: MatCheckboxChange) {

        this.filterApplied = true;
        this.isVisible = false;
        if (filterType === 'locations') {
            const locations = <FormArray>this.locationFormGroup.get('Locations') as FormArray;
            if (event.checked) {
                locations.push(new FormControl(event.source.value));
                this.allLocationsSelected.push(item);
            } else {
                const i = locations.controls.findIndex(x => x.value === event.source.value);
                locations.removeAt(i);
                const index = this.allLocationsSelected.indexOf(item);
                if (index >= 0) {
                    this.allLocationsSelected.splice(index, 1);
                }
            }
        } else if (filterType === 'skills') {
            const skills = <FormArray>this.locationFormGroup.get('skills') as FormArray;
            if (event.checked) {
                skills.push(new FormControl(event.source.value));
                this.allSkillsSelected.push(item);
            } else {
                const i = skills.controls.findIndex(x => x.value === event.source.value);
                skills.removeAt(i);
                const index = this.allSkillsSelected.indexOf(item);
                if (index >= 0) {
                    this.allSkillsSelected.splice(index, 1);
                }
            }
        } else if (filterType === 'designations') {
            const designations = <FormArray>this.locationFormGroup.get('Designations') as FormArray;
            if (event.checked) {
                designations.push(new FormControl(event.source.value));
                this.allDesignationsSelected.push(item);
            } else {
                const i = designations.controls.findIndex(x => x.value === event.source.value);
                designations.removeAt(i);
                const index = this.allDesignationsSelected.indexOf(item);
                if (index >= 0) {
                    this.allDesignationsSelected.splice(index, 1);
                }
            }
        } else if (filterType === 'folders') {
            const folders = <FormArray>this.locationFormGroup.get('Folders') as FormArray;
            if (event.checked) {
                folders.push(new FormControl(event.source.value));
                this.allFoldersSelected.push(item);
            } else {
                const i = folders.controls.findIndex(x => x.value === event.source.value);
                folders.removeAt(i);
                const index = this.allFoldersSelected.indexOf(item);
                if (index >= 0) {
                    this.allFoldersSelected.splice(index, 1);
                }
            }
        }
        this.getLimitCandidatefilterBy(0);
    }

    toggleAllFilters(filterType, event: MatCheckboxChange) {
        this.filterApplied = true;
        this.isVisible = false;
        if (filterType === 'locations') {
            const locations = <FormArray>this.locationFormGroup.get('Locations') as FormArray;
            locations.clear();
            if (event.checked) {
                this.Locations.forEach(row => {
                    this.allLocationsSelected.push(row);
                    locations.push(new FormControl(row));
                });
            } else {
                this.allLocationsSelected.length = 0;
                const i = locations.controls.findIndex(x => x.value === event.source.value);
                locations.removeAt(i);
            }
        } else if (filterType === 'skills') {
            const skills = <FormArray>this.locationFormGroup.get('skills') as FormArray;
            skills.clear();
            if (event.checked) {
                this.Skills.forEach(row => {
                    this.allSkillsSelected.push(row);
                    skills.push(new FormControl(row));
                });
            } else {
                this.allSkillsSelected.length = 0;
                const i = skills.controls.findIndex(x => x.value === event.source.value);
                skills.removeAt(i);
            }
        } else if (filterType === 'designations') {
            const designation = <FormArray>this.locationFormGroup.get('Designations') as FormArray;
            designation.clear();
            if (event.checked) {
                this.Designations.forEach(row => {
                    this.allDesignationsSelected.push(row);
                    designation.push(new FormControl(row));
                });
            } else {
                this.allDesignationsSelected.length = 0;
                const i = designation.controls.findIndex(x => x.value === event.source.value);
                designation.removeAt(i);
            }
        } else if (filterType === 'folders') {
            const folder = <FormArray>this.locationFormGroup.get('Folders') as FormArray;
            folder.clear();
            if (event.checked) {
                this.folderList.forEach(row => {
                    this.allFoldersSelected.push(row.FolderName);
                    folder.push(new FormControl(row.FolderName));
                });
            } else {
                this.allFoldersSelected.length = 0;
                const i = folder.controls.findIndex(x => x.value === event.source.value);
                folder.removeAt(i);
            }
        }
        this.getLimitCandidatefilterBy(0);
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
    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {

        this.selectedDob = '';
        this.selectedDob = event.value;
        this.selectedDob.setHours(23, 59, 59, 999);
        //this.validateDOB(this.selectedDob)
    }
    // Eswari



    ValidateYear(event: any) //: { [s: string]: boolean }
    {
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
    AgeCheck(date: string): any {

        if (date != '') {
            let today = new Date();
            let birthDate = new Date(date);
            let age = today.getFullYear() - birthDate.getFullYear();
            let month = today.getMonth() - birthDate.getMonth();

            if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age > 22) {
                return true;
            }
            else {
                return null;
            }
        }
        //console.log('Age: ' + age + '\nBirthday: ' + birthDate);
        //return age;
    }


    // Eswari
    //MobileValidator
    onlyAlphabets(event) {

        try {
            const input = event.target.value;

            var inp = String.fromCharCode(event.keyCode);
            if (/[a-zA-Z]/.test(inp)) {
                return true;
            } else {
                event.preventDefault();
                return false;
            }

        }
        catch (err) {
            alert(err.Description);
        }
    }
    onMobileChangeEvent(event: any, mob1) {
        var MobNo = event.target.value;
        var mob = /^[789]\d{9}$/;
        // var mob = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
        if (MobNo.length != 10) {
            alert('Phone number must be 10 digits..');
            //this.mobileno1.nativeElement = "";
            //this.mobileno1.nativeElement.value = '';
            this.mobileno1.nativeElement.focus();
            return false;
        }
        else if (mob.test(MobNo.toString()) == false) {
            alert("Please enter valid mobile number.");
            // this.mobileno1.nativeElement.value = '';
            this.mobileno1.nativeElement.focus();
            return false;
        }
        else if (MobNo.toString() == "") {
            alert("Mobile No Should not be Empty.");
            // this.mobileno1.nativeElement.value = '';
            this.mobileno1.nativeElement.focus();
            return false;
        }
        else {
            return true;
        }
    }
    DesignationValidation(control: FormControl): { [s: string]: boolean } {
        if (control.value) {
            var des = control.value;
            if (des.length < 3) {
                alert('Enter At Least 3 Characters.');
                return { 'invaliddes': true };
            }
            else if (des == "") {
                alert('Designation Should not be Empty.');
                return { 'invaliddes': true };
            }
            else {
                return null;

            }
        }
    }
    MobileValidator(control: FormControl): { [s: string]: boolean } {
        if (control.value) {
            const MobileNo = control.value;

            var mob = /^[1-9]{1}[0-9]{9}$/;

            if (mob.test(MobileNo.toString()) == false) {
                alert("Please enter valid mobile number.");
                return { 'invalidMobileNo': true };
            }
            else { return null; }

        }
    }
    dateValidator(control: FormControl): { [s: string]: boolean } {

        if (control.value) {
            const birthDate = moment(control.value);
            const today = moment();

            let age = today.year() - birthDate.year();
            let month = today.month() - birthDate.month();
            let Tdate = today.date();
            let Bdate = birthDate.date();
            // if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            if (month < 0 || (month === 0 && Tdate < Bdate)) {
                age--;
            }
            if (age < 22) {
                alert('Age Should be greater than 22 years.');
                // this.msg = "Age Should be greater than 22 years.";
                return { 'invalidDate': true };
            }
            else {
                return null;
            }
            // if (birthDate.isBefore(today)) {}
            //   if (date.isBefore(today)) {
            //     return { 'invalidDate': true }
            //   }
            // }
            // return null;
        }
    }
    validateDOB(t1) {

        let e = this.selectedDob;
        let year = new Date(e).getFullYear();
        let today = new Date().getFullYear();
        if (today - year >= 18) {
            alert(year);
            return true;
        }
        else {
            alert('Hi');
            this.selectedDob = '';

            return false;
        }
    }
    saveuploadBlobProfileImage() {
        this.isVisible = false;
        //this._fuseProgressBarService.show();
        let formData = new FormData();
        let extension = this.UploadCandidateProfileImage[0].name.split('.')[1];
        if (extension == "jpeg" || extension == "jpg" || extension == "png" || extension == "gif") {
            formData.append('FileUpload', this.UploadCandidateProfileImage[0]);
            this.candidateService.SaveBlobProfileImage(formData).subscribe(result => {
                this.candidateprofileimageURL = '';
                this.UploadCandidateProfileImage = [];
                this.candidateprofileimageURL = result;
                this.isVisible = true;
                //this._fuseProgressBarService.hide();
                this._snackBar.open('Profile image uploaded successfully', null, {
                    duration: 3000
                });
            });
        }
        else {
            this._snackBar.open('Please upload resume with jpeg, jpg, png, gif Formats.', null, {
                duration: 1000
            });
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
    // remove(tag: string): void {
    //     const index = this.Tags.indexOf(tag);
    //     if (index >= 0) {
    //         this.Tags.splice(index, 1);
    //     }
    // }
    searchPlaces(val) {

        // let val1 = 'punjagutta';
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

    submitForm1() {
        // debugger;
        this.candidatesGridLoader = true;
        this.isVisible = false;
        if (this.firstFormGroup.valid) {
            //this._fuseProgressBarService.show();
            // for(let i=0; i< this.Tags.length; i++)
            // {
            //     let tagvalue = this.Tags[i] ;
            //     if(i==0)
            //    this.selectedskills = this.selectedskills + tagvalue;
            //     else
            //     this.selectedskills = this.selectedskills + ',' + tagvalue;
            // }
            // this.http.post<any>("https://hiringmanagerwebapidemo.azurewebsites.net/api/candidateService/createCandidate", {
            // this.http.post<any>("https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/createCandidate", {
            this.http.post<any>(this.apiUrl + "/api/candidateService/createCandidate", {
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
                Skills: this.selectedData.text,
                ProfileImage: this.candidateprofileimageURL,
                UserId: this.userID,
                Facebook: this.firstFormGroup.get('facebook').value,
                LinkedIn: this.firstFormGroup.get('linkedin').value,
                Twitter: this.firstFormGroup.get('twitter').value,
                GitHub: this.firstFormGroup.get('github').value,
                StackOverflow: this.firstFormGroup.get('stackoverflow').value,
            }).subscribe(data => {
                this.candidateID = data;

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

                    //  this.http.post('https://hiringmanagerwebapidemo.azurewebsites.net/api/candidateService/createCandidatEducationInfo', saveaCandidateInfo, {
                    this.http.post(this.apiUrl + '/api/candidateService/createCandidatEducationInfo', saveaCandidateInfo, {
                    }).subscribe(data => {
                    });
                }


                if (this.selectedsSkillData.length > 0) {

                    // this.http.post('https://hiringmanagerwebapidemo.azurewebsites.net/api/candidateService/CreateCandidateSkills',{
                    this.http.post(this.apiUrl + '/api/candidateService/CreateCandidateSkills', {
                        CandidateId: this.candidateID,
                        Skills: this.selectedsSkillData
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
                    //this.http.post("https://hiringmanagerwebapidemo.azurewebsites.net/api/candidateService/createCandidatExperianceInfo", saveaCandidateExperianceformInfo, {
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

                    // this.http.post("https://hiringmanagerwebapidemo.azurewebsites.net/api/candidateService/createCandidatAwardsAndCertificateInfo", saveaCandidateAwardsformInfo, {
                    this.http.post(this.apiUrl + "/api/candidateService/createCandidatAwardsAndCertificateInfo", saveaCandidateAwardsformInfo, {
                    }).subscribe(data => {


                    });
                }

                if (this.candidateID == 0 || this.candidateID === undefined || this.candidateID === null) {
                    alert('something went wrong');
                }
                else {
                    this.commonfieldName = this.firstFormGroup.get('candidateName').value;
                    this.commonfieldDesignation = this.firstFormGroup.get('designation').value;
                    this.commonfieldEmail = this.firstFormGroup.get('email').value;
                    this.commonfieldMobile = this.firstFormGroup.get('mobileno').value;
                    this.commonfieldLocation = this.firstFormGroup.get('candidate_location').value;
                    //this.reloadCandidatesPaginationList();
                    this.matdialog.closeAll();
                    // this.router.navigate(['/candidates/edit-candidate', this.candidateID]).then(page => 
                    //     {
                    //       this.ngOnInit();

                    //     });
                    Swal.fire(
                        'Candidate info saved successfully. Please upload latest resume',
                        '',
                        'success'
                    );
                }
                this.reloadCandidatesPaginationList();
                this.router.navigate(['/candidates/edit-candidate', this.candidateID]).then(page => {
                    this.ngOnInit();

                });
                this.ClearFields();
                this.candidatesGridLoader = false;

            });
        }
    }

    ClearFields() {
        this.firstFormGroup.setValue({
            candidatename: '',
            currentemployer: '',
            email: '',
            designation: '',
            candidate_location: '',
            dob: '',
            mobileno: '',
            experience: '',
            desiredsalary: '',
            overview: ''

        });
    }

    chkfolderStatus(event: MatRadioChange) {
        if (event.value)
            this.isNewFolder = true;
        else
            this.isNewFolder = false;
    }
    //     getfoldersbyuserid()
    //     {
    //     this.isVisible = false;
    //     var CandidateidpayLoad = {
    //         UserId: this.userID
    //     }
    //     this.candidateService.getFoldersbyUserId(CandidateidpayLoad).subscribe(res=>{
    //       this.folderList=[];
    //       this.folderList = res;
    //         this.isVisible = true;
    //     });
    //   }

    change(event) {
        this.gridOptions.columnApi.setColumnVisible(
            event.source.value,
            event.source.selected
        );
    }

    createNewFolder() {
        // debugger;
        this.isVisible = true;
        if (this.isNewFolder) {
            let folderexists = this.folderList.find((x) => x.FolderName === this.newFolderFormGroup.get('newfolder').value);
            if (!folderexists) {
                //  this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/CreateFolder', {
                this.http.post<any>(this.apiUrl + '/api/candidateService/CreateFolder', {
                    FolderName: this.newFolderFormGroup.get('newfolder').value,
                    UserId: this.userID,
                    CandidateIds: this.selectedCandidateIds,
                    Status: 1
                }).subscribe(data => {
                    this.isVisible = true;
                    Swal.fire(
                        this.newFolderFormGroup.get('newfolder').value + ' folder created successfully',
                        '',
                        'success'
                    );
                    this.reloadCandidatesPaginationList();
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
            //  this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/CreateFolder', {
            this.http.post<any>(this.apiUrl + '/api/candidateService/CreateFolder', {
                FolderName: this.newFolderFormGroup.get('newfolder').value,
                UserId: this.userID,
                CandidateIds: this.selectedCandidateIds,
                Status: 1
            }).subscribe(data => {
                this.isVisible = true;
                this.reloadCandidatesPaginationList();
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
    RemoveCandidate(Id: any) {
        this.selectedCandidates.forEach((element, index) => {
            if (element.Id == Id) {
                this.selectedCandidates.splice(index, 1);
            }
        });
        Swal.fire(
            'Removed selected candidates from New folder successfully',
            '',
            'success'
        );
    }
   


    // onFileChange(pFileList: File[]){
    //     this.files = Object.keys(pFileList).map(key => pFileList[key]);
    //     this._snackBar.open("Successfully upload!", 'Close', {
    //       duration: 2000,
    //     });
    //   }

    onFileChange(event: Event | DragEvent): void {
        let files: FileList | null = null;
    
        if (event instanceof DragEvent) {
          event.preventDefault(); 
          files = event.dataTransfer?.files || null;
        } else if (event instanceof Event) {
          const input = event.target as HTMLInputElement;
          files = input.files;
        }
    
        if (files) {
          this.files = Array.from(files);
          this.isVisible = false;
          console.log('Selected files:', this.files);
    
          if (this.files.length > 0) {
            this.resumeselectedFiles.push(this.files[0]);
            // Uncomment if needed
            this.saveuploadBlobResume();
          }
    
          this.isVisible = true;
          console.log('Files processed:', this.files);
    
          this._snackBar.open("Successfully uploaded!", 'Close', {
            duration: 2000,
          });
        }
      }
    
      onDragOver(event: DragEvent): void {
        event.preventDefault(); 
      }
    
      onDrop(event: DragEvent): void {
        this.onFileChange(event);
      }
    
      deleteFile(file: File): void {
        this.files = this.files.filter(f => f.name !== file.name);
        this._snackBar.open("Successfully deleted!", 'Close', {
          duration: 2000,
        });
      }
    
      openConfirmDialog(index: number): void {
        const dialogRef = this.dialog.open(DialogConfirmComponent, {
          panelClass: 'modal-xs'
        });
        dialogRef.componentInstance.fName = this.files[index].name;
        dialogRef.componentInstance.fIndex = index;
    
        dialogRef.afterClosed().subscribe(result => {
          if (result !== undefined) {
            this.deleteFromArray(result);
          }
        });
      }
    
      deleteFromArray(index: number): void {
        console.log('Files before deletion:', this.files);
        this.files.splice(index, 1);
      }
      saveuploadBlobResume() {
        this.isVisible = false;
        let formData = new FormData();
        let extension = this.resumeselectedFiles[0].name.split('.')[1];
        if (extension == "pdf" || extension == "docx" || extension == "doc" || extension == "txt") {
            formData.append('FileUpload', this.resumeselectedFiles[0]);
            formData.append('CreatedBy', this.userID);
            this.candidateService.SaveBlobResume(formData).subscribe(result => {
                this.resumeselectedFiles = [];
                this.isVisible = true;
                this._snackBar.open('Resume saved successfully', null, {
                    duration: 3000
                });
            })
        }
        else {
            this._snackBar.open('Please Upload Resume with Pdf, Doc, Docx, Txt Formats.', null, {
                duration: 1000
            });
        }
    }


    handleFileInput(files: FileList) {
        this.fileToUpload = files.item(0);
        if (this.fileToUpload.name.split('.')[1] == 'docx' || this.fileToUpload.name.split('.')[1] == 'pdf') {
            this.resumeselectedFiles.push(this.fileToUpload);
            if (this.resumeselectedFiles.length == 1) {
                this.ResumefieldName = this.resumeselectedFiles[0].name;
                console.log(this.resumeselectedFiles[0].name , 'this.resumeselectedFiles[0].name;')
            }
            else {
                this.ResumefieldName = this.ResumefieldName + "," + this.resumeselectedFiles[this.resumeselectedFiles.length - 1].name;
            }
            let formData = new FormData();
            formData.append('FileUpload', this.resumeselectedFiles[this.resumeselectedFiles.length - 1]);
            this.candidateService.UploadMultipleResumes(formData).subscribe(data => { });
        }
        else {
            Swal.fire(
                'Please upload word and pdf files only...',
                '',
                'success'
            );
            this.fileInput.nativeElement.value = null;
        }
    }

    // handleFileInput(files: File[]) {
    //     if (!files || files.length === 0) return;
      
    //     files.forEach(file => {
    //       if (file.name.split('.').pop()?.toLowerCase() === 'docx' || file.name.split('.').pop()?.toLowerCase() === 'pdf') {
    //         this.resumeselectedFiles.push(file);
    //       } else {
    //         Swal.fire(
    //           'Please upload word and pdf files only...',
    //           '',
    //           'warning'
    //         );
    //         return;
    //       }
    //     });
      
    //     this.ResumefieldName = this.resumeselectedFiles.map(file => file.name).join(', ');
      
    //     let formData = new FormData();
    //     this.resumeselectedFiles.forEach(file => formData.append('FileUpload', file));
      
    //     this.candidateService.UploadMultipleResumes(formData).subscribe(data => { });
    //   }
      


} 
