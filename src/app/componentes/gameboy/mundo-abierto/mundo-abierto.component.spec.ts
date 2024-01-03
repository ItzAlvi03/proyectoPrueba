import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MundoAbiertoComponent } from './mundo-abierto.component';

describe('MundoAbiertoComponent', () => {
  let component: MundoAbiertoComponent;
  let fixture: ComponentFixture<MundoAbiertoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MundoAbiertoComponent]
    });
    fixture = TestBed.createComponent(MundoAbiertoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
