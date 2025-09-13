import { Schema, model, Document } from 'mongoose';

export interface IPermission extends Document {
  name: string;
  description: string;
}

const PermissionSchema = new Schema<IPermission>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Permission = model<IPermission>('Permission', PermissionSchema);

export default Permission;
