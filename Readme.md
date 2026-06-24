🎭 Playwright TypeScript Boilerplate

Boilerplate completo para automação de testes E2E com Playwright e TypeScript. Configuração pronta para uso, seguindo boas práticas de testes automatizados.

📋 Pré-requisitos
Node.js 18+
npm (ou yarn / pnpm)
🚀 Instalação
# Clone o repositório
git clone https://github.com/TestBeyond/playwright-typescript.git
cd playwright-typescript

# Instale as dependências
npm install

# Instale os browsers do Playwright
npx playwright install
🧪 Executando os Testes
# Todos os testes
npx playwright test

# Testes E2E (usando tag @e2e)
npx playwright test --grep @e2e

# Modo verbose
npx playwright test --reporter=list

# Modo headed (browser visível)
npx playwright test --headed

# Browser específico
npx playwright test --project=chromium

# Teste específico
npx playwright test tests/e2e/landing-page.spec.ts
📁 Estrutura do Projeto
playwright-typescript/
├── tests/
│   ├── e2e/
│   │   └── landing-page.spec.ts   # Testes end-to-end
│   └── example.spec.ts
├── pages/                         # Page Objects (opcional)
├── playwright.config.ts          # Configuração do Playwright
├── package.json                   # Dependências Node.js
├── tsconfig.json                  # Configuração TypeScript
└── README.md
🔧 Configuração
playwright.config.ts
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
Variáveis de Ambiente (opcional)
BASE_URL=https://testbeyond.com
HEADLESS=true
📝 Exemplo de Teste
import { test, expect } from '@playwright/test';

test('home @e2e', async ({ page }) => {
  await page.goto('https://testbeyond.com');

  await expect(page).toHaveTitle('Projeto TestBeyond');
});
🐛 Debug
# Modo debug com Playwright Inspector
PWDEBUG=1 npx playwright test

# Executar com trace
npx playwright test --trace on

# Pausar no código
await page.pause();
📦 Dependências Principais
@playwright/test
typescript