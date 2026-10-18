// --- Mock Database for DominoArchive Legacy Files ---
const mockDocuments = {
  "doc-99812": {
    title: "Formal Letter: System Integrity",
    refId: "Ref ID: DOM-2005-99812",
    date: "2005-09-12",
    sender: "compliance@domino.corp",
    subject: "Q3 Compliance Update",
    body: "To the System Administrator,<br><br>This correspondence serves as formal verification of the financial audit parameters established for the current fiscal quarter. Our internal archives indicate a shift in retention policy regarding the following ledger entries. Please verify the entries in the table below for immediate compliance clearance.",
    hasTable: true,
    tableHeaders: ["AUDIT ID", "CATEGORY", "STATUS", "VALUE (USD)"],
    tableRows: [
      { id: "3288", category: "Hardware Ops", status: "Verified", badgeClass: "status-verified", value: "$4,200.00" },
      { id: "4921", category: "Financial Audit", status: "Action Required", badgeClass: "status-action", value: "$158,920.00" },
      { id: "5102", category: "Legacy Data", status: "Archived", badgeClass: "status-archived", value: "$12,450.00" }
    ]
  },
  "doc-99810": {
    title: "Server Decommissioning Plan",
    refId: "Ref ID: SRV-2005-44910",
    date: "2005-09-10",
    sender: "it-ops-central",
    subject: "Server Migration Schedule",
    body: "Attention Operations Team,<br><br>As part of the decommissioning process for the legacy IBM Domino/Lotus Notes cluster, we are scheduling migration windows. Please review the hardware parameters and current CPU load on the remaining active nodes listed in the table below. Decrypt files before backup.",
    hasTable: true,
    tableHeaders: ["SERVER NODE", "IP ADDRESS", "STATUS", "CPU LOAD"],
    tableRows: [
      { id: "DOMINO-PROD-01", category: "10.0.4.12", status: "Active", badgeClass: "status-verified", value: "85%" },
      { id: "DOMINO-ARCHIVE", category: "10.0.4.15", status: "Archived", badgeClass: "status-archived", value: "12%" },
      { id: "DOMINO-BACKUP", category: "10.0.5.20", status: "Decommissioned", badgeClass: "status-action", value: "0%" }
    ]
  },
  "doc-99808": {
    title: "Project Domino Kickoff Briefing",
    refId: "Ref ID: PRJ-2005-00108",
    date: "2005-09-08",
    sender: "archivist-prime",
    subject: "Project Domino Kickoff",
    body: "Team,<br><br>The official launch of Project Domino is scheduled for next week. The objective is to compile twenty years of corporate database archives into a centralized structure. We will implement key phases as detailed in the timeline schema below.",
    hasTable: true,
    tableHeaders: ["PHASE", "OBJECTIVE", "STATUS", "ETA"],
    tableRows: [
      { id: "Phase 1", category: "NSF Parsing Engine Development", status: "Completed", badgeClass: "status-verified", value: "Oct 2005" },
      { id: "Phase 2", category: "RAG & AI Indexing Validation", status: "Active", badgeClass: "status-action", value: "Dec 2005" },
      { id: "Phase 3", category: "HSM Keys Migration", status: "Planned", badgeClass: "status-archived", value: "Feb 2006" }
    ]
  },
  "doc-99805": {
    title: "Security Protocols & Access Rights",
    refId: "Ref ID: SEC-2005-11505",
    date: "2005-09-05",
    sender: "hr-no-reply",
    subject: "System Access Protocols",
    body: "Dear Legal & Compliance Staff,<br><br>This document outlines the standard security protocols and user group mapping for retrieving legal data. In accordance with the Access Control List (ACL), the following roles have been authorized in the primary database.",
    hasTable: true,
    tableHeaders: ["USER ROLE", "IDENTITIES GROUP", "STATUS", "SECURITY LEVEL"],
    tableRows: [
      { id: "Senior Counsel", category: "LegalDept/Corporate", status: "Authorized", badgeClass: "status-verified", value: "Level 4" },
      { id: "Compliance Officer", category: "AuditDept/Corporate", status: "Authorized", badgeClass: "status-verified", value: "Level 3" },
      { id: "External Auditor", category: "Auditors/External", status: "Restricted", badgeClass: "status-action", value: "Level 1" }
    ]
  }
};

