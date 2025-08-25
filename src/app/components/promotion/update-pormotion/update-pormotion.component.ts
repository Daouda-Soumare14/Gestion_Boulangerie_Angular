import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PromotionService } from '../../../services/promotion/promotion.service';

@Component({
  selector: 'app-update-pormotion',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './update-pormotion.component.html',
  styleUrl: './update-pormotion.component.css'
})
export class UpdatePormotionComponent {

  promoForm!: FormGroup;
  id!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private promoService: PromotionService
  ) {}

  ngOnInit(): void {

    this.id = +this.route.snapshot.paramMap.get('id')!;

    this.promoService.getPromotion(this.id).subscribe(promo => {
      this.promoForm = this.fb.group({
        name: [promo.name, [Validators.required, Validators.maxLength(100)]],
        discount_type: [promo.discount_type, Validators.required],
        discount_value: [promo.discount_value, [Validators.required, Validators.min(0)]],
        start_date: [promo.start_date, Validators.required],
        end_date: [promo.end_date, Validators.required],
        product_ids: [promo.product_ids || []]
      });
    });
  }

  updatePromotion(): void {
    if (this.promoForm.valid) {
      this.promoService.updatePromotion(this.id, this.promoForm.value).subscribe(() => {
        this.router.navigate(['/promotions']);
      });
    }
  }
}
