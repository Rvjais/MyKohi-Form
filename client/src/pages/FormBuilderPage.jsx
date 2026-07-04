import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { templateApi } from "../utils/api";
import {
  Plus,
  Trash2,
  GripVertical,
  Save,
  ArrowLeft,
  Type,
  Mail,
  Phone,
  AlignLeft,
  ChevronDown,
  CheckSquare,
  CircleDot,
  Upload,
  MapPin,
  User,
  Eye,
} from "lucide-react";

const FIELD_TYPES = [
  { type: "text", label: "Text", icon: Type },
  { type: "email", label: "Email", icon: Mail },
  { type: "phone", label: "Phone", icon: Phone },
  { type: "textarea", label: "Long Text", icon: AlignLeft },
  { type: "select", label: "Dropdown", icon: ChevronDown },
  { type: "checkbox", label: "Checkboxes", icon: CheckSquare },
  { type: "radio", label: "Radio", icon: CircleDot },
  { type: "file", label: "File Upload", icon: Upload },
  { type: "address", label: "Address", icon: MapPin },
  { type: "fullname", label: "Full Name", icon: User },
];

let idCounter = 0;

function generateId(prefix = "field") {
  return `${prefix}_${Date.now()}_${++idCounter}`;
}

function createField(type) {
  const base = { id: generateId("field"), type, label: "", required: false };
  if (type === "select" || type === "checkbox" || type === "radio") {
    base.options = ["Option 1"];
    if (type === "checkbox") base.allowOther = false;
  }
  if (type === "fullname") {
    base.subFields = [
      { id: "firstName", label: "First Name", placeholder: "First Name" },
      { id: "lastName", label: "Last Name", placeholder: "Last Name" },
    ];
  }
  if (type === "address") {
    base.subFields = [
      { id: "street1", label: "Street Address", placeholder: "Street Address" },
      { id: "street2", label: "Street Address Line 2", placeholder: "Apt, Suite, etc." },
      { id: "city", label: "City", placeholder: "City" },
      { id: "state", label: "State / Province", placeholder: "State" },
      { id: "zip", label: "Postal / Zip Code", placeholder: "Zip Code" },
    ];
  }
  return base;
}

