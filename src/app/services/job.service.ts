import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RepositoryConstant } from "app/modules/constants/Repository.constant";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";


//import { Observable } from "rxjs";
export interface DataTableItem {
    id: number;
    companyInfoLogo:string;
    JobID:string;
    JobDate:any;
    title:string;
    hiringManager:string;
    location:string;
    jobOverView:string;
    jobDuties:string;
    jobSkills:string;
    jobQual:string;
    jobSoftSkills:string;
    jobTopThreeSkills:string;
    jobPersonalityTraits:string;
    jobYrsExp:string;
    jobPrevExp:string;
    jobEducation:string;
    jobCertifications:string;
    jobkeywords:string;
    jobParagraph:string;
    jobStatus:string;
  
  }
const EXAMPLE_DATA: DataTableItem[] = [
    {
        id:1,
        "companyInfoLogo":"ABC Inc",
        "JobID":"13671",
        "JobDate":"2018/10/01",
        "hiringManager":"Adams, Henry",
        "location":"Piscataway, NJ",
        "title":"Technology Analyst",
        "jobOverView":"Improvement in Data Quality",
        "jobDuties":"Understand requirements,",
        "jobSkills":"Salesforce Lightning2",
        "jobQual":"B.tech",
        "jobSoftSkills":"Salesforce Lightning",
        "jobTopThreeSkills":"Salesforce Lightning,Visual",
        "jobPersonalityTraits":"Salesforce Lightning,Visual Force Pages Design,Apex Coding",
        "jobYrsExp":"8",
        "jobPrevExp":"7",
        "jobEducation":"B.tech",
        "jobCertifications":"Salesforce Certifications at least before 2017",
        "jobkeywords":"Salesforce Developer with Lightning",
        "jobParagraph":"The candidate must have a strong Architecture",
        "jobStatus":"Open"
    },
    {
        id:2,
        "companyInfoLogo":"MNO Inc",
        "JobID":"13672",
        "JobDate":"2018/10/18",
        "hiringManager":"Bailey, Philip James",
        "location":"San Jose, CA",
        "title":"Technology Analyst",
        "jobOverView":"Improvement in Data Quality",
        "jobDuties":"Understand requirements,",
        "jobSkills":"Salesforce Lightning2",
        "jobQual":"B.tech",
        "jobSoftSkills":"Salesforce Lightning",
        "jobTopThreeSkills":"Salesforce Lightning,Visual",
        "jobPersonalityTraits":"Salesforce Lightning,Visual Force Pages Design,Apex Coding",
        "jobYrsExp":"8",
        "jobPrevExp":"7",
        "jobEducation":"B.tech",
        "jobCertifications":"Salesforce Certifications at least before 2017",
        "jobkeywords":"Salesforce Developer with Lightning",
        "jobParagraph":"The candidate must have a strong Architecture",
        "jobStatus":"Closed"
    },
    {
        id:3,
        "companyInfoLogo":"XYZ Inc",
        "JobID":"13673",
        "JobDate":"2018/05/10",
        "hiringManager":"Carlyle, Thomas",
        "location":"New York, NY",
        "title":"Technology Analyst",
        "jobOverView":"Improvement in Data Quality",
        "jobDuties":"Understand requirements,",
        "jobSkills":"Salesforce Lightning2",
        "jobQual":"B.tech",
        "jobSoftSkills":"Salesforce Lightning",
        "jobTopThreeSkills":"Salesforce Lightning,Visual",
        "jobPersonalityTraits":"Salesforce Lightning,Visual Force Pages Design,Apex Coding",
        "jobYrsExp":"8",
        "jobPrevExp":"7",
        "jobEducation":"B.tech",
        "jobCertifications":"Salesforce Certifications at least before 2017",
        "jobkeywords":"Salesforce Developer with Lightning",
        "jobParagraph":"The candidate must have a strong Architecture",
        "jobStatus":"Closed"
    },
    {
        id:4,
        "companyInfoLogo":"ZMN Inc",
        "JobID":"13674",
        "JobDate":"2018/03/10",
        "hiringManager":"Darwin, Charles",
        "location":"Hoboken, NJ",
        "title":"Technology Analyst",
        "jobOverView":"Improvement in Data Quality",
        "jobDuties":"Understand requirements,",
        "jobSkills":"Salesforce Lightning2",
        "jobQual":"B.tech",
        "jobSoftSkills":"Salesforce Lightning",
        "jobTopThreeSkills":"Salesforce Lightning,Visual",
        "jobPersonalityTraits":"Salesforce Lightning,Visual Force Pages Design,Apex Coding",
        "jobYrsExp":"8",
        "jobPrevExp":"7",
        "jobEducation":"B.tech",
        "jobCertifications":"Salesforce Certifications at least before 2017",
        "jobkeywords":"Salesforce Developer with Lightning",
        "jobParagraph":"The candidate must have a strong Architecture",
        "jobStatus":"Open"
    },
    {
        id:5,
        "companyInfoLogo":"OCQ Inc",
        "JobID":"13675",
        "JobDate":"2018/09/11",
        "hiringManager":"Eisenstein",
        "location":"Piscataway, NJ",
        "title":"Technology Analyst",
        "jobOverView":"Improvement in Data Quality",
        "jobDuties":"Understand requirements,",
        "jobSkills":"Salesforce Lightning2",
        "jobQual":"B.tech",
        "jobSoftSkills":"Salesforce Lightning",
        "jobTopThreeSkills":"Salesforce Lightning,Visual",
        "jobPersonalityTraits":"Salesforce Lightning,Visual Force Pages Design,Apex Coding",
        "jobYrsExp":"8",
        "jobPrevExp":"7",
        "jobEducation":"B.tech",
        "jobCertifications":"Salesforce Certifications at least before 2017",
        "jobkeywords":"Salesforce Developer with Lightning",
        "jobParagraph":"The candidate must have a strong Architecture",
        "jobStatus":"Open"
    }
  ];
@Injectable()
export class JobService{
    // public getJobsList(): Observable<DataTableItem[]> {
    //     let jobList : DataTableItem[] = EXAMPLE_DATA;
    //     return Observable.of(jobList).delay(500);
    //   }
    public apiUrl:string=RepositoryConstant.apiUrl;

    constructor(private httpClient:HttpClient){

    }

    public ApplyJobByCandidate(payLoad:any){
        return this.httpClient.post(this.apiUrl+'/api/candidateActivity/ApplyJobByCandidate',payLoad,{})
        .pipe(
            map(res =>res),
            );
    }
    getByCandidateId(payLoad:any){

        return this.httpClient.get(this.apiUrl+'/api/candidate/getBycandidateId',{params: payLoad})
        .pipe(
            map(res =>res),
             );
    }

    GetDashboardInfo():Observable<any>{
 
        // return this.httpClient.get(this.apiUrl+'/api/jobService/GetDashboardInfo')
        return this.httpClient.get(this.apiUrl+'/api/jobService/GetDashboardInfo')
        .pipe(
            map(res =>res),
             );
    }
    GetDashboardJobStatus():Observable<any>{
         return this.httpClient.get(this.apiUrl+'/api/jobService/GetDashboardJobStatus')
        .pipe(
            map(res =>res),
             );
    }

    GetDashboardSearchByJobAndCandidate(Days:any):Observable<any>{
 
         return this.httpClient.get(this.apiUrl+'/api/jobService/GetDashboardSearchByJobAndCandidate?Days='+Days)
        .pipe(
            map(res =>res),
             );
    }
 }