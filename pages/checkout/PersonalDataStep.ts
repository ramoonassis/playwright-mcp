import { expect, type Locator, type Page } from "@playwright/test";
import type { Buyer } from "../../config/test-data";

async function waitForStableValue(
  locator: Locator,
  stableMs = 500,
): Promise<void> {
  let lastValue = "";
  let stableSince = Date.now();

  await expect
    .poll(async () => {
      const value = await locator.inputValue();
      if (value !== lastValue) {
        lastValue = value;
        stableSince = Date.now();
      }
      return Date.now() - stableSince >= stableMs;
    })
    .toBe(true);
}

export class PersonalDataStep {
  constructor(private readonly page: Page) {}

  private readonly firstName = this.page.locator("#client-first-name");
  private readonly lastName = this.page.locator("#client-last-name");
  private readonly cpf = this.page.locator("#client-document");
  private readonly phone = this.page.locator("#client-phone");
  private readonly goToShipping = this.page.locator("#go-to-shipping");

  async fillAndContinue(buyer: Buyer): Promise<void> {
    // Campos podem ser preenchidos automaticamente pela aplicação (CEP/CPF
    // salvos); esperamos estabilizar antes de sobrescrever.
    await waitForStableValue(this.firstName);
    await waitForStableValue(this.lastName);
    await waitForStableValue(this.cpf);
    await waitForStableValue(this.phone);

    await this.firstName.fill(buyer.firstName);
    await this.lastName.fill(buyer.lastName);
    await this.cpf.fill(buyer.cpf);
    await this.phone.fill(buyer.phone);

    await expect(this.goToShipping).toBeEnabled();
    await this.goToShipping.click();
  }
}
