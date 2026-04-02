import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

export const templateApi = {
  getAll: () => api.get("/templates"),
  getBySlug: (slug) => api.get(`/templates/slug/${slug}`),
  getById: (id) => api.get(`/templates/${id}`),
  create: (data) => api.post("/templates", data),
  update: (id, data) => api.put(`/templates/${id}`, data),
  delete: (id) => api.delete(`/templates/${id}`),
};

export const submissionApi = {
  getAll: (params) => api.get("/submissions", { params }),
  getById: (id) => api.get(`/submissions/${id}`),
  create: (formData) =>
    api.post("/submissions", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateStatus: (id, status) => api.patch(`/submissions/${id}/status`, { status }),
  delete: (id) => api.delete(`/submissions/${id}`),
};

export default api;
