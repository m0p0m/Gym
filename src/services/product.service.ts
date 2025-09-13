import httpStatus from 'http-status';
import Product, { IProduct } from '../models/product.model';
import { ApiError } from '../utils/ApiError';

// A helper interface for query options
interface IQueryOptions {
  limit?: number;
  page?: number;
  sortBy?: string;
}

class ProductService {
  /**
   * Create a product
   * @param {Partial<IProduct>} productBody
   * @returns {Promise<IProduct>}
   */
  public async createProduct(productBody: Partial<IProduct>): Promise<IProduct> {
    return Product.create(productBody);
  }

  /**
   * Query for products with pagination and filtering
   * @param {any} query - Express query object
   * @returns {Promise<any>}
   */
  public async queryProducts(query: any): Promise<any> {
    const filter: any = {};
    if (query.search) {
      filter.$text = { $search: query.search };
    }
    if (query.category) {
      filter.category = query.category;
    }
    if (query.brand) {
      filter.brand = query.brand;
    }
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) {
        filter.price.$gte = parseFloat(query.minPrice);
      }
      if (query.maxPrice) {
        filter.price.$lte = parseFloat(query.maxPrice);
      }
    }

    const limit = query.limit && parseInt(query.limit.toString(), 10) > 0 ? parseInt(query.limit.toString(), 10) : 10;
    const page = query.page && parseInt(query.page.toString(), 10) > 0 ? parseInt(query.page.toString(), 10) : 1;
    const sort = query.sortBy || 'createdAt:desc';

    const products = await Product.find(filter)
      .sort(sort.replace(':', ' '))
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Product.countDocuments(filter);

    return {
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  /**
   * Get product by id
   * @param {IProduct['_id']} id
   * @returns {Promise<IProduct>}
   */
  public async getProductById(id: IProduct['_id']): Promise<IProduct> {
    const product = await Product.findById(id);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    return product;
  }

  /**
   * Update product by id
   * @param {IProduct['_id']} productId
   * @param {Partial<IProduct>} updateBody
   * @returns {Promise<IProduct>}
   */
  public async updateProductById(productId: IProduct['_id'], updateBody: Partial<IProduct>): Promise<IProduct> {
    const product = await this.getProductById(productId);
    Object.assign(product, updateBody);
    await product.save();
    return product;
  }

  /**
   * Delete product by id
   * @param {IProduct['_id']} productId
   * @returns {Promise<void>}
   */
  public async deleteProductById(productId: IProduct['_id']): Promise<void> {
    const product = await this.getProductById(productId);
    await product.deleteOne();
  }
}

export default new ProductService();
