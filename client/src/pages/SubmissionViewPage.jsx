import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { submissionApi } from "../utils/api";
import { ArrowLeft, Download, FileText } from "lucide-react";

function renderValue(value) {
  if (value === null || value === undefined || value === "")
    return <span className="text-gray-400 italic">Not provided</span>;
  if (Array.isArray(value))
    return value.length > 0 ? value.join(", ") : <span className="text-gray-400 italic">None selected</span>;
  if (typeof value === "object") {
    return (
      <div className="space-y-0.5">
        {Object.entries(value).map(([k, v]) => (
          <div key={k}>
            <span className="text-gray-400 text-xs capitalize">{k}: </span>
            <span>{v || "—"}</span>
          </div>
        ))}
      </div>
    );
  }
  return String(value);
}

export default function SubmissionViewPage() {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    submissionApi
      .getById(id)
      .then((res) => setSubmission(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="p-8 text-center py-16 text-gray-500">Submission not found.</div>
    );
  }

  const template = submission.templateId;
  const sections = template?.sections || [];

  return (
    <div className="p-8">
      <Link
        to="/submissions"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Submissions
      </Link>

      <div className="bg-white rounded-xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {template?.name || "Submission"}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Submitted on{" "}
                {new Date(submission.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
              submission.status === "reviewed"
                ? "bg-green-50 text-green-700"
                : submission.status === "submitted"
                  ? "bg-blue-50 text-blue-700"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {submission.status}
          </span>
        </div>

        {/* Content */}
        <div className="p-6">
          {sections.map((section) => (
            <div key={section.id} className="mb-8 last:mb-0">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.fields
                  .filter((f) => f.type !== "heading" && f.type !== "divider")
                  .map((field) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2"
                    >
                      <dt className="text-sm text-gray-500">{field.label}</dt>
                      <dd className="text-sm text-gray-900 sm:col-span-2 font-medium">
                        {field.type === "file" ? (
                          <div className="space-y-1">
                            {(submission.files || [])
                              .filter((f) => f.fieldId === field.id)
                              .map((f, i) => (
                                <a
                                  key={i}
                                  href={`/uploads/${f.fileName}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-brand-600 hover:underline"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  {f.originalName}
                                </a>
                              ))}
                            {(submission.files || []).filter(
                              (f) => f.fieldId === field.id
                            ).length === 0 && (
                              <span className="text-gray-400 italic font-normal">
                                No files uploaded
                              </span>
                            )}
                          </div>
                        ) : (
                          renderValue(submission.responses[field.id])
                        )}
                      </dd>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
