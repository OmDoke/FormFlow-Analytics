/**
 * README: Form Model
 * This file defines the schema and model for Forms.
 * A form consists of multiple fields, each with a specific type and validation rules.
 * It also includes a unique shareableId for public access.
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IField {
  id: string;           // uuid
  label: string;
  type: 'text' | 'number' | 'select';
  required: boolean;
  options?: string[];   // only for select type
}

export interface IForm extends Document {
  title: string;
  description?: string;
  fields: IField[];
  shareableId: string;  // uuid, unique, used in public URL
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
