const fs = require("fs");
const path = require("path");
const vm = require("vm");

const pagesDir = path.join(process.cwd(), "src/pages");
const middlewarePath = path.join(process.cwd(), "src/middleware.ts");
const seederPath = path.join(
  process.cwd(),
  "seeders/20240402234643-permissions.js"
);

let gate = {};
let permissionsList = [];

// Function to read the existing gate object from middleware.ts
function readExistingGate() {
  const middlewareContent = fs.readFileSync(middlewarePath, "utf8");
  const gateMatch = middlewareContent.match(/const\s+gate\s*=\s*({[^}]*})/);
  if (gateMatch) {
    const gateString = gateMatch[1];
    const script = new vm.Script(`gate = ${gateString}`);
    const sandbox = { gate: {} };
    script.runInNewContext(sandbox);
    gate = sandbox.gate;
  }
}

// Function to extract permissions from pages and update the gate object
function extractPermissions(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      extractPermissions(fullPath);
    } else if (stat.isFile() && file.endsWith(".tsx")) {
      const content = fs.readFileSync(fullPath, "utf8");
      const permissionMatch = content.match(
        /export\s+const\s+permission\s*=\s*['"`](.*?)['"`]/
      );
      if (permissionMatch) {
        const relativePath = path
          .relative(pagesDir, fullPath)
          .replace(/\\/g, "/")
          .replace(/\.tsx$/, "");
        const permission = permissionMatch[1];
        gate[`/${relativePath}`] = permission;
        permissionsList.push(permission);
      }
    }
  });
}

// Read existing gate object from middleware.ts
readExistingGate();

// Extract permissions and update the gate object
extractPermissions(pagesDir);

console.log("Permissions extracted:", gate);

// Update middleware.ts with the new gate object
const middlewareContent = fs.readFileSync(middlewarePath, "utf8");
const updatedMiddlewareContent = middlewareContent.replace(
  /const\s+gate\s*=\s*{[^}]*}/,
  `const gate = ${JSON.stringify(gate, null, 2)}`
);

fs.writeFileSync(middlewarePath, updatedMiddlewareContent);

console.log("Middleware updated with new permissions.");

// Update seeder file with the new permissions
const seederContent = fs.readFileSync(seederPath, "utf8");
const updatedSeederContent = seederContent.replace(
  /const\s+permissionsList\s*=\s*\[\]/,
  `const permissionsList = ${JSON.stringify(permissionsList, null, 2)}`
);

fs.writeFileSync(seederPath, updatedSeederContent);

console.log("Seeder updated with new permissions.");
