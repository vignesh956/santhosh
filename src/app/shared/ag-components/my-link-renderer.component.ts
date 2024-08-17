
import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
// template: `<a [routerLink]="[params.inRouterLink,params.value]">{{params.value}}</a>`
// template: `<b>hi</b>`
@Component({
    template: `<b>hi</b>`
    
})
export class MyLinkRendererComponent implements AgRendererComponent {    
     params: any;    

    agInit(params: any): void {
        this.params = params;
    }

    refresh(params: any): boolean {
        return false;
    }    
}