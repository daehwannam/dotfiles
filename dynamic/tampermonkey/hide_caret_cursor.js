// ==UserScript==
// @name         Hide Firefox Caret Cursor (Simulated)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Simulates hiding caret in Firefox caret browsing mode by clearing focus and selection
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function hideCaretCursor() {
        // Blur any active element (important for editable areas)
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
        }

        // Clear selection (caret browsing uses selection range)
        const sel = window.getSelection();
        if (sel) {
            sel.removeAllRanges();

            // Create a dummy range that doesn't show caret
            const dummy = document.createElement('span');
            dummy.style.position = 'absolute';
            dummy.style.top = '-9999px';
            dummy.textContent = '.';
            document.body.appendChild(dummy);

            const range = document.createRange();
            range.setStart(dummy, 0);
            range.collapse(true);
            sel.addRange(range);

            // Remove dummy after short delay
            setTimeout(() => {
                dummy.remove();
            }, 50);
        }
    }

    // Trigger with Ctrl + Enter
    window.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            hideCaretCursor();
        }
    });
})();
