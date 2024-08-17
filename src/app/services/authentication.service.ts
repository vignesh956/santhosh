import { Injectable } from "@angular/core";
import { HttpHeaders,HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { ILogin } from "../../../src/app/interfaces/ILogin";
import { Observable, throwError } from "rxjs";
import { RepositoryConstant } from "../../app/modules/constants/Repository.constant";

@Injectable()
export class AuthenticationService{
    public apiUrl:string=RepositoryConstant.apiUrl;
    constructor(private httpClient:HttpClient){
        
    }

   static getLoggedInformation(){
    return JSON.parse(localStorage.getItem("loggedinfo"));
}
    validateUser(user:ILogin){
        var userData="UserName="+user.UserName+"&password="+user.Password+"&grant_type=password";
        var reqHeader=new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
        return this.httpClient.post(this.apiUrl+'/token',userData,{headers:reqHeader})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
        
    }
    checkUserStatus(email: any, password: any){
        debugger;
        console.log(email,password,"data signin");
        return this.httpClient.get(this.apiUrl+'/api/userService/authenticate?email='+email+'&password='+password)
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
            
        
    }
    public isAuthenticated():boolean{
        return this.getToken()!=null;
    }
    storeToken(token:string){
        localStorage.setItem("token",token);
    }
    storeLoggedInfo(item:string){
        localStorage.setItem("loggedinfo",JSON.stringify(item));
    }
    getLoggedInfo(){
        return JSON.parse(localStorage.getItem("loggedinfo"));
    }
    removeLoggedInfo(){
        return localStorage.removeItem("loggedinfo");
    }
   
    getToken(){
        return localStorage.getItem("token");
    }
    removeToken(){
        return localStorage.removeItem("token");
    }
    clearAll(){
        localStorage.clear();
    }
    saveUser(payLoad:any){
        //return this.httpClient.post(this.apiUrl+'/api/users/save',payLoad,{})
        return this.httpClient.post(this.apiUrl+'/api/userService/createUser',payLoad,{})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
    findByUserId(payLoad:any):Observable<any>{
        //return this.httpClient.get(this.apiUrl+'/api/users/findbyuserid',{params: payLoad})
        return this.httpClient.get(this.apiUrl+'/api/userService/getUserbyId',{params: payLoad})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
    findByUserToken(payLoad:any):Observable<any>{
        //return this.httpClient.get(this.apiUrl+'/api/users/findbyusertoken',{params: payLoad})
        return this.httpClient.get(this.apiUrl+'/api/userService/findBytoken',{params: payLoad})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
    updateUser(payLoad:any){
        //return this.httpClient.post(this.apiUrl+'/api/users/updateuser',payLoad,{})
        return this.httpClient.post(this.apiUrl+'/api/userService/updateUser',payLoad,{})
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }
    getShareUsers():Observable<any>{
        return this.httpClient.get(this.apiUrl+'/api/users/getallshareUsers')
        .pipe(
            map(res =>res),
            //catchError(this.errorHandler)
            );
    }

    userforgotPassword(email){
        //return this.httpClient.post(this.apiUrl +'/api/users/forgotpwd?email='+email,'')
        return this.httpClient.get(this.apiUrl +'/api/userService/forgotPassword?email='+email)
        .pipe(
                map(res=>res),
                catchError(this.errorHandler)
        );
    }

    userresetPassword(payLoad){
        //return this.httpClient.post(this.apiUrl +'/api/users/resetpwd?tokenid='+payLoad.tokenid+'&email='+payLoad.email+'&password='+payLoad.password,'')
        return this.httpClient.post(this.apiUrl +'/api/userService/resetPassword?id='+payLoad.tokenid+'&email='+payLoad.email+'&password='+payLoad.password,'')
        .pipe(
                map(res=>res),
                catchError(this.errorHandler)
        );
    }

    errorHandler(error: HttpErrorResponse)
    {
        return throwError(error || "Server Error.");
    }

    storeisAuthenticatedValidatelogin(message:string){
        localStorage.setItem("authenticated",JSON.stringify(message));
    }
    getisAuthenticatedValidatelogin(){
        return JSON.parse(localStorage.getItem("authenticated"));
        // let token = this.getToken();
        // if(token != null || token !="")
        //     return true;
        // else
        //     return false;
    }
    removeisAuthenticatedValidatelogin(){
        return localStorage.removeItem("authenticated");
    }

    validateEmailUser(email){
        //return this.httpClient.post(this.apiUrl +'/api/users/validateEmail?email='+email,'')
        return this.httpClient.get(this.apiUrl +'/api/userService/validateEmail?email='+email)
        .pipe(
                map(res=>res),
                catchError(this.errorHandler)
        );
    }

}