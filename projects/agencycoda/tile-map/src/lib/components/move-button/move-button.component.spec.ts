import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveButtonComponent } from './move-button.component';

describe('MoveButtonComponent', () => {
  let component: MoveButtonComponent;
  let fixture: ComponentFixture<MoveButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
