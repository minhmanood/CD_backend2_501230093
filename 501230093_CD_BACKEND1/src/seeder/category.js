import CategoryModel from "../models/categoryModel.js";
const data = [
  {
    code: "A_001",
    name: "Ao ",
    image: "combo9.jpg",
    searchString: "ao nu",
    createdAt: new Date(),
  },
  {
    code: "MA_001",
    name: "may anh",
    image: "combo10.jpg",
    searchString: "may anh",
    createdAt: new Date(),
  },
  {
    code: "G_001",
    name: "giay ",
    image: "combo11.jpg",
    searchString: "giay nam",
    createdAt: new Date(),
  },
  {
    code: "NH_001",
    name: "nuoc hoa",
    image: "combo12.jpg",
    searchString: "nuoc hoa",
    createdAt: new Date(),
  },
];

export default async function categorySeeder() {
  try {
    await CategoryModel.deleteMany();
    await CategoryModel.insertMany(data);
    console.log('Categories seeded successfully');
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
}
