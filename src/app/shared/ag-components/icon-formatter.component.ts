import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AgRendererComponent } from 'ag-grid-angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-icon-formatter-cell',
  template: `
  <mat-icon  matTooltip="New Resume" width="10" height="10" >receipt</mat-icon> 
   <img *ngIf="params.Source == 'Dice'" src="../../../assets/images/avatars/dice.png" width="15" height="15" title="Dice">
   <img *ngIf="params.Source == 'Monster'" src="../../../assets/images/avatars/monster.jpg" width="15" height="15" title="Monster">
  <img *ngIf="params.Source == 'Website'" src="../../../assets/images/avatars/web.jpg" width="20" height="20" title="Website">
  <img *ngIf="params.Source == 'Google Jobs'" src="../../../assets/images/avatars/google.jpg" width="15" height="15" title="Google Jobs">
  <img *ngIf="params.Source == 'Linked In'" src="../../../assets/images/avatars/Linkedin.png" width="15" height="15" title="Linked In">
   <img *ngIf="params.Source == 'Indeed Jobs'" src="../../../assets/images/avatars/indeed.png" width="20" height="20" title="Indeed Jobs">
   <img *ngIf="params.Source == 'Referral'" src="../../../assets/images/avatars/r.jpg" width="20" height="20"  title="Referral">
   <img *ngIf="params.Source == 'Others'" src="../../../assets/images/avatars/o.jpg" width="15" height="15"  title="Others">

     <mat-icon *ngIf="params.HotList == '1'"  style="color: orange !important;" matTooltip="HostListed Candidate" >whatshot</mat-icon>

 <mat-icon *ngIf="params.HotList != '1'" aria-hidden="true" style="color: black !important;"  matTooltip="HostListed Candidate"  >whatshot</mat-icon>
 
    
  ` })

export class IconFormatterComponent  implements AgRendererComponent {
  params: any;
  router:Router;
  route: ActivatedRoute;
  agInit(params: any): void{
    //console.log("Images" + this.params.name);
    this.params = params; 
    

      this.params.Source = this.params.data.source;
      this.params.CandidateID = this.params.data.CandidateID;
      this.params.HotList = this.params.data.hotlist;
      

      //this.createHyperLink(this.params,router);
    // ../assets/images/avatars/avathar.jpg


  } 
  refresh(params: any): boolean {
    return false;
}  
//   navigateRouterLink(CandidateID){

//   }

  // createHyperLink(params, router): any {
  //   if (!params.data) { return; }
  //   const spanElement = document.createElement('span');
  //   spanElement.innerHTML = `<a href="${this.homeUrl}" > ${params.name} </a> `;
  //   //spanElement.innerHTML = `<a [routerLink]="['/editjobdescription', ${params.value},'view']" > ${params.value} </a> `;
  //   var value = params.data.CandidateID;
  //   spanElement.addEventListener('click', ($event) => {
  //     $event.preventDefault();    
  //     router.navigate(['/ManageTalent',value]);
  //   });
  //   return spanElement;
  // }

//   get homeUrl(): string {
//     return 'home';
//   }
}