window.addEventListener('load', function() {
    const overlay = document.querySelector('.loading-overlay');
    overlay.style.display = 'none'; // Esconde o overlay após o carregamento
});

// Função para avançar o carrossel automaticamente a cada 7 segundos
function avancarSlide() {
    const proximoBotao = document.querySelector('[data-bs-slide="next"]');
    proximoBotao.click();
}

// Iniciar o carrossel automaticamente
setInterval(avancarSlide, 5000); // 7000 milissegundos = 7 segundos