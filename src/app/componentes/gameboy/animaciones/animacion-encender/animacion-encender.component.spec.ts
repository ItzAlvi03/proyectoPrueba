import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimacionEncenderComponent } from './animacion-encender.component';

describe('AnimacionEncenderComponent', () => {
  let component: AnimacionEncenderComponent;
  let fixture: ComponentFixture<AnimacionEncenderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnimacionEncenderComponent]
    });
    fixture = TestBed.createComponent(AnimacionEncenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