// --- DOM References ---
const documentRowsContainer = document.getElementById("document-list-rows");
const previewDocTitleText = document.getElementById("preview-doc-title-text");
const docTitle = document.getElementById("doc-title");
const docRefId = document.getElementById("doc-ref-id");
const docBodyText = document.getElementById("doc-body-text");
const docSpreadsheetContainer = document.getElementById("doc-spreadsheet-container");
const exportPdfBtn = document.getElementById("export-pdf-btn");
const loadingOverlay = document.getElementById("loading-overlay");
const loadingMessage = document.getElementById("loading-message");

const aiChatHistory = document.getElementById("ai-chat-history");
const chatInputBox = document.getElementById("chat-input-box");
const chatSendBtn = document.getElementById("chat-send-btn");

const navItems = document.querySelectorAll(".nav-list .nav-item");
const workspaceTabs = document.querySelectorAll(".tabs-strip .workspace-tab");

let activeDocId = "doc-99812";

// --- Function to Load Selected Document into Preview Pane ---
function loadDocument(docId) {
  const doc = mockDocuments[docId];
  if (!doc) return;

  activeDocId = docId;

  // Highlight selected row in table list
  document.querySelectorAll(".grid-row").forEach(row => {
    if (row.getAttribute("data-doc-id") === docId) {
      row.classList.add("selected");
    } else {
      row.classList.remove("selected");
    }
  });

  // Update preview fields
  previewDocTitleText.textContent = `Document View: ${doc.title}`;
  docTitle.textContent = doc.title;
  docRefId.textContent = doc.refId;
  docBodyText.innerHTML = doc.body;

  // Render Table
  if (doc.hasTable) {
    docSpreadsheetContainer.style.display = "block";
    let tableHtml = `
      <table class="spreadsheet-table">
        <thead>
          <tr>
            ${doc.tableHeaders.map(h => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${doc.tableRows.map(row => `
            <tr ${row.id === '4921' ? 'id="row-4921"' : ''}>
              <td>${row.id}</td>
              <td>${row.category}</td>
              <td><span class="status-badge ${row.badgeClass}">${row.status}</span></td>
              <td>${row.value}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    docSpreadsheetContainer.innerHTML = tableHtml;
  } else {
    docSpreadsheetContainer.style.display = "none";
  }
}

// --- Dynamic Citation Link Highlight Action ---
function highlightCitation() {
  // 1. Switch left nav highlight to "Archive Legal"
  navItems.forEach(item => {
    if (item.getAttribute("data-folder") === "archive-legal") {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // 2. Load correct document
  loadDocument("doc-99812");

  // 3. Highlight specific table row with CSS animation class
  setTimeout(() => {
    const targetRow = document.getElementById("row-4921");
    if (targetRow) {
      targetRow.classList.add("spreadsheet-row-highlight");
      
      // Scroll smoothly to target row
      targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Remove highlighting after 6 seconds
      setTimeout(() => {
        targetRow.classList.remove("spreadsheet-row-highlight");
      }, 6000);
    }
  }, 300);
}

// --- Attach UI Grid Selectors ---
documentRowsContainer.addEventListener("click", (e) => {
  const row = e.target.closest(".grid-row");
  if (row) {
    const docId = row.getAttribute("data-doc-id");
    loadDocument(docId);
  }
});

// --- Attach Left Navigator Clicks ---
navItems.forEach(item => {
  item.addEventListener("click", () => {
    navItems.forEach(nav => nav.classList.remove("active"));
    item.classList.add("active");
  });
});

// --- Attach Workspace Tab Clicks ---
workspaceTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    workspaceTabs.forEach(t => {
      t.classList.remove("active");
      t.classList.add("inactive");
    });
    tab.classList.remove("inactive");
    tab.classList.add("active");
  });
});

// --- Attach Citation Link Clicks ---
const citationLink = document.getElementById("citation-4921");
if (citationLink) {
  citationLink.addEventListener("click", highlightCitation);
}

// --- Certified Export Download Action ---
exportPdfBtn.addEventListener("click", () => {
  loadingMessage.textContent = "Mengunduh Arsip Tersertifikasi PDF/A...";
  loadingOverlay.style.display = "flex";

  setTimeout(() => {
    loadingMessage.textContent = "Menyematkan Sertifikat & Tanda Tangan Kriptografis...";
    
    setTimeout(() => {
      loadingOverlay.style.display = "none";
      alert("Ekspor Berhasil!\n\nDokumen '" + mockDocuments[activeDocId].title + "' telah dikonversi ke PDF/A, di-enkripsi, dan tersertifikasi secara digital dengan hash:\nsha256_8899aabbccddeeff11223344556677889900aabbccddeeff1122334455667788");
    }, 1200);
  }, 1200);
});

