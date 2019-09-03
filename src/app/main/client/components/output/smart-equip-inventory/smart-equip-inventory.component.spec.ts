import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartEquipInventoryComponent } from './smart-equip-inventory.component';

describe('SmartEquipInventoryComponent', () => {
  let component: SmartEquipInventoryComponent;
  let fixture: ComponentFixture<SmartEquipInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartEquipInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartEquipInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
