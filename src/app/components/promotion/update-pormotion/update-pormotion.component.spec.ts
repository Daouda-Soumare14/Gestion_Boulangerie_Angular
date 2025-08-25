import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePormotionComponent } from './update-pormotion.component';

describe('UpdatePormotionComponent', () => {
  let component: UpdatePormotionComponent;
  let fixture: ComponentFixture<UpdatePormotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePormotionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdatePormotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
