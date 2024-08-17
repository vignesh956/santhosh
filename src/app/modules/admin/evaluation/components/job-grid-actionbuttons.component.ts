import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {FormArray, FormControl} from '@angular/forms';


@Component({
    selector: 'jbuttons',
    template: `
    <mat-icon aria-hidden="false" aria-label="Example home icon" title="Edit Job" style="cursor: pointer;font-size: 20px" (click)="editJob(jobId)">edit</mat-icon>
    <!-- <mat-icon aria-hidden="false" aria-label="Example home icon" title="Share Job"  style="cursor: pointer;font-size: 20px" (click)="test()">share</mat-icon> -->
    <mat-icon aria-hidden="false" aria-label="Example home icon" title="Clone Job" style="cursor: pointer;font-size: 20px" (click)="_cloneJob(jobId)">file_copy</mat-icon>
    <!-- <mat-icon aria-hidden="false" aria-label="Example home icon" title="Delete Job" style="cursor: pointer;font-size: 20px" (click)="_deleteJob(jobId)">delete</mat-icon> -->
    <!-- <mat-icon aria-hidden="false" aria-label="Example home icon" title="Print Job" style="cursor: pointer;font-size: 20px" (click)="test()">print</mat-icon> -->
    
    `,
})
export class JobGridActionbuttonsComponent implements ICellRendererAngularComp {
    public params: any;
    jobId;
    jobTitle;
    componentParent: any;

    agInit(params: any): void {
        // this.params = params["value"];
        this.params = params;
        this.componentParent = this.params.context.componentParent;
        this.jobId = params["value"]["Id"];
        this.jobTitle = params["value"]["Title"];

        this.componentParent = this.params.context.componentParent;

        //this.componentParent = this.params.context.componentParent;
    }

    refresh(): boolean {
        return false;
    }

    editJob(id){
        this.componentParent.redirectToEditJob(id);
    }

    _deleteJob(id){
        this.componentParent.deleteJob(id);
    }

    test(){
        alert("TODO action");
    }

    _cloneJob(id){
        this.componentParent.cloneJob(id);
    }
}