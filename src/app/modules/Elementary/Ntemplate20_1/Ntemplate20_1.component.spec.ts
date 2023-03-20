import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ntemplate20V1Component } from './Ntemplate20_1.component';

describe('Ntemplate20Component', () => {
  let component: Ntemplate20V1Component;
  let fixture: ComponentFixture<Ntemplate20V1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ntemplate20V1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ntemplate20V1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
