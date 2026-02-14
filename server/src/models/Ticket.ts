import mongoose, { Schema, Document } from 'mongoose';
import { ITicket, TicketStatus, TicketPriority, TicketType } from 'shared/types';

interface ITicketDocument extends Omit<ITicket, '_id'>, Document {}

const ticketSchema = new Schema(
  {
    orgId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    type: {
      type: String,
      enum: Object.values(TicketType),
      default: TicketType.BUG,
    },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.OPEN,
    },
    priority: {
      type: String,
      enum: Object.values(TicketPriority),
      default: TicketPriority.MEDIUM,
    },
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assigneeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
ticketSchema.index({ orgId: 1, projectId: 1 });
ticketSchema.index({ orgId: 1, status: 1 });
ticketSchema.index({ assigneeId: 1 });

export const Ticket = mongoose.model<ITicketDocument>('Ticket', ticketSchema);
