import { product, order, buyer } from "../config/test-data";
import { authenticatedTest as test, expect } from "../fixtures/test-options";

test.describe("Checkout", () => {
  test.beforeEach(async ({ cartPage }) => {
    await cartPage.removeAllItems();
  });

  test("CT003 - Fluxo completo de compra com usuário autenticado", async ({
    homePage,
    searchResultsPage,
    productPage,
    cartPage,
    personalDataStep,
    shippingStep,
    paymentStep,
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
    await productPage.expectLoadedFor(
      product.searchTerm,
      product.expectedPrice,
    );

    await productPage.addToCart();

    await cartPage.continuePurchase();
    await personalDataStep.fillAndContinue(buyer);
    await shippingStep.fillAndContinue(buyer);

    await paymentStep.expectLoaded();
    await paymentStep.selectPix();
    await paymentStep.expectOrderTotals(
      product.expectedPrice,
      order.expectedFreight,
      order.expectedTotalFinal,
    );
  });
});
