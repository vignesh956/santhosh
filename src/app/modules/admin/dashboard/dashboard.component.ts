import { Component, OnInit, Input, TemplateRef, ViewChild, ElementRef } from '@angular/core';
//import {CandidateserviceService} from '../candidate/candidateservice.service';
import { CandidateserviceService } from '../../../services/candidateservice.service'
import { GridOptions } from '@ag-grid-community/all-modules';
//import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { DateRendererComponent } from './components/date-renderer.component';
import { jqxSchedulerComponent } from "jqwidgets-scripts/jqwidgets-ts/angular_jqxscheduler";

// import { JobService } from 'app/services/job.service';
import { JobService } from '../../../services/job.service';
import { Observable } from "rxjs";
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';


import { COMMA, ENTER } from '@angular/cdk/keycodes';
//import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { RepositoryConstant } from "../../constants/Repository.constant";

import moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [DatePipe]
})

export class DashboardComponent implements OnInit {
    public apiUrl: string = RepositoryConstant.apiUrl;
    @ViewChild('mobileno') mobileno1: ElementRef; //Eswari
   @ViewChild("schedulerReference") scheduler: jqxSchedulerComponent;

    @Input()
    today = new Date();
    rowData: any;
    DashboardInfo: any = [];
    DashboardJobInfo: any = [];
    DashboardCandidatesInfo: any = [];
    DashboardOnboardingInfo: any = [];
    DashboardInterviewInfo: any = [];
    newFolderFormGroup: FormGroup;
    firstFormGroup: FormGroup;
    isVisible: any = false;
    Tags: string[] = [];
    candidateID = 0;
    selectedExperience;
    userID;
    IsRelocate: boolean;
    selectedDob;
    candidateprofileimageURL;
    commonfieldName;
    commonfieldDesignation;
    commonfieldCompany;
    commonfieldEmail;
    commonfieldMobile;
    commonfieldLocation;
    selectedrelocatevalue;
    UploadCandidateProfileImage: any[] = [];
    searchFills: any = {};
    selectedLocationAddress: any;
    location_options = [];
    removable = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    candidateskills:any;
    gridApi;
    gridColumnApi;
    context: any;
    gridOptions: GridOptions;
    gridtotRowCount;
    defaultColDef;
    rowSelection;
    SearchFilter: any;
    searchInput: FormControl;
    candidatesDrpdwnformControl;
    candidatesDrpdwnColumns: any;
    frameworkComponents;
    selectedCandidate;
    selectedRowsCnt;
    defaultAction: any;
    openDropdown: any = '';
    public webColumns = [
        {
            headerName: '',
            field: '',
            showCol: false,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            width: 50,
            
            dropdownItem: false
        },
        // {
        //     headerName: '',
        //     field: 'JobId',
        //     filter: 'agTextColumnFilter',
        //     tooltipField: 'JobId',
        //     width: 150,
        //     cellRenderer: function (params) {
        //         return ' <a class="material-icons"  href="#/evaluation" target="_blank">open_in_new</a>'
        //     }
        // },
        {
            headerName: '',
            field: 'JobId',
            filter: 'agTextColumnFilter',
            tooltipField: 'JobId',
            width: 150,
            cellRenderer: function (params) {
                // Create a button element
                let button = document.createElement('button');
                button.innerHTML = 'View Candidate';
                button.classList.add('btn', 'btn-primary'); // Add any classes for styling
                button.onclick = function() {
                    // Define what happens when the button is clicked
                    window.open('#/evaluation?jobId=' + params.value, '_blank');
                };
                return button;
            }
        },
        

        {
            headerName: 'Job Title',
            field: 'JobTitle',
            filter: 'agTextColumnFilter',
            tooltipField: 'JobTitle',
            width: 300,
            dropdownItem: true

        },
        {
            headerName: 'Interview Date',
            field: 'InterviewDate',
            filter: 'agTextColumnFilter',
            tooltipField: 'InterviewDate',
            width: 200,
            dropdownItem: true
        },

        {
            headerName: 'Job Posted',
            field: 'JobPosted',
            filter: 'agTextColumnFilter',
            tooltipField: 'JobPosted',
            width: 200,
            dropdownItem: true
        },

        {
            headerName: 'Job Status',
            field: 'JobStatus',
            filter: 'agTextColumnFilter',
            tooltipField: 'JobStatus',
            width: 300,
            dropdownItem: true 
        },

        {
            headerName: 'Candidate Name',
            field: 'CandidateName',
            filter: 'agTextColumnFilter',
            tooltipField: 'CandidateName',
            width: 300,
            dropdownItem: true
        },

        {
            headerName: 'Screening Status (%)',
            field: 'CandidateScore',
            filter: 'agTextColumnFilter',
            tooltipField: 'CandidateScore',
            width: 300,
            dropdownItem: true
        },

        {
            headerName: 'HR Review',
            field: 'HR',
            filter: 'agTextColumnFilter',
            tooltipField: 'HR',
            width: 160,
            dropdownItem: true
        },

        {
            headerName: 'Assignment',
            field: 'Assignment',
            filter: 'agTextColumnFilter',
            tooltipField: 'Assignment',
            width: 160,
            dropdownItem: true
        },

        {
            headerName: 'Technical',
            field: 'Technical',
            filter: 'agTextColumnFilter',
            tooltipField: 'Technical',
            width: 160,
            dropdownItem: true
        },

        {
            headerName: 'Assessment',
            field: 'Assessment',
            filter: 'agTextColumnFilter',
            tooltipField: 'Assessment',
            width: 160,
            dropdownItem: true
        },

        {
            headerName: 'Management',
            field: 'Management',
            filter: 'agTextColumnFilter',
            tooltipField: 'Management',
            width: 160,
            dropdownItem: true
        }


    ];

