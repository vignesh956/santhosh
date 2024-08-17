import { Component, OnDestroy, ViewEncapsulation, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, AbstractControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from "../../../services/authentication.service";
// import {QuestionnaireService} from '../../questionnaire/questionnaire.service';
import { RepositoryConstant } from '../../constants/Repository.constant';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CandidateserviceService } from '../../../services/candidateservice.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'postjob',
    templateUrl: './post-job.component.html',
    styleUrls: ['./post-job.component.css'],
    encapsulation: ViewEncapsulation.None,
})

export class PostJobComponent implements OnInit, OnDestroy {
    public apiUrl: string = RepositoryConstant.apiUrl;
    @ViewChild('previewModel') previewModel: TemplateRef<any>;
    @ViewChild('prequalifyquestionmodal', { static: true }) prequalifyquestionmodal: TemplateRef<any>;
    public Editor = ClassicEditor;
    JobTypes;
    Companies :any =[];
    jobCompany;
    CompanyImage;
    FunctionalAreas;
    Industries;
    Shifts;
    ScreeningQuestions;
    SalaryCurrencies;
    recruiters;
    ProvidedBenefits;
    Skills;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    secondFromGroupDirty = false;
    thirdFormGroup: FormGroup;
    isLinear = false;
    isStep1Completed = false;
    isStep2Completed = false;
    jobID = 0;
    createdJobID = 0;
    formDataObj;
    screeningProps = [];
    editJobID ;
    urgentHiringFlag = true;
    languagesFlag = true;
    certificatonsFlag = true;
    visaStatusFlag = false;
    workAuthorizationFlag = false;
    educationFlag = false;
    mhqUHNFlag = true;
    mhqLanguageFlag = true;
    mhqCertificatonFlag = true;
    mhqVisaFlag = true;
    mhqWorkFlag = true;
    mhqEducationFlag = true;
    private sub: any;
    isFirstFormGroupLoaded = false;
    formPageTitle;
    firstFormGroupSubmitted = false;
    JobStatus;
    WorkSite: string[] = ['Remote', 'On-Site'];
    seniorityLevelOptions: string[] = ['Internship', 'Entry level', 'Mid-Senior level', 'Director', 'Not Applicable'];
    myControl = new FormControl();
    options: string[] = [];
    locatinFormValue = '';
    location_options = [];
    selectedLocationAddress: any;
    recruitersList: any;
    selectedData: { value: string; text: string };
    jobsHomeUrl = "/jobs";
    selectedJob;
    Recruiters;
    Benefits;
    prrequalifyquestions: [] = [];
    prrequalifyquestionsChecked: any;
    QuestionareCount: any;
    selectedQuestionIds: number[] = [];
    _Industries = new Map();
    _Company = new Map();
    _FunAreas = new Map();
    _JobTypes = new Map();
    _Skills = new Map();
    _Recruiters = new Map();
    _Benefits = new Map();
    currentDate = new Date();
    selectedsSkillData = [];
    selectedCompaniesData = [];
    selectedFunAreas = [];
    selectedIndustriesData = [];
    selectedRecruiters = [];
    selectedBenefits = [];
    loggedInfo: any;
    isEdit: boolean = false;
    selectedSkills: any;
    loading: boolean = false;
    jobOverviewCompany: any;
    dialogRef: any;
    selectedValuesPreview:any;
 
