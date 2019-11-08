import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuInquilinosPage } from './menu-inquilinos.page';

describe('MenuInquilinosPage', () => {
  let component: MenuInquilinosPage;
  let fixture: ComponentFixture<MenuInquilinosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuInquilinosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuInquilinosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
