import { OrderItem } from "../oriderItem/order-item";

export interface Order {
  id?: number;
  user_id: number;
  order_status: string;
  delivery_status: string;
  payment_mode: string;
  total: number;
  items: OrderItem[];
}


export interface OrderResponse {
  message: string;
  order: Order;
}
