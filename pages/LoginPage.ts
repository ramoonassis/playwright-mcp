import { expect, type Page } from "@playwright/test";

export class LoginPage {
  constructor(private readonly page: Page) {}

  async loginWith(email: string, password: string): Promise<void> {
    await this.page.getByPlaceholder("E-mail").fill(email);
    await this.page.getByPlaceholder("Senha").fill(password);
    await this.page
      .getByRole("button", { name: "Entrar", exact: true })
      .click();
    await expect(this.page).toHaveURL(/account#\/minha-conta/i);
  }
}
