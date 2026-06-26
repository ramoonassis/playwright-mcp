import { expect, type Locator, type Page } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly removeButton: Locator;
  readonly continueButton: Locator;
  readonly emptyCartMessage: Locator;
  readonly summary: Locator;

  constructor(page: Page) {
    this.page = page;
    this.removeButton = page.getByRole("button", { name: "Remover" });
    this.continueButton = page.locator("button.custom-button.buy-button");
    this.emptyCartMessage = page.getByText(
      /carrinho vazio|seu carrinho está vazio/i,
    );
    // Idealmente, substituir por um container escopado:
    // page.getByTestId("cart-summary")
    this.summary = page.locator("body");
  }

  async goto(): Promise<void> {
    await this.page.goto("/checkout/#/cart", {
      waitUntil: "commit",
    });
  }

  async removeAllItems(): Promise<void> {
    await this.goto();

    while (
      await this.removeButton
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await this.removeButton.first().click();
      await expect(this.removeButton.first()).toBeHidden();
    }
  }

  async removeFirstItem(): Promise<void> {
    await expect(this.removeButton.first()).toBeVisible();
    await this.removeButton.first().click();

    const confirmButton = this.page.getByRole("button", {
      name: /confirmar|sim|remover/i,
    });

    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click();
    }
  }

  async continuePurchase(): Promise<void> {
    await expect(this.continueButton).toBeVisible();
    await this.continueButton.click();
  }
}
