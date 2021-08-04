import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePagosComponent } from './home-pagos.component';

describe('HomePagosComponent', () => {
  let component: HomePagosComponent;
  let fixture: ComponentFixture<HomePagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomePagosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
