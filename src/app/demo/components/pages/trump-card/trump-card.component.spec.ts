import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrumpCardComponent } from './trump-card.component';

describe('TrumpCardComponent', () => {
  let component: TrumpCardComponent;
  let fixture: ComponentFixture<TrumpCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrumpCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrumpCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
