# language: pt
# =====================================================================
# Documentação BDD - KitchenAid
# Ambiente: https://www.kitchenaid.com.br/
# =====================================================================
#
# REGRAS GERAIS DE EXECUÇÃO (válidas para todos os cenários deste arquivo)
#
# 1. Cada step descreve UMA ÚNICA ação de UI (clicar, preencher, digitar).
#    Não combine intenção e ação no mesmo step
#    (ex.: nunca "realiza login", e sim "preenche o campo X" + "clica no botão Y").
# 2. Antes de clicar em qualquer elemento, confirme que o texto/label do
#    elemento corresponde EXATAMENTE ao descrito no step. Se houver mais de
#    um elemento parecido (ex.: "Entrar" vs. "Entrar com Google"), use
#    apenas o que casa literalmente.
# 3. NUNCA utilize métodos alternativos de login (Google, Facebook, Apple,
#    etc.), mesmo que estejam mais visíveis na tela. Login é sempre via
#    e-mail e senha.
# 4. Todo bloco de ação tem um ponto de partida explícito
#    (ex.: "a partir da página inicial"). Não inicie uma ação a partir de
#    uma tela diferente da indicada.
# 5. Se um elemento esperado não existir na tela atual, PARE a execução e
#    relate o problema em vez de tentar um caminho alternativo por conta
#    própria.
# 6. Aguarde o carregamento completo da página antes de executar o
#    próximo step.
# 7. Quando mais de um valor monetário estiver visível na mesma tela
#    (ex.: preço "De:", preço "Por:" e preço "à vista"), use SOMENTE o
#    valor explicitamente identificado pelo rótulo indicado no step. Nunca
#    capture o primeiro valor monetário encontrado no DOM sem confirmar o
#    rótulo correspondente.
#
# MASSA DE DADOS
#
# Produto:
#   | Campo                     | Valor                                       |
#   | Produto                   | Batedeira KitchenAid Artisan Mineral Water  |
#   | Voltagem                  | 110 volts                                   |
#   | Valor Esperado (à vista)  | R$ 2.399,00                                 |
#
#   Observação sobre o preço: na página do produto podem ser exibidos até
#   três valores diferentes: um preço "De:" (riscado), um preço "Por:"
#   (parcelado/cartão) e um preço "à vista" (Pix, com desconto). O valor
#   esperado em todos os cenários é sempre o preço "à vista", que aparece
#   após o texto "Ou" e em destaque. Não confundir com os demais valores
#   exibidos na mesma tela.
#
# Usuário (credenciais obtidas do arquivo .env):
#   | Campo  | Variável               |
#   | E-mail | ${TEST_USER_EMAIL}     |
#   | Senha  | ${TEST_USER_PASSWORD}  |
#
# Dados de Checkout (.env):
#   | Campo          | Variável        |
#   | Primeiro nome  | ${FIRST_NAME}   |
#   | Sobrenome      | ${LAST_NAME}    |
#   | CPF            | ${CPF}          |
#   | Telefone       | ${PHONE}        |
#   | CEP            | ${CEP}          |
#   | Número         | ${ADDRESS_NUM}  |
#
# =====================================================================

