// console.log("🚀 Gmail AI Reply Extension Loaded");

// function createAIButton() {
//    const button = document.createElement('div');
//    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button';
//    button.style.marginRight = '8px';
//    button.textContent = 'AI Reply';
//    button.setAttribute('role','button');
//    button.setAttribute('data-tooltip','Generate AI Reply');
//    return button;
// }

// function getEmailContent() {
//     // Collect all visible email text blocks
//     const candidates = Array.from(document.querySelectorAll('div[dir="ltr"], div[dir="auto"]'))
//         .map(el => el.innerText.trim())
//         .filter(text => text.length > 30); // filter out short junk

//     if (candidates.length === 0) {
//         console.log("❌ No email content found");
//         return '';
//     }

//     // Pick the largest block of text (usually the main email)
//     const longest = candidates.reduce((a, b) => a.length > b.length ? a : b);
//     console.log("📧 Extracted email content:", longest.substring(0, 100) + "...");
//     return longest;
// }

// function findComposeToolbar() {
//     // Find the send button and climb up to toolbar
//     const sendBtn = document.querySelector('[aria-label*="Send"], [data-tooltip*="Send"]');
//     if (sendBtn) {
//         console.log("✅ Send button found");
//         return sendBtn.closest('[role="group"]');
//     }
//     return null;
// }

// function injectButton() {
//     const toolbar = findComposeToolbar();
//     if (!toolbar) {
//         console.log("❌ Toolbar not found - retrying...");
//         setTimeout(injectButton, 1000);
//         return;
//     }

//     // Avoid duplicate injection
//     if (toolbar.querySelector('.ai-reply-button')) return;

//     console.log("✅ Toolbar found, inserting AI button");
//     const button = createAIButton();

//     button.addEventListener('click', async () => {
//         try {
//             button.textContent = 'Generating...';
//             button.style.opacity = "0.6";

//             const emailContent = getEmailContent();
//             if (!emailContent) {
//                 alert("Could not detect email content");
//                 return;
//             }

//             const response = await fetch('http://localhost:8080/api/email/generate', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ emailContent, tone: "professional" })
//             });

//             if (!response.ok) throw new Error(`API Failed: ${response.status}`);

//             const reply = await response.text();
//             console.log("🤖 AI Reply:", reply.substring(0, 100) + "...");

//             const composeBox = document.querySelector('[aria-label="Message Body"]');
//             if (composeBox) {
//                 composeBox.focus();
//                 composeBox.innerText = reply;
//                 console.log("✅ Reply inserted successfully");
//             } else {
//                 console.error("❌ Compose box not found");
//                 alert("Could not insert reply - compose box not found.");
//             }
//         } catch (err) {
//             console.error("❌ Error generating reply:", err);
//             alert("Failed: " + err.message);
//         } finally {
//             button.textContent = 'AI Reply';
//             button.style.opacity = "1";
//         }
//     });

//     toolbar.insertBefore(button, toolbar.firstChild);
// }

// const observer = new MutationObserver(() => {
//     if (document.querySelector('[aria-label*="Send"], [data-tooltip*="Send"]')) {
//         injectButton();
//     }
// });

// observer.observe(document.body, { childList: true, subtree: true });

// // Try immediately if compose already open
// setTimeout(injectButton, 2000);

// // function insertReplyWithAIButton() {
// //     // Find all reply toolbars
// //     const toolbars = document.querySelectorAll('div[aria-label="Message Body"]')
// //     toolbars.forEach(toolbar => {
// //       // Prevent duplicate button
// //       if (toolbar.parentNode.querySelector('.reply-with-ai-btn')) return;
  
// //       // Create button
// //       const button = document.createElement('button');
// //       button.innerText = "✨ Reply with AI";
// //       button.className = "reply-with-ai-btn";
// //       button.style.marginLeft = "8px";
// //       button.style.padding = "4px 8px";
// //       button.style.borderRadius = "6px";
// //       button.style.border = "1px solid #ccc";
// //       button.style.cursor = "pointer";
  
// //       // Add click handler
// //       button.addEventListener('click', () => {
// //         const replyBox = toolbar; // the editable div
// //         const text = replyBox.innerText || replyBox.textContent;
  
// //         // Here you call your backend / Gemini API with `text`
// //         console.log("Selected text for AI reply:", text);
// //       });
  
// //       // Insert button into toolbar container
// //       toolbar.parentNode.appendChild(button);
// //     });
// //   }
  
// //   // Observe DOM changes since Gmail loads toolbars dynamically
// //   const observer = new MutationObserver(() => insertReplyWithAIButton());
// //   observer.observe(document.body, { childList: true, subtree: true });
  
// //   // Run once on load
// //   insertReplyWithAIButton();

// content.js

console.log("AI Reply Extension loaded...");

// Helper: Wait for element to appear in DOM
function waitForElement(selector, callback, timeout = 10000) {
  const start = Date.now();
  const interval = setInterval(() => {
    const el = document.querySelector(selector);
    if (el) {
      clearInterval(interval);
      callback(el);
    } else if (Date.now() - start > timeout) {
      clearInterval(interval);
      console.warn(`Timeout waiting for selector: ${selector}`);
    }
  }, 500);
}

// Inject AI button into Gmail reply toolbar
function injectAIButton(toolbar) {
  if (toolbar.querySelector(".ai-reply-btn")) return; // Avoid duplicates

  const btn = document.createElement("button");
  btn.innerText = "Reply with AI";
  btn.className =
    "ai-reply-btn T-I J-J5-Ji aoO v7 T-I-atl L3"; // Gmail-like button styling

  btn.style.marginLeft = "8px";

  btn.onclick = async () => {
    console.log("AI Reply button clicked...");

    // Get email body text from Gmail compose editor
    const editableDiv = toolbar
      .closest("div[role='dialog']")
      .querySelector("div[aria-label='Message Body']");
    if (!editableDiv) {
      alert("Could not find email body!");
      return;
    }

    const emailContent = editableDiv.innerText;
    console.log("Sending email content to backend:", emailContent);

    try {
      // Call your Spring Boot backend API
      const response = await fetch("http://localhost:8080/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: emailContent }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();

      console.log("AI response:", data);

      // Insert AI response into the Gmail draft editor
      editableDiv.innerText = data.reply || "⚠️ No reply generated!";
    } catch (err) {
      console.error("Error fetching AI reply:", err);
      alert("Failed to fetch AI reply. Check console for details.");
    }
  };

  toolbar.appendChild(btn);
}

// Observe DOM changes to find Gmail toolbars dynamically
const observer = new MutationObserver(() => {
  document.querySelectorAll("div[aria-label='Toolbar']").forEach((toolbar) => {
    injectAIButton(toolbar);
  });
});

observer.observe(document.body, { childList: true, subtree: true });