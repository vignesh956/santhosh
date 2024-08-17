import { Component, OnInit, TemplateRef,ViewChild } from '@angular/core';
import { GridOptions } from '@ag-grid-community/all-modules';
import { MatDialog } from "@angular/material/dialog";
import {FormBuilder, FormGroup, FormControl, FormArray, AbstractControl, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AlertDialogComponent } from 'app/shared/alert-dialog/alert-dialog.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { JobsGridActionbuttonsComponent } from '../jobs/components/jobs-grid-actionbuttons.component';
import { RepositoryConstant } from '../../../constants/Repository.constant';
@Component({
  selector: 'config-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
  public apiUrl:string=RepositoryConstant.apiUrl;
  private gridApi;
  public defaultColDef;
  public rowData;
  public rowSelection;
  public gridOptions: GridOptions;
  functionalAreaFormGroup: FormGroup;
  public frameworkComponents;
  gridtotRowCount;
  jobGridSearchFilter = '';

  //Job Industry
  private gridIndustryApi;
  public defaultIndustryColDef;
  public rowIndustryData;
  public rowIndustrySelection;
  public gridIndustryOptions: GridOptions;
  industryFormGroup: FormGroup;
  public frameworkIndustryComponents;
  gridIndustrytotRowCount;
  jobGridIndustrySearchFilter = '';

  //Job Benefits
  private gridBenefitsApi;
  public defaultBenefitsColDef;
  public rowBenefitsData;
  public rowBenefitsSelection;
  public gridBenefitsOptions: GridOptions;
  benefitsFormGroup: FormGroup;
  public frameworkBenefitsComponents;
  gridBenefittotRowCount;
  jobGridBenefitSearchFilter = '';

  //Job Skills
  private gridSkillsApi;
  public defaultSkillsColDef;
  public rowSkillsData;
  public rowSkillsSelection;
  public gridSkillsOptions: GridOptions;
  skillsFormGroup: FormGroup;
  public frameworkSkillsComponents;
  gridSkillstotRowCount;
  jobGridSkillSearchFilter = '';

  isAction = 'Add';
  context: any;
  contextIndustry: any;
  contextBenefit: any;
  contextSkill: any;
  constructor(
    private http: HttpClient,
    private matdialog:MatDialog,
    private _formBuilder: FormBuilder) { this.context = {
    componentParent: this
    };
    this.contextIndustry = {
      componentParent: this
      };
    this.contextBenefit = {
      componentParent: this
      };
      this.contextSkill = {
        componentParent: this
        };
    this.gridOptions = <GridOptions>{
      enableSorting: true,
      enableFilter: true,
  };
  this.gridIndustryOptions = <GridOptions>{
    enableSorting: true,
    enableFilter: true,
  };
  this.gridBenefitsOptions = <GridOptions>{
    enableSorting: true,
    enableFilter: true,
  };
  this.gridSkillsOptions = <GridOptions>{
    enableSorting: true,
    enableFilter: true,
  };
  this.gridOptions.columnDefs = this.webColumns;
  this.gridIndustryOptions.columnDefs = this.webIndustryColumns;
  this.gridBenefitsOptions.columnDefs = this.webBenefitsColumns;
  this.gridSkillsOptions.columnDefs = this.webSkillsColumns;

        this.defaultColDef = {
            sortable: true,
            resizable: true,
        };
        this.rowSelection = 'multiple';
        this.gridOptions.pagination = true;
        this.gridOptions.skipHeaderOnAutoSize = true;
        this.frameworkComponents = {
        GridActionbuttonsComponent: JobsGridActionbuttonsComponent
      };
      this.defaultIndustryColDef = {
        sortable: true,
        resizable: true,
      };
      this.rowIndustrySelection = 'multiple';
      this.gridIndustryOptions.pagination = true;
      this.gridIndustryOptions.skipHeaderOnAutoSize = true;
      this.frameworkIndustryComponents = {
      GridActionbuttonsComponent: JobsGridActionbuttonsComponent
      };
      this.defaultBenefitsColDef = {
        sortable: true,
        resizable: true,
      };
      this.rowBenefitsSelection = 'multiple';
      this.gridBenefitsOptions.pagination = true;
      this.gridBenefitsOptions.skipHeaderOnAutoSize = true;
      this.frameworkBenefitsComponents = {
      GridActionbuttonsComponent: JobsGridActionbuttonsComponent
      };
      this.defaultSkillsColDef = {
        sortable: true,
        resizable: true,
      };
      this.rowSkillsSelection = 'multiple';
      this.gridSkillsOptions.pagination = true;
      this.gridSkillsOptions.skipHeaderOnAutoSize = true;
      this.frameworkSkillsComponents = {
      GridActionbuttonsComponent: JobsGridActionbuttonsComponent
      };
  }

  public webColumns = [
    // {
    //     headerName: "",
    //     field: "",
    //     showCol: false,
    //     checkboxSelection: true,
    //     headerCheckboxSelection: true,
    //     width: 50
    // },
    {
        headerName: "Action",
        cellClass: "grid-cell-centered",
        field: "",
        sortable: false,
        cellRenderer: "GridActionbuttonsComponent",
        width: 90,
        valueGetter: function(params) {
            return {
                curTab: 'FunctionalArea',
                Id: params.data.Id,
                Name: params.data.Name,
                params: params
            };
        },
    },
    {
        headerName: 'Id',
        field: 'id',
        cellClass: "grid-cell-centered",
        filter: 'agTextColumnFilter',
        width: 80
    },
    {
      headerName: 'Functional Area',
      field: 'name',
      filter: 'agTextColumnFilter',
      tooltipField: 'Functional Area',
      width: 775
  },
];

public webIndustryColumns = [
  // {
  //     headerName: "",
  //     field: "",
  //     showCol: false,
  //     checkboxSelection: true,
  //     headerCheckboxSelection: true,
  //     width: 50,
  //     dropdownItem: false
  // },
  {
      headerName: "Action",
      cellClass: "grid-cell-centered",
      field: "",
      sortable: false,
      cellRenderer: "GridActionbuttonsComponent",
      width: 90,
      valueGetter: function(params) {
          return {
              curTab: 'Industry',
              Id: params.data.Id,
              Name: params.data.Name,
              params: params
          };
      },
      dropdownItem: false
  },
  {
      headerName: 'Id',
      field: 'id',
      cellClass: "grid-cell-centered",
      filter: 'agTextColumnFilter',
      width: 80,
      dropdownItem: true
  },
  {
    headerName: 'Industry Name',
    field: 'name',
    filter: 'agTextColumnFilter',
    tooltipField: 'Industry Name',
    width: 765,
    dropdownItem: true
},
];

public webBenefitsColumns = [
  // {
  //     headerName: "",
  //     field: "",
  //     showCol: false,
  //     checkboxSelection: true,
  //     headerCheckboxSelection: true,
  //     width: 50,
  //     dropdownItem: false
  // },
  {
      headerName: "Action",
      cellClass: "grid-cell-centered",
      field: "",
      sortable: false,
      cellRenderer: "GridActionbuttonsComponent",
      width: 90,
      valueGetter: function(params) {
          return {
              curTab: 'Benefit',
              Id: params.data.Id,
              Name: params.data.Name,
              params: params
          };
      },
      dropdownItem: false
  },
  {
      headerName: 'Id',
      field: 'id',
      cellClass: "grid-cell-centered",
      filter: 'agTextColumnFilter',
      width: 80,
      dropdownItem: true
  },
  {
    headerName: 'Benefit Name',
    field: 'name',
    filter: 'agTextColumnFilter',
    tooltipField: 'Benefit Name',
    width: 765,
    dropdownItem: true
},
];

public webSkillsColumns = [
  // {
  //     headerName: "",
  //     field: "",
  //     showCol: false,
  //     checkboxSelection: true,
  //     headerCheckboxSelection: true,
  //     width: 50,
  //     dropdownItem: false
  // },
  {
      headerName: "Action",
      cellClass: "grid-cell-centered",
      field: "",
      sortable: false,
      cellRenderer: "GridActionbuttonsComponent",
      width: 90,
      valueGetter: function(params) {
          return {
              curTab: 'Skill',
              Id: params.data.Id,
              Name: params.data.Name,
              params: params
          };
      },
      dropdownItem: false
  },
  {
      headerName: 'Id',
      field: 'id',
      cellClass: "grid-cell-centered",
      filter: 'agTextColumnFilter',
      width: 80,
      dropdownItem: true
  },
  {
    headerName: 'Skill Name',
    field: 'name',
    filter: 'agTextColumnFilter',
    tooltipField: 'Skill Name',
    width: 757,
    dropdownItem: true
},
];

onGridReady(params) {
  this.http
            .get<any>(
               // 'https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/getfunctionalAreasList'
               this.apiUrl + '/api/userAdminService/getfunctionalAreasList'
            )
            .subscribe(data => {
                this.rowData = data.$values;
                this.gridtotRowCount = data.$values.length;
            });
}

onQuickFilterChanged() {
  this.gridOptions.api.setQuickFilter(this.jobGridSearchFilter);
}

onIndustryGridReady(params) {
  this.http
            .get<any>(
               // 'https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/getIndustriesList'
               this.apiUrl + '/api/userAdminService/getIndustriesList'
            )
            .subscribe(data => {
              console.log(data , 'rowIndustryData 1111')
                this.rowIndustryData = data.$values;
                this.gridIndustrytotRowCount = data.length;
            });
}

onQuickIndustryFilterChanged() {
  this.gridIndustryOptions.api.setQuickFilter(this.jobGridIndustrySearchFilter);
}

onBenefitsGridReady(params) {
  this.http
            .get<any>(
                //'https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/getbenefitsList'
                this.apiUrl + '/api/userAdminService/getbenefitsList'
            )
            .subscribe(data => {
                this.rowBenefitsData = data.$values;
                this.gridBenefittotRowCount = data.length;
            });
}

onQuickBenefitFilterChanged() {
  this.gridBenefitsOptions.api.setQuickFilter(this.jobGridBenefitSearchFilter);
}

onSkillsGridReady(params) {
  this.http
            .get<any>(
               // 'https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/getSkillsList'
               this.apiUrl + '/api/userAdminService/getSkillsList'
            )
            .subscribe(data => {
                this.rowSkillsData = data.$values;
                this.gridSkillstotRowCount = data.length;
            });
}

onQuickSkillFilterChanged() {
  this.gridSkillsOptions.api.setQuickFilter(this.jobGridSkillSearchFilter);
}

style = {

  width: '100%',
  height: '80vh',
  flex: '1 1 auto'
};

public openModal(templateRef: TemplateRef<any>) {
  this.isAction = 'Add';
  this.functionalAreaFormGroup.reset();
  this.industryFormGroup.reset();
  this.benefitsFormGroup.reset();
  this.skillsFormGroup.reset();
  const dialogRef = this.matdialog.open(templateRef, {
     width: '500px',
     height: '300px',
     autoFocus: false,
   });

   dialogRef.afterClosed().subscribe(result => {
   });
 }

 saveFunctionalArea()
 {
 // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/createfunctionalAreas',{
  this.http.post<any>(this.apiUrl + '/api/userAdminService/createfunctionalAreas',{
    Name: this.functionalAreaFormGroup.get('functional_area_name').value}).subscribe(data => {
    this.rowData = data;
    this.onGridReady(this.gridOptions);
    this.matdialog.closeAll();
    Swal.fire(
      'Functional area added successfully!',
      '',
      'success'
  );
});
 }

 updateFunctionalArea()
 {
 // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/updatefunctionalAreas',{
  this.http.post<any>(this.apiUrl + '/api/userAdminService/updatefunctionalAreas',{
    Id: this.functionalAreaFormGroup.get('Id').value,
    Name: this.functionalAreaFormGroup.get('functional_area_name').value}).subscribe(data => {
    this.rowData = data;
    this.onGridReady(this.gridOptions);
    this.matdialog.closeAll();
    Swal.fire(
      'Functional area updated successfully!',
      '',
      'success'
  );
});
 }

 saveIndustry()
 {
 // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/createIndustry',{
  this.http.post<any>(this.apiUrl + '/api/userAdminService/createIndustry',{
    Name: this.industryFormGroup.get('industry_name').value}).subscribe(data => {
      console.log(data , 'rowIndustryData 22222222 on save')
    this.rowIndustryData = data;
    this.onIndustryGridReady(this.gridIndustryApi);
    this.matdialog.closeAll();
    Swal.fire(
      'Industry added successfully!',
      '',
      'success'
  );
});
 }

 updateIndustry()
 {
 // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/updateIndustry',{
  this.http.post<any>(this.apiUrl + '/api/userAdminService/updateIndustry',{
    Id: this.industryFormGroup.get('Id').value,
    Name: this.industryFormGroup.get('industry_name').value}).subscribe(data => {
      console.log(data , 'rowIndustryData 3333333 on update')
    this.rowIndustryData = data;
    this.onIndustryGridReady(this.gridIndustryApi);
    this.matdialog.closeAll();
    Swal.fire(
      'Industry updated successfully!',
      '',
      'success'
  );
});
 }

 saveBenefit()
 {
 // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/createBenefit',{
  this.http.post<any>(this.apiUrl + '/api/userAdminService/createBenefit',{
    Name: this.benefitsFormGroup.get('benefit_name').value}).subscribe(data => {
    this.rowBenefitsData = data;
    this.onBenefitsGridReady(this.gridBenefitsApi);
    this.matdialog.closeAll();
    Swal.fire(
      'Benefit added successfully!',
      '',
      'success'
  );
});
 }

 updateBenefit()
 {
 // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/updateBenefit',{
  this.http.post<any>(this.apiUrl + '/api/userAdminService/updateBenefit',{
    Id: this.benefitsFormGroup.get('Id').value,
    Name: this.benefitsFormGroup.get('benefit_name').value}).subscribe(data => {
    this.rowBenefitsData = data;
    this.onBenefitsGridReady(this.gridBenefitsApi);
    this.matdialog.closeAll();
    Swal.fire(
      'Benefit updated successfully!',
      '',
      'success'
  );
});
 }

 saveSkill()
 {
//  this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/createSkill',{
  this.http.post<any>(this.apiUrl + '/api/userAdminService/createSkill',{
    Name: this.skillsFormGroup.get('skill_name').value}).subscribe(data => {
    this.rowSkillsData = data;
    this.onSkillsGridReady(this.gridSkillsApi);
    this.matdialog.closeAll();
    Swal.fire(
      'Skill added successfully!',
      '',
      'success'
  );
});
 }

 updateSkill()
 {
 // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/updateSkill',{
  this.http.post<any>(this.apiUrl + '/api/userAdminService/updateSkill',{
    Id: this.skillsFormGroup.get('Id').value,
    Name: this.skillsFormGroup.get('skill_name').value}).subscribe(data => {
    this.rowSkillsData = data;
    this.onSkillsGridReady(this.gridSkillsApi);
    this.matdialog.closeAll();
    Swal.fire(
      'Skill updated successfully!',
      '',
      'success'
  );
});
 }
 @ViewChild('FunctionalAreas', { static: true }) FunctionalAreas: TemplateRef<any>;
 @ViewChild('Industries', { static: true }) Industries: TemplateRef<any>;
 @ViewChild('Benefits', { static: true }) Benefits: TemplateRef<any>;
 @ViewChild('Skills', { static: true }) Skills: TemplateRef<any>;
 edit(params: any){
   var templateRef: TemplateRef<any>;
  this.isAction = 'Edit';
  if(params["value"]["curTab"] == 'FunctionalArea')
  {
    templateRef = this.FunctionalAreas;
    const dialogRef = this.matdialog.open(templateRef, {
      width: '500px',
      height: '300px',
      autoFocus: false,
      
      });
      this.functionalAreaFormGroup.setValue({'Id': params["value"]["Id"],'functional_area_name': params["value"]["Name"]});
      dialogRef.afterClosed().subscribe(result => {
        if(result){
            }
        else {
            this.onGridReady(this.gridOptions);
        }
      });
  }
  else if(params["value"]["curTab"] == 'Industry')
  {
    templateRef = this.Industries;
    const dialogRef = this.matdialog.open(templateRef, {
      width: '500px',
      height: '300px',
      autoFocus: false,
      
      });
      this.industryFormGroup.setValue({'Id': params["value"]['Id'],'industry_name': params["value"]['Name']});
      dialogRef.afterClosed().subscribe(result => {
        if(result){
            }
        else {
            this.onIndustryGridReady(this.gridIndustryOptions);
        }
      });
  }
  else if(params["value"]["curTab"] == 'Benefit')
  {
    templateRef = this.Benefits;
    const dialogRef = this.matdialog.open(templateRef, {
      width: '500px',
      height: '300px',
      autoFocus: false,
      
      });
      this.benefitsFormGroup.setValue({'Id': params["value"]['Id'],'benefit_name': params["value"]['Name']});
      dialogRef.afterClosed().subscribe(result => {
        if(result){
            }
        else {
            this.onBenefitsGridReady(this.gridBenefitsOptions);
        }
      });
  }
  else if(params["value"]["curTab"] == 'Skill')
  {
    templateRef = this.Skills;
    const dialogRef = this.matdialog.open(templateRef, {
      width: '500px',
      height: '300px',
      autoFocus: false,
      
      });
      this.skillsFormGroup.setValue({'Id': params["value"]['Id'],'skill_name': params["value"]['Name']});
      dialogRef.afterClosed().subscribe(result => {
        if(result){
            }
        else {
            this.onSkillsGridReady(this.gridSkillsOptions);
        }
      });
  }
}
delete(params: any)
{
  if(params["value"]["curTab"] == 'FunctionalArea')
  {
   // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/deleteFunctionalAreas?id=' + params["value"]["Id"], {}).subscribe(data => {
    this.http.get<any>(this.apiUrl + '/api/userAdminService/deleteFunctionalAreas?id=' + params["value"]["Id"], {}).subscribe(data => {
    this.onGridReady(this.gridOptions);            
    Swal.fire(
              'Functional Area deleted successfully!.',
              '',
              'success'
              );
        });
  }
  else if(params["value"]["curTab"] == 'Industry')
  {
   // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/deleteIndustries?id=' + params["value"]["Id"], {}).subscribe(data => {
    this.http.get<any>(this.apiUrl + '/api/userAdminService/deleteIndustries?id=' + params["value"]["Id"], {}).subscribe(data => {
      this.onIndustryGridReady(this.gridIndustryOptions);            
    Swal.fire(
              'Industry deleted successfully!.',
              '',
              'success'
              );
        });
  }
  else if(params["value"]["curTab"] == 'Benefit')
  {
   // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/deleteBenefits?id=' + params["value"]["Id"], {}).subscribe(data => {
    this.http.get<any>(this.apiUrl + '/api/userAdminService/deleteBenefits?id=' + params["value"]["Id"], {}).subscribe(data => {
      this.onBenefitsGridReady(this.gridBenefitsOptions);            
    Swal.fire(
              'Benefit deleted successfully!.',
              '',
              'success'
              );
        });
  }
  else if(params["value"]["curTab"] == 'Skill')
  {
   // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/deleteSkills?id=' + params["value"]["Id"], {}).subscribe(data => {
    this.http.get<any>(this.apiUrl + '/api/userAdminService/deleteSkills?id=' + params["value"]["Id"], {}).subscribe(data => {
      this.onSkillsGridReady(this.gridSkillsOptions);          
    Swal.fire(
              'Skill deleted successfully!.',
              '',
              'success'
              );
        });
  }

}
  ngOnInit() {
    this.functionalAreaFormGroup = this._formBuilder.group({
      Id: [''],
      functional_area_name: ['', Validators.required],
  });
  this.industryFormGroup = this._formBuilder.group({
    Id: [''],
    industry_name: ['', Validators.required],
  });
  this.benefitsFormGroup = this._formBuilder.group({
    Id: [''],
    benefit_name: ['', Validators.required],
  });
  this.skillsFormGroup = this._formBuilder.group({
    Id: [''],
    skill_name: ['', Validators.required],
  });
}
}
