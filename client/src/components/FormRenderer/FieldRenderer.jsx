import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

export default function FieldRenderer({ field, value, onChange, files, onFileChange }) {
  const baseInput =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow";
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  switch (field.type) {
    case "heading":
      return (
        <div className="pt-2 pb-1">
          <h3 className="text-lg font-semibold text-gray-800">{field.label}</h3>
          {field.description && <p className="text-sm text-gray-500 mt-1">{field.description}</p>}
        </div>
      );

    case "divider":
      return <hr className="border-gray-200 my-4" />;

    case "text":
    case "email":
    case "phone":
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {field.label}
            {field.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          {field.description && <p className="text-xs text-gray-500 mb-1.5">{field.description}</p>}
          <input
            type={field.type === "phone" ? "tel" : field.type}
            className={baseInput}
            placeholder={field.placeholder || ""}
            value={value || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            required={field.required}
          />
        </div>
      );

    case "textarea":
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {field.label}
            {field.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          {field.description && <p className="text-xs text-gray-500 mb-1.5">{field.description}</p>}
          <textarea
            className={`${baseInput} min-h-[100px] resize-y`}
            placeholder={field.placeholder || ""}
            value={value || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            required={field.required}
          />
        </div>
      );

    case "select":
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {field.label}
            {field.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          <select
            className={baseInput}
            value={value || ""}
            onChange={(e) => onChange(field.id, e.target.value)}
            required={field.required}
          >
            <option value="">Please Select</option>
            {(field.options || []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );

    case "checkbox":
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          <div className="space-y-2">
            {(field.options || []).map((opt) => {
              const checked = Array.isArray(value) && value.includes(opt);
              return (
                <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    checked={checked}
                    onChange={() => {
                      const current = Array.isArray(value) ? [...value] : [];
                      if (checked) {
                        onChange(field.id, current.filter((v) => v !== opt));
                      } else {
                        onChange(field.id, [...current, opt]);
                      }
                    }}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{opt}</span>
                </label>
              );
            })}
          </div>
        </div>
      );

    case "radio":
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          <div className="space-y-2">
            {(field.options || []).map((opt) => (
              <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name={field.id}
                  className="w-4 h-4 border-gray-300 text-brand-600 focus:ring-brand-500"
                  checked={value === opt}
                  onChange={() => onChange(field.id, opt)}
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      );

    case "fullname":
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {field.label}
            {field.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(field.subFields || []).map((sub) => (
              <div key={sub.id}>
                <input
                  type="text"
                  className={baseInput}
                  placeholder={sub.placeholder || sub.label}
                  value={(value && value[sub.id]) || ""}
                  onChange={(e) => onChange(field.id, { ...(value || {}), [sub.id]: e.target.value })}
                />
                <span className="text-xs text-gray-400 mt-0.5 block">{sub.label}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "address":
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {field.label}
            {field.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          <div className="space-y-3">
            {(field.subFields || []).map((sub) => (
              <div key={sub.id}>
                <input
                  type="text"
                  className={baseInput}
                  placeholder={sub.placeholder || sub.label}
                  value={(value && value[sub.id]) || ""}
                  onChange={(e) => onChange(field.id, { ...(value || {}), [sub.id]: e.target.value })}
                />
                <span className="text-xs text-gray-400 mt-0.5 block">{sub.label}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "file": {
      const selectedFiles = files || [];

      const handleFileSelect = (e) => {
        onFileChange(field.id, Array.from(e.target.files));
        e.target.value = "";
      };

      const MAX_SIZE = 50 * 1024 * 1024;
      const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        const oversized = droppedFiles.filter((f) => f.size > MAX_SIZE);
        if (oversized.length > 0) {
          alert(`Files over 50MB are not allowed: ${oversized.map((f) => f.name).join(", ")}`);
          return;
        }
        onFileChange(field.id, droppedFiles);
      };

      const handleClick = () => {
        const input = fileInputRef.current;
        if (input) {
          input.value = "";
          input.click();
        }
      };

      const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
      };

      const handleDragLeave = () => setIsDragOver(false);

      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {field.label}
            {field.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          {field.description && <p className="text-xs text-gray-500 mb-1.5">{field.description}</p>}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
              isDragOver
                ? "border-brand-500 bg-brand-50"
                : "border-gray-300 hover:border-brand-400"
            }`}
            onClick={handleClick}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              {isDragOver ? "Drop files here" : "Drag and drop files here, or click to browse"}
            </p>
            <button
              type="button"
              className="inline-block mt-2 px-4 py-1.5 bg-brand-50 text-brand-700 text-sm font-medium rounded-md hover:bg-brand-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              Browse Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
          {selectedFiles.length > 0 && (
            <div className="mt-2 space-y-1">
              {selectedFiles.map((f, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded px-3 py-1.5 text-sm">
                  <span className="text-gray-700 truncate">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = selectedFiles.filter((_, idx) => idx !== i);
                      onFileChange(field.id, updated);
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    default:
      return null;
  }
}
