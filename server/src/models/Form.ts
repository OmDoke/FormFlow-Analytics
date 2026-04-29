import mongoose, { Schema, Document } from 'mongoose';

export interface IField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select';
  required: boolean;
  options?: string[];
}

export interface IForm extends Document {
  title: string;
  description?: string;
  fields: IField[];
  shareableId: string;
  createdAt: Date;
  updatedAt: Date;
}

const FieldSchema = new Schema<IField>({
  id: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, enum: ['text', 'number', 'select'], required: true },
  required: { type: Boolean, default: false },
  options: { type: [String], required: false }
}, { _id: false });

const FormSchema = new Schema<IForm>({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  fields: [FieldSchema],
  shareableId: { type: String, required: true, unique: true }
}, {
  timestamps: true
});

export default mongoose.model<IForm>('Form', FormSchema);
