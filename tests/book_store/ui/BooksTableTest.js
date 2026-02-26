const api = require("../../../api");
const { loginTestUser } = require("../../helpers/LoginHelper.js");
const { logoutTestUser } = require("../../helpers/LogoutHelper.js");
const { getPageByMenuItem } = require("../../../utils/PageFactoryUtils.js");
const BooksTable = require("../../../components/BooksTable.js");
const { expect }= require('chai');

describe('BooksTable component functionality check', function() {
    /*!!!!!!!!!!!Check the sequence of column headers on the page!!!!!!!!!!
    Tests are written for: Image-> Title-> Author-> Publisher (-> Action- for logged-in state)
    Test in 'smoke: Basic functionality check, not logged-in state' suite and
    'smoke: Basic functionality check, logged-in state' suite
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
    const formFields = {
        image: {placeholder: 'src', type: 'string'},
        a: {placeholder: 'href', type: 'string'},   // extracted from href
        title: {placeholder: 'text', type: 'string'},
        author: {placeholder: 'text', type: 'string'},
        publisher: {placeholder: 'text', type: 'string'}
    };
    function entry(image, ID, title, auth, pub) {
        return { image: image, a: ID, title: title, author: auth, publisher: pub };
    }
    function entryVisibleText(entry) {
        return (`${entry.title} ${entry.author} ${entry.publisher}`).replace(/\s+/g, ' ').trim();
    }
    function entryLink(entry) {
        return entry.a;
    }
    function entryImage(entry) {
        return entry.image;
    }
    const placeholders = Object.values(formFields).map(f => f.placeholder);
    const keys = Object.keys(formFields);
    const rowsPerPage= [5, 10, 20, 25, 50, 100];
    const defaultEntries=[
         entry( '/images/bookimage0.jpg', '/books?book=9781449325862', 'Git Pocket Guide', 'Richard E. Silverman', "O'Reilly Media")
        ,entry( '/images/bookimage1.jpg', '/books?book=9781449331818', 'Learning JavaScript Design Patterns', 'Addy Osmani', "O'Reilly Media")
        ,entry( '/images/bookimage2.jpg', '/books?book=9781449337711', 'Designing Evolvable Web APIs with ASP.NET', 'Glenn Block et al.', "O'Reilly Media")
        ,entry( '/images/bookimage3.jpg', '/books?book=9781449365035', 'Speaking JavaScript', 'Axel Rauschmayer', "O'Reilly Media")
        ,entry( '/images/bookimage0.jpg', '/books?book=9781491904244', "You Don't Know JS", 'Kyle Simpson', "O'Reilly Media")
        ,entry( '/images/bookimage1.jpg', '/books?book=9781491950296', 'Programming JavaScript Applications', 'Eric Elliott', "O'Reilly Media")
        ,entry( '/images/bookimage2.jpg', '/books?book=9781593275846', 'Eloquent JavaScript, Second Edition', 'Marijn Haverbeke', "No Starch Press")
        ,entry( '/images/bookimage3.jpg', '/books?book=9781593277574', 'Understanding ECMAScript 6', 'Nicholas C. Zakas', "No Starch Press")
    ];
    describe('Books Table component check, not logged-in state', function() {
        /** @type {BooksTable} */
        let homePage, booksPage;
        beforeEach(async function(){
            homePage= this.homePage;
            booksPage= await homePage.gotoBookStoreApplication();
            await booksPage.waitLoginButton();
        });
        describe('smoke: Basic functionality check', function() {
            it('should confirm sequence of columns in table', async function() {
                const expectedSequence= "Image Title Author Publisher";
                const actualSequence= await booksPage.booksTable.getTableColumns();
                expect(actualSequence, "Actual and expected sequence of columns do not match").to.be.equal(expectedSequence);
            });
            it('should check redirection to the chosen book`s page', async function() {
                const expectedLink=entryLink(defaultEntries[2]);
                await booksPage.booksTable.gotoBook(defaultEntries[2].title);
                const actualLink= await booksPage.booksTable.getBookUrl();
                expect(actualLink, `Actual and expected links for '${defaultEntries[2].title}' book do not match`).to.be.include(expectedLink);
            });
        });
        describe('smoke: Pagination bottom menu default state check', function() {
            it('should check the number of rows showed per page by default', async function() {
                const defaultRowsPerPage= await booksPage.booksTable.rowsPerPage();
                const expectedValue=10;
                expect(defaultRowsPerPage, `Expected and actual rows amount ${defaultRowsPerPage} do not match`).to.be.equal(expectedValue);
            });
            it('should check the list of available numbers of rows showed per page', async function() {
                const optionsList= await booksPage.booksTable.listRowsPerPage();
                expect(optionsList, `Expected and actual rows amount ${optionsList} do not match`).to.deep.equal(rowsPerPage);
            });
            it('should change the number of rows showed per page', async function() {
                const expectedRowsPerPage= 20;
                await booksPage.booksTable.setRowsPerPage(expectedRowsPerPage);
                const actualRowsPerPage= await booksPage.booksTable.rowsPerPage();
                expect(actualRowsPerPage, `Expected and actual new number of rows do not match`).to.be.equal(expectedRowsPerPage);
            });
            it('should check that buttons "Previous" and "Next" are disabled if there is only one page', async function() {
                const previousButtonState= await booksPage.booksTable.isPreviousButtonEnabled();
                const nextButtonState= await booksPage.booksTable.isNextButtonEnabled();
                expect(previousButtonState, "'Previous' Button is enabled").to.be.false;
                expect(nextButtonState, "'Next' Button is enabled").to.be.false;
            });
        });
        describe('regression: Live search functionality check', function(){
            it('should search books with the text', async function() {
                const searchText='des';
                await booksPage.booksTable.searchEntries(searchText);
                await booksPage.booksTable.waitSearchResult();
                const entriesTotal= await booksPage.booksTable.getTotalNotNullEntriesNumber();
                expect(entriesTotal, `Expected 2 entries, got ${entriesTotal}`).to.be.equal(2);
                let expectedEntry= defaultEntries[1];
                let inTable = await booksPage.booksTable.isEntryOnPage({title: expectedEntry.title,
                    auth: expectedEntry.author, pub: expectedEntry.publisher });
                expect(inTable, `Entry with '${searchText}' in ${defaultEntries[1].title} was not found`).to.be.true;
                expectedEntry= defaultEntries[2];
                inTable = await booksPage.booksTable.isEntryOnPage({title: expectedEntry.title,
                    auth: expectedEntry.author, pub: expectedEntry.publisher });
                expect(inTable, `Entry with '${searchText}' in ${defaultEntries[2].title} was not found`).to.be.true;
            });
            it('should display correct image for books after live search', async function() {
                // Known issue: Bug-019
                const searchText='des';
                await booksPage.booksTable.searchEntries(searchText);
                await booksPage.booksTable.waitSearchResult();
                let expectedEntry= defaultEntries[1];
                let expectedImageSrc= entryImage(expectedEntry);
                let actualImageSrc= await booksPage.booksTable.getImageSrc({title: expectedEntry.title, 
                    auth: expectedEntry.author });
                let actualPath = new URL(actualImageSrc).pathname;
                expect(actualPath, `Bug!!! Wrong image for ${defaultEntries[1].title}`).to.be.equal(expectedImageSrc);
                expectedEntry= defaultEntries[2];
                expectedImageSrc= entryImage(expectedEntry);
                console.log(expectedImageSrc);
                actualImageSrc= await booksPage.booksTable.getImageSrc({title: expectedEntry.title, 
                    auth: expectedEntry.author });
                actualPath = new URL(actualImageSrc).pathname;
                expect(actualPath, `Bug!!! Wrong image for ${defaultEntries[2].title}`).to.be.equal(expectedImageSrc);
            });
            it('should display No Data message and empty table if search text is missing', async function() {
                const searchText='na';
                await booksPage.booksTable.searchEntries(searchText);
                const isMessageVisible= await booksPage.booksTable.waitSearchResult();
                expect(isMessageVisible, "No Data Message is not visible").to.be.false;
                const entriesTotal= await booksPage.booksTable.getTotalNotNullEntriesNumber();
                expect(entriesTotal, `Expected 2 entries, got ${entriesTotal}`).to.be.equal(0);
            });
            it('should search text through several pages with books', async function() {
                await booksPage.booksTable.setRowsPerPage(5);
                await booksPage.booksTable.isNextButtonEnabled();
                const searchText='No';
                await booksPage.booksTable.searchEntries(searchText);
                const entriesTotal= await booksPage.booksTable.getTotalNotNullEntriesNumber();
                expect(entriesTotal, `Expected 3 entries, got ${entriesTotal}`).to.be.equal(3);
                let expectedEntry= defaultEntries[4];
                let inTable = await booksPage.booksTable.isEntryOnPage({title: expectedEntry.title,
                    auth: expectedEntry.author, pub: expectedEntry.publisher });
                expect(inTable, `Entry with '${searchText}' in ${defaultEntries[4].title} was not found`).to.be.true;
                expectedEntry= defaultEntries[6];
                inTable = await booksPage.booksTable.isEntryOnPage({title: expectedEntry.title,
                    auth: expectedEntry.author, pub: expectedEntry.publisher });
                expect(inTable, `Entry with '${searchText}' in ${defaultEntries[6].publisher} was not found`).to.be.true;
                expectedEntry= defaultEntries[7];
                inTable = await booksPage.booksTable.isEntryOnPage({title: expectedEntry.title,
                    auth: expectedEntry.author, pub: expectedEntry.publisher });
                expect(inTable, `Entry with '${searchText}' in ${defaultEntries[7].publisher} was not found`).to.be.true;
            });
            it('should expand search result when reduce text', async function() {
                const searchText='JavaScript ';
                await booksPage.booksTable.searchEntries(searchText);
                const initialCount = await booksPage.booksTable.getTotalNotNullEntriesNumber();
                //console.log("Entries after first search: ", initialCount);
                await booksPage.booksTable.deleteCharsFromTextSearch();
                await booksPage.booksTable.waitForTableUpdate(initialCount);
                const expandedCount= await booksPage.booksTable.getTotalNotNullEntriesNumber();
                //console.log("Entries after backspacing: ", expandedCount);
                expect(expandedCount, "Entries did not expand after reducing text").to.be.greaterThan(initialCount);
                expect(expandedCount, "Total number of entries don`t equal 4").to.be.equal(4);
            });
            it('should check that search result could include more than one page', async function() {
                await booksPage.booksTable.setRowsPerPage(5);
                const searchText="O'Reilly";
                await booksPage.booksTable.searchEntries(searchText);
                await booksPage.booksTable.clickNextPageButton();
                const searchTextNextPage= await booksPage.booksTable.getSearchFieldValue();
                expect(searchTextNextPage, "Search text does not match with typed on the previous page").to.be.equal(searchText);
                const entriesTotal= await booksPage.booksTable.getTotalNotNullEntriesNumber();
                expect(entriesTotal, `Expected 1 entry, got ${entriesTotal}`).to.be.equal(1);
            });
            it('should check the correctness of images for books after searching results displayed on more than one page', async function() {
                // Known issue: Bug-019
                await booksPage.booksTable.setRowsPerPage(5);
                const searchText="er";
                await booksPage.booksTable.searchEntries(searchText);
                await booksPage.booksTable.clickNextPageButton();
                await booksPage.waitLoginButton();
                await booksPage.booksTable.scrollToTheHead();
                let expectedEntry= defaultEntries[7];
                let expectedImageSrc= entryImage(expectedEntry);
                let actualImageSrc= await booksPage.booksTable.getImageSrc({title: expectedEntry.title, 
                    auth: expectedEntry.author });
                let actualPath = new URL(actualImageSrc).pathname;
                expect(actualPath, `Bug!!! Wrong image for ${defaultEntries[7].title}`).to.be.equal(expectedImageSrc);
            });
        });
        describe('regression: Pagination bottom menu check', function() {
            it('should check the text for number of rows showed per page by default', async function() {
                const defaultRowsPerPageText= await booksPage.booksTable.rowsPerPageText();
                const expectedValue='10 rows';
                expect(defaultRowsPerPageText, `Expected and actual rows amount ${defaultRowsPerPageText} do not match`).to.be.equal(expectedValue);
            });
            it('should check the list of available numbers of rows text showed per page', async function() {
                const optionsList= await booksPage.booksTable.listRowsPerPageText();
                const expectedList = rowsPerPage.map(n => `${n} rows`);
                expect(optionsList, `Expected and actual rows amount ${optionsList} do not match`).to.deep.equal(expectedList);
            });
            it('should display more than one page', async function() {
                await booksPage.booksTable.setRowsPerPage(5);
                const totalPages= await booksPage.booksTable.getTotalPages();
                const nextButtonState= await booksPage.booksTable.isNextButtonEnabled();
                const previousButtonState= await booksPage.booksTable.isPreviousButtonEnabled();
                const actualPageNumber= await booksPage.booksTable.getCurrentPageNumber();
                expect(actualPageNumber, "Actual and expected current page number do not match").to.be.equal(1);
                expect(totalPages, "Actual and expected total pages numbers do not match").to.be.equal(2);
                expect(nextButtonState, "'Next' Button is not enabled").to.be.true;
                expect(previousButtonState, "'Previous' Button is enabled").to.be.false;
            });
            it('should switch to the next page', async function() {
                await booksPage.booksTable.setRowsPerPage(5);
                await booksPage.booksTable.clickNextPageButton();
                const totalPages= await booksPage.booksTable.getTotalPages();
                const nextButtonState= await booksPage.booksTable.isNextButtonEnabled();
                const previousButtonState= await booksPage.booksTable.isPreviousButtonEnabled();
                const actualPageNumber= await booksPage.booksTable.getCurrentPageNumber();
                const notNullEntriesOnPage= await booksPage.booksTable.getTotalNotNullEntriesNumber();
                expect(notNullEntriesOnPage, "Actual and expected amount of entries on page do not match").to.be.equal(3);
                expect(actualPageNumber, "Actual and expected current page number do not match").to.be.equal(2);
                expect(totalPages, "Actual and expected total pages numbers do not match").to.be.equal(2);
                expect(nextButtonState, "'Next' Button is enabled").to.be.false;
                expect(previousButtonState, "'Previous' Button is  not enabled").to.be.true;
            });
            it('should display corresponding number of pages and current page after switching to bigger amount', async function() {
                // Known issue: Bug-018
                await booksPage.booksTable.setRowsPerPage(5);
                await booksPage.booksTable.clickNextPageButton();
                await booksPage.booksTable.setRowsPerPage(10);
                await booksPage.booksTable.closeRowsPerPageDropdown();
                const actualPageNumber= await booksPage.booksTable.getCurrentPageNumber();
                const totalPages= await booksPage.booksTable.getTotalPages();
                const nextButtonState= await booksPage.booksTable.isNextButtonEnabled();
                const previousButtonState= await booksPage.booksTable.isPreviousButtonEnabled();
                expect(totalPages, "Actual and expected total pages numbers do not match").to.be.equal(1);
                expect(actualPageNumber, "Actual and expected current page number do not match").to.be.equal(1);
                expect(nextButtonState, "'Next' Button is enabled").to.be.false;
                expect(previousButtonState, "'Previous' Button is enabled").to.be.false;
            });

        });
    });
    describe('Books Table component check, logged-in state', function(){
        /** @type {BooksTable} */
        let homePage, booksPage, profilePage;
        before(async function(){
            this.testUser = await api.user.createUser();
        });
        beforeEach(async function() {
            homePage= this.homePage;
            booksPage= await homePage.gotoBookStoreApplication();
            await booksPage.waitLoginButton();
            await booksPage.menu.clickMenuItem("Book Store Application", "Profile");
            profilePage= await getPageByMenuItem(this.driver, "Profile");
            await profilePage.gotoLoginPage();
            await loginTestUser(this);
        });
        afterEach(async function()  {
            await logoutTestUser(this);
        })
        after(async function() {
            await api.user.deleteUser(this.testUser);
        });
        describe('smoke: Basic functionality check', function() {
            it('should confirm sequence of columns in table', async function() {
                const expectedSequence= "Image Title Author Publisher Action";
                await profilePage.waitUserPageReady();
                const actualSequence= await profilePage.booksTable.getTableColumns();
                expect(actualSequence, "Actual and expected sequence of columns do not match").to.be.equal(expectedSequence);
            });
            it('should show "No rows found" message if user`s books list is empty', async function() {
                await profilePage.waitUserPageReady();
                const booksAmount= await profilePage.booksTable.getTotalNotNullEntriesNumber();
                expect(booksAmount, 'User books list on the page is not empty').to.be.equal(0);
                const isNoRowFoundDisplayed = await profilePage.booksTable.isMessageDisplayed();
                expect(isNoRowFoundDisplayed, 'Message "No rows found" for empty list is not displayed').to.be.true;
            });
            it('should match user books in UI with backend data', async function() {
                const userBooks =this.testUser.books;
                const backendBooks = userBooks.map(b =>`${b.title} ${b.author} ${b.publisher}`.replace(/\s+/g, ' ').trim());
                await profilePage.waitUserPageReady();
                const uiBooks = await profilePage.booksTable.getDisplayedBooks();
                expect(uiBooks, 'User books list in backend and in Profile do not match').to.be.deep.equal(backendBooks);
            });
        });
    });
});