import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GridOptions } from '@ag-grid-community/all-modules';
import { MatDialog } from "@angular/material/dialog";
import {FormBuilder, FormGroup, FormControl, FormArray, AbstractControl, Validators} from '@angular/forms';
import { AlertDialogComponent } from 'app/shared/alert-dialog/alert-dialog.component';
import { HttpClient } from '@angular/common/http';
import { CompanyGridActionbuttonsComponent } from '../company/components/company-grid-actionbuttons.component'
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ImageRendererComponent } from "../company/components/company-grid-imagerenderer.component";
import { RepositoryConstant } from '../../../constants/Repository.constant';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  public apiUrl:string=RepositoryConstant.apiUrl;
  private gridApi;
  private gridColumnApi;
  private columnDefs;
  public defaultColDef;
  public rowData;
  public rowSelection;
  public gridOptions: GridOptions;
  companyFormGroup: FormGroup;
  public frameworkComponents;
  gridtotRowCount;
  jobGridSearchFilter = '';
  isAction = 'Add';
  context: any;
  CompanyProfileImage;
  constructor(
    private http: HttpClient,
    private matdialog:MatDialog,
    private _formBuilder: FormBuilder) { this.context = {
    componentParent: this
    };
    this.gridOptions = <GridOptions>{
      enableSorting: true,
      enableFilter: true,

  };
  this.gridOptions.columnDefs = this.webColumns;

        this.defaultColDef = {
            sortable: true,
            resizable: true,
        };
        this.rowSelection = 'multiple';
        this.gridOptions.pagination = true;
        this.gridOptions.skipHeaderOnAutoSize = true;
        this.frameworkComponents = {
          GridActionbuttonsComponent: CompanyGridActionbuttonsComponent,
          ImageRendererComponent: ImageRendererComponent
      };
  }
  
  public webColumns = [
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
        width: 110,
        valueGetter: function(params) {
            return {
                curTab:'Company',
                Id: params.data.Id,
                Name: params.data.Name,
                Overview: params.data.Overview,
                Active: params.data.Active,
                CompanyImage: params.data.CompanyImage,
                Assigned : params.data.Assigned,
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
        width: 70,
        dropdownItem: true
    },
    { headerName: 'Logo', 
      field: "", 
      width: 80,
      cellClass: "grid-cell-centered",
      sortable: false, 
      autoHeight: true,
      cellRendererFramework: ImageRendererComponent 
    },
    {
        headerName: 'Company',
        field: 'name',
        filter: 'agTextColumnFilter',
        tooltipField: 'Name',
        width: 200,
        dropdownItem: true
    },
    {
      headerName: 'Overview',
      field: 'overview',
      filter: 'agTextColumnFilter',
      tooltipField: 'Overview',
      width: 450,
      dropdownItem: true
  },
  {
    headerName: 'Active',
    cellClass: 'grid-cell-centered',
    field: 'active',
    filter: 'agTextColumnFilter',
    tooltipField: 'Active',
    width: 100,
    dropdownItem: true
},
];

onFileInput(event){
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();

    reader.readAsDataURL(event.target.files[0]); // read file as data url

    reader.onload = (event:any) => { // called once readAsDataURL is completed
      this.CompanyProfileImage = event.target.result;
    }
  }
}

onGridReady(params) {
  this.http
            .get<any>(
                //'https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/getCompaniesList'
                this.apiUrl + '/api/userAdminService/getCompaniesList'
            )
            .subscribe(data => {
                this.rowData = data.$values;
                this.gridtotRowCount = data.$values.length;
            });
}

onQuickFilterChanged() {
  this.gridOptions.api.setQuickFilter(this.jobGridSearchFilter);
}

style = {

  width: '100%',
  height: '80vh',
  flex: '1 1 auto'
};

public openModal(templateRef: TemplateRef<any>) {
  this.isAction = 'Add';
  this.CompanyProfileImage = '';
  this.companyFormGroup.reset();
  const dialogRef = this.matdialog.open(templateRef, {
     width: '500px',
     height: '500px',
     autoFocus: false,
   });

   dialogRef.afterClosed().subscribe(result => {
   });
 }

 saveCompany()
 {
 // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/createcompany',{
  this.http.post<any>(this.apiUrl + '/api/userAdminService/createcompany',{
    Name: this.companyFormGroup.get('company_name').value,
    Overview: this.companyFormGroup.get('company_overview').value,
    CompanyImage: this.CompanyProfileImage}).subscribe(data => {
    this.rowData = data;
    this.onGridReady(this.gridOptions);
    this.matdialog.closeAll();
    Swal.fire(
      'Company added successfully!',
      '',
      'success'
  );
});
 }

 updateCompany()
 {
 // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/updatecompany',{
  this.http.post<any>(this.apiUrl + '/api/userAdminService/updatecompany',{
    Id: this.companyFormGroup.get('Id').value,
    Name: this.companyFormGroup.get('company_name').value,
    Overview: this.companyFormGroup.get('company_overview').value,
    CompanyImage: this.CompanyProfileImage}).subscribe(data => {
    this.rowData = data;
    this.onGridReady(this.gridOptions);
    this.matdialog.closeAll();
    Swal.fire(
      'Company updated successfully!',
      '',
      'success'
  );
});
 }

 deactivateCompany(Id: any)
 {
 // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/checkCompanyStatus?companyId=' + Id, {}).subscribe(data => {
  this.http.get<any>(this.apiUrl + '/api/userAdminService/checkCompanyStatus?companyId=' + Id, {}).subscribe(data => {
    this.onGridReady(this.gridOptions);          
    if(!Object.values(data)[0])
      {
      Swal.fire(
        'Unable to deactivate Company, as it is associated with one or more jobs.',
        '',
        'error'
        );
      }
      else {
        Swal.fire(
          'Company deactivated successfully!.',
          '',
          'success'
          );
        }
  });
 }

 activateCompany(Id: any)
 {
 // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/reActivateCompany?companyId=' + Id, {}).subscribe(data => {
  this.http.get<any>(this.apiUrl + '/api/userAdminService/reActivateCompany?companyId=' + Id, {}).subscribe(data => {
    this.onGridReady(this.gridOptions);            
    Swal.fire(
              'Company Re-activated successfully!.',
              '',
              'success'
              );
        });
 }
 
 deleteCompany(Id: any) {
  Swal.fire({
    title: 'Are you sure?',
    text: '',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      this.http.get<any>(this.apiUrl + '/api/userAdminService/deleteCompany?id=' + Id, {}).subscribe(data => {
        this.onGridReady(this.gridOptions);            
        Swal.fire(
          'Company deleted successfully!.',
          '',
          'success'
        );
      });
    }
  });
}

 
 @ViewChild('Companies', { static: true }) Companies: TemplateRef<any>;
 edit(params: any){
  var templateRef: TemplateRef<any>;
  templateRef = this.Companies;
  this.isAction = 'Edit';
  const dialogRef = this.matdialog.open(templateRef, {
    width: '500px',
    height: '500px',
    autoFocus: false,
    
    });
    this.companyFormGroup.setValue({'Id': params["value"]['Id'],'company_name': params["value"]['Name'],'company_overview':params["value"]['Overview']});
    this.CompanyProfileImage = params["value"]["CompanyImage"];
    dialogRef.afterClosed().subscribe(result => {
      if(result){
          }
      else {
          this.onGridReady(this.gridOptions);
      }
      
    });
}
  ngOnInit() {
    this.companyFormGroup = this._formBuilder.group({
      Id: [''],
      company_name: ['', Validators.required],
      company_overview: ['', Validators.required],
  });
  }

}
