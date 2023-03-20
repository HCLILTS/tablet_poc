import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NTemplate13V1Component } from './ntemplate13_1.component';

describe('NTemplate13Component', () => {
  let component: NTemplate13V1Component;
  let fixture: ComponentFixture<NTemplate13V1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NTemplate13V1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NTemplate13V1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
