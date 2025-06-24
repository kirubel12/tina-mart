import { Category } from "../models/Category.model.js";
import slugify from "slugify";


export const getCategories = async (req, res) => {
  const categories = await Category.find()

  if (!categories || categories.length === 0) {
    return res
      .status(404)
      .json({status: "error", message: "No categories found", categories: [] });
  }

  return res
    .status(200)
    .json({
      message: "Categories retrieved successfully",
      status: "success",
      categories: categories,
    });
};


export const createCategory = async (req, res) => {
    try {
        const category = new Category({
            ...req.body,
            user: req.user._id
        })
        await category.save()
        return res.status(201).json({
            status: "success",
            message: "Category created successfully",
            category: category
        })
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "An error occurred while creating the category",
            error: error.message
        });
    }
}


export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // If name is being updated, update slug as well
        if (req.body.name) {
            req.body.slug = slugify(req.body.name, { lower: true, strict: true });
        }
        const category = await Category.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        if (!category) {
            return res.status(404).json({
                status: "error",
                message: "Category not found"
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Category updated successfully",
            category: category
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "An error occurred while updating the category",
            error: error.message
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({
                status: "error",
                message: "Category not found"
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Category deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "An error occurred while deleting the category",
            error: error.message
        });
    }
};


export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                status: "error",
                message: "Category not found"
            });
        }
        return res.status(200).json({
            status: "success",
            message: "Category retrieved successfully",
            category: category
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "An error occurred while retrieving the category",
            error: error.message
        });
    }
};

