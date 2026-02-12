import mongoose, { Schema, Document } from "mongoose";

export interface MessageDocument extends Document {
  conversationId: mongoose.Types.ObjectId;
  sender: "admin" | "user";
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<MessageDocument>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    sender: {
      type: String,
      enum: ["admin", "user"],
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

messageSchema.index({ conversationId: 1, createdAt: 1 });

export const MessageModel = mongoose.model<MessageDocument>(
  "Message",
  messageSchema
);
