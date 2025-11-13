document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('results');

    // ⚠️ SUBSTITUA ESTE VALOR PELA SUA CHAVE REAL DA OMDb API ⚠️
    const API_KEY = '59b8dc37'; 
    const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&`;

    /**
     * Função principal para buscar filmes na OMDb API
     * @param {string} searchTerm - O termo de pesquisa do usuário.
     */
    async function searchMovies(searchTerm) {
        if (searchTerm.trim() === "") {
            resultsContainer.innerHTML = '<p class="initial-message">Por favor, digite um termo para pesquisar.</p>';
            return;
        }

        // Limpa resultados e mostra mensagem de carregamento
        resultsContainer.innerHTML = '<p class="initial-message">Carregando...</p>';

        const url = `${BASE_URL}s=${encodeURIComponent(searchTerm)}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.Response === "True") {
                displayResults(data.Search);
            } else {
                resultsContainer.innerHTML = `<p class="initial-message">Nenhum resultado encontrado para "${searchTerm}".</p>`;
            }
        } catch (error) {
            console.error("Erro ao buscar dados na OMDb API:", error);
            resultsContainer.innerHTML = '<p class="initial-message" style="color: red;">Ocorreu um erro na busca. Verifique sua chave de API e conexão.</p>';
        }
    }

    /**
     * Função para exibir os resultados na página.
     * @param {Array} movies - Lista de objetos de filmes/séries.
     */
    function displayResults(movies) {
        resultsContainer.innerHTML = ''; // Limpa o conteúdo anterior
        
        movies.forEach(movie => {
            const card = document.createElement('div');
            card.classList.add('movie-card');

            // Usa 'N/A' como pôster de fallback se não houver um
            const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=Sem+Poster';

            card.innerHTML = `
                <img src="${poster}" alt="Pôster do filme ${movie.Title}">
                <div class="movie-info">
                    <h3>${movie.Title}</h3>
                    <p>Ano: ${movie.Year}</p>
                    <p>Tipo: ${movie.Type}</p>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }

    // Event Listeners
    searchButton.addEventListener('click', () => {
        searchMovies(searchInput.value.trim());
    });

    searchInput.addEventListener('keypress', (e) => {
        // Permite pesquisar ao pressionar 'Enter' no campo de busca
        if (e.key === 'Enter') {
            searchMovies(searchInput.value.trim());
        }
    });
});