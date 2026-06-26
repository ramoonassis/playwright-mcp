import { expect, type Page } from "@playwright/test";
import type { Buyer } from "../../config/test-data";

export class ShippingStep {
  constructor(private readonly page: Page) {}

  private readonly cep = this.page.locator("#ship-postalCode");
  private readonly number = this.page.locator("#ship-number");
  private readonly receiver = this.page.locator("#ship-receiverName");
  private readonly goToPayment = this.page.locator("#btn-go-to-payment");

  async fillAndContinue(buyer: Buyer): Promise<void> {
    await expect(this.cep).toBeVisible();
    await this.cep.fill(buyer.cep);

    await expect(this.number).toBeVisible();
    await this.number.fill(buyer.addressNumber);

    await expect(this.receiver).toBeVisible();
    await this.receiver.fill(buyer.firstName);

    await expect(this.goToPayment).toBeEnabled();
    await this.goToPayment.click();
  }
}
