/* global API */

const SESSION_KEY = "portfolio_admin_username";

const loginView = document.getElementById("loginView");
const dashboardView = document.getElementById("dashboardView");
const loginError = document.getElementById("loginError");

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

function safeUrl(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new Error("BACKEND_UNREACHABLE");
  }

  const text = await response.text();
  let data = text;
  try { data = text ? JSON.parse(text) : null; } catch { /* backend login returns text */ }

  if (!response.ok) {
    const detail = typeof data === "string" ? data : data?.message;
    throw new Error(detail || `HTTP_${response.status}`);
  }
  return data;
}

function showDashboard(username) {
  loginView.style.display = "none";
  dashboardView.style.display = "block";
  document.getElementById("loggedInAs").textContent = `Logged in as ${username}`;
  loadProjectsForAdmin();
  loadContacts();
}

function showLogin() {
  loginView.style.display = "block";
  dashboardView.style.display = "none";
}

function loginSucceeded(result) {
  // AdminController returns String from /api/admin/login.
  // Accept the common success messages without depending on one exact phrase.
  const text = String(result ?? "").toLowerCase();
  return ["logged in", "login successful", "login success", "success", "welcome"].some(x => text.includes(x));
}

async function handleLogin(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const button = form.querySelector("button[type='submit']");
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  loginError.textContent = "";

  if (!username || !password) return;
  if (button) button.disabled = true;
  button && (button.textContent = "Logging in…");

  try {
    const result = await request(API.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!loginSucceeded(result)) {
      loginError.textContent = "Incorrect username or password.";
      return;
    }

    sessionStorage.setItem(SESSION_KEY, username);
    showDashboard(username);
  } catch (error) {
    loginError.textContent = error.message === "BACKEND_UNREACHABLE"
      ? "Couldn't reach the backend. Start Spring Boot on port 8080."
      : `Login failed (${error.message}).`;
    console.error("Login error:", error);
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "Log in";
    }
  }
}

async function loadProjectsForAdmin() {
  const list = document.getElementById("projectList");
  list.innerHTML = `<li>Loading…</li>`;

  try {
    const data = await request(API.projects);
    const projects = Array.isArray(data) ? data : [];

    if (!projects.length) {
      list.innerHTML = `<li>No projects yet — add one above.</li>`;
      return;
    }

    list.innerHTML = projects.map(project => `
      <li>
        <div>
          <p class="item-title">${escapeHtml(project.title)}</p>
          <p class="item-meta">${escapeHtml(project.techStack || "")}</p>
        </div>
        <button type="button" class="btn btn-danger" data-id="${Number(project.id) || 0}">Delete</button>
      </li>`).join("");

    list.querySelectorAll(".btn-danger").forEach(button => {
      button.addEventListener("click", () => deleteProject(button.dataset.id));
    });
  } catch (error) {
    list.innerHTML = `<li>Couldn't load projects. ${escapeHtml(error.message)}</li>`;
    console.error("Admin project loading error:", error);
  }
}

async function addProject(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const button = form.querySelector("button[type='submit']");
  const status = document.getElementById("projectFormStatus");
  const payload = {
    title: document.getElementById("p-title").value.trim(),
    description: document.getElementById("p-description").value.trim(),
    techStack: document.getElementById("p-tech").value.trim(),
    githubLink: document.getElementById("p-github").value.trim(),
    imageUrl: document.getElementById("p-image").value.trim(),
  };

  if (payload.githubLink && !safeUrl(payload.githubLink)) {
    status.textContent = "Please enter a valid GitHub URL.";
    status.className = "form-status failed";
    return;
  }
  if (payload.imageUrl && !safeUrl(payload.imageUrl)) {
    status.textContent = "Please enter a valid image URL.";
    status.className = "form-status failed";
    return;
  }

  if (button) button.disabled = true;
  status.textContent = "Saving…";
  status.className = "form-status";

  try {
    await request(API.projects, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    status.textContent = "Project added successfully.";
    status.className = "form-status sent";
    form.reset();
    await loadProjectsForAdmin();
  } catch (error) {
    status.textContent = error.message === "BACKEND_UNREACHABLE"
      ? "Couldn't reach the backend."
      : `Couldn't save the project (${error.message}).`;
    status.className = "form-status failed";
    console.error("Add project error:", error);
  } finally {
    if (button) button.disabled = false;
  }
}

async function deleteProject(id) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    alert("Invalid project ID.");
    return;
  }
  if (!confirm("Delete this project?")) return;

  try {
    await request(`${API.projects}/${numericId}`, { method: "DELETE" });
    await loadProjectsForAdmin();
  } catch (error) {
    alert(error.message === "BACKEND_UNREACHABLE"
      ? "Couldn't reach the backend."
      : `Couldn't delete the project (${error.message}).`);
    console.error("Delete project error:", error);
  }
}

async function loadContacts() {
  const list = document.getElementById("contactList");
  list.innerHTML = `<li>Loading…</li>`;

  try {
    const data = await request(API.contacts);
    const contacts = Array.isArray(data) ? data : [];

    if (!contacts.length) {
      list.innerHTML = `<li>No messages yet.</li>`;
      return;
    }

    list.innerHTML = contacts.map(contact => `
      <li>
        <div>
          <p class="item-title">${escapeHtml(contact.name)} — ${escapeHtml(contact.email)}</p>
          <p class="item-meta">${escapeHtml(contact.message)}</p>
        </div>
      </li>`).join("");
  } catch (error) {
    list.innerHTML = `<li>Couldn't load messages. ${escapeHtml(error.message)}</li>`;
    console.error("Contact loading error:", error);
  }
}

document.getElementById("loginForm")?.addEventListener("submit", handleLogin);
document.getElementById("projectForm")?.addEventListener("submit", addProject);
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_KEY);
  showLogin();
});

const existingUser = sessionStorage.getItem(SESSION_KEY);
if (existingUser) showDashboard(existingUser);
else showLogin();
