import { test, expect } from "@playwright/test";

const SEARCH_TERM =
  process.env.SEARCH_TERM ?? "Batedeira KitchenAid Artisan Mineral Water";
const EXPECTED_PRICE = process.env.EXPECTED_PRICE ?? "R$ 2.399,00";

test("CT001 - Busca de produto com sucesso", async ({ page }) => {
  await page.goto("/");

  const search = page.getByPlaceholder("Procure produtos KitchenAid").first();
  await expect(search).toBeVisible();

  await search.fill(SEARCH_TERM);
  await search.press("Enter");

  // Localiza o card do produto específico e valida nome + preço dentro do mesmo card
  const productCard = page.locator("article", { hasText: SEARCH_TERM }).first();
  await expect(
    productCard.getByText(SEARCH_TERM, { exact: false }),
  ).toBeVisible();
  await expect(
    productCard.getByText(EXPECTED_PRICE, { exact: false }),
  ).toBeVisible();
});
