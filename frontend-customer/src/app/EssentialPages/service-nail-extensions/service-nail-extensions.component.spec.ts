import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceNailExtensionsComponent } from './service-nail-extensions.component';

describe('ServiceNailExtensionsComponent', () => {
  let component: ServiceNailExtensionsComponent;
  let fixture: ComponentFixture<ServiceNailExtensionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceNailExtensionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceNailExtensionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
