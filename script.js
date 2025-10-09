const STORAGE_KEY = 'catalogoDeFilmes_V3'; // Mudando a chave para evitar conflito com versões antigas

// 1. Funções de Suporte
function gerarIdUnico() {
    return Date.now();
}

function salvarFilmes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filmes));
}


// 2. Inicializa ou carrega os filmes do localStorage
function carregarFilmes() {
    const filmesSalvos = localStorage.getItem(STORAGE_KEY);
    
    // Incluindo os novos campos nos dados iniciais
    const filmesIniciais = [
        {
            id: gerarIdUnico() + 1,
            titulo: "Mistério do Lago Rosa",
            ano: 2024,
            genero: "Suspense",
            sinopse: "Um detetive investiga desaparecimentos estranhos perto de um lago incomum.",
            imagem: "https://via.placeholder.com/250x350/F8BBD0/444444?text=Suspense+2024",
            diretor: "Ava Thorne",
            produtora: "Pink Moon Studios",
            personagens: "Elara (Protagonista), Marcus (Detetive)"
        },
        {
            id: gerarIdUnico() + 2,
            titulo: "A Montanha de Açúcar",
            ano: 2021,
            genero: "Fantasia",
            sinopse: "Uma garota embarca em uma jornada mágica para salvar seu reino doce.",
            imagem: "https://via.placeholder.com/250x350/E91E63/FFFFFF?text=Fantasia+2021",
            diretor: "Leo Candy",
            produtora: "Dreamland Films",
            personagens: "Princesa Doce, Dragão Chiclete"
        }
    ];

    let listaFilmes = JSON.parse(filmesSalvos) || filmesIniciais;
    
    // Garante que todos os filmes tenham um ID
    listaFilmes = listaFilmes.map(filme => ({
        ...filme,
        id: filme.id || gerarIdUnico()
    }));

    return listaFilmes;
}

let filmes = carregarFilmes();


// 3. Função para EXCLUIR um filme
window.excluirFilme = function(id) {
    if (confirm("Tem certeza que deseja excluir este filme?")) {
        filmes = filmes.filter(filme => filme.id !== id);
        
        salvarFilmes();
        renderizarCatalogo();
    }
}


// 4. Função para criar o cartão HTML de um filme (MODIFICADA com novas informações)
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
        <hr style="margin: 5px 0; border-color: #f0f0f0;">
        <p><strong>Diretor(a):</strong> ${filme.diretor}</p>
        <p><strong>Produtora:</strong> ${filme.produtora}</p>
        <p><strong>Personagens:</strong> ${filme.personagens}</p>
        <p class="sinopse" style="margin-top: 10px;">${filme.sinopse}</p>
    `;

    return card;
}


// 5. Função principal para renderizar o catálogo
function renderizarCatalogo() {
    const catalogoContainer = document.getElementById('catalogo-filmes');
    catalogoContainer.innerHTML = '';
    
    filmes.forEach(filme => {
        const cartao = criarCartaoFilme(filme);
        catalogoContainer.appendChild(cartao);
    });
}


// 6. Função que lida com o envio do formulário (MODIFICADA para capturar novos campos)
function handleFormSubmit(event) {
    event.preventDefault();

    const novoFilme = {
        id: gerarIdUnico(),
        titulo: document.getElementById('titulo').value,
        ano: parseInt(document.getElementById('ano').value),
        genero: document.getElementById('genero').value,
        diretor: document.getElementById('diretor').value,
        produtora: document.getElementById('produtora').value,
        personagens: document.getElementById('personagens').value,
        sinopse: document.getElementById('sinopse').value,
        imagem: document.getElementById('imagem').value.trim() || "https://via.placeholder.com/250x350/F8BBD0/FFFFFF?text=Novo+Filme" 
    };

    filmes.unshift(novoFilme);
    salvarFilmes();
    renderizarCatalogo();

    document.getElementById('filme-form').reset();
    
    alert(`Filme "${novoFilme.titulo}" adicionado e salvo!`);
}


// 7. Inicia a aplicação
document.addEventListener('DOMContentLoaded', () => {
    renderizarCatalogo();

    const filmeForm = document.getElementById('filme-form');
    if (filmeForm) {
        filmeForm.addEventListener('submit', handleFormSubmit);
    }
});