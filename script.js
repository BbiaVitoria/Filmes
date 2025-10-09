// Chave para armazenar os filmes no navegador
const STORAGE_KEY = 'catalogoDeFilmes_V2';

// 1. Inicializa ou carrega os filmes do localStorage
function carregarFilmes() {
    const filmesSalvos = localStorage.getItem(STORAGE_KEY);
    // Se houver dados salvos, usa eles. Caso contrário, usa uma lista inicial.
    return JSON.parse(filmesSalvos) || [
        {
            titulo: "O Segredo do Mar",
            ano: 2023,
            genero: "Aventura",
            sinopse: "Uma equipe de exploradores descobre uma cidade submersa e seus mistérios.",
            imagem: "https://via.placeholder.com/250x350/007bff/FFFFFF?text=Aventura+2023"
        },
        {
            titulo: "Código Silencioso",
            ano: 2022,
            genero: "Suspense",
            sinopse: "Um hacker precisa desvendar um código complexo antes que seja tarde demais.",
            imagem: "https://via.placeholder.com/250x350/dc3545/FFFFFF?text=Suspense+2022"
        }
    ];
}

let filmes = carregarFilmes();

// 2. Função para salvar o array 'filmes' no localStorage
function salvarFilmes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filmes));
}


// 3. Função para criar o cartão HTML de um filme
function criarCartaoFilme(filme) {
    const card = document.createElement('div');
    card.classList.add('filme-card');

    // O atributo onerror garante que se a URL da imagem estiver inválida, uma imagem padrão será exibida.
    card.innerHTML = `
        <img src="${filme.imagem}" alt="Pôster do filme ${filme.titulo}" onerror="this.onerror=null;this.src='https://via.placeholder.com/250x350/CCCCCC/000000?text=Sem+Imagem';">
        <h3>${filme.titulo}</h3>
        <p><strong>Ano:</strong> ${filme.ano}</p>
        <p><strong>Gênero:</strong> ${filme.genero}</p>
        <p class="sinopse">${filme.sinopse}</p>
    `;

    return card;
}


// 4. Função principal para renderizar o catálogo (RECARREGA A LISTA)
function renderizarCatalogo() {
    const catalogoContainer = document.getElementById('catalogo-filmes');
    
    // Limpa os cartões atuais antes de renderizar a lista atualizada
    catalogoContainer.innerHTML = '';
    
    // Percorre o array de filmes e adiciona cada cartão ao container
    filmes.forEach(filme => {
        const cartao = criarCartaoFilme(filme);
        catalogoContainer.appendChild(cartao);
    });
}


// 5. Função que lida com o envio do formulário
function handleFormSubmit(event) {
    event.preventDefault(); // Impede o recarregamento da página

    // Captura os valores do formulário
    const novoFilme = {
        titulo: document.getElementById('titulo').value,
        ano: parseInt(document.getElementById('ano').value),
        genero: document.getElementById('genero').value,
        sinopse: document.getElementById('sinopse').value,
        // Garante que haja um valor padrão se o campo de imagem for deixado vazio
        imagem: document.getElementById('imagem').value.trim() || "https://via.placeholder.com/250x350/1C768F/FFFFFF?text=Novo+Filme" 
    };

    // Adiciona o novo filme no INÍCIO do array
    filmes.unshift(novoFilme);

    // Salva a lista atualizada no localStorage
    salvarFilmes();

    // Renderiza o catálogo novamente com o novo filme
    renderizarCatalogo();

    // Limpa o formulário para a próxima adição
    document.getElementById('filme-form').reset();
    
    alert(`Filme "${novoFilme.titulo}" adicionado e salvo!`);
}


// 6. Inicia a renderização e configura o listener do formulário
document.addEventListener('DOMContentLoaded', () => {
    // 6a. Renderiza o catálogo com os dados iniciais/salvos ao carregar
    renderizarCatalogo();

    // 6b. Adiciona o listener para o formulário
    const filmeForm = document.getElementById('filme-form');
    if (filmeForm) {
        filmeForm.addEventListener('submit', handleFormSubmit);
    }
});