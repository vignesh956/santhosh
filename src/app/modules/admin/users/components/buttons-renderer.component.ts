// import { Component } from '@angular/core';

// import { ICellRendererAngularComp } from 'ag-grid-angular';

// @Component({
//     selector: 'jbuttons',
//     template: `
    
//     <mat-icon aria-hidden="false" aria-label="Example home icon" style="font-size: 20px" (click)="test()">edit</mat-icon>
//     <mat-icon aria-hidden="false" aria-label="Example home icon" style="font-size: 20px" (click)="test()">share</mat-icon>
//     <mat-icon aria-hidden="false" aria-label="Example home icon" style="font-size: 20px" (click)="test()">file_copy</mat-icon>
//     <mat-icon aria-hidden="false" aria-label="Example home icon" style="font-size: 20px" (click)="test()">delete</mat-icon>
//     <mat-icon aria-hidden="false" aria-label="Example home icon" style="font-size: 20px" (click)="test()">print</mat-icon>
    
//     `,
// })
// export class ButtonsRendererComponent implements ICellRendererAngularComp {
//     public params: any;
//     jobId;
//     jobTitle;

//     agInit(params: any): void {
//         this.params = params["value"];
//         this.jobId = params["value"]["Id"];
//         this.jobTitle = params["value"]["Title"];
//     }

//     refresh(): boolean {
//         return false;
//     }

//     test(){
//         alert("TODO action");
//     }
// }
import { Component, TemplateRef } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {FormArray, FormControl} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RepositoryConstant } from 'app/modules/constants/Repository.constant'; 

@Component({
    selector: 'fabuttons',
    template: `
    <mat-icon aria-hidden="false" aria-label="Example home icon" title="Edit {{params['value']['curTab']}}" style="cursor: pointer;font-size: 20px" (click)="editUser()">edit</mat-icon>
    <mat-icon *ngIf="params['value']['Status'] == true" title="Deactivate User" aria-hidden="false" aria-label="Example home icon" style="cursor: pointer;font-size: 20px" (click)="deactivateUser()">lock_open</mat-icon>
    <mat-icon *ngIf="params['value']['Status'] == false" title="Activate User" aria-hidden="false" aria-label="Example home icon" style="cursor: pointer;font-size: 20px" (click)="activateUser()">lock</mat-icon>
    <mat-icon *ngIf="params['value']['Assigned'] == false" title="Delete User" aria-hidden="false" aria-label="Example home icon" style="cursor: pointer;font-size: 20px" (click)="deleteUser()">delete</mat-icon>
    <mat-icon aria-hidden="false" aria-label="Example home icon" style="font-size: 20px" (click)="test()">share</mat-icon>
    <mat-icon aria-hidden="false" aria-label="Example home icon" style="font-size: 20px" (click)="test()">print</mat-icon>
    <mat-icon aria-hidden="false" aria-label="Example home icon" style="font-size: 20px" (click)="test()">file_copy</mat-icon>
    `,
})
export class ButtonsRendererComponent implements ICellRendererAngularComp {
    public apiUrl:string=RepositoryConstant.apiUrl;
    public params: any;
    Id;
    FirstName;
    LastName;
    Mobile;
    Email;
    Password;
    Role;
    Status;
    componentParent: any;
    constructor(
        private http: HttpClient) {
        }
    agInit(params: any): void {
        console.log(params["value"]["Status"]);
        // this.params = params["value"];
        this.params = params;
        this.componentParent = this.params.context.componentParent;
        this.Id = params["value"]["Id"];
        this.FirstName = params["value"]["FirstName"];
        this.LastName = params["value"]["LastName"];
        this.Mobile = params["value"]["Mobile"];
        this.Email = params["value"]["Email"];
        this.Password = params["value"]["Password"];
        this.Role = params["value"]["Role"];
        this.Status = params["value"]["Status"];
        this.componentParent = this.params.context.componentParent;
    }

    refresh(): boolean {
        return false;
    }
    editUser()
    {
       // this.http.get<any>('https://hiringmanagerwebapi.azurewebsites.net/api/userAdminService/getUserDetailById?userId=' + this.params["value"]['Id'], {
        this.http.get<any>(this.apiUrl + '/api/userAdminService/getUserDetailById?userId=' + this.params["value"]['Id'], {
    }).subscribe(data => {
        this.componentParent.edit(data)
    });
    }
    deactivateUser()
    {
        this.componentParent.updateUserStatus(this.params["value"]["Id"], false);
    }
    activateUser()
    {
        this.componentParent.updateUserStatus(this.params["value"]["Id"], true);
    }
    deleteUser()
    {
        this.componentParent.deleteUser(this.params["value"]["Id"]);
    }
    test(){
                alert("TODO action");
            }
}