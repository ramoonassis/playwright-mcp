# Testes Automatizados - KitchenAid

Projeto de automação de testes do site da KitchenAid, utilizando **Playwright** e **TypeScript**.

Os testes simulam o uso real do site: buscar um produto, fazer login, adicionar e remover itens do carrinho, e concluir uma compra. Cada cenário verifica se o comportamento da aplicação corresponde ao esperado.

---

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm (instalado junto com o Node.js)

---

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/ramoonassis/playwright-mcp.git
cd playwright-mcp
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Instale os navegadores utilizados pelo Playwright

```bash
npx playwright install
```

### 4. Configure o arquivo `.env`

Nenhum dado de teste fica fixo no código (credenciais, preços, URLs, etc.). Todos os valores são lidos de um arquivo `.env` na raiz do projeto.

Crie um arquivo `.env` com o seguinte conteúdo, ajustando os valores conforme o ambiente testado:

```env
BASE_URL=https://www.kitchenaid.com.br

TEST_USER_EMAIL=seu-email@exemplo.com
TEST_USER_PASSWORD=sua-senha

SEARCH_TERM=Batedeira KitchenAid Artisan Mineral Water
PRODUCT_LINK_NAME=Batedeira KitchenAid Artisan Mineral Water
EXPECTED_PRICE=R$ 2.399,00

EXPECTED_FREIGHT=R$ 19,90
EXPECTED_TOTAL_FINAL=R$ 2.418,90

FIRST_NAME=Maria
LAST_NAME=Silva
CPF=00000000000
PHONE=11999999999
CEP=01001000
ADDRESS_NUM=100
```

Caso uma variável obrigatória esteja ausente, o teste falha com uma mensagem indicando qual variável não foi encontrada.

---

## Execução dos testes

### Todos os testes

```bash
npx playwright test
```

### Apenas os testes principais (tag @e2e)

```bash
npx playwright test --grep @e2e
```

### Modo headed (com o navegador visível)

```bash
npx playwright test --headed
```

### Teste específico

```bash
npx playwright test e2e/test_ct001_search.spec.ts
```

### Relatório detalhado no terminal

```bash
npx playwright test --reporter=list
```

---

## Estrutura do projeto

```text
.
├── config/          → leitura e organização dos dados de teste (via .env)
├── docs/            → documentação dos cenários de teste
├── e2e/             → arquivos de teste (um por cenário)
├── fixtures/        → configurações reutilizáveis para os testes
├── pages/           → um arquivo por página do site (Page Objects)
└── .env             → credenciais e dados esperados (não versionado)
```

### `config/`

Contém a leitura segura das variáveis de ambiente (`env.ts`) e a organização dos dados utilizados nos testes (`test-data.ts`) — credenciais de login, termo de busca, preço esperado, dados de entrega, entre outros. Os arquivos de teste não acessam o `.env` diretamente; todos os dados passam por este módulo.

### `pages/`

Cada arquivo representa uma página (ou etapa) do site: `HomePage.ts` é a página inicial, `LoginPage.ts` é a tela de login, `ProductPage.ts` é a página do produto, e assim por diante. A pasta `checkout/` contém as etapas do fechamento de pedido (dados pessoais, entrega, pagamento).

Essa separação concentra a lógica de cada página em um único arquivo, de forma que alterações na interface do site exijam ajustes em apenas um lugar.

### `fixtures/`

Define as configurações disponibilizadas automaticamente para os testes. Existem duas variações:

- uma que entrega as páginas já instanciadas, sem autenticação;
- uma que entrega o navegador já com login realizado, para cenários que exigem usuário autenticado.

### `e2e/`

Contém os testes propriamente ditos. Cada arquivo corresponde a um cenário documentado em `docs/`:

| Arquivo                           | Cenário                                                                 |
| --------------------------------- | ----------------------------------------------------------------------- |
| `test_ct001_search.spec.ts`       | Busca de produto e validação do preço exibido                           |
| `test_ct002_product_page.spec.ts` | Acesso à página do produto e validação de nome, preço e botão de compra |
| `test_ct003_checkout.spec.ts`     | Login, compra do produto e fechamento de pedido até o pagamento         |
| `test_ct004_remove.spec.ts`       | Adição e remoção de um produto do carrinho                              |

### `docs/`

- `kitchenaid.feature`: descreve os cenários de teste em formato BDD, em linguagem acessível a quem não lê código.
- `sdet-automator.prompt.md`: diretrizes internas utilizadas na criação dos testes.

---

## Exemplo de teste

```typescript
test("CT001 - Busca de produto com sucesso", async ({
  homePage,
  searchResultsPage,
}) => {
  await homePage.goto();
  await homePage.searchFor(product.searchTerm);

  const productCard = searchResultsPage.productCard(product.searchTerm);

  await expect(productCard).toContainText(product.searchTerm);
  await expect(productCard).toContainText(product.expectedPrice);
});
```

O teste acessa o site, realiza a busca pelo produto e valida que ele aparece nos resultados com o nome e o preço corretos. As esperas são automáticas: o Playwright aguarda os elementos ficarem disponíveis antes de cada verificação, sem necessidade de pausas manuais no código.

---

## Depuração

### Modo de depuração interativo

```bash
PWDEBUG=1 npx playwright test
```

### Execução com rastreamento (trace)

```bash
npx playwright test --trace on
```

### Capturas de tela e vídeo

Em caso de falha, prints e vídeos da execução são gerados automaticamente, conforme configurado em `playwright.config.ts`.

---

## Principais ferramentas utilizadas

- [Playwright](https://playwright.dev/) — framework de testes E2E
- TypeScript — tipagem estática para o código de automação

---

## Sobre

Projeto desenvolvido para fins de estudo e demonstração de automação de testes end-to-end.
