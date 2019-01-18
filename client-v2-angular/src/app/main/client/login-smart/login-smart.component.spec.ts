import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSmartComponent } from './login-smart.component';

describe('LoginSmartComponent', () => {
  let component: LoginSmartComponent;
  let fixture: ComponentFixture<LoginSmartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginSmartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
