import { browser, by, element } from 'protractor';

export class CoSHomePage {
  private readonly mainBodyId: string = "cos-index-main";
  navigateTo() {
    return browser.get('/');
  }

  getEntryElement() {
    return element(by.id("cos-index-main"));
  }
}
