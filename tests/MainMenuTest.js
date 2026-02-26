const FormsPage= require ("../pages/FormsPage.js");
const InteractionsPage= require ("../pages/InteractionsPage.js");
const AutomationPracticeFormPage= require("../pages/forms/AutomationPracticeFormPage.js");
const SortablePage = require("../pages/interactions/SortablePage.js");
const {getPageByMenuItem}= require("../utils/PageFactoryUtils.js");
const { expect }= require('chai');


describe ('Main Menu navigation functionality check', function(){
    const mainMenuNames=['Elements', 'Forms', 'Alerts, Frame & Windows', 'Widgets', 'Interactions', 'Book Store Application'];
    const elementsMenuItems=['Text Box', 'Radio Button', 'Check box', 'Web Tables'];
    const formsMenuItem='Practice Form';
    const aFWMenuItems=['Browser Windows', 'Alerts', 'Frames', 'Nested Frames', 'Modal Dialogs'];
    const widgetsMenuItems=['Accordian', 'Auto Complete', 'Date Picker', 'Slider', 'Progress Bar', 'Tabs', 'Tultips', 'Menu', 'Select Menu'];
    const interactionsMenuItems=['Sortable', 'Selectable', 'Resizable', 'Droppable', 'Dragabble'];
    const bookAppMenuItems=['Login', 'Book Store', 'Profile', 'Book Store API'];
    const expectedMessage="Please select an item from left to start practice.";
    /** @type {FormsPage} */
    let homePage, anyPage;
    beforeEach(async function(){
        homePage= this.homePage;
    });
    describe('smoke: Basic redirect from Home page and display', function(){
        it('should check Forms menu default page is displayed', async function(){
            anyPage= await homePage.gotoForms();
            const actualMessage=await anyPage.getFormsPageText();
            expect(actualMessage, 'Actual and expected text on the Forms page do not match').to.be.equal(expectedMessage);
        });
        it('should check Forms menu is expanded after navigating from the Home Page', async function(){
            anyPage= await homePage.gotoForms();
            const isExpanded= await anyPage.menu.isMenuExpanded(mainMenuNames[1]);
            expect(isExpanded, `${mainMenuNames[1]} menu is not expanded`).to.be.true;
        });
        it('should check redirection from Forms menu to Practice Form', async function(){
            anyPage= await homePage.gotoForms();
            const practiceFormPage=await anyPage.gotoPracticeFormMenuItem();
            const actualHeader=await practiceFormPage.getMainHeader();
            expect(actualHeader, 'Actual and expected main headers do not match').to.be.equal(formsMenuItem);
        });
        it('should check Interactions menu default page is displayed', async function(){
            anyPage= await homePage.gotoInteractions();
            const actualMessage=await anyPage.getInteractionsPageText();
            expect(actualMessage, 'Actual and expected text on the Forms page do not match').to.be.equal(expectedMessage);
        });
        it('should check Interactions menu is expanded after navigating from the Home Page', async function(){
            anyPage= await homePage.gotoInteractions();
            const isExpanded= await anyPage.menu.isMenuExpanded(mainMenuNames[4]);
            expect(isExpanded, `${mainMenuNames[4]} menu is not expanded`).to.be.true;
        });
        it('should check redirection from Interactions menu to Droppable', async function(){
            anyPage= await homePage.gotoInteractions();
            const droppablePage= await anyPage.gotoDroppableMenuItem();
            const actualHeader=await droppablePage.getMainHeader();
            expect(actualHeader, 'Actual and expected main headers do not match').to.be.equal(interactionsMenuItems[3]);
        });
        it('should check Book Store Application menu is expanded and Book Store sub-menu is activated', async function(){
            anyPage= await homePage.gotoBookStoreApplication();
            await anyPage.waitLoginButton();
            const isExpanded= await anyPage.menu.isMenuExpanded(mainMenuNames[5]);
            expect(isExpanded, `${mainMenuNames[5]} menu is not expanded`).to.be.true;
            const isActive= await anyPage.menu.isSubMenuItemActive(bookAppMenuItems[1]);
            expect(isActive, `${bookAppMenuItems[1]} sub-menu is not active`).to.be.true;
        });
    });
    describe('smoke: Redirect from one menu page to another menu page', function(){
        it('should check redirection inside one menu- Interactions', async function(){
            anyPage= await homePage.gotoInteractions();
            const droppablePage= await anyPage.gotoDroppableMenuItem();
            await droppablePage.menu.clickMenuItem(mainMenuNames[4], interactionsMenuItems[0]);
            //waitVisible(this.driver, {xpath: "//div[text()='Six']"});
            const sortablePage=await getPageByMenuItem(this.driver, interactionsMenuItems[0]);
            const actualHeader=await sortablePage.getMainHeader();
            expect(actualHeader, `Actual and expected main header of ${interactionsMenuItems[0]} page do not match`).to.be.equal(interactionsMenuItems[0]);
        });
        it('should check redirection from one menu card to sub-menu of another card', async function(){
            anyPage= await homePage.gotoAlertsFrameWindows();
            await anyPage.menu.clickMenuItem(mainMenuNames[4], interactionsMenuItems[3]);
            const droppablePage=await getPageByMenuItem(this.driver, interactionsMenuItems[3]);
            const actualHeader=await droppablePage.getMainHeader();
            expect(actualHeader, `Actual and expected main header of ${interactionsMenuItems[3]} page do not match`).to.be.equal(interactionsMenuItems[3]);
        });
        it('should check redirection from one card sub-menu to sub-menu of another card', async function(){
            anyPage= await homePage.gotoElements();
            const webTablesPage= await anyPage.gotoWebTablesMenuItem();
            await webTablesPage.menu.clickMenuItem(mainMenuNames[2], aFWMenuItems[0]);
            const browserWindowsPage=await getPageByMenuItem(this.driver, aFWMenuItems[0]);
            const actualHeader=await browserWindowsPage.getMainHeader();
            expect(actualHeader, `Actual and expected main header of ${aFWMenuItems[0]} page do not match`).to.be.equal(aFWMenuItems[0]);
        });
    });
    describe('regression: Collapsing and expanding menu check', function(){
        it('should check the menu page stays opened while expanding another menu', async function(){
            anyPage= await homePage.gotoWidgets();
            await anyPage.menu.expandMenu(mainMenuNames[5]);
            const actualText=await anyPage.getWidgetsPageText();
            expect(actualText, `Actual and expected text on the ${mainMenuNames[3]} page do not match`).to.be.equal(expectedMessage);
        });
        it('should check the menu page stays opened while another menu is expanded and then collapsed', async function(){
            anyPage= await homePage.gotoAlertsFrameWindows();
            await anyPage.menu.expandMenu(mainMenuNames[5]);
            await anyPage.menu.waitMenuVisible(mainMenuNames[5]);
            await anyPage.menu.collapseMenu(mainMenuNames[5]);
            const actualText=await anyPage.getAlertsFrameWindowsPageText();
            expect(actualText, `Actual and expected text on the ${mainMenuNames[4]} page do not match`).to.be.equal(expectedMessage);
        });
        it('should check the sub-menu stays active after returning to expanded parent-menu', async function(){
            anyPage= await homePage.gotoElements();
            const webTablesPage= await anyPage.gotoWebTablesMenuItem();
            await webTablesPage.menu.expandMenu(mainMenuNames[3])
            await webTablesPage.menu.waitMenuVisible(mainMenuNames[3]);
            await webTablesPage.menu.expandMenu(mainMenuNames[0]);
            await webTablesPage.menu.waitMenuVisible(mainMenuNames[0]);
            const isActive= await webTablesPage.menu.isSubMenuItemActive(elementsMenuItems[3]);
            expect(isActive, `${elementsMenuItems[3]} sub-menu is not active`).to.be.true;
            const actualHeader=await webTablesPage.getTableHeader();
            expect(actualHeader, `Actual and expected main header of ${elementsMenuItems[3]} page do not match`).to.be.equal(elementsMenuItems[3]);
        });
    });
});
    