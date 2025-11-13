export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class Validator {
  private errors: string[] = [];

  /**
   * Validate that a field is required
   */
  required(value: any, fieldName: string): this {
    if (!value && value !== 0) {
      this.errors.push(`${fieldName} is required`);
    }
    return this;
  }

  /**
   * Validate that a number is positive
   */
  isPositiveNumber(value: any, fieldName: string): this {
    if (typeof value !== 'number' || value <= 0) {
      this.errors.push(`${fieldName} must be a positive number`);
    }
    return this;
  }

  /**
   * Validate that a value is a number
   */
  isNumber(value: any, fieldName: string): this {
    if (typeof value !== 'number') {
      this.errors.push(`${fieldName} must be a number`);
    }
    return this;
  }

  /**
   * Validate that a value is a string
   */
  isString(value: any, fieldName: string): this {
    if (typeof value !== 'string') {
      this.errors.push(`${fieldName} must be a string`);
    }
    return this;
  }

  /**
   * Get validation result
   */
  getResult(): ValidationResult {
    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
    };
  }

  /**
   * Static factory method
   */
  static create(): Validator {
    return new Validator();
  }
}

/**
 * Validate add to cart input
 */
export function validateAddToCartInput(data: any): ValidationResult {
  return Validator.create()
    .required(data.cartId, 'Cart ID')
    .required(data.productId, 'Product ID')
    .required(data.quantity, 'Quantity')
    .isPositiveNumber(data.quantity, 'Quantity')
    .getResult();
}

/**
 * Validate update cart item input
 */
export function validateUpdateCartItemInput(data: any): ValidationResult {
  return Validator.create()
    .required(data.quantity, 'Quantity')
    .isPositiveNumber(data.quantity, 'Quantity')
    .getResult();
}

/**
 * Validate create product input
 */
export function validateCreateProductInput(data: any): ValidationResult {
  const validator = Validator.create()
    .required(data.name, 'Product name')
    .required(data.description, 'Product description')
    .required(data.price, 'Product price')
    .required(data.category, 'Product category')
    .required(data.inventory, 'Product inventory');

  // Validate price is a non-negative number
  if (data.price !== undefined && (typeof data.price !== 'number' || data.price < 0)) {
    validator['errors'].push('Price must be a positive number');
  }

  // Validate inventory is a non-negative number
  if (data.inventory !== undefined && (typeof data.inventory !== 'number' || data.inventory < 0)) {
    validator['errors'].push('Inventory must be a positive number');
  }

  return validator.getResult();
}

/**
 * Validate update product input
 */
export function validateUpdateProductInput(data: any): ValidationResult {
  const validator = Validator.create();

  // Only validate fields that are provided
  if (data.name !== undefined && !data.name) {
    validator['errors'].push('Product name cannot be empty');
  }

  if (data.description !== undefined && !data.description) {
    validator['errors'].push('Product description cannot be empty');
  }

  if (data.price !== undefined && (typeof data.price !== 'number' || data.price < 0)) {
    validator['errors'].push('Price must be a positive number');
  }

  if (data.category !== undefined && !data.category) {
    validator['errors'].push('Product category cannot be empty');
  }

  if (data.inventory !== undefined && (typeof data.inventory !== 'number' || data.inventory < 0)) {
    validator['errors'].push('Inventory must be a positive number');
  }

  return validator.getResult();
}
