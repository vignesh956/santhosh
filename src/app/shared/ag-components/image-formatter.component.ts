import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AgRendererComponent } from 'ag-grid-angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-image-formatter-cell',
  template: `
  <img border="0" width="30" height="30" style="padding-right:4px;" src=\"{{ params.profileimage }}\"> 
     <a  routerLink="/ManageTalent/{{params.CandidateID}}"  style="cursor:pointer;" title="View Candidate Details" 
     >{{ params.value}}
    </a>

  ` })
  // <span>{{params.name}}</span> (click)="navigateRouterLink(params.CandidateID)"
  // <a  [routerLink]="['/ManageTalent', params.CandidateID]" style="cursor:pointer;" title="View Candidate Details" 
  //                   >{{params.name}}
  //                   </a>
//   <a  routerLink="/ManageTalent/{{params.CandidateID}}"  style="cursor:pointer;" title="View Candidate Details" 
//   >{{params.name}}
//  </a>

export class ImageFormatterComponent implements AgRendererComponent{
  params: any;
  router:Router;
   route: ActivatedRoute;
  agInit(params: any){
    //console.log("Images" + this.params.name);
    this.params = params; 
      if(this.params.data.profileimage != '')
      this.params.profileimage = this.params.data.profileimage;
      if(this.params.data.profileimage == '')
      this.params.profileimage = '../assets/images/avatars/avathar.jpg';

      //this.params.name = this.params.data.CandidateFullName;
      this.params.CandidateID = this.params.data.CandidateID;

      //this.createHyperLink(this.params,router);
    // ../assets/images/avatars/avathar.jpg

  } 


  refresh(params: any): boolean {
    return false;
}   

  
}