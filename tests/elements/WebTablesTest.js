const { getHomePage }= require("../BaseTest.js");
const WebTablesPage = require('../../pages/elements/WebTablesPage.js');
const { expect }= require('chai');

describe('Web Tables Page functionality check', function() {
    /*!!!!!!!!!!!Check the sequence of column headers on the page!!!!!!!!!!
    Tests are written for: First Name-> Last Name-> Age ->Email-> Salary-> Department-> Action
    Second test of 'smoke: Basic functionality check' suite!!
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
    const formFields = {
        FirstName:  { placeholder: 'First Name', type: 'string' },
        LastName:   { placeholder: 'Last Name', type: 'string' },
        Age:        { placeholder: 'Age',        type: 'number' },
        Email:      { placeholder: 'name@example.com', type: 'email' },
        Salary:     { placeholder: 'Salary',     type: 'number' },
        Department: { placeholder: 'Department', type: 'string' }
    };
    function entry(fn, ln, age, email, salary, dept) {
        return { FirstName: fn, LastName: ln, Age: String(age), Email: email, Salary: String(salary), Department: dept };
    }
    const placeholders = Object.values(formFields).map(f => f.placeholder);
    const keys = Object.keys(formFields);
    const rowsPerPage= [5, 10, 20, 25, 50, 100];
    const defaultEntries=[
         entry( 'Cierra', 'Vega', 39, 'cierra@example.com', 10000, 'Insurance')
        ,entry( 'Alden', 'Cantrell', 45, 'alden@example.com', 12000, 'Compliance')
        ,entry( 'Kierra', 'Gentry', 29, 'kierra@example.com', 2000, 'Legal')
    ];
    const testUsers=[
         entry( 'Abc', 'Def', 99, 'Abc-99@.example.ert', 1, 'qwerty111#@!')
        ,entry( 'F', 'L 2', 53, 'F.2@34-5_df.com', 9990000, 'True')
        ,entry( 'Arthur Jr.', 'Trudo', 17, 'Arthur_Jr@asd.dklm', 10000, 'False2')
    ];
    const extremeUsers=[ //extreme values for all fields
        entry( 'AbcdeFgh1jKlmnoPqrst@@@@@', '#UvwxYz123Zyxwv%tsrQp0nml', 1
        , 'mk934____h7y98tuyi6596987yy876968yy87....69@----klg.usdfs', 9999999999
        , '12345678!#$%^&*()_-+=AAA~')
        //too long values
        ,entry(  "F".repeat(100), "L".repeat(100), 99999, "name@mail.aaa", 99999999999999,  "Dept".repeat(20))
        //non-digit in Age
        , entry( 't34', 'Getr', 'ag', 'dfew@ergas.we', 4353634, 'lkj')
        //empty Department
        , entry( 'Rh', 'ltr 5@', 10, 'dfew@12gas.we', 123342, '')
        //validation missing entries
        //leading zeros in Salary
        , entry( 'Validation', 'Missing', 10, 'dfew@12gas.we', '0000000001', 'dep №3')
        //only spaces in FirstName
        , entry( '     ', 'Missing', '10', 'dfew@12gas.we', 235234, 'dep №3')
        //invalid email
        , entry( 'Validation', 'Missing', 10, '.___________toolongname-9.9.9.9.9.9.9.9.9.9.9@.___________toolonglocal-9.9.9.9.9.9.9.9.9.9.9___.suffi', 235234, 'dep №3')
    ];
    const invalidEmails=['missing_local.we', 'extra@local@s.we', 'missing.@dotno', 'digitin@suffix.qa1'
        , 'toolongsuffix@dot.suffixxxxxxx', 'tooshortsuffix@dot.s', 'special-char.in_the_name!@sd2.suffi'
        , 'special-char.in_the_local@sd2#.suffi', 'special0char.in_the_suffix@sd2.s_u'
    ];
    /** @type {WebTablesPage} */
    let webTablesPage;
    beforeEach(async function(){
        const homePage= await getHomePage();
        const elementsPage= await homePage.gotoElements();
        webTablesPage= await elementsPage.gotoWebTablesMenuItem();
    });
    describe('smoke: Basic functionality check', function(){
        it('should confirm table header', async function() {
            const expectedHeader= "Web Tables";
            const actualHeader= await webTablesPage.getTableHeader();
            expect(actualHeader, "Actual and expected header do not match").to.be.equal(expectedHeader);
        });
        it('should confirm sequence of columns in table', async function(){
            const keysSequence = keys.map(k => k.replace(/([A-Z])/g, ' $1').trim()).join(' ');
            const expectedSequence= keysSequence +' Action';
            const actualSequence= await webTablesPage.getTableColumns();
            expect(actualSequence, "Actual and expected sequence of columns do not match").to.be.equal(expectedSequence);

        });
        it('should delete table entry', async function() {
            const email = 'kierra@example.com';
            const entryString = keys.map(k => defaultEntries[2][k]).join(' ');
            await webTablesPage.deleteEntry(email);
            const actualResult= await webTablesPage.isEntryOnPage(entryString);
            expect(actualResult, "Entry was not deleted").to.be.false;
        });
        it('should add entry to the table', async function() {
            const dataEntry= keys.map(k => testUsers[0][k]);
            const expectedEntry= dataEntry.join(' ');
            await webTablesPage.addNewEntry(placeholders, dataEntry);
            await webTablesPage.waitPreviousButton();
            const actualResult= await webTablesPage.isEntryOnPage(expectedEntry);
            expect(actualResult, "Entry was not added").to.be.true;
        });
        it('should edit table entry- string', async function() {
            const email = defaultEntries[1].Email;
            const newValue= "New Department";
            await webTablesPage.editEntry(email, placeholders[5], newValue);
            await webTablesPage.waitPreviousButton();
            let entryData= defaultEntries[1];
            entryData.Department = newValue;
            const expectedEntry = keys.map(k => entryData[k]).join(' ');
            const actualResult= await webTablesPage.isEntryOnPage(expectedEntry);
            expect(actualResult, `Department for ${entryData.FirstName} was not edited`).to.be.true;
        });
        it('should edit table entry- number', async function() {
            const email = defaultEntries[2].Email;
            const newValue= 20000;
            await webTablesPage.editEntry(email, placeholders[4], newValue);
            await webTablesPage.waitPreviousButton();
            let entryData= defaultEntries[2];
            entryData.Salary = newValue;
            const expectedEntry = keys.map(k => entryData[k]).join(' ');
            const actualResult= await webTablesPage.isEntryOnPage(expectedEntry);
            expect(actualResult, `Salary for ${entryData.FirstName} was not edited`).to.be.true;
        });
        it('should edit table entry- email', async function() {
            const email = defaultEntries[0].Email;
            const newValue= 'vega@example.com';
            await webTablesPage.editEntry(email, placeholders[3], newValue);
            await webTablesPage.waitPreviousButton();
            let entryData= defaultEntries[0];
            entryData.Email = newValue;
            const expectedEntry = keys.map(k => entryData[k]).join(' ');
            const actualResult= await webTablesPage.isEntryOnPage(expectedEntry);
            expect(actualResult, `Email for ${entryData.FirstName} was not edited`).to.be.true;
        });
    });
    describe('smoke: Pagination bottom menu default state check', function() {
        it('should check the number of rows showed per page by default', async function() {
            const defaultRowsPerPage= await webTablesPage.rowsPerPage();
            const expectedValue=10;
            expect(defaultRowsPerPage, `Expected and actual rows amount ${defaultRowsPerPage} do not match`).to.be.equal(expectedValue);
        });
        it('should check the text for number of rows showed per page by default', async function() {
            const defaultRowsPerPageText= await webTablesPage.rowsPerPageText();
            const expectedValue='10 rows';
            expect(defaultRowsPerPageText, `Expected and actual rows amount ${defaultRowsPerPageText} do not match`).to.be.equal(expectedValue);
        });
        it('should check the list of available numbers of rows showed per page', async function() {
            const optionsList= await webTablesPage.listRowsPerPage();
            expect(optionsList, `Expected and actual rows amount ${optionsList} do not match`).to.deep.equal(rowsPerPage);
        });
        it('should check the list of available numbers of rows text showed per page', async function() {
            const optionsList= await webTablesPage.listRowsPerPageText();
            const expectedList = rowsPerPage.map(n => `${n} rows`);
            expect(optionsList, `Expected and actual rows amount ${optionsList} do not match`).to.deep.equal(expectedList);
        });
        it('should change the number of rows showed per page', async function() {
            const expectedRowsPerPage= 20;
            await webTablesPage.setRowsPerPage(expectedRowsPerPage);
            const actualRowsPerPage= await webTablesPage.rowsPerPage();
            expect(actualRowsPerPage, `Expected and actual new number of rows do not match`).to.be.equal(expectedRowsPerPage);
        });
        it('should check that buttons "Previous" and "Next" are disabled', async function() {
            const previousButtonState= await webTablesPage.isPreviousButtonEnabled();
            const nextButtonState= await webTablesPage.isNextButtonEnabled();
            expect(previousButtonState, "'Previous' Button is enabled").to.be.false;
            expect(nextButtonState, "'Next' Button is enabled").to.be.false;
        });
    });
    describe('regression: Validation missing', function(){
        it('should add extreme entry to the table', async function() {
            const dataEntry= keys.map(k => extremeUsers[0][k]);
            const expectedEntry= dataEntry.join(' ');
            await webTablesPage.addNewEntry(placeholders, dataEntry);
            await webTablesPage.waitPreviousButton();
            const actualResult= await webTablesPage.isEntryOnPage(expectedEntry);
            expect(actualResult, "Entry was not added").to.be.true;
        });
        it('should add entry to the table with leading zeros in salary', async function() {
            const dataEntry= keys.map(k => extremeUsers[4][k]);
            const expectedEntry= dataEntry.join(' ');
            await webTablesPage.addNewEntry(placeholders, dataEntry);
            await webTablesPage.waitPreviousButton();
            const actualResult= await webTablesPage.isEntryOnPage(expectedEntry);
            expect(actualResult, "Entry was not added").to.be.true;
        });
        it('should add entry to the table with only spaces in First Name', async function() {
            const dataEntry= keys.map(k => extremeUsers[5][k]);
            const expectedEntry= dataEntry.join(' ');
            await webTablesPage.addNewEntry(placeholders, dataEntry);
            await webTablesPage.waitPreviousButton();
            const actualResult= await webTablesPage.isEntryOnPage(expectedEntry);
            expect(actualResult, "Entry was not added").to.be.true;
        });
        it('should add entry to the table with invalid too long email', async function() {
            const dataEntry= keys.map(k => extremeUsers[6][k]);
            const expectedEntry= dataEntry.join(' ');
            await webTablesPage.addNewEntry(placeholders, dataEntry);
            await webTablesPage.waitPreviousButton();
            const actualResult= await webTablesPage.isEntryOnPage(expectedEntry);
            expect(actualResult, "Entry was not added").to.be.true;
        });
        it('should edit entry with cyrillic letters in Last Name', async function() {
            const email = defaultEntries[2].Email;
            const newValue= "Gientry Вторая";
            await webTablesPage.editEntry(email, placeholders[1], newValue);
            await webTablesPage.waitPreviousButton();
            let entryData= defaultEntries[2];
            entryData.LastName= newValue;
            const expectedEntry = keys.map(k => entryData[k]).join(' ');
            const actualResult= await webTablesPage.isEntryOnPage(expectedEntry);
            expect(actualResult, `Last Name for ${entryData.FirstName} was not edited`).to.be.true;
        });

    });
    describe('regression: Invalid and extreme inputs', function(){
        it('should failed to add entry to the table with invalid age', async function() {
            const dataEntry= keys.map(k => extremeUsers[2][k]);
            //const expectedEntry = dataEntry.join(' ');
            //console.log(dataEntry);
            const countBefore = await webTablesPage.getTotalNotNullEntriesNumber();
            await webTablesPage.addNewEntry(placeholders, dataEntry);
            let validity= await webTablesPage.getInputValidity(placeholders[2]);
            expect(validity, "Age`s field frame is not red").to.be.false;
            validity= await webTablesPage.getInputValidity(placeholders[3]);
            expect(validity, "Email`s field frame is not green").to.be.true;
            validity= await webTablesPage.getInputValidity(placeholders[0]);
            expect(validity, "First Name`s field frame is not green").to.be.true;
            validity= await webTablesPage.getInputValidity(placeholders[5]);
            expect(validity, "Department`s field frame is not green").to.be.true;
            const regFormVisibility= await webTablesPage.isRegFormStillOpen();
            expect(regFormVisibility, "Registration Form does not open").to.be.true;
            await webTablesPage.clickRegFormCloseButton();
            const countAfter = await webTablesPage.getTotalNotNullEntriesNumber();
            expect(countAfter, "Not Null rows number changed").to.be.equal(countBefore);
        });
        it('should failed to add entry to the table with empty department', async function() {
            const dataEntry= keys.map(k => extremeUsers[3][k]);
            const countBefore = await webTablesPage.getTotalNotNullEntriesNumber();
            await webTablesPage.addNewEntry(placeholders, dataEntry);
            let validity= await webTablesPage.getInputValidity(placeholders[5]);
            expect(validity, "Department`s field frame is not red").to.be.false;
            validity= await webTablesPage.getInputValidity(placeholders[4]);
            expect(validity, "Salary`s field frame is not green").to.be.true;
            validity= await webTablesPage.getInputValidity(placeholders[1]);
            expect(validity, "Last Name`s field frame is not green").to.be.true;
            validity= await webTablesPage.getInputValidity(placeholders[2]);
            expect(validity, "Age`s field frame is not green").to.be.true;
            const regFormVisibility= await webTablesPage.isRegFormStillOpen();
            expect(regFormVisibility, "Registration Form does not open").to.be.true;
            await webTablesPage.clickRegFormCloseButton();
            const countAfter = await webTablesPage.getTotalNotNullEntriesNumber();
            expect(countAfter, "Not Null rows number changed").to.be.equal(countBefore);
        });
        it('should add entry to the table with too long values', async function() {
            const dataEntry= keys.map(k => extremeUsers[1][k]);
            const expectedEntry= `${(extremeUsers[1].FirstName).slice(0, 25)} ${(extremeUsers[1].LastName).slice(0, 25)} 
            ${String(extremeUsers[1].Age).slice(0, 2)} ${extremeUsers[1].Email} 
            ${String(extremeUsers[1].Salary).slice(0, 10)} ${(extremeUsers[1].Department).slice(0, 25)}`;
            await webTablesPage.addNewEntry(placeholders, dataEntry);
            await webTablesPage.waitPreviousButton();
            //console.log(expectedEntry);
            const actualResult= await webTablesPage.isEntryOnPage(expectedEntry);
            expect(actualResult, "Entry was not added").to.be.true;
        });
        describe('regression: Invalid emails', function(){
            it('should failed to add entry to the table with email without @', async function() {
                let newEntry=testUsers[2];
                newEntry.Email=invalidEmails[0];
                const dataEntry= keys.map(k => newEntry[k]);
                const countBefore = await webTablesPage.getTotalNotNullEntriesNumber();
                await webTablesPage.addNewEntry(placeholders, dataEntry);
                const validity= await webTablesPage.getInputValidity(placeholders[3]);
                expect(validity, "Email`s field frame is not red").to.be.false;
                const regFormVisibility= await webTablesPage.isRegFormStillOpen();
                expect(regFormVisibility, "Registration Form does not open").to.be.true;
                await webTablesPage.clickRegFormCloseButton();
                const countAfter = await webTablesPage.getTotalNotNullEntriesNumber();
                expect(countAfter, "Not Null rows number changed").to.be.equal(countBefore);
            });
            it('should failed to add entry to the table with email with 2 @', async function() {
                let newEntry=testUsers[2];
                newEntry.Email=invalidEmails[1];
                const dataEntry= keys.map(k => newEntry[k]);
                const countBefore = await webTablesPage.getTotalNotNullEntriesNumber();
                await webTablesPage.addNewEntry(placeholders, dataEntry);
                const validity= await webTablesPage.getInputValidity(placeholders[3]);
                expect(validity, "Email`s field frame is not red").to.be.false;
                const regFormVisibility= await webTablesPage.isRegFormStillOpen();
                expect(regFormVisibility, "Registration Form does not open").to.be.true;
                await webTablesPage.clickRegFormCloseButton();
                const countAfter = await webTablesPage.getTotalNotNullEntriesNumber();
                expect(countAfter, "Not Null rows number changed").to.be.equal(countBefore);
            });
            it('should failed to add entry to the table with email without dot after @', async function() {
                let newEntry=testUsers[2];
                newEntry.Email=invalidEmails[2];
                const dataEntry= keys.map(k => newEntry[k]);
                const countBefore = await webTablesPage.getTotalNotNullEntriesNumber();
                await webTablesPage.addNewEntry(placeholders, dataEntry);
                const validity= await webTablesPage.getInputValidity(placeholders[3]);
                expect(validity, "Email`s field frame is not red").to.be.false;
                const regFormVisibility= await webTablesPage.isRegFormStillOpen();
                expect(regFormVisibility, "Registration Form does not open").to.be.true;
                await webTablesPage.clickRegFormCloseButton();
                const countAfter = await webTablesPage.getTotalNotNullEntriesNumber();
                expect(countAfter, "Not Null rows number changed").to.be.equal(countBefore);
            });
            it('should failed to add entry to the table with email with number in suffix', async function() {
                let newEntry=testUsers[2];
                newEntry.Email=invalidEmails[3];
                const dataEntry= keys.map(k => newEntry[k]);
                const countBefore = await webTablesPage.getTotalNotNullEntriesNumber();
                await webTablesPage.addNewEntry(placeholders, dataEntry);
                const validity= await webTablesPage.getInputValidity(placeholders[3]);
                expect(validity, "Email`s field frame is not red").to.be.false;
                const regFormVisibility= await webTablesPage.isRegFormStillOpen();
                expect(regFormVisibility, "Registration Form does not open").to.be.true;
                await webTablesPage.clickRegFormCloseButton();
                const countAfter = await webTablesPage.getTotalNotNullEntriesNumber();
                expect(countAfter, "Not Null rows number changed").to.be.equal(countBefore);
            });
            it('should failed to add entry to the table with too long suffix', async function() {
                let newEntry=testUsers[2];
                newEntry.Email=invalidEmails[4];
                const dataEntry= keys.map(k => newEntry[k]);
                const countBefore = await webTablesPage.getTotalNotNullEntriesNumber();
                await webTablesPage.addNewEntry(placeholders, dataEntry);
                const validity= await webTablesPage.getInputValidity(placeholders[3]);
                expect(validity, "Email`s field frame is not red").to.be.false;
                const regFormVisibility= await webTablesPage.isRegFormStillOpen();
                expect(regFormVisibility, "Registration Form does not open").to.be.true;
                await webTablesPage.clickRegFormCloseButton();
                const countAfter = await webTablesPage.getTotalNotNullEntriesNumber();
                expect(countAfter, "Not Null rows number changed").to.be.equal(countBefore);
            });
            it('should failed to add entry to the table with too short suffix', async function() {
                let newEntry=testUsers[2];
                newEntry.Email=invalidEmails[5];
                const dataEntry= keys.map(k => newEntry[k]);
                const countBefore = await webTablesPage.getTotalNotNullEntriesNumber();
                await webTablesPage.addNewEntry(placeholders, dataEntry);
                const validity= await webTablesPage.getInputValidity(placeholders[3]);
                expect(validity, "Email`s field frame is not red").to.be.false;
                const regFormVisibility= await webTablesPage.isRegFormStillOpen();
                expect(regFormVisibility, "Registration Form does not open").to.be.true;
                await webTablesPage.clickRegFormCloseButton();
                const countAfter = await webTablesPage.getTotalNotNullEntriesNumber();
                expect(countAfter, "Not Null rows number changed").to.be.equal(countBefore);
            });
            it('should failed to add entry to the table with special char in the name', async function() {
                let newEntry=testUsers[2];
                newEntry.Email=invalidEmails[6];
                const dataEntry= keys.map(k => newEntry[k]);
                const countBefore = await webTablesPage.getTotalNotNullEntriesNumber();
                await webTablesPage.addNewEntry(placeholders, dataEntry);
                const validity= await webTablesPage.getInputValidity(placeholders[3]);
                expect(validity, "Email`s field frame is not red").to.be.false;
                const regFormVisibility= await webTablesPage.isRegFormStillOpen();
                expect(regFormVisibility, "Registration Form does not open").to.be.true;
                await webTablesPage.clickRegFormCloseButton();
                const countAfter = await webTablesPage.getTotalNotNullEntriesNumber();
                expect(countAfter, "Not Null rows number changed").to.be.equal(countBefore);
            });
            it('should failed to add entry to the table with special char in the local', async function() {
                let newEntry=testUsers[2];
                newEntry.Email=invalidEmails[7];
                const dataEntry= keys.map(k => newEntry[k]);
                const countBefore = await webTablesPage.getTotalNotNullEntriesNumber();
                await webTablesPage.addNewEntry(placeholders, dataEntry);
                const validity= await webTablesPage.getInputValidity(placeholders[3]);
                expect(validity, "Email`s field frame is not red").to.be.false;
                const regFormVisibility= await webTablesPage.isRegFormStillOpen();
                expect(regFormVisibility, "Registration Form does not open").to.be.true;
                await webTablesPage.clickRegFormCloseButton();
                const countAfter = await webTablesPage.getTotalNotNullEntriesNumber();
                expect(countAfter, "Not Null rows number changed").to.be.equal(countBefore);
            });
            it('should failed to add entry to the table with special char in the suffix', async function() {
                let newEntry=testUsers[2];
                newEntry.Email=invalidEmails[8];
                const dataEntry= keys.map(k => newEntry[k]);
                const countBefore = await webTablesPage.getTotalNotNullEntriesNumber();
                await webTablesPage.addNewEntry(placeholders, dataEntry);
                const validity= await webTablesPage.getInputValidity(placeholders[3]);
                expect(validity, "Email`s field frame is not red").to.be.false;
                const regFormVisibility= await webTablesPage.isRegFormStillOpen();
                expect(regFormVisibility, "Registration Form does not open").to.be.true;
                await webTablesPage.clickRegFormCloseButton();
                const countAfter = await webTablesPage.getTotalNotNullEntriesNumber();
                expect(countAfter, "Not Null rows number changed").to.be.equal(countBefore);
            });
        });
        describe('regression: Invalid inputs during editing', function(){
            it('should failed to edit entry with invalid age', async function() {
                const email = defaultEntries[0].Email;
                const newValue= "1!";
                await webTablesPage.editEntry(email, placeholders[2], newValue);
                let validity= await webTablesPage.getInputValidity(placeholders[2]);
                expect(validity, "Age`s field frame is not red").to.be.false;
                const regFormVisibility= await webTablesPage.isRegFormStillOpen();
                expect(regFormVisibility, "Registration Form does not open").to.be.true;
                await webTablesPage.clickRegFormCloseButton();
                const expectedEntry = keys.map(k => defaultEntries[0][k]).join(' ');
                const actualResult= await webTablesPage.isEntryOnPage(expectedEntry);
                expect(actualResult, `Data for ${defaultEntries[0].FirstName} changed`).to.be.true;
            });
            it('should failed to edit entry with invalid email', async function() {
                const email = defaultEntries[1].Email;
                const newValue= "newmаil_withcyrillic@a.ru";
                await webTablesPage.editEntry(email, placeholders[3], newValue);
                let validity= await webTablesPage.getInputValidity(placeholders[3]);
                expect(validity, "Email`s field frame is not red").to.be.false;
                const regFormVisibility= await webTablesPage.isRegFormStillOpen();
                expect(regFormVisibility, "Registration Form does not open").to.be.true;
                await webTablesPage.clickRegFormCloseButton();
                const expectedEntry = keys.map(k => defaultEntries[1][k]).join(' ');
                const actualResult= await webTablesPage.isEntryOnPage(expectedEntry);
                expect(actualResult, `Data for ${defaultEntries[1].FirstName} changed`).to.be.true;
            });
        });
    });
    describe('regression: Live search functionality check', function(){
        it('should search text through the page', async function() {
            const searchText='rra';
            await webTablesPage.searchEntries(searchText);
            const entriesTotal= await webTablesPage.getTotalNotNullEntriesNumber();
            expect(entriesTotal, `Expected 2 entries, got ${entriesTotal}`).to.be.equal(2);
            let entryString = keys.map(k => defaultEntries[0][k]).join(' ');
            let inTable=await webTablesPage.isEntryOnPage(entryString);
            expect(inTable, `Entry with '${searchText}' in ${defaultEntries[0].FirstName} was not found`).to.be.true;
            entryString = keys.map(k => defaultEntries[2][k]).join(' ');
            inTable=await webTablesPage.isEntryOnPage(entryString);
            expect(inTable, `Entry with '${searchText}' in ${defaultEntries[2].FirstName} was not found`).to.be.true;
        });
        it('should display empty table if search text is missing', async function() {
            const searchText='na';
            await webTablesPage.searchEntries(searchText);
            const entriesTotal= await webTablesPage.getTotalNotNullEntriesNumber();
            expect(entriesTotal, `Total number of entries don't equal ${entriesTotal}`).to.be.equal(0);
        });
        it('should search text through several pages of entries and include new added entries', async function() {
            await webTablesPage.setRowsPerPage(5);
            const dataEntry = testUsers.map(user => keys.map(k => user[k]));
            await webTablesPage.addNewEntry(placeholders, ...dataEntry);
            await webTablesPage.waitPreviousButton();
            const searchText='2';
            await webTablesPage.searchEntries(searchText);
            const entriesTotal= await webTablesPage.getTotalNotNullEntriesNumber();
            expect(entriesTotal, `Total number of entries don't equal ${entriesTotal}`).to.be.equal(4);
            let entryString = keys.map(k => defaultEntries[1][k]).join(' ');
            let inTable=await webTablesPage.isEntryOnPage(entryString);
            expect(inTable, `Entry with ${searchText} in ${defaultEntries[1].Salary} was not found`).to.be.true;
            entryString = keys.map(k => defaultEntries[2][k]).join(' ');
            inTable=await webTablesPage.isEntryOnPage(entryString);
            expect(inTable, `Entry with ${searchText} in ${defaultEntries[2].Age} and ${defaultEntries[2].Salary} was not found`).to.be.true;
            entryString = keys.map(k => testUsers[1][k]).join(' ');
            inTable=await webTablesPage.isEntryOnPage(entryString);
            expect(inTable, `Entry with ${searchText} in ${testUsers[1].LastName} and ${testUsers[1].Email} was not found`).to.be.true;
            entryString = keys.map(k => testUsers[2][k]).join(' ');
            inTable=await webTablesPage.isEntryOnPage(entryString);
            expect(inTable, `Entry with ${searchText} in ${testUsers[2].Department} was not found`).to.be.true;
        });
        it('should expand search result when reduce text', async function() {
            await webTablesPage.setRowsPerPage(5);
            const dataEntry = testUsers.map(user => keys.map(k => user[k]));
            await webTablesPage.addNewEntry(placeholders, ...dataEntry);
            await webTablesPage.waitForTableUpdate(3);
            const searchText='example.e';
            await webTablesPage.searchEntries(searchText);
            const initialCount = await webTablesPage.getTotalNotNullEntriesNumber();
            //console.log("Entries after first search: ", initialCount);
            await webTablesPage.deleteCharsFromTextSearch();
            await webTablesPage.waitForTableUpdate(initialCount);
            const expandedCount= await webTablesPage.getTotalNotNullEntriesNumber();
            //console.log("Entries after backspacing: ", expandedCount);
            expect(expandedCount, "Entries did not expand after reducing text").to.be.greaterThan(initialCount);
            expect(expandedCount, "Total number of entries don`t equal 4").to.be.equal(4);
            let entryString = keys.map(k => testUsers[0][k]).join(' ');
            let inTable=await webTablesPage.isEntryOnPage(entryString);
            expect(inTable, `Entry with 'example.' in ${testUsers[0].Email} was not found`).to.be.true;
            entryString = keys.map(k => defaultEntries[0][k]).join(' ');
            inTable=await webTablesPage.isEntryOnPage(entryString);
            expect(inTable, `Entry with 'example.' in ${defaultEntries[0].Email} was not found`).to.be.true;
            entryString = keys.map(k => defaultEntries[1][k]).join(' ');
            inTable=await webTablesPage.isEntryOnPage(entryString);
            expect(inTable, `Entry with 'example.' in ${defaultEntries[1].Email} was not found`).to.be.true;
            entryString = keys.map(k => defaultEntries[2][k]).join(' ');
            inTable=await webTablesPage.isEntryOnPage(entryString);
            expect(inTable, `Entry with 'example.' in ${defaultEntries[2].Email} was not found`).to.be.true;
        });
        it('should check that search result could include more than one page', async function() {
            await webTablesPage.setRowsPerPage(5);
            const dataEntry = testUsers.map(user => keys.map(k => user[k]));
            await webTablesPage.addNewEntry(placeholders, ...dataEntry);
            await webTablesPage.waitForTableUpdate(3);
            const searchText='@';
            await webTablesPage.searchEntries(searchText);
            await webTablesPage.clickNextPageButton();
            const searchTextNextPage= await webTablesPage.getSearchFieldValue();
            expect(searchTextNextPage, "Search text does not match with typed on the previous page").to.be.equal(searchText);
        });
    });
    describe('regression: Pagination bottom menu check', function() {
        it('should check the text for number of rows showed per page by default', async function() {
            const defaultRowsPerPageText= await webTablesPage.rowsPerPageText();
            const expectedValue='10 rows';
            expect(defaultRowsPerPageText, `Expected and actual rows amount ${defaultRowsPerPageText} do not match`).to.be.equal(expectedValue);
        });
        it('should display more than one page', async function() {
            const dataEntry = testUsers.map(user => keys.map(k => user[k]));
            //const expectedEntry = dataEntry.join(' ');
            await webTablesPage.addNewEntry(placeholders, ...dataEntry);
            await webTablesPage.waitPreviousButton();
            await webTablesPage.setRowsPerPage(5);
            const totalPages= await webTablesPage.getTotalPages();
            const nextButtonState= await webTablesPage.isNextButtonEnabled();
            const previousButtonState= await webTablesPage.isPreviousButtonEnabled();
            const actualPageNumber= await webTablesPage.getCurrentPageNumber();
            expect(actualPageNumber, "Actual and expected current page number do not match").to.be.equal(1);
            expect(totalPages, "Actual and expected total pages numbers do not match").to.be.equal(2);
            expect(nextButtonState, "'Next' Button is not enabled").to.be.true;
            expect(previousButtonState, "'Previous' Button is enabled").to.be.false;
        });
        it('should switch to the next page', async function() {
            const dataEntry = testUsers.map(user => keys.map(k => user[k]));
            //const expectedEntry = dataEntry.join(' ');
            await webTablesPage.addNewEntry(placeholders, ...dataEntry);
            await webTablesPage.waitPreviousButton();
            await webTablesPage.setRowsPerPage(5);
            await webTablesPage.clickNextPageButton();
            const totalPages= await webTablesPage.getTotalPages();
            const nextButtonState= await webTablesPage.isNextButtonEnabled();
            const previousButtonState= await webTablesPage.isPreviousButtonEnabled();
            const actualPageNumber= await webTablesPage.getCurrentPageNumber();
            const notNullEntriesOnPage= await webTablesPage.getTotalNotNullEntriesNumber();
            expect(notNullEntriesOnPage, "Actual and expected amount of entries on page do not match").to.be.equal(1);
            expect(actualPageNumber, "Actual and expected current page number do not match").to.be.equal(2);
            expect(totalPages, "Actual and expected total pages numbers do not match").to.be.equal(2);
            expect(nextButtonState, "'Next' Button is enabled").to.be.false;
            expect(previousButtonState, "'Previous' Button is  not enabled").to.be.true;
        });
        it('should display corresponding number of pages and current page after switching to bigger amount', async function() {
            await webTablesPage.setRowsPerPage(5);
            const dataEntry = testUsers.map(user => keys.map(k => user[k]));
            //const expectedEntry = dataEntry.join(' ');
            await webTablesPage.addNewEntry(placeholders, ...dataEntry);
            await webTablesPage.waitPreviousButton();
            await webTablesPage.clickNextPageButton();
            await webTablesPage.setRowsPerPage(10);
            await webTablesPage.closeRowsPerPageDropdown();
            const actualPageNumber= await webTablesPage.getCurrentPageNumber();
            const totalPages= await webTablesPage.getTotalPages();
            const nextButtonState= await webTablesPage.isNextButtonEnabled();
            const previousButtonState= await webTablesPage.isPreviousButtonEnabled();
            expect(totalPages, "Actual and expected total pages numbers do not match").to.be.equal(1);
            expect(actualPageNumber, "Actual and expected current page number do not match").to.be.equal(1);
            expect(nextButtonState, "'Next' Button is enabled").to.be.false;
            expect(previousButtonState, "'Previous' Button is enabled").to.be.false;
        });

    });
});