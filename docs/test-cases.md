# 📄 Documentação de Testes - KitchenAid

## 🌐 Ambiente e Dados de Teste

### URL do Sistema

- **Ambiente de Testes:** `https://www.kitchenaid.com.br/`

### 📦 Massa de Dados: Produto

| Campo              | Valor                                                       |
| ------------------ | ----------------------------------------------------------- |
| **Produto**        | Batedeira KitchenAid Artisan Mineral Water - KEA30CQ - 110V |
| **Valor Esperado** | R$ 2.399,00                                                 |

### 🔐 Massa de Dados: Usuário

As credenciais utilizadas nos testes não devem ser armazenadas neste documento.

Os testes devem obter os dados do arquivo `.env` utilizando as seguintes variáveis:

| Campo      | Variável                |
| ---------- | ----------------------- |
| **E-mail** | `${TEST_USER_EMAIL}`    |
| **Senha**  | `${TEST_USER_PASSWORD}` |

**Observação:** Durante a geração e execução dos testes, considerar que o arquivo `.env` será fornecido juntamente com esta documentação.

---

## 🧪 Casos de Teste: Busca e Carrinho

---

### CT001: Busca de Produto com Sucesso

### **Objetivo**

Validar que o usuário consegue localizar o produto desejado através da busca do site e visualizar o preço esperado.

### **Pré-condições**

1. Usuário possui acesso ao site da KitchenAid.
2. O produto está disponível para consulta no catálogo.

| Passo | Ação                                                                            | Resultado Esperado                                           |
| ----- | ------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 1     | Acessar o site da KitchenAid.                                                   | A página inicial é carregada com sucesso.                    |
| 2     | Localizar o campo de busca.                                                     | O campo de busca é exibido e está habilitado para interação. |
| 3     | Informar o termo "Batedeira KitchenAid Artisan Mineral Water - KEA30CQ - 110V". | O termo é preenchido corretamente no campo de busca.         |
| 4     | Executar a busca.                                                               | A página de resultados é exibida.                            |
| 5     | Localizar o produto nos resultados apresentados.                                | O produto é exibido na lista de resultados.                  |
| 6     | Validar o valor exibido para o produto.                                         | O valor apresentado para o produto deve ser **R$ 2.399,00**. |

---

### CT002: Acesso à Página do Produto

### **Objetivo**

Validar que o usuário consegue acessar os detalhes do produto encontrado na busca.

### **Pré-condições**

1. Produto localizado através da busca.
2. Produto disponível para visualização.

| Passo | Ação                                   | Resultado Esperado                                |
| ----- | -------------------------------------- | ------------------------------------------------- |
| 1     | Realizar a busca pelo produto.         | O produto é exibido nos resultados da busca.      |
| 2     | Clicar sobre o produto encontrado.     | A página de detalhes do produto é carregada.      |
| 3     | Validar o nome do produto.             | O nome exibido corresponde ao produto pesquisado. |
| 4     | Validar o valor do produto.            | O valor apresentado deve ser **R$ 2.399,00**.     |
| 5     | Validar a presença do botão "Comprar". | O botão está visível e habilitado.                |

---

### CT003: Adicionar Produto ao Carrinho com Usuário Autenticado

### **Objetivo**

Validar que um usuário autenticado consegue adicionar o produto ao carrinho de compras.

### **Pré-condições**

1. O arquivo `.env` está disponível para leitura durante a execução dos testes.
2. As variáveis `TEST_USER_EMAIL` e `TEST_USER_PASSWORD` estão configuradas com credenciais válidas.
3. O produto está disponível para compra.

| Passo | Ação                                                                                                           | Resultado Esperado                                                    |
| ----- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 1     | Acessar o site da KitchenAid.                                                                                  | A página inicial é carregada com sucesso.                             |
| 2     | Realizar login utilizando as credenciais obtidas das variáveis `${TEST_USER_EMAIL}` e `${TEST_USER_PASSWORD}`. | O usuário é autenticado com sucesso.                                  |
| 3     | Buscar pelo produto "Batedeira KitchenAid Artisan Mineral Water - KEA30CQ - 110V".                             | O produto é exibido nos resultados da busca.                          |
| 4     | Acessar a página do produto.                                                                                   | A página de detalhes é exibida corretamente.                          |
| 5     | Clicar no botão "Adicionar ao Carrinho".                                                                       | O produto é adicionado ao carrinho.                                   |
| 6     | Acessar o carrinho de compras.                                                                                 | O carrinho é exibido ao usuário.                                      |
| 7     | Validar os itens presentes no carrinho.                                                                        | O produto correto está presente no carrinho com quantidade igual a 1. |
| 8     | Validar o valor do item.                                                                                       | O valor exibido para o produto é **R$ 2.399,00**.                     |

---

### CT004: Remover Produto do Carrinho

### **Objetivo**

Validar que um usuário autenticado consegue remover um produto previamente adicionado ao carrinho.

### **Pré-condições**

1. O arquivo `.env` está disponível para leitura durante a execução dos testes.
2. As variáveis `TEST_USER_EMAIL` e `TEST_USER_PASSWORD` estão configuradas com credenciais válidas.
3. O produto "Batedeira KitchenAid Artisan Mineral Water - KEA30CQ - 110V" já foi adicionado ao carrinho.

| Passo | Ação                                                                                                           | Resultado Esperado                                                                |
| ----- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 1     | Acessar o site da KitchenAid.                                                                                  | A página inicial é carregada com sucesso.                                         |
| 2     | Realizar login utilizando as credenciais obtidas das variáveis `${TEST_USER_EMAIL}` e `${TEST_USER_PASSWORD}`. | O usuário é autenticado com sucesso.                                              |
| 3     | Acessar o carrinho de compras.                                                                                 | O carrinho é exibido contendo o produto previamente adicionado.                   |
| 4     | Localizar o produto "Batedeira KitchenAid Artisan Mineral Water - KEA30CQ - 110V".                             | O produto é exibido no carrinho.                                                  |
| 5     | Acionar a opção de remoção do produto.                                                                         | O sistema inicia o processo de remoção do item.                                   |
| 6     | Confirmar a remoção do produto, caso solicitado.                                                               | O produto é removido do carrinho.                                                 |
| 7     | Validar o conteúdo do carrinho após a remoção.                                                                 | O produto não é mais exibido no carrinho.                                         |
| 8     | Validar o estado final do carrinho.                                                                            | O carrinho exibe a mensagem de carrinho vazio ou não apresenta itens cadastrados. |

---
