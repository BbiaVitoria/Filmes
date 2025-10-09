// 1. Dados dos filmes
const filmes = [
    {
        titulo: "O Segredo do Mar",
        ano: 2023,
        genero: "Aventura",
        sinopse: "Uma equipe de exploradores descobre uma cidade submersa.",
        imagem: "https://via.placeholder.com/250x350/FF5733/FFFFFF?text=Filme+1" // Imagem placeholder
    },
    {
        titulo: "Código Silencioso",
        ano: 2022,
        genero: "Suspense",
        sinopse: "Um hacker precisa desvendar um código antes que seja tarde demais.",
        imagem: "https://via.placeholder.com/250x350/33FF57/FFFFFF?text=Filme+2" // Imagem placeholder
    },
    {
        titulo: "A Montanha Perdida",
        ano: 2024,
        genero: "Drama",
        sinopse: "A jornada de um homem para encontrar a si mesmo no topo de uma montanha.",
        imagem: "https://via.placeholder.com/250x350/3357FF/FFFFFF?text=Filme+3" // Imagem placeholder
    }
    // Adicione mais objetos de filmes aqui!
];

// 2. Função para criar o cartão HTML de um filme
function criarCartaoFilme(filme) {
    // Cria o elemento principal do cartão (div)
    const card = document.createElement('div');
    card.classList.add('filme-card');

    // Monta o conteúdo HTML interno do cartão
    card.innerHTML = `
        <img src="${filme.imagem}" alt="Pôster do filme ${filme.titulo}">
        <h3>${filme.titulo}</h3>
        <p><strong>Ano:</strong> ${filme.ano}</p>
        <p><strong>Gênero:</strong> ${filme.genero}</p>
        <p class="sinopse">${filme.sinopse}</p>
    `;

    return card;
}

// 3. Função principal para renderizar o catálogo
function renderizarCatalogo() {
    const catalogoContainer = document.getElementById('catalogo-filmes');
    
    // Limpa o container (útil se você for recarregar a lista)
    // Apenas a título h2 é mantido.
    const h2 = catalogoContainer.querySelector('h2');
    catalogoContainer.innerHTML = '';
    catalogoContainer.appendChild(h2);
    

    // Percorre o array de filmes e adiciona cada cartão ao container
    filmes.forEach(filme => {
        const cartao = criarCartaoFilme(filme);
        catalogoContainer.appendChild(cartao);
    });
}

// 4. Inicia a renderização do catálogo quando a página carrega
document.addEventListener('DOMContentLoaded', renderizarCatalogo);