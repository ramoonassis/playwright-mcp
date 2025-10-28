# 🎭 Playwright Pytest Boilerplate

Boilerplate completo para automação de testes E2E com Playwright e Pytest. Configuração pronta para uso, seguindo as melhores práticas de testes automatizados.

## 📋 Pré-requisitos

- Python 3.11+
- pip

## 🚀 Instalação

```bash
# Clone o repositório
git clone https://github.com/TestBeyond/playwright-pytest.git
cd playwright-pytest

# Instale as dependências
pip install -r requirements.txt

# Instale os browsers
playwright install
```

## 🧪 Executando os Testes

```bash
# Todos os testes
pytest

# Testes E2E específicos
pytest -m e2e

# Com relatório detalhado
pytest -v

# Em modo visual (headed)
pytest --headed

# Em browser específico
pytest --browser firefox

# Teste específico
pytest playwright/e2e/test_landing_page.py::test_landing_page
```

## 📁 Estrutura do Projeto

```
playwright-pytest/
├── playwright/
│   ├── conftest.py              # Configurações do pytest e fixtures
│   └── e2e/
│       └── test_landing_page.py # Testes end-to-end
├── requirements.txt             # Dependências Python
├── pytest.ini                   # Configurações do pytest
└── README.md
```

## 🔧 Configuração

### pytest.ini
```ini
[pytest]
testpaths = playwright
markers =
    e2e: End-to-end tests
```

### Variáveis de Ambiente (opcional)
```bash
BASE_URL=https://testbeyond.com
HEADLESS=true
```

## 📝 Exemplo de Teste

```python
import pytest
from playwright.sync_api import expect

@pytest.mark.e2e
def test_home(page):
    page.goto('https://testbeyond.com')
    expect(page).to_have_title('Projeto TestBeyond')
```

## 🐛 Debug

```bash
# Modo debug com Playwright Inspector
PWDEBUG=1 pytest

# Screenshots e vídeos
pytest --screenshot on --video on

# Pausar no código
page.pause()
```

## 📦 Dependências Principais

- pytest
- pytest-playwright
- playwright

---

**Desenvolvido por Fernando Papito para o Projeto TestBeyond ⚡**

🌐 Site oficial: [https://testbeyond.com](https://testbeyond.com)