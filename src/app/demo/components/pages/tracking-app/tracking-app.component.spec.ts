import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingAppComponent } from './tracking-app.component';

describe('TrackingAppComponent', () => {
  let component: TrackingAppComponent;
  let fixture: ComponentFixture<TrackingAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackingAppComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrackingAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
