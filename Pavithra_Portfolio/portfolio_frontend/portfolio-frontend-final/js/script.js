/* global API */

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

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

function setStatus(element, message, type = "") {
  if (!element) return;
  element.textContent = message;
  element.className = `form-status ${type}`.trim();
}

async function requestJson(url, options = {}) {
  let response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new Error("BACKEND_UNREACHABLE");
  }

  const text = await response.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }

  if (!response.ok) {
    const detail = typeof data === "string" ? data : data?.message;
    throw new Error(detail || `HTTP_${response.status}`);
  }
  return data;
}

function renderProjectCard(project) {
  const title = escapeHtml(project?.title || "Untitled project");
  const description = escapeHtml(project?.description || "");
  const tags = String(project?.techStack || "")
    .split(",")
    .map(tag => tag.trim())
    .filter(Boolean)
    .map(tag => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join("");

  const imageUrl = safeUrl(project?.imageUrl);
  const githubUrl = safeUrl(project?.githubLink);

  const image = imageUrl
    ? `<img class="thumb" src="${escapeHtml(imageUrl)}" alt="${title} screenshot" loading="lazy" onerror="this.style.display='none'">`
    : "";

  const githubLink = githubUrl
    ? `<a href="${escapeHtml(githubUrl)}" target="_blank" rel="noopener noreferrer">GitHub →</a>`
    : "";

  return `
    <article class="project-card">
      ${image}
      <div class="body">
        <h3>${title}</h3>
        <p>${description}</p>
        <div class="tags">${tags}</div>
        <div class="links">${githubLink}</div>
      </div>
    </article>`;
}

async function loadProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  grid.innerHTML = `<p class="empty-note">Loading projects…</p>`;

  try {
    const data = await requestJson(API.projects);
    const projects = Array.isArray(data) ? data : [];

    if (!projects.length) {
      grid.innerHTML = `<p class="empty-note">No projects added yet. Add one from the admin page.</p>`;
      return;
    }

    grid.innerHTML = projects.map(renderProjectCard).join("");
  } catch (error) {
    const message = error.message === "BACKEND_UNREACHABLE"
      ? `Couldn't reach the Spring Boot backend at ${API_BASE}. Start the backend and refresh this page.`
      : `Couldn't load projects (${escapeHtml(error.message)}).`;
    grid.innerHTML = `<p class="error-note">${message}</p>`;
    console.error("Project loading error:", error);
  }
}

async function sendContact(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const button = form.querySelector("button[type='submit']");
  const status = document.getElementById("formStatus");
  const payload = {
    name: document.getElementById("name")?.value.trim() || "",
    email: document.getElementById("email")?.value.trim() || "",
    message: document.getElementById("message")?.value.trim() || "",
  };

  if (!payload.name || !payload.email || !payload.message) return;

  if (button) button.disabled = true;
  setStatus(status, "Sending…");

  try {
    await requestJson(API.contacts, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setStatus(status, "Message sent — thanks for reaching out.", "sent");
    form.reset();
  } catch (error) {
    const message = error.message === "BACKEND_UNREACHABLE"
      ? "Couldn't reach the backend. Make sure Spring Boot is running."
      : `Couldn't send the message (${error.message}).`;
    setStatus(status, message, "failed");
    console.error("Contact error:", error);
  } finally {
    if (button) button.disabled = false;
  }
}

document.getElementById("contactForm")?.addEventListener("submit", sendContact);
loadProjects();
