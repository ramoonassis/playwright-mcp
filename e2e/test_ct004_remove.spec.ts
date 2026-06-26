import { authenticatedTest as test, expect } from "../fixtures/test-options";
import { product } from "../config/test-data";

test.describe("Carrinho", () => {
  test.beforeEach(async ({ cartPage }) => {
    await cartPage.removeAllItems();
  });

  test("CT004 - Remover produto do carrinho", async ({
    homePage,
    searchResultsPage,
    productPage,
    cartPage,
  }) => {
    await homePage.goto();
    await homePage.searchFor(product.searchTerm);
    await searchResultsPage.expectProductListedWithPrice(
      product.productLinkName,
      product.expectedPrice,
    );

    await searchResultsPage.openProduct(product.productLinkName);
    await productPage.expectLoadedFor(
      product.searchTerm,
      product.expectedPrice,
    );
    await productPage.addToCart();

    await expect(cartPage.summary).toContainText(product.searchTerm);

    await cartPage.removeFirstItem();

    await expect(cartPage.summary).not.toContainText(product.searchTerm);
    await expect(cartPage.emptyCartMessage).toBeVisible();
  });
});
