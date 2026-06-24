📄 Documentação BDD - KitchenAid
🌐 Ambiente

URL: https://www.kitchenaid.com.br/

📦 Massa de Dados
Produto
Campo Valor
Produto Batedeira KitchenAid Artisan Mineral Water
Voltagem 110 volts
Valor Esperado R$ 2.399,00
Usuário

As credenciais devem ser obtidas do arquivo .env.

Campo Variável
E-mail ${TEST_USER_EMAIL}
Senha ${TEST_USER_PASSWORD}
🧪 Feature: Fluxo de Busca e Carrinho
Contexto Comum

Background:
Given o sistema KitchenAid está disponível em "https://www.kitchenaid.com.br/"
And o arquivo .env está disponível para leitura
And as credenciais do usuário estão configuradas em:
| campo | variável |
| email | TEST_USER_EMAIL |
| senha | TEST_USER_PASSWORD |

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

CT003 - Adicionar Produto ao Carrinho com Usuário Autenticado
Objetivo

Validar que um usuário autenticado consegue adicionar um produto ao carrinho.

@ct003
Scenario: Adicionar produto ao carrinho com usuário autenticado
When o usuário acessa o site da KitchenAid
And realiza login com email e senha do arquivo .env
And pesquisa por "Batedeira KitchenAid Artisan Mineral Water"
And seleciona o produto nos resultados
And seleciona a variação "110 volts"
And adiciona o produto ao carrinho
And acessa o carrinho de compras
Then o carrinho deve conter o produto
And a quantidade do item deve ser 1
And o valor exibido deve ser "R$ 2.399,00"

CT004 - Remover Produto do Carrinho
Objetivo

Validar que um usuário autenticado consegue remover um produto do carrinho.

Observação

Este cenário cria sua própria massa de dados durante a execução, sem depender de execuções anteriores.

@ct004
Scenario: Remover produto do carrinho
Given o usuário autenticado acessa o site da KitchenAid
And adiciona o produto "Batedeira KitchenAid Artisan Mineral Water" com variação "110 volts" ao carrinho
When o usuário acessa o carrinho de compras
And remove o produto do carrinho
Then o carrinho deve estar vazio ou sem itens exibidos
