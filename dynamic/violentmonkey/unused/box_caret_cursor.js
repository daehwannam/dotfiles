// ==UserScript==
// @name         box_caret_cursor.js
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const fakeCaret = document.createElement('div');
    Object.assign(fakeCaret.style, {
        position: 'absolute',
        backgroundColor: 'rgba(255, 0, 255, 1.0)', // transparent magenta,
        color: 'white',
        // color: 'black',
        zIndex: 9999,
        pointerEvents: 'none',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        whiteSpace: 'pre',
    });
    document.body.appendChild(fakeCaret);

    function updateFakeCaret() {
        const selection = window.getSelection();
        if (selection.rangeCount === 0 || !selection.isCollapsed) {
            fakeCaret.style.display = 'none';
            return;
        }

        const range = selection.getRangeAt(0).cloneRange();

        // Try to extend range to capture the character under caret
        range.setEnd(range.endContainer, Math.min(range.endOffset + 1, range.endContainer.length || 1));

        const rect = range.getBoundingClientRect();
        const char = range.toString() || ' '; // fallback to space if empty

        fakeCaret.textContent = char;
        Object.assign(fakeCaret.style, {
            top: `${rect.top + window.scrollY}px`,
            left: `${rect.left + window.scrollX}px`,
            height: `${rect.height}px`,
            display: 'block',
        });
    }

    document.addEventListener('selectionchange', updateFakeCaret);
})();
