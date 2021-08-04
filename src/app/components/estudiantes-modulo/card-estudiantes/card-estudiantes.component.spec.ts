import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEstudiantesComponent } from './card-estudiantes.component';

describe('CardEstudiantesComponent', () => {
  let component: CardEstudiantesComponent;
  let fixture: ComponentFixture<CardEstudiantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardEstudiantesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardEstudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
