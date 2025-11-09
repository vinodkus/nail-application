import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../service/employee.service';
import { Router } from '@angular/router';
import { UtilityService } from '../service/utility.service';
import { MatModule } from '../appModules/mat.module';
import { Employee } from '../models/employee';

@Component({
  selector: 'app-employee-add',
  imports: [CommonModule, FormsModule, MatModule],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.css'
})
export class EmployeeAddComponent implements OnInit {
  /**
   *
   */
  constructor(private router:Router, private  employeeService:EmployeeService, private utilityService:UtilityService) { }
  
employee:Employee={name: '', role: '', stateId: 0, districtId: 0, cityId: 0};
stateList: any[] = [];
districtList: any[] = [];
cityList: any[] = [];
// selectedStateId: number = 0;
// selectedDistrictId: number = 0;
// selectedCityId: number = 0;
selectedStateId: number | null = null;
selectedDistrictId: number | null = null;
selectedCityId: number | null = null;

selectedFile: File | null = null;
 
ngOnInit() {
  this.getAllStates();
}
  
  onSave(){
    const formValue = this.employee;
    debugger;
    this.employee.stateId!=this.selectedStateId;
    this.employee.districtId!=this.selectedDistrictId;
    this.employee.cityId!=this.selectedCityId;
    const formData = new FormData();
    formData.append('name', this.employee.name);
    formData.append('role', this.employee.role);
    formData.append('stateId', (this.selectedStateId??'').toString());
    formData.append('districtId',( this.selectedDistrictId??'').toString());
    formData.append('cityId', (this.selectedCityId??'').toString());
    if(this.selectedFile){
      formData.append('image', this.selectedFile);
    }
    
    this.employeeService.addEmployee(formData).subscribe({
      next: () => {
        alert('Employee added successfully!');
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        console.error('Error adding employee', err);
        alert('Failed to add employee');
      }
    });
  }
getAllStates() {
  this.utilityService.getAllStates().subscribe((data: any) => {
    this.stateList = data;
    debugger;
  });
}

getDistrictsByStateId(stateId: number) {
  debugger;
  this.selectedStateId=stateId;
  this.utilityService.getDistrictsByStateId(this.selectedStateId).subscribe((data: any) => {
    this.districtList = data;
    debugger;
  });  
}

getCitiesByDistrictId(distId: number) {
  this.utilityService.getCitiesByDistrictId(distId).subscribe((data: any) => {
    this.cityList = data;
    debugger;
  });
}

onFileSelected(event:any){
this.selectedFile=event.target.files[0];
}

}

