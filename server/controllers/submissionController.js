import FormSubmission from "../models/FormSubmission.js";

export const getSubmissions = async (req, res) => {
  try {
    const { templateId, status } = req.query;
    const filter = {};
    if (templateId) filter.templateId = templateId;
    if (status) filter.status = status;
    const submissions = await FormSubmission.find(filter)
      .populate("templateId", "name slug")
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubmissionById = async (req, res) => {
  try {
    const submission = await FormSubmission.findById(req.params.id).populate("templateId");
    if (!submission) return res.status(404).json({ message: "Submission not found" });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSubmission = async (req, res) => {
  try {
    const { templateId, templateSlug, responses } = req.body;

    const files = (req.files || []).map((f) => ({
      fieldId: f.fieldname,
      originalName: f.originalname,
      fileName: f.filename,
      mimeType: f.mimetype,
      size: f.size,
      path: f.path,
    }));

    const submission = new FormSubmission({
      templateId,
      templateSlug,
      responses: typeof responses === "string" ? JSON.parse(responses) : responses,
      files,
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSubmissionStatus = async (req, res) => {
  try {
    const submission = await FormSubmission.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!submission) return res.status(404).json({ message: "Submission not found" });
    res.json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSubmission = async (req, res) => {
  try {
    const submission = await FormSubmission.findByIdAndDelete(req.params.id);
    if (!submission) return res.status(404).json({ message: "Submission not found" });
    res.json({ message: "Submission deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
