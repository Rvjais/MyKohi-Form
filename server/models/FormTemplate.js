import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: [
        "text",
        "email",
        "phone",
        "textarea",
        "select",
        "checkbox",
        "radio",
        "file",
        "address",
        "fullname",
        "heading",
        "divider",
      ],
    },
    label: { type: String, required: true },
    placeholder: String,
    required: { type: Boolean, default: false },
    options: [String],
    allowOther: { type: Boolean, default: false },
    description: String,
    subFields: [
      {
        id: String,
        label: String,
        placeholder: String,
        type: { type: String, default: "text" },
        _id: false,
      },
    ],
  },
  { _id: false }
);

const sectionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    fields: [fieldSchema],
  },
  { _id: false }
);

const formTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    slug: { type: String, unique: true, required: true },
    isDefault: { type: Boolean, default: false },
    sections: [sectionSchema],
    createdBy: String,
  },
  { timestamps: true }
);

export default mongoose.model("FormTemplate", formTemplateSchema);
