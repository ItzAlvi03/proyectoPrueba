import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RickMortyComponent } from './rick-morty.component';

describe('RickMortyComponent', () => {
  let component: RickMortyComponent;
  let fixture: ComponentFixture<RickMortyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RickMortyComponent]
    });
    fixture = TestBed.createComponent(RickMortyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
