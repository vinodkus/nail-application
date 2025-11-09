import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePressOnNailsComponent } from './service-press-on-nails.component';

describe('ServicePressOnNailsComponent', () => {
  let component: ServicePressOnNailsComponent;
  let fixture: ComponentFixture<ServicePressOnNailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicePressOnNailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicePressOnNailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
