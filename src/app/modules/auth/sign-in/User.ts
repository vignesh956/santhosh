import { IUser } from "app/interfaces/IUser";

export class User implements IUser{
    FirstName:string;
    LastName:string;
    Email:string;
    Mobile:string;
    Password:string;
    UserName:string;
    CreatedBy:string;
    CreatedDate:Date;
    ModifiedBy:string;
    ModifiedDate:Date; 
    Role:string;
    LinkedIn:string;
    Location:string;
    ProfileImage:string;
    Token:string;
    PrevToken:string;
}