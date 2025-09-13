import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  images: string[];
  brand?: string;
  category: string;
  isAvailable: boolean;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true, index: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  stockQuantity: { type: Number, required: true, min: 0, default: 0 },
  images: { type: [String], default: [] },
  brand: { type: String, trim: true },
  category: { type: String, required: true, trim: true, index: true },
  isAvailable: { type: Boolean, default: true, index: true },
}, { timestamps: true });

ProductSchema.index({ name: 'text', description: 'text' });

const Product = model<IProduct>('Product', ProductSchema);

export default Product;
