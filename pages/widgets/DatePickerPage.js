const BasePage = require("../BasePage.js");
const MainMenu = require("../../components/MainMenu.js");

class DatePickerPage extends BasePage
{
    constructor(driver) {
        super(driver);
        this.menu= new MainMenu(driver);
        this.mainHeader= "//div//h1";
        this.datePicker= { id: "datePickerMonthYear"};
        this.dateAndTimePicker= { id: "dateAndTimePicker"};
    }
    async getMainHeader(){
        return await this._getText(this.mainHeader);
    }
    async pickOnlyDate(){
        await this._click(this.datePicker);
    }
    async cpickDateAndTime(){
        await this._click(this.dateAndTimePicker);
    }
}
module.exports= DatePickerPage;