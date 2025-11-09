import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// export interface Employee {
//   id?: number;
//   name: string;
//   role: string;
//   stateId: number;
//   districtId: number;
//   cityId: number;
// }
@Injectable({
  providedIn: 'root'
})

export class EmployeeService {
// private apiUrl = 'https://localhost:7161/api/Employee';
// private apiUrl = 'https://localhost:7161/';
  private baseUrl = environment.apiBaseUrl;


  constructor(private http:HttpClient) { }

  getEmployees():Observable<any>{
    
    return this.http.get<any>(this.baseUrl+'/api/Employee');
  }
  addEmployee(formData:FormData):Observable<any>{
    debugger;
    return this.http.post<any>(this.baseUrl+'/api/Employee',formData);
  }

}
