import { Schema, model, Document } from 'mongoose';
import { IPermission } from './permission.model';

export interface IRole extends Document {
  name: string;
  description: string;
  permissions: IPermission['_id'][];
}

const RoleSchema = new Schema<IRole>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  permissions: [{
    type: Schema.Types.ObjectId,
    ref: 'Permission',
  }],
}, { timestamps: true });

const Role = model<IRole>('Role', RoleSchema);

export default Role;
