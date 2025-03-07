import categorySeeder from "./category.js";
import productSeeder from "./product.js";
import mongoConnect from "../mongo/mongoConnecter.js";

async function seeder() {
  try {
    await mongoConnect();
    console.log("Started seeding categories...");
    await categorySeeder();
    console.log("Categories seeding completed");
    
    console.log("Started seeding products...");
    await productSeeder();
    console.log("Products seeding completed");
    
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

seeder();
