import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { submissionApi } from "../utils/api";
import { Eye, Trash2, FileText, Clock } from "lucide-react";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    submissionApi
      .getAll()
      .then((res) => setSubmissions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this submission?")) return;
    try {
      await submissionApi.delete(id);
      setSubmissions((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Failed to delete submission:", err);
      alert("Failed to delete");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await submissionApi.updateStatus(id, status);
      setSubmissions((prev) => prev.map((s) => (s._id === id ? { ...s, status } : s)));
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update");
    }
  };

  const filtered =
    statusFilter === "all" ? submissions : submissions.filter((s) => s.status === statusFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
        <p className="text-sm text-gray-500 mt-0.5">Review client onboarding responses</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
          {["all", "submitted", "reviewed", "draft"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                statusFilter === s
                  ? "bg-brand-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {s === "all" ? `All (${submissions.length})` : `${s} (${submissions.filter((x) => x.status === s).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No submissions found</p>
            <p className="text-sm text-gray-400 mt-1">Submissions will appear here when clients fill out your forms</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                  Form
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                  Date
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                  Status
                </th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((sub) => (
                <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-brand-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {sub.templateId?.name || sub.templateSlug || "Unknown Form"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(sub.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={sub.status}
                      onChange={(e) => handleStatusChange(sub._id, e.target.value)}
                      className={`text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer border-0 outline-none ${
                        sub.status === "submitted"
                          ? "bg-blue-50 text-blue-700"
                          : sub.status === "reviewed"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <option value="draft">Draft</option>
                      <option value="submitted">Submitted</option>
                      <option value="reviewed">Reviewed</option>
                    </select>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/submissions/${sub._id}`}
                        className="p-2 text-gray-400 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
