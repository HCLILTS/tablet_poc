import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Template15_Component } from './template15_.component';

describe('Template15Component', () => {
  let component: Template15_Component;
  let fixture: ComponentFixture<Template15_Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Template15_Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Template15_Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
