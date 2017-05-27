import { CoSHomePage } from './cos.po';

/**
 * Use this as a proof of concept for now. We don't really have many features
 * that require e2e testing yet but it's great that we have travis configured
 * as a test runner for us!
 */
describe('CoS main page', () => {
  let page: CoSHomePage;

  beforeEach(() => {
    page = new CoSHomePage();
  });

  it('should display the main CoS entry point', () => {
    page.navigateTo("/").then(() => {
      page.getElementById("cos-index-main").then((result) => {
        expect(result.isDisplayed).toBeTruthy();
      })
    });
  });

  it('should display a the custom navbar', () => {
    page.navigateTo("/").then(() => {
      page.getElementById("cos-navbar").then((result) => {
        expect(result.isDisplayed).toBeTruthy();
      })
    });
  });

  it('should display the registration form when given the proper URL', () => {
    page.navigateTo("/cos-register").then(() => {
      page.getElementById("cos-register-user").then((result) => {
        expect(result.isDisplayed).toBeTruthy();
      })
    });
  });

  it('should display the login form when given the proper URL', () => {
    page.navigateTo("/cos-login").then(() => {
      page.getElementById("cos-login").then((result) => {
        expect(result.isDisplayed).toBeTruthy();
      })
    });
  });

  it('clicking on the Register button should take user to registartion form', () => {
    page.navigateTo("/").then(() => {
      page.getElementById("cos-navbar-login-button").then((element) => {
        expect(element).toBeTruthy();
        element.click().then(() => {
          page.getElementById("cos-login").then((result) => {
            expect(element).toBeTruthy();
          })
        })
      });
    });
  });

  it('clicking on the Login button should take user to the login form', () => {
    page.navigateTo("/").then(() => {
      page.getElementById("cos-navbar-register-button").then((element) => {
        expect(element).toBeTruthy();
        element.click().then(() => {
          page.getElementById("cos-register-user").then((result) => {
            expect(element).toBeTruthy();
          })
        })
      });
    });
  })
});