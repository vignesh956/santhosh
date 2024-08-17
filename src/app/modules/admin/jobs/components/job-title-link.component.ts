import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'jbuttons',
    template: `
    
    <a routerLink="/post-job" [queryParams]="{Id: jobId}">{{jobTitle}}</a>
    
    `,
})
export class JobTitleLinkComponent implements ICellRendererAngularComp {
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