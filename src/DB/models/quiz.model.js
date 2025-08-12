import mongoose from "mongoose";

const { Schema } = mongoose;
/* Quiz Schema */
const quizSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    questions: [
      {
        questionText: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: Number, required: true },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
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

export const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);
