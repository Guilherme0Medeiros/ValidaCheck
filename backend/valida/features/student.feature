Feature: Funcionalidades do Estudante
  Para validar horas complementares
  Como Estudante
  Quero submeter e acompanhar minhas atividades

  Scenario: Submissão válida
    Given um estudante autenticado
    When ele submete uma atividade com todos os campos obrigatórios
    Then a atividade deve ser criada com status "Enviado"

  Scenario: Submissão inválida (sem documento)
    Given um estudante autenticado
    When ele tenta submeter uma atividade sem documento
    Then a atividade não deve ser criada
    And deve aparecer o erro "Documento obrigatório"

  Scenario: Acompanhamento de submissões
    Given um estudante com atividades em diferentes estados
    When ele consulta sua linha do tempo
    Then ele deve ver os status "Enviado", "Em análise" e "Aprovado"
