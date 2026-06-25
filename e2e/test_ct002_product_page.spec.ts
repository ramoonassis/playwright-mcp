import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável obrigatória não encontrada: ${name}`);
  }

  return value;
}

const SEARCH_TERM = requiredEnv("SEARCH_TERM");
const PRODUCT_LINK_NAME = requiredEnv("PRODUCT_LINK_NAME");
const EXPECTED_PRICE_TEXT = requiredEnv("EXPECTED_PRICE_TEXT");

test("CT002 - Acesso à página do produto", async ({ page }) => {
  await page.goto("/");

  const search = page
    .getByPlaceholder("Procure produtos KitchenAid")
    .filter({ visible: true });

  await expect(search).toBeVisible();

  await search.fill(SEARCH_TERM);
  await search.press("Enter");

  const productLink = page.getByRole("link", {
    name: PRODUCT_LINK_NAME,
  });

  await expect(productLink).toBeVisible();

  await productLink.click();

  await expect(page).toHaveURL(/kea30cq/i);

  const title = page.getByRole("heading", {
    level: 1,
  });

  await expect(title).toBeVisible();
  await expect(title).toContainText(SEARCH_TERM);

  await expect(page.getByText(EXPECTED_PRICE_TEXT)).toBeVisible();

  const buyButton = page.getByRole("button", {
    name: /comprar/i,
  });

  await expect(buyButton).toBeVisible();
  await expect(buyButton).toBeEnabled();

  await page.screenshot({
    path: "test-results/evidence/ct002-product-page.png",
    fullPage: true,
  });
});
