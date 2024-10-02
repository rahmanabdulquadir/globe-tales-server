import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { IAnyObject } from "../../interface/error";
import { ICategory } from "./category.interface";
import Category from "./category.model";

const createCategory = async (payload: ICategory) => {
  const result = await Category.create(payload);
  return result;
};

const getCategories = async (query: IAnyObject) => {
  const model = Category.find();

  const queryBuilder = new QueryBuilder(model, query)
    .search(["label"])
    .paginate()
    .sort();
  const result = await queryBuilder.modelQuery;

  return result;
};
const getCategoriesByName = async (name: string) => {
  const model = Category.find();

  const queryBuilder = new QueryBuilder(model, { searchTerm: name }).search([
    "label",
  ]);
  const result = await queryBuilder.modelQuery;

  return result;
};

const deleteCategory = async (id: string) => {
  const isExists = await Category.findById(id);
  if (!isExists) {
    throw new AppError(404, "Category not found");
  }
  const result = await Category.findByIdAndDelete(isExists._id);
  return result;
};

const categoryService = {
  createCategory,
  getCategories,
  getCategoriesByName,
  deleteCategory,
};
export default categoryService;