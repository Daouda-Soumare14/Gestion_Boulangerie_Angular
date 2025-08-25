import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPackComponent } from './list-pack.component';

describe('ListPackComponent', () => {
  let component: ListPackComponent;
  let fixture: ComponentFixture<ListPackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
