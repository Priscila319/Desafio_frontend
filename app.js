const API_URL = 'https://desafio-backend-1-2uo6.onrender.com/api/entries'; 

const form = document.getElementById('entry-form');
const entryId = document.getElementById('entry-id');
const title = document.getElementById('title'); 
const description = document.getElementById('description'); 
const happenedAt = document.getElementById('happenedAt'); 
const entriesList = document.getElementById('entries-list');
const message = document.getElementById('message');
const cancelEdit = document.getElementById('cancel-edit');
const formTitle = document.getElementById('form-title');
const reloadBtn = document.getElementById('reload-btn');

function showMessage(text) {
  message.textContent = text;
  setTimeout(() => (message.textContent = ''), 3000);
}

function clearForm() {
  form.reset();
  entryId.value = '';
  formTitle.textContent = 'Novo Registro';
  cancelEdit.classList.add('d-none');
}

async function loadEntries() {
  try {
    const response = await fetch(API_URL);
    const entries = await response.json();

    if (!entries || !entries.length) {
      entriesList.innerHTML = '<p class="text-center text-muted">Nenhum pet encontrado.</p>';
      return;
    }

    entriesList.innerHTML = entries.map(entry => `
      <div class="card mb-3 border-0 shadow-sm">
        <div class="card-body">
          <h3 class="h5">🐾 Nome: ${entry.nome}</h3>
          <p class="mb-1"><strong>Raça:</strong> ${entry.raca}</p>
          <small class="text-muted"><strong>Nascido em:</strong> ${new Date(entry.dataNascimento).toLocaleDateString('pt-BR')}</small>
          <div class="d-flex gap-2 mt-3">
            <button class="btn btn-sm btn-outline-primary" onclick="editEntry('${entry._id}')">Editar</button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteEntry('${entry._id}')">Excluir</button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error("Erro ao carregar:", error);
    entriesList.innerHTML = '<p class="text-center text-danger">Erro ao conectar com o servidor.</p>';
  }
}

async function saveEntry(data) {
  const id = entryId.value;
  const url = id ? `${API_URL}/${id}` : API_URL;
  const method = id ? 'PUT' : 'POST';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

window.editEntry = async function (id) {
  const response = await fetch(`${API_URL}/${id}`);
  const entry = await response.json();

  entryId.value = entry._id;
  title.value = entry.nome;
  description.value = entry.raca;
  happenedAt.value = new Date(entry.dataNascimento).toISOString().split('T')[0];

  formTitle.textContent = 'Editar Registro';
  cancelEdit.classList.remove('d-none');
  window.scrollTo(0, 0);
};

window.deleteEntry = async function (id) {
  if (!confirm('Deseja excluir este pet?')) return;
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  showMessage('Registro excluído.');
  loadEntries();
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    nome: title.value,
    raca: description.value,
    dataNascimento: happenedAt.value
  };

  await saveEntry(data);
  showMessage(entryId.value ? 'Registro atualizado!' : 'Registro criado!');
  clearForm();
  loadEntries();
});

cancelEdit.addEventListener('click', clearForm);
reloadBtn.addEventListener('click', loadEntries);

loadEntries();