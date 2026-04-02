import mongoose from "mongoose";

const formSubmissionSchema = new mongoose.Schema(
  {
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormTemplate",
      required: true,
    },
    templateSlug: String,
    responses: { type: mongoose.Schema.Types.Mixed, required: true, default: {} },
    files: [
      {
        fieldId: String,
        originalName: String,
        fileName: String,
        mimeType: String,
        size: Number,
        path: String,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "submitted", "reviewed"],
      default: "submitted",
    },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("FormSubmission", formSubmissionSchema);