function FieldEditor({ field, onChange, onRemove }) {
  const hasOptions = ["select", "checkbox", "radio"].includes(field.type);
  const typeInfo = FIELD_TYPES.find((t) => t.type === field.type);
  const Icon = typeInfo?.icon || Type;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 group hover:border-gray-300 transition-colors">
      <div className="flex items-start gap-3">
        <div className="pt-1.5 text-gray-300 cursor-grab hover:text-gray-400">
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Field label"
              value={field.label}
              onChange={(e) => onChange({ ...field, label: e.target.value })}
              className="flex-1 text-sm font-medium border-0 border-b border-transparent focus:border-brand-500 outline-none py-1 bg-transparent placeholder:text-gray-300"
            />
            <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
              <Icon className="w-3 h-3" />
              <span className="capitalize">{field.type}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Placeholder text"
              value={field.placeholder || ""}
              onChange={(e) => onChange({ ...field, placeholder: e.target.value })}
              className="text-xs text-gray-500 border border-gray-200 rounded-md px-2.5 py-1.5 flex-1 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
            <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer whitespace-nowrap select-none">
              <input
                type="checkbox"
                checked={field.required || false}
                onChange={(e) => onChange({ ...field, required: e.target.checked })}
                className="rounded border-gray-300 text-brand-600 w-3.5 h-3.5 focus:ring-brand-500"
              />
              Required
            </label>
          </div>

          <input
            type="text"
            placeholder="Help text (optional)"
            value={field.description || ""}
            onChange={(e) => onChange({ ...field, description: e.target.value })}
            className="text-xs text-gray-500 border border-gray-200 rounded-md px-2.5 py-1.5 w-full focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none"
          />

          {hasOptions && (
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-medium text-gray-500">Options:</span>
              {(field.options || []).map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const opts = [...field.options];
                      opts[i] = e.target.value;
                      onChange({ ...field, options: opts });
                    }}
                    className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 flex-1 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  />
                  <button
                    onClick={() =>
                      onChange({
                        ...field,
                        options: field.options.filter((_, idx) => idx !== i),
                      })
                    }
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  onChange({ ...field, options: [...(field.options || []), ""] })
                }
                className="text-xs text-brand-600 hover:text-brand-700 font-medium"
              >
                + Add option
              </button>
            </div>
          )}
        </div>
        <button
          onClick={onRemove}
          className="p-1.5 text-gray-300 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function FormBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [sections, setSections] = useState([
    { id: "section_1", title: "Section 1", description: "", fields: [] },
  ]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;
    templateApi
      .getById(id)
      .then((res) => {
        const t = res.data;
        setName(t.name);
        setDescription(t.description || "");
        setSlug(t.slug);
        setSections(t.sections || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const sanitizeSlug = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleSave = async () => {
    if (!name || !slug) {
      alert("Name and slug are required");
      return;
    }

    const cleanSlug = sanitizeSlug(slug);
    if (!cleanSlug) {
      alert("Slug must contain at least one valid character (a-z, 0-9, hyphens)");
      return;
    }

    if (slug !== cleanSlug) {
      setSlug(cleanSlug);
    }

    const invalidFields = sections.some((s) =>
      (s.fields || []).some((f) => !f.label || f.label.trim() === "")
    );
    if (invalidFields) {
      alert("All fields must have a label");
      return;
    }

    setSaving(true);
    try {
      const data = { name, description, slug: cleanSlug, sections };
      if (id) {
        await templateApi.update(id, data);
      } else {
        await templateApi.create(data);
      }
      navigate("/flows");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    const num = sections.length + 1;
    setSections([
      ...sections,
      { id: generateId("section"), title: `Section ${num}`, description: "", fields: [] },
    ]);
  };

  const updateSection = (idx, updates) => {
    setSections(sections.map((s, i) => (i === idx ? { ...s, ...updates } : s)));
  };

  const removeSection = (idx) => {
    if (sections.length <= 1) return;
    setSections(sections.filter((_, i) => i !== idx));
  };

  const addField = (sectionIdx, type) => {
    const updated = [...sections];
    updated[sectionIdx].fields.push(createField(type));
    setSections(updated);
  };

  const updateField = (sectionIdx, fieldIdx, field) => {
    const updated = [...sections];
    updated[sectionIdx].fields[fieldIdx] = field;
    setSections(updated);
  };

  const removeField = (sectionIdx, fieldIdx) => {
    const updated = [...sections];
    updated[sectionIdx].fields.splice(fieldIdx, 1);
    setSections(updated);
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
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/flows")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Flows
        </button>
        <div className="flex items-center gap-2">
          {slug && (
            <a
              href={`/form/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Preview
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Flow"}
          </button>
        </div>
      </div>

      {/* Template meta */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
          Flow Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!id)
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)/g, "")
                  );
              }}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              placeholder="Client Onboarding Form"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Slug (URL path)
            </label>
            <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500">
              <span className="px-3 py-2 bg-gray-50 text-xs text-gray-400 border-r border-gray-200">
                /form/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 px-3 py-2 text-sm outline-none"
                placeholder="client-onboarding"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none min-h-[60px] resize-y"
              placeholder="Brief description of this form..."
            />
          </div>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section, sIdx) => (
        <div
          key={section.id}
          className="bg-white rounded-xl border border-gray-200 p-6 mb-4"
        >
          <div className="flex items-start justify-between mb-5">
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateSection(sIdx, { title: e.target.value })}
                className="text-base font-semibold bg-transparent border-0 border-b-2 border-transparent focus:border-brand-500 outline-none w-full text-gray-900 placeholder:text-gray-300"
                placeholder="Section Title"
              />
              <input
                type="text"
                value={section.description || ""}
                onChange={(e) =>
                  updateSection(sIdx, { description: e.target.value })
                }
                className="text-sm text-gray-500 bg-transparent border-0 border-b border-transparent focus:border-gray-300 outline-none w-full placeholder:text-gray-300"
                placeholder="Section description (optional)"
              />
            </div>
            {sections.length > 1 && (
              <button
                onClick={() => removeSection(sIdx)}
                className="p-1.5 text-gray-300 hover:text-red-500 ml-4 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-3 mb-5">
            {section.fields.map((field, fIdx) => (
              <FieldEditor
                key={field.id}
                field={field}
                onChange={(f) => updateField(sIdx, fIdx, f)}
                onRemove={() => removeField(sIdx, fIdx)}
              />
            ))}
            {section.fields.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <p className="text-sm text-gray-400">
                  Add fields using the buttons below
                </p>
              </div>
            )}
          </div>

          {/* Add field buttons */}
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              Add Field
            </p>
            <div className="flex flex-wrap gap-1.5">
              {FIELD_TYPES.map((ft) => {
                const Icon = ft.icon;
                return (
                  <button
                    key={ft.type}
                    onClick={() => addField(sIdx, ft.type)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50 transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {ft.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addSection}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50/50 transition-colors flex items-center justify-center gap-1.5"
      >
        <Plus className="w-4 h-4" />
        Add Section
      </button>
    </div>
  );
}
