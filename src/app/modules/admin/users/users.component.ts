import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { GridOptions } from '@ag-grid-community/all-modules';
import { HttpClient } from '@angular/common/http';
import { DateRendererComponent } from './components/date-renderer.component';
import { ButtonsRendererComponent } from './components/buttons-renderer.component';
import { FormBuilder, FormGroup, FormControl, FormArray, AbstractControl, Validators} from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialog } from "@angular/material/dialog";
import { AuthenticationService } from 'app/services/authentication.service';
import { UsersService } from './users.service';
import { RepositoryConstant } from 'app/modules/constants/Repository.constant';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  public apiUrl:string=RepositoryConstant.apiUrl;
  private gridApi;
  private gridColumnApi;
  private columnDefs;
  public defaultColDef;
  public rowData;
  public rowSelection;
  public gridOptions: GridOptions;
  userFormGroup: FormGroup;
  public frameworkComponents;
  gridtotRowCount;
  jobGridSearchFilter = '';
  isAction = 'Add';
  context: any;
  userID;
  Roles = ['Administrator', 'Candidate', 'Hiring Manager', 'HR Manager', 'Interviewer', 'Recruiter', 'Super Admin'];

  constructor(
    private http: HttpClient,
    private matdialog: MatDialog,
    private _formBuilder: FormBuilder,
    private authService: AuthenticationService) {
    this.context = {
      componentParent: this
    };
    this.gridOptions = <GridOptions>{
      enableSorting: true,
      enableFilter: true,

    };
    let loggedInfo = this.authService.getLoggedInfo();
    this.userID = loggedInfo.id;
    this.gridOptions.columnDefs = this.webColumns;

    this.defaultColDef = {
      sortable: true,
      resizable: true,
    };
    this.rowSelection = 'multiple';
    this.gridOptions.pagination = true;
    this.gridOptions.skipHeaderOnAutoSize = true;
    this.frameworkComponents = {
      DateRendererComponent: DateRendererComponent,
      GridActionbuttonsComponent: ButtonsRendererComponent
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
      width: 200,
      valueGetter: function (params) {
        return {
          curTab: 'User',
          Id: params.data.Id,
          FirstName: params.data.name.split(' ')[0],
          LastName: params.data.name.split(' ')[1],
          Mobile: params.data.mobile,
          Email: params.data.email,
          Password: params.data.password,
          Role: params.data.role,
          Status: params.data.status,
          Assigned: params.data.assigned,
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
      width: 65,
      dropdownItem: true
    },
    {
      headerName: 'Name',
      field: 'name',
      filter: 'agTextColumnFilter',
      tooltipField: 'Name',
      width: 215,
      dropdownItem: true
    },
    {
      headerName: 'Email',
      field: 'email',
      filter: 'agTextColumnFilter',
      tooltipField: 'Email',
      width: 290,
      dropdownItem: true
    },
    {
      headerName: 'Role',
      cellClass: 'grid-cell-centered',
      field: 'role',
      filter: 'agTextColumnFilter',
      tooltipField: 'Role',
      width: 135,
      dropdownItem: true
    },
    {
      headerName: 'Active',
      cellClass: 'grid-cell-centered',
      field: 'status',
      filter: 'agTextColumnFilter',
      tooltipField: 'Active',
      width: 90,
      dropdownItem: true
    },
    {
      headerName: 'Created Date',
      cellClass: 'grid-cell-centered',
      field: 'createdDate',
      resizable: true,
      cellRenderer: 'DateRendererComponent',
      filter: 'agDateColumnFilter',
      width: 140,
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

  onGridReady(params) {
    this.http
      .get<any>(
        //'https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/getuserlist'
        this.apiUrl + '/api/userAdminService/getuserlist'
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
    height: '90vh',
    flex: '1 1 auto'
  };

  public openModal(templateRef: TemplateRef<any>) {
    this.isAction = 'Add';
    this.userFormGroup.reset();
    const dialogRef = this.matdialog.open(templateRef, {
      width: '500px',
      height: '550px',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  saveUser() {
    debugger;
    this.authService.validateEmailUser(this.userFormGroup.get('email').value)
      .subscribe((result) => {
        if (result != "true") {
         // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/createUser', {
          //this.http.post<any>(this.apiUrl + '/api/userAdminService/createUser', {
            this.http.post<any>(this.apiUrl + '/api/UserService/createUser', {
            FirstName: this.userFormGroup.get('first_name').value,
            LastName: this.userFormGroup.get('last_name').value,
            Mobile: this.userFormGroup.get('mobile').value,
            Email: this.userFormGroup.get('email').value,
            Password: this.userFormGroup.get('password').value,
            Role: this.userFormGroup.get('role').value,
            LoggedInUser: this.userID
          }).subscribe(data => {
            this.rowData = data;
            this.onGridReady(this.gridOptions);
            this.matdialog.closeAll();
            Swal.fire(
              'User added successfully!',
              '',
              'success'
            );
          });
        }
        else {
          Swal.fire(
            ' Email Already Exists. Please try another!.',
            '',
            'error'
          );
        }
      });
  }

  updateUser() {
    this.authService.validateEmailUser(this.userFormGroup.get('email').value)
      .subscribe((result) => {
        if (result == "true") {
         // this.http.post<any>('https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/updateUser', {
          this.http.post<any>(this.apiUrl + '/api/userAdminService/updateUser', {
            Id: this.userFormGroup.get('Id').value,
            FirstName: this.userFormGroup.get('first_name').value,
            LastName: this.userFormGroup.get('last_name').value,
            Mobile: this.userFormGroup.get('mobile').value,
            Email: this.userFormGroup.get('email').value,
            Password: this.userFormGroup.get('password').value,
            Role: this.userFormGroup.get('role').value,
            LoggedInUser: this.userID
          }).subscribe(data => {
            this.rowData = data;
            this.onGridReady(this.gridOptions);
            this.matdialog.closeAll();
            Swal.fire(
              'User updated successfully!',
              '',
              'success'
            );
          });
        }
        else {
          Swal.fire(
            ' Email does not  Exists. Please add user.',
            '',
            'error'
          );
        }
      });
  }

  updateUserStatus(Id: any, status: boolean) {
    Swal.fire({
      title: 'Are you sure want to update the user status?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
       // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/changeuserStatus?userId=' + Id + '&status=' + status, {}).subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/userAdminService/changeuserStatus?userId=' + Id + '&status=' + status, {}).subscribe(data => {
          this.onGridReady(this.gridOptions);
          if (!Object.values(data)[0]) {
            Swal.fire(
              'Unable to deactivate User, as the user is associated with the application.',
              '',
              'error'
            );
          }
          else {
            Swal.fire(
              'User status updated successfully!.',
              '',
              'success'
            );
          }
        });
      };
    });
  }

  deleteUser(Id: any) {
    Swal.fire({
      title: 'Are you sure want to delete the user?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
       // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/deleteUser?userId=' + Id, {}).subscribe(data => {
        this.http.get<any>(this.apiUrl + '/api/userAdminService/deleteUser?userId=' + Id, {}).subscribe(data => {
          this.onGridReady(this.gridOptions);
        });
        Swal.fire(
          'User deleted successfully!.',
          '',
          'success'
        );
      };
    });
  }

  @ViewChild('Users', { static: true }) Users: TemplateRef<any>;
  edit(data: any) {
    var templateRef: TemplateRef<any>;
    templateRef = this.Users;
    this.isAction = 'Edit';
    const dialogRef = this.matdialog.open(templateRef, {
      width: '500px',
      height: '550px',
      autoFocus: false,

    });
    this.userFormGroup.setValue({
      'Id': data['Id'], 'first_name': data['FirstName'],
      'last_name': data['LastName'], 'mobile': data['Mobile'],
      'email': data['Email'], 'password': data['Password'],
      'role': data['Role']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
      else {
        this.onGridReady(this.gridOptions);
      }

    });
  }

  ngOnInit() {
    this.userFormGroup = this._formBuilder.group({
      Id: [''],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
  }
}
