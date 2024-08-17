import { Injectable } from '@angular/core';
import { RepositoryConstant } from "../../constants/Repository.constant";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {

  public apiUrl:string=RepositoryConstant.apiUrl;
  constructor(private httpClient:HttpClient) {

  }


  GetdefaultQuestionnaireList():Observable<any>{
    return this.httpClient.get(this.apiUrl + '/api/jobService/GetQuestionnaireInfo', {
       
    }).pipe(
        map(res =>res),
        );
  }
   

  GetCheckedQuestionnaireList(jobid:any):Observable<any>{
    return this.httpClient.get(this.apiUrl + '/api/jobService/GetCheckedQuestionnaireList?JobId='+ jobid).pipe(
        map(res =>res),
        );
  }

  GetQuestionbyId(id:any):Observable<any>{
    return this.httpClient.get(this.apiUrl + '/api/jobService/GetQuestionnaireinfobyid?Id='+ id).pipe(
        map(res =>res),
        );
  }

  QuestionnaireOperations(payLoad:any):Observable<any>{
   // debugger;
    return this.httpClient.post(this.apiUrl + '/api/jobService/DMLQuestionnaire', {
          Id: payLoad.Id,
          QuestionnaireType :payLoad.QuestionnaireType,
          Skill :payLoad.Skill,
          Level :payLoad.Level,
          Time :payLoad.Time,
          QuestionStatus :payLoad.QuestionStatus,
          Question : payLoad.Question,
          GeneralExpectedAnswer : payLoad.GeneralExpectedAnswer,
          GeneralRating : payLoad.GeneralRating,
          AnswerWithErrorAssessment : payLoad.AnswerWithErrorAssessment,
          AssessmentExpectedAnswer : payLoad.AssessmentExpectedAnswer,
          OptionA : payLoad.OptionA,
          OptionB : payLoad.OptionB,
          OptionC: payLoad.OptionC,
          OptionD: payLoad.OptionD,
          AssignmentExpectedAnswer : payLoad.AssignmentExpectedAnswer,
          JobId : payLoad.JobId,
          CandidateId :payLoad.CandidateId,
          DMLType : payLoad.DMLType
  }).pipe(
      map(res =>res),
      );
  }

  QuestionnaireFilter(Status:any,Filtertype:any):Observable<any>{
    return this.httpClient.get( this.apiUrl + '/api/jobService/GetQuestionnaireFilter?Status='+ Status +'&Filtertype=' +Filtertype ).pipe(
        map(res =>res),
        );
  }

}
