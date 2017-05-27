import { browser, by, element } from 'protractor';

export class CoSHomePage {
  private readonly mainBodyId: string = "cos-index-main";

  /**
   * Navigates the page to the path provided.
   * 
   * @param path - The url path
   * 
   * @return - The browser configuration to render the path.
   */
  navigateTo(path: string) {
    return browser.get(path);
  }

  /**
   * This fetches an element from the page by its CSS id.
   * 
   * @param id - The desired element's id. CoS follow a naming convention to
   *   guarentee each id has a unique, recognizable name.
   */
  getElementById(id: string) {
    return browser.driver.sleep(5).then(() => {
      return element(by.id(id));
    });
  }
}
