import { test, expect } from "../fixtures/test-options";
import { product } from "../config/test-data";

test.describe("Busca de produto", () => {
  test("CT001 - Busca de produto com sucesso", async ({
    homePage,
    searchResultsPage,
  }, testInfo) => {
    await homePage.goto();
    await homePage.searchFor(product.searchTerm);

    const productCard = searchResultsPage.productCard(product.searchTerm);

    await expect(productCard).toHaveCount(1);
    await expect(productCard).toContainText(product.searchTerm);
    await expect(productCard).toContainText(product.expectedPrice);

    await testInfo.attach("ct001-search-results", {
      body: await homePage.page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  });
});
