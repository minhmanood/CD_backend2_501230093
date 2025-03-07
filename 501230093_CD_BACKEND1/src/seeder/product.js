import ProductModel from "../models/productModel.js";
import CategoryModel from "../models/categoryModel.js";

const data = [
    {
        code: "ATD_001",
        name: "Ao Nam",
        price: 1000000,
        images: ["combo9.jpg"],
        searchString: "ao nam ,ao nam tay dai",
        sizes: ["L", "M", "S"],  // Đổi từ size thành sizes
        colors: ["red", "green"], // Đổi từ color thành colors
        active: true,
        description: "ao nam tay dai rất đẹp ",
        information: "ao nam tay dai rất đẹp ",
        categoryCode: "A_001",
        createdAt: new Date(),
    },
  {
    code: "MA_001",
    name: "May anh co ",
    price: 2000000,
    images: ["combo10.jpg"],
    searchString: "may anh canon ,ao nam tay dai",
    colors: ["green", "blue"],
    active: true,
    description: "may anh canon rất đẹp ",
    information: "may anh canon rất đẹp ",
    categoryCode: "MA_001",
    createdAt: new Date(),
  },
  {
    code: "G_001",
    name: "giay",
    price: 1000000,
    images: ["combo11.jpg"],
    searchString: "giay ,giay",
    sizes: ["L", "M", "S"],
    colors: ["white", "black"],
    active: true,
    description: "giay rất đẹp ",
    information: "giay rất đẹp ",
    categoryCode: "G_001",
    createdAt: new Date(),
  },
  {
    code: "NH_001",
    name: "Nuoc hoa",
    price: 1000000,
    images: ["combo12.jpg"],
    searchString: "nuoc hoa ,nuoc hoa",
    colors: ["blue", "yellow"],
    active: true,
    description: "nuoc hoa rất đẹp ",
    information: "nuoc hoa rất đẹp ",
    categoryCode: "NH_001",
    createdAt: new Date(),
  },
];

export default async function productSeeder() {
  try {
    // Xóa tất cả products cũ
    await ProductModel.deleteMany({});
    
    // Lấy danh sách categories
    const categories = await CategoryModel.find({});
    console.log('Found categories:', categories.map(c => c.code));
    
    let writeProduct = [];
    
    for (const product of data) {
      const { categoryCode, ...dataOther } = product;
      console.log(`Looking for category with code: ${categoryCode}`);
      
      const category = categories.find(categoryItem => categoryItem.code === categoryCode);
      
      if (!category) {
        console.log(`Warning: Category not found for product ${product.code} (category code: ${categoryCode})`);
        continue;
      }
      
      console.log(`Found category ${category.code} for product ${product.code}`);
      writeProduct.push({
        ...dataOther,
        categoryId: category._id
      });
    }

    if (writeProduct.length > 0) {
      await ProductModel.insertMany(writeProduct);
      console.log(`Successfully seeded ${writeProduct.length} products`);
    } else {
      console.log('No valid products to seed');
    }
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}