// --- AI Interactive Chat Engine Simulator ---
function appendChatMessage(sender, text, isAi = false, citationText = null) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${isAi ? 'ai' : 'user'}`;
  
  const senderSpan = document.createElement("span");
  senderSpan.className = "message-sender";
  senderSpan.textContent = sender;
  bubble.appendChild(senderSpan);

  const textParagraph = document.createElement("p");
  textParagraph.textContent = text;
  bubble.appendChild(textParagraph);

  if (isAi && citationText) {
    const linkSpan = document.createElement("span");
    linkSpan.className = "citation-link";
    linkSpan.innerHTML = `<i class="material-icons">gps_fixed</i><span>${citationText}</span>`;
    linkSpan.addEventListener("click", highlightCitation);
    bubble.appendChild(linkSpan);
  }

  aiChatHistory.appendChild(bubble);
  
  // Auto-scroll chat to bottom
  aiChatHistory.scrollTop = aiChatHistory.scrollHeight;
}

function handleSendMessage() {
  const text = chatInputBox.value.trim();
  if (!text) return;

  // 1. Append User Message
  appendChatMessage("System Operator", text, false);
  chatInputBox.value = "";

  // 2. Typing Bubble Simulation
  const typingBubble = document.createElement("div");
  typingBubble.className = "chat-bubble ai";
  typingBubble.id = "ai-typing-indicator";
  typingBubble.innerHTML = `<span class="message-sender">AI Compliance Officer</span><p>Sedang menganalisis arsip...</p>`;
  aiChatHistory.appendChild(typingBubble);
  aiChatHistory.scrollTop = aiChatHistory.scrollHeight;

  // 3. AI Smart Response Generator
  setTimeout(() => {
    const indicator = document.getElementById("ai-typing-indicator");
    if (indicator) indicator.remove();

    let reply = "";
    let citation = null;
    const lowerText = text.toLowerCase();

    if (lowerText.includes("4921") || lowerText.includes("anggaran") || lowerText.includes("audit")) {
      reply = "Berdasarkan dokumen kepatuhan hukum 'Formal Letter: System Integrity' (2005), Audit ID 4921 berstatus 'Action Required' karena anggaran sebesar $158,920.00 belum dilengkapi dengan sertifikat retensi fisik. Hal ini dapat menimbulkan temuan kepatuhan hukum jika tidak segera dipindahkan.";
      citation = "ID-4921-REF";
    } else if (lowerText.includes("server") || lowerText.includes("migrasi") || lowerText.includes("domino")) {
      reply = "Dalam database 'Server Decommissioning Plan' (10 September 2005), tercatat bahwa modul biner server DOMINO-BACKUP berstatus 'Decommissioned' (non-aktif) sedangkan server utama DOMINO-PROD-01 masih memproses 85% CPU load. Dekripsi biner wajib dilakukan sebelum server utama dimatikan.";
      
      // Interactive transition helper
      loadDocument("doc-99810");
      reply += " [Membuka berkas migrasi server...]";
    } else if (lowerText.includes("halo") || lowerText.includes("hai") || lowerText.includes("hello")) {
      reply = "Halo! Saya AI Compliance Officer. Saya siap menganalisis arsip Domino Anda dan membongkar data compliance lama. Silakan tanyakan hal-hal terkait Audit ID 4921, migrasi server, atau otorisasi hak akses.";
    } else if (lowerText.includes("akses") || lowerText.includes("security") || lowerText.includes("legal")) {
      reply = "Sesuai berkas 'Security Protocols & Access Rights' (2005), tim LegalDept/Corporate memiliki hak akses level 4 (Senior Counsel). Pastikan identitas ACL terpetakan secara konsisten ke dalam basis pengetahuan RAG.";
      loadDocument("doc-99805");
      reply += " [Membuka berkas ACL...]";
    } else {
      reply = "Saya telah memindai seluruh basis pengetahuan arsip VFS-01-BRAIN. Pertanyaan Anda berkaitan dengan pencarian audit lintas folder. Silakan ketik secara spesifik: 'Analisis ID 4921' atau 'Status migrasi server' untuk melihat kutipan dokumen secara langsung.";
    }

    appendChatMessage("AI Compliance Officer", reply, true, citation);
  }, 1500);
}

// --- Attach Send Buttons ---
chatSendBtn.addEventListener("click", handleSendMessage);
chatInputBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSendMessage();
  }
});

// --- Initialize Workspace ---
loadDocument("doc-99812");
