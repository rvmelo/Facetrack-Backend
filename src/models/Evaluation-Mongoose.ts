import mongoose from 'mongoose';

const { Schema, model } = mongoose;

interface IEvaluation {
  value: string;
  fromUserId: string;
  toUserId: string;
  created_at: Date;
  updated_at: Date;
}

const evaluationSchema = new Schema({
  value: {
    type: Number,
    required: true,
  },
  fromUserId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  toUserId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  created_at: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  updated_at: {
    type: Date,
    required: false,
  },
});

export default model<IEvaluation>('Evaluation', evaluationSchema);