    DashboardJobStatus: any;

    //job applicants start
    sampleData: any[] = [
        { Day: 'Monday', Applicants: 30, Interviews: 15, Forwards: 25 },
        { Day: 'Tuesday', Applicants: 25, Interviews: 25, Forwards: 30 },
        { Day: 'Wednesday', Applicants: 30, Interviews: 20, Forwards: 25 },
        { Day: 'Thursday', Applicants: 35, Interviews: 25, Forwards: 45 },
        { Day: 'Friday', Applicants: 20, Interviews: 20, Forwards: 25 },
        { Day: 'Saturday', Applicants: 30, Interviews: 20, Forwards: 30 },
        { Day: 'Sunday', Applicants: 60, Interviews: 45, Forwards: 90 }
    ];
    getWidth(): any {
        if (document.body.offsetWidth < 850) {
            return '90%';
        }

        return 720;
    }

    padding: any = { left: 5, top: 5, right: 5, bottom: 5 };
    titlePadding: any = { left: 90, top: 0, right: 0, bottom: 10 };
    xAxis: any =
        {
            dataField: 'Day',
            showGridLines: true
        };
    seriesGroups: any[] =
        [
            {
                type: 'column',
                columnsGapPercent: 50,
                seriesGapPercent: 0,
                valueAxis:
                {
                    unitInterval: 10,
                    minValue: 0,
                    maxValue: 100,
                    displayValueAxis: true,
                    description: 'Time in minutes',
                    axisSize: 'auto',
                    tickMarksColor: '#888888'
                },
                series: [
                    { dataField: 'Applicants', displayText: 'Applicants' },
                    { dataField: 'Interviews', displayText: 'Interviews' },
                    { dataField: 'Forwards', displayText: 'Forwards' }
                ]
            }
        ];
    //job applicants end

    //scheduler start
    // generateAppointments(): any {
    //     let appointments = new Array();

    //     let appointment1 = {
    //         id: "id1", description: "George brings projector for presentations.", location: "", subject: "Quarterly Project Review Meeting", calendar: "Room 1",
    //         start: new Date(2016, 10, 23, 9, 0, 0),
    //         end: new Date(2016, 10, 23, 16, 0, 0)
    //     };
    //     let appointment2 = {
    //         id: "id2", description: "",
    //         location: "", subject: "IT Group Mtg.", calendar: "Room 2",
    //         start: new Date(2016, 10, 24, 10, 0, 0),
    //         end: new Date(2016, 10, 24, 15, 0, 0)
    //     };

    //     appointments.push(appointment1);
    //     appointments.push(appointment2);

    //     return appointments;
    // }

    // source: any =
    //     {
    //         dataType: "array",
    //         dataFields: [
    //             { name: 'id', type: 'string' },
    //             { name: 'description', type: 'string' },
    //             { name: 'location', type: 'string' },
    //             { name: 'subject', type: 'string' },
    //             { name: 'calendar', type: 'string' },
    //             { name: 'start', type: 'date' },
    //             { name: 'end', type: 'date' }
    //         ],
    //         id: 'id',
    //         localData: this.generateAppointments()
    //     }

