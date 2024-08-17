import { Injectable } from "@angular/core";
import { RepositoryConstant } from "app/modules/constants/Repository.constant";

import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EvaluationserviceService {
 public apiUrl:string=RepositoryConstant.apiUrl;
  constructor(private httpClient:HttpClient) { }

  
   getassignmentquestions():Observable<any>{
      return this.httpClient.get(this.apiUrl+'/api/candidateService/GetListOfManageCandiateAssignments')
      .pipe(
          map(res =>res),
          );
      }

      getactivejobslist():Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/jobService/GetListOfActiveJobs')
        .pipe(
            map(res =>res),
            );  
      }

      getassessmentassignedquestionby(jobid:any, cid:any, status:any):Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/jobService/GetCandidateTestQuestions?JobId=' +jobid +'&CandidateId=' + cid + '&TestStatus=' +status + '&Level=' + '')
        .pipe(
            map(res =>res),
            );
      }

      getAssignmentassignedquestionby(jobid:any, cid:any, status:any):Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/jobService/GetAssignmentCandidateTestQuestions?JobId=' +jobid +'&CandidateId=' + cid + '&TestStatus=' +status + '&Level=' + '')
        .pipe(
            map(res =>res),
            );
      }

      // getappliedcandidatesbyjobid(id:any):Observable<any>{
      //   return this.httpClient.get(this.apiUrl+ '/api/candidateService/GetCandidateInfoByJobId?JobId='+ id)
      //   .pipe(
      //       map(res=>res),
      //   );
      // }

      getappliedcandidatesbyjobid(id:any):Observable<any>{
        return this.httpClient.get(this.apiUrl+ '/api/candidateService/GetJobSummaryInfo?JobId='+ id)
        .pipe(
            map(res=>res),
        );
      }



      GetCandidateInfoByJobIdWithInterviewInfo(Jobid:any,CandidateId:any,userID:any):Observable<any>{
        return this.httpClient.get(this.apiUrl+ '/api/candidateService/GetCandidateInfoByJobIdWithInterviewInfo?JobId='+ Jobid + '&CandidateId='+ CandidateId + '&InterviewerId=' + userID)
      // return this.httpClient.get('http://localhost:50274/api/candidateService/GetCandidateInfoByJobIdWithInterviewInfo?JobId='+ Jobid + '&CandidateId='+ CandidateId + '&InterviewerId=' + userID)
        .pipe(
            map(res=>res),
        );
      }

      
      GetJobSummaryInfo(Jobid:any):Observable<any>{
        return this.httpClient.get(this.apiUrl+ '/api/candidateService/GetJobSummaryInfo?JobId='+ Jobid)
        .pipe(
            map(res=>res),
        );
      }

      getappliedcandidatesbyjobidSortBy(id:any,SortBy:any):Observable<any>{
        return this.httpClient.get(this.apiUrl+ '/api/candidateService/GetCandidateInfoByJobIdSortBy?JobId='+ id   +'&SortBy='+ SortBy
        )
        .pipe(
            map(res=>res),
        );
      }
      
   getassessmentquestions():Observable<any>{
      return this.httpClient.get(this.apiUrl+'/api/candidateService/GetListOfManageCandiateAssessments')
      .pipe(
          map(res =>res),
          );
      } 

      getappliedjoblist(cid:any):Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/candidateService/GetJobDetailsbyCandidateId?CandidateId='+cid)
          .pipe(
              map(res =>res),
            );
      }

      saveassignmentpaper(payLoad:any):Observable<any>{
        return this.httpClient.post(this.apiUrl+'/api/candidateService/CreateCandidateToAssignment',{params: payLoad})
      .pipe(
          map(res =>res),
          );
      }

      getassignmentresultlist(id:any, jobid:any):Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/candidateService/GetCandidateAssignmentToQuestionnaireByCandidateId?CandidateId='+id+'&JobId=' + jobid)
        .pipe(
          map(res =>res),
          );
      }

      getassessmentquestionsbylvlandskill(payLoad:any):Observable<any>{
        return this.httpClient.post(this.apiUrl+'/api/jobService/GetQuestionnaireBySkillsAndLevel',{
        Level:payLoad.Level,
        Skills:payLoad.Skills,
        CandidateId : payLoad.CandidateId,
        JobId : payLoad.JobId
       })
        .pipe(
          map(res =>res),
          );
      }

      
      getAssignmentquestionsbylvlandskill(payLoad:any):Observable<any>{
        return this.httpClient.post(this.apiUrl+'/api/jobService/GetAssignmentQuestionnaireBySkillsAndLevel',{
        Level:payLoad.Level,
        Skills:payLoad.Skills,
        CandidateId : payLoad.CandidateId,
        JobId : payLoad.JobId
       })
        .pipe(
          map(res =>res),
          );
      }

      getassessmentquestionsbyLevel(payLoad:any):Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/jobService/GetQuestionnaireByLevel?Level='+payLoad,{
          })
        .pipe(
          map(res =>res),
          );
      }

      getAssignmentquestionsbyLevel(payLoad:any):Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/jobService/GetAssignmentQuestionnaireByLevel?Level='+payLoad,{
          })
        .pipe(
          map(res =>res),
          );
      }

      assignassessmenttocandidate(payLoad:any):Observable<any>{
        return this.httpClient.post(this.apiUrl+'/api/jobService/InterviewQuestionAnswersByCandidate',{
          //CandidateId : payLoad.CandidateId,
          //JobId : payLoad.JobId,
          
          QuestionnaireType :payLoad.QuestionnaireType,
          QuestionStatus :payLoad[0].QuestionStatus

         })
        .pipe(
          map(res =>res),
          );
      }

      getassessmentresultlist(cid:any,jobid:any):Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/candidateService/GetCandidateAssessmentToQuestionnaireByCandidateId?CandidateId='+ cid+'&JobId=' + jobid)
        .pipe(
          map(res =>res),
          );
      }

      getgeneraltestresultby(cid:any, jobid:any,UserId:any):Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/candidateService/GetCandidateGeneralTestResult?CandidateId=' + cid +'&JobId=' + jobid + '&InterviewerId='+ UserId)
       // return this.httpClient.get('http://localhost:50274/api/candidateService/GetCandidateGeneralTestResult?CandidateId=' + cid +'&JobId=' + jobid + '&InterviewerId='+ UserId)
        .pipe(
          map(res =>res),
          );
      }

      rejectinterviewcandidate(jobid:any, cid:any, interviewtype:any, status:any):Observable<any>{
        const httpparams = new HttpParams({
           fromObject: {jobid:jobid,
            candidateid:cid,
            InterviewType:interviewtype,
            status:status
           }
        });
        
        return this.httpClient.get(this.apiUrl+'/api/interviewService/RejectInterview',{params:httpparams})
        .pipe(
          map(res =>res),
          );
      }

      UpdateCandidateRejectReasion(jobid:any, cid:any, RejectionReason:any, status:any,UserId):Observable<any>{
                
       // return this.httpClient.post(this.apiUrl+'/api/candidateService/UpdateCandidateRejectReasion',{params:httpparams})
       return this.httpClient.get(this.apiUrl+'/api/candidateService/UpdateCandidateRejectReasion?candidateid='+ cid+'&jobid=' + jobid + '&status='+ status + '&RejectionReason='+ RejectionReason + '&UserId='+ UserId) 
       .pipe(
          map(res =>res),
          );
      }

}
