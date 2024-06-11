function calcularBonus() {
    var stats = ["forca", "agilidade", "vigor", "inteligencia", "sabedoria", "carisma"];
    var bonuses = [
      "forca_race_bonus", "agilidade_race_bonus", "vigor_race_bonus",
      "inteligencia_race_bonus", "sabedoria_race_bonus", "carisma_race_bonus",
      "forca_class_bonus", "agilidade_class_bonus", "vigor_class_bonus",
      "inteligencia_class_bonus", "sabedoria_class_bonus", "carisma_class_bonus"
    ];
  
    var values = $.map(stats, function(stat) {
      return parseInt($("#" + stat).val()) || 0;
    });
    var bonusValues = $.map(bonuses, function(bonus) {
      return parseInt($("#" + bonus).val()) || 0;
    });
  
    var bba = Math.floor((values[0] + values[1] + bonusValues[0] + bonusValues[1] + bonusValues[6] + bonusValues[7]) / 3);
    var reflexos = Math.floor((values[1] + values[3] + bonusValues[1] + bonusValues[3] + bonusValues[7] + bonusValues[9]) / 3);
    var resistencia = Math.floor((values[0] + values[2] + bonusValues[0] + bonusValues[2] + bonusValues[6] + bonusValues[8]) / 3);
    var bbm = Math.floor((values[3] + values[4] + bonusValues[3] + bonusValues[4] + bonusValues[9] + bonusValues[10]) / 3);
    var raciocinio = Math.floor((values[1] + values[3] + bonusValues[1] + bonusValues[3] + bonusValues[7] + bonusValues[9]) / 3);
    var manipulacao = Math.floor((values[5] + values[4] + bonusValues[5] + bonusValues[4] + bonusValues[11] + bonusValues[10]) / 3);
  
    // Salvar os dados do personagem no armazenamento local
    salvarPersonagem();
  
    // Atualiza os elementos de texto com os valores calculados
    $("#bba").text("B.B.A: " + bba);
    $("#reflexos").text("Reflexos: " + reflexos);
    $("#resistencia").text("Resistência: " + resistencia);
    $("#bbm").text("B.B.M: " + bbm);
    $("#raciocinio").text("Raciocínio: " + raciocinio);
    $("#manipulacao").text("Manipulação: " + manipulacao);
  }
  
  // Função para salvar os dados do personagem
  function salvarPersonagem() {
    var personagem = {
      nome: $("#nomePersonagem").val(),
      nivel: $("#nivelPersonagem").val(),
      classe: $("#classePersonagem").val(),
      // Adicione outras propriedades do personagem aqui
    };
    localStorage.setItem("personagem", JSON.stringify(personagem));
  }
  
  // Função para carregar os dados do personagem
  function carregarPersonagem() {
    var personagem = JSON.parse(localStorage.getItem("personagem"));
    if (personagem) {
      $("#nomePersonagem").val(personagem.nome);
      $("#nivelPersonagem").val(personagem.nivel);
      $("#classePersonagem").val(personagem.classe);
      // Carregue outras propriedades do personagem aqui
    }
  }
  
  // Event listener para o formulário de salvar personagem
  $("#formPersonagem").submit(function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    salvarPersonagem(); // Salva os dados do personagem
    alert("Personagem salvo com sucesso!"); // Exibe uma mensagem de confirmação
  });
  
  // Chame a função para carregar o personagem quando a página é carregada
  $(function() {
    carregarPersonagem();
    calcularBonus();
    $('input[type="number"]').on('input', calcularBonus);
  });
  