import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'currency-cell',
    //template: `{{ params.value | date:'MM/dd/yyyy'}}`,
    template: `{{ params.value}}`,
    providers: [DatePipe]

})
export class DateRendererComponent implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }
}
