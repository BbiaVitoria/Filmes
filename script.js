const STORAGE_KEY = 'catalogoDeFilmes_V5';
// ATENÇÃO: Substitua 'SUA_CHAVE_OMDB_AQUI' pela sua chave real do OMDB
const OMDB_API_KEY = '59b8dc37'; 

// 1. Funções de Suporte

function gerarIdUnico() {
    return Date.now() + Math.floor(Math.random() * 1000); // Garante maior unicidade
}

function salvarFilmes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filmes));
}

function gerarEstrelas(avaliacao) {
    const avaliacaoSegura = Math.max(1, Math.min(5, parseInt(avaliacao) || 0));
    const estrelasCheias = '⭐'.repeat(avaliacaoSegura);
    const estrelasVazias = '☆'.repeat(5 - avaliacaoSegura);
    return estrelasCheias + estrelasVazias;
}

// 2. Lógica para mostrar/esconder detalhes ao clicar na imagem
window.toggleDetalhes = function(element) {
    const card = element.closest('.filme-card');
    const detalhes = card.querySelector('.filme-detalhes');

    // Garante que só funciona no cartão do catálogo principal (que tem o botão de excluir)
    if (card.querySelector('.delete-btn')) { 
        detalhes.classList.toggle('expanded');
    }
}

// 3. Inicializa ou carrega os filmes
function carregarFilmes() {
    const filmesSalvos = localStorage.getItem(STORAGE_KEY);

    const filmesIniciais = [
        {
            id: gerarIdUnico() + 1,
            titulo: "Mistério do Lago Rosa",
            ano: 2024,
            genero: "Suspense",
            diretor: "Ava Thorne",
            produtora: "Pink Moon Studios",
            personagens: "Elara (Protagonista), Marcus (Detetive)",
            classificacao: "14",
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
            classificacao: "Livre",
            duracao: 95,
            avaliacao: 5,
            sinopse: "Uma garota embarca em uma jornada mágica para salvar seu reino doce.",
            imagem: "https://via.placeholder.com/250x350/E91E63/FFFFFF?text=Fantasia+2021",
        }
    ];

    let listaFilmes = JSON.parse(filmesSalvos) || filmesIniciais;

    // Garante que todos os filmes existentes têm um ID
    listaFilmes = listaFilmes.map(filme => ({
        ...filme,
        id: filme.id || gerarIdUnico()
    }));

    return listaFilmes;
}

let filmes = carregarFilmes();


// 4. Função para EXCLUIR um filme
window.excluirFilme = function(id) {
    if (confirm("Tem certeza que deseja excluir este filme?")) {
        filmes = filmes.filter(filme => filme.id !== id);
        salvarFilmes();
        renderizarCatalogo();
    }
}


// 5. Função para criar o cartão HTML de um filme (CATÁLOGO)
function criarCartaoFilme(filme) {
    const card = document.createElement('div');
    card.classList.add('filme-card');

    // Define como a classificação será exibida
    const classificacaoDisplay = filme.classificacao === "Livre" ? "Livre" : `${filme.classificacao} Anos`;

    card.innerHTML = `
<div class="delete-btn-container">
<button class="delete-btn" onclick="excluirFilme(${filme.id})">Excluir</button>
</div>


<div class="filme-card-image-container" onclick="toggleDetalhes(this)">
<img src="${filme.imagem}" alt="Pôster do filme ${filme.titulo}" onerror="this.onerror=null;this.src='https://via.placeholder.com/250x350/CCCCCC/000000?text=Sem+Imagem';">
</div>

<h3>${filme.titulo}</h3>
<p><strong>Avaliação:</strong> <span style="font-size: 1.2em; color: #E91E63;">${gerarEstrelas(filme.avaliacao)}</span></p>
<p><strong>Gênero:</strong> ${filme.genero}</p>


<div class="filme-detalhes">
<hr style="margin: 5px 0; border-color: #f0f0f0;">
<p><strong>Classificação:</strong> ${classificacaoDisplay}</p>
<p><strong>Duração:</strong> ${filme.duracao} min</p>
<p><strong>Ano:</strong> ${filme.ano}</p>
<p><strong>Diretor(a):</strong> ${filme.diretor}</p>
<p><strong>Produtora:</strong> ${filme.produtora}</p>
<p><strong>Personagens:</strong> ${filme.personagens}</p>
<p class="sinopse" style="margin-top: 10px;">${filme.sinopse}</p>
</div>
`;

    return card;
}

