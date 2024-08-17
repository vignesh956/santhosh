import { Injectable } from "@angular/core";
import { RepositoryConstant } from "app/modules/constants/Repository.constant";

import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable, Subject } from "rxjs";
//import { url } from "inspector";

@Injectable()
export class CandidateService{
    private subject = new Subject<string>();

    public apiUrl:string=RepositoryConstant.apiUrl;
    constructor(private httpClient:HttpClient,

        ){

    }

     

      getMessage(CandidateId:any, UserId:any, JobId:any):Observable<any>{
        // debugger;
        if (localStorage.getItem("token") != null) {
        return this.httpClient.get(this.apiUrl+'/api/candidateService/GetCandidateMessages?CandidateId=' + CandidateId+'&UserId='+UserId+'&JobId='+JobId)
        .pipe(
            map(res=>res),
        );
        }
    }

 
    updateMessage(CandidateId:any, UserId:any):Observable<any>{
        return this.httpClient.post(this.apiUrl+'/api/candidateService/UpdateMessage?CandidateId=' + CandidateId+'&UserId='+UserId,{})
        .pipe(
            map(res=>res),
        );
    }
    
      //publish value to all the subscribers
      nextMessage(payLoad:any){
        return this.httpClient.post(this.apiUrl+'/api/candidateService/CreateMessage',
         payLoad,{
             
         })
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }

