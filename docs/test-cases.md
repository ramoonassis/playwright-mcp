# Documentação BDD - KitchenAid

Ambiente
URL: https://www.kitchenaid.com.br/

Massa de Dados

Produto

| Campo          | Valor                                      |
| -------------- | ------------------------------------------ |
| Produto        | Batedeira KitchenAid Artisan Mineral Water |
| Voltagem       | 110 volts                                  |
| Valor Esperado | R$ 2.399,00                                |

Usuário

As credenciais devem ser obtidas do arquivo .env.

| Campo  | Variável              |
| ------ | --------------------- |
| E-mail | ${TEST_USER_EMAIL}    |
| Senha  | ${TEST_USER_PASSWORD} |

Dados de Checkout (.env)

| Campo         | Variável       |
| ------------- | -------------- |
| Primeiro nome | ${FIRST_NAME}  |
| Sobrenome     | ${LAST_NAME}   |
| CPF           | ${CPF}         |
| Telefone      | ${PHONE}       |
| CEP           | ${CEP}         |
| Número        | ${ADDRESS_NUM} |

Feature: Fluxo de Busca, Carrinho e Checkout

Contexto Comum

Background:
Given o sistema KitchenAid está disponível em "https://www.kitchenaid.com.br/"
And o arquivo .env está disponível para leitura
And as credenciais do usuário estão configuradas em:
| campo | variável |
| email | TEST_USER_EMAIL |
| senha | TEST_USER_PASSWORD |

---

CT001 - Busca de Produto com Sucesso

Objetivo
Validar que o usuário consegue localizar um produto através da busca e visualizar seu valor.

@ct001
Scenario: Busca de produto com sucesso

When o usuário acessa o site da KitchenAid
And localiza o campo de busca
And pesquisa por "Batedeira KitchenAid Artisan Mineral Water"

Then a página de resultados deve ser exibida
And o produto deve aparecer na lista de resultados
And o valor do produto deve ser "R$ 2.399,00"

---

CT002 - Acesso à Página do Produto

Objetivo
Validar que o usuário consegue acessar a página de detalhes do produto.

@ct002
Scenario: Acesso à página do produto

Given o usuário pesquisou por "Batedeira KitchenAid Artisan Mineral Water"

When o usuário seleciona o produto nos resultados

Then a página de detalhes do produto deve ser exibida
And o nome do produto deve estar correto
And o valor do produto deve ser "R$ 2.399,00"
And o botão "Comprar" deve estar visível e habilitado

---

CT003 - Fluxo Completo de Compra com Usuário Autenticado

Objetivo
Validar o fluxo completo de compra até pagamento via Pix, incluindo cálculo de frete.

@ct003
Scenario: Fluxo completo de compra com usuário autenticado

Given que o usuário acessa o site da KitchenAid
When acessa "Minha Conta" e realiza login utilizando email e senha do arquivo .env
And informa as credenciais nos campos de email e senha
And clica em "Entrar"
Then o usuário é autenticado com sucesso
And é deve se redirecionar para a página inicial
And acessa a listagem de produtos
And realiza a busca por "Batedeira KitchenAid Artisan Mineral Water"
And seleciona o produto nos resultados da pesquisa
And clica em "Comprar" na página do produto
And seleciona a variação "110 volts" no modal de variações
And confirma a compra clicando em "Comprar" no modal
And acessa o carrinho de compras

Then o carrinho deve exibir apenas o subtotal do produto
And o total final ainda não deve incluir frete

When o usuário clica em "Continuar compra"

And preenche os dados pessoais:
| Primeiro nome | ${FIRST_NAME} |
| Último nome | ${LAST_NAME} |
| CPF | ${CPF} |
| Telefone | ${PHONE} |

And clica em "Ir para entrega"

And preenche o endereço:
| cep | ${CEP} |
| numero | ${ADDRESS_NUM} |

And clica em "Ir para pagamento"

And seleciona a forma de pagamento "Pix"

Then valida que o resumo do pagamento está correto:
| valor_produto | R$ 2.399,00 |
| frete | R$ 19,90 |
| total_final | R$ 2.418,90 |

---

CT004 - Remover Produto do Carrinho

Objetivo
Validar que um usuário autenticado consegue remover um produto do carrinho.

@ct004
Scenario: Remover produto do carrinho

Given o usuário autenticado acessa o site da KitchenAid
And adiciona o produto "Batedeira KitchenAid Artisan Mineral Water" com variação "110 volts" ao carrinho

When o usuário acessa o carrinho de compras
And remove o produto do carrinho

Then o carrinho deve estar vazio ou sem itens exibidos
