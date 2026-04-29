/**
 * README: Response Model
 * This file defines the schema and model for Form Responses.
 * A response stores answers submitted by users for a specific form.
 * Answers are stored as a map where keys are field IDs.
 */

import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IResponse extends Document {
  formId: Types.ObjectId;
  answers: Map<string, string | number>;
  submittedAt: Date;
}

const ResponseSchema = new Schema<IResponse>({
  formId: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
  answers: {
    type: Map,
    of: Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: { createdAt: 'submittedAt', updatedAt: false }
});

export default mongoose.model<IResponse>('Response', ResponseSchema);
