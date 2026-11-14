
const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:8080/usuario"
  : "https://usermanager-fullstack.onrender.com/usuario";

let usersCache = [];
let currentLang = localStorage.getItem("lang") || "pt";

const i18n = {
  pt: {
    statusChecking: "Conectando API...",
    statusOnline: "API Online",
    statusOffline: "API Offline",
    formTitleCreate: "Novo Usuário",
    formTitleEdit: "Editando Usuário",
    btnCancel: "Cancelar edição",
    secPersonal: "Dados Pessoais",
    lblName: "Nome completo *",
    lblRole: "Profissão *",
    lblEmail: "E-mail *",
    secContact: "Contato",
    lblPhone: "Telefone *",
    secAddress: "Endereço",
    lblStreet: "Rua *",
    lblNumber: "Número *",
    lblComplement: "Complemento",
    lblCity: "Cidade *",
    lblState: "UF *",
    btnSave: "Salvar Cadastro",
    btnUpdate: "Atualizar Usuário",
    listTitle: "Usuários Cadastrados",
    searchPlaceholder: "Buscar por nome, profissão ou cidade...",
    records: "registros",
    emptyList:
      "Nenhum usuário cadastrado ainda. Preencha o formulário ao lado!",
    btnEdit: "Editar",
    btnDelete: "Excluir",
    confirmDelete: "Deseja realmente excluir este usuário?",
    msgCreated: "Usuário cadastrado com sucesso no Supabase!",
    msgUpdated: "Usuário atualizado com sucesso!",
    msgDeleted: "Usuário removido com sucesso!",
    msgError:
      "Erro ao comunicar com a API. Verifique se o back-end está rodando.",
  },
  en: {
    statusChecking: "Connecting API...",
    statusOnline: "API Online",
    statusOffline: "API Offline",
    formTitleCreate: "New User",
    formTitleEdit: "Editing User",
    btnCancel: "Cancel edit",
    secPersonal: "Personal Info",
    lblName: "Full name *",
    lblRole: "Profession *",
    lblEmail: "Email *",
    secContact: "Contact",
    lblPhone: "Phone *",
    secAddress: "Address",
    lblStreet: "Street *",
    lblNumber: "Number *",
    lblComplement: "Complement",
    lblCity: "City *",
    lblState: "State *",
    btnSave: "Save User",
    btnUpdate: "Update User",
    listTitle: "Registered Users",
    searchPlaceholder: "Search by name, profession or city...",
    records: "records",
    emptyList: "No users registered yet. Fill out the form to add one!",
    btnEdit: "Edit",
    btnDelete: "Delete",
    confirmDelete: "Are you sure you want to delete this user?",
    msgCreated: "User successfully saved to Supabase!",
    msgUpdated: "User successfully updated!",
    msgDeleted: "User successfully deleted!",
    msgError: "API connection error. Check if the back-end server is running.",
  },
};

// Elementos do DOM
const form = document.getElementById("user-form");
const usersContainer = document.getElementById("users-container");
const statusPill = document.getElementById("api-status");
const searchInput = document.getElementById("search-input");
const feedbackBanner = document.getElementById("feedback-banner");

// --- MÁSCARAS DE ENTRADA ---
function formatDDD(value) {
  const digits = (value || "").replace(/\D/g, "").slice(0, 2);
  return digits.length > 0 ? `(${digits}${digits.length === 2 ? ")" : ""}` : "";
}

function formatPhone(value) {
  const digits = (value || "").replace(/\D/g, "").slice(0, 9);
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  if (digits.length > 4) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return digits;
}

function formatCEP(value) {
  const digits = (value || "").replace(/\D/g, "").slice(0, 8);
  return digits.length > 5
    ? `${digits.slice(0, 5)}-${digits.slice(5)}`
    : digits;
}

document.getElementById("ddd").addEventListener("input", (e) => {
  e.target.value = formatDDD(e.target.value);
});

document.getElementById("telefone").addEventListener("input", (e) => {
  e.target.value = formatPhone(e.target.value);
});

document.getElementById("cep").addEventListener("input", (e) => {
  e.target.value = formatCEP(e.target.value);
});

document.getElementById("estado").addEventListener("input", (e) => {
  e.target.value = e.target.value
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase()
    .slice(0, 2);
});

// Idioma
function applyLanguage() {
  const dict = i18n[currentLang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  searchInput.placeholder = dict.searchPlaceholder;
  document.getElementById("lang-toggle").textContent =
    currentLang === "pt" ? "EN" : "PT";
  const isEditing = Boolean(document.getElementById("user-id").value);
  document.getElementById("form-title").textContent = isEditing
    ? dict.formTitleEdit
    : dict.formTitleCreate;
  document.getElementById("btn-submit").textContent = isEditing
    ? dict.btnUpdate
    : dict.btnSave;
  renderUsers(usersCache);
}

document.getElementById("lang-toggle").addEventListener("click", () => {
  currentLang = currentLang === "pt" ? "en" : "pt";
  localStorage.setItem("lang", currentLang);
  applyLanguage();
});

function showBanner(message, type = "success") {
  feedbackBanner.textContent = message;
  feedbackBanner.className = `banner banner-${type}`;
  setTimeout(() => feedbackBanner.classList.add("hidden"), 4500);
}

// Autopreenchimento de endereço pelo CEP (ViaCEP)
document.getElementById("cep").addEventListener("blur", async (e) => {
  const cep = e.target.value.replace(/\D/g, "");
  if (cep.length !== 8) return;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();
    if (!data.erro) {
      document.getElementById("rua").value = data.logradouro || "";
      document.getElementById("cidade").value = data.localidade || "";
      document.getElementById("estado").value = data.uf || "";
    }
  } catch (_) {}
});

