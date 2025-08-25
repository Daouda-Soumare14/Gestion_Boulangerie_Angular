import { Product } from "../product/product";

export interface Promotion {
  id: number;
  name: string;
  discount_type: 'pourcentage' | 'montant';
  discount_value: number;
  start_date: string;  // format YYYY-MM-DD
  end_date: string;    // format YYYY-MM-DD
  product_ids?: number[];
  products: Product[];
}
