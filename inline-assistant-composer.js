(function () {
  function ensureComposer() {
    if (document.getElementById("inlineAssistantComposer")) return;

    const style = document.createElement("style");
    style.textContent = `
      .inline-composer-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.12); opacity: 0; pointer-events: none; transition: opacity .25s ease; z-index: 60; }
      .inline-composer-sheet { position: fixed; left: 0; right: 0; bottom: 0; transform: translateY(100%); opacity: 0; pointer-events: none; transition: transform .28s ease, opacity .28s ease; z-index: 70; }
      .inline-composer-sheet.open { transform: translateY(0); opacity: 1; pointer-events: auto; }
      .inline-composer-overlay.open { opacity: 1; pointer-events: auto; }
      .inline-key {
        height: 44px; border-radius: 12px; background: #fff;
        box-shadow: 0 1px 0 rgba(15,23,42,.08), 0 2px 8px rgba(15,23,42,.08);
        display:flex; align-items:center; justify-content:center; font-size:15px; color:#111827;
      }
      .inline-key.wide { background: #d1d5db; }
    `;
    document.head.appendChild(style);

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <div id="inlineComposerOverlay" class="inline-composer-overlay"></div>
      <div id="inlineAssistantComposer" class="inline-composer-sheet">
        <div style="width:100%;max-width:28rem;margin:0 auto;background:#fff;border-top-left-radius:32px;border-top-right-radius:32px;box-shadow:0 -20px 60px rgba(15,23,42,.12);overflow:hidden;">
          <div style="padding:16px 16px 12px;">
            <div style="display:flex;justify-content:flex-end;margin-bottom:12px;">
              <button id="inlineComposerClose" type="button" style="width:36px;height:36px;border-radius:9999px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;color:#6b7280;border:none;">
                <span class="material-symbols-outlined" style="font-size:20px;">keyboard_arrow_down</span>
              </button>
            </div>
            <div style="border-radius:28px;background:#fff;padding:16px 16px 12px;">
              <textarea id="inlineComposerInput" rows="2" placeholder="提问或搜索" style="width:100%;resize:none;border:none;outline:none;box-shadow:none;background:transparent;padding:0;font-size:16px;line-height:24px;color:#374151;-webkit-appearance:none;appearance:none;"></textarea>
              <div style="margin-top:16px;display:flex;justify-content:flex-end;">
                <button id="inlineComposerSend" type="button" disabled style="border:none;border-radius:9999px;background:#f8b4bc;padding:8px 20px;color:#fff;font-size:15px;font-weight:700;opacity:.5;">发送</button>
              </div>
            </div>
          </div>
          <div style="background:#d1d5db;padding:12px 8px 16px;">
            <div style="margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;padding:0 8px;font-size:18px;">
              <div style="display:flex;align-items:center;gap:32px;">
                <span>123</span><span>ABC</span><span style="color:#ef4444;">中文</span>
              </div>
              <span class="material-symbols-outlined" style="font-size:22px;">expand_more</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;">
              <div style="display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:6px;">
                <span class="inline-key">Q</span><span class="inline-key">W</span><span class="inline-key">E</span><span class="inline-key">R</span><span class="inline-key">T</span><span class="inline-key">Y</span><span class="inline-key">U</span><span class="inline-key">I</span><span class="inline-key">O</span><span class="inline-key">P</span>
              </div>
              <div style="display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:6px;padding:0 16px;">
                <span class="inline-key">A</span><span class="inline-key">S</span><span class="inline-key">D</span><span class="inline-key">F</span><span class="inline-key">G</span><span class="inline-key">H</span><span class="inline-key">J</span><span class="inline-key">K</span><span class="inline-key">L</span>
              </div>
              <div style="display:grid;grid-template-columns:52px repeat(7,minmax(0,1fr)) 52px;gap:6px;">
                <span class="inline-key wide">⇧</span><span class="inline-key">Z</span><span class="inline-key">X</span><span class="inline-key">C</span><span class="inline-key">V</span><span class="inline-key">B</span><span class="inline-key">N</span><span class="inline-key">M</span><span class="inline-key wide">⌫</span>
              </div>
              <div style="display:grid;grid-template-columns:72px 1fr 92px;gap:6px;">
                <span class="inline-key wide">123</span><span class="inline-key">space</span><span class="inline-key wide" style="opacity:.6;">send</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrapper);

    const overlay = document.getElementById("inlineComposerOverlay");
    const sheet = document.getElementById("inlineAssistantComposer");
    const input = document.getElementById("inlineComposerInput");
    const send = document.getElementById("inlineComposerSend");
    const close = document.getElementById("inlineComposerClose");

    function sync() {
      const hasText = !!(input.value || "").trim();
      send.disabled = !hasText;
      send.style.opacity = hasText ? "1" : ".5";
    }

    function closeComposer() {
      overlay.classList.remove("open");
      sheet.classList.remove("open");
      document.body.classList.remove("overflow-hidden");
    }

    function normalizeShortcutText(inputText) {
      return (inputText || "").trim().toLowerCase().replace(/\s+/g, "");
    }

    function getShortcutRoute(inputText) {
      const normalized = normalizeShortcutText(inputText);
      const assetMap = {
        btc: { symbol: "BTC/USDT", price: "68,420.20", change: "+2.84%" },
        eth: { symbol: "ETH/USDT", price: "3,480.66", change: "+1.42%" },
        sol: { symbol: "SOL/USDT", price: "152.84", change: "-0.88%" },
        比特币: { symbol: "BTC/USDT", price: "68,420.20", change: "+2.84%" },
        以太坊: { symbol: "ETH/USDT", price: "3,480.66", change: "+1.42%" }
      };
      const directMap = {
        "你能干什么": "ai-chat.html",
        "能做什么": "ai-chat.html",
        "帮助": "ai-chat.html",
        "全部触发": "ai-watch-trigger-detail.html",
        "查看全部触发": "ai-watch-trigger-detail.html",
        "全部触发页": "ai-watch-trigger-detail.html",
        "管理自选": "ai-watch-detail.html",
        "删除自选": "ai-watch-detail.html",
        "自选管理": "ai-watch-detail.html",
        "去盯盘": "ai-watch.html",
        "打开盯盘": "ai-watch.html",
        "看快讯": "news.html",
        "最新快讯": "news.html",
        "新闻": "news.html",
        "看行情": "trade.html",
        "行情页": "trade.html",
        "去交易所": "trade.html",
        "看账户": "wallet.html",
        "我的账户": "wallet.html",
        "钱包": "wallet.html",
        "管理账户": "account-manage.html",
        "账户管理": "account-manage.html",
        "管理钱包": "wallet-manage.html",
        "钱包管理": "wallet-manage.html",
        "去授权": "wallet-authorize.html",
        "管理授权": "wallet-authorize.html",
        "交易所授权": "wallet-authorize.html",
        "新增授权": "wallet-authorize-bind.html",
        "绑定api": "wallet-authorize-bind.html",
        "绑定交易所": "wallet-authorize-bind.html",
        "发现": "discover.html",
        "发现页": "discover.html",
        "看市场概览": "discover.html"
      };
      if (directMap[normalized]) {
        return directMap[normalized];
      }
      for (var assetKey in assetMap) {
        if (!Object.prototype.hasOwnProperty.call(assetMap, assetKey)) continue;
        var assetValue = assetMap[assetKey];
        if (normalized === assetKey + "盯盘" || normalized === "帮我看" + assetKey + "盯盘" || normalized === "我要" + assetKey + "盯盘") {
          return "ai-watch-config.html?symbol=" + encodeURIComponent(assetValue.symbol) + "&price=" + encodeURIComponent(assetValue.price) + "&change=" + encodeURIComponent(assetValue.change);
        }
        if (normalized === assetKey + "触发" || normalized === "帮我看" + assetKey + "触发" || normalized === assetKey + "今日触发") {
          return "ai-watch-trigger-signal-detail.html?symbol=" + encodeURIComponent(assetValue.symbol) + "&type=macro";
        }
      }
      return null;
    }

    function submit() {
      const text = (input.value || "").trim();
      if (!text) return;
      const shortcutRoute = getShortcutRoute(text);
      if (shortcutRoute) {
        window.location.href = shortcutRoute;
        return;
      }
      localStorage.setItem("zhidao_ai_last_prompt", text);
      window.location.href = "ai-chat-examples.html";
    }

    window.openInlineAssistantComposer = function () {
      overlay.classList.add("open");
      sheet.classList.add("open");
      document.body.classList.add("overflow-hidden");
      setTimeout(function () { input.focus(); }, 120);
    };

    overlay.addEventListener("click", closeComposer);
    close.addEventListener("click", closeComposer);
    input.addEventListener("input", sync);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submit();
      }
    });
    send.addEventListener("click", submit);
    sync();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureComposer);
  } else {
    ensureComposer();
  }
})();
