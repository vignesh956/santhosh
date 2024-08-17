import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
@Component({
    selector: 'jbuttons',
    template: ` <mat-icon aria-hidden="false" aria-label="Example home icon" style="font-size: 20px" (click)="test()">delete</mat-icon> `,

})
export class NewCandidateButtonsRendererComponent implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }

    test(){
        alert("TODO action");
    }
}
