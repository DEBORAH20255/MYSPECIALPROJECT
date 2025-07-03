// --- Step Map: URL path to section IDs ---
const stepMap = {
  "": "provider-selection",      // Root path, first step
  "provider": "signing-in",      // /provider
  "credentials": "credentials-input" // /credentials
};

// --- Show the correct step/page based on current step (path segment) ---
function showStep(step) {
  document.querySelectorAll('.page').forEach(el => el.classList.remove("active"));
  const activeId = stepMap[step] || stepMap[""];
  const activeEl = document.getElementById(activeId);
  if (activeEl) activeEl.classList.add("active");
}

// --- Update the URL and show the right step ---
function goToStep(step) {
  history.pushState({ step }, '', '/' + (step || ''));
  showStep(step);
}

// --- On DOM load: set up navigation and initial state ---
document.addEventListener("DOMContentLoaded", () => {
  // --- Show the correct step based on the URL ---
  let pathStep = location.pathname.replace(/^\/|\/$/g, '');
  if (!(pathStep in stepMap)) pathStep = "";
  showStep(pathStep);
  history.replaceState({ step: pathStep }, '', location.pathname);

  // --- Provider button logic ---
  document.querySelectorAll('.provider-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedProvider = btn.getAttribute('data-provider');
      sessionStorage.setItem('selectedProvider', selectedProvider);

      // Update UI for signing in
      const signingInProviderSpan = document.getElementById("signing-in-provider");
      if (signingInProviderSpan) signingInProviderSpan.textContent = selectedProvider;

      goToStep('provider');
      // Simulate delay then go to credentials input
      setTimeout(() => {
        const credentialsTitle = document.getElementById("credentials-title");
        if (credentialsTitle) credentialsTitle.textContent = `Sign in with ${selectedProvider}`;
        goToStep('credentials');
      }, 1000);
    });
  });

  // --- Back button logic ---
  const backToProvidersBtn = document.getElementById("back-to-providers");
  if (backToProvidersBtn) {
    backToProvidersBtn.addEventListener("click", () => {
      const credentialsForm = document.getElementById("credentials-form");
      const loginErrorDiv = document.getElementById("login-error");
      if (credentialsForm) credentialsForm.reset();
      if (loginErrorDiv) {
        loginErrorDiv.style.display = "none";
        loginErrorDiv.textContent = "";
      }
      goToStep(""); // back to provider selection
    });
  }

  // --- Credentials form submit logic ---
  const credentialsForm = document.getElementById("credentials-form");
  if (credentialsForm) {
    credentialsForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const loginErrorDiv = document.getElementById("login-error");
      if (loginErrorDiv) {
        loginErrorDiv.style.display = "none";
        loginErrorDiv.textContent = "";
      }

      const formData = new FormData(credentialsForm);
      const email = formData.get("email")?.trim().toLowerCase();
      const password = formData.get("password")?.trim();
      const selectedProvider = sessionStorage.getItem('selectedProvider');

      if (!email || !password || !selectedProvider) {
        if (loginErrorDiv) {
          loginErrorDiv.textContent = "Please fill in all fields.";
          loginErrorDiv.style.display = "block";
        } else {
          alert("Please fill in all fields.");
        }
        return;
      }

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password, provider: selectedProvider })
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Login failed.");
        }

        // Redirect to dashboard
        window.location.href = "/dashboard.html";
      } catch (err) {
        if (loginErrorDiv) {
          loginErrorDiv.textContent = err.message;
          loginErrorDiv.style.display = "block";
        } else {
          alert(err.message);
        }
      }
    });
  }
});

// --- Handle browser navigation (back/forward) ---
window.addEventListener("popstate", (event) => {
  const step = (event.state && event.state.step) || "";
  showStep(step);
});