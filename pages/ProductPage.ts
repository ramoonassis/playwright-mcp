import { expect, type Page, type Locator } from "@playwright/test";

export class ProductPage {
  constructor(private readonly page: Page) {}

  private get heading(): Locator {
    return this.page.getByRole("heading", { level: 1 });
  }

  private get buyButton(): Locator {
    return this.page.getByRole("button", {
      name: "Comprar",
      exact: true,
    });
  }

  private get voltageModal(): Locator {
    return this.page.locator(".body-modal-voltagem");
  }

  private get voltage110v(): Locator {
    return this.voltageModal.locator('input[id="110V"]');
  }

  private get modalBuyButton(): Locator {
    return this.voltageModal.locator(".buy-button");
  }

  async expectLoadedFor(
    searchTerm: string,
    expectedPrice: string,
  ): Promise<void> {
    await expect(this.page).toHaveURL(/kea30cq/i);

    await expect(this.heading).toBeVisible();
    await expect(this.heading).toContainText(searchTerm);

    await expect(this.page.getByText(expectedPrice)).toBeVisible();
  }

  async expectBuyButtonReady(): Promise<void> {
    await expect(this.buyButton.first()).toBeVisible();
    await expect(this.buyButton.first()).toBeEnabled();
  }

  private async confirmVoltageIfModalIsDisplayed(): Promise<void> {
    const modalVisible = await this.voltageModal.isVisible().catch(() => false);

    if (!modalVisible) {
      return;
    }

    if (await this.voltage110v.isVisible().catch(() => false)) {
      const checked = await this.voltage110v.isChecked();

      if (!checked) {
        await this.voltage110v.check();
      }
    }

    await expect(this.modalBuyButton).toBeVisible();
    await expect(this.modalBuyButton).toBeEnabled();

    await this.modalBuyButton.click();
  }

  async addToCart(): Promise<void> {
    await this.expectBuyButtonReady();

    // Botão da PDP
    await this.buyButton.first().click();

    // Modal de voltagem (quando existir)
    await this.confirmVoltageIfModalIsDisplayed();

    await expect(this.page).toHaveURL(/checkout\/#\/cart/i);
  }
}
