import { Injectable } from "@angular/core";
import { HttpConstants } from "../../constants/Http.constants";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RepositoryConstant } from "../../constants/Repository.constant";
import { MatTableDataSource } from "@angular/material/table";

@Injectable()
export class UsersService{
    public apiUrl:string=RepositoryConstant.apiUrl;
    dataSource = new MatTableDataSource();
    constructor(private httpClient:HttpClient){

    }
    getAllUsers():Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/users/getallusers')
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
    getAllCandidates():Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/users/getallcandidates')
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
    getAllGroupUsers():Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/users/getallGroupUsers')
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
    saveUserGroup(payLoad:any){
        return this.httpClient.post(this.apiUrl+'/api/usergroup/save',payLoad,{})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
    getAllGroups():Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/usergroup/getAllGroups')
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
    getGroupsByGroupName(payLoad:any):Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/usergroup/getgroupsbygroupname',{params: payLoad})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }

    saveUser(payLoad:any){
        //return this.httpClient.post(this.apiUrl+'/api/users/save',payLoad,{})
        return this.httpClient.post(this.apiUrl+'/api/userService/createUser',payLoad,{})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }

    updateUsers(payLoad:any){
        //return this.httpClient.post(this.apiUrl+'/api/users/updateuser',payLoad,{})
        return this.httpClient.post(this.apiUrl+'/api/userService/updateUser',payLoad,{})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
    getInfiniteScrollJobs(count:number, jobdata:[])
    {
        this.dataSource.data=[];
        for (var i = 1; i <= jobdata.length; i++) {
            if (i <= count) {
                this.dataSource.data.push(jobdata[i-1])
            }
          }
          return this.dataSource.data;
    }
}