    // dataAdapter: any = new jqx.dataAdapter(this.source);
    // //date: any = new jqx.date(2016, 11, 23);

    // appointmentDataFields: any =
    //     {
    //         from: "start",
    //         to: "end",
    //         id: "id",
    //         description: "description",
    //         location: "location",
    //         subject: "subject",
    //         resourceId: "calendar"
    //     };

    // resources: any =
    //     {
    //         // colorScheme: "scheme05",
    //         // dataField: "calendar",
    //         // source: new jqx.dataAdapter(this.source)
    //     };

    view: any;

    views: string[] =
        [
            'weekView',
            'monthView'
        ];
    //start for chart
    // options for the chart
    showXAxis = true;
    showYAxis = true;
    //view = [1000,400];
    gradient = false;
    showLegend = true;
    showXAxisLabel = true;
    xAxisLabel = '';
    showYAxisLabel = true;
    yAxisLabel = 'Time in Minutes';
    timeline = true;
    colorScheme = {
        domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB']
    };

    widget5 = {
        'title': 'Job Applicant Details',
        'ranges': {
            'TW': 'This Week',
            'LW': 'Last Week',
            '2W': '2 Weeks Ago'
        },
        'mainChart': {
            '2W': [
                {
                    'name': 'Mon',
                    'series': [
                        {
                            'name': 'Applicants',
                            'value': 60
                        },
                        {
                            'name': 'Interviews',
                            'value': 20
                        },
                        {
                            'name': 'Forwards',
                            'value': 20
                        }
                    ]
                },
                {
                    'name': 'Tue',
                    'series': [
                        {
                            'name': 'Applicants',
                            'value': 32
                        },
                        {
                            'name': 'Interviews',
                            'value': 12
                        },
                        {
                            'name': 'Forwards',
                            'value': 9
                        }
                    ]
                },
                {
                    'name': 'Wed',
                    'series': [
                        {
                            'name': 'Applicants',
                            'value': 39
                        },
                        {
                            'name': 'Interviews',
                            'value': 9
                        },
                        {
                            'name': 'Forwards',
                            'value': 9
                        }
                    ]
                },
                {
                    'name': 'Thu',
                    'series': [
                        {
                            'name': 'Applicants',
                            'value': 27
                        },
                        {
                            'name': 'Interviews',
                            'value': 12
                        },
                        {
                            'name': 'Forwards',
                            'value': 9
                        }
                    ]
                },
                {
                    'name': 'Fri',
                    'series': [
                        {
                            'name': 'Applicants',
                            'value': 18
                        },
                        {
                            'name': 'Interviews',
                            'value': 7
                        },
                        {
                            'name': 'Forwards',
                            'value': 9
                        }
                    ]
                },
                {
                    'name': 'Sat',
                    'series': [
                        {
                            'name': 'Applicants',
                            'value': 24
                        },
                        {
                            'name': 'Interviews',
                            'value': 8
                        },
                        {
                            'name': 'Forwards',
                            'value': 9
                        }
                    ]
                },
                {
                    'name': 'Sun',
                    'series': [
                        {
                            'name': 'Applicants',
                            'value': 20
                        },
                        {
                            'name': 'Interviews',
                            'value': 16
                        },
                        {
                            'name': 'Forwards',
                            'value': 9
                        }
                    ]
                }
            ]
        }

    }



    showLabels = true;
    //end for charts
    //scheduler start
    periods = [
        {
            name: '3 days',
            timeFramePeriod: (60 * 3),
            timeFrameOverall: (60 * 24 * 3),
            timeFrameHeaders: [
                'Do MMM',
                'HH'
            ],
            classes: 'period-3day'
        }, {
            name: '1 week',
            timeFrameHeaders: ['MMM YYYY', 'DD(ddd)'],
            classes: '',
            timeFrameOverall: 1440 * 7,
            timeFramePeriod: 1440,
        }, {
            name: '2 week',
            timeFrameHeaders: ['MMM YYYY', 'DD(ddd)'],
            classes: '',
            timeFrameOverall: 1440 * 14,
            timeFramePeriod: 1440,
        }];

    sections = [{
        name: 'A',
        id: 1
    }, {
        name: 'B',
        id: 2
    }, {
        name: 'C',
        id: 3
    }, {
        name: 'D',
        id: 4
    }, {
        name: 'E',
        id: 5
    }];