// 5.1. Função para criar o cartão HTML de um filme (RESULTADO OMDB)
function criarCartaoPesquisaOMDB(movieData) {
    const card = document.createElement('div');
    card.classList.add('filme-card');
    // Remove o botão de exclusão do cartão de pesquisa
    card.querySelector('.delete-btn-container')?.remove(); 

    const titulo = movieData.Title || 'N/A';
    const ano = movieData.Year || 'N/A';
    const poster = movieData.Poster && movieData.Poster !== 'N/A' ? movieData.Poster : 'https://via.placeholder.com/250x350/F8BBD0/FFFFFF?text=Sem+Pôster';
    const imdbId = movieData.imdbID || gerarIdUnico(); // Usa ID do OMDB ou gera um temporário se não houver

    // Formata a avaliação para o formato de estrela (OMDB usa 1-10, vamos usar apenas o que temos)
    let avaliacaoEstrelas = '☆☆☆☆☆';
    if (movieData.imdbRating && movieData.imdbRating !== 'N/A') {
        const nota = parseFloat(movieData.imdbRating); // Ex: 7.8
        // Conversão simples de 10 para 5 estrelas: (nota / 10) * 5
        const numEstrelas = Math.round((nota / 10) * 5);
        avaliacaoEstrelas = '⭐'.repeat(numEstrelas) + '☆'.repeat(5 - numEstrelas);
    }


    card.innerHTML = `
    <div class="filme-card-image-container" onclick="toggleDetalhes(this)">
        <img src="${poster}" alt="Pôster do filme ${titulo}" onerror="this.onerror=null;this.src='https://via.placeholder.com/250x350/CCCCCC/000000?text=Sem+Imagem';">
    </div>

    <h3>${titulo} (${ano})</h3>
    <p><strong>Avaliação OMDB:</strong> <span style="font-size: 1.2em; color: #E91E63;">${avaliacaoEstrelas}</span></p>
    <p><strong>Tipo:</strong> ${movieData.Type || 'Movie'}</p>
    
    <div class="filme-detalhes">
        <hr style="margin: 5px 0; border-color: #f0f0f0;">
        <p><strong>ID OMDB:</strong> ${imdbId}</p>
        <p><strong>Ano:</strong> ${ano}</p>
        <p><strong>Diretor(a):</strong> ${movieData.Director && movieData.Director !== 'N/A' ? movieData.Director : 'Desconhecido'}</p>
        <p class="sinopse" style="margin-top: 10px;">${movieData.Plot && movieData.Plot !== 'N/A' ? movieData.Plot : 'Sinopse não disponível na busca.'}</p>
        
        <button class="add-btn" onclick="adicionarDoOMDB('${imdbId}', '${titulo}', '${ano}', '${poster}')" 
        style="grid-column: 1 / 4; background-color: #4CAF50; margin-top: 15px;">
            Adicionar ao Meu Catálogo
        </button>
    </div>
    `;

    return card;
}


// 6. Funções de renderização e formulário

function renderizarCatalogo() {
    const catalogoContainer = document.getElementById('catalogo-filmes');
    catalogoContainer.innerHTML = '';

    filmes.forEach(filme => {
        const cartao = criarCartaoFilme(filme);
        catalogoContainer.appendChild(cartao);
    });
}

function renderizarResultadosPesquisa(resultados) {
    const resultadosContainer = document.getElementById('resultados-pesquisa');
    resultadosContainer.innerHTML = '';

    if (resultados.length === 0) {
        resultadosContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #E91E63;">Nenhum resultado encontrado no OMDB para este termo.</p>';
        return;
    }

    resultados.forEach(movieData => {
        const cartao = criarCartaoPesquisaOMDB(movieData);
        resultadosContainer.appendChild(cartao);
    });
}

