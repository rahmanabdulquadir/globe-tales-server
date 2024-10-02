import { catchAsyncError } from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import categoryService from "./category.service";

const createCategory = catchAsyncError(async (req, res) => {
  const result = await categoryService.createCategory(req.body);
  sendResponse(res, {
    message: "category created successfully",
    success: true,
    data: result,
    statusCode: 200,
  });
});

const getCategories = catchAsyncError(async (req, res) => {
  const result = await categoryService.getCategories(req.query);
  sendResponse(res, {
    message: "category retrieved successfully",
    success: true,
    data: result,
    statusCode: 200,
  });
});
const getCategoriesByName = catchAsyncError(async (req, res) => {
  const label = req.params.label;
  const result = await categoryService.getCategoriesByName(label);
  sendResponse(res, {
    message: "category retrieved successfully",
    success: true,
    data: result,
    statusCode: 200,
  });
});

const deleteCategory = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const result = await categoryService.deleteCategory(id);
  sendResponse(res, {
    message: "category deleted successfully",
    success: true,
    data: result,
    statusCode: 200,
  });
});

export const categoryController = {
  createCategory,
  getCategoriesByName,
  getCategories,
  deleteCategory,
};