    items = [{
        id: 1,
        sectionID: 1,
        name: 'Item 1',
        start: moment().startOf('day'),
        end: moment().add(5, 'days').endOf('day'),
        classes: ''
    }, {
        id: 2,
        sectionID: 3,
        name: 'Item 2',
        start: moment().startOf('day'),
        end: moment().add(4, 'days').endOf('day'),
        classes: ''
    }, {
        id: 3,
        sectionID: 1,
        name: 'Item 3',
        start: moment().add(1, 'days').startOf('day'),
        end: moment().add(3, 'days').endOf('day'),
        classes: ''
    }];

    //scheduler end

    onResize(event: any) {
        this.view = [event.target.innerWidth / 1.35, 400];
    }

    constructor(
        //public _fuseSidebarService: FuseSidebarService,
        // private _fuseProgressBarService: FuseProgressBarService,
        private candidateService: CandidateserviceService,
        // private buttonsRendererDashboardComponentComponent : ButtonsRendererDashboardComponentComponent,
        private jobService: JobService,
        private _formBuilder: FormBuilder,
        private matdialog: MatDialog,
        private http: HttpClient,
        private router: Router,
        private _snackBar: MatSnackBar) {
        this.defaultAction = "200";
        this.context = {
            componentParent: this
        };
        this.defaultColDef = {
            sortable: true,
            resizable: true,
            width: 'auto'
        };
        //  let _fuse = this._fuseSidebarService.getSidebar('navbar');

        //  if(_fuse != undefined)
        //  {
        //   _fuse.toggleFold();
        //    }


        this.gridOptions = <GridOptions>{
            enableSorting: true,
            enableFilter: true,

        };
        /// this._fuseSidebarService.getSidebar('navbar').toggleFold();

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

        this.firstFormGroup = this._formBuilder.group({
            candidateName: ['', [Validators.required, Validators.pattern(/[a-zA-Z]+([\s][a-zA-Z]+)*/)]],
            designation: ['', [Validators.required, Validators.minLength(5)]],
            currentEmployer: ['', Validators.required],
            email: ['', [Validators.required,
            // Validators.pattern(/^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(domain|domain1|domain3)\.com$/g)]],
            Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
            experience: ['', Validators.required],
            skills: ['', Validators.required],
            overview: ['', Validators.required],
            candidate_location: ['', Validators.required],
            mobileno: ['', Validators.required],
            desiredsalary: ['', [Validators.required, Validators.minLength(5)]],
            dob: ['', [Validators.required, this.dateValidator]],
            relocate: ['', Validators.required],
            facebook: [''],
            linkedin: [''],
            twitter: [''],
            github: [''],
            stackoverflow: [''],
        });

        this.newFolderFormGroup = this._formBuilder.group({
            newfolder: ['', Validators.required]
        });

    }

    selectedAreas(event) {
        this.selectedExperience = '';
        this.selectedExperience = event.value;
    }
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


    remove(tag: string): void {
        const index = this.Tags.indexOf(tag);
        if (index >= 0) {
            this.Tags.splice(index, 1);
        }
    }


    changestage(event) {
        this.defaultAction = '';
        this.defaultAction = event;
        this.GetDashboardSearchByJobAndCandidate(event);
    }

    GetDashboardSearchByJobAndCandidate(Days: any) {
        this.jobService.GetDashboardSearchByJobAndCandidate(Days).subscribe(data => {
            this.rowData = data.Table;
        });

    }

    getcandidateskills() {
        
        this.candidateService.getcandidateskills().subscribe(data => {
           
          this.candidateskills = data.Table;
        });
      }
    submitForm1() {
        
        this.isVisible = false;
        if (this.firstFormGroup.valid) {
            //this._fuseProgressBarService.show();
            let selectedskills = '';
            for (let i = 0; i < this.Tags.length; i++) {
                let tagvalue = this.Tags[i];
                if (i == 0)
                    selectedskills = selectedskills + tagvalue;
                else
                    selectedskills = selectedskills + ',' + tagvalue;
            }
            // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/candidateService/createCandidate', {
            this.http.post<any>(this.apiUrl + '/api/candidateService/createCandidate', {
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
                Skills: selectedskills,
                ProfileImage: this.candidateprofileimageURL,
                UserId: this.userID,
                Facebook: this.firstFormGroup.get('facebook').value,
                LinkedIn: this.firstFormGroup.get('linkedin').value,
                Twitter: this.firstFormGroup.get('twitter').value,
                GitHub: this.firstFormGroup.get('github').value,
                StackOverflow: this.firstFormGroup.get('stackoverflow').value,
            }).subscribe(data => {
                
                this.candidateID = data;

                if (this.candidateID == 0 || this.candidateID === undefined || this.candidateID === null) {
                    alert('something went wrong');
                }
                this.commonfieldName = this.firstFormGroup.get('candidateName').value;
                this.commonfieldDesignation = this.firstFormGroup.get('designation').value;
                this.commonfieldEmail = this.firstFormGroup.get('email').value;
                this.commonfieldMobile = this.firstFormGroup.get('mobileno').value;
                this.commonfieldLocation = this.firstFormGroup.get('candidate_location').value;
                this.matdialog.closeAll();
                this.router.navigate(['/candidates/edit-candidate', this.candidateID]).then(page => {
                    this.ngOnInit();

                });
                Swal.fire(
                    'Candidate info saved successfully. Please upload latest resume',
                    '',
                    'success'
                );
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

    onQuickFilterChanged() {
        this.gridApi.setQuickFilter(this.SearchFilter);
    }

    ngOnInit() {
        this.searchFills = this.candidateService.getSearchFills();
        this.GetDashboardSearchByJobAndCandidate(200);
        this.aggridbind();
        this.getcandidateskills();
    }

    Load() {

    }
    selectedLocation(location) {
        this.selectedLocationAddress = location['address'];
        this.firstFormGroup.patchValue({
            candidate_location: location['display_name']
        });

    }

    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        this.selectedDob = '';
        this.selectedDob = event.value;
    }
    onMobileChangeEvent(event: any, mob1) {
        // debugger;
        var MobNo = event.target.value;
        var mob = /^[789]\d{9}$/;
        // var mob = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
        if (MobNo.length != 10) {
            alert('Phone number must be 10 digits..');
            this.mobileno1.nativeElement.focus();
            return false;
        }
        else if (mob.test(MobNo.toString()) == false) {
            alert("Please enter valid mobile number.");
            this.mobileno1.nativeElement.focus();
            return false;
        }
        else if (MobNo.toString() == "") {
            alert("Mobile No Should not be Empty.");
            this.mobileno1.nativeElement.focus();
            return false;
        }
        else {
            return true;
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

    GetDashboardInfo() {
        this.jobService.GetDashboardJobStatus().subscribe(data => {
            this.DashboardJobStatus = data.Table;
        });
        this.jobService.GetDashboardInfo().subscribe(data => {
            this.DashboardInfo = data;
            this.DashboardJobInfo = data.Table;
            this.DashboardCandidatesInfo = data.Table1;
            this.DashboardInterviewInfo = data.Table2;
            this.DashboardOnboardingInfo = data.Table4;
        });
    }


    aggridbind() {
        //debugger;
        // this.candidateService.getCandidatelist().subscribe(data => {
        //     this.rowData = data.Candidates;
        //     debugger;
        // });
        this.jobService.GetDashboardJobStatus().subscribe(data => {
            this.DashboardJobStatus = data.Table;
        });
        this.jobService.GetDashboardInfo().subscribe(data => {
          //debugger;
            this.DashboardInfo = data;
            this.DashboardJobInfo = data.Table;
            this.DashboardCandidatesInfo = data.Table1;
            this.DashboardInterviewInfo = data.Table2;
            this.DashboardOnboardingInfo = data.Table4;
            this.rowData = data.Table3;
        });
    }
    toggleDropdown(section: string){
        this.openDropdown = section;
    }
    toggleDropdownClose() {
      this.openDropdown = '';
  }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        // this.rowData = [];
        this.aggridbind();
    }

    onGridFilterChanged() {
        this.gridtotRowCount = this.gridOptions.api.getDisplayedRowCount();
    }

    onSelectionChanged(event) {
        let selectedRows = this.gridApi.getSelectedRows();
        if (selectedRows.length == 1) {
            this.selectedCandidate = true;
            this.viewJob(selectedRows[0]);
        } else {
            this.selectedCandidate = false;
        }
        this.selectedRowsCnt = selectedRows.length;
    }
    viewJob(arg0: any) {
        throw new Error('Method not implemented.');
    }

    onCellClicked(jobId: any) {

        localStorage.setItem('_candidateprofilejobid', jobId.value);
        localStorage.setItem('_candidateidDashboard', jobId.data.CandidateId);

    }


}
