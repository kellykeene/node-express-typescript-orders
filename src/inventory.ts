import { Inventory, Product, ProductRestock, Shipment, Order } from "./interfaces";

//
// Maximum weight of a single package that can be shipped
//
const PACKAGE_WEIGHT_MAXIMUM_G = 1800; // 1.8kg

// 
// In-memory store for product catalog
// 
let catalog: Product[] = [];

// 
// In-memory hashtable for product inventory
// 
let inventory: Inventory = {};

// 
// In-memory store for unfulfilled orders
// 
let deferredOrders: Order[] = [];

// 
// Catalog initialization function
// - Initializes the products store
// - Initializes the inventory hashtable (all quantities initialized to 0)
// 
export const init_catalog = (products: Product[]) => {
    catalog.push(...products);
    catalog.forEach((product) => {
        inventory[product.product_id] = 0; // Load the inventory hashtable, initializing all quantities to 0
    });
};

// 
// Restock a list of products
// - Updates the quantities on hand
// - Retries shipping any pending orders/shipments
// 
export const process_restock = (restocks: ProductRestock[]) => {
    
    // For each restocked product...
    restocks.forEach((productRestock) => {
        let { product_id, quantity } = productRestock;

        // Update the quantity of each product in the restock
        if (inventory[product_id] !== undefined) {
            inventory[product_id] += quantity;
        } else {
            inventory[product_id] = quantity;
        }

        // Retry shipping any pending orders/shipments
        if (deferredOrders.length > 0) {
            deferredOrders.forEach((order) => {
                process_order(order);
            });
        }
    });
  };

// 
// Process an order
// 
export const process_order = (order: Order) => {
    createShipments(order);
};

// 
// Create shipments for an order
// 
const createShipments = (order: Order) => {
    let shipments = [];
    let lineItems = [];
    let currentWeight = 0;
    let deferredOrder: Order = {
        order_id: order.order_id,
        requested: []
    };
  
    for (const item of order.requested) {
        const { product_id, quantity } = item;
        const weight = catalog[product_id].mass_g;
        const quantityInStock = inventory[product_id] || 0;
        const shippableQuantity = (quantityInStock > 0) ? Math.min(quantity, quantityInStock) : 0;
        let remainingQuantity = shippableQuantity;
        
        const unshippableQuantity = (quantity - shippableQuantity);
        
        while (remainingQuantity > 0) {
            if ((currentWeight + weight) <= PACKAGE_WEIGHT_MAXIMUM_G) {
                const quantityToAdd = Math.min(remainingQuantity, Math.floor((PACKAGE_WEIGHT_MAXIMUM_G - currentWeight) / weight));
                lineItems.push({ product_id, quantity: quantityToAdd });
                currentWeight += weight * quantityToAdd;
                remainingQuantity -= quantityToAdd;
            } else {
                shipments.push([...lineItems]); 

                const shipment: Shipment = {
                    order_id: order.order_id,
                    products: [...lineItems]
                };
                shipPackage(shipment);

                lineItems = [];
                currentWeight = 0;
            }
        }

        if (unshippableQuantity > 0) {
            deferredOrder.requested.push({product_id, quantity: unshippableQuantity});
        }
    }

    if (shipments.length > 0) {
        console.log(`Order ID ${order.order_id}, Successful shipments: ${JSON.stringify(shipments)}.`);
    }

    if (deferredOrder.requested.length > 0) {
        deferredOrders.push(deferredOrder);

        console.log(`Order ID ${order.order_id}, Additional shipments are pending restock: ${JSON.stringify(deferredOrders)}.`);
    }
};

  
// 
// Stub function for shipping a package
// 
export const shipPackage = (shipment: Shipment) => {
    const { order_id, products } = shipment;
    console.log(`Order ${shipment.order_id} has shipped a package containing: ${products}`);
};

// 
// Returns the list of products in the catalog
// 
export const getProducts = () => {
    return catalog;
};

// 
// Adds a product to the catalog
// 
export const addProduct = (product: Product) => {

    product.product_id = getUniqueProductId();

    catalog.push(product);
};

// 
// Determines the next unique and available product id in the catalog
// 
const getUniqueProductId = () => {
    const productIds = catalog.map(product => product.product_id).sort();
    const newProductId = productIds[productIds.length - 1] + 1;
    return newProductId;
};

// 
// Returns the list of deferred orders
// 
export const getDeferredOrders = () => {
    return deferredOrders;
};
