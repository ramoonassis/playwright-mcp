import { test, expect, type Locator, type Page } from "@playwright/test";
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
const EXPECTED_FREIGHT = requiredEnv("EXPECTED_FREIGHT");
const EXPECTED_TOTAL_FINAL = requiredEnv("EXPECTED_TOTAL_FINAL");
const FIRST_NAME = requiredEnv("FIRST_NAME");
const LAST_NAME = requiredEnv("LAST_NAME");
const CPF = requiredEnv("CPF");
const PHONE = requiredEnv("PHONE");
const CEP = requiredEnv("CEP");
const ADDRESS_NUM = requiredEnv("ADDRESS_NUM");

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
    await expect(removeButton.first()).toBeHidden();
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

  await page.getByRole("button", { name: "110V" }).click();

  const buyButton = page.getByRole("button", {
    name: "Comprar",
    exact: true,
  });

  await expect(buyButton.first()).toBeEnabled();
  await buyButton.first().click();

  await expect(
    page.getByText("Antes de prosseguir com a compra, confirme a voltagem"),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "110V" })).toBeVisible();
  await page
    .locator("button")
    .filter({ hasText: /^Comprar$/ })
    .nth(1)
    .click();

  await expect(page).toHaveURL(/checkout\/#\/cart/i);
}

export async function clickContinuePurchase(page: Page): Promise<void> {
  const continueButton = page.locator("button.custom-button.buy-button");

  await expect(continueButton).toBeVisible();
  await continueButton.click();
}

export async function choosePixPayment(page: Page): Promise<void> {
  const finalizeButton = page
    .locator("#payment-data-submit")
    .filter({ visible: true });

  const pixOption = page.locator('[data-name="Pix"]');

  await expect(page).toHaveURL(/checkout\/#\/payment/);

  await expect(finalizeButton).toBeVisible();
  await expect(finalizeButton).toBeEnabled();

  await expect(pixOption).toBeVisible();
  await pixOption.click();
}

function orderSummary(page: Page): Locator {
  return page.locator("body");
}
async function waitForStableValue(locator: Locator, stableMs = 500) {
  let lastValue = "";
  let stableSince = Date.now();

  await expect
    .poll(async () => {
      const value = await locator.inputValue();

      if (value !== lastValue) {
        lastValue = value;
        stableSince = Date.now();
      }

      return Date.now() - stableSince >= stableMs;
    })
    .toBe(true);
}

export async function fillPersonalDataAndContinue(page: Page): Promise<void> {
  const firstName = page.locator("#client-first-name");
  const lastName = page.locator("#client-last-name");
  const cpf = page.locator("#client-document");
  const phone = page.locator("#client-phone");

  await waitForStableValue(firstName);
  await waitForStableValue(lastName);
  await waitForStableValue(cpf);
  await waitForStableValue(phone);

  // agora sim preenchimento seguro
  await firstName.fill(FIRST_NAME);
  await lastName.fill(LAST_NAME);
  await cpf.fill(CPF);
  await phone.fill(PHONE);

  const goToShipping = page.locator("#go-to-shipping");

  await expect(goToShipping).toBeEnabled();
  await goToShipping.click();
}
export async function fillShippingDataAndGoToPayment(
  page: Page,
): Promise<void> {
  const cep = page.locator("#ship-postalCode");
  const number = page.locator("#ship-number");
  const receiver = page.locator("#ship-receiverName");

  await expect(cep).toBeVisible();
  await cep.fill(CEP);

  await expect(number).toBeVisible();
  await number.fill(ADDRESS_NUM);

  await expect(receiver).toBeVisible();
  await receiver.fill(FIRST_NAME);

  const goToPayment = page.locator("#btn-go-to-payment");

  await expect(goToPayment).toBeEnabled();
  await goToPayment.click();
}

test("CT003 - Fluxo completo de compra com usuário autenticado", async ({
  page,
}) => {
  await loginWithEmailAndPassword(page);
  await clearCart(page);

  await searchProductFromHome(page);
  await addProductToCart(page);

  await clickContinuePurchase(page);

  await fillPersonalDataAndContinue(page);

  await fillShippingDataAndGoToPayment(page);

  await choosePixPayment(page);

  const summary = orderSummary(page);

  await expect(summary).toContainText(EXPECTED_PRICE);
  await expect(summary).toContainText(EXPECTED_FREIGHT);
  await expect(summary).toContainText(EXPECTED_TOTAL_FINAL);
});
