(async function () {
  const hostname = window.location.hostname.replace(/^www\./, "");

  const { sites, debtMessage } = await chrome.storage.local.get([
    "sites",
    "debtMessage"
  ]);

  if (!sites || sites.length === 0) return;

  const isMatch = sites.some((s) => {
    const clean = s.replace(/^www\./, "").toLowerCase();
    return hostname === clean || hostname.endsWith("." + clean);
  });

  if (!isMatch) return;

  const generalPrompts = [
    "Pause for a second. Do you actually need this, or is this a browse-because-bored visit?",
    "Quick check-in: does this purchase move you closer to your goals, or further away?",
    "You opened this tab for a reason — is it a need, or a want dressed up as one?"
  ];

  const questions=[
    "Let's stop and think. What prompted you to shop here? Impulse or actual need? Will you be ok without it for the next two weeks?",
    "Would you rather have this item or be get closer to being debt free?"
  ];

  let index = 0; 

  // Alternate between the user's custom debt message and a general prompt.
  const useDebtMessage = Math.random() < 0.5;
  const message = useDebtMessage
    ? debtMessage
    : generalPrompts[Math.floor(Math.random() * generalPrompts.length)];

  injectOverlay(message, questions, hostname);

  function injectOverlay(message, questions,site) {
    const overlay = document.createElement("div");
    overlay.id = "debt-guard-overlay";
    overlay.classList.add('debt-guard-card');

    overlay.innerHTML= `<div class="debt-guard-card"><p>${escapeHtml(message)}</p>`;
    
    if (index >= questions.length) {
      renderFinalScreen(); // no more questions, show Leave/Continue
      return;
    }
  
    overlay.innerHTML = `
      <p>${escapeHtml(questions[index])}</p>
      <button id="q-yes">Yes</button>
      <button id="q-no">No</button>
    `;
    
    // document.getElementById("q-yes").addEventListener("click", () => {
    //   // record the answer here if you want to track it
    //   renderQuestion(index + 1); // move to next question ONLY when clicked
    // });

  // document.getElementById("q-no").addEventListener("click", () => {
  //   renderQuestion(index + 1);
  // });
  
    overlay.innerHTML = `</div>`;
    document.documentElement.appendChild(overlay);

    // document
    //   //.getElementById("debt-guard-leave")
    //   .addEventListener("click", () => {
    //     chrome.runtime.sendMessage({ type: "LOG_ACTION", site, action: "avoided" });
    //     window.history.length > 1 ? window.history.back() : window.close();
    //     overlay.remove();
    //   });

    // document
    //   .getElementById("debt-guard-continue")
    //   .addEventListener("click", () => {
    //     chrome.runtime.sendMessage({
    //       type: "LOG_ACTION",
    //       site,
    //       action: "continued"
    //     });
    //     overlay.remove();
    //   });
  
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
})();