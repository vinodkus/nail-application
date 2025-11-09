import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NailSizeGuideComponent } from './nail-size-guide.component';

describe('NailSizeGuideComponent', () => {
  let component: NailSizeGuideComponent;
  let fixture: ComponentFixture<NailSizeGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NailSizeGuideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NailSizeGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
