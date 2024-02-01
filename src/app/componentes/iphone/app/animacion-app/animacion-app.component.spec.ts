import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimacionAppComponent } from './animacion-app.component';

describe('AnimacionAppComponent', () => {
  let component: AnimacionAppComponent;
  let fixture: ComponentFixture<AnimacionAppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnimacionAppComponent]
    });
    fixture = TestBed.createComponent(AnimacionAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
