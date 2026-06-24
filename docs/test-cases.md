# Documentação BDD - KitchenAid

## Ambiente

URL: https://www.kitchenaid.com.br/

## Regras Gerais de Execução

Estas regras se aplicam a **todos** os cenários abaixo:

1. Cada step descreve **uma única ação de UI** (clicar, preencher, digitar). Não combine intenção e ação no mesmo step (ex.: nunca "realiza login", e sim "preenche o campo X" + "clica no botão Y").
2. Antes de clicar em qualquer elemento, confirme que o texto/label do elemento corresponde **exatamente** ao descrito no step. Se houver mais de um elemento parecido (ex.: "Entrar" vs. "Entrar com Google"), use apenas o que casa literalmente.
3. **Nunca** utilize métodos alternativos de login (Google, Facebook, Apple, etc.), mesmo que estejam mais visíveis na tela. Login é sempre via e-mail e senha.
4. Todo bloco de ação tem um ponto de partida explícito (ex.: "a partir da página inicial"). Não inicie uma ação a partir de uma tela diferente da indicada.
5. Se um elemento esperado não existir na tela atual, **pare a execução e relate o problema** em vez de tentar um caminho alternativo por conta própria.
6. Aguarde o carregamento completo da página antes de executar o próximo step.

## Massa de Dados

### Produto

| Campo          | Valor                                      |
| -------------- | ------------------------------------------ |
| Produto        | Batedeira KitchenAid Artisan Mineral Water |
| Voltagem       | 110 volts                                  |
| Valor Esperado | R$ 2.399,00                                |

### Usuário

As credenciais devem ser obtidas do arquivo `.env`.

| Campo  | Variável              |
| ------ | --------------------- |
| E-mail | ${TEST_USER_EMAIL}    |
| Senha  | ${TEST_USER_PASSWORD} |

### Dados de Checkout (.env)

| Campo         | Variável       |
| ------------- | -------------- |
| Primeiro nome | ${FIRST_NAME}  |
| Sobrenome     | ${LAST_NAME}   |
| CPF           | ${CPF}         |
| Telefone      | ${PHONE}       |
| CEP           | ${CEP}         |
| Número        | ${ADDRESS_NUM} |

---

## Feature: Fluxo de Busca, Carrinho e Checkout

### Contexto Comum

```gherkin
Background:
  Given o sistema KitchenAid está disponível em "https://www.kitchenaid.com.br/"
  And o arquivo .env está disponível para leitura
  And as credenciais do usuário estão configuradas em:
    | campo | variável            |
    | email | TEST_USER_EMAIL     |
    | senha | TEST_USER_PASSWORD  |
```

---

## CT001 - Busca de Produto com Sucesso

**Objetivo**
Validar que o usuário consegue localizar um produto através da busca e visualizar seu valor.

```gherkin
@ct001
Scenario: Busca de produto com sucesso

  Given que o usuário está na página inicial do site da KitchenAid

  When clica no campo de busca no topo da página
  And digita "Batedeira KitchenAid Artisan Mineral Water" no campo de busca
  And pressiona Enter ou clica no ícone de busca

  Then a página de resultados é exibida
  And o produto "Batedeira KitchenAid Artisan Mineral Water" aparece na lista de resultados
  And o valor exibido no card do produto é "R$ 2.399,00"
```

---

## CT002 - Acesso à Página do Produto

**Objetivo**
Validar que o usuário consegue acessar a página de detalhes do produto.

```gherkin
@ct002
Scenario: Acesso à página do produto

  Given que o usuário está na página de resultados de busca por "Batedeira KitchenAid Artisan Mineral Water"
  (caso não esteja, repita os steps de busca do CT001 antes de continuar)

  When clica no card/título do produto "Batedeira KitchenAid Artisan Mineral Water" nos resultados

  Then a página de detalhes do produto é exibida
  And o nome do produto exibido é "Batedeira KitchenAid Artisan Mineral Water"
  And o valor exibido é "R$ 2.399,00"
  And o botão "Comprar" está visível e habilitado na página do produto
```

---

## CT003 - Fluxo Completo de Compra com Usuário Autenticado

