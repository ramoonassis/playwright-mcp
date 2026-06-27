import { test, expect } from "../fixtures/test-options";
import { product } from "../config/test-data";

test.describe("Página do produto", () => {
  test("@e2e @smoke - CT002 - Acesso à página do produto", async ({
    homePage,
    searchResultsPage,
    productPage,
  }, testInfo) => {
    await homePage.goto();
    await homePage.searchFor(product.searchTerm);

    await searchResultsPage.openProduct(product.productLinkName);
    await productPage.expectLoadedFor(
      product.searchTerm,
      product.expectedPriceText,
    );
    await productPage.expectBuyButtonReady();

    await testInfo.attach("ct002-product-page", {
      body: await homePage.page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  });
});
