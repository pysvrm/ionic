import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckServiciosPage } from './check-servicios.page';

describe('CheckServiciosPage', () => {
  let component: CheckServiciosPage;
  let fixture: ComponentFixture<CheckServiciosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckServiciosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckServiciosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
