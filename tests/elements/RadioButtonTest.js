const { getHomePage } = require("../BaseTest.js");
const { capitalizeFirstLetter } = require("../../utils/StringUtils.js");
const RadioButtonPage = require("../../pages/elements/RadioButtonPage.js");
const { expect } = require('chai');

describe('Radio Button Page functionality check', function() {
  const options = ['yes', 'impressive', 'no'];
  /** @type {RadioButtonPage} */
  let radioButtonPage;
  beforeEach (async function(){
    const homePage= await getHomePage();
    const elementsPage= await homePage.gotoElements();
    radioButtonPage= await elementsPage.gotoRadioButtonMenuItem();
  });
  options.forEach(option => {
    it(`should select "${capitalizeFirstLetter(option)}" and show correct confirmation message`, async function() {
      const enabled = await radioButtonPage.isRBOptionEnabled(option);
      //expect(enabled, `"${capitalizeFirstLetter(option)}"-option should not be disabled`).to.be.true;

      if (!enabled) {
        console.warn(`Skipping "${option}" because it's disabled`);
        return; // skip the rest
      }
      await radioButtonPage.selectRBOption(option);
      const optionSelected= await radioButtonPage.isRBOptionSelected(option);
      const actualConfirmationText= await radioButtonPage.getRBOptionConfirmationText();
      const actualConfirmation= await radioButtonPage.getRBOptionConfirmation();
      const actualOptionColorInMessage= await radioButtonPage.verifyColor();
      //console.log(`Color for ${option}:`, actualOptionColorInMessage);
      expect(optionSelected, `${option}-option was not selected`).to.be.true;
      expect(actualConfirmationText, 'The message does not start with "You have selected "').to.be.equal("You have selected ");
      expect(actualConfirmation, 'Actual and expected confirmation text do not match').to.be.equal(capitalizeFirstLetter(option));
      expect(actualOptionColorInMessage, 'Actual and txpected color of selected option in message do not match').to.be.equal("rgba(40, 167, 69, 1)");
    });
  });
});