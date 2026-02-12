import mongoose, { Schema, Document } from "mongoose";

export interface ConversationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<ConversationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const ConversationModel = mongoose.model(
  "Conversation",
  conversationSchema
);
