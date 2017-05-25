import { CoSHomePage } from './cos.po';

describe('CoS main page', () => {
  let page: CoSHomePage;

  beforeEach(() => {
    page = new CoSHomePage();
  });

  it('Should display the main CoS entry point.', () => {
    page.navigateTo();
    expect(page.getEntryElement().isDisplayed()).toBeTruthy();
  });
});
