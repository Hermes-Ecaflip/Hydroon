function calcularBonus() {
    var stats = [
      "forca", "agilidade", "vigor", "inteligencia", "sabedoria", "carisma"
    ];
    var bonuses = [
      "forca_race_bonus", "agilidade_race_bonus", "vigor_race_bonus",
      "inteligencia_race_bonus", "sabedoria_race_bonus", "carisma_race_bonus",
      "forca_class_bonus", "agilidade_class_bonus", "vigor_class_bonus",
      "inteligencia_class_bonus", "sabedoria_class_bonus", "carisma_class_bonus"
    ];

    var values = stats.map(stat => parseInt(document.getElementById(stat).value) || 0);
    var bonusValues = bonuses.map(bonus => parseInt(document.getElementById(bonus).value) || 0);

    var bba = Math.floor((values[0] + values[1] + bonusValues[0] + bonusValues[1] + bonusValues[6] + bonusValues[7]) / 3);
    var reflexos = Math.floor((values[1] + values[3] + bonusValues[1] + bonusValues[3] + bonusValues[7] + bonusValues[9]) / 3);
    var resistencia = Math.floor((values[0] + values[2] + bonusValues[0] + bonusValues[2] + bonusValues[6] + bonusValues[8]) / 3);
    var bbm = Math.floor((values[3] + values[4] + bonusValues[3] + bonusValues[4] + bonusValues[9] + bonusValues[10]) / 3);
    var raciocinio = Math.floor((values[1] + values[3] + bonusValues[1] + bonusValues[3] + bonusValues[7] + bonusValues[9]) / 3);
    var manipulacao = Math.floor((values[5] + values[4] + bonusValues[5] + bonusValues[4] + bonusValues[11] + bonusValues[10]) / 3);

    // Salvar os dados do personagem no armazenamento local
    salvarPersonagem();

    // Atualiza os elementos de texto com os valores calculados
    document.getElementById("bba").textContent = "B.B.A: " + bba;
    document.getElementById("reflexos").textContent = "Reflexos: " + reflexos;
    document.getElementById("resistencia").textContent = "Resistência: " + resistencia;
    document.getElementById("bbm").textContent = "B.B.M: " + bbm;
    document.getElementById("raciocinio").textContent = "Raciocínio: " + raciocinio;
    document.getElementById("manipulacao").textContent = "Manipulação: " + manipulacao;
  }

  // Função para salvar os dados do personagem
  function salvarPersonagem() {
    var personagem = {
        nome: document.getElementById("nomePersonagem").value,
        nivel: document.getElementById("nivelPersonagem").value,
        classe: document.getElementById("classePersonagem").value,
        // Adicione outras propriedades do personagem aqui
    };
    localStorage.setItem("personagem", JSON.stringify(personagem));
}

// Função para carregar os dados do personagem
function carregarPersonagem() {
    var personagem = JSON.parse(localStorage.getItem("personagem"));
    if (personagem) {
        document.getElementById("nomePersonagem").value = personagem.nome;
        document.getElementById("nivelPersonagem").value = personagem.nivel;
        document.getElementById("classePersonagem").value = personagem.classe;
        // Carregue outras propriedades do personagem aqui
    }
}

// Event listener para o formulário de salvar personagem
document.getElementById("formPersonagem").addEventListener("submit", function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    salvarPersonagem(); // Salva os dados do personagem
    alert("Personagem salvo com sucesso!"); // Exibe uma mensagem de confirmação
});

// Chame a função para carregar o personagem quando a página é carregada
window.onload = function() {
    carregarPersonagem();
    calcularBonus();
    var inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(function(input) {
        input.addEventListener('input', calcularBonus);
    });
};