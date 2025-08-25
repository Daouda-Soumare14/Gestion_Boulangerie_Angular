import { Product } from "../product/product";
import { Promotion } from "../promotion/promotion";

export interface PackProduct {
    products: Product;
    product_id: number;
    quantity: number;
}

export interface Pack {
photo: any;
    id: number;
    name: string;
    description?: string;
    price: number;
    products: {
        promotions: Promotion[];
        id: number;
        name: string;
        photo?: string;
        pivot: {
            quantity: number;
        }
    }[];
}
