# 🎭 Playwright TypeScript Boilerplate

Boilerplate completo para automação de testes E2E com Playwright e TypeScript. Configuração pronta para uso, seguindo boas práticas de testes automatizados.

---

## 📋 Pré-requisitos

* Node.js 18+
* npm (ou yarn / pnpm)

---

## 🚀 Instalação

### Clone o repositório

```bash
git clone https://github.com/ramoonassis/playwright-mcp.git
cd playwright-mcp
```

### Instale as dependências

```bash
npm install
```

### Instale os browsers do Playwright

```bash
npx playwright install
```

---

## 🧪 Executando os Testes

### Todos os testes

```bash
npx playwright test
```

### Testes E2E (usando tag @e2e)

```bash
npx playwright test --grep @e2e
```

### Modo verbose

```bash
npx playwright test --reporter=list
```

### Modo headed (browser visível)

```bash
npx playwright test --headed
```

### Browser específico

```bash
npx playwright test --project=chromium
```

### Teste específico

```bash
npx playwright test tests/e2e/landing-page.spec.ts
```

---

## 📁 Estrutura do Projeto

```text
playwright-mcp/
├── tests/
│   ├── e2e/
│   │   └── landing-page.spec.ts
│   └── example.spec.ts
├── pages/
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Descrição

| Arquivo/Pasta        | Descrição                  |
| -------------------- | -------------------------- |
| tests/e2e            | Testes end-to-end          |
| pages                | Page Objects (opcional)    |
| playwright.config.ts | Configuração do Playwright |
| package.json         | Dependências e scripts     |
| tsconfig.json        | Configuração TypeScript    |

---

## 🔧 Configuração

### playwright.config.ts

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  use: {
    baseURL: 'https://testbeyond.com',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
});
```

### Variáveis de Ambiente (opcional)

```env
BASE_URL=https://testbeyond.com
HEADLESS=true
```

---

## 📝 Exemplo de Teste

```typescript
import { test, expect } from '@playwright/test';

test('home @e2e', async ({ page }) => {
  await page.goto('https://testbeyond.com');

  await expect(page).toHaveTitle('Projeto TestBeyond');
});
```

---

## 🐛 Debug

### Modo debug com Playwright Inspector

```bash
PWDEBUG=1 npx playwright test
```

### Executar com trace

```bash
npx playwright test --trace on
```

### Pausar durante a execução

```typescript
await page.pause();
```

---

## 📦 Dependências Principais

* @playwright/test
* typescript

---

## 📄 Licença

Este projeto é destinado para fins de estudo e demonstração de automação de testes com Playwright.
