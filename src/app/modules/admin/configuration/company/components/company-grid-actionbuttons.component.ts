import { Component, TemplateRef } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {FormArray, FormControl} from '@angular/forms';


@Component({
    selector: 'fabuttons',
    template: `
    <mat-icon aria-hidden="false" aria-label="Example home icon" title="Edit {{params['value']['curTab']}}" style="cursor: pointer;font-size: 20px" (click)="editCompany()">edit</mat-icon>
    <mat-icon *ngIf="params['value']['Active'] == true" title="Deactivate Company" aria-hidden="false" aria-label="Example home icon" style="cursor: pointer;font-size: 20px" (click)="deactivateCompany()">lock_open</mat-icon>
    <mat-icon *ngIf="params['value']['Active'] == false" title="Activate Company" aria-hidden="false" aria-label="Example home icon" style="cursor: pointer;font-size: 20px" (click)="activateCompany()">lock</mat-icon>
    <mat-icon *ngIf="params['value']['Assigned'] == false" title="Delete Company" aria-hidden="false" aria-label="Example home icon" style="cursor: pointer;font-size: 20px" (click)="deleteCompany()">delete</mat-icon>
    `,
})
export class CompanyGridActionbuttonsComponent implements ICellRendererAngularComp {
    public params: any;
    Id;
    Name;
    Overview;
    Active;
    Assigned;
    componentParent: any;
    agInit(params: any): void {
        // this.params = params["value"];
        this.params = params;
        this.componentParent = this.params.context.componentParent;
        this.Id = params["value"]["Id"];
        this.Name = params["value"]["Name"];
        this.Overview = params["value"]["Overview"];
        this.Active = params["value"]["Active"];
        this.Assigned = params["value"]["Assigned"];
        this.componentParent = this.params.context.componentParent;
    }

    refresh(): boolean {
        return false;
    }
    editCompany()
    {
        this.componentParent.edit(this.params)
    }
    deactivateCompany()
    {
        this.componentParent.deactivateCompany(this.params["value"]["Id"]);
    }
    activateCompany()
    {
        this.componentParent.activateCompany(this.params["value"]["Id"]);
    }
    deleteCompany()
    {
        this.componentParent.deleteCompany(this.params["value"]["Id"]);
    }
}