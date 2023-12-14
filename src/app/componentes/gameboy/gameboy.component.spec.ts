import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameboyComponent } from './gameboy.component';

describe('GameboyComponent', () => {
  let component: GameboyComponent;
  let fixture: ComponentFixture<GameboyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameboyComponent]
    });
    fixture = TestBed.createComponent(GameboyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
