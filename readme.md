## Project Setup  

Javascript using NodeJs, Typescript, Jest

Gitignore
npx gitignore node          // generates the .gitignore file using a standard node template

Typescript
Created a dist folder and updated tsconfig.json "outDir" to use this folder for the resulting javascript files
tsc --init                  // generates the tsconfig.json file
tsc <filename or pattern>   // Emits a -js file for each typescript file

Jest

### Project Structure  

dist
node_modules
src
tests


### Improvements (for production)  

