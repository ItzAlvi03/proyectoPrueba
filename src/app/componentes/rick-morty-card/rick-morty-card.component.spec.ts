import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RickMortyCardComponent } from './rick-morty-card.component';

describe('RickMortyCardComponent', () => {
  let component: RickMortyCardComponent;
  let fixture: ComponentFixture<RickMortyCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RickMortyCardComponent]
    });
    fixture = TestBed.createComponent(RickMortyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
