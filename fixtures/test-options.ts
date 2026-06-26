import { test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { SearchResultsPage } from "../pages/SearchResultsPage";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";
import { PersonalDataStep } from "../pages/checkout/PersonalDataStep";
import { ShippingStep } from "../pages/checkout/ShippingStep";
import { PaymentStep } from "../pages/checkout/PaymentStep";
import { credentials } from "../config/test-data";

interface Pages {
  homePage: HomePage;
  loginPage: LoginPage;
  searchResultsPage: SearchResultsPage;
  productPage: ProductPage;
  cartPage: CartPage;
  personalDataStep: PersonalDataStep;
  shippingStep: ShippingStep;
  paymentStep: PaymentStep;
}

/**
 * `test` "base" — entrega os Page Objects prontos para qualquer teste,
 * mas NÃO faz login. Use para CT001/CT002, que não precisam de usuário
 * autenticado.
 */
export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  searchResultsPage: async ({ page }, use) => use(new SearchResultsPage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  personalDataStep: async ({ page }, use) => use(new PersonalDataStep(page)),
  shippingStep: async ({ page }, use) => use(new ShippingStep(page)),
  paymentStep: async ({ page }, use) => use(new PaymentStep(page)),
});

/**
 * `authenticatedTest` — igual ao `test` acima, mas a `page` que o teste
 * recebe já chega LOGADA. Use para CT003/CT004.
 *
 * Atenção ao ciclo de dependência: esta fixture sobrescreve `page`, então
 * ela NÃO PODE depender das fixtures `homePage`/`loginPage` (que por sua
 * vez dependem de `page` → ciclo). Por isso aqui instanciamos
 * `new HomePage(page)` e `new LoginPage(page)` diretamente, usando o
 * `page` cru recebido como parâmetro — sem passar pelas fixtures.
 */
export const authenticatedTest = test.extend<Pages>({
  page: async ({ page }, use) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await homePage.goto();
    await homePage.goToLogin();
    await loginPage.loginWith(credentials.email, credentials.password);

    await use(page);
  },
});

export { expect } from "@playwright/test";
