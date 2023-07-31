## Project Setup  

### Summary  
NodeJs, Express, Javascript/Typescript, Jest
Typescript
Express
Jest

### Project Structure  
- Starting file/API server implementation:                  src/app.ts
- Emmited Typescript-to-Javascript files:                   dist
- OpenAPI Validation Schema:                                openapi/spec.yml
- Interfaces and types auto-generated from OpenAPI schema:  src/types/api.ts 

### Sample script run
1. Start the server:        npm start
2. Fetch all products:      curl localhost:3000/products
3. Process order:           curl localhost:3000/process_order -H "Content-Type: application/json" -d '{"order_id": 123, "requested": [{"product_id": 0, "quantity": 2}, {"product_id": 10, "quantity": 4}]}'
4. Fetch all orders:        curl localhost:3000/orders
5. Add a single product:    curl localhost:3000/products -H "Content-Type: application/json" -d '{"product_name": "Learning Typescript book", "mass_g": "100", "product_id":"13"}'



### Project Setup
#### npm
npm init -y

#### Gitignore  
npx gitignore node          // generates the .gitignore file using a standard node template

#### Typescript  
1. tsc --init                  // generates the tsconfig.json file
2. Created a dist folder and updated tsconfig.json "outDir" to use this folder for the resulting javascript files
3. tsc <filename or pattern>   // Emits <filename>.js file for each typescript file

#### Jest  




### OpenAPI  
Installed openapi-typescript (https://www.npmjs.com/package/openapi-typescript?activeTab=readme) to demonstrate creating the OpenAPI spec and generating components and endpoints from the spec.

Usage:  
1. Define your components and paths/routes in openapi/spec.yml
2. Invoke the "openapi-typescript" script: npm run generate-types
3. Verify the interface and route code in src/types/api.ts
4. Import and implement the interfaces into app.ts



### Improvements (for production)  
JWT or OAuth security, CORS, input validation (zero-ZOD), file uploads, API browser, OpenAPI spec generator, prettier, eslint, typescript lint

Add security: JWT or OAuth etc
Add CORS Support: cors npm package
Better project organization: Create a seperate file for each endpoint, organized by domain

Advantages/Disadvantages of using Express? Typescript? NodeJs/Python?

Study coding conventions for NodeJs APIs



