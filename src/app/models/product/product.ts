import { Category } from "../category/category";
import { Pack } from "../pack/pack";
import { Promotion } from "../promotion/promotion";

export interface Product {
    id: number;
    category_id: number;   
    category: Category  
    name: string;              
    description?: string;      
    price: number;         
    stock: number;             
    photo?: string;            
    allergens?: string; 
    promotions?: Promotion[];
    packs?: Pack[];
}
