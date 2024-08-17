import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'jbuttons',
    template: `
    
    <mat-icon aria-hidden="false" aria-label="Example home icon" style="font-size: 20px" (click)="test()">edit</mat-icon>
    <mat-icon aria-hidden="false" aria-label="Example home icon" style="font-size: 20px" (click)="test()">share</mat-icon>
    <mat-icon aria-hidden="false" aria-label="Example home icon" style="font-size: 20px" (click)="test()">file_copy</mat-icon>
    <mat-icon aria-hidden="false" aria-label="Example home icon" style="font-size: 20px" (click)="test()">delete</mat-icon>
    <mat-icon aria-hidden="false" aria-label="Example home icon" style="font-size: 20px" (click)="test()">print</mat-icon>
    
    `,
})
export class ButtonsRendererComponent implements ICellRendererAngularComp {
    public params: any;
    jobId;
    jobTitle;

    agInit(params: any): void {
        this.params = params["value"];
        this.jobId = params["value"]["Id"];
        this.jobTitle = params["value"]["Title"];
    }

    refresh(): boolean {
        return false;
    }

    test(){
        alert("TODO action");
    }
}