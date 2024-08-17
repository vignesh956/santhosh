import { Component, TemplateRef } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {FormArray, FormControl} from '@angular/forms';


@Component({
    selector: 'fabuttons',
    template: `
    <mat-icon aria-hidden="false" aria-label="Example home icon" title="Edit {{params['value']['curTab']}}" style="cursor: pointer;font-size: 20px" (click)="editFunctionalArea()">edit</mat-icon>
    <mat-icon title="Delete {{params['value']['curTab']}}" aria-hidden="false" aria-label="Example home icon" style="cursor: pointer;font-size: 20px" (click)="delete()">delete</mat-icon>
    `,
})
export class JobsGridActionbuttonsComponent implements ICellRendererAngularComp {
    public params: any;
    Id;
    Name;
    componentParent: any;
    agInit(params: any): void {
        // this.params = params["value"];
        this.params = params;
        this.componentParent = this.params.context.componentParent;
        this.Id = params["value"]["Id"];
        this.Name = params["value"]["Name"];
        this.componentParent = this.params.context.componentParent;
    }

    refresh(): boolean {
        return false;
    }
    editFunctionalArea()
    {
        this.componentParent.edit(this.params)
    }
    delete()
    {
        this.componentParent.delete(this.params)
    }
}