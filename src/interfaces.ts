export interface Product {
    product_id: number;
    product_name: string;
    mass_g: number;
}

export interface Catalog {
    products: Product[];
}

export interface OrderLineItem {
    product_id: number;
    quantity: number;
}

export interface Order {
    order_id: number;
    requested: OrderLineItem[];
}

export interface Shipment {
    order_id: number;
    products: OrderLineItem[];
}

export interface ProductRestock {
    product_id: number;
    quantity: number;
}

export interface Inventory {
    [key: number]: number; // product_id: quantity
}