const { getHomePage }= require("../BaseTest.js");
const { uniteAndTtrimExtention } = require("../../utils/StringUtils.js");
const CheckBoxPage = require('../../pages/elements/CheckBoxPage.js');
const { expect }= require('chai');

describe('Check Box Page functionality check', function() {
    const normalize = name => name.toLowerCase();
    const tree= normalize('Home');
    const nodes=['Desktop', 'Documents', 'Downloads'].map(normalize);
    const desktopFiles=['Notes', 'Commands'].map(normalize);
    const documentsFolders=['WorkSpace', 'Office'].map(normalize);
    const officeFiles=['Public', 'Private', 'Classified', 'General'].map(normalize);
    const workspaceFiles=['React', 'Angular', 'Veu'].map(normalize);
    const downloadsFiles=['Word File.doc', 'Excel File.doc'];
    /** @type {CheckBoxPage} */
    let checkBoxPage;
    beforeEach(async function(){
        const homePage= await getHomePage();
        const elementsPage= await homePage.gotoElements();
        checkBoxPage= await elementsPage.gotoCheckBoxMenuItem();
    });
    describe('smoke: Basic functionality check', function(){
        it ('should confirm default state', async function() {
            const expanded= await checkBoxPage.isNodeExpanded(tree);
            expect(expanded, `"${tree}" is expanded`).to.be.false;
            const folderSelected= await checkBoxPage.getCheckBoxState(tree);
            expect(folderSelected, `"${tree}" is selected`).to.be.equal('uncheck');
        });
        it ('should confirm basic functionality', async function() {
            await checkBoxPage.expandNode(tree);
            let expanded= await checkBoxPage.isNodeExpanded(tree);
            expect(expanded, `"${tree}" is not expanded`).to.be.true;
            await checkBoxPage.expandNode((nodes[2]));
            expanded= await checkBoxPage.isNodeExpanded((nodes[2]));
            expect(expanded, `"${nodes[2]}" is not expanded`).to.be.true;
            let folderState= await checkBoxPage.getCheckBoxState(tree);
            expect(folderState, `"${tree}" is not unchecked`).to.be.equal('uncheck');
            await checkBoxPage.clickChB(uniteAndTtrimExtention(downloadsFiles[1]));
            const fileSelected= await checkBoxPage.getCheckBoxState(uniteAndTtrimExtention(downloadsFiles[1]));
            //await new Promise(r => setTimeout(r, 5000));
            //console.log(`"${downloadsFiles[1]}" checked? ->`, fileSelected);
            const actualConfirmationText= await checkBoxPage.getCheckedFilesConfirmation(1);
            const actualConfirmation= await checkBoxPage.getCheckedFilesConfirmation(2);
            const actualFileColorInMessage= await checkBoxPage.verifyColor(2);
            expect(fileSelected, `${downloadsFiles[1]} is not selected`).to.be.equal("check");
            expect(actualConfirmationText, 'The message does not start with "You have selected :"').to.be.equal("You have selected :");
            expect(actualConfirmation, 'Actual and expected confirmation text do not match').to.be.equal(uniteAndTtrimExtention(downloadsFiles[1]));
            expect(actualFileColorInMessage, 'Actual and expected color of selected file in message do not match').to.be.equal("rgba(40, 167, 69, 1)");

        });
    });
    describe('regression: Expand/Collapse All buttons', function() {
        it('should expand all nodes when clicking "Expand All"', async function() {
            await checkBoxPage.clickExpandAllButton();
            let expanded= await checkBoxPage.isNodeExpanded(tree);
            expect(expanded, "The tree is not expanded").to.be.true;
            for (const node of nodes) {
                expanded = await checkBoxPage.isNodeExpanded(node);
                expect(expanded, `"${node}" is not expanded`).to.be.true;
            }
            for (const folder of documentsFolders) {
                expanded = await checkBoxPage.isNodeExpanded(folder);
                expect(expanded, `"${folder}" is not expanded`).to.be.true;
            }
        });

        it('should collapse all nodes when clicking "Collapse All"', async function() {
            await checkBoxPage.expandNodes(tree, nodes[1]);
            await checkBoxPage.clickCollapseAllButton();
            const expanded= await checkBoxPage.isNodeExpanded(tree);
            expect(expanded, "The tree is not collapsed").to.be.false;
        });
    });

    it('regression: should select all children if parent was selected', async function() {
        await checkBoxPage.expandAndDo('click', tree, nodes[0]);
        const folderSelected= await checkBoxPage.getCheckBoxState(nodes[0]);
        expect(folderSelected, `"${nodes[0]}" is not selected`).to.be.equal('check');
        const actualMessage= (await checkBoxPage.getCheckedFilesList()).replace(/\s+/g, ' ').trim();
        const expectedMessage= `You have selected : ${nodes[0]} ${desktopFiles[0]} ${desktopFiles[1]}`;
        expect(actualMessage, 'Actual and expected confirmation text do not match').to.be.equal(expectedMessage);      
    });
    it('regression: should set parent folder to half-checked if unselect one child', async function() {
        await checkBoxPage.expandAndDo('click', tree, nodes[1], documentsFolders[1]);
        let folderState= await checkBoxPage.getCheckBoxState(tree);
        expect(folderState, `"${tree}" is not half-checked`).to.be.equal('half');
        await checkBoxPage.expandNode(documentsFolders[1]);
        await checkBoxPage.unclickChB(officeFiles[2]);
        folderState= await checkBoxPage.getCheckBoxState(documentsFolders[1]);
        expect(folderState, `"${documentsFolders[1]}" is not half-checked`).to.be.equal('half');
        folderState= await checkBoxPage.getCheckBoxState(tree);
        expect(folderState, `"${tree}" is not half-checked`).to.be.equal('half');
        const actualMessage= (await checkBoxPage.getCheckedFilesList()).replace(/\s+/g, ' ').trim();
        const expectedMessage= `You have selected : ${officeFiles[0]} ${officeFiles[1]} ${officeFiles[3]}`;
        expect(actualMessage, 'Actual and expected confirmation text do not match').to.be.equal(expectedMessage);
    });
    it('regression: should add parent folder name to confirmation text as soon as all children were selected', async function() {
        await checkBoxPage.expandAndDo('click', tree, nodes[1], documentsFolders[0], workspaceFiles[2]);
        await checkBoxPage.clickChB(workspaceFiles[0]);
        await checkBoxPage.clickChB(workspaceFiles[1]);
        const actualMessage= (await checkBoxPage.getCheckedFilesList()).replace(/\s+/g, ' ').trim();
        const expectedMessage= `You have selected : ${documentsFolders[0]} ${workspaceFiles[0]} ${workspaceFiles[1]} ${workspaceFiles[2]}`;
        expect(actualMessage, 'Actual and expected confirmation text do not match').to.be.equal(expectedMessage);
    });
    it('regression: should remove parent folder name from confirmation text if unselect one child', async function() {
        await checkBoxPage.expandAndDo('click', tree, nodes[1], documentsFolders[1]);
        await checkBoxPage.expandNode(documentsFolders[1]);
        await checkBoxPage.unclickChB(officeFiles[1]);
        const actualMessage= (await checkBoxPage.getCheckedFilesList()).replace(/\s+/g, ' ').trim();
        const expectedMessage= `You have selected : ${officeFiles[0]} ${officeFiles[2]} ${officeFiles[3]}`;
        expect(actualMessage, 'Actual and expected confirmation text do not match').to.be.equal(expectedMessage);
    });
    it('regression: should remove file names from confirmation text if unselect half-checked parent folder', async function() {
        await checkBoxPage.expandAndDo('click', tree, nodes[1], documentsFolders[1], officeFiles[0]);
        await checkBoxPage.clickChB(officeFiles[1]);
        await checkBoxPage.expandNode(nodes[2]);
        await checkBoxPage.clickChB(uniteAndTtrimExtention(downloadsFiles[0]));
        let actualMessage= (await checkBoxPage.getCheckedFilesList()).replace(/\s+/g, ' ').trim();
        let expectedMessage= `You have selected : ${officeFiles[0]} ${officeFiles[1]} ${uniteAndTtrimExtention(downloadsFiles[0])}`;
        expect(actualMessage, 'Actual and expected confirmation text do not match').to.be.equal(expectedMessage);
        await checkBoxPage.unclickChB(documentsFolders[1]);
        actualMessage= (await checkBoxPage.getCheckedFilesList()).replace(/\s+/g, ' ').trim();
        expectedMessage= `You have selected : ${uniteAndTtrimExtention(downloadsFiles[0])}`;
        expect(actualMessage, 'Actual and expected confirmation text do not match').to.be.equal(expectedMessage);
    });
    it('regression: should unselect all folders and files if uncheck main tree-folder', async function() {
        await checkBoxPage.expandAndDo('click', tree, nodes[1], nodes[0]);
        await checkBoxPage.expandNode(documentsFolders[0]);
        await checkBoxPage.clickChB(workspaceFiles[2]);
        const actualMessage= (await checkBoxPage.getCheckedFilesList()).replace(/\s+/g, ' ').trim();
        const expectedMessage= `You have selected : ${nodes[0]} ${desktopFiles[0]} ${desktopFiles[1]} ${workspaceFiles[2]}`;
        expect(actualMessage, 'Actual and expected confirmation text do not match').to.be.equal(expectedMessage);
        await checkBoxPage.unclickChB(tree);
        let folderState= await checkBoxPage.getCheckBoxState(nodes[0]);
        expect(folderState, `"${nodes[0]}" is not unchecked`).to.be.equal('uncheck');
        await checkBoxPage.expandNode(nodes[0]);
        folderState= await checkBoxPage.getCheckBoxState(desktopFiles[0]);
        expect(folderState, `"${desktopFiles[0]}" is not unchecked`).to.be.equal('uncheck');
        folderState= await checkBoxPage.getCheckBoxState(desktopFiles[1]);
        expect(folderState, `"${desktopFiles[1]}" is not unchecked`).to.be.equal('uncheck');
        folderState= await checkBoxPage.getCheckBoxState(workspaceFiles[2]);
        expect(folderState, `"${workspaceFiles[2]}" is not unchecked`).to.be.equal('uncheck');
    });
    it('regression: should restore all children when parent re-selected after manual deselection', async function() {
        await checkBoxPage.expandNode(tree);
        await checkBoxPage.clickChB(nodes[2]);
        await checkBoxPage.expandNode(nodes[2]);
        await checkBoxPage.unclickChB(uniteAndTtrimExtention(downloadsFiles[1]));
        let folderState= await checkBoxPage.getCheckBoxState(nodes[2]);
        expect(folderState, `"${nodes[2]}" is not half-checked`).to.be.equal('half');
        await checkBoxPage.unclickChB(uniteAndTtrimExtention(downloadsFiles[0]));
        folderState= await checkBoxPage.getCheckBoxState(nodes[2]);
        expect(folderState, `"${nodes[2]}" is not unchecked`).to.be.equal('uncheck');
        await checkBoxPage.clickChB(nodes[2]);
        folderState= await checkBoxPage.getCheckBoxState(nodes[2]);
        expect(folderState, `"${nodes[2]}" is not checked`).to.be.equal('check');
        let fileState= await checkBoxPage.getCheckBoxState(uniteAndTtrimExtention(downloadsFiles[0]));
        expect(fileState, `"${uniteAndTtrimExtention(downloadsFiles[0])}" is not checked`).to.be.equal('check');
        fileState= await checkBoxPage.getCheckBoxState(uniteAndTtrimExtention(downloadsFiles[1]));
        expect(fileState, `"${uniteAndTtrimExtention(downloadsFiles[1])}" is not checked`).to.be.equal('check');
    });
    it('regression: should select all files in the folder with half-check state', async function() {
        await checkBoxPage.expandAndDo('click', tree, nodes[1], documentsFolders[0], workspaceFiles[1]);
        let folderState= await checkBoxPage.getCheckBoxState(documentsFolders[0]);
        expect(folderState, `"${documentsFolders[0]}" is not half-checked`).to.be.equal('half');
        await checkBoxPage.clickChB(documentsFolders[0]);
        folderState= await checkBoxPage.getCheckBoxState(documentsFolders[0]);
        expect(folderState, `"${documentsFolders[0]}" is not checked`).to.be.equal('check');
        let fileState= await checkBoxPage.getCheckBoxState(workspaceFiles[0]);
        expect(fileState, `"${workspaceFiles[0]}" is not checked`).to.be.equal('check');
        fileState= await checkBoxPage.getCheckBoxState(workspaceFiles[1]);
        expect(fileState, `"${workspaceFiles[1]}" is not checked`).to.be.equal('check');
        fileState= await checkBoxPage.getCheckBoxState(workspaceFiles[2]);
        expect(fileState, `"${workspaceFiles[2]}" is not checked`).to.be.equal('check');
    });
});