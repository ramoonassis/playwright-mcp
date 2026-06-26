import { test, expect, type Page, type Locator } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável obrigatória não encontrada: ${name}`);
  }

  return value;
}

const TEST_USER_EMAIL = requiredEnv("TEST_USER_EMAIL");
const TEST_USER_PASSWORD = requiredEnv("TEST_USER_PASSWORD");
const SEARCH_TERM = requiredEnv("SEARCH_TERM");
const PRODUCT_LINK_NAME = requiredEnv("PRODUCT_LINK_NAME");
const EXPECTED_PRICE = requiredEnv("EXPECTED_PRICE");

async function loginWithEmailAndPassword(page: Page): Promise<void> {
  await page.goto("/");

  await page.getByRole("link", { name: "Minha Conta" }).click();

  await expect(page).toHaveURL(/login|account/i);

  await page.getByPlaceholder("E-mail").fill(TEST_USER_EMAIL);
  await page.getByPlaceholder("Senha").fill(TEST_USER_PASSWORD);
  await page.getByRole("button", { name: "Entrar", exact: true }).click();

  await expect(page).toHaveURL(/account#\/minha-conta/i);
}

async function clearCart(page: Page): Promise<void> {
  await page.goto("/checkout/#/cart");

  const removeButton = page.getByRole("button", { name: "Remover" });

  while (
    await removeButton
      .first()
      .isVisible()
      .catch(() => false)
  ) {
    await removeButton.first().click();

    await page.waitForTimeout(1000);
  }
}

async function searchProductFromHome(page: Page): Promise<void> {
  await page.goto("/");

  const search = page
    .getByPlaceholder("Procure produtos KitchenAid")
    .filter({ visible: true });

  await expect(search).toBeVisible();

  await search.fill(SEARCH_TERM);
  await search.press("Enter");

  await expect(page).toHaveURL(/map=ft/i);

  const productLink = page.getByRole("link", {
    name: PRODUCT_LINK_NAME,
  });

  await expect(productLink).toBeVisible();

  await expect(productLink.locator("xpath=ancestor-or-self::a")).toContainText(
    EXPECTED_PRICE,
  );
}

async function addProductToCart(page: Page): Promise<void> {
  await page
    .getByRole("link", {
      name: PRODUCT_LINK_NAME,
    })
    .click();

  await expect(page).toHaveURL(/kea30cq\/p|stand-mixer/i);

  await expect(
    page.getByRole("heading", { level: 1 }).filter({ hasText: SEARCH_TERM }),
  ).toBeVisible();

  await expect(page.getByText(EXPECTED_PRICE)).toBeVisible();

  const voltage110v = page.getByRole("button", {
    name: "110V",
  });

  if (!(await voltage110v.getAttribute("aria-pressed"))) {
    await voltage110v.click();
  }

  const buyButton = page.getByRole("button", {
    name: "Comprar",
    exact: true,
  });

  await expect(buyButton.first()).toBeEnabled();
  await buyButton.first().click();

  const voltageModal = page.getByText(
    "Antes de prosseguir com a compra, confirme a voltagem",
  );

  if (await voltageModal.isVisible().catch(() => false)) {
    await page
      .locator("button")
      .filter({ hasText: /^Comprar$/ })
      .nth(1)
      .click();
  }

  await expect(page).toHaveURL(/checkout\/#\/cart/i);
}

function orderSummary(page: Page): Locator {
  return page.locator("body");
}

test("CT004 - Remover produto do carrinho", async ({ page }) => {
  // Login
  await loginWithEmailAndPassword(page);

  // Estado inicial limpo
  await clearCart(page);

  // Adiciona produto ao carrinho
  await searchProductFromHome(page);
  await addProductToCart(page);

  // Valida produto presente no carrinho
  const summary = orderSummary(page);

  await expect(summary).toContainText(SEARCH_TERM);

  // Remove produto
  const removeButton = page.getByRole("button", {
    name: "Remover",
  });

  await expect(removeButton.first()).toBeVisible();
  await removeButton.first().click();

  // Caso exista modal de confirmação
  const confirmRemoveButton = page.getByRole("button", {
    name: /confirmar|sim|remover/i,
  });

  if (await confirmRemoveButton.isVisible().catch(() => false)) {
    await confirmRemoveButton.click();
  }

  // Validação de carrinho vazio
  await expect(summary).not.toContainText(SEARCH_TERM);

  await expect(summary).toContainText(
    /carrinho vazio|seu carrinho está vazio/i,
  );
});
