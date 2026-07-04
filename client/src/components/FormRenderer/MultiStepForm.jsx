import { useState, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, Send, Check } from "lucide-react";
import FieldRenderer from "./FieldRenderer";

export default function MultiStepForm({ template, onSubmit }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [fileMap, setFileMap] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const sections = template.sections || [];
  const section = sections[currentStep];
  const isLast = currentStep === sections.length - 1;
  const isFirst = currentStep === 0;

  const allFields = useMemo(() => {
    return sections.flatMap((s) => s.fields || []);
  }, [sections]);

  const getUnfilledRequired = useCallback(() => {
    return allFields.filter((f) => {
      if (!f.required) return false;
      const val = responses[f.id];
      if (f.type === "file") return !fileMap[f.id] || fileMap[f.id].length === 0;
      if (Array.isArray(val)) return val.length === 0;
      if (typeof val === "object" && val !== null) {
        return (f.subFields || []).some((sf) => !val[sf.id]);
      }
      return !val || val.trim() === "";
    });
  }, [allFields, responses, fileMap]);

  const handleChange = useCallback((fieldId, value) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
    setError(null);
  }, []);

  const handleFileChange = useCallback((fieldId, files) => {
    setFileMap((prev) => ({ ...prev, [fieldId]: files }));
    setError(null);
  }, []);

  const handleStepChange = (step) => {
    setCurrentStep(step);
    setError(null);
  };

  const handleSubmit = async () => {
    const missing = getUnfilledRequired();
    if (missing.length > 0) {
      const labels = missing.map((f) => f.label || f.id).slice(0, 3);
      const msg = `Please fill in required fields: ${labels.join(", ")}${missing.length > 3 ? ` and ${missing.length - 3} more` : ""}`;
      setError(msg);
      setSubmitting(false);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("templateId", template._id);
      formData.append("templateSlug", template.slug);
      formData.append("responses", JSON.stringify(responses));

      Object.entries(fileMap).forEach(([fieldId, files]) => {
        [...files].forEach((file) => {
          formData.append(fieldId, file);
        });
      });

      await onSubmit(formData);
      setSubmitted(true);
    } catch (error) {
      console.error("Submit error:", error);
      setError(error.response?.data?.message || "Failed to submit form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Your {template.name || "form"} has been submitted successfully. Our team will review your information and get back to you shortly.
        </p>
      </div>
    );
  }

  if (sections.length === 0 || !section) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p>This form has no sections configured yet.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => i < currentStep && handleStepChange(i)}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${i === currentStep
                  ? "text-brand-700"
                  : i < currentStep
                    ? "text-brand-500 cursor-pointer hover:text-brand-700"
                    : "text-gray-400"
                }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === currentStep
                    ? "bg-brand-600 text-white"
                    : i < currentStep
                      ? "bg-brand-100 text-brand-700"
                      : "bg-gray-200 text-gray-500"
                  }`}
              >
                {i < currentStep ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{s.title}</span>
            </button>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-brand-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / sections.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-1">{section.title}</h2>
        {section.description && <p className="text-sm text-gray-500">{section.description}</p>}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {(section.fields || []).map((field) => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={responses[field.id]}
            onChange={handleChange}
            files={fileMap[field.id]}
            onFileChange={handleFileChange}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => handleStepChange(currentStep - 1)}
          disabled={isFirst}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${isFirst
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
            <Send className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleStepChange(currentStep + 1)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
