
import { Component, OnDestroy } from "@angular/core";

//import { ICellRendererAngularComp } from "@ag-grid-community/angular";

@Component({
  selector: "checkbox-renderer",
  template: `
    <input
      type="checkbox"
      (click)="checkedHandler($event)"
      
    />
  `
})
export class CheckboxRendererComponent {
  private params: any;

  agInit(params: any): void {
    this.params = params;
  }

  checkedHandler(event) {
    this.params.CandidateID = this.params.data.CandidateID;
  }
}
