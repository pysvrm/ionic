import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmonestacionesPage } from './amonestaciones.page';

describe('AmonestacionesPage', () => {
  let component: AmonestacionesPage;
  let fixture: ComponentFixture<AmonestacionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmonestacionesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmonestacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
