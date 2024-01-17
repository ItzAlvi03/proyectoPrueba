import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IaSpinnerComponent } from './ia-spinner.component';

describe('IaSpinnerComponent', () => {
  let component: IaSpinnerComponent;
  let fixture: ComponentFixture<IaSpinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IaSpinnerComponent]
    });
    fixture = TestBed.createComponent(IaSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
