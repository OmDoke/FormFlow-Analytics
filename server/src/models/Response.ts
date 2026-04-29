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
