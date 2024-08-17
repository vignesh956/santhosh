import { Component } from '@angular/core';

@Component({
  selector: 'image-renderer-cell',
  template: `
    <div class="logo-container">
      <img border="0" *ngIf="params.data.CompanyImage != null" width="80" height="50"
       [src]="params.data.CompanyImage">
      <div *ngIf="params.data.CompanyImage == '' " class="circle">
      {{params.data.Name.charAt(0)}}</div>
    </div>
  `,
  styles: [
    `
      .logo-container {
        display: flex;
        align-items: center;
      }

      .circle {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 150px;
        height: 40px;
        border-radius: 50%;
        font-size: 24px;
        font-weight: bold;
        background-color: #4285f4;
      }
    `,
  ],
})
export class ImageRendererComponent {
  params: any;

  agInit(params: any) {
    //debugger;
    this.params = params;
  }
}
