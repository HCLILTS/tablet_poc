import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NTemplate1Component } from './ntemplate1.component';

describe('NTemplate1Component', () => {
  let component: NTemplate1Component;
  let fixture: ComponentFixture<NTemplate1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NTemplate1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NTemplate1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
