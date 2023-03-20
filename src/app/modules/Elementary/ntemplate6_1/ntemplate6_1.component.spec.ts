import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NTemplate6V1Component } from './ntemplate6_1.component';

describe('NTemplate6V1Component', () => {
  let component: NTemplate6V1Component;
  let fixture: ComponentFixture<NTemplate6V1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NTemplate6V1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NTemplate6V1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
