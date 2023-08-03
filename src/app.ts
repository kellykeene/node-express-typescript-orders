import express from "express";
import router from "./routes/orders";
//import inventoryRouter from "./routes/inventory";
import catalogData from "./data/catalog";
import { initCatalog } from "./inventory";

// 
// Setup express server and json parser middleware
// 
const app = express();
app.use(express.json);

// Expose the process_order API endpoint
app.use("/process_order", router);

// Expose the process_restock endpoint
//app.use("/process_restock", inventoryRouter);

// 
// Initialize catalog and inventory
// 
initCatalog(catalogData);

// 
// Start the server
// 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${ PORT }`);
});

// 
// Exporting for tests
// 
export default app;