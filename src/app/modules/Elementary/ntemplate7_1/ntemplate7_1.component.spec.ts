import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NTemplate7V1Component } from './ntemplate7_1.component';

describe('NTemplate7V1Component', () => {
  let component: NTemplate7V1Component;
  let fixture: ComponentFixture<NTemplate7V1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NTemplate7V1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NTemplate7V1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
