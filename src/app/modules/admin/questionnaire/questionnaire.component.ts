

import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { StarRatingColor} from './star-rating/star-rating.component'
import { GridOptions } from '@ag-grid-community/all-modules';
//import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DateRendererComponent } from './components/date-renderer.component';
import {JobGridActionbuttonsComponent} from './components/job-grid-actionbuttons.component';
//import {AssignmentService} from '../assignment/assignment.service';
import { ButtonsRendererComponent } from './components/buttons-renderer.component';
import { FuseLoadingService } from '../../../../@fuse/services/loading/loading.service';
import {QuestionnaireService} from './questionnaire.service';
import {FormBuilder, FormGroup, FormControl, FormArray, AbstractControl, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import { MatPaginator} from "@angular/material/paginator";
import { MatSort} from "@angular/material/sort";
import { MatDatepickerInputEvent} from "@angular/material/datepicker";
import { MatInput} from "@angular/material/input";
import { MatChipInputEvent} from "@angular/material/chips";
import { MatTableDataSource} from "@angular/material/table";
import { MatDialog,MatDialogRef} from "@angular/material/dialog";
import { MatSnackBar} from "@angular/material/snack-bar";
import { MatRadioChange} from "@angular/material/radio";
import { MatCheckbox} from "@angular/material/checkbox";
import {CandidateserviceService} from '../../../services/candidateservice.service'
//import {CandidateserviceService} from '../candidatenewUI/candidateservice.service';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit {
  @ViewChild('AddQuestionnaire', {static:true}) AddQuestionnaire: TemplateRef<any>;

  gridOptions: GridOptions;
  context: any;
  defaultAction:any;
  defaultSkill:any;
  AddEditdefaultSkill:any;
  defaultLevel:any;
  defaultStatus:any;
  rating: number = 0;
  question2:number=5;
  AddEditdefaultLevel:any;
  AddEditdefaultQuestionnaireType:any;
  defaultRating:any;
  AddEditdefaultTime:any;
  Isvisible: boolean =false;
  defaultExpAnswer:any;
  hrexpectedanswer:boolean=false;
  assessmentexpans:boolean=false;
  assignmentexpans:boolean=false;
  prequaligying:boolean = false;
  defaultQuestionStatus:any;
  selectedquestionnairetext:any;
    //Skills:any;
  Skills: any = [];
  selectedskills:any;
  rowData: any;
  AssessmentTypeActiveCount: any = [];
  AssessmentTypeInActiveCount: any =[];
  AssignmentTypeActiveCount: any =[];
  AssignmentTypeInActiveCount: any =[];
 // HrTypeActiveCount = [];
  HrTypeActiveCount: any = [];
  HrTypeInActiveCount : any = [];
 // HrActiveCountJunior:any;
  ManagementTypeActiveCount: any =[];
  ManagementTypeInActiveCount: any =[];
  TechnicalTypeActiveCount : any = [];
  TechnicalTypeInActiveCount : any = [];
  PreQualifyingCount=[];
  isEdit=false;
  firstFormGroup: FormGroup;
  rowSelection:any;
  gridtotRowCount;
  gridApi:any;
  SelectedSkillGroup;
  SelectedLevelGroup;
  SelectedStatusGroup;
  defaultColDef;
  gridColumnApi;
  frameworkComponents;
  selectedQuestion;
  selectedRowsCnt;
  AddEditSelectStatusval;
  AddEditSelectSkillval;
  AddEditSelectLevelval;
  AddEditSelectTime;
  EditQuestionnaireId;
  dllskillgroup;
  public webColumns = [
    {
      headerName: 'Action',
      field: 'Id',
      cellRenderer: 'JobGridActionbuttonsComponent',
      width: 100,
      valueGetter: function(params) {
        return {
            Id: params.data.Id,
            Title: params.data.Title,
            params: params
        };
    },
    dropdownItem: false
  },
  {
    headerName: 'Question Type',
    cellClass: "grid-cell-centered",
    field: 'QuestionnaireType',
    resizable: true,
    sortable: true,
    filter: 'agTextColumnFilter',
    tooltipField: 'QuestionnaireType',
    width: 120,
    dropdownItem: true
  },
    {
        headerName: 'Skill',
        field: 'Skill',
        filter: 'agTextColumnFilter',
        tooltipField: 'Skill',
        width: 100,
        dropdownItem: true
    },
    {
        headerName: 'Level',
        field: 'Level',
        cellClass: "grid-cell-centered",
        columnGroupShow: 'closed',
        filter: 'agTextColumnFilter',
        tooltipField: 'Level',
        width: 120,
        dropdownItem: true
    },
    {
      headerName: 'Question Description',
      cellClass: "grid-cell-centered",
      field: 'Question',
      resizable: true,
      filter: 'agTextColumnFilter',
      width: 350,
      dropdownItem: true
  },
  {
    headerName: 'Status',
    cellClass: "grid-cell-centered",
    field: 'QuestionStatus',
    resizable: true,
    filter: 'agTextColumnFilter',
    width: 100,
    dropdownItem: true
},
  {
    headerName: 'Duration',
    cellClass: "grid-cell-centered",
    field: 'Time',
    resizable: true,
    filter: 'agTextColumnFilter',
    width: 350,
    dropdownItem: true
},
    
    
];

  starColor: StarRatingColor = StarRatingColor.accent;
  starColorP: StarRatingColor = StarRatingColor.primary;
  starColorW: StarRatingColor = StarRatingColor.warn;

  constructor(
    private candidateService:CandidateserviceService,
     
    private _formBuilder: FormBuilder, private matdialog: MatDialog,
    private _fuseProgressBarService: FuseLoadingService,
    private _questionnaireService:QuestionnaireService,
    //public _fuseSidebarService: FuseSidebarService,
   // public assignmentService:AssignmentService
   ) 
    {
      this.dllskillgroup = 0
      this.context = {
        componentParent: this
      };
      this.defaultColDef = {
        sortable: true,
        resizable: true,
        width: 100
          };
  
     // this._fuseSidebarService.getSidebar('navbar').toggleFold();
          this.gridOptions = <GridOptions>{
              enableSorting: true,
              enableFilter: true,
          };
          this.rowSelection = 'multiple';
          this.gridOptions.columnDefs = this.webColumns;
          this.gridOptions.pagination = true;
          this.gridOptions.paginationPageSize=10;
          this.gridOptions.skipHeaderOnAutoSize = true;
         
          this.frameworkComponents = {
            DateRendererComponent: DateRendererComponent,
            JobGridActionbuttonsComponent: JobGridActionbuttonsComponent,
            ButtonsRendererComponent: ButtonsRendererComponent
        };
        this.SelectedSkillGroup= 'All';
        this.SelectedLevelGroup='All';
        this.SelectedStatusGroup=true;
        this.firstFormGroup = this._formBuilder.group({
          ddlquestiontype :[''],
          dllskill:[''],
          ddllevel:[''],
          ratingvalue:[''],
          ddltiming:[''],
          ddlstatus:[''],
          textareaQuestion : [''],
          textareaGeneralExpAnswer: [''],
          textareaAssessmentAnswithError: [''],
          textareaAssmentExpAnswer: [''],
          Assignment_Option_A_answer: [''],
          Assignment_Option_B_answer: [''],
          Assignment_Option_C_answer: [''],
          Assignment_Option_D_answer: [''],
          Assignment_ExpAnswer: [''],
      });
    }

  ngOnInit() {
    this.defaultAction = "Select";
    this.defaultSkill = "Select";
    this.selectedskills = "Select";
    this.AddEditdefaultSkill = "Select";
    this.defaultLevel = "Select";
    this.defaultStatus="Active";
    this.AddEditdefaultLevel = "Select";
    this.AddEditdefaultQuestionnaireType="Select";
    this.defaultRating = "Select";
    this.AddEditdefaultTime = "Select";
    this.defaultExpAnswer = "Select";
    this.defaultQuestionStatus="Active";
    this.getcandidateskills();
    // this.candidateService.getAllSkillslist().subscribe(data=>{
    //    
    //     this.Skills = data;
    //     //this.defaultSkill = this.Skills[0];
    //     this.selectedskills = "Select";
    //   });
  }

  onRatingChanged(rating) {
    this.rating = rating;
  }
  getcandidateskills() {
     
    this.candidateService.getcandidateskills().subscribe(data => {
      console.log(this.candidateService);
        this.Skills = data.Table;
         
    });
}
  aggridbind(){
       
      this._fuseProgressBarService.show();
    this._questionnaireService.GetdefaultQuestionnaireList().subscribe(data=>{
       
      this.rowData = data.Table;
      this.AssessmentTypeActiveCount = data.Table1[0];
      this.AssessmentTypeInActiveCount = data.Table1[1];
      this.AssignmentTypeActiveCount = data.Table1[2];
      this.AssignmentTypeInActiveCount = data.Table1[3];
      this.HrTypeActiveCount = data.Table1[4];
      //this.HrActiveCountJunior = data.Table1[4].Junior;
      this.HrTypeInActiveCount = data.Table1[5];
      this.ManagementTypeActiveCount = data.Table1[6];
      this.ManagementTypeInActiveCount = data.Table1[7];
      this.TechnicalTypeActiveCount =data.Table1[10];
      this.TechnicalTypeInActiveCount =data.Table1[11];
      this.PreQualifyingCount = data.Table2;

      this._fuseProgressBarService.hide();
    });
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
  onSelectionChanged(event){
    let selectedRows = this.gridApi.getSelectedRows();
        if (selectedRows.length == 1) {
            this.selectedQuestion = true;
            
        } else {
            this.selectedQuestion = false;
        }
        this.selectedRowsCnt = selectedRows.length;
  }

 clearform()
 {
  this.firstFormGroup.reset();
  this.Isvisible = false;
  
 }

  AddquestionnairePopup()
  {
    this.isEdit=false;
    this.firstFormGroup = this._formBuilder.group({
      ddlquestiontype :[''],
      dllskill:[''],
      ddllevel:[''],
      ratingvalue:[''],
      ddltiming:[''],
      ddlstatus:[''],
      textareaQuestion : [''],
      textareaGeneralExpAnswer: [''],
      textareaAssessmentAnswithError: [''],
      textareaAssmentExpAnswer: [''],
      Assignment_Option_A_answer: [''],
      Assignment_Option_B_answer: [''],
      Assignment_Option_C_answer: [''],
      Assignment_Option_D_answer: [''],
      Assignment_ExpAnswer: ['']
  });
    this.openQuestionnaireModal(this.AddQuestionnaire);
  }

  openQuestionnaireModal(templateRef: TemplateRef<any>) {
    const dialogRef = this.matdialog.open(templateRef, {
        width: '1050px',
        height: '600px',
        autoFocus: false,
    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  AddEditSelectStatus(val:any)
  {
    
    console.log(this.firstFormGroup);
    this.AddEditSelectStatusval='';
    if(val == 'Active')
        this.AddEditSelectStatusval=true;
    else
        this.AddEditSelectStatusval=false;
  }
  AddEditSelectSkill(val:any)
  {
    this.AddEditSelectSkillval='';
    this.AddEditSelectSkillval=val;
  }
  AddEditSelectLevel(val:any)
  {
    this.AddEditSelectLevelval='';
    this.AddEditSelectLevelval=val;
  }

  AddEditSelectTiming(val:any)
  {
    this.AddEditSelectTime='';
    this.AddEditSelectTime=val;
  }

  Cancelquestionnairetype()
  {
    this.clearform();     
    this.matdialog.closeAll();
  }

  changequestionnairetype(val:any)
  {
     if(val=='Select')
    {
      this.Isvisible = false;
    }     
    this.selectedquestionnairetext='';
     this.hrexpectedanswer=false;
     this.assessmentexpans=false;
     this.assignmentexpans=false;
     this.prequaligying = false;
     this.AddEditdefaultQuestionnaireType = val;
     this.clearform();     
     if(val=='HR' || val=='Management' || val=='Technical')
     {
        this.selectedquestionnairetext = 'Type :' + ''  +val + '' + '(Questionnaire model is rating)';
        this.hrexpectedanswer = true;
        this.Isvisible = true;

        this.firstFormGroup = this._formBuilder.group({
          ddlquestiontype : [val],
          dllskill:['', Validators.required],
          ddllevel:['', Validators.required],
          ddltiming:['', Validators.required],
          ddlstatus:['', Validators.required],
          textareaQuestion : ['', Validators.required],
          textareaGeneralExpAnswer: ['', Validators.required],
          textareaAssessmentAnswithError: [''],
          textareaAssmentExpAnswer: [''],
          Assignment_Option_A_answer: [''],
          Assignment_Option_B_answer: [''],
          Assignment_Option_C_answer: [''],
          Assignment_Option_D_answer: [''],
          Assignment_ExpAnswer: ['']
      });

     }
     if(val=='Assessment')
     {
        this.selectedquestionnairetext = 'Type :' + '' +val + '' + '(Questionnaire model is Correct Wrong Answer)';
        this.assessmentexpans=true;
        this.Isvisible = true;
        
        this.firstFormGroup = this._formBuilder.group({
          ddlquestiontype : [val],
          dllskill:['', Validators.required],
          ddllevel:['', Validators.required],
          ddltiming:['', Validators.required],
          ddlstatus:['', Validators.required],
          textareaAssessmentAnswithError: ['', Validators.required],
          textareaAssmentExpAnswer: ['', Validators.required],
          textareaQuestion : [''],
          textareaGeneralExpAnswer: [''],
          Assignment_Option_A_answer: [''],
          Assignment_Option_B_answer: [''],
          Assignment_Option_C_answer: [''],
          Assignment_Option_D_answer: [''],
          Assignment_ExpAnswer: ['']
      });

     }  
     if(val=='Assignment')
     {
        this.selectedquestionnairetext = 'Type :' + '' +val + '' + '(Questionnaire model is multiple choice)';
        this.assignmentexpans = true;
        this.Isvisible = true;

        this.firstFormGroup = this._formBuilder.group({
          ddlquestiontype : [val],
          dllskill:['', Validators.required],
          ddllevel:['', Validators.required],
          ddltiming:['', Validators.required],
          ddlstatus:['', Validators.required],
          textareaAssessmentAnswithError: [''],
          textareaAssmentExpAnswer: [''],
          textareaQuestion : [''],
          textareaGeneralExpAnswer: [''],
          Assignment_Option_A_answer: ['', Validators.required],
          Assignment_Option_B_answer: ['', Validators.required],
          Assignment_Option_C_answer: ['', Validators.required],
          Assignment_Option_D_answer: ['', Validators.required],
          Assignment_ExpAnswer: ['', Validators.required]
        });

     }   
     if(val == 'Pre-Qualifying')
     {
        this.selectedquestionnairetext = 'Type :' + '' +val + '' + '(Questionnaire model is multiple choice)';
        this.prequaligying = true;
        this.Isvisible = true;

        this.firstFormGroup = this._formBuilder.group({
          ddlquestiontype : [val],
          dllskill:[''],
          ddllevel:[''],
          ddltiming:[''],
          ddlstatus:['', Validators.required],
          textareaAssessmentAnswithError: [''],
          textareaAssmentExpAnswer: [''],
          textareaQuestion : ['', Validators.required],
          textareaGeneralExpAnswer: [''],
          Assignment_Option_A_answer: [''],
          Assignment_Option_B_answer: [''],
          Assignment_Option_C_answer: [''],
          Assignment_Option_D_answer: [''],
          Assignment_ExpAnswer: ['']
        });
     }
     
  }

  SaveQuestionnaire()
  {
      this._fuseProgressBarService.show();
         let skill = this.firstFormGroup.get('dllskill').value;
         if(skill == 'Select')
         {
           skill = 'General';
         }
         var payLoad={
          Id:0,
          QuestionnaireType :this.AddEditdefaultQuestionnaireType,
          Skill :skill,
          Level :this.AddEditSelectLevelval,
          Time :this.firstFormGroup.get('ddltiming').value,
          QuestionStatus :this.firstFormGroup.get('ddlstatus').value,
          Question : this.firstFormGroup.get('textareaQuestion').value,
          GeneralExpectedAnswer : this.firstFormGroup.get('textareaGeneralExpAnswer').value,
          GeneralRating : this.rating.toString(),
          AnswerWithErrorAssessment : this.firstFormGroup.get('textareaAssessmentAnswithError').value,
          AssessmentExpectedAnswer : this.firstFormGroup.get('textareaAssmentExpAnswer').value,
          OptionA : this.firstFormGroup.get('Assignment_Option_A_answer').value,
          OptionB : this.firstFormGroup.get('Assignment_Option_B_answer').value,
          OptionC: this.firstFormGroup.get('Assignment_Option_C_answer').value,
          OptionD: this.firstFormGroup.get('Assignment_Option_D_answer').value,
          AssignmentExpectedAnswer : this.firstFormGroup.get('Assignment_ExpAnswer').value,
          JobId : 0,
          CandidateId :0,
          DMLType : 'INSERT'
        }
        this._questionnaireService.QuestionnaireOperations(payLoad).subscribe(data=>{
          this._fuseProgressBarService.hide();
          this.rating=0;
          this.aggridbind();
          this.matdialog.closeAll();
          Swal.fire(
              'Questionnaire Saved successfully!',
              '',
              'success'
          );
        });      
        this._fuseProgressBarService.hide();
  }


  redirectToDeleteQuestion(id:any)
 
  {
    
    var payLoad={
      Id: id,
      DMLType : 'DELETE'
    };
    Swal.fire({
      title: 'Are you sure want to delete the Question?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
  }).then((result) => {
      if (result.value) {
        this._questionnaireService.QuestionnaireOperations(payLoad).subscribe(data=>{
          this._fuseProgressBarService.hide();
          this.aggridbind();
          this.isEdit=false;
          this.selectedRowsCnt=0;
          this.matdialog.closeAll();
          Swal.fire(
              'Question Deleted successfully!',
              '',
              'success'
          );
        });  
        this._fuseProgressBarService.hide();
      }
    });
  }


  SelectStatusGroupOption(Status:any,Filtertype :any)
  {
     
    console.log(this.firstFormGroup);
      this._questionnaireService.QuestionnaireFilter(Status,Filtertype).subscribe(data=>{
     this.rowData =  data.Table;
     
    });  
   }

  redirectToEditQuestion(id:any)
  {
   
    Swal.fire({
      title: 'Are you sure want to edit the Question?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
  }).then((result) => {
      if (result.value) {
        this.isEdit=true;
        this._questionnaireService.GetQuestionbyId(id).subscribe(data=>{
          this._fuseProgressBarService.hide();
          let GetQuestionnaireData = data.Table[0];
          this.selectedRowsCnt=0;
          let _qtype=GetQuestionnaireData.QuestionnaireType;
          this.EditQuestionnaireId = GetQuestionnaireData.Id;
            let rating = Number(GetQuestionnaireData.GeneralRating);
            let skill = GetQuestionnaireData.Skill;
            if(skill == 'GENERAL' || skill =='General')
            {
                 skill ='Select';
            }
            this.clearform();
            this.Isvisible = true;
            this.firstFormGroup = this._formBuilder.group({
              ddlquestiontype :[GetQuestionnaireData.QuestionnaireType],
              dllskill:[skill],
              ddllevel:[GetQuestionnaireData.Level],
              ratingvalue:[rating],
              ddltiming:[GetQuestionnaireData.Time],
              ddlstatus:[GetQuestionnaireData.QuestionStatus],
              textareaQuestion : [GetQuestionnaireData.Question],
              textareaGeneralExpAnswer: [GetQuestionnaireData.GeneralExpectedAnswer],
              textareaAssessmentAnswithError: [GetQuestionnaireData.AnswerWithErrorAssessment],
              textareaAssmentExpAnswer: [GetQuestionnaireData.AssessmentExpectedAnswer],
              Assignment_Option_A_answer: [GetQuestionnaireData.OptionA],
              Assignment_Option_B_answer: [GetQuestionnaireData.OptionB],
              Assignment_Option_C_answer: [GetQuestionnaireData.OptionC],
              Assignment_Option_D_answer: [GetQuestionnaireData.OptionD],
              Assignment_ExpAnswer: [GetQuestionnaireData.AssignmentExpectedAnswer]
          });
            this.AddEditdefaultQuestionnaireType =_qtype;
          
            this.AddEditSelectSkillval=skill;
            
            this.AddEditSelectStatusval = data['Active'];
            this.onRatingChanged(rating);
              this.hrexpectedanswer=false;
              this.assessmentexpans=false;
              this.assignmentexpans=false;
           
            if(_qtype=='HR' || _qtype=='Management' || _qtype=='Technical')
            {
               this.selectedquestionnairetext = 'Type :' + ''  +_qtype + '' + '(Questionnaire model is rating)';
               this.hrexpectedanswer = true;
               this.AddEditdefaultSkill='Select';
            }
            if(_qtype=='Assessment')
            {
               this.selectedquestionnairetext = 'Type :' + '' +_qtype + '' + '(Questionnaire model is Correct Wrong Answer)';
               this.assessmentexpans=true;
            }  
            if(_qtype=='Assignment')
            {
               this.selectedquestionnairetext = 'Type :' + '' +_qtype + '' + '(Questionnaire model is multiple choice)';
               this.assignmentexpans = true;
            }   
        }); 
        this.UpdatequestionnairePopup(); 
        this._fuseProgressBarService.hide();
      }
    });
  }

  UpdatequestionnairePopup()
  {
    this.openQuestionnaireModal(this.AddQuestionnaire);
  }

  UpdateQuestionnaire()
  {
    this._fuseProgressBarService.show();
         let skill = this.firstFormGroup.get('dllskill').value;
         if(skill == 'Select')
         {
           skill = 'General';
         }
         var payLoad={
          Id: this.EditQuestionnaireId,
          QuestionnaireType :this.AddEditdefaultQuestionnaireType,
          Skill :skill,
          Level :this.AddEditSelectLevelval,
          Time :this.firstFormGroup.get('ddltiming').value,
          QuestionStatus :this.firstFormGroup.get('ddlstatus').value,
          Question : this.firstFormGroup.get('textareaQuestion').value,
          GeneralExpectedAnswer : this.firstFormGroup.get('textareaGeneralExpAnswer').value,
          GeneralRating : this.rating.toString(),
          AnswerWithErrorAssessment : this.firstFormGroup.get('textareaAssessmentAnswithError').value,
          AssessmentExpectedAnswer : this.firstFormGroup.get('textareaAssmentExpAnswer').value,
          OptionA : this.firstFormGroup.get('Assignment_Option_A_answer').value,
          OptionB : this.firstFormGroup.get('Assignment_Option_B_answer').value,
          OptionC: this.firstFormGroup.get('Assignment_Option_C_answer').value,
          OptionD: this.firstFormGroup.get('Assignment_Option_D_answer').value,
          AssignmentExpectedAnswer : this.firstFormGroup.get('Assignment_ExpAnswer').value,
          JobId : 0,
          CandidateId :0,
          DMLType : 'UPDATE'
        }
        this._questionnaireService.QuestionnaireOperations(payLoad).subscribe(data=>{
          this._fuseProgressBarService.hide();
          this.rating=0;
          this.isEdit=false;
          this.aggridbind();
          this.selectedRowsCnt=0;
          this.matdialog.closeAll();
          Swal.fire(
              'Questionnaire Updated successfully!',
              '',
              'success'
          );
        });      
        this._fuseProgressBarService.hide();
  }
}
