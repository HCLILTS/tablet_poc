import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NTemplate10Component } from './ntemplate10.component';

describe('NTemplate10Component', () => {
  let component: NTemplate10Component;
  let fixture: ComponentFixture<NTemplate10Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NTemplate10Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NTemplate10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
