import { Category } from "../category/category";

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
}
