import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private loginStatus=new BehaviorSubject(!!localStorage.getItem('token'));
private customerNameSubject= new BehaviorSubject<string|null>(localStorage.getItem('customerName'));
customerName$= this.customerNameSubject.asObservable();
isLoggedIn$ = this.loginStatus.asObservable();

private customerEmail= new BehaviorSubject<string|null>(localStorage.getItem('customerEmail'));
customerEmail$= this.customerEmail.asObservable();

private CustomerId = new BehaviorSubject<string|null>(localStorage.getItem('customerId'));
customerId$ = this.CustomerId.asObservable();

login(token:string, name:string, email:string, id:string) {
  debugger
  localStorage.setItem('token',token);
  localStorage.setItem('customerName',name);
  localStorage.setItem('customerEmail',email);
  localStorage.setItem('customerId',id.toString());
  
debugger;
  this.loginStatus.next(true);
  this.customerNameSubject.next(name);
  this.customerEmail.next(email);
  this.CustomerId.next(id);
}

logout(){
  localStorage.removeItem('token');
  localStorage.removeItem('customerName');
  this.loginStatus.next(false);
  this.customerNameSubject.next(null);
}
  constructor() { }
  getCustomerName():string| null{
    return localStorage.getItem('customerName');
  }
}
