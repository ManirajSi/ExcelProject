import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelPagesComponent } from './excel-pages.component';

describe('ExcelPagesComponent', () => {
  let component: ExcelPagesComponent;
  let fixture: ComponentFixture<ExcelPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcelPagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExcelPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
