# Excel to GitHub Issue Importer (SPA)

A lightweight, secure, dark-mode Single Page Application (SPA) designed to streamline project tracking and bug logging. This utility allows developers and project managers to drag and drop an Excel sheet or CSV file directly into their browser to instantly populate batch issues in a target GitHub repository.

---

## 🚀 Features

- **100% Serverless & Client-Side:** Processes files locally in your browser. Your GitHub Personal Access Tokens and spreadsheet rows never touch a third-party server.
- **Smart Column Mapping:** Header-proof design automatically detects common column name variations (`Title`, `title`, `Body`, `Description`, etc.) or safely defaults to the first two columns.
- **Advanced Metadata Injection:** Parses multi-column sheets to seamlessly attach **Labels** (comma-separated arrays) and **Assignees** (individual GitHub usernames) dynamically.
- **Multi-Format Ingestion:** Native binary `.xlsx` spreadsheet layouts and raw plaintext `.csv` file formats are handled dynamically by an abstraction reading engine.
- **Rate-Limit Safeguards:** Built-in throttling latency layer (500ms request delays) prevents network submission dropouts against GitHub's secondary rate-limit policies.
- **Modern Dark-Mode Interface:** Styled to seamlessly complement the native GitHub dark-palette aesthetic with active process tracking logs and clean action controls.

---

## 📊 Spreadsheet Template Format

To ensure perfect issue deployment execution, structure your `.xlsx` or `.csv` file with headers in the first row. The script scans the **very first tab** of your file layout.

| Title | Body | Labels | Assignee |
| :--- | :--- | :--- | :--- |
| Critical: Authentication crash | App breaks when user master list is missing. | bug, critical | escarema |
| Create user documentation | Write a step-by-step guide for new employee accounts. | documentation | johndoe |

- **Title (Required):** The main headline of the issue ticket.
- **Body (Optional):** Markdown syntax written inside the body cell renders perfectly on GitHub.
- **Labels (Optional):** Separate multiple tag classifications using commas.
- **Assignee (Optional):** Must exactly match a public GitHub handle.

---

## 🛠️ Step-by-Step Setup

### 1. Generate your GitHub Token
1. Go to your GitHub account **Settings > Developer settings > Personal access tokens > Fine-grained tokens**.
2. Click **Generate new token**.
3. Under **Repository access**, choose *Only select repositories* and point it to your target repository.
4. Under **Permissions > Repository permissions**, scroll down to **Issues** and grant **Read and Write** access.
5. Generate and copy the token (`github_pat_...`).

### 2. Local App Execution
1. Download or clone this repository file structure.
2. Double-click the `index.html` file to run it locally in any modern browser tab.
3. Supply your **Personal Access Token**, **Repository Owner Handle**, and the exact **Repository Name**.
4. Drag and drop your tracking file onto the active drop zone to initialize the automated synchronization loop.
