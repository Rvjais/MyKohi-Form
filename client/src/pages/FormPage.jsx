import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { templateApi, submissionApi } from "../utils/api";
import MultiStepForm from "../components/FormRenderer/MultiStepForm";
import { ClipboardList } from "lucide-react";

export default function FormPage() {
  const { slug } = useParams();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    templateApi
      .getBySlug(slug)
      .then((res) => setTemplate(res.data))
      .catch((err) => setError(err.response?.data?.message || "Form not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Form Not Found</h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-2.5">
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">MyKohi</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <div className="mb-8 pb-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
            {template.description && (
              <p className="text-sm text-gray-500 mt-1.5">{template.description}</p>
            )}
          </div>
          <MultiStepForm
            template={template}
            onSubmit={(formData) => submissionApi.create(formData)}
          />
        </div>
      </div>
    </div>
  );
}
