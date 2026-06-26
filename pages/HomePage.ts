import { expect, type Locator, type Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly myAccountLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page
      .getByPlaceholder("Procure produtos KitchenAid")
      .filter({ visible: true });
    this.myAccountLink = page.getByRole("link", { name: "Minha Conta" });
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  async searchFor(term: string): Promise<void> {
    await expect(this.searchInput).toBeVisible();
    await this.searchInput.fill(term);
    await this.searchInput.press("Enter");
    await expect(this.page).toHaveURL(/map=ft/i);
  }

  async goToLogin(): Promise<void> {
    await this.myAccountLink.click();
    await expect(this.page).toHaveURL(/login|account/i);
  }
}
