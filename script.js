const STORAGE_KEY = 'catalogoDeFilmes_V4'; 

// 1. Funções de Suporte
function gerarIdUnico() {
    return Date.now();
}

function salvarFilmes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filmes));
}

// Função para gerar as estrelas (emojis)
function gerarEstrelas(avaliacao) {
    // Garante que a avaliação seja um número entre 1 e 5
    const avaliacaoSegura = Math.max(1, Math.min(5, parseInt(avaliacao) || 0));
    const estrelasCheias = '⭐'.repeat(avaliacaoSegura);
    const estrelasVazias = '☆'.repeat(5 - avaliacaoSegura);
    return estrelasCheias + estrelasVazias;
}


// 2. Inicializa ou carrega os filmes do localStorage (Dados Iniciais Corrigidos)
function carregarFilmes() {
    const filmesSalvos = localStorage.getItem(STORAGE_KEY);
    
    // Dados iniciais completos, incluindo todos os novos campos
    const filmesIniciais = [
        {
            id: gerarIdUnico() + 1,
            titulo: "Mistério do Lago Rosa",
            ano: 2024,
            genero: "Suspense",
            diretor: "Ava Thorne",
            produtora: "Pink Moon Studios",
            personagens: "Elara (Protagonista), Marcus (Detetive)",
            classificacao: 14, 
            duracao: 112,      
            avaliacao: 4,      
            sinopse: "Um detetive investiga desaparecimentos estranhos perto de um lago incomum.",
            imagem: "https://via.placeholder.com/250x350/F8BBD0/444444?text=Suspense+2024",
        },
        {
            id: gerarIdUnico() + 2,
            titulo: "A Montanha de Açúcar",
            ano: 2021,
            genero: "Fantasia",
            diretor: "Leo Candy",
            produtora: "Dreamland Films",
            personagens: "Princesa Doce, Dragão Chiclete",
            classificacao: 0, 
            duracao: 95,      
            avaliacao: 5,      
            sinopse: "Uma garota embarca em uma jornada mágica para salvar seu reino doce.",
            imagem: "https://via.placeholder.com/250x350/E91E63/FFFFFF?text=Fantasia+2021",
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


// 3. Função para EXCLUIR um filme
window.excluirFilme = function(id) {
    if (confirm("Tem certeza que deseja excluir este filme?")) {
        filmes = filmes.filter(filme => filme.id !== id);
        salvarFilmes();
        renderizarCatalogo();
    }
}


// 4. Função para criar o cartão HTML de um filme (Foco na Avaliação/Duração/Classificação)
function criarCartaoFilme(filme) {
    const card = document.createElement('div');
    card.classList.add('filme-card');

    card.innerHTML = `
        <div class="delete-btn-container">
            <button class="delete-btn" onclick="excluirFilme(${filme.id})">Excluir</button>
        </div>
        <img src="${filme.imagem}" alt="Pôster do filme ${filme.titulo}" onerror="this.onerror=null;this.src='https://via.placeholder.com/250x350/CCCCCC/000000?text=Sem+Imagem';">
        <h3>${filme.titulo}</h3>
        
        <p><strong>Avaliação:</strong> <span style="font-size: 1.2em; color: #E91E63;">${gerarEstrelas(filme.avaliacao)}</span></p>
        <p><strong>Classificação:</strong> ${filme.classificacao} Anos</p>
        <p><strong>Duração:</strong> ${filme.duracao} min</p>
        
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


// 5. Função principal para renderizar o catálogo (não houve mudanças)
function renderizarCatalogo() {
    const catalogoContainer = document.getElementById('catalogo-filmes');
    catalogoContainer.innerHTML = '';
    
    filmes.forEach(filme => {
        const cartao = criarCartaoFilme(filme);
        catalogoContainer.appendChild(cartao);
    });
}


// 6. Função que lida com o envio do formulário (Garante que os valores sejam numéricos)
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
        // Garante que os valores sejam lidos como números inteiros
        classificacao: parseInt(document.getElementById('classificacao').value) || 0, 
        duracao: parseInt(document.getElementById('duracao').value) || 0,             
        avaliacao: parseInt(document.getElementById('avaliacao').value) || 1,         
        sinopse: document.getElementById('sinopse').value,
        imagem: document.getElementById('imagem').value.trim() || "https://via.placeholder.com/250x350/F8BBD0/FFFFFF?text=Novo+Filme" 
    };

    filmes.unshift(novoFilme);
    salvarFilmes();
    renderizarCatalogo();

    document.getElementById('filme-form').reset();
    
    alert(`Filme "${novoFilme.titulo}" adicionado e salvo!`);
}


// 7. Inicia a aplicação (não houve mudanças)
document.addEventListener('DOMContentLoaded', () => {
    renderizarCatalogo();

    const filmeForm = document.getElementById('filme-form');
    if (filmeForm) {
        filmeForm.addEventListener('submit', handleFormSubmit);
    }
});