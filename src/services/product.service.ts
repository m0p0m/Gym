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
   * Query for products with pagination
   * @param {object} filter - Mongo filter
   * @param {IQueryOptions} options - Query options
   * @returns {Promise<any>}
   */
  public async queryProducts(filter: object, options: IQueryOptions): Promise<any> {
    const limit = options.limit && parseInt(options.limit.toString(), 10) > 0 ? parseInt(options.limit.toString(), 10) : 10;
    const page = options.page && parseInt(options.page.toString(), 10) > 0 ? parseInt(options.page.toString(), 10) : 1;
    const sort = options.sortBy || 'createdAt:desc';

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
