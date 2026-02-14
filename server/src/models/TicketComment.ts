import mongoose, { Schema, Document } from 'mongoose';
import { ITicketComment } from 'shared/types';

interface ITicketCommentDocument extends Omit<ITicketComment, '_id'>, Document {}

const ticketCommentSchema = new Schema(
  {
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    body: {
      type: String,
      required: [true, 'Comment body is required'],
    },
    mentions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for finding comments by ticket
ticketCommentSchema.index({ ticketId: 1, createdAt: -1 });

export const TicketComment = mongoose.model<ITicketCommentDocument>(
  'TicketComment',
  ticketCommentSchema
);
