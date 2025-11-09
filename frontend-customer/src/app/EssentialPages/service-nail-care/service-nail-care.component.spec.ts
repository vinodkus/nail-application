import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceNailCareComponent } from './service-nail-care.component';

describe('ServiceNailCareComponent', () => {
  let component: ServiceNailCareComponent;
  let fixture: ComponentFixture<ServiceNailCareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceNailCareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceNailCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