@kitchenaid
Funcionalidade: Fluxo de Busca, Carrinho e Checkout no site KitchenAid
  Como cliente do site da KitchenAid
  Quero buscar produtos, autenticar-me, adicionar/remover itens do carrinho
  e concluir uma compra
  Para validar o fluxo completo de e-commerce do site

  Contexto:
    Dado que o sistema KitchenAid está disponível em "https://www.kitchenaid.com.br/"
    E o arquivo .env está disponível para leitura
    E as credenciais do usuário estão configuradas em:
      | campo | variavel           |
      | email | TEST_USER_EMAIL    |
      | senha | TEST_USER_PASSWORD |

  # ===================================================================
  # CT001 - Busca de Produto com Sucesso
  # Objetivo: validar que o usuário consegue localizar um produto através
  # da busca e visualizar seu valor.
  # ===================================================================
  @ct001
  Cenário: Busca de produto com sucesso
    Dado que o usuário está na página inicial do site da KitchenAid

    Quando clica no campo de busca no topo da página
    E digita "Batedeira KitchenAid Artisan Mineral Water" no campo de busca
    E pressiona Enter ou clica no ícone de busca

    Então a página de resultados é exibida
    E o produto "Batedeira KitchenAid Artisan Mineral Water" aparece na lista de resultados
    # O valor abaixo é o valor em destaque após o texto "Ou".
    # Ignorar eventuais valores "De:" (riscado) ou "Por:" exibidos no mesmo card.
    E o valor "à vista" exibido no card do produto é "R$ 2.399,00"

  # ===================================================================
  # CT002 - Acesso à Página do Produto
  # Objetivo: validar que o usuário consegue acessar a página de
  # detalhes do produto.
  # ===================================================================
  @ct002
  Cenário: Acesso à página do produto
    # Caso não esteja nessa tela, repetir os steps de busca do CT001 antes de continuar.
    Dado que o usuário está na página de resultados de busca por "Batedeira KitchenAid Artisan Mineral Water"

    Quando clica no card/título do produto "Batedeira KitchenAid Artisan Mineral Water" nos resultados

    Então a página de detalhes do produto é exibida
    E o nome do produto exibido é "Batedeira KitchenAid Artisan Mineral Water"
    # Valor em destaque após o texto "Ou". Ignorar o valor "De:" (riscado) e o valor "Por:" exibidos na mesma tela.
    E o valor "à vista" exibido na página do produto é "R$ 2.399,00"
    E o botão "Comprar" está visível e habilitado na página do produto

  # ===================================================================
  # CT003 - Fluxo Completo de Compra com Usuário Autenticado
  # Objetivo: validar o fluxo completo de compra até pagamento via Pix,
  # incluindo cálculo de frete.
  #
  # Nota de validação prévia: antes de executar este cenário, confirmar na
  # tela real se a seleção de voltagem ocorre na página do produto. O site
  # atualmente pode exibir um modal de confirmação de voltagem após o
  # clique em "Comprar"; nesse caso, confirmar a voltagem no modal e
  # clicar em "Comprar" dentro do modal para prosseguir. Se houver
  # divergência significativa no comportamento além desse modal, parar a
  # execução e relatar a divergência (Regra Geral nº 5).
  # ===================================================================
  @ct003
  Cenário: Fluxo completo de compra com usuário autenticado

    # --- Login ---
    Dado que o usuário está na página inicial do site da KitchenAid

    Quando clica em "Minha Conta"
    E preenche o campo "E-mail" com o e-mail do arquivo .env
    E preenche o campo "Senha" com a senha do arquivo .env
    # NÃO clicar em "Entrar com Google", "Entrar com Facebook" ou qualquer outro login social.
    E clica no botão "Entrar"

    Então o usuário é autenticado com sucesso
    E é redirecionado para a página Minha Conta

    # --- Busca do produto ---
    Quando, a partir da página inicial, clica no campo de busca no topo da página
    E digita "Batedeira KitchenAid Artisan Mineral Water" no campo de busca
    E pressiona Enter ou clica no ícone de busca

    Então a página de resultados é exibida

    Quando clica no card/título do produto "Batedeira KitchenAid Artisan Mineral Water" nos resultados

    Então a página de detalhes do produto é exibida

    # --- Seleção de variação e compra ---
    # A seleção de voltagem ocorre diretamente na página do produto, antes do clique em "Comprar".
    E o seletor de voltagem "110v" / "220v" está visível na página do produto

    # Caso a opção "110v" já esteja selecionada por padrão, apenas confirmar a seleção e não clicar novamente.
    Quando seleciona a opção "110v" no seletor de voltagem da página do produto
    E clica no botão "Comprar" na página do produto

    # Se for exibido um modal de confirmação de voltagem após o clique em "Comprar",
    # confirmar a voltagem apresentada e clicar em "Comprar" dentro do modal.
    Quando, se for exibido um modal de confirmação de voltagem, clica no botão "Comprar" dentro do modal

    Então o produto é adicionado ao carrinho

    Quando clica no ícone/link do carrinho de compras

    Então o carrinho é exibido
    E o carrinho mostra apenas o subtotal do produto, sem frete
    E o total final ainda não inclui valor de frete

    # --- Dados pessoais ---
    Quando clica em "Continuar compra"

    Então a tela de dados pessoais é exibida

    Quando dentro do card "Dados pessoais", preenche sequencialmente:
      | campo         | valor          |
      | Primeiro nome | ${FIRST_NAME}  |
      | Último nome   | ${LAST_NAME}   |
      | CPF           | ${CPF}         |
      | Telefone      | ${PHONE}       |

    E valida que não existem mensagens de erro visíveis no card "Dados pessoais"
    E clica no botão "Ir para entrega" dentro da sessão "Dados pessoais"

    Então o botão "Ir para entrega" deve estar habilitado

    # --- Endereço ---
    Então a seção de entrega é exibida
    E os seguintes campos possuem as regras de validação abaixo:
      | campo        | regra        |
      | CEP          | obrigatório  |
      | Destinatário | obrigatório  |

    Quando preenche o campo "CEP" com ${CEP}
    E preenche o campo "Número" com ${ADDRESS_NUM}
    E preenche o campo "Destinatário" com ${FIRST_NAME}
    E valida que não existem mensagens de erro visíveis no card "Entrega"
    E clica em "Ir para pagamento"

    # --- Pagamento ---
    Então a tela de pagamento é exibida

    Quando seleciona a forma de pagamento "Pix"

    Então a sessão "Resumo do Pedido" exibe os seguintes valores:
      | campo         | valor       |
      | valor_produto | R$ 2.399,00 |
      | frete         | R$ 19,90    |
      | total_final   | R$ 2.418,90 |

  # ===================================================================
  # CT004 - Remover Produto do Carrinho
  # Objetivo: validar que um usuário autenticado consegue remover um
  # produto do carrinho.
  #
  # Nota de validação prévia: o site atualmente pode exibir um modal de
  # confirmação de voltagem após o clique em "Comprar". Nesse caso,
  # confirmar a voltagem mostrada e clicar em "Comprar" dentro do modal
  # para prosseguir com o fluxo. Se houver divergência significativa no
  # comportamento além desse modal, parar e relatar a divergência.
  # ===================================================================
  @ct004
  Cenário: Remover produto do carrinho

    # --- Login ---
    Dado que o usuário está na página inicial do site da KitchenAid

    Quando clica em "Minha Conta"
    E preenche o campo "E-mail" com o e-mail do arquivo .env
    E preenche o campo "Senha" com a senha do arquivo .env
    # NÃO clicar em "Entrar com Google", "Entrar com Facebook" ou qualquer outro login social.
    E clica no botão "Entrar"

    Então o usuário é autenticado com sucesso

    # --- Adição do produto ao carrinho ---
    Quando, a partir da página inicial, clica no campo de busca no topo da página
    E digita "Batedeira KitchenAid Artisan Mineral Water" no campo de busca
    E pressiona Enter ou clica no ícone de busca
    E clica no card/título do produto nos resultados

    Então a página de detalhes do produto é exibida

    # A seleção de voltagem ocorre diretamente na página do produto, antes do clique em "Comprar".
    # Caso a opção "110v" já esteja selecionada por padrão, apenas confirmar a seleção e não clicar novamente.
    Quando seleciona a opção "110v" no seletor de voltagem da página do produto
    E clica no botão "Comprar" na página do produto

    # Se for exibido um modal de confirmação de voltagem após o clique em "Comprar",
    # confirmar a voltagem apresentada e clicar em "Comprar" dentro do modal.
    Quando, se for exibido um modal de confirmação de voltagem, clica no botão "Comprar" dentro do modal

    Então o produto é adicionado ao carrinho

    # --- Remoção do produto ---
    Quando clica no ícone/link do carrinho de compras

    Então o carrinho é exibido
    E o produto "Batedeira KitchenAid Artisan Mineral Water" aparece listado no carrinho

    Quando clica no botão/ícone de remover item, referente a esse produto
    E confirma a remoção, caso seja exibido um modal de confirmação

    Então o carrinho está vazio ou exibe a mensagem de carrinho sem itens
