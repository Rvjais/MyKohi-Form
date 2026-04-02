import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { templateApi, submissionApi } from "../utils/api";
import {
  FileText,
  Users,
  FilePlus2,
  Plus,
  ArrowRight,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function Dashboard() {
  const [templates, setTemplates] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([templateApi.getAll(), submissionApi.getAll()])
      .then(([tRes, sRes]) => {
        setTemplates(tRes.data);
        setSubmissions(sRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeFlows = templates.length;
  const totalSubmissions = submissions.length;
  const draftSubmissions = submissions.filter((s) => s.status === "draft").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back to your workspace</p>
        </div>
        <Link
          to="/flows/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Flow
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={FileText}
          iconBg="bg-brand-50"
          iconColor="text-brand-600"
          label="Active Flows"
          value={activeFlows}
        />
        <StatCard
          icon={Users}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          label="Submissions"
          value={totalSubmissions}
        />
        <StatCard
          icon={FilePlus2}
          iconBg="bg-pink-50"
          iconColor="text-pink-600"
          label="Draft Submissions"
          value={draftSubmissions}
        />
      </div>

      {/* Recent Flows */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Recent Flows</h2>
          {templates.length > 0 && (
            <Link to="/flows" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
              View All
            </Link>
          )}
        </div>

        {templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-1">Create your first flow</p>
            <p className="text-sm text-gray-400 mb-4">Start onboarding clients with custom forms</p>
            <Link
              to="/flows/new"
              className="px-5 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {templates.slice(0, 5).map((t) => (
              <div key={t._id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-brand-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{t.name}</span>
                      {t.isDefault && (
                        <span className="text-[10px] bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded font-medium uppercase tracking-wide">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {new Date(t.updatedAt || t.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/form/${t.slug}`}
                    target="_blank"
                    className="p-2 text-gray-400 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors"
                    title="Open form"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/flows/${t._id}/edit`}
                    className="p-2 text-gray-400 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-colors"
                    title="Edit"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, iconBg, iconColor, label, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <p className="text-sm text-gray-500 mb-0.5">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
