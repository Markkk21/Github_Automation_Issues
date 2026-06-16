// Cache UI Elements references
const dropZone = document.getElementById('drop-zone');
const logDiv = document.getElementById('log');
const ownerInput = document.getElementById('owner');
const repoInput = document.getElementById('repo');
const tokenInput = document.getElementById('token');
const previewSection = document.getElementById('preview-section');
const previewBody = document.getElementById('preview-body');
const previewCount = document.getElementById('preview-count');
const importBtn = document.getElementById('import-btn');
const clearBtn = document.getElementById('clear-btn');

let parsedIssuesCache = []; // Global storage array for rows pending user clearance

// 1. Initial configuration bootstrap from Local Storage memory
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('git_owner')) ownerInput.value = localStorage.getItem('git_owner');
    if (localStorage.getItem('git_repo')) repoInput.value = localStorage.getItem('git_repo');
});

// Real-time input handlers saving non-sensitive project context tracking definitions
ownerInput.addEventListener('input', () => localStorage.setItem('git_owner', ownerInput.value.trim()));
repoInput.addEventListener('input', () => localStorage.setItem('git_repo', repoInput.value.trim()));

// 2. Logging Interface Engine
function writeLog(message, type = '') {
    const time = new Date().toLocaleTimeString();
    let cssClass = '';
    if (type === 'success') cssClass = 'class="success"';
    if (type === 'error') cssClass = 'class="error"';
    if (type === 'system') cssClass = 'class="system"';
    
    logDiv.innerHTML += `<div ${cssClass}>[${time}] ${message}</div>`;
    logDiv.scrollTop = logDiv.scrollHeight;
}

clearBtn.addEventListener('click', () => {
    logDiv.innerHTML = `<div class="system">[System] Logs cleared. Awaiting data configuration actions...</div>`;
});

// 3. Drag and Drop Animations listeners
dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('hover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('hover'));

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('hover');
    
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    
    const file = files[0];
    writeLog(`File detected: ${file.name}. Initializing binary reader pipeline...`, 'system');
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        let workbook;

        try {
            workbook = XLSX.read(data, { type: 'array' });
        } catch (err) {
            const decoder = new TextDecoder('utf-8');
            const textData = decoder.decode(data);
            workbook = XLSX.read(textData, { type: 'string' });
        }
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawRows = XLSX.utils.sheet_to_json(worksheet);
        
        if (rawRows.length === 0) {
            writeLog("Error: Staging target missing. No rows detected in sheet.", "error");
            return;
        }
        
        stageAndPreviewData(rawRows);
    };
    reader.readAsArrayBuffer(file);
});

// 4. Staging Array Map & Table Layout Renderer Gate
function stageAndPreviewData(rawRows) {
    parsedIssuesCache = [];
    previewBody.innerHTML = "";

    rawRows.forEach((row) => {
        // Multi-fallback lookup structure mappings
        const title = row["Title"] || row["title"] || row["TITLE"] || Object.values(row)[0] || "";
        const body = row["Body"] || row["body"] || row["BODY"] || Object.values(row)[1] || "";
        const labels = row["Labels"] || row["labels"] || row["LABELS"] || "";
        const assignee = row["Assignee"] || row["assignee"] || row["ASSIGNEE"] || "";

        if (title.toString().trim()) {
            parsedIssuesCache.push({
                title: title.toString().trim(),
                body: body.toString().trim(),
                labels: labels.toString().trim(),
                assignee: assignee.toString().trim()
            });

            // Append a row profile visually to display matrix table
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td title="${title}">${title}</td>
                <td title="${body || 'None'}">${body || '<span class="system">None</span>'}</td>
                <td title="${labels || 'None'}">${labels || '<span class="system">None</span>'}</td>
                <td title="${assignee || 'None'}">${assignee || '<span class="system">None</span>'}</td>
            `;
            previewBody.appendChild(tr);
        }
    });

    previewCount.innerText = `Data Preview (${parsedIssuesCache.length} Rows Staged)`;
    previewSection.style.display = "block";
    importBtn.disabled = false;
    writeLog(`Parsed ${parsedIssuesCache.length} entries successfully into staging table grid. Review data and click "Import to GitHub".`, 'system');
}

// 5. Explicit Execution Trigger via the Confirm Button click
importBtn.addEventListener('click', async () => {
    const token = tokenInput.value.trim();
    const owner = ownerInput.value.trim();
    const repo = repoInput.value.trim();

    if (!token || !owner || !repo) {
        writeLog("Error: Missing targeting parameters. Provide Token, Owner, and Repository credentials.", "error");
        return;
    }

    if (parsedIssuesCache.length === 0) {
        writeLog("Error: Staged buffer array data empty. Drop a tracker sheet first.", "error");
        return;
    }

    // Freeze inputs and execution triggers to shield active sequential processing cycles
    importBtn.disabled = true;
    writeLog(`Authorization cleared. Dispatched batch sync routines...`, 'system');

    for (let i = 0; i < parsedIssuesCache.length; i++) {
        const issue = parsedIssuesCache[i];
        
        // Parse tag array items
        let labelsArray = [];
        if (issue.labels) {
            labelsArray = issue.labels.split(',').map(item => item.trim()).filter(item => item !== "");
        }

        // Parse explicit assignment target handles
        let assigneesArray = [];
        if (issue.assignee) {
            assigneesArray = [issue.assignee];
        }

        writeLog(`[${i + 1}/${parsedIssuesCache.length}] Transferring request: "${issue.title}"...`);

        const payload = { title: issue.title, body: issue.body };
        if (labelsArray.length > 0) payload.labels = labelsArray;
        if (assigneesArray.length > 0) payload.assignees = assigneesArray;

        try {
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                writeLog(`Success -> Generated Issue #${data.number}!`, "success");
            } else {
                const errData = await response.json();
                writeLog(`API Rejection Warning: ${errData.message}`, "error");
            }
        } catch (error) {
            writeLog(`Network link interruption: ${error.message}`, "error");
        }
        
        // Secondary rate-limit safety latency lock delay step
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    writeLog("Batch processing cycle completed successfully!", "success");
    parsedIssuesCache = []; // Reset local memory
    previewSection.style.display = "none";
});