import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {FormArray, FormControl} from '@angular/forms';


@Component({
    selector: 'jbuttons',
    template: `
    <mat-icon aria-hidden="false" aria-label="Example home icon" title="Edit Question" style="cursor: pointer;font-size: 20px" (click)="editQuestion(questionId)">edit</mat-icon>
    <!-- <mat-icon aria-hidden="false" aria-label="Example home icon" title="Share Job"  style="cursor: pointer;font-size: 20px" (click)="test()">share</mat-icon> -->
    <!-- <mat-icon aria-hidden="false" aria-label="Example home icon" title="Clone Job" style="cursor: pointer;font-size: 20px" (click)="_cloneJob(jobId)">file_copy</mat-icon> -->
    <mat-icon aria-hidden="false" aria-label="Example home icon" title="Delete Question" style="cursor: pointer;font-size: 20px"  (click)="_deleteQuestion(questionId)">delete</mat-icon>
    <!-- <mat-icon aria-hidden="false" aria-label="Example home icon" title="Print Job" style="cursor: pointer;font-size: 20px" (click)="test()">print</mat-icon> -->
    
    `,
})
export class JobGridActionbuttonsComponent implements ICellRendererAngularComp {
    public params: any;
    questionId;
    jobTitle;
    componentParent: any;

    agInit(params: any): void {
        // this.params = params["value"];
        this.params = params;
        this.componentParent = this.params.context.componentParent;
        this.questionId = params["value"]["Id"];
        this.jobTitle = params["value"]["Title"];

        this.componentParent = this.params.context.componentParent;

        //this.componentParent = this.params.context.componentParent;
    }

    refresh(): boolean {
        return false;
    }

    editQuestion(id:any){
        
        this.componentParent.redirectToEditQuestion(id);
    }

    _deleteQuestion(id:any){
        
        this.componentParent.redirectToDeleteQuestion(id);
    }

    test(){
        alert("TODO action");
    }

    _cloneJob(id){
        this.componentParent.cloneJob(id);
    }
}