import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUsoComponent } from './info-uso.component';

describe('InfoUsoComponent', () => {
  let component: InfoUsoComponent;
  let fixture: ComponentFixture<InfoUsoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoUsoComponent]
    });
    fixture = TestBed.createComponent(InfoUsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
