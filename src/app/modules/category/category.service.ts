import QueryBuilder from "../../builder/QueryBuilder";
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

const categoryService = {
  createCategory,getCategories,
  getCategoriesByName,
};
export default categoryService;