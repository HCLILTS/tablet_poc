import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NTemplate4V1Component } from './ntemplate4_1.component';

describe('NTemplate4V1Component', () => {
  let component: NTemplate4V1Component;
  let fixture: ComponentFixture<NTemplate4V1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NTemplate4V1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NTemplate4V1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
