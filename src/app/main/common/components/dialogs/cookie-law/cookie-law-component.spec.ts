import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CookieLawComponent } from "./cookie-law.component";
import { NgScrollbarModule } from "ngx-scrollbar";
import { MatCheckboxModule, MatDialogModule, MatDialogRef } from "@angular/material";
import { CookieService } from "ngx-cookie-service";

describe('CookieLawComponent', () => {

  let component: CookieLawComponent;
  let fixture: ComponentFixture<CookieLawComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CookieLawComponent],
      imports: [
        NgScrollbarModule,
        MatCheckboxModule,
        MatDialogModule,
      ],
      providers: [
        CookieService,
        {provide: MatDialogRef, useValue: {}}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieLawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
  

});