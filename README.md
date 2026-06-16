# Excel to GitHub Issue Importer (SPA)

A lightweight, secure, dark-mode Single Page Application (SPA) to batch-import issues into GitHub repositories directly from an Excel sheet or CSV file.

🔗 **Live Deployment:** [Launch App](https://markkk21.github.io/Github_Automation_Issues)

---

## 🚀 Features

* **100% Client-Side:** Secure processing entirely in the browser. Credentials and tokens never touch third-party servers.
* **Smart Preview Gate:** Previews and checks parsed columns before initiating the export pipeline.
* **Auto Mapping:** Dynamically looks up metadata variables (`Title`, `Body`, `Labels`, `Assignee`).
* **Rate-Limit Throttling:** Automated 500ms API delays prevent hitting GitHub secondary limit boundaries.
* **Local Memory:** Remembers your repository tracking profiles across tab sessions.

---

## 📊 File Format Guide

Format your `.xlsx` or `.csv` file using headers in the first row. The importer reads the very first sheet tab.

| Title | Body | Labels | Assignee |
| :--- | :--- | :--- | :--- |
| Bug: App crashing on login | System errors out during token checks. | bug, critical | octocat |
| Setup documentation | Write a step-by-step developer setup manual. | docs | master-coder |

* **Title (Required):** The main ticket headline.
* **Body:** Optional detailed markdown specifications text.
* **Labels:** Optional comma-separated tags (creates them if missing).
* **Assignee:** Optional exact GitHub user profile handle.

---

## 🛠️ Getting Started

### 1. Get a GitHub PAT Token
1. Go to **Settings > Developer Settings > Personal access tokens > Fine-grained tokens**.
2. Click **Generate new token**. Select your target repository.
3. Under **Permissions > Repository permissions**, set **Issues** to **Read and Write**.
4. Copy your new `github_pat_...` key token.

### 2. Run the App
1. Open the [Live Web Tool](https://markkk21.github.io/Github_Automation_Issues).
2. Input your **Token**, **Repository Owner**, and **Repository Name**.
3. Drag & drop your spreadsheet file into the landing zone.
4. Review the data on the staging grid and click **Import to GitHub** to trigger the batch pipeline.