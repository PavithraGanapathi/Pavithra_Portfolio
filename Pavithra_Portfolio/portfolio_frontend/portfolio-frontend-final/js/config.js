// Frontend ↔ Spring Boot configuration
// Your backend controllers use http://localhost:8080/api during local development.
const API_BASE = "http://localhost:8080/api";

const API = {
  login: `${API_BASE}/admin/login`,
  projects: `${API_BASE}/projects`,
  contacts: `${API_BASE}/contacts`,
};
