
## 🛠 Tech Stack

| Technology | Purpose | Why this choice? |
| :--- | :--- | :--- |
| **Selenium WebDriver** | Core Engine | Industry-standard for cross-browser stability and W3C protocol compliance. |
| **JavaScript (Node.js)** | Language | High-performance asynchronous execution using `async/await` for modern web apps. |
| **Mocha & Chai** | Test Runner | A mature BDD framework providing clean, readable test reports and robust assertions. |
| **Page Object Model** | Design Pattern | Ensures high maintainability by separating UI logic from test scripts. |
| **GitHub Actions** | CI/CD | Automates the "Shift-Left" approach, ensuring every PR is production-ready. |



---

## 🎯 What was Automated & Why

### **1. End-to-End (E2E) UI Testing**
* **Scope:** Comprehensive coverage of the **DemoQA** ecosystem, including complex widgets (DatePicker), interactions (Sortable/Droppable), and data-heavy components (Web Tables).
* **Objective:** To ensure core user journeys—like searching for books and managing profiles—remain functional across different browser versions.

### **2. API Testing (Shift-Left Strategy)**
* **Scope:** Authorization endpoints for the Book Store (CreateUser, GenerateToken, DeleteUser).
* **Objective:** Validating backend logic independently of the UI speeds up bug detection and supports reliable data setup for E2E flows.
* **Artifacts:** Documented smoke/regression test cases and bug reports located in `docs/api/`.

### **3. CI/CD & Infrastructure**
* **Environment:** Tested on **Chrome v144** and **Windows 10 Pro**.
* **Automation:** Automated headless execution in GitHub Actions to simulate real-world deployment pipelines.

---

## 🏆 Key Achievements & Highlights

* **Framework Maturity:** Built a modular, scalable framework from "zero-to-one," including custom utilities for screenshots, alerts, and advanced waiting mechanisms.
* **Multi-Layer Auth Automation:** Authorization is validated at three distinct levels: UI consistency, functional logic, and session-level state behavior.
* **Self-Healing CI Data:** Implemented an `EnsureTestUser.js` setup script to automatically manage test data in CI, preventing failures due to missing credentials.
* **Failure Intelligence:** Integrated automatic screenshot capture for failed tests and documented discovered bugs in `docs/flows/` to demonstrate transparent quality engineering.

---


## 🚀 Quick Start / Run Instructions

Get the automation suite running locally in minutes:

1. **Clone & Navigate**:
```bash
git clone https://github.com/anatolii-v/js-selenium && cd js-selenium

```


2. **Install Dependencies**:
```bash
npm install

```


3. **Setup Test User**:
*Required for authentication-based tests to run reliably in both local and CI environments.*
```bash
npm run setup:user

```


4. **Execute All Tests**:
```bash
npm run test:ui

```
