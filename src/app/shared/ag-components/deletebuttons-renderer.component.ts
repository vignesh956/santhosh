import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'jbuttons',
    template: `<mat-icon aria-hidden="false" aria-label="Example home icon" style="font-size: 20px;cursor:pointer;" (click)="btnClickedHandler()">delete</mat-icon>`,
})
export class DeleteButtonsRendererComponent implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }

    btnClickedHandler() {
        this.params.clicked(this.params.value);
      }
    
}
