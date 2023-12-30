import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombateSpinnerComponent } from './combate-spinner.component';

describe('CombateSpinnerComponent', () => {
  let component: CombateSpinnerComponent;
  let fixture: ComponentFixture<CombateSpinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CombateSpinnerComponent]
    });
    fixture = TestBed.createComponent(CombateSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
