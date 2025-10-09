const STORAGE_KEY = 'catalogoDeFilmes_V2';

// 1. Função para gerar um ID único (Timestamp em milissegundos)
function gerarIdUnico() {
    return Date.now();
}

// 2. Inicializa ou carrega os filmes do localStorage
function carregarFilmes() {
    const filmesSalvos = localStorage.getItem(STORAGE_KEY);
    
    // Filmes iniciais com IDs para garantir funcionalidade
    const filmesIniciais = [
        {
            id: gerarIdUnico() + 1,
            titulo: "O Segredo do Mar",
            ano: 2023,
            genero: "Aventura",
            sinopse: "Uma equipe de exploradores descobre uma cidade submersa e seus mistérios.",
            imagem: "https://via.placeholder.com/250x350/007bff/FFFFFF?text=Aventura+2023"
        },
        {
            id: gerarIdUnico() + 2,
            titulo: "Código Silencioso",
            ano: 2022,
            genero: "Suspense",
            sinopse: "Um hacker precisa desvendar um código complexo antes que seja tarde demais.",
            imagem: "https://via.placeholder.com/250x350/dc3545/FFFFFF?text=Suspense+2022"
        }
    ];

    let listaFilmes = JSON.parse(filmesSalvos) || filmesIniciais;
    
    // Garante que todos os filmes, incluindo os carregados, tenham um ID
    listaFilmes = listaFilmes.map(filme => ({
        ...filme,
        id: filme.id || gerarIdUnico()
    }));

    return listaFilmes;
}

let filmes = carregarFilmes();

// 3. Função para salvar o array 'filmes' no localStorage
function salvarFilmes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filmes));
}


// 4. Função para EXCLUIR um filme (Disponível globalmente para o onclick)
window.excluirFilme = function(id) {
    if (confirm("Tem certeza que deseja excluir este filme?")) {
        // Filtra a lista, removendo o filme com o ID correspondente
        filmes = filmes.filter(filme => filme.id !== id);
        
        salvarFilmes();
        renderizarCatalogo(); // Recarrega a lista
    }
}


// 5. Função para criar o cartão HTML de um filme (Inclui botão de exclusão)
function criarCartaoFilme(filme) {
    const card = document.createElement('div');
    card.classList.add('filme-card');

    card.innerHTML = `
        <div class="delete-btn-container">
            <button class="delete-btn" onclick="excluirFilme(${filme.id})">Excluir</button>
        </div>
        <img src="${filme.imagem}" alt="Pôster do filme ${filme.titulo}" onerror="this.onerror=null;this.src='https://via.placeholder.com/250x350/CCCCCC/000000?text=Sem+Imagem';">
        <h3>${filme.titulo}</h3>
        <p><strong>Ano:</strong> ${filme.ano}</p>
        <p><strong>Gênero:</strong> ${filme.genero}</p>
        <p class="sinopse">${filme.sinopse}</p>
    `;

    return card;
}


// 6. Função principal para renderizar o catálogo
function renderizarCatalogo() {
    const catalogoContainer = document.getElementById('catalogo-filmes');
    catalogoContainer.innerHTML = '';
    
    filmes.forEach(filme => {
        const cartao = criarCartaoFilme(filme);
        catalogoContainer.appendChild(cartao);
    });
}


// 7. Função que lida com o envio do formulário
function handleFormSubmit(event) {
    event.preventDefault();

    const novoFilme = {
        id: gerarIdUnico(), // ID único para o novo filme
        titulo: document.getElementById('titulo').value,
        ano: parseInt(document.getElementById('ano').value),
        genero: document.getElementById('genero').value,
        sinopse: document.getElementById('sinopse').value,
        imagem: document.getElementById('imagem').value.trim() || "https://via.placeholder.com/250x350/1C768F/FFFFFF?text=Novo+Filme" 
    };

    filmes.unshift(novoFilme);
    salvarFilmes();
    renderizarCatalogo();

    document.getElementById('filme-form').reset();
    
    alert(`Filme "${novoFilme.titulo}" adicionado e salvo!`);
}


// 8. Inicia a aplicação
document.addEventListener('DOMContentLoaded', () => {
    renderizarCatalogo();

    const filmeForm = document.getElementById('filme-form');
    if (filmeForm) {
        filmeForm.addEventListener('submit', handleFormSubmit);
    }
});