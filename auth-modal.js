(function () {
  const triggers = Array.from(document.querySelectorAll('a[aria-label="个人中心"], a[aria-label="进入 Wallet"]'));
  if (!triggers.length || document.getElementById("authModalOverlay")) return;

  const style = document.createElement("style");
  style.textContent = `
    .auth-hidden { display: none !important; }
    .auth-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.28);
      z-index: 300;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding-top: 32px;
      font-family: "Inter", sans-serif;
    }
    .auth-sheet {
      width: min(100%, 780px);
      background: #fff;
      border-radius: 28px 28px 0 0;
      padding: 12px 24px 24px;
      box-shadow: 0 -18px 48px rgba(15, 23, 42, 0.16);
    }
    .auth-handle {
      width: 72px;
      height: 6px;
      border-radius: 999px;
      background: #d7d7d7;
      margin: 0 auto 18px;
    }
    .auth-title {
      text-align: center;
      font-size: 24px;
      font-weight: 800;
      color: #222;
      margin: 6px 0 24px;
    }
    .auth-social-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }
    .auth-social-btn, .auth-row, .auth-secondary-btn, .auth-primary-btn {
      border: 1px solid #e5e7eb;
      background: #f7f7f7;
      border-radius: 22px;
    }
    .auth-social-btn {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 52px;
      color: #222;
      font-weight: 700;
    }
    .auth-divider {
      display: flex;
      align-items: center;
      gap: 16px;
      margin: 24px 0;
      color: #8a8a8a;
      font-size: 18px;
    }
    .auth-divider::before, .auth-divider::after {
      content: "";
      flex: 1;
      height: 1px;
      background: #e5e7eb;
    }
    .auth-row {
      height: 84px;
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 0 20px;
    }
    .auth-input {
      flex: 1;
      border: 0;
      background: transparent;
      font-size: 24px;
      outline: none;
      color: #222;
    }
    .auth-input::placeholder, .auth-textarea::placeholder {
      color: #8a8a8a;
    }
    .auth-arrow {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: #ececec;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #8a8a8a;
      font-size: 28px;
      flex-shrink: 0;
      border: 0;
    }
    .auth-secondary-btn, .auth-primary-btn {
      width: 100%;
      height: 84px;
      font-size: 24px;
      color: #222;
    }
    .auth-foot {
      margin-top: 24px;
      text-align: center;
      font-size: 16px;
      color: #7a7a7a;
      line-height: 1.6;
    }
    .auth-secured {
      text-align: center;
      margin-top: 16px;
      font-size: 14px;
      color: #9a9a9a;
    }
    .auth-homebar {
      width: 270px;
      height: 9px;
      border-radius: 999px;
      background: #1f2023;
      margin: 22px auto 0;
    }
    .auth-subtitle {
      font-size: 24px;
      line-height: 1.35;
      color: #7a7a7a;
      margin-bottom: 22px;
    }
    .auth-textarea {
      width: 100%;
      min-height: 260px;
      border: 1px solid #e5e7eb;
      background: #f7f7f7;
      border-radius: 22px;
      padding: 18px 20px;
      font-size: 22px;
      resize: none;
      outline: none;
    }
    .auth-wallet-name {
      width: 100%;
      height: 84px;
      border: 1px solid #e5e7eb;
      background: #f7f7f7;
      border-radius: 22px;
      padding: 0 20px;
      margin-top: 18px;
      font-size: 24px;
      outline: none;
    }
    .auth-primary-btn {
      background: #ff9518;
      color: #fff;
      border-color: #ff9518;
      margin-top: 24px;
    }
    .google-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.28);
      z-index: 320;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px;
      font-family: "Inter", sans-serif;
    }
    .google-modal {
      width: min(100%, 760px);
      min-height: min(92vh, 1440px);
      background: #fff;
      border-radius: 42px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
      display: flex;
      flex-direction: column;
    }
    .google-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 22px;
    }
    .google-round {
      width: 66px;
      height: 66px;
      border-radius: 50%;
      background: #fafafa;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      color: #222;
    }
    .google-host {
      font-size: 22px;
      font-weight: 700;
      color: #111;
    }
    .google-header {
      border-top: 1px solid #e5e7eb;
      border-bottom: 1px solid #e5e7eb;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 18px;
      font-weight: 600;
      color: #4b5563;
    }
    .google-body {
      flex: 1;
      padding: 30px 42px 40px;
    }
    .google-title {
      font-size: 64px;
      line-height: 1.1;
      font-weight: 500;
      color: #222;
      margin: 0;
    }
    .google-sub {
      margin: 22px 0 40px;
      font-size: 24px;
      color: #333;
    }
    .google-account, .google-other {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px 0;
      border-bottom: 1px solid #d7d7d7;
      color: #222;
    }
    .google-avatar {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: #0b69b7;
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
    }
    .google-name { font-size: 28px; font-weight: 500; }
    .google-email { font-size: 22px; color: #555; margin-top: 4px; }
    .google-other { font-size: 24px; font-weight: 500; }
    .google-legal {
      margin-top: 48px;
      font-size: 20px;
      line-height: 1.45;
      color: #4b5563;
    }
    .google-footer {
      display: flex;
      justify-content: space-between;
      padding: 0 28px 24px;
    }
    .google-pill {
      width: 116px;
      height: 70px;
      border-radius: 999px;
      background: #fafafa;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #222;
      font-size: 34px;
    }
    .auth-loading-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.28);
      z-index: 340;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding-top: 32px;
      font-family: "Inter", sans-serif;
    }
    .auth-loading-sheet {
      width: min(100%, 780px);
      background: #fff;
      border-radius: 28px 28px 0 0;
      padding: 12px 24px 24px;
      text-align: center;
      box-shadow: 0 -18px 48px rgba(15, 23, 42, 0.16);
    }
    .auth-loading-ring {
      width: 170px;
      height: 170px;
      border-radius: 50%;
      border: 8px solid transparent;
      border-top-color: #ff9518;
      border-right-color: #ff9518;
      margin: 24px auto 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #222;
      font-size: 86px;
      font-weight: 800;
    }
    .auth-loading-title {
      font-size: 26px;
      font-weight: 800;
      color: #222;
      margin-bottom: 22px;
    }
    @media (max-width: 768px) {
      .auth-sheet { padding: 10px 16px 18px; }
      .auth-title { font-size: 18px; margin-bottom: 18px; }
      .auth-social-grid { gap: 12px; }
      .auth-social-btn { height: 72px; font-size: 34px; }
      .auth-divider { font-size: 14px; margin: 18px 0; }
      .auth-row, .auth-secondary-btn, .auth-primary-btn, .auth-wallet-name { height: 58px; }
      .auth-input, .auth-wallet-name, .auth-secondary-btn, .auth-primary-btn { font-size: 16px; }
      .auth-arrow { width: 40px; height: 40px; font-size: 22px; }
      .auth-subtitle { font-size: 16px; margin-bottom: 14px; }
      .auth-textarea { min-height: 150px; font-size: 15px; }
      .auth-foot, .auth-secured { font-size: 12px; }
      .auth-homebar { width: 132px; height: 7px; }
      .google-modal { border-radius: 30px; min-height: min(92vh, 820px); }
      .google-topbar { padding: 12px 16px; }
      .google-round { width: 48px; height: 48px; font-size: 28px; }
      .google-host { font-size: 16px; }
      .google-header { padding: 12px 16px; font-size: 14px; }
      .google-body { padding: 24px 24px 28px; }
      .google-title { font-size: 34px; }
      .google-sub { margin: 14px 0 24px; font-size: 16px; }
      .google-account, .google-other { padding: 18px 0; }
      .google-avatar { width: 40px; height: 40px; font-size: 22px; }
      .google-name { font-size: 18px; }
      .google-email, .google-other { font-size: 14px; }
      .google-legal { margin-top: 28px; font-size: 14px; }
      .google-footer { padding: 0 18px 18px; }
      .google-pill { width: 76px; height: 48px; font-size: 24px; }
      .auth-loading-ring {
        width: 120px;
        height: 120px;
        font-size: 56px;
        border-width: 6px;
        margin: 18px auto 18px;
      }
      .auth-loading-title { font-size: 18px; }
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = "authModalOverlay";
  overlay.className = "auth-overlay auth-hidden";
  overlay.innerHTML = `
    <div class="auth-sheet" role="dialog" aria-modal="true">
      <div class="auth-handle"></div>
      <div id="authLoginView">
        <div class="auth-title">Log in or sign up</div>
        <div class="auth-social-grid">
          <button type="button" class="auth-social-btn" data-auth-google>G</button>
          <button type="button" class="auth-social-btn"></button>
          <button type="button" class="auth-social-btn">X</button>
        </div>
        <div class="auth-divider">OR</div>
        <div class="auth-row">
          <input class="auth-input" placeholder="Enter your email" />
          <button type="button" class="auth-arrow" data-auth-email-submit>→</button>
        </div>
        <div class="auth-divider">OR</div>
        <button type="button" class="auth-secondary-btn" data-auth-import>Import wallet</button>
        <div class="auth-foot">By continuing, you agree to our Terms of Service &amp;Privacy Policy.</div>
        <div class="auth-secured">Secured by turnkey</div>
        <div class="auth-homebar"></div>
      </div>
      <div id="authImportView" class="auth-hidden">
        <div class="auth-title">Import wallet</div>
        <div class="auth-subtitle">Enter your seed phrase. Seed phrases are typically 12–24 words.</div>
        <textarea class="auth-textarea"></textarea>
        <input class="auth-wallet-name" placeholder="Enter your wallet name" />
        <button type="button" class="auth-primary-btn">Import</button>
        <div class="auth-secured" style="margin-top: 24px;">Secured by turnkey</div>
        <div class="auth-homebar"></div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const googleOverlay = document.createElement("div");
  googleOverlay.id = "googleModalOverlay";
  googleOverlay.className = "google-overlay auth-hidden";
  googleOverlay.innerHTML = `
    <div class="google-modal" role="dialog" aria-modal="true">
      <div class="google-topbar">
        <button type="button" class="google-round" data-google-close>×</button>
        <div class="google-host">accounts.google.com</div>
        <div class="google-round">☰</div>
      </div>
      <div class="google-header">
        <span style="font-size:28px;color:#ef4444;">G</span>
        <span>使用 Google 账号登录</span>
      </div>
      <div class="google-body">
        <h2 class="google-title">请选择账号</h2>
        <p class="google-sub">继续前往<span style="color:#2563eb;font-weight:600;">Minara</span></p>
        <div class="google-account">
          <div class="google-avatar">d</div>
          <div>
            <div class="google-name">dominican republic</div>
            <div class="google-email">republicdominican86@gmail.com</div>
          </div>
        </div>
        <div class="google-other">
          <span style="font-size:26px;">◎</span>
          <span>使用其他账号</span>
        </div>
        <p class="google-legal">使用此应用前，您可以查看“Minara”的<span style="color:#2563eb;font-weight:600;">隐私权政策</span>和<span style="color:#2563eb;font-weight:600;">服务条款</span>。</p>
      </div>
      <div class="google-footer">
        <div class="google-pill">‹</div>
        <div class="google-pill">⤴︎ ↻</div>
      </div>
    </div>
  `;
  document.body.appendChild(googleOverlay);

  const loadingOverlay = document.createElement("div");
  loadingOverlay.id = "authLoadingOverlay";
  loadingOverlay.className = "auth-loading-overlay auth-hidden";
  loadingOverlay.innerHTML = `
    <div class="auth-loading-sheet" role="dialog" aria-modal="true">
      <div class="auth-handle"></div>
      <div class="auth-loading-ring">G</div>
      <div class="auth-loading-title">Authenticating...</div>
      <div class="auth-secured">Secured by turnkey</div>
      <div class="auth-homebar"></div>
    </div>
  `;
  document.body.appendChild(loadingOverlay);

  const loginView = document.getElementById("authLoginView");
  const importView = document.getElementById("authImportView");
  let authRedirectTimer = null;

  function showLoginView() {
    loginView.classList.remove("auth-hidden");
    importView.classList.add("auth-hidden");
  }

  function openAuth() {
    overlay.classList.remove("auth-hidden");
    document.body.style.overflow = "hidden";
    showLoginView();
  }

  function closeAuth() {
    overlay.classList.add("auth-hidden");
    if (googleOverlay.classList.contains("auth-hidden")) {
      document.body.style.overflow = "";
    }
  }

  function openImport() {
    importView.classList.remove("auth-hidden");
    loginView.classList.add("auth-hidden");
  }

  function openGoogle() {
    googleOverlay.classList.remove("auth-hidden");
    document.body.style.overflow = "hidden";
  }

  function closeGoogle() {
    googleOverlay.classList.add("auth-hidden");
    if (overlay.classList.contains("auth-hidden")) {
      document.body.style.overflow = "";
    }
  }

  function openLoadingThenRedirect() {
    closeGoogle();
    closeAuth();
    loadingOverlay.classList.remove("auth-hidden");
    document.body.style.overflow = "hidden";
    if (authRedirectTimer) clearTimeout(authRedirectTimer);
    authRedirectTimer = setTimeout(() => {
      loadingOverlay.classList.add("auth-hidden");
      document.body.style.overflow = "";
      window.location.href = "wallet2.html";
    }, 3000);
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openAuth();
    });
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeAuth();
  });
  googleOverlay.addEventListener("click", (event) => {
    if (event.target === googleOverlay) closeGoogle();
  });

  overlay.querySelector("[data-auth-import]").addEventListener("click", openImport);
  overlay.querySelector("[data-auth-google]").addEventListener("click", openGoogle);
  overlay.querySelector("[data-auth-email-submit]").addEventListener("click", openLoadingThenRedirect);
  overlay.querySelector(".auth-primary-btn").addEventListener("click", openLoadingThenRedirect);
  googleOverlay.querySelector("[data-google-close]").addEventListener("click", closeGoogle);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeGoogle();
      closeAuth();
    }
  });
})();