// FUNÇÃO PARA ADICIONAR FILME VINDOS DA BUSCA
window.adicionarDoOMDB = async function(imdbId, titulo, ano, posterUrl) {
    
    // Busca os detalhes completos usando o ID do IMDb para preencher todos os campos
    const urlCompleta = `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`;

    try {
        const response = await fetch(urlCompleta);
        const data = await response.json();

        if (data.Response === "True") {
            // Mapeia os dados do OMDB para a estrutura do seu catálogo
            const novoFilme = {
                id: gerarIdUnico(),
                titulo: data.Title || titulo,
                ano: parseInt(data.Year) || parseInt(ano),
                genero: data.Genre && data.Genre !== 'N/A' ? data.Genre.split(',')[0].trim() : 'Desconhecido', // Pega o primeiro gênero
                diretor: data.Director && data.Director !== 'N/A' ? data.Director : 'N/A',
                produtora: data.Production && data.Production !== 'N/A' ? data.Production : 'N/A',
                personagens: data.Actors && data.Actors !== 'N/A' ? data.Actors : 'N/A',
                classificacao: data.Rated && data.Rated !== 'N/A' ? data.Rated.replace('PG-13', '12').replace('R', '18').replace('G', 'Livre').split('+')[0].replace(/[^0-9Livre]/g, '') : 'Livre', // Tenta converter classificação
                duracao: parseInt(data.Runtime) ? parseInt(data.Runtime.split(' ')[0]) : 0, // Remove 'min'
                avaliacao: data.imdbRating ? Math.round((parseFloat(data.imdbRating) / 10) * 5) : 1, // Converte nota de 10 para 5 estrelas
                sinopse: data.Plot && data.Plot !== 'N/A' ? data.Plot : 'Sinopse não detalhada na busca completa.',
                imagem: data.Poster && data.Poster !== 'N/A' ? data.Poster : posterUrl
            };

            // Garante que a classificação não é um valor vazio (caso a conversão falhe)
            if (!novoFilme.classificacao) novoFilme.classificacao = 'Livre';
            
            filmes.unshift(novoFilme);
            salvarFilmes();
            
            // Limpa a pesquisa e mostra o catálogo atualizado
            document.getElementById('resultados-pesquisa').innerHTML = '';
            document.getElementById('termo-pesquisa').value = '';
            renderizarCatalogo();
            
            alert(`Filme "${novoFilme.titulo}" adicionado com sucesso ao seu catálogo!`);

        } else {
            alert(`Erro ao buscar detalhes completos para o filme. ID: ${imdbId}`);
        }

    } catch (error) {
        console.error("Erro na API ao adicionar filme do OMDB:", error);
        alert("Erro de conexão ao tentar buscar os detalhes completos do filme.");
    }
}


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
        classificacao: document.getElementById('classificacao').value,
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


// NOVA FUNÇÃO PARA PESQUISA NO OMDB
async function handlePesquisaSubmit(event) {
    event.preventDefault();
    
    const termo = document.getElementById('termo-pesquisa').value.trim();
    const resultadosContainer = document.getElementById('resultados-pesquisa');
    
    if (!OMDB_API_KEY || OMDB_API_KEY === 'SUA_CHAVE_OMDB_AQUI') {
        resultadosContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: red;">ERRO: Por favor, insira sua chave da API do OMDB no script.js!</p>';
        return;
    }

    resultadosContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #E91E63;">Buscando filmes...</p>';

    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(termo)}&apikey=${OMDB_API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === "True" && data.Search) {
            renderizarResultadosPesquisa(data.Search);
        } else {
            renderizarResultadosPesquisa([]); // Chama com array vazio para mostrar mensagem de "não encontrado"
        }

    } catch (error) {
        console.error("Erro na API do OMDB:", error);
        resultadosContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: red;">Ocorreu um erro de rede ao buscar os dados.</p>';
    }
}


// 7. Inicia a aplicação
document.addEventListener('DOMContentLoaded', () => {
    renderizarCatalogo();

    const filmeForm = document.getElementById('filme-form');
    if (filmeForm) {
        filmeForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Adiciona o listener para o formulário de pesquisa
    const pesquisaForm = document.getElementById('pesquisa-form');
    if (pesquisaForm) {
        pesquisaForm.addEventListener('submit', handlePesquisaSubmit);
    }
});