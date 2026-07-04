import FormTemplate from "../models/FormTemplate.js";

export const getTemplates = async (req, res) => {
  try {
    const templates = await FormTemplate.find().select("-sections").sort({ isDefault: -1, createdAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTemplateBySlug = async (req, res) => {
  try {
    const template = await FormTemplate.findOne({ slug: req.params.slug });
    if (!template) return res.status(404).json({ message: "Template not found" });
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTemplateById = async (req, res) => {
  try {
    const template = await FormTemplate.findById(req.params.id);
    if (!template) return res.status(404).json({ message: "Template not found" });
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTemplate = async (req, res) => {
  try {
    const template = new FormTemplate(req.body);
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const ALLOWED_FIELDS = ["name", "description", "slug", "sections"];

export const updateTemplate = async (req, res) => {
  try {
    const updates = {};
    for (const key of ALLOWED_FIELDS) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const template = await FormTemplate.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!template) return res.status(404).json({ message: "Template not found" });
    res.json(template);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    const template = await FormTemplate.findOneAndDelete({
      _id: req.params.id,
      isDefault: { $ne: true },
    });
    if (!template) {
      const existing = await FormTemplate.findById(req.params.id);
      if (!existing) return res.status(404).json({ message: "Template not found" });
      return res.status(400).json({ message: "Cannot delete default template" });
    }
    res.json({ message: "Template deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
