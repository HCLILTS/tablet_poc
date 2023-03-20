import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NtemplatetwoComponent } from './ntemplatetwo.component';

describe('NtemplatetwoComponent', () => {
  let component: NtemplatetwoComponent;
  let fixture: ComponentFixture<NtemplatetwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NtemplatetwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NtemplatetwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
