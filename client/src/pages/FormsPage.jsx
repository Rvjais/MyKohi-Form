import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { templateApi } from "../utils/api";
import {
  Plus,
  FileText,
  ExternalLink,
  Pencil,
  Trash2,
  Copy,
  Clock,
  CopyPlus,
} from "lucide-react";

export default function FormsPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    templateApi
      .getAll()
      .then((res) => setTemplates(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this flow?")) return;
    try {
      await templateApi.delete(id);
      setTemplates((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Cannot delete");
    }
  };

  const handleCopyLink = (slug) => {
    navigator.clipboard.writeText(`${window.location.origin}/form/${slug}`);
  };

  const handleDuplicate = async (t) => {
    try {
      const res = await templateApi.getById(t._id);
      const original = res.data;
      const newName = `${original.name} (Copy)`;
      const baseSlug = original.slug.replace(/-\d+$/, "");
      const newSlug = `${baseSlug}-${Date.now()}`;
      const { data: created } = await templateApi.create({
        name: newName,
        description: original.description,
        slug: newSlug,
        sections: original.sections,
      });
      setTemplates((prev) => [created, ...prev]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to duplicate");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flows</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your onboarding forms</p>
        </div>
        <Link
          to="/flows/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Flow
        </Link>
      </div>

      {templates.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-7 h-7 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium mb-1">No flows yet</p>
          <p className="text-sm text-gray-400 mb-4">Create your first onboarding flow</p>
          <Link
            to="/flows/new"
            className="px-5 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700"
          >
            Get Started
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-brand-600" />
                </div>
                {!t.isDefault && (
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="p-1.5 text-gray-300 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-gray-900">{t.name}</h3>
                {t.isDefault && (
                  <span className="text-[10px] bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded font-medium uppercase tracking-wide">
                    Default
                  </span>
                )}
              </div>

              {t.description && (
                <p className="text-xs text-gray-500 line-clamp-2 mb-4">{t.description}</p>
              )}

              <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
                <Clock className="w-3 h-3" />
                Updated {new Date(t.updatedAt || t.createdAt).toLocaleDateString()}
              </div>

              <div className="flex items-center gap-1.5 pt-3 border-t border-gray-100">
                <Link
                  to={`/flows/${t._id}/edit`}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </Link>
                <Link
                  to={`/form/${t.slug}`}
                  target="_blank"
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Preview
                </Link>
                <button
                  onClick={() => handleCopyLink(t.slug)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  Copy Link
                </button>
                <button
                  onClick={() => handleDuplicate(t)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <CopyPlus className="w-3 h-3" />
                  Duplicate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
