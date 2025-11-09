import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
    private baseUrl = environment.apiBaseUrl;

  constructor(private http:HttpClient) { }
  getAllStates():any{
    
    return this.http.get<any>(`${this.baseUrl}/api/Master/GetAllStates`);

  }
  getDistrictsByStateId(stateId:number):any{
    return this.http.get<any>(`${this.baseUrl}/api/Master/GetAllDistictByStateId/${stateId}`);
  }
  getCitiesByDistrictId(districtId:number):any{
    debugger;
    return this.http.get<any>(`${this.baseUrl}/api/Master/GetAllCitiesByDistrictId/${districtId}`);
  }
  getAllCategories():any{
    return this.http.get<any>(`${this.baseUrl}/api/Master/GetAllCategories`);
  }

}