// Buscar todos os usuários (GET)
async function loadUsers() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error();
    usersCache = await response.json();
    statusPill.textContent = i18n[currentLang].statusOnline;
    statusPill.className = "status-pill status-online";
    renderUsers(usersCache);
  } catch (err) {
    statusPill.textContent = i18n[currentLang].statusOffline;
    statusPill.className = "status-pill status-offline";
    showBanner(i18n[currentLang].msgError, "error");
  }
}

// Renderizar cards na tela
function renderUsers(list) {
  const dict = i18n[currentLang];
  const term = searchInput.value.toLowerCase().trim();
  const filtered = list.filter((u) => {
    const city = u.enderecos?.[0]?.cidade || "";
    return (
      (u.nome || "").toLowerCase().includes(term) ||
      (u.profissao || "").toLowerCase().includes(term) ||
      city.toLowerCase().includes(term)
    );
  });

  document.getElementById("user-count").textContent =
    `${filtered.length} ${dict.records}`;

  if (filtered.length === 0) {
    usersContainer.innerHTML = `<p class="subtitle">${dict.emptyList}</p>`;
    return;
  }

  usersContainer.innerHTML = filtered
    .map((user) => {
      const end = user.enderecos?.[0] || {};
      const tel = user.telefones?.[0] || {};
      const dddExibicao = tel.ddd ? formatDDD(tel.ddd) : "(--)";
      const telExibicao = tel.numero
        ? formatPhone(tel.numero)
        : "Não informado";
      return `
      <article class="user-card">
        <div>
          <div class="user-top">
            <div>
              <div class="user-name">${user.nome}</div>
              <span class="user-role">${user.profissao || "Profissional"}</span>
            </div>
          </div>
          <div class="user-details" style="margin-top: 12px;">
            <span><strong>Email:</strong> ${user.email}</span>
            <span><strong>Tel:</strong> ${dddExibicao} ${telExibicao}</span>
            <span><strong>End:</strong> ${end.rua || ""}, ${end.numero || ""} ${end.complemento ? "- " + end.complemento : ""} • ${end.cidade || ""}/${end.estado || ""}</span>
          </div>
        </div>
        <div class="card-actions">
          <button class="btn-edit" onclick="startEdit(${user.id})">${dict.btnEdit}</button>
          <button class="btn-delete" onclick="deleteUser(${user.id})">${dict.btnDelete}</button>
        </div>
      </article>
    `;
    })
    .join("");
}

searchInput.addEventListener("input", () => renderUsers(usersCache));

// Salvar ou Atualizar (POST / PUT)
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("user-id").value;

  const payload = {
    nome: document.getElementById("nome").value.trim(),
    email: document.getElementById("email").value.trim(),
    profissao: document.getElementById("profissao").value.trim(),
    enderecos: [
      {
        rua: document.getElementById("rua").value.trim(),
        numero: Number(document.getElementById("numero").value),
        complemento: document.getElementById("complemento").value.trim(),
        cidade: document.getElementById("cidade").value.trim(),
        estado: document.getElementById("estado").value.trim().toUpperCase(),
        cep: formatCEP(document.getElementById("cep").value),
      },
    ],
    telefones: [
      {
        ddd: document.getElementById("ddd").value.replace(/\D/g, ""),
        numero: formatPhone(document.getElementById("telefone").value),
      },
    ],
  };

  try {
    const method = id ? "PUT" : "POST";
    const endpoint = id ? `${API_URL}/${id}` : API_URL;

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || "Erro na requisição");
    }

    resetForm();
    await loadUsers();
    showBanner(
      id ? i18n[currentLang].msgUpdated : i18n[currentLang].msgCreated,
      "success",
    );
  } catch (err) {
    showBanner(err.message || i18n[currentLang].msgError, "error");
  }
});

// Preencher formulário para edição
window.startEdit = (id) => {
  const user = usersCache.find((u) => u.id === id);
  if (!user) return;

  const end = user.enderecos?.[0] || {};
  const tel = user.telefones?.[0] || {};

  document.getElementById("user-id").value = user.id;
  document.getElementById("nome").value = user.nome || "";
  document.getElementById("email").value = user.email || "";
  document.getElementById("profissao").value = user.profissao || "";

  document.getElementById("ddd").value = formatDDD(tel.ddd);
  document.getElementById("telefone").value = formatPhone(tel.numero);

  document.getElementById("cep").value = formatCEP(end.cep);
  document.getElementById("rua").value = end.rua || "";
  document.getElementById("numero").value = end.numero || "";
  document.getElementById("complemento").value = end.complemento || "";
  document.getElementById("cidade").value = end.cidade || "";
  document.getElementById("estado").value = end.estado || "";

  document.getElementById("btn-cancel-edit").classList.remove("hidden");
  applyLanguage();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

function resetForm() {
  form.reset();
  document.getElementById("user-id").value = "";
  document.getElementById("btn-cancel-edit").classList.add("hidden");
  applyLanguage();
}

document.getElementById("btn-cancel-edit").addEventListener("click", resetForm);

// Excluir usuário (DELETE)
window.deleteUser = async (id) => {
  if (!confirm(i18n[currentLang].confirmDelete)) return;
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error();
    await loadUsers();
    showBanner(i18n[currentLang].msgDeleted, "success");
  } catch (err) {
    showBanner(i18n[currentLang].msgError, "error");
  }
};

// Inicialização
applyLanguage();
loadUsers();