**Objetivo**
Validar o fluxo completo de compra até pagamento via Pix, incluindo cálculo de frete.

```gherkin
@ct003
Scenario: Fluxo completo de compra com usuário autenticado

  # --- Login ---
  Given que o usuário está na página inicial do site da KitchenAid

  When clica em "Minha Conta"
  And preenche o campo "E-mail" com o e-mail do arquivo .env
  And preenche o campo "Senha" com a senha do arquivo .env
  And clica no botão "Entrar"
  (NÃO clique em "Entrar com Google", "Entrar com Facebook" ou qualquer outro login social)

  Then o usuário é autenticado com sucesso
  And é redirecionado para a página inicial

  # --- Busca do produto ---
  When, a partir da página inicial, clica no campo de busca no topo da página
  And digita "Batedeira KitchenAid Artisan Mineral Water" no campo de busca
  And pressiona Enter ou clica no ícone de busca

  Then a página de resultados é exibida

  When clica no card/título do produto "Batedeira KitchenAid Artisan Mineral Water" nos resultados

  Then a página de detalhes do produto é exibida

  # --- Seleção de variação e compra ---
  When clica no botão "Comprar" na página do produto

  Then um modal de seleção de variação é exibido

  When seleciona a opção "110 volts" no modal de variações
  And clica no botão "Comprar" dentro do modal
  (este é o botão "Comprar" do modal, diferente do botão "Comprar" da página do produto)

  Then o produto é adicionado ao carrinho

  When clica no ícone/link do carrinho de compras

  Then o carrinho é exibido
  And o carrinho mostra apenas o subtotal do produto, sem frete
  And o total final ainda não inclui valor de frete

  # --- Dados pessoais ---
  When clica em "Continuar compra"

  Then a tela de dados pessoais é exibida

  When preenche o campo "Primeiro nome" com ${FIRST_NAME}
  And preenche o campo "Último nome" com ${LAST_NAME}
  And preenche o campo "CPF" com ${CPF}
  And preenche o campo "Telefone" com ${PHONE}
  And clica em "Ir para entrega"

  # --- Endereço ---
  Then a tela de entrega é exibida

  When preenche o campo "CEP" com ${CEP}
  And preenche o campo "Número" com ${ADDRESS_NUM}
  And clica em "Ir para pagamento"

  # --- Pagamento ---
  Then a tela de pagamento é exibida

  When seleciona a forma de pagamento "Pix"

  Then o resumo do pagamento exibe os seguintes valores:
    | valor_produto | R$ 2.399,00  |
    | frete         | R$ 19,90     |
    | total_final   | R$ 2.418,90  |
```

---

## CT004 - Remover Produto do Carrinho

**Objetivo**
Validar que um usuário autenticado consegue remover um produto do carrinho.

```gherkin
@ct004
Scenario: Remover produto do carrinho

  # --- Login ---
  Given que o usuário está na página inicial do site da KitchenAid

  When clica em "Minha Conta"
  And preenche o campo "E-mail" com o e-mail do arquivo .env
  And preenche o campo "Senha" com a senha do arquivo .env
  And clica no botão "Entrar"
  (NÃO clique em "Entrar com Google", "Entrar com Facebook" ou qualquer outro login social)

  Then o usuário é autenticado com sucesso

  # --- Adição do produto ao carrinho ---
  When, a partir da página inicial, clica no campo de busca no topo da página
  And digita "Batedeira KitchenAid Artisan Mineral Water" no campo de busca
  And pressiona Enter ou clica no ícone de busca
  And clica no card/título do produto nos resultados
  And clica no botão "Comprar" na página do produto

  Then um modal de seleção de variação é exibido

  When seleciona a opção "110 volts" no modal de variações
  And clica no botão "Comprar" dentro do modal

  Then o produto é adicionado ao carrinho

  # --- Remoção do produto ---
  When clica no ícone/link do carrinho de compras

  Then o carrinho é exibido
  And o produto "Batedeira KitchenAid Artisan Mineral Water" aparece listado no carrinho

  When clica no botão/ícone de remover item, referente a esse produto
  And confirma a remoção, caso seja exibido um modal de confirmação

  Then o carrinho está vazio ou exibe a mensagem de carrinho sem itens
```
