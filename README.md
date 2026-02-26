# Selenium_JS
An automation testing project using Selenium WebDriver with JavaScript.

## Project Overview
Automated UI tests for the DemoQA sample web application, implemented with Selenium WebDriver and JavaScript.
The project follows the Page Object Model and includes reusable components, utilities, and structured test suites.
API testing artifacts for the DemoQA Book Store authorization endpoints are also included.

## Prerequisites / Environment
- Node.js v22.20.0
- npm v10.9.3
- Windows 10 Pro
- Chrome v144 (tested)

## Project Setup
1. Clone the repo:
```git clone https://github.com/OlgaFilili/Selenium_JS ```

2. Navigate to project folder:
```cd Selenium_JS ```

3. Install dependencies:
```npm install ```

4. Project Structure
Selenium_JS/
├─ .github/
│   └─ workflows/
│       └─ ci.yml                     # GitHub Actions workflow (E2E tests)
├─ api/  
│   ├─ UserApi.js                     # API calls for creating/deleting users
│   └─ index.js    
├─ components/                        # Reusable elements
│   ├─ BooksTable.js
│   └─ MainMenu.js
├─ docs/  
│   ├─ api/
│   │   ├─ bugs/                      # Bug reports linked to test cases
│   │   ├─ test-cases/                # API test cases (smoke, regression)
│   │   └─ README.md                  # API testing overview
│   ├─ flows/bugs/     
│   │   └─ bugs.md                    # API testing overview               
│   └─ ui/bugs/ 
│       ├─ booksTable_component.md
│       └─ profilePage.md
├─ node_modules/                      # Installed dependencies (ignored by Git)
├─ pages/                             # Page Object Model classes
│   ├─ alerts/
│   │   └─BrowserWindowsPage.js
│   ├─ book_store/
│   │   ├─ AuthenticatedPage.js
│   │   ├─ BooksPage.js
│   │   ├─ LoginPage.js
│   │   ├─ ProfilePage.js
│   │   └─ SwaggerPage.js
│   ├─ elements/
│   │   ├─ CheckBoxPage.js
│   │   ├─ RadioButtonPage.js
│   │   └─ WebTablesPage.js
│   ├─ forms/
│   │   └─AutomationPracticeFormPage.js
│   ├─ interactions/
│   │   ├─ DroppablePage.js
│   │   └─ SortablePage.js
│   ├─ widgets/
│   │   └─DatePickerPage.js
│   ├─ AlertsFrameWindowsPage.js
│   ├─ BasePage.js
│   ├─ ElementsPage.js
│   ├─ FormsPage.js
│   └─ HomePage.js
├─ tests/                             # Test scripts
│   ├─ book_store/
│   │   ├─ flows   
│   │   │   ├─ AuthSessionTest.js
│   │   │   ├─ DeleteUserAccountSuccessTest.js
│   │   │   ├─ LoginNegativeTest.js
│   │   │   └─ LoginSuccessTest.js
│   │   └─ ui
│   │       ├─ BooksTableTest.js
│   │       ├─ BooksUITest.js
│   │       ├─ LoginUITest.js
│   │       └─ ProfileUITest.js
│   ├─ elements/
│   │   ├─ CheckBoxTest.js
│   │   ├─ RadioButtonTest.js
│   │   └─ WebTablesTest.js
│   ├─ helpers/                       # Test helper functions
│   │   ├─ LoginHelper.js
│   │   └─ LogoutHelper.js
│   ├─ setup/                         # Creates permanent test user for CI
│   │   └─ EnsureTestUser.js
│   ├─ BaseTest.js                    # Common test setup/teardown
│   ├─ MainMenuResponsiveTest.js   
│   └─ MainMenuTest.js  
├─ utils/                             # Utility/helper functions
│   ├─ AlertUtils.js
│   ├─ BrowserUtils.js
│   ├─ DriverUtils.js
│   ├─ PageFactoryUtils.js
│   ├─ ScreenshotUtils.js
│   ├─ StringUtils.js
│   └─ WaitUtils.js
├─ package.json                       # Node.js dependencies and scripts
├─ package-lock.json                  # Locked dependency versions
└─ README.md                          # Project documentation

5. Running Tests
Run all tests locally:
```npx mocha tests/```
Locally: tests run with a visible Chrome browser (headed mode).
To create a permanent user on a local machine, you can add scripts to package.json:
"scripts": {
  "setup:user": "node tests/setup/EnsureTestUser.js",
  "test:ui": "npm run setup:user && mocha tests/**/*.js --timeout 30000"
}
Then run locally:
```npm run test:ui```

CI (GitHub Actions): tests run headless; permanent test user is created automatically via tests/setup/EnsureTestUser.js.
Note: LoginPage tests currently use hard-coded credentials as part of an early development phase. CI ensures a test user exists, so tests can run reliably.

## Project Status
Fully functional with working Mocha tests.
Page Object Model implemented (pages/, components/ and utils/ folders).
Shared abstractions are used for common behavior, including an AuthenticatedPage base class for authorized user state.
Test coverage includes:
- UI component validation (Elements, BooksTable)
- Navigation and layout checks
- Book Store authentication flows (UI, functional, session-level)

Core reusable components: BaseTest.js, BasePage.js.

## API Testing
Covered areas:
- Authorization endpoint testing
  - Smoke and regression test cases
  - Negative and boundary scenarios
  - Basic security observations

Test cases and bug reports can be found in:
- `docs/api/`
This part of the project demonstrates API endpoints testing approach, test design, and bug reporting skills.
API analysis is used to support UI and end-to-end authorization testing.

## UI Test Structure Notes
UI tests are organized based on the complexity and behavior of the tested area.
- For isolated components (Elements), tests focus on direct UI checks.
- For Book Store functionality, tests are grouped by intent:
  - `ui/` — UI-level checks (layout, labels, element visibility)
  - `flows/` — functional user flows (authentication, navigation, user account deletion, state changes)

- Authorization automation is split into three layers:
  - Login UI validation
  - Login functionality (positive / negative)
  - Authorization session flow (state-based behavior)

## CI / GitHub Actions
This project uses **GitHub Actions** for automated E2E tests.
Key points for the current setup:
- CI runs only on Pull Requests to main when JS files, package.json/package-lock.json, or workflow files change.
- Manual trigger via workflow_dispatch is available for reruns outside PRs.
- Permanent test user creation is integrated into CI (EnsureTestUser.js) to avoid test failures due to missing credentials.
- Screenshots are captured for failed tests.
- Some tests may fail consistently due to DemoQA app issues; this is expected and demonstrates real-world test handling:
  - real UI test execution
  - handling of unstable test environments
  - capturing failure artifacts

This setup is primarily educational and was added to better understand how automated tests can be integrated into CI pipelines.

## Notes
ChromeDriver is managed via the chromedriver package.
Tests are written using Mocha + Chai + Selenium WebDriver.
Async/await is used consistently for reliable asynchronous handling.
Screenshot capture is enabled for failing tests.
Bugs discovered during automation are documented in docs/flows/ and docs/ui/ folders.