    constructor(
        private http: HttpClient,
        private _formBuilder: FormBuilder,
        //private _fuseProgressBarService: FuseProgressBarService,
        private route: ActivatedRoute,
        private _snackBar: MatSnackBar,
        private router: Router,
        private matdialog: MatDialog,
        private authService: AuthenticationService,
        private candidateService: CandidateserviceService
        //private questionnaireService: QuestionnaireService
    ) {
       
        this.firstFormGroup = this._formBuilder.group({
            job_company: ['', Validators.required],
            job_title: ['', Validators.required],
            job_location: ['', Validators.required],
            job_function: [[], Validators.required],
            job_type: ['', Validators.required],
            job_status: ['Open', Validators.required],
            work_site: ['', Validators.required],
            company_industry: [[], Validators.required],
            seniority_level: ['', Validators.required],
            description: ['', Validators.required],
            skills: [[], Validators.required],
            Vacancies: ['0', Validators.required],
            currency: ['', Validators.required],
            salary_from: ['', Validators.required],
            salary_to: ['', Validators.required],
            salary_period: ['', Validators.required]
            // recruiterFullName : ['' ,]
        });

        this.thirdFormGroup = this._formBuilder.group({
            recruiters: [[], Validators.required],
            provided_benefits: [[], Validators.required],
        });

        this.formDataObj = {
            JobId: {
                value: this.jobID
            },
            UHN: {
                label: 'We must fill this position urgently. Can you start immediately?',
                value: true,
                type: '',
                validation: {
                    required: false
                }
            },
            mhqUHN: {
                label: '',
                value: this.mhqUHNFlag,
                type: ''
            },
            Language: {
                label: 'What is your level of proficiency in:',
                value: '',
                type: 'text',
                validation: {
                    required: true
                }
            },
            mhqLanguage: {
                label: '',
                value: this.mhqLanguageFlag,
                type: ''
            },
            Certification: {
                label: 'Do you have the following license or certification:',
                value: '',
                type: 'text',
                validation: {
                    required: true
                }
            },
            mhqCertification: {
                label: '',
                value: this.mhqCertificatonFlag,
                type: ''
            },
            Visa: {
                label: 'Will you now or in the future require sponsorship for employee visa status',
                value: false,
                type: '',
                validation: {
                    required: false
                }
            },
            mhqVisa: {
                label: '',
                value: this.mhqVisaFlag,
                type: ''
            },
            Work: {
                label: 'Are you legally authorized to work in India?',
                value: false,
                type: '',
                validation: {
                    required: false
                }
            },
            mhqWork: {
                label: '',
                value: this.mhqWorkFlag,
                type: ''
            },
            Education: {
                label: 'Have you completed the following level or education: Bachelor\'s Degree?',
                value: false,
                type: '',
                validation: {
                    required: false
                }
            },
            mhqEducation: {
                label: '',
                value: this.mhqEducationFlag,
                type: ''
            }
        };
        this.secondFormGroup = this._formBuilder.group({});
        this.route.queryParams.subscribe(params => {
            this.editJobID = params['Id'];
            this.jobID = this.editJobID
        });

    }
    ngOnInit(): void {
        this.getRecruiters();
        this.getJobProperties();
        this.http.get<any>(this.apiUrl + '/api/jobService/getJobStatus').subscribe(data => {
            this.JobStatus = data.$values;
        });

        if (!isNaN(this.editJobID)) {
            this.loading = true;
            this.http.get<any>(this.apiUrl + '/api/jobService/getJobdetailById?JobId=' + this.editJobID).subscribe(data => {
                // if (data.hasOwnProperty('JobsTypes') && data['JobsTypes'] !== null && data['JobsTypes'].length > 0) {
                    this.loading = false;   
                    this.jobOverviewCompany = {
                            Id: data.companyId,
                            Name: data.companyOverview || 'Company Name Placeholder'
                          };
                          this.populateFormWithJobDetails(data);
            // }
                
            });
        } else {
            this.formPageTitle = 'Post a Job';
            this.isFirstFormGroupLoaded = true;
        }

        const formDataObj = {};
        if (typeof this.formDataObj === 'object' && this.formDataObj !== null) {
            for (const prop of Object.keys(this.formDataObj)) {
                formDataObj[prop] = new FormControl(
                    this.formDataObj[prop].value,
                    this.mapValidator(this.formDataObj[prop].validators)
                );

                this.screeningProps.push({
                    key: prop,
                    label: this.formDataObj[prop].label,
                    type: this.formDataObj[prop].type,
                    options: this.formDataObj[prop].options
                });
            }
        }

        this.secondFormGroup = new FormGroup(formDataObj);
        this.loggedInfo = this.authService.getLoggedInfo();
    }

