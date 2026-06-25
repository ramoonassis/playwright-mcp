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
const EXPECTED_PRICE = requiredEnv("EXPECTED_PRICE");

test("CT001 - Busca de produto com sucesso", async ({ page }) => {
  await page.goto("/");

  const search = page
    .getByPlaceholder("Procure produtos KitchenAid")
    .filter({ visible: true });

  await expect(search).toBeVisible();

  await search.fill(SEARCH_TERM);
  await search.press("Enter");

  const productCard = page.locator("article").filter({ hasText: SEARCH_TERM });

  await expect(productCard).toHaveCount(1);

  await expect(productCard).toContainText(SEARCH_TERM);
  await expect(productCard).toContainText(EXPECTED_PRICE);

  await page.screenshot({
    path: "test-results/evidence/ct001-search-results.png",
    fullPage: true,
  });
});
