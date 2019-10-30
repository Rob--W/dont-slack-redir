'use strict';

// <script src> is used for the following reasons:
//
// - The script needs to replace a property descriptor in the page's scope.
//
// - Alternatives such as wrappedJSObject are a bad choice, because when an
//   extension unloads, the content script is destroyed, which would break the
//   page by throwing "TypeError: can't access dead object" upon access.
//
// - Inline scripts cannot be used, because those can be blocked by the page's
//   CSP - https://bugzilla.mozilla.org/show_bug.cgi?id=1591983
let script = document.createElement('script');
script.src = chrome.runtime.getURL('cleanlink.js');

// If possible, use a closed shadow root to prevent the page from detecting the
// script's URL, against https://bugzilla.mozilla.org/show_bug.cgi?id=1372288 .
let nodeToExposeToPage;
if (Element.prototype.attachShadow) {
    nodeToExposeToPage = document.createElement('div');
    let shadowRoot = nodeToExposeToPage.attachShadow({ mode: 'closed' });
    shadowRoot.appendChild(script);
} else {
    // In Firefox 62 or earlier, attachShadow was not available by default.
    nodeToExposeToPage = script;
}

(document.body || document.documentElement).appendChild(nodeToExposeToPage);