    get isFormValid(): boolean {
        return this.firstFormGroup.valid && this.thirdFormGroup.valid;
      }
      populateFormWithJobDetails(jobDetails: any): void {
        this.firstFormGroup.patchValue({
            job_company: jobDetails.companyId,
            job_title: jobDetails.title || '',
            job_location: jobDetails.location || '',
            job_status: jobDetails.jobStatus || '',
            work_site: jobDetails.workSite || '',
            seniority_level: jobDetails.seniorityLevel || '',
            Vacancies: jobDetails.vacancies || '',
            description: jobDetails.description,
            recruiterFullName: jobDetails.recruiterFullName || ''
        })
    }
    getJobProperties() {
        this.http.get(this.apiUrl + '/api/jobService/getJobProperties').subscribe(
          (data: any) => {
           
            if (
              data.jobTypes?.$values &&
              data.companies?.$values &&
              data.functionalAreas?.$values &&
              data.industries?.$values &&
              data.shifts?.$values &&
              data.skills?.$values &&
              data.salaryCurrencies?.$values &&
              data.recruiters?.$values
            ) {
              this.JobTypes = data.jobTypes.$values;
              this.Companies = data.companies.$values;
              console.log(this.Companies, 'company name');
              this.FunctionalAreas = data.functionalAreas.$values;
              this.Industries = data.industries.$values;
              this.Shifts = data.shifts.$values;
              this.ScreeningQuestions = data.screeningQuestions.$values;
              this.Skills = data.skills.$values;
              console.log(this.Skills , 'this.Skills')
              this.ProvidedBenefits = data.providedBenefits.$values;
              this.SalaryCurrencies = data.salaryCurrencies.$values;
              this.recruiters = data.recruiters?.$values;
              console.log(this.recruiters , 'this.recruiters')
            } else {
              console.error('Expected data structure is missing');
            }
          },
          (error) => {
            console.error('Error fetching job properties', error);
          }
        );
      }
    // tslint:disable-next-line:typedef
    getRecruiters() {
        //this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/getlistOfRecruiters').subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/jobService/getlistOfRecruiters').subscribe(data => {
            this.recruitersList = data.$values;
            console.log(data,"get recuiters data");
        });
    }
    // @ViewChild("jobtitle", {static: false}) jobtitle: ElementRef;
    // ngAfterViewInit() {
    //     setTimeout(()=>{
    //             this.jobtitle.nativeElement.focus();
    //       },1000);

    // }

    getallprequalifyQuestions() {
        //debugger;
        this.GetdefaultQuestionnaireList().subscribe(data => {
            this.prrequalifyquestions = data.Table.filter(x => x.QuestionnaireType == "Pre-Qualifying");
        });
        this.isEdit = false;
        if (!isNaN(this.editJobID)) {
            this.isEdit = true;
            this.GetCheckedQuestionnaireList(this.editJobID).subscribe(data => {
                this.prrequalifyquestionsChecked = data.Table;
                this.QuestionareCount = data.Table1;
                this.selectedQuestionIds = [];

                for (const questionid of this.prrequalifyquestionsChecked) {
                    //debugger;
                    if (questionid.Checked != 'false') {
                        this.selectedQuestionIds.push(questionid.Id);
                    }
                }
            });
        }
    }

    getqualfyquestion() {
        this.getallprequalifyQuestions();
        this.selectedQuestionIds = [];
        this.openModal(this.prequalifyquestionmodal);
    }

    questionOnChecked(event: any, Qid: any) {
        let isChecked = event.target.checked;
        if (isChecked) {
            this.selectedQuestionIds.push(Qid);
        }
        else {
            this.selectedQuestionIds.forEach((element, index) => {
                if (element == Qid) {
                    this.selectedQuestionIds.splice(index, 1);
                }
            });
        }
    }

    public openModal(templateRef: TemplateRef<any>) {
        const dialogRef = this.matdialog.open(templateRef, {
            width: '800px',
            height: '600px',
            autoFocus: false,
        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }

    // openDialog(): void {
    //     this.selectedValuesPreview = {
    //         jobTitle: this.firstFormGroup.get('job_title').value,
    //         jobLocation: this.firstFormGroup.get('job_location').value,
    //         description : this.firstFormGroup.get('description').value,
    //         seniorityLevel : this.firstFormGroup.get('seniority_level').value
    //     }
    //     const filteredJobTypes = this.JobTypes.filter(type => type.Id === this.firstFormGroup.get('job_type').value);
    //     if (filteredJobTypes) {
    //         this.selectedValuesPreview['JobType'] = filteredJobTypes[0].Name;
    //     }
    //     const filteredSkills = this.Skills.filter(skill => this.firstFormGroup.get('skills').value.includes(skill.Id));
    //     if (filteredSkills) {
    //         this.selectedValuesPreview['skills'] = filteredSkills;
    //     }
    //     const filteredRecruiters = this.recruiters.filter(skill => this.thirdFormGroup.get('recruiters').value.includes(skill.Id));
    //     if (filteredRecruiters) {
    //         this.selectedValuesPreview['recruiters'] = filteredRecruiters;
    //     }
    //     const jobCompanyInfo = this.Companies.filter(skill => this.firstFormGroup.get('job_company').value.includes(skill.Id));
    //     if (jobCompanyInfo) {
    //         this.selectedValuesPreview['companyName'] = jobCompanyInfo[0].Name;
    //     }
    //     const job_functionInfo = this.FunctionalAreas.filter(skill => this.firstFormGroup.get('job_function').value.includes(skill.Id));
    //     if (job_functionInfo) {
    //         this.selectedValuesPreview['job_function'] = job_functionInfo;
    //     }
    //     const benefitsInfo  = this.ProvidedBenefits.filter(skill => this.thirdFormGroup.get('provided_benefits').value.includes(skill.Id));
    //     if (benefitsInfo) {
    //         this.selectedValuesPreview['provided_benefits'] = benefitsInfo;
    //     }
    //     const company_industry_Info  = this.Industries.filter(skill => this.firstFormGroup.get('company_industry').value.includes(skill.Id));
    //     if (company_industry_Info) {
    //         this.selectedValuesPreview['company_industry'] = company_industry_Info;
    //     }
    //     this.dialogRef = this.matdialog.open(this.previewModel, {
    //       width: '752px', 
    //       disableClose: true, 
    //       autoFocus: false 
    //     });
    //     this.dialogRef.afterClosed().subscribe(result => {
    //       console.log('Dialog closed with result:', result);
    //     });
    //   }


    openDialog(): void {
        this.selectedValuesPreview = {
            jobTitle: this.firstFormGroup.get('job_title').value,
            jobLocation: this.firstFormGroup.get('job_location').value,
            description: this.firstFormGroup.get('description').value,
            seniorityLevel: this.firstFormGroup.get('seniority_level').value
        };
    
        const getFilteredItem = (array, formControlValue) => {
            return array.filter(item => formControlValue.includes(item.Id));
        };
        const jobType = this.JobTypes.find(type => type.Id === this.firstFormGroup.get('job_type').value);
        if (jobType) {
            this.selectedValuesPreview['JobType'] = jobType.Name;
        }
        this.selectedValuesPreview['skills'] = getFilteredItem(this.Skills, this.firstFormGroup.get('skills').value);
        this.selectedValuesPreview['recruiters'] = getFilteredItem(this.recruiters, this.thirdFormGroup.get('recruiters').value);
        const jobCompanyInfo = this.Companies.find(company => company.Id === this.firstFormGroup.get('job_company').value);
        if (jobCompanyInfo) {
            this.selectedValuesPreview['companyName'] = jobCompanyInfo.Name;
        }
        this.selectedValuesPreview['job_function'] = getFilteredItem(this.FunctionalAreas, this.firstFormGroup.get('job_function').value);
        this.selectedValuesPreview['provided_benefits'] = getFilteredItem(this.ProvidedBenefits, this.thirdFormGroup.get('provided_benefits').value);
        this.selectedValuesPreview['company_industry'] = getFilteredItem(this.Industries, this.firstFormGroup.get('company_industry').value);
        this.dialogRef = this.matdialog.open(this.previewModel, {
            width: '752px',
            disableClose: true,
            autoFocus: false
        });
    
        this.dialogRef.afterClosed().subscribe(result => {
            console.log('Dialog closed with result:', result);
        });
    }
    
    
      closeDialog(): void {
        this.dialogRef.close();
      }

    
    getSkillName(id) {
        return this._Skills.get(id);
    }

    getCompanyName(id) {
        return this._Company.get(id);
    }

    getFunAreaName(id) {
        return this._FunAreas.get(id);
    }

    getIndustryName(id) {
        return this._Industries.get(id);
    }

    getJobTypeName(id) {
        return this._JobTypes.get(id);
    }

    getJobRecruiterName(id) {
        return this._Recruiters.get(id);
    }

    getBenefitName(id) {
        return this._Benefits.get(id);
    }

    public printJobPreview() {
        var printJobTitleContents = document.getElementById('divJobTitle').innerHTML;
        var printJobSkillsContents = document.getElementById('divJobSkills').innerHTML;
        var printJobDetailContents = document.getElementById('divJobDetails').innerHTML;
        var printJobScreeningContents = document.getElementById('divJobScreening').innerHTML;
        var printJobDescriptionContents = document.getElementById('divJobDescription').innerHTML;
        var popupWin = window.open('', '_blank', 'width=900,height=500');
        popupWin.document.open();
        popupWin.document.write('<html><head><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></head><body onload="window.print()">' + printJobTitleContents + '<br><br>' + printJobSkillsContents + '<br><br><hr><br>' + printJobDetailContents + '<br><hr>' + printJobScreeningContents + '<br><hr>' + printJobDescriptionContents + '</body></html>');
        popupWin.document.close();
    }

    preventLeadingZero(event) {
        const input = event.target.value;


        if (input.length === 0 && event.which === 48) {
            event.preventDefault();
        }
    }

    preventotherthanZero(event) {
        if (event.which != 48) {
            event.preventDefault();
        }
    }

    // tslint:disable-next-line:typedef
    selectedLocation(location) {
        // this.locatinFormValue = location['display_name'];
        this.selectedLocationAddress = location['address'];
        //console.log(location);
        this.firstFormGroup.patchValue({
            job_location: location['display_name']
        });

    }

    // tslint:disable-next-line:typedef
    searchPlaces(val) {
        // let val1 = 'punjagutta';
        if (val.length > 3) {
            //debugger;
            this.selectedLocationAddress = '';
            this.location_options = [];
            this.candidateService.googlelocations(val).subscribe(data => {
                for (const rec of data) {
                    const obj = {
                        display_name: rec['display_name'],
                        address: rec['address']
                    };
                    this.location_options.push(obj);

                    console.log(this.location_options , "")
                }
            });
        }
    }
    // searchPlaces(val) {
    //     if (val.length > 3) {
    //         this.selectedLocationAddress = '';
    //         this.location_options = [];
    //         this.http.get<any>('https://api.locationiq.com/v1/autocomplete.php?q=' + val + '&autocomplete=1&viewbox=78.5114269%2C17.3715198%2C78.5114269%2C17.3715198&key=pk.e546e2dbed53ccff5f33b4eb102cd61c&format=json&dedupe=1'
    //             , { headers: { 'Access-Control-Allow-Origin':'http://localhost:4200/'} }).subscribe(data => {
    //             for (const rec of data) {
    //                 const obj = {
    //                     display_name: rec['display_name'],
    //                     address: rec['address']
    //                 };
    //                 this.location_options.push(obj);
    //             }
    //         });
    //     }
    // }




    // getJobProperties(){
        
    //     this.http.get(this.apiUrl + '/api/jobService/getJobProperties').subscribe((data:any) => {
            
    //         console.log(data,"get job data s");

    //         if(data.jobTypes.$values && data.companies.$values && data.functionalAreas.$values && data.industries.$values  && data.shifts.$values && data.skills.$values && data.salaryCurrencies.$values){
    //         // this.JobTypes = data['JobTypes'];
    //         this.JobTypes = data.jobTypes.$values;
    //         this.Companies = data.companies.$values
    //         console.log(this.Companies,"company name");
    //         // this.FunctionalAreas = data['FunctionalAreas'];
    //         this.FunctionalAreas = data.functionalAreas.$values;
    //         // this.Industries = data['Industries'];
    //         this.Industries = data.industries.$values;
    //         // this.Shifts = data['Shifts'];
    //         this.Shifts = data.shifts.$values;
    //         // this.ScreeningQuestions = data['ScreeningQuestions'];
    //         this.ScreeningQuestions = data.screeningQuestions.$values;
    //         // this.Skills = data['Skills'];
    //         this.Skills = data.skills.$values;
    //         // this.ProvidedBenefits = data['ProvidedBenefits'];
    //         this.ProvidedBenefits = data.providedBenefits.$values;
    //         // this.SalaryCurrencies = data['SalaryCurrencies'];
    //         this.SalaryCurrencies = data.salaryCurrencies.$values;
    //         }
            
    //     });
    // }



    // tslint:disable-next-line:typedef
    mapValidator(validators) {
        if (validators) {
            if (typeof validators === 'object' && validators !== null) {

                return Object.keys(validators).map(validationType => {
                    if (validationType === 'required') {
                        return Validators.required;
                    } else if (validationType === 'min') {
                        return Validators.min(validators[validationType]);
                    }
                });
            } else {
                return [];
            }
        }
    }

    ngOnDestroy(): void {
    }

    // tslint:disable-next-line:typedef
    selectedValue(event: MatSelectChange) {
        this.selectedsSkillData = event.value;
        this.selectedData = {
            value: event.value,
            text: event.source.triggerValue
        };
    }
    onDescriptionChange() {
        if (this.firstFormGroup.get('description').value == null || this.firstFormGroup.get('description').value == '') {
            document.getElementById('divDescription').style.border = "red 1px solid";
        }
        else {
            document.getElementById('divDescription').style.border = "";
        }
    }
    // tslint:disable-next-line:typedef
    submitForm1() {
        //debugger;
        alert('Job Posted Sucessfully');
        const payload = {
            jobID : this.jobID,
            CompanyId: this.firstFormGroup.get('job_company').value?.toString() || '',
            JobTitle: this.firstFormGroup.get('job_title').value,
            Location: this.firstFormGroup.get('job_location').value,
            JobsfunctionalAreaId: this.firstFormGroup.get('job_function').value,
            JobsTypeId: this.firstFormGroup.get('job_type').value,
            CompanyIndustryId: this.firstFormGroup.get('company_industry').value,
            SeniorityLevel: this.firstFormGroup.get('seniority_level').value,
            WorkSite: this.firstFormGroup.get('work_site').value,
            JobStatus: this.firstFormGroup.get('job_status').value,
            Description: this.firstFormGroup.get('description').value,
            JobsSkillId: this.firstFormGroup.get('skills').value,
            Vacancies: this.firstFormGroup.get('Vacancies').value,
            Recruiters: this.thirdFormGroup.get('recruiters').value,
            ProvidedBenefits: this.thirdFormGroup.get('provided_benefits').value,
            Currency: this.firstFormGroup.get('currency').value,
            SalaryFrom: this.firstFormGroup.get('salary_from').value,
            SalaryTo: this.firstFormGroup.get('salary_to').value,
            SalaryPeriod: this.firstFormGroup.get('salary_period').value,
            UserId: this.loggedInfo.id,
            recruiterFullName: this.firstFormGroup.get('recruiterFullName').value,
            PreQualifyQuestons: [46 ,35],
        }
        console.log(payload , 'payloadpayload')
        this.firstFormGroupSubmitted = true;
        if (this.firstFormGroup.valid) {
            if (this.jobID == 0) {
                //this._fuseProgressBarService.show();
                //this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/createJobProperties', {
                this.http.post<any>(this.apiUrl + '/api/jobService/CreateNewJob', payload).subscribe(data => {
                    this.jobID = data;
                    this.createdJobID = data;
                    this.router.navigate(['/jobs']);
                    if (this.jobID == 0 || this.jobID === undefined || this.jobID === null) {
                        alert('something went wrong');
                    }
                    else{
                    // this.secondFormGroup.patchValue({
                    //     JobId: this.jobID,
                    //     Language: this.selectedData.text
                    // });
                    // this._snackBar.open('Job info saved successfully', '', {
                    //     duration: 3000
                    // });
                    Swal.fire(
                        'Job info saved successfully!',
                        '',
                        'success'
                    );
                    // this.isStep1Completed = true;
                    //this._fuseProgressBarService.hide();
                    //this.router.navigate(['/apps/job']);
                    this.router.navigate(['/jobs']);
                    }
                });
            } else {
                //if (this.firstFormGroup.dirty) {
                //this._fuseProgressBarService.show();
                //this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/updateJobProperties', {
                this.http.post<any>(this.apiUrl + '/api/jobService/updateNewJob', payload).subscribe(data => {
                    //this._fuseProgressBarService.hide();
                    // this._snackBar.open('Job info saved successfully', null, {
                    //     duration: 3000
                    // });
                    Swal.fire(
                        'Job info saved successfully!',
                        '',
                        'success'
                    );
                    //this.router.navigate(['/apps/job']);
                    this.router.navigate(['/jobs']);

                });
                //}
            }
        }
    }

    // tslint:disable-next-line:typedef
    submitForm2() {
        if (this.firstFormGroup.valid) {
            if (this.secondFromGroupDirty) {
                //this._fuseProgressBarService.show();
                //  this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/updatejobScreeningQuestions', {
                this.http.post<any>(this.apiUrl + '/api/jobService/updatejobScreeningQuestions', {
                    JobID: this.jobID,
                    UHN: this.secondFormGroup.get('UHN').value,
                    mhqUHN: this.secondFormGroup.get('mhqUHN').value,
                    Language: this.secondFormGroup.get('Language').value,
                    mhqLanguage: this.secondFormGroup.get('mhqLanguage').value,
                    Certification: this.secondFormGroup.get('Certification').value,
                    mhqCertification: this.secondFormGroup.get('mhqCertification').value,
                    Visa: this.secondFormGroup.get('Visa').value,
                    mhqVisa: this.secondFormGroup.get('mhqVisa').value,
                    Work: this.secondFormGroup.get('Work').value,
                    mhqWork: this.secondFormGroup.get('mhqWork').value,
                    Education: this.secondFormGroup.get('Education').value,
                    mhqEducation: this.secondFormGroup.get('mhqEducation').value,
                }).subscribe(data => {
                    //this._fuseProgressBarService.hide();
                });
            }
        }
        this.isStep2Completed = true;
    }

    // tslint:disable-next-line:typedef
    screeningQuestionFun(question, flag) {
        this.secondFromGroupDirty = true;
        if (question === 'UHN') {
            if (flag === 'close') {
                this.secondFormGroup.patchValue({
                    UHN: false
                });
                this.urgentHiringFlag = false;
            } else {
                this.secondFormGroup.patchValue({
                    UHN: true
                });
                this.urgentHiringFlag = true;
            }
        } else if (question === 'Language') {
            if (flag === 'close') {
                this.secondFormGroup.patchValue({
                    Language: ''
                });
                this.languagesFlag = false;
            } else {
                this.secondFormGroup.patchValue({
                    Language: ''
                });
                this.languagesFlag = true;
            }
        } else if (question === 'Certification') {
            if (flag === 'close') {
                this.secondFormGroup.patchValue({
                    Certification: ''
                });
                this.certificatonsFlag = false;
            } else {
                this.secondFormGroup.patchValue({
                    Certification: ''
                });
                this.certificatonsFlag = true;
            }
        } else if (question === 'Visa') {
            if (flag == 'close') {
                this.secondFormGroup.patchValue({
                    Visa: false
                });
                this.visaStatusFlag = false;
            } else {
                this.secondFormGroup.patchValue({
                    Visa: true
                });
                this.visaStatusFlag = true;
            }
        } else if (question === 'Work') {
            if (flag === 'close') {
                this.secondFormGroup.patchValue({
                    Work: false
                });
                this.workAuthorizationFlag = false;
            } else {
                this.secondFormGroup.patchValue({
                    Work: true
                });
                this.workAuthorizationFlag = true;
            }

        } else if (question === 'Education') {
            if (flag === 'close') {
                this.secondFormGroup.patchValue({
                    Education: false
                });
                this.educationFlag = false;
            } else {
                this.secondFormGroup.patchValue({
                    Education: true
                });
                this.educationFlag = true;
            }
        }
    }

    // tslint:disable-next-line:typedef
    screeningQuestionCheckBoxEvent(question, event: any) {
        this.secondFromGroupDirty = true;
        if (question === 'UHN') {
            if (event.checked) {
                this.secondFormGroup.patchValue({
                    mhqUHN: true
                });
                this.mhqUHNFlag = true;
            } else {
                this.secondFormGroup.patchValue({
                    mhqUHN: false
                });
                this.mhqUHNFlag = false;
            }
        } else if (question === 'Language') {
            if (event.checked) {
                this.secondFormGroup.patchValue({
                    mhqLanguage: true
                });
                this.mhqLanguageFlag = true;
            } else {
                this.secondFormGroup.patchValue({
                    mhqLanguage: false
                });
                this.mhqLanguageFlag = false;
            }
        } else if (question === 'Certification') {
            if (event.checked) {
                this.secondFormGroup.patchValue({
                    mhqCertification: true
                });
                this.mhqCertificatonFlag = true;
            } else {
                this.secondFormGroup.patchValue({
                    mhqCertification: false
                });
                this.mhqCertificatonFlag = false;
            }
        } else if (question === 'Visa') {
            if (event.checked) {
                this.secondFormGroup.patchValue({
                    mhqVisa: true
                });
                this.mhqVisaFlag = true;
            } else {
                this.secondFormGroup.patchValue({
                    mhqVisa: false
                });
                this.mhqVisaFlag = false;
            }

        } else if (question === 'Work') {
            if (event.checked) {
                this.secondFormGroup.patchValue({
                    mhqWork: true
                });
                this.mhqWorkFlag = true;
            } else {
                this.secondFormGroup.patchValue({
                    mhqWork: false
                });
                this.mhqWorkFlag = false;
            }

        } else if (question === 'Education') {
            if (event.checked) {
                this.secondFormGroup.patchValue({
                    mhqEducation: true
                });
                this.mhqEducationFlag = true;
            } else {
                this.secondFormGroup.patchValue({
                    mhqEducation: false
                });
                this.mhqEducationFlag = false;
            }
        }
    }

    getScreeningQuestionsFormControls(): AbstractControl[] {
        return (this.secondFormGroup.get('jobScreening') as FormArray).controls;
    }

    selectedrecruiters(event) {
        this.selectedRecruiters = event.value;
    }

    selectedAreas(event) {
        this.selectedFunAreas = event.value;
    }

    selectedIndustries(event) {
        this.selectedIndustriesData = event.value;
    }
  

    selectedbenefits(event) {
        this.selectedBenefits = event.value;
    }

    // tslint:disable-next-line:typedef
    submitForm3() {
        if (this.thirdFormGroup.valid) {
            if (this.thirdFormGroup.dirty) {
                alert('11')
                //this._fuseProgressBarService.show();
                // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/jobService/updateJobSalarydetails', {
                this.http.post<any>(this.apiUrl + '/api/jobService/updateJobSalarydetails', {
                    JobID: this.jobID,
                    Recruiters: this.thirdFormGroup.get('recruiters').value,
                    // Recruiters: [1],
                    ProvidedBenefits: this.thirdFormGroup.get('provided_benefits').value,
                    Currency: this.thirdFormGroup.get('currency').value,
                    SalaryFrom: this.thirdFormGroup.get('salary_from').value,
                    SalaryTo: this.thirdFormGroup.get('salary_to').value,
                    SalaryPeriod: this.thirdFormGroup.get('salary_period').value,
                }).subscribe(data => {
                    //this._fuseProgressBarService.hide();
                    // this._snackBar.open('Job info saved successfully', null, {
                    //     duration: 3000
                    // });
                    Swal.fire(
                        'Job info saved successfully!',
                        '',
                        'success'
                    );
                    //this.router.navigate(['/apps/job']);
                    this.router.navigate(['/jobs']);
                });
            } else {
                this.router.navigate(['/jobs']);
            }
        } else {
            this._snackBar.open('Something went wrong', null, {
                duration: 3000
            });
        }
    }

    formatString(val) {
        return val.toString()
    }

    GetdefaultQuestionnaireList(): Observable<any> {
        return this.http.get(this.apiUrl + '/api/jobService/GetQuestionnaireInfo', {

        }).pipe(
            map(res => res),
        );
    }


    GetCheckedQuestionnaireList(jobid: any): Observable<any> {
        return this.http.get(this.apiUrl + '/api/jobService/GetCheckedQuestionnaireList?JobId=' + jobid).pipe(
            map(res => res),
        );
    }

    GetQuestionbyId(id: any): Observable<any> {
        return this.http.get(this.apiUrl + '/api/jobService/GetQuestionnaireinfobyid?Id=' + id).pipe(
            map(res => res),
        );
    }

    QuestionnaireOperations(payLoad: any): Observable<any> {
        // debugger;
        return this.http.post(this.apiUrl + '/api/jobService/DMLQuestionnaire', {
            Id: payLoad.Id,
            QuestionnaireType: payLoad.QuestionnaireType,
            Skill: payLoad.Skill,
            Level: payLoad.Level,
            Time: payLoad.Time,
            QuestionStatus: payLoad.QuestionStatus,
            Question: payLoad.Question,
            GeneralExpectedAnswer: payLoad.GeneralExpectedAnswer,
            GeneralRating: payLoad.GeneralRating,
            AnswerWithErrorAssessment: payLoad.AnswerWithErrorAssessment,
            AssessmentExpectedAnswer: payLoad.AssessmentExpectedAnswer,
            OptionA: payLoad.OptionA,
            OptionB: payLoad.OptionB,
            OptionC: payLoad.OptionC,
            OptionD: payLoad.OptionD,
            AssignmentExpectedAnswer: payLoad.AssignmentExpectedAnswer,
            JobId: payLoad.JobId,
            CandidateId: payLoad.CandidateId,
            DMLType: payLoad.DMLType
        }).pipe(
            map(res => res),
        );
    }

    QuestionnaireFilter(Status: any, Filtertype: any): Observable<any> {
        return this.http.get(this.apiUrl + '/api/jobService/GetQuestionnaireFilter?Status=' + Status + '&Filtertype=' + Filtertype).pipe(
            map(res => res),
        );
    }


//   onToppingRemoved(skill: string) {
//     const skills = this.firstFormGroup.get('skills').value as string[];
//     this.removeFirst(skills, skill);
//     this.firstFormGroup.get('skills').setValue(skills); // To trigger change detection
//   }

//   private removeFirst<T>(array: T[], toRemove: T): void {
//     const index = array.indexOf(toRemove);
//     if (index !== -1) {
//       array.splice(index, 1);
//     }
//   }

onSkillsSelectionChange(event): void {
    const selectedIds = event.value;
    this.selectedSkills = this.Skills.filter(skill => selectedIds.includes(skill.Id));
  }

  removeSkill(skill): void {
    this.selectedSkills = this.selectedSkills.filter(s => s.Id !== skill.Id);
    const selectedIds = this.selectedSkills.map(s => s.Id);
    this.firstFormGroup.get('skills').setValue(selectedIds);
  }


  onBenefitsSelectionChange(event): void {
    const selectedIds = event.value;
    this.selectedBenefits = this.ProvidedBenefits.filter(benefit => selectedIds.includes(benefit.Id));
  }

  removeBenefit(benefit): void {
    this.selectedBenefits = this.selectedBenefits.filter(b => b.Id !== benefit.Id);
    const selectedIds = this.selectedBenefits.map(b => b.Id);
    this.thirdFormGroup.get('provided_benefits').setValue(selectedIds);
  }
}
