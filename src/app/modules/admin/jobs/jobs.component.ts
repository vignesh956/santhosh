import { Component,OnDestroy, OnInit, Output, EventEmitter, ViewEncapsulation, HostBinding, AfterViewInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { GridOptions } from '@ag-grid-community/all-modules';
import { DateRendererComponent } from './components/date-renderer.component';
import { JobGridActionbuttonsComponent } from './components/job-grid-actionbuttons.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { JobTitleLinkComponent } from './components/job-title-link.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../../services/authentication.service';
import { RepositoryConstant } from '../../constants/Repository.constant';
import pdfmake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfmake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import { CandidateService } from 'app/services/candidate.service';

@Component({
    selector: 'jobs',
    templateUrl: './jobs.component.html',
    styleUrls: ['./job.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class JobsComponent implements OnInit, OnDestroy {
    public apiUrl: string = RepositoryConstant.apiUrl;
    private gridApi;
    private gridColumnApi;
    private columnDefs;
    private defaultColDef;
    public rowData;
    private rowSelection;
    private jsonData = '';
    private frameworkComponents;
    private gridOptions: GridOptions;
    browserWidth: number = window.innerWidth;
    browserHeight: number = window.innerHeight;
    jobListSearchFilter = '';
    locationFilter = '';
    isIndeterminate: boolean;
    folders: any[];
    filters: any[];
    labels: any[];
    searchInput: FormControl;
    private _unsubscribeAll: Subject<any>;
    locationFormGroup: FormGroup;
    locations: any;
    selected: any;
    selectedView: any;
    jobsDrpdwnColumns: any;
    jobsDrpdwnformControl: any;
    loggedUserId;
    loggedcandidateId = 0;
    jobGridSearchFilter = '';
    gridtotRowCount;
    public isallChecked: boolean;
    printJob: any;
    isVisible: any = false;
    context: any;
    Jobs;
    Locations;
    JobStatus;
    JobTypes;
    FunctionalAreas;
    Industries;
    Shifts;
    ScreeningQuestions;
    SalaryCurrencies;
    Skills;
    Recruiters;
    RecruitersList;
    CompaniesList;
    Benefits;
    Companies;
    _JobTypes = new Map();
    _Skills = new Map();
    _Recruiters = new Map();
    _Benefits = new Map();
    _Industries = new Map();
    _FunctionalAreas = new Map();
    _Companies = new Map();
    selectedJob: any;
    isListView = true;
    WorkSite = ['Remote', 'On-Site'];
    recruitersList: any;
    selectedRecruiters = [];
    defaultSort = 'Newest to Oldest';
    selectSortBy = '';
    allLocationsSelected = [];
    allStatusSelected = [];
    allRecruitersSelected = [];
    allCompaniesSelected = [];
    allSitesSelected = [];
    selectedCount = 0;
    selectedJobIds = [];
    isBulkAction: boolean;
    QuestionareCount: any;
    openStatusCount = 0;
    archiveStatusCount = 0;
    otherStatusCount = 0;
    isGridBulkAction: boolean;
    openGridStatusCount = 0;
    archiveGridStatusCount = 0;
    otherGridStatusCount = 0;
    userSavedViews: any;
    selectedUserView: any;
    paginationTotalRecords = 0;
    paginationTotalPages = 0;
    paginationPageRecordsCntDisplay = 25;
    numbers = [];
    paginationCurrentPage = 0;
    pagingTotalRecords = 0;
    jobsGridLoader = false;
    loggedInfo: any;
    LoggedUserRole: any;
    filterApplied = false;
    selectedRowsCnt = 0;
    @ViewChild('pdfJobs', { static: false }) private pdfJobs: ElementRef;

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
            cellClass: 'grid-cell-centered',
            field: '',
            sortable: false,
            cellRenderer: 'JobGridActionbuttonsComponent',
            width: 150,
            // tslint:disable-next-line:only-arrow-functions typedef
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
            headerName: 'Id',
            field: 'id',
            cellClass: 'grid-cell-centered',
            filter: 'agTextColumnFilter',
            width: 80,
            dropdownItem: true
        },
        {
            headerName: 'Title',
            field: 'title',
            filter: 'agTextColumnFilter',
            tooltipField: 'Title',
            width: 250,
            dropdownItem: true
        },
        {
            headerName: 'Job Status',
            cellClass: 'grid-cell-centered',
            field: 'jobStatus',
            resizable: true,
            sortable: true,
            filter: 'agTextColumnFilter',
            tooltipField: 'JobStatus',
            width: 120,
            dropdownItem: true
        },
        {
            headerName: 'Location',
            field: 'location',
            cellClass: 'grid-cell-centered',
            columnGroupShow: 'closed',
            filter: 'agTextColumnFilter',
            tooltipField: 'Location',
            width: 120,
            dropdownItem: true
        },
        {
            headerName: 'Created Date',
            cellClass: 'grid-cell-centered',
            field: 'createdDate',
            resizable: true,
            cellRenderer: 'DateRendererComponent',
            filter: 'agDateColumnFilter',
            width: 150,
            dropdownItem: true
        },
        {
            headerName: 'Last Modified',
            cellClass: 'grid-cell-centered',
            field: 'modifiedDate',
            resizable: true,
            cellRenderer: 'DateRendererComponent',
            filter: 'agDateColumnFilter',
            width: 140,
            dropdownItem: true
        }
    ];

    /**
     * Constructor
     */
    constructor(
        private http: HttpClient,
        public datepipe: DatePipe,
        private formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private router: Router,
        private matdialog: MatDialog,
        private _authService: AuthenticationService,
        private candidateService: CandidateService
    ) {
        this.context = {
            componentParent: this
        };
        if (sessionStorage.getItem('view') == null || sessionStorage.getItem('view') == 'list') {
            this.selectedView = 'list';
        } else {
            this.selectedView = 'grid';
        }
        this.gridOptions = <GridOptions>{
            enableSorting: true,
            enableFilter: true,
        };
        // Column Defs
        this.gridOptions.columnDefs = this.webColumns;

        this.defaultColDef = {
            sortable: true,
            resizable: true,
            // width: 20
        };
        let arr = [];
        let arr2 = [];
        for (var val of this.webColumns) {
            if (val.dropdownItem) {
                arr.push(val);
                arr2.push(val.field);
            }
        }

        this.jobsDrpdwnformControl = new FormControl([
            'Id',
            'Title',
            'JobStatus',
            'Location',
            'CreatedDate',
            'ModifiedDate'
        ]);

        //this.jobsDrpdwnformControl = arr2;

        this.jobsDrpdwnColumns = arr;

        this.rowSelection = 'multiple';
        this.gridOptions.pagination = true;
        this.gridOptions.skipHeaderOnAutoSize = true;
        this.frameworkComponents = {
            DateRendererComponent: DateRendererComponent,
            JobGridActionbuttonsComponent: JobGridActionbuttonsComponent,
            JobTitleLinkComponent: JobTitleLinkComponent
        };
        this.searchInput = new FormControl('');
        this._unsubscribeAll = new Subject();
    }
    ngOnInit() {
        let LoggedUser = this._authService.getLoggedInfo();
        this.LoggedUserRole = LoggedUser.role;
        this.loggedUserId = LoggedUser.id;
        if (this.LoggedUserRole === 'Candidate') {
            this.loggedcandidateId = LoggedUser.candidateId;
        }
        this.getRecruiters();
        //this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/getJobProperties').subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/jobService/getJobProperties').subscribe(data => {
            this.JobTypes = data.jobTypes.$values;
            this.FunctionalAreas = data.functionalAreas.$values;
            this.Industries = data.industries.$values;
            this.Shifts = data.shifts.$values;
            this.ScreeningQuestions = data.screeningQuestions.$values;
            this.SalaryCurrencies = data.salaryCurrencies.$values;
            this.Skills = data.skills.$values;
            this.Recruiters = data.recruiters.$values;
            this.Benefits = data.providedBenefits.$values;
            this.Companies = data.companies.$values;
            for (const rec of this.JobTypes) {
                this._JobTypes.set(rec['Id'], rec['Name']);
            }
            for (const rec of this.Skills) {
                this._Skills.set(rec['Id'], rec['Name']);
            }
            for (const rec of this.Recruiters) {
                this._Recruiters.set(rec['Id'], rec['FirstName'] + ' ' + rec['LastName']);
            }
            for (const rec of this.Benefits) {
                this._Benefits.set(rec['Id'], rec['Name']);
            }

            for (const rec of this.Companies) {
                this._Companies.set(rec['Id'], rec['Name']);
            }

            for (const rec of this.Industries) {
                this._Industries.set(rec['Id'], rec['Name']);
            }

            for (const rec of this.FunctionalAreas) {
                this._FunctionalAreas.set(rec['Id'], rec['Name']);
            }
        });

        // this.getJobs();
        //this.getDefaultJobsListPagination(0);
        this.showView('list');

        // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/getJobLocations').subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/jobService/getJobLocations').subscribe(data => {
            this.Locations = data.location.$values;
            const locations = <FormArray>this.locationFormGroup.get('Locations') as FormArray;
            this.Locations.forEach(row => {
                this.allLocationsSelected.push(row);
                locations.push(new FormControl(row));
            });
        });

        //  this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/getJobStatus').subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/jobService/getJobStatus').subscribe(data => {
            this.JobStatus = data.$values;
            const status = <FormArray>this.locationFormGroup.get('status') as FormArray;
            this.JobStatus.forEach(row => {
                this.allStatusSelected.push(row);
                status.push(new FormControl(row));
            });

        });

        // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/getjobRecruiterlist').subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/jobService/getjobRecruiterlist').subscribe(data => {
            this.RecruitersList = data.$values;
            const recruiters = <FormArray>this.locationFormGroup.get('recruiters') as FormArray;
            this.RecruitersList.forEach(row => {
                this.allRecruitersSelected.push(row);
                recruiters.push(new FormControl(row));
            });
        });

        // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/getCompanies').subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/jobService/getCompanies').subscribe(data => {
            this.CompaniesList = data.$values;
            const companies = <FormArray>this.locationFormGroup.get('companies') as FormArray;
            this.CompaniesList.forEach(row => {
                this.allCompaniesSelected.push(row);
                companies.push(new FormControl(row));
            });
        });

        this.locationFormGroup = this.formBuilder.group({
            Locations: this.formBuilder.array([]),
            status: this.formBuilder.array([]),
            sites: this.formBuilder.array([]),
            recruiters: this.formBuilder.array([]),
            companies: this.formBuilder.array([])
        });

        const sites = <FormArray>this.locationFormGroup.get('sites') as FormArray;
        this.WorkSite.forEach(row => {
            this.allSitesSelected.push(row);
            sites.push(new FormControl(row));
        });
    }

    // tslint:disable-next-line:typedef
    testMethod() {
    }

    // tslint:disable-next-line:typedef
    onQuickFilterChanged() {
        this.gridOptions.api.setQuickFilter(this.jobGridSearchFilter);
    }

    @Output() onallChecked: EventEmitter<any> = new EventEmitter<any>();
    public allChecked(event: MatCheckbox): void {
        this.isallChecked = event.checked;
        if (event.checked) {
            this.selectedCount = this.Jobs.length;
        }
        else {
            this.selectedCount = 0;
        }
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngAfterViewInit(): void {
        if (!this.isVisible) {
            setTimeout(() => {
                this.isVisible = true;
            }, 1000);
        }
    }

    ngAfterContentViewInit(): void {
        if (!this.isVisible) {
            this.isVisible = true;
        }
    }
    // tslint:disable-next-line:typedef
    getSkillName(id) {
        return this._Skills.get(id);
    }

    // tslint:disable-next-line:typedef
    getJobTypeName(id) {
        return this._JobTypes.get(id);
    }

    // tslint:disable-next-line:typedef
    getJobRecruiterName(id) {
        return this._Recruiters.get(id);
    }

    // tslint:disable-next-line:typedef
    getBenefitName(id) {
        return this._Benefits.get(id);
    }

    getCompanyName(id) {
        return this._Companies.get(id);
    }

    // tslint:disable-next-line:typedef
    jobsKeywordSearchFilter() {
        this.resetPaginationControls();
        this.isVisible = false;
        this.filterApplied = true;
        if (this.LoggedUserRole != 'Candidate') {
            this.getLimitJobfilterByCompany(0);
        }
        else {
            this.getLimitJobfilterByCompanyCandidate(0);
        }
        // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/getLimitJobfilterByCompany', {
        //     CompanyId: 1,
        //     WorkSite: this.locationFormGroup.get('sites').value,
        //     Locations: this.locationFormGroup.get('Locations').value,
        //     status: this.locationFormGroup.get('status').value,
        //     RecruiterList: this.locationFormGroup.get('recruiters').value
        // }).subscribe(
        //     this.Jobs = data => {
        //         this.Jobs = data.filter(
        //             data => data.Title.toLocaleLowerCase().includes(this.jobListSearchFilter.toLocaleLowerCase()) ||
        //                 data.JobStatus.toLocaleLowerCase().includes(this.jobListSearchFilter.toLocaleLowerCase()) ||
        //                 data.Location.toLocaleLowerCase().includes(this.jobListSearchFilter.toLocaleLowerCase()) ||
        //                 data.Description.toLocaleLowerCase().includes(this.jobListSearchFilter.toLocaleLowerCase()) ||
        //                 data.WorkSite.toLocaleLowerCase().includes(this.jobListSearchFilter.toLocaleLowerCase())).sort((a, b) => {
        //             return this.compare(a.ModifiedDate, b.ModifiedDate, false);
        //         });
        //         this.isVisible = true;
        //         var myDiv = document.getElementById('divList');
        //         myDiv.scrollTop = 0;
        //     });
    }

    // tslint:disable-next-line:typedef
    sortChanged(event: any) {
        this.isVisible = false;
        this.selectSortBy = event.value;
        this.paginationCurrentPage = 0;
        if (this.LoggedUserRole != 'Candidate') {
            this.getLimitJobfilterByCompany(0);
        }
        else {
            this.getLimitJobfilterByCompanyCandidate(0);
        }
    }

    // tslint:disable-next-line:typedef
    // compare(a, b, isAsc) {
    //     return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    // }

    // tslint:disable-next-line:typedef
    redirectToEditJob(id: any) {
        Swal.fire({
            title: 'Are you sure want to edit the job?',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                sessionStorage.setItem('view', this.selectedView);
                this.router.navigate(['/post-job'], { queryParams: { Id: id } });
            }
        });
    }

    // tslint:disable-next-line:typedef
    onWindowResize(event) {
        this.browserWidth = event.target.innerWidth;
        // this.browserHeight = event.target.innerHeight;
        setTimeout(function () {
            if (this.browserWidth <= 520) {
                this.gridOptions.setColumnDefs(this.mobileColumn);
                this.params.api.sizeToFit();
                // this.gridApi.refresh();

            } else {
                this.gridOptions.setColumnDefs(this.webColumns);
                this.params.api.sizeToFit();
                // this.gridApi.refresh();
            }
        });
    }

    // tslint:disable-next-line:typedef
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
        const dialogRef = this.matdialog.open(templateRef, {
            width: _width,
            height: _height,
            autoFocus: false,
        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }

    // tslint:disable-next-line:typedef
    showView(viewName: any) {
        if (viewName === 'grid') {
            this.selectedView = 'grid';
            this.getJobs();
            sessionStorage.setItem('view', 'grid');
        } else {
            this.selectedView = 'list';
            this.reloadJobsPaginationList();
            sessionStorage.setItem('view', 'list');
        }
    }

    // tslint:disable-next-line:typedef
    enableListView() {
        this.isListView = true;
    }

    // tslint:disable-next-line:typedef
    disableListView() {
        this.isListView = false;
    }

    // tslint:disable-next-line:typedef
    sizeToFit() {
        this.gridApi.sizeColumnsToFit();
    }

    // tslint:disable-next-line:typedef
    autoSizeAll(skipHeader) {
        let allColumnIds = [];
        // tslint:disable-next-line:only-arrow-functions
        this.gridColumnApi.getAllColumns().forEach(function (column) {
            allColumnIds.push(column.colId);
        });
        this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
    }

    // tslint:disable-next-line:typedef
    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridtotRowCount = this.gridOptions.api.getDisplayedRowCount();
        this.rowData = [];
        this.gridtotRowCount = 0;
        //
        // this.http
        //     .get<any>(
        //         'https://hiringmanagerwebapi.azurewebsites.net/api/jobService/getJobListByCompanyId?CompanyId=1'
        //     )
        //     .subscribe(daJobGridActionbuttonsComponentta => {
        //         this.rowData = data.filter(data => this.locationFormGroup.get('Locations').value.includes(data.Location) && this.locationFormGroup.get('status').value.includes(data.JobStatus) && this.locationFormGroup.get('sites').value.includes(data.WorkSite));// && this.locationFormGroup.get('recruiters').value.includes(data.JobsRecruiters['1']));
        //         this.gridtotRowCount = this.gridOptions.api.getDisplayedRowCount();
        //     });
    }

    style = {
        width: '100%',
        height: '80vh',
        flex: '1 1 auto'
    };

    public printDescription(jobID) {
        this.generatePdf(jobID);
    }
    generatePdf(jobID: any) {
        throw new Error('Method not implemented.');
    }

    // tslint:disable-next-line:typedef
    formatRecord(job) {
        var rec = new Object();
        rec['Id'] = job['Id'];
        rec['Vacancies'] = job['Vacancies'];
        rec['Title'] = job['Title'];
        rec['Description'] = job['Description'];
        rec['ModifiedDate'] = job['ModifiedDate'];
        rec['TimeStamp'] = job['TimeStamp'];
        rec['Location'] = job['Location'];
        rec['SeniorityLevel'] = job['SeniorityLevel'];
        rec['JobStatus'] = job['JobStatus'];
        rec['JobsSalaries'] = job['JobsSalaries'];
        rec['WorkSite'] = job['WorkSite'];
        rec['Company'] = this.getCompanyName(job['CompanyId'].toString());
        rec['CompanyOverview'] = job['CompanyOverview'];
        rec['JobApplied'] = job['JobApplied'];
        rec['List_JobApplied'] = job['List_JobApplied'];
        rec['CompanyImage'] = job['CompanyImage'];
        let skills = [];
        for (let rec of job.JobsSkills) {
            let sname = this.getSkillName(rec);
            skills.push(sname);
        }
        rec['JobsSkills'] = skills;
        let jobTypes = [];
        for (let rec of job.JobsTypes) {
            let jobtypename = this.getJobTypeName(rec);
            jobTypes.push(jobtypename);
        }
        rec['JobsTypes'] = jobTypes;
        let jobRecruiters = [];
        for (let rec of job.JobsRecruiters) {
            let jobrecruiter = ' ' + this.getJobRecruiterName(rec);
            jobRecruiters.push(jobrecruiter);
        }
        rec['JobsRecruiters'] = jobRecruiters;
        return rec;
    }

    ngOnDestroy(): void {
        this.isVisible = false;
    }

    // tslint:disable-next-line:typedef
    viewJob(rec: any) {
        this.selectedJob = rec;
        sessionStorage.setItem('view', 'list');
    }

    // tslint:disable-next-line:typedef
    deleteJob(Id: any) {
        Swal.fire({
            title: 'Are you sure want to delete this job?',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                //  this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/deleteJob?JobId=' + Id).subscribe(data => {
                this.http.get<any>(this.apiUrl + '/api/jobService/deleteJob?JobId=' + Id).subscribe(data => {
                    if (this.selectedView === 'list') {
                        this.reloadJobsPaginationList();
                    } else {
                        this.getJobs();
                    }
                    Swal.fire(
                        'Job deleted successfully!',
                        '',
                        'success'
                    );
                });
            }
        });
    }

    // tslint:disable-next-line:typedef
    updateJobStatus(Id: any, status: any) {
        Swal.fire({
            title: 'Are you sure you want to ' + status + ' this Job?',
            text: 'Status : ' + status,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                sessionStorage.setItem('view', this.selectedView);
                // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/updateJobStatus', {
                this.http.post<any>(this.apiUrl + '/api/jobService/updateJobStatus', {
                    JobID: Id,
                    Status: status
                }).subscribe(data => {
                    if (this.selectedView === 'list') {
                        this.reloadJobsPaginationList();
                    } else {
                        this.getJobs();
                    }
                    this._snackBar.open('Job status updated successfully', '', {
                        duration: 3000
                    });
                    Swal.fire(
                        'Job status updated successfully!',
                        '',
                        'success'
                    );
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
            }
        });
    }

    // tslint:disable-next-line:typedef
    childOnChecked(isChecked: boolean, jobId: any, status: any) {
        var curStatus = status;
        if (isChecked) {
            if (curStatus == 'Open') {
                this.openStatusCount++;
            } else if (curStatus == 'Archive') {
                this.archiveStatusCount++;
            } else {
                this.otherStatusCount++;
            }
            this.selectedCount++;
            this.selectedJobIds.push(jobId);
        } else {
            if (curStatus == 'Open') {
                this.openStatusCount--;
            } else if (curStatus == 'Archive') {
                this.archiveStatusCount--;
            } else {
                this.otherStatusCount--;
            }
            this.selectedCount--;
            this.selectedJobIds.forEach((element, index) => {
                if (element == jobId) {
                    this.selectedJobIds.splice(index, 1);
                }
            });
        }
        if (this.selectedCount == this.Jobs.length) {
            this.isallChecked = true;
        }
        else if (this.selectedCount == 0) {
            this.isallChecked = false;
        }
        if (this.openStatusCount > 0 && this.archiveStatusCount == 0 && this.otherStatusCount == 0) {
            this.isBulkAction = true;
        } else if (this.archiveStatusCount > 0 && this.openStatusCount == 0 && this.otherStatusCount == 0) {
            this.isBulkAction = true;
        } else {
            this.isBulkAction = false;
        }
    }

    // tslint:disable-next-line:typedef
    locationexists(item) {
        return this.allLocationsSelected.indexOf(item) > -1;
    }

    // tslint:disable-next-line:typedef
    statusexists(item) {
        return this.allStatusSelected.indexOf(item) > -1;
    }

    // tslint:disable-next-line:typedef
    recruitersexists(item) {
        return this.allRecruitersSelected.indexOf(item) > -1;
    }

    companiesexists(item) {
        return this.allCompaniesSelected.indexOf(item) > -1;
    }

    // tslint:disable-next-line:typedef
    sitesexists(item) {
        return this.allSitesSelected.indexOf(item) > -1;
    }

    // tslint:disable-next-line:typedef
    locationIndeterminate() {
        return (this.allLocationsSelected.length > 0 && !this.isLocationChecked());
    }

    // tslint:disable-next-line:typedef
    statusIndeterminate() {
        return (this.allStatusSelected.length > 0 && !this.isStatusChecked());
    }

    companiesIndeterminate() {
        return (this.allCompaniesSelected.length > 0 && !this.isCompaniesChecked());
    }

    // tslint:disable-next-line:typedef
    recruitersIndeterminate() {
        return (this.allRecruitersSelected.length > 0 && !this.isRecruitersChecked());
    }

    // tslint:disable-next-line:typedef
    sitesIndeterminate() {
        return (this.allSitesSelected.length > 0 && !this.isSitesChecked());
    }

    // tslint:disable-next-line:typedef
    isLocationChecked() {
        if (this.Locations != undefined) {
            return this.allLocationsSelected.length === this.Locations.length;
        }
    }

    // tslint:disable-next-line:typedef
    isStatusChecked() {
        if (this.JobStatus != undefined) {
            return this.allStatusSelected.length === this.JobStatus.length;
        }
    }

    isCompaniesChecked() {
        if (this.Companies != undefined) {
            return this.allCompaniesSelected.length === this.Companies.length;
        }
    }

    // tslint:disable-next-line:typedef
    isRecruitersChecked() {
        if (this.RecruitersList != undefined) {
            return this.allRecruitersSelected.length === this.RecruitersList.length;
        }
    }

    // tslint:disable-next-line:typedef
    isSitesChecked() {
        if (this.WorkSite != undefined) {
            return this.allSitesSelected.length === this.WorkSite.length;
        }
    }

    // tslint:disable-next-line:typedef
    getBgColor() {
        if (this.selectedView === 'grid') {
            return 'accent';
        } else if (this.selectedView === 'list') {
            return 'accent';
        } else {
            return '';
        }
    }

    public selectedJobsList = new Map();

    onRowSelected(event) {
        var curStatus = event.node.data.JobStatus;
        if (event.node.isSelected()) {
            if (curStatus == 'Open') {
                this.openGridStatusCount++;
            } else if (curStatus == 'Archive') {
                this.archiveGridStatusCount++;
            } else {
                this.otherGridStatusCount++;
            }
        }
        else {
            if (curStatus == 'Open') {
                this.openGridStatusCount--;
            } else if (curStatus == 'Archive') {
                this.archiveGridStatusCount--;
            } else {
                this.otherGridStatusCount--;
            }
        }

        if (this.openGridStatusCount > 0 && this.archiveGridStatusCount == 0 && this.otherGridStatusCount == 0) {
            this.isGridBulkAction = true;
        } else if (this.archiveGridStatusCount > 0 && this.openGridStatusCount == 0 && this.otherGridStatusCount == 0) {
            this.isGridBulkAction = true;
        } else {
            this.isGridBulkAction = false;
        }
    }

    // tslint:disable-next-line:adjacent-overload-signatures
    onSelectionChanged() {
        let selectedRows = this.gridApi.getSelectedRows();
        console.log(selectedRows);
        if (selectedRows.length == 1) {
            this.selectedJob = true;
            this.viewJob(selectedRows[0]);
        } else {
            this.selectedJob = false;
        }
        this.selectedRowsCnt = selectedRows.length;
        // document.querySelector("#selectedRows").innerHTML =
        //     selectedRows.length === 1 ? selectedRows[0].Title : "";

        // this.selectedJobsList.set(selectedRows[0].Id, selectedRows[0].Title);
    }


    bulkCloseJobs() {
        let jobIds = [];

        let selectedRows = this.gridApi.getSelectedRows();

        for (let i = 0; i < selectedRows.length; i++) {
            jobIds[i] = selectedRows[i].Id;

        }

        // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/updateMultipleJobStatus', {
        this.http.post<any>(this.apiUrl + '/api/jobService/updateMultipleJobStatus', {
            JobID: jobIds,
            Status: 'Archive'
        }).subscribe(data => {
            this.selectedRowsCnt = 0;
            this.openGridStatusCount = 0;
            this.archiveGridStatusCount = 0;
            this.otherGridStatusCount = 0;
            if (this.selectedView === 'list') {
                this.reloadJobsPaginationList();
            } else {
                this.getJobs();
            }
            //this.showUserView();
            Swal.fire(
                'Job(s) status updated successfully!',
                '',
                'success'
            );

        });

        console.log(jobIds);
    }

    bulkCloseListJobs() {
        let jobIds = [];

        let selectedRows = this.selectedJobIds;

        for (let i = 0; i < selectedRows.length; i++) {
            jobIds[i] = selectedRows[i];

        }

        //  this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/updateMultipleJobStatus', {
        this.http.post<any>(this.apiUrl + '/api/jobService/updateMultipleJobStatus', {
            JobID: jobIds,
            Status: 'Archive'
        }).subscribe(data => {
            this.selectedCount = 0;
            this.openStatusCount = 0;
            this.archiveStatusCount = 0;
            this.otherStatusCount = 0;
            this.selectedJobIds = [];
            if (this.selectedView === 'list') {
                this.reloadJobsPaginationList();
            } else {
                this.getJobs();
            }
            //this.showUserView();
            Swal.fire(
                'Job(s) status updated successfully!',
                '',
                'success'
            );

        });

        console.log(jobIds);
    }

    bulkOpenJobs() {
        let jobIds = [];
        let selectedRows = this.gridApi.getSelectedRows();

        for (let i = 0; i < selectedRows.length; i++) {
            jobIds[i] = selectedRows[i].Id;

        }

        //  this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/updateMultipleJobStatus', {
        this.http.post<any>(this.apiUrl + '/api/jobService/updateMultipleJobStatus', {
            JobID: jobIds,
            Status: 'Open'
        }).subscribe(data => {
            this.selectedRowsCnt = 0;
            this.openGridStatusCount = 0;
            this.archiveGridStatusCount = 0;
            this.otherGridStatusCount = 0;
            if (this.selectedView === 'list') {
                this.reloadJobsPaginationList();
            } else {
                this.getJobs();
            }
            Swal.fire(
                'Job(s) status updated successfully!',
                '',
                'success'
            );

        });
    }

    bulkOpenListJobs() {
        let jobIds = [];
        let selectedRows = this.selectedJobIds;

        for (let i = 0; i < selectedRows.length; i++) {
            jobIds[i] = selectedRows[i];

        }

        // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/updateMultipleJobStatus', {
        this.http.post<any>(this.apiUrl + '/api/jobService/updateMultipleJobStatus', {
            JobID: jobIds,
            Status: 'Open'
        }).subscribe(data => {
            this.selectedCount = 0;
            this.openStatusCount = 0;
            this.archiveStatusCount = 0;
            this.otherStatusCount = 0;
            this.selectedJobIds = [];
            if (this.selectedView === 'list') {
                this.reloadJobsPaginationList();
            } else {
                this.getJobs();
            }
            Swal.fire(
                'Job(s) status updated successfully!',
                '',
                'success'
            );

        });
    }

    bulkReassignListJobs() {
        let jobIds = [];
        let selectedRows = this.selectedJobIds;

        for (let i = 0; i < selectedRows.length; i++) {
            jobIds[i] = selectedRows[i];

        }

        // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/reassignJobRecruiters', {
        this.http.post<any>(this.apiUrl + '/api/jobService/reassignJobRecruiters', {
            JobIds: jobIds,
            RecruitersIds: this.selectedRecruiters
        }).subscribe(data => {
            this.selectedCount = 0;
            this.openStatusCount = 0;
            this.archiveStatusCount = 0;
            this.otherStatusCount = 0;
            this.selectedJobIds = [];
            this.selectedRecruiters = [];
            this.isVisible = true;
            if (this.selectedView === 'list') {
                this.reloadJobsPaginationList();
            } else {
                this.getJobs();
            }
            
            this.matdialog.closeAll();
            Swal.fire(
                'Recruiters updated successfully!',
                '',
                'success'
            );
        });
    }

    bulkReassignGridJobs() {
        let jobIds = [];
        let selectedRows = this.gridApi.getSelectedRows();

        for (let i = 0; i < selectedRows.length; i++) {
            jobIds[i] = selectedRows[i].Id;
        }

        //  this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/reassignJobRecruiters', {
        this.http.post<any>(this.apiUrl + '/api/jobService/reassignJobRecruiters', {
            JobIds: jobIds,
            RecruitersIds: this.selectedRecruiters
        }).subscribe(data => {
            this.selectedRowsCnt = 0;
            this.openGridStatusCount = 0;
            this.archiveGridStatusCount = 0;
            this.otherGridStatusCount = 0;
            this.selectedRecruiters = [];
            if (this.selectedView === 'list') {
                this.reloadJobsPaginationList();
            } else {
                this.getJobs();
            }
            this.matdialog.closeAll();
            Swal.fire(
                'Recruiters updated successfully!',
                '',
                'success'
            );
        });
    }

    // tslint:disable-next-line:typedef
    shareJob() {
        const jobIds = [];

        if (this.selectedView === 'list') {
            const selectedRows = this.selectedJobIds;

            for (let i = 0; i < selectedRows.length; i++) {
                jobIds[i] = selectedRows[i];
            }
        } else {
            const selectedRows = this.gridApi.getSelectedRows();
            for (let i = 0; i < selectedRows.length; i++) {
                jobIds[i] = selectedRows[i].Id;
            }
        }

        //  this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/sharejob', {
        this.http.post<any>(this.apiUrl + '/api/jobService/sharejob', {
            JobIds: jobIds,
            RecruitersIds: this.selectedRecruiters,
            sender: this.loggedUserId
        }).subscribe(data => {
            this.selectedRowsCnt = 0;
            this.selectedRecruiters = [];
            if (this.selectedView === 'list') {
                this.reloadJobsPaginationList();
            } else {
                this.getJobs();
            }
            this.matdialog.closeAll();
            Swal.fire(
                'Job(s) info shared successfully!',
                '',
                'success'
            );
        });
    }

    change(event) {
        this.gridOptions.columnApi.setColumnVisible(
            event.source.value,
            event.source.selected
        );
    }

    getUserViews() {
        ///  this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/getJobsViewByUserId?UserId=' + this.loggedUserId).subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/jobService/getJobsViewByUserId?UserId=' + this.loggedUserId).subscribe(data => {
            this.userSavedViews = data;
        });
    }

    showUserView() {
        this.selectedRowsCnt = 0;
        this.allLocationsSelected = [];
        this.allStatusSelected = [];
        const locations = <FormArray>this.locationFormGroup.get('Locations') as FormArray;
        locations.clear();
        this.Locations.forEach(row => {
            this.allLocationsSelected.push(row);
            locations.push(new FormControl(row));
        });
        const status = <FormArray>this.locationFormGroup.get('status') as FormArray;
        status.clear();
        this.JobStatus.forEach(row => {
            this.allStatusSelected.push(row);
            status.push(new FormControl(row));
        });
        if (this.selectedUserView == 'defaultUserView') {
            this.gridApi.setColumnDefs([]);
            this.gridApi.setColumnDefs(this.webColumns);
            this.getJobs();
        } else {
            let viewData;
            //  this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/getJobsView?Id=' + this.selectedUserView).subscribe(data => {
            this.http.get<any>(this.apiUrl + '/api/jobService/getJobsView?Id=' + this.selectedUserView).subscribe(data => {
                if (data != undefined && data != null) {
                    viewData = data;
                    let firstRecord = viewData[0];
                    let newColdDefs = [];

                    if (firstRecord['Id']) {

                        const chkboxRow = {
                            headerName: '',
                            field: '',
                            showCol: false,
                            checkboxSelection: true,
                            headerCheckboxSelection: true,
                            width: 50,
                            dropdownItem: false
                        };
                        newColdDefs.push(chkboxRow);


                        const actionRow = {
                            headerName: 'Action',
                            field: '',
                            cellRenderer: 'JobGridActionbuttonsComponent',
                            width: 200,
                            valueGetter: function (params) {
                                return {
                                    Id: params.data.Id,
                                    Title: params.data.Title,
                                    params: params
                                };
                            },
                            dropdownItem: false
                        };

                        newColdDefs.push(actionRow);

                        const jobId = {
                            headerName: 'Id',
                            field: 'Id'

                        };
                        newColdDefs.push(jobId);
                    }

                    if (firstRecord['Title']) {
                        const title = {
                            headerName: 'Title',
                            field: 'Title'

                        };
                        newColdDefs.push(title);
                    }

                    if (firstRecord['JobStatus']) {
                        const title = {
                            headerName: 'JobStatus',
                            field: 'JobStatus',
                            resizable: true,
                            sortable: true,
                            filter: 'agTextColumnFilter',
                            width: 150,
                            dropdownItem: true
                        };
                        newColdDefs.push(title);
                    }

                    if (firstRecord['Location']) {
                        const loc = {
                            headerName: 'Location',
                            field: 'Location',
                            columnGroupShow: 'closed',
                            filter: 'agTextColumnFilter',
                            width: 150,
                            dropdownItem: true

                        };
                        newColdDefs.push(loc);
                    }

                    if (firstRecord['CreatedDate']) {
                        const loc = {
                            headerName: 'CreatedDate',
                            field: 'CreatedDate',
                            resizable: true,
                            cellRenderer: 'DateRendererComponent',
                            filter: 'agDateColumnFilter',
                            width: 150,
                            dropdownItem: true

                        };
                        newColdDefs.push(loc);
                    }

                    if (firstRecord['ModifiedDate']) {
                        const loc = {
                            headerName: 'Last Modified',
                            field: 'ModifiedDate',
                            resizable: true,
                            cellRenderer: 'DateRendererComponent',
                            filter: 'agDateColumnFilter',
                            width: 150,
                            dropdownItem: true

                        };
                        newColdDefs.push(loc);
                    }

                    this.gridApi.setColumnDefs([]);
                    this.gridApi.setColumnDefs(newColdDefs);
                    this.gridOptions.api.setRowData(data);
                    this.gridtotRowCount = this.gridOptions.api.getDisplayedRowCount();
                    this._snackBar.open('View loaded successfully', '', {
                        duration: 3000
                    });
                } else {
                    this.getJobs();
                }
            });
        }
    }

    onGridFilterChanged() {
        this.gridtotRowCount = this.gridOptions.api.getDisplayedRowCount();
    }

    updateTimeStamp(Id: any) {
        // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/updateJobTimeStamp?JobId=' + Id, {}).subscribe(data => {
        this.http.post<any>(this.apiUrl + '/api/jobService/updateJobTimeStamp?JobId=' + Id, {}).subscribe(data => {
            console.log(data);
        });
    }

    resetFilters() {
        this.isVisible = false;
        this.jobGridSearchFilter = '';
        this.jobListSearchFilter = '';
        this.locationFilter = '';
        this.selectSortBy = 'Newest to Oldest';
        this.selectedRowsCnt = 0;
        this.allCompaniesSelected = [];
        this.allLocationsSelected = [];
        this.allStatusSelected = [];
        this.allSitesSelected = [];
        this.allRecruitersSelected = [];
        const companies = <FormArray>this.locationFormGroup.get('companies') as FormArray;
        companies.clear();
        this.CompaniesList.forEach(row => {
            this.allCompaniesSelected.push(row);
            companies.push(new FormControl(row));
        });
        const locations = <FormArray>this.locationFormGroup.get('Locations') as FormArray;
        locations.clear();
        this.Locations.forEach(row => {
            this.allLocationsSelected.push(row);
            locations.push(new FormControl(row));
        });
        const status = <FormArray>this.locationFormGroup.get('status') as FormArray;
        status.clear();
        this.JobStatus.forEach(row => {
            this.allStatusSelected.push(row);
            status.push(new FormControl(row));
        });
        const sites = <FormArray>this.locationFormGroup.get('sites') as FormArray;
        sites.clear();
        this.WorkSite.forEach(row => {
            this.allSitesSelected.push(row);
            sites.push(new FormControl(row));
        });
        const recruiters = <FormArray>this.locationFormGroup.get('recruiters') as FormArray;
        recruiters.clear();
        this.RecruitersList.forEach(row => {
            this.allRecruitersSelected.push(row);
            recruiters.push(new FormControl(row));
        });
        this.isVisible = true;
        this.resetPaginationControls();
        this.reloadJobsPaginationList();

    }

    getRecruiters() {
        //  this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/getlistOfRecruiters').subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/jobService/getlistOfRecruiters').subscribe(data => {
            this.recruitersList = data;
            console.log(this.recruitersList  , 'this.recruitersList ')
        });
    }

    selectedrecruiters(event) {
        console.log(event.value , 'vvvvvvvvvvvvvvvvvvvv')
        this.selectedRecruiters = event.value;
    }

    formatString(val) {
        return val.toString();
    }

    saveUserView() {
        let userInputViewName = window.prompt('Please enter view name', 'Portland Jobs List');

        let viewName = userInputViewName.trim();

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
                if (filterState['Location']) {
                    const loc = {
                        filterId: 'Location',
                        filterType: filterState['Location']['type'],
                        type: filterState['Location']['type'],
                        filter: filterState['Location']['filter']
                    };
                    filterArr.push(loc);
                }

                if (filterState['Id']) {
                    const jobId = {
                        filterId: 'Id',
                        filterType: filterState['Id']['type'],
                        type: filterState['Id']['type'],
                        filter: filterState['Id']['filter']
                    };
                    filterArr.push(jobId);
                }

                if (filterState['JobStatus']) {
                    const jobStatus = {
                        filterId: 'JobStatus',
                        filterType: filterState['JobStatus']['type'],
                        type: filterState['JobStatus']['type'],
                        filter: filterState['JobStatus']['filter']
                    };
                    filterArr.push(jobStatus);
                }

                if (filterState['Title']) {
                    const jobTitle = {
                        filterId: 'Title',
                        filterType: filterState['Title']['type'],
                        type: filterState['Title']['type'],
                        filter: filterState['Title']['filter']
                    };
                    filterArr.push(jobTitle);
                }

                if (_colState.length > 0) {
                    const headers = { 'content-type': 'application/json' };
                    const body = JSON.stringify({
                        GridName: 'Jobs',
                        ViewName: viewName,
                        UserId: this.loggedUserId,
                        ColumnState: _colState,
                        FilterState: filterArr,
                        ViewType: 'public'
                    });
                    this.http
                        //  .post('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/saveJobsView', body, {
                        .post(this.apiUrl + '/api/jobService/saveJobsView', body, {
                            headers: headers
                        })
                        .subscribe(data => {
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

    cloneJob(jobID) {
        Swal.fire({
            title: 'Are you sure you want to clone the Job?',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                sessionStorage.setItem('view', this.selectedView);
                //  this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/clonejob?JobId=' + jobID).subscribe(data => {
                this.http.get<any>(this.apiUrl + '/api/jobService/clonejob?JobId=' + jobID).subscribe(data => {
                    if (data > 0) {
                        console.log(data);
                        Swal.fire(
                            'Record clone completed successfully',
                            '',
                            'success'
                        );
                        this.selectedRowsCnt = 0;
                        this.router.navigate(['/apps/job/edit-job/', data]);
                    } else {
                        Swal.fire(
                            'Something went wrong!',
                            '',
                            'error'
                        );
                    }
                });
            }
        });
    }

    // bulkPrintJob(){
    //     const jobIds = [];
    //     if (this.selectedView === 'list') {
    //         const selectedRows = this.selectedJobIds;

    //         for (let i = 0; i < selectedRows.length; i++) {
    //             jobIds[i] = selectedRows[i];
    //         }
    //     } else {
    //         const selectedRows = this.gridApi.getSelectedRows();
    //         for (let i = 0; i < selectedRows.length; i++) {
    //             jobIds[i] = selectedRows[i].Id;
    //         }
    //     }
    // }

    // tslint:disable-next-line:typedef
    printJobs = [];
    bulkPrintJob() {
        this.printJobs = [];
        const jobIds = [];
        if (this.selectedView === 'list') {
            const selectedRows = this.selectedJobIds;
            for (let i = 0; i < selectedRows.length; i++) {
                jobIds[i] = selectedRows[i];
            }
        } else {
            const selectedRows = this.gridApi.getSelectedRows();
            for (let i = 0; i < selectedRows.length; i++) {
                jobIds[i] = selectedRows[i].Id;
            }
        }
        
        console.log("Selected Job IDs:", jobIds); // Log selected job IDs to verify
        
        Swal.fire({
            title: 'Are you sure you want to print the Job?',
            text: '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                let jobs = this.Jobs;
                console.log("All Jobs:", jobs); // Log all jobs to verify
                for (let job of jobs) {
                    if (jobIds.includes(job['id'])) {
                        this.printJobs.push(job);
                    }
                }
                console.log("Print Jobs:", this.printJobs); // Log print jobs to verify
                this.printJobsPdf();
            }
        });
    }
    
    printJobsPdf() {
        const pdfJobs = this.pdfJobs.nativeElement;
        setTimeout(function () {
            const documentDefinition = {
                content: htmlToPdfmake(pdfJobs.innerHTML),
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

    // tslint:disable-next-line:typedef
    getJobTypes(selectedJob) {
        let string = '';
        string = this.getJobTypeName(selectedJob['JobsTypes'][0]);
        return string;
    }

    // tslint:disable-next-line:typedef
    getJobSkills(selectedJob) {
        let JobsSkills = selectedJob['JobsSkills'];
        let string = '';
        for (let i = 0; i < JobsSkills.length; i++) {
            string += this._Skills.get(JobsSkills[i]) + ", ";
        }
        return string;
    }

    // Filters
    // tslint:disable-next-line:typedef
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
        } else if (filterType === 'recruiters') {
            const recruiters = <FormArray>this.locationFormGroup.get('recruiters') as FormArray;
            if (event.checked) {
                recruiters.push(new FormControl(event.source.value));
                this.allRecruitersSelected.push(item);
            } else {
                const i = recruiters.controls.findIndex(x => x.value === event.source.value);
                recruiters.removeAt(i);
                const index = this.allRecruitersSelected.indexOf(item);
                if (index >= 0) {
                    this.allRecruitersSelected.splice(index, 1);
                }
            }
        } else if (filterType === 'worksite') {
            const sites = <FormArray>this.locationFormGroup.get('sites') as FormArray;
            if (event.checked) {
                sites.push(new FormControl(event.source.value));
                this.allSitesSelected.push(item);
            } else {
                const i = sites.controls.findIndex(x => x.value === event.source.value);
                sites.removeAt(i);
                const index = this.allSitesSelected.indexOf(item);
                if (index >= 0) {
                    this.allSitesSelected.splice(index, 1);
                }
            }
        } else if (filterType === 'jobstatus') {
            const status = <FormArray>this.locationFormGroup.get('status') as FormArray;
            if (event.checked) {
                status.push(new FormControl(event.source.value));
                this.allStatusSelected.push(item);
            } else {
                const i = status.controls.findIndex(x => x.value === event.source.value);
                status.removeAt(i);
                const index = this.allStatusSelected.indexOf(item);
                if (index >= 0) {
                    this.allStatusSelected.splice(index, 1);
                }
            }
        } else if (filterType === 'companies') {
            const companies = <FormArray>this.locationFormGroup.get('companies') as FormArray;
            if (event.checked) {
                companies.push(new FormControl(event.source.value));
                this.allCompaniesSelected.push(item);
            } else {
                const i = companies.controls.findIndex(x => x.value === event.source.value);
                companies.removeAt(i);
                const index = this.allCompaniesSelected.indexOf(item);
                if (index >= 0) {
                    this.allCompaniesSelected.splice(index, 1);
                }
            }
        }
        if (this.LoggedUserRole != 'Candidate') {
            this.getLimitJobfilterByCompany(0);
        }
        else {
            this.getLimitJobfilterByCompanyCandidate(0);
        }
    }

    // tslint:disable-next-line:typedef
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
        } else if (filterType === 'recruiters') {
            const recruiters = <FormArray>this.locationFormGroup.get('recruiters') as FormArray;
            recruiters.clear();
            if (event.checked) {
                this.RecruitersList.forEach(row => {
                    this.allRecruitersSelected.push(row);
                    recruiters.push(new FormControl(row));
                });
            } else {
                this.allRecruitersSelected.length = 0;
                const i = recruiters.controls.findIndex(x => x.value === event.source.value);
                recruiters.removeAt(i);
            }
        } else if (filterType === 'jobstatus') {
            const status = <FormArray>this.locationFormGroup.get('status') as FormArray;
            status.clear();
            if (event.checked) {
                this.JobStatus.forEach(row => {
                    this.allStatusSelected.push(row);
                    status.push(new FormControl(row));
                });
            } else {
                this.allStatusSelected.length = 0;
                const i = status.controls.findIndex(x => x.value === event.source.value);
                status.removeAt(i);
            }
        } else if (filterType === 'worksite') {
            const sites = <FormArray>this.locationFormGroup.get('sites') as FormArray;
            sites.clear();
            if (event.checked) {
                this.WorkSite.forEach(row => {
                    this.allSitesSelected.push(row);
                    sites.push(new FormControl(row));
                });
            } else {
                this.allSitesSelected.length = 0;
                const i = sites.controls.findIndex(x => x.value === event.source.value);
                sites.removeAt(i);
                this.selectedJob = false;
            }
        } else if (filterType === 'companies') {
            const companies = <FormArray>this.locationFormGroup.get('companies') as FormArray;
            companies.clear();
            if (event.checked) {
                this.CompaniesList.forEach(row => {
                    this.allCompaniesSelected.push(row);
                    companies.push(new FormControl(row));
                });
            } else {
                this.allCompaniesSelected.length = 0;
                const i = companies.controls.findIndex(x => x.value === event.source.value);
                companies.removeAt(i);
                this.selectedJob = false;
            }
        }
        this.isVisible = true;
        if (this.LoggedUserRole != 'Candidate') {
            this.getLimitJobfilterByCompany(0);
        }
        else {
            this.getLimitJobfilterByCompanyCandidate(0);
        }

    }

    // Filters Ends here

    // tslint:disable-next-line:typedef
    getLimitJobfilterByCompany(start) {
        //this.joblistLoader = true;
        this.isVisible = false;
        this.Jobs = [];
        // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/getJobsListByPagination', {
        this.http.post<any>(this.apiUrl + '/api/jobService/getJobsListByPagination', {
            start: start,
            length: this.paginationPageRecordsCntDisplay,
            Locations: this.locationFormGroup.get('Locations').value,
            Status: this.locationFormGroup.get('status').value,
            RecruiterList: this.locationFormGroup.get('recruiters').value,
            Companies: this.locationFormGroup.get('companies').value,
            WorkSite: this.locationFormGroup.get('sites').value,
            SearchKeyword: this.jobListSearchFilter,
            SortBy: this.selectSortBy
        }).subscribe(data => {
            //this.joblistLoader = false;
            this.Jobs = data.data;
            this.rowData = data.$values.data;
            this.paginationTotalRecords = data['recordsTotal'];
            this.paginationTotalPages = data['TotalPages'];
            this.numbers = Array(this.paginationTotalPages).fill(0).map((x, i) => i);
            this.isVisible = true;
            //var myDiv = document.getElementById('divList');
            //myDiv.scrollTop = 0;
        });

        this.selectedRowsCnt = 0;
        this.selectedCount = 0;
        this.selectedJobIds = [];
    }

    getLimitJobfilterByCompanyCandidate(start) {
        //this.joblistLoader = true;
        this.isVisible = false;
        this.Jobs = [];
        //this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/getJobsListForCandidateByPagination', {
        this.http.post<any>(this.apiUrl + '/api/jobService/getJobsListForCandidateByPagination', {
            start: start,
            length: this.paginationPageRecordsCntDisplay,
            Locations: this.locationFormGroup.get('Locations').value,
            Companies: this.locationFormGroup.get('companies').value,
            WorkSite: this.locationFormGroup.get('sites').value,
            SearchKeyword: this.jobListSearchFilter,
            SortBy: this.selectSortBy,
            CandidateId: this.loggedcandidateId
        }).subscribe(data => {
            //this.joblistLoader = false;
            this.Jobs = data.data;
            this.rowData = data.$values.data;
            this.paginationTotalRecords = data['recordsTotal'];
            this.paginationTotalPages = data['TotalPages'];
            this.numbers = Array(this.paginationTotalPages).fill(0).map((x, i) => i);
            this.isVisible = true;
            //var myDiv = document.getElementById('divList');
            //myDiv.scrollTop = 0;
        });

        this.selectedRowsCnt = 0;
        this.selectedCount = 0;
        this.selectedJobIds = [];
    }


    // tslint:disable-next-line:typedef
    onClickJobsListPage(number) {
        this.paginationCurrentPage = number;
        if (this.LoggedUserRole != 'Candidate') {
            if (this.filterApplied) {
                if (number === 0) {
                    this.getLimitJobfilterByCompany(0);
                } else {
                    number = number * this.paginationPageRecordsCntDisplay;
                    this.getLimitJobfilterByCompany(number);
                }
            } else {
                if (number === 0) {
                    this.getDefaultJobsListPagination(0);
                } else {
                    number = number * this.paginationPageRecordsCntDisplay;
                    this.getDefaultJobsListPagination(number);
                }
            }
        }
        else {
            if (this.filterApplied) {
                if (number === 0) {
                    this.getLimitJobfilterByCompanyCandidate(0);
                } else {
                    number = number * this.paginationPageRecordsCntDisplay;
                    this.getLimitJobfilterByCompanyCandidate(number);
                }
            } else {
                if (number === 0) {
                    this.getDefaultJobsListPaginationCandidate(0);
                } else {
                    number = number * this.paginationPageRecordsCntDisplay;
                    this.getDefaultJobsListPaginationCandidate(number);
                }
            }
        }
    }

    // tslint:disable-next-line:typedef
    reloadJobsPaginationList() {
        this.onClickJobsListPage(this.paginationCurrentPage);
    }

    // tslint:disable-next-line:typedef
    getDefaultJobsListPagination($start) {
        this.Jobs = [];
        this.isVisible = false;
        //this.joblistLoader = true;
        //  this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/getJobsListByPagination', {
        this.http.post<any>(this.apiUrl + '/api/jobService/getJobsListByPagination', {
            start: $start,
            length: this.paginationPageRecordsCntDisplay,
            Locations: ['All'],
            Status: ['All'],
            RecruiterList: ['All'],
            Companies: ['All'],
            WorkSite: ['All'],
            SearchKeyword: '',
            SortBy: 'Newest to Oldest'
        }).subscribe(data => {
            //this.joblistLoader = false;
            this.Jobs = data.data;
            // this.rowData = data.$values.data;
            this.paginationTotalRecords = data['recordsTotal'];
            this.paginationTotalPages = data['TotalPages'];
            this.numbers = Array(this.paginationTotalPages).fill(0).map((x, i) => i);
            this.isVisible = true;
        });
        this.selectedRowsCnt = 0;
        this.selectedCount = 0;
        this.selectedJobIds = [];
    }

    getDefaultJobsListPaginationCandidate($start) {
        this.Jobs = [];
        this.isVisible = false;
        //this.joblistLoader = true;
        //  this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/getJobsListForCandidateByPagination', {
        this.http.post<any>(this.apiUrl + '/api/jobService/getJobsListForCandidateByPagination', {
            start: $start,
            length: this.paginationPageRecordsCntDisplay,
            Locations: ['All'],
            Companies: ['All'],
            WorkSite: ['All'],
            SearchKeyword: '',
            SortBy: 'Newest to Oldest',
            CandidateId: this.loggedcandidateId
        }).subscribe(data => {
            //this.joblistLoader = false;
            this.Jobs = data.data;
            this.rowData = data.$values.data;
            this.paginationTotalRecords = data['recordsTotal'];
            this.paginationTotalPages = data['TotalPages'];
            this.numbers = Array(this.paginationTotalPages).fill(0).map((x, i) => i);
            this.isVisible = true;
        });
        this.selectedRowsCnt = 0;
        this.selectedCount = 0;
        this.selectedJobIds = [];
    }

    resetPaginationControls() {
        this.paginationTotalRecords = 0;
        this.paginationTotalPages = 0;
        this.paginationCurrentPage = 0;
    }


    GetCheckedQuestionnaireList(jobid) {
        //this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/GetCheckedQuestionnaireList?JobId='+ jobid).subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/jobService/GetCheckedQuestionnaireList?JobId=' + jobid).subscribe(data => {
            this.QuestionareCount = data.Table1;
        });
    }


    // tslint:disable-next-line:typedef
    getJobs() {
        // this.gridtotRowCount = 0;
         this.gridOptions.api.setRowData([]);
        this.jobsGridLoader = true;
        this.selectedCount = 0;
        this.selectedJobIds = [];
        //this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/getJobListByCompanyId').subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/jobService/getJobListByCompanyId').subscribe(data => {
            this.jobsGridLoader = false;
            //debugger;
            this.selectedJob = this.Jobs[0];
            this.gridOptions.api.setRowData(data);
            this.gridtotRowCount = this.gridOptions.api.getDisplayedRowCount();
            this.gridApi.refresh;
        });
        this.getUserViews();
    }

    onPaginateChange($event) {
        this.onClickJobsListPage($event['pageIndex']);
    }

    ApplySingleJob(candidateid, selectedjobid) {
        this.selectedJobIds.push(selectedjobid);
        let cid = parseInt(candidateid);
        //this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/ApplyJobByCandidate',
        this.http.post<any>(this.apiUrl + '/api/candidateService/ApplyJobByCandidate',
            {
                CandidateId: cid,
                JobIds: this.selectedJobIds,
                CandidateIds: null
            }).subscribe(data => {
                this.onClickJobsListPage(this.paginationCurrentPage);
                Swal.fire(
                    'Job Applied successfully!',
                    '',
                    'success'
                );
            });
        this.selectedJobIds = [];
        this.matdialog.closeAll();
        //this._fuseProgressBarService.hide();
        this.candidateService.CreateCandidateActivity(candidateid, 'ApplyJob', 'Candidate Applied for Job '
            , candidateid).subscribe(data => {
            });
    }

    AssignPreQualifyQuestonstoCandidate(candidateid, selectedjobid, PreQualifyQuestonFormArray) {
        //  this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/AssignPreQualifyQuestonstoCandidate',
        this.http.post<any>(this.apiUrl + '/api/jobService/AssignPreQualifyQuestonstoCandidate',
            {
                candidateid: candidateid,
                selectedjobid: selectedjobid,
                PreQualifyQuestonFormArray: PreQualifyQuestonFormArray.value
            }).subscribe(data => {
                Swal.fire(
                    'Job Applied successfully!',
                    '',
                    'success'
                );
            });
    }

    ApplyMultipleJobs() {
        // this.http.post('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/ApplyJobByCandidate',
        this.http.post(this.apiUrl + '/api/candidateService/ApplyJobByCandidate',
            {
                CandidateId: Number(this.loggedcandidateId),
                JobIds: this.selectedJobIds,
                CandidateIds: null
            }).subscribe(data => {
                this.onClickJobsListPage(this.paginationCurrentPage);
                Swal.fire(
                    'Jobs Applied successfully!',
                    '',
                    'success'
                );
            });
        this.selectedJobIds = [];
        this.matdialog.closeAll();
    }
}