    saveCandidate(payLoad:any){
        return this.httpClient.post(this.apiUrl+'/api/candidate/save',payLoad,{})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
    updateCandidate(payLoad:any){
        return this.httpClient.post(this.apiUrl+'/api/candidate/update',payLoad,{})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
    getByCandidateId(payLoad:any){

        return this.httpClient.get(this.apiUrl+'/api/candidate/getBycandidateId',{params: payLoad})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }

    getCandidatebyEmailId(payLoad:any){
        return this.httpClient.get(this.apiUrl+'/api/candidate/getCandidatebyEmail',{params: payLoad})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }

    getAllCandidates():Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/candidate/getallcandidates')
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }

    

    deleteCandidate(payLoad:any):Observable<any>{
        return this.httpClient.get(this.apiUrl +'/api/candidate/deletecandidate?id=' + payLoad.id)
        .pipe(
            map(res=>res),
        );
    }

    saveCandidateActivity(payLoad:any){     
        //return this.httpClient.post(this.apiUrl+'/api/candidateActivity/saverange',payLoad)
       return this.httpClient.post(this.apiUrl+'/api/candidateActivity/save',payLoad,{})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
    updateCandidateActivity(payLoad:any){
        return this.httpClient.post(this.apiUrl+'/api/candidateActivity/update',payLoad,{})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
     updateCandidateActivityInterviewDate(payLoad:any){
        return this.httpClient.post(this.apiUrl+'/api/candidateActivity/updateInterviewDate',payLoad,{})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
    updateCandidateActivityEvaluationThumbStatus(payLoad:any){
        return this.httpClient.post(this.apiUrl+'/api/candidateActivity/updateEvaluationThumbStatus',payLoad,{})
        //return this.httpClient.post(this.apiUrl+'/api/candidateActivity/updateEvaluationThumbStatus',{params: payLoad})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
    updateCandidateActivityEvaluationPhoneThumbStatus(payLoad:any){
        return this.httpClient.post(this.apiUrl+'/api/candidateActivity/updateEvaluationphoneThumbStatus',payLoad,{})
        //return this.httpClient.post(this.apiUrl+'/api/candidateActivity/updateEvaluationThumbStatus',{params: payLoad})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
    getAllEvaluationThumbupCount():Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/candidateActivity/getEvaluationThumbupStatusCount')
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
     getAllEvaluationThumbdownCount():Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/candidateActivity/getEvaluationThumbdownStatusCount')
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }

     getAllEvaluationPhoneThumbupCount():Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/candidateActivity/getPhoneScreenThumbupStatusCount')
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
     getAllEvaluationPhoneThumbdownCount():Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/candidateActivity/getPhoneScreenThumbdownStatusCount')
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
     getActivityByCandidateId1():Observable<any>{       
        return this.httpClient.get(this.apiUrl+'/api/candidateActivity/getAllCandidateActivityHistory')
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
    getActivityByCandidateId(payLoad:any){

        return this.httpClient.get(this.apiUrl+'/api/candidateActivity/getactivitybycandidateid',{params: payLoad})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }

    getCandidateActivitiesById(payLoad:any){
       // debugger;
        return this.httpClient.get(this.apiUrl+'/api/candidateActivity/getCandidateActivitiesById?id=' +payLoad)
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
        }
     getLatestActivityByCandidateId(payLoadByCandidateId:any){

        return this.httpClient.get(this.apiUrl+'/api/candidateActivity/getLatestActivityByCandidateId',{params: payLoadByCandidateId})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
      getActivityByUniqueCandidateId(payLoad:any){

        return this.httpClient.get(this.apiUrl+'/api/candidateActivity/getactivitybyUniquecandidateid',{params: payLoad})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
    getShareReviewers(payLoad:any){

        return this.httpClient.get(this.apiUrl+'/api/candidateActivity/getsharereviewers',{params: payLoad})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }

      saveCandidateFeedback(payLoad:any){     
        //return this.httpClient.post(this.apiUrl+'/api/candidateActivity/saverange',payLoad)
       return this.httpClient.post(this.apiUrl+'/api/candidateActivity/saveCandidateFeedback',payLoad,{})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }

    sendRejectNotificationToCandidate(payLoad:any){        
       //return this.httpClient.post(this.apiUrl+'/api/candidateActivity/send_fwd_EmailToCandidate',{params: payLoad})
       return this.httpClient.get(this.apiUrl+'/api/candidateActivity/sendRejectNotification',{params: payLoad})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }

     sendEmailToInterviewCandidate(payLoad:any){ 
        return this.httpClient.post(this.apiUrl+'/api/candidateActivity/send_EmailTo_Candidate',payLoad,{})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
      }
      sendEmailToSingleCandidate(payLoad:any){ 
         return this.httpClient.post(this.apiUrl+'/api/candidateActivity/send_EmailTo_SingleCandidate',payLoad,{})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
      }

      assignCandidateToRecuiters(payLoad:any){ 
        return this.httpClient.post(this.apiUrl+'/api/candidateActivity/assigncandidatetorecuiters',payLoad,{})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
      }

        // New api's implementing start on 22nd Oct 2020 by vijay sri ram

        

        WipsendEmailToSingleCandidate(payLoad:any){ 
            return this.httpClient.post(this.apiUrl+'/api/candidateActivity/wip_send_EmailTo_SingleCandidate',payLoad,{})
           .pipe(
               map(res =>res),
               //catchError(this.errorHandler)
               );
         }
    
          // New api's implementing end on 22nd Oct 2020 by vijay sri ram


          // New api's implementing start on 27th Oct 2020 by vijay sri ram
          wip_sendRejectNotificationToCandidate(payLoad:any){        
            //return this.httpClient.post(this.apiUrl+'/api/candidateActivity/send_fwd_EmailToCandidate',{params: payLoad})
            return this.httpClient.get(this.apiUrl+'/api/candidateActivity/wip_sendRejectNotification',{params: payLoad})
             .pipe(
                 map(res =>res),
                 //catchError(this.errorHandler)
                 );
                 
         }

         wip_sendEmailToInterviewCandidate(payLoad:any){ 
            return this.httpClient.post(this.apiUrl+'/api/candidateActivity/wip_send_EmailTo_Candidate',payLoad,{})
            .pipe(
                map(res =>res),
                //catchError(this.errorHandler)
                );
          }

          wip_saveCandidateActivity(payLoad:any){     
            //return this.httpClient.post(this.apiUrl+'/api/candidateActivity/saverange',payLoad)
           return this.httpClient.post(this.apiUrl+'/api/candidateActivity/wip_save',payLoad,{})
            .pipe(
                map(res =>res),
                //catchError(this.errorHandler)
                );
        }

        wip_saveCandidateActivityList(payLoad:any){     
            //return this.httpClient.post(this.apiUrl+'/api/candidateActivity/saverange',payLoad)
           return this.httpClient.post(this.apiUrl+'/api/candidateActivity/wip_list_save',payLoad,{})
            .pipe(
                map(res =>res),
                //catchError(this.errorHandler)
                );
        }


        wip_updateCandidateList(payLoad:any){
            return this.httpClient.post(this.apiUrl+'/api/candidate/wip_updatelist',payLoad,{})
            .pipe(
                map(res =>res),
                //catchError(this.errorHandler)
                );
        }

        wip_sendEmailToInterviewCandidateList(payLoad:any){ 
            return this.httpClient.post(this.apiUrl+'/api/candidateActivity/wip_send_EmailTo_Candidate_List',payLoad,{})
            .pipe(
                map(res =>res),
                //catchError(this.errorHandler)
                );
          }


          wip_sendToReviewCandidateList(payLoad:any){
            return this.httpClient.post(this.apiUrl+'/api/candidateActivity/wip_sendToReviewCandidateList',payLoad,{})
            .pipe(
                map(res =>res),
                //catchError(this.errorHandler)
                );
          }

          wip_sendToSubmitCandidateList(payLoad:any){
            return this.httpClient.post(this.apiUrl+'/api/candidateActivity/wip_sendToSubmitCandidateList',payLoad,{})
            .pipe(
                map(res =>res),
                //catchError(this.errorHandler)
                );
          }

         
          WipsendEmailToCandidateList(payLoad:any){ 
            return this.httpClient.post(this.apiUrl+'/api/candidateActivity/Wip_sendEmailToCandidateList',payLoad,{})
           .pipe(
               map(res =>res),
               //catchError(this.errorHandler)
               );
         }
          

         CreateCandidateActivity(CandidateId:any,ActivityType:any,ActivityDescription:any,CreatedBy:any):Observable<any>{
            return this.httpClient.post(this.apiUrl + '/api/candidateService/CreateCandidateActivity?CandidateId='
            +CandidateId +'&ActivityType= ' +ActivityType+'&ActivityDescription=' 
            + ActivityDescription+'&CreatedBy=' +CreatedBy , {
            }).pipe(
                map(res =>res),
                );
        }
        CreateCandidateActivitybyjobid(CandidateId:any,jobid:any, ActivityType:any,ActivityDescription:any,CreatedBy:any):Observable<any>{
            //return this.httpClient.post('http://localhost:50274/api/candidateService/CreateCandidateActivitybyjobid?CandidateId='
           return this.httpClient.post(this.apiUrl + '/api/candidateService/CreateCandidateActivitybyjobid?CandidateId='
            +CandidateId+'&jobid='+jobid +'&ActivityType= ' +ActivityType+'&ActivityDescription=' 
            + ActivityDescription+'&CreatedBy=' +CreatedBy , {
            }).pipe(
                map(res =>res),
                );
        }
}