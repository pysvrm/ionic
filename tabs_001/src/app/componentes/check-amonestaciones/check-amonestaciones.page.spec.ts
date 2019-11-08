import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckAmonestacionesPage } from './check-amonestaciones.page';

describe('CheckAmonestacionesPage', () => {
  let component: CheckAmonestacionesPage;
  let fixture: ComponentFixture<CheckAmonestacionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckAmonestacionesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckAmonestacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
