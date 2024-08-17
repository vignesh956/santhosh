import { Injectable } from "@angular/core";
import { RepositoryConstant } from "app/modules/constants/Repository.constant";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CandidateserviceService {
  public apiUrl:string=RepositoryConstant.apiUrl;
  constructor(private httpClient:HttpClient) {

   }
   getCandidatelist():Observable<any>{
    return this.httpClient.get(this.apiUrl+'/api/candidateService/getCandidatelist')
    .pipe(
        map(res =>res),
        );
    }
    getResumeParsedatelist(resumeselectedFiles: any):Observable<any>{
    //getResumeParsedatelist(data: FormData){
      // return this.httpClient.get('http://localhost:50274/api/resumes/GetResumeParseDetails?uploadfiles='+ resumeselectedFiles)
       return this.httpClient.get(this.apiUrl+'/api/resumes/GetResumeParseDetails?uploadfiles='+ resumeselectedFiles) 
      
       .pipe(
            map(res =>res),
            );
        }

        UploadMultipleResumes(data: FormData){
          // return this.httpClient.post('http://localhost:50274/api/resumes/UploadMultipleResumes', data)
           return this.httpClient.post(this.apiUrl+'/api/resumes/UploadMultipleResumes', data) 
           .pipe(
                map(res =>res),
                );
            }
    

    getCandidateListbyFilter(payLoad:any): Observable<any>{
        return this.httpClient.post<any>(this.apiUrl + '/api/candidateService/getCandidateListByPagination',{
      //  return this.httpClient.post<any>('http://localhost:50274/api/candidateService/getCandidateListByPagination',{
            Locations: payLoad.Locations,
            Skills:payLoad.Skills,
            start: payLoad.start,
            length: payLoad.length,
            SearchKeyword: payLoad.SearchKeyword,
            Status: payLoad.Status,
            Designations:payLoad.Designation,
            Folders:payLoad.Folders,
            SortBy: payLoad.SortBy
        })
        .pipe(
            map(res => res),
        );
    }

    getAllLocationslist():Observable<any>{
      return this.httpClient.get(this.apiUrl+'/api/candidateService/getCandidatelocations')
      .pipe(
          map(res =>res),
          );
      }

      getAllDesignationslist():Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/candidateService/getCandidateDesignation')
        .pipe(
            map(res =>res),
            );
        }

        getAllUsers():Observable<any>{
            return this.httpClient.get(this.apiUrl+'/api/userAdminService/getuserlist')
            .pipe(
                map(res =>res),
                );
        }
      getAllSkillslist():Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/candidateService/getCandidateskills')
        .pipe(
            map(res =>res),
            );
        }

        saveResumeScore(payLoad:any)
        {
            return this.httpClient.get(this.apiUrl+'/api/candidateService/UpdateCandidateResumeScore?candidateId='
            +payLoad.candidateId +'&Score=' +payLoad.Score) 
            .pipe(
                map(res =>res),
                );
        }

        getSearchFills(){
          return{
              "relocateState":[
                  {
                      name:"Yes",value:"true"
                  },
                  {
                      name:"No",value:"false"
                  }
              ],
              "Experience":[
                  { name:"1",value:"1" },
                  { name:"2",value:"2" },
                  { name:"3",value:"3" },
                  { name:"4",value:"4" },
                  { name:"5",value:"5" },
                  { name:"6",value:"6" },
                  { name:"7",value:"7" }, 
                  {name:"8",value:"8"  }, 
                  {name:"9",value:"9"  }, 
                  {name:"10",value:"10"  }, 
                  { name:"11",value:"11" }, 
                  {name:"12",value:"12"  }, 
                  {name:"13",value:"13"  },
                  {name:"14",value:"14"  }, 
                  {name:"15",value:"15"  }
              ],
              "SortBy":[
                {name:"Name", value:"Name"},
                {name:"Newest to Oldest", value:"NewesttoOldest"},
                {name:"Oldest to Newest", value:"OldesttoNewest"},
              ],
          }
      }

      getsampleassignmentinterviewer()
      {
          return{
           "assignmentinterviewerlist": [
                {
                    "skill": "Asp.Net",
                    "addedby": "Me",
                    "level":"Mid-Senior",
                    "questiondescriptor":"The assemblies which resides in GAC are called?",
                    "rating":"4"
                },
                {
                    "skill": "Asp.Net",
                    "addedby": "John tim",
                    "level":"Manager",
                    "questiondescriptor":"What OO concept does the below sample code demonstrate?",
                    "rating":"5"
                },
                {
                    "skill": "Asp.Net",
                    "addedby": "Me",
                    "level":"Mid-Senior",
                    "questiondescriptor":"Select correct statement related to portable executable (PE)",
                    "rating":"3"
                }
            ]
          }
      }

      getByCandidateId(candidateid:any){
        //debugger;
        return this.httpClient.get(this.apiUrl+'/api/candidateService/getCandidateById?candidateId='+candidateid)
        .pipe(
            map(res =>res),
            );
    }

    googlelocations(val:any)
    {
       // return this.httpClient.get<any>('https://api.locationiq.com/v1/autocomplete.php?q=' + val + '&autocomplete=1&viewbox=78.5114269%2C17.3715198%2C78.5114269%2C17.3715198&key=pk.e546e2dbed53ccff5f33b4eb102cd61c&format=json&dedupe=1')
       return this.httpClient.get<any>(this.apiUrl+'/api/candidateService/getGoogleLocations1?val='+val)
        .pipe(
            map(res=>res),
        );
    }

    savecandidate(payLoad:any)
    {
        return this.httpClient.post<any>(this.apiUrl+'/api/candidateService/createCandidate',{params: payLoad})
        .pipe(
            map(res =>res),
            );
    }


    savecandidateInterviewSheduleInfo(payLoad:any)
    {
        return this.httpClient.post<any>(this.apiUrl+'/api/interviewService/scheduleInterview',{params: payLoad})
        .pipe(
            map(res =>res),
            );
    }

    updatecandidate(payLoad:any)
    {
        return this.httpClient.get(this.apiUrl+'/api/candidateService/updateCandidate',{params: payLoad})
        .pipe(
            map(res =>res),
            );
    }

    SaveBlobResume(data: FormData) {  
        return this.httpClient.post(this.apiUrl + '/api/resumeService/saveResume', data).pipe(
           // return this.httpClient.post('http://localhost:50274/api/resumeService/saveResume', data).pipe(
            map(res =>res),
            );
    }

    SaveBlobProfileImage(data: FormData) {  
        return this.httpClient.post(this.apiUrl + '/api/candidateService/uploadProfileImage', data).pipe(
            map(res =>res),
            );
    }

    extractpdf(){
        return this.httpClient.get('https://resumeparsing01.blob.core.windows.net/atsresumeparsing01/',{ responseType: 'arraybuffer' }).
        pipe(
            map(res=>res),
        );
    }

    EditCandidateProfileImageUpdation(data: FormData) {  
        return this.httpClient.post(this.apiUrl + '/api/candidateService/EditCandidateProfileImageUpdation', data).pipe(
            map(res =>res),
            );
    }
    
    deleteblobResumes(payLoad:any):Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/resumeService/deleteResume',{params: payLoad})
        .pipe(
            map(res =>res),
        );
    }

    removeprofileimage(cid:any, imageurl:any):Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/candidateService/deleteProfileImage?candidateId='+cid +'&url='+ imageurl)
        .pipe(
            map(res =>res),
        );
    }

    getResumesByCandidateId(payLoad:any):Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/resumeService/getResumeListByCandidateId',{params: payLoad})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }

    getrecuiterslist():Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/jobService/getlistOfRecruiters')
        .pipe(
            map(res=>res),
        );
    }

    getcandidateskills():Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/candidateService/getcandidateskillslist')
        .pipe(
            map(res=>res),
        );
    }

    getopenjobslist():Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/jobService/getOpenJobs')
        .pipe(
            map(res=>res),
        );
    }


    getopenjobslistbyCandidateId(cid:any):Observable<any>{
         return this.httpClient.get(this.apiUrl+'/api/jobService/getopenjobslistbyCandidateId?CandidateId='+cid )
        .pipe(

            map(res=>res),
        );
    }

    getappliedjobslist(cid:any):Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/candidateService/GetJobDetailsbyCandidateId?CandidateId='+cid)
        .pipe(
            map(res=>res),
        );
    }

    sharecandidate(payLoad:any):Observable<any>{
        return this.httpClient.post(this.apiUrl + '/api/candidateService/sharecandidate', {
            CandidateIds:  payLoad.CandidateIds,
            RecruitersIds: payLoad.RecruitersIds,
            UserId:payLoad.UserId
        }).pipe(
            map(res =>res),
            );
    }

    posttaggedjobs(payLoad:any):Observable<any>{
        return this.httpClient.post(this.apiUrl + '/api/candidateService/tagJobToCandidate', {
            CandidateIds:  payLoad.CandidateIds,
            JobIds: payLoad.JobIds,
        }).pipe(
            map(res =>res),
            );
    }

    assigncandidate(payLoad:any):Observable<any>{
        return this.httpClient.post(this.apiUrl + '/api/candidateService/assignCandidateRecruiter', {
            CandidateIds:  payLoad.CandidateIds,
            RecruitersIds: payLoad.RecruitersIds,
            UserId : payLoad.UserId
        }).pipe(
            map(res =>res),
            );
    }

    changecandidatestatus(payLoad:any):Observable<any>{
        return this.httpClient.post(this.apiUrl + '/api/candidateService/changeCandidateStatus', {
            CandidateIds:  payLoad.CandidateIds,
            Active: payLoad.Active,
            UserId:payLoad.UserId
        }).pipe(
            map(res =>res),
            );
    }

    getCandidateActivitiesbyId(cid:any,Jid:any,interviewerId:any):Observable<any>
    {
       // return this.httpClient.get(this.apiUrl + '/api/candidateService/getCandidateActivitiesById?id='+ cid, {})
       //return this.httpClient.get('http://localhost:50274/api/candidateService/getCandidateActivitiesById?id='+ cid + '&Jid='+Jid+'&interviewerId='+interviewerId,{} )
       return this.httpClient.get(this.apiUrl + '/api/candidateService/getCandidateActivitiesById?id='+ cid + '&Jid='+Jid +'&interviewerId='+interviewerId,{} )
        .pipe(
            map(res =>res),
            );
    }
    
    getallTraitTypes()
    {
        return this.httpClient.get(this.apiUrl + '/api/interviewService/getlistofTraits', {})
        .pipe(
            map(res =>res),
            );
    }
    getCandidateAssessment(candidateid:any)
    {
        return this.httpClient.get(this.apiUrl + '/api/interviewService/getCandidateAssessment?candidateId=' + candidateid, {})
        .pipe(
            map(res =>res),
            );
    }
    deleteCandidate(candidateid:any)
    {
        return this.httpClient.get(this.apiUrl + '/api/candidateService/deletecandidate?id=' + candidateid, {})
        .pipe(
            map(res =>res),
            );
    }
    sharecandidateresume(payLoad:any):Observable<any>{
        return this.httpClient.post(this.apiUrl + '/api/resumeService/shareResume', {
            CandidateId:  payLoad.CandidateId,
            ResumePath: payLoad.ResumePath,
            RecruitersIds: payLoad.RecruitersIds,
            UserId:payLoad.UserId
        }).pipe(
            map(res =>res),
            );
    }
    getFoldersbyUserId(payLoad:any):Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/candidateService/GetListOfFolders',{params: payLoad})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }

    GetFoldersList():Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/candidateService/GetFoldersList')
        .pipe(
            map(res =>res),
            );
    }

    getFoldersbyCandidateId(payLoad:any):Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/candidateService/GetFolderDetailByCandidateId',{params: payLoad})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
    getCandidatesbyFolderId(payLoad:any):Observable<any>{
       // debugger;
        return this.httpClient.get(this.apiUrl+'/api/candidateService/GetCandidatesByFolder?folderId=' + payLoad)
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }

    DeleteFolder(payLoad:any):Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/candidateService/DeleteFolder?FolderId=' + payLoad)
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
}
