import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombateCPUComponent } from './combate-cpu.component';

describe('CombateCPUComponent', () => {
  let component: CombateCPUComponent;
  let fixture: ComponentFixture<CombateCPUComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CombateCPUComponent]
    });
    fixture = TestBed.createComponent(CombateCPUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
