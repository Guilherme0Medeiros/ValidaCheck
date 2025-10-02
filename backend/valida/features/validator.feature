Feature: Funcionalidades da Coordenação
  Para gerenciar atividades complementares
  Como Validador
  Quero aprovar, ajustar, indeferir e solicitar complementação

  Scenario: Fila de análise com filtro
    Given um validador autenticado
    And existem atividades nos estados "Enviado" e "Em análise"
    When ele filtra por status "Em análise"
    Then a lista deve conter apenas atividades "Em análise"

  Scenario: Aprovar sem ajuste
    Given uma atividade "Em análise" com 20 horas solicitadas
    And um validador autenticado
    When ele aprova concedendo 20 horas
    Then o status deve ser "Aprovado"
    And as horas concedidas devem ser 20

  Scenario: Aprovar com ajuste
    Given uma atividade "Em análise" com 20 horas solicitadas
    And um validador autenticado
    When ele aprova concedendo 10 horas
    Then o status deve ser "Aprovado com ajuste"
    And as horas concedidas devem ser 10

  Scenario: Indeferir atividade
    Given uma atividade "Em análise" com 10 horas solicitadas
    And um validador autenticado
    When ele indeferir a atividade com motivo "Documento inválido"
    Then o status deve ser "Indeferido"
    And o motivo deve conter "Documento inválido"

  Scenario: Solicitar complementação
    Given uma atividade "Em análise" com 15 horas solicitadas
    And um validador autenticado
    When ele solicitar complementação com checklist
    Then o status deve ser "Complementação solicitada"
    And o estudante deve receber uma notificação
