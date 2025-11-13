// ATENÇÃO: Substitua 'SUA_CHAVE_OMDB_AQUI' pela sua chave real do OMDB
const OMDB_API_KEY = '59b8dc37'; // Use sua chave real aqui!

// 1. Funções de Suporte

function gerarEstrelas(avaliacao) {
    // Esta função agora recebe a nota de 10 do OMDB e a converte para 5 estrelas
    const nota = parseFloat(avaliacao) || 0;
    // Conversão de 10 para 5 estrelas: (nota / 10) * 5
    const numEstrelas = Math.round((nota / 10) * 5);
    const estrelasCheias = '⭐'.repeat(numEstrelas);
    const estrelasVazias = '☆'.repeat(5 - numEstrelas);
    return estrelasCheias + estrelasVazias;
}

// 2. Lógica para mostrar/esconder detalhes ao clicar na imagem
window.toggleDetalhes = function(element) {
    const card = element.closest('.filme-card');
    const detalhes = card.querySelector('.filme-detalhes');
    detalhes.classList.toggle('expanded');
}

// 3. Função para criar o cartão HTML de um filme (RESULTADO OMDB)
function criarCartaoPesquisaOMDB(movieData) {
    const card = document.createElement('div');
    card.classList.add('filme-card');

    const titulo = movieData.Title || 'N/A';
    const ano = movieData.Year || 'N/A';
    const tipo = movieData.Type || 'N/A';
    // O Poster do OMDB pode vir como 'N/A'
    const poster = movieData.Poster && movieData.Poster !== 'N/A' ? movieData.Poster : 'https://via.placeholder.com/250x350/CCCCCC/000000?text=Sem+Pôster';
    const imdbId = movieData.imdbID || ''; 
    const rating = movieData.imdbRating || 'N/A';
    const diretor = movieData.Director && movieData.Director !== 'N/A' ? movieData.Director : 'Desconhecido';
    const genero = movieData.Genre && movieData.Genre !== 'N/A' ? movieData.Genre : 'N/A';
    const plot = movieData.Plot && movieData.Plot !== 'N/A' ? movieData.Plot : 'Sinopse não disponível.';


    card.innerHTML = `
    <div class="filme-card-image-container" onclick="toggleDetalhes(this)">
        <img src="${poster}" alt="Pôster do filme ${titulo}" onerror="this.onerror=null;this.src='https://via.placeholder.com/250x350/CCCCCC/000000?text=Sem+Imagem';">
    </div>

    <h3>${titulo} (${ano})</h3>
    <p><strong>Avaliação:</strong> <span style="font-size: 1.2em; color: #E91E63;">${gerarEstrelas(rating)}</span></p>
    <p><strong>Tipo:</strong> ${tipo}</p>
    
    <div class="filme-detalhes">
        <hr style="margin: 5px 0; border-color: #f0f0f0;">
        <p><strong>Gênero:</strong> ${genero}</p>
        <p><strong>Diretor(a):</strong> ${diretor}</p>
        <p><strong>ID OMDB:</strong> ${imdbId}</p>
        <p class="sinopse" style="margin-top: 10px;">${plot}</p>
    </div>
    `;

    return card;
}


// 4. Funções de renderização e busca

function renderizarResultadosPesquisa(resultados) {
    const resultadosContainer = document.getElementById('resultados-pesquisa');
    resultadosContainer.innerHTML = '';

    if (resultados.length === 0) {
        resultadosContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #E91E63;">Nenhum resultado encontrado no OMDB para este termo.</p>';
        return;
    }

    // Para cada item encontrado na busca (Search), buscamos os detalhes completos.
    // O array 'Search' na busca por 's' tem dados limitados, o 'i' ou 't' tem dados completos.
    resultados.forEach(async (movie) => {
        // Busca os detalhes completos usando o ID do IMDb
        const urlCompleta = `https://www.omdbapi.com/?i=${movie.imdbID}&plot=full&apikey=${OMDB_API_KEY}`;
        
        try {
            const response = await fetch(urlCompleta);
            const data = await response.json();
            
            if (data.Response === "True") {
                const cartao = criarCartaoPesquisaOMDB(data);
                resultadosContainer.appendChild(cartao);
            }
        } catch (error) {
            console.error(`Erro ao buscar detalhes para ${movie.imdbID}:`, error);
        }
    });

    // Remove a mensagem de carregamento após a busca inicial.
    // Os cartões aparecerão à medida que as buscas por ID terminarem.
    const loadingMessage = resultadosContainer.querySelector('p');
    if (loadingMessage && loadingMessage.textContent === 'Buscando filmes...') {
        loadingMessage.remove();
    }
}


async function handlePesquisaSubmit(event) {
    event.preventDefault();
    
    const termo = document.getElementById('termo-pesquisa').value.trim();
    const resultadosContainer = document.getElementById('resultados-pesquisa');
    
    if (!OMDB_API_KEY || OMDB_API_KEY === '59b8dc37') {
        resultadosContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: red;">ERRO: Por favor, insira sua chave da API do OMDB real no script.js!</p>';
        return;
    }
    
    if (termo.length < 2) {
         resultadosContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #666;">Digite pelo menos 2 caracteres para iniciar a pesquisa.</p>';
         return;
    }

    // Limpa resultados e exibe mensagem de carregamento
    resultadosContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #E91E63;">Buscando filmes...</p>';

    // Usa a busca por 's' (search) para obter uma lista de títulos
    const urlBusca = `https://www.omdbapi.com/?s=${encodeURIComponent(termo)}&apikey=${OMDB_API_KEY}`;

    try {
        const response = await fetch(urlBusca);
        const data = await response.json();

        if (data.Response === "True" && data.Search) {
            // Filtra apenas resultados do tipo 'movie' e 'series'
            const filmesEseries = data.Search.filter(item => item.Type === 'movie' || item.Type === 'series');
            renderizarResultadosPesquisa(filmesEseries);
        } else {
            renderizarResultadosPesquisa([]); // Array vazio para mostrar a mensagem de "não encontrado"
        }

    } catch (error) {
        console.error("Erro na API do OMDB:", error);
        resultadosContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: red;">Ocorreu um erro de rede ao buscar os dados.</p>';
    }
}


// 5. Inicia a aplicação
document.addEventListener('DOMContentLoaded', () => {
    // Adiciona o listener para o formulário de pesquisa
    const pesquisaForm = document.getElementById('pesquisa-form');
    if (pesquisaForm) {
        pesquisaForm.addEventListener('submit', handlePesquisaSubmit);
    }
});