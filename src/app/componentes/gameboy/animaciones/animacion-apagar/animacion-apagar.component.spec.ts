import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimacionApagarComponent } from './animacion-apagar.component';

describe('AnimacionApagarComponent', () => {
  let component: AnimacionApagarComponent;
  let fixture: ComponentFixture<AnimacionApagarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnimacionApagarComponent]
    });
    fixture = TestBed.createComponent(AnimacionApagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
