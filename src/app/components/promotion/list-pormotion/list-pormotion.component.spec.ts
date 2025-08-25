import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPormotionComponent } from './list-pormotion.component';

describe('ListPormotionComponent', () => {
  let component: ListPormotionComponent;
  let fixture: ComponentFixture<ListPormotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPormotionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListPormotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
