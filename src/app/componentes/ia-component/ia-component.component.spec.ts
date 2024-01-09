import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IAComponentComponent } from './ia-component.component';

describe('IAComponentComponent', () => {
  let component: IAComponentComponent;
  let fixture: ComponentFixture<IAComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IAComponentComponent]
    });
    fixture = TestBed.createComponent(IAComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
