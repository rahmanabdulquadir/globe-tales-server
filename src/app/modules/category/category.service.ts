import QueryBuilder from "../../builder/QueryBuilder";
import { ICategory } from "./category.interface";
import Category from "./category.model";

const createCategory = async (payload: ICategory) => {
  const result = await Category.create(payload);
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
  createCategory,
  getCategoriesByName,
};
export default categoryService;