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
        backgroundColor: 'rgba(255, 0, 255, 1.0)', // transparent magenta
        color: 'white',
        zIndex: 9999,
        pointerEvents: 'none',
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
        const container = range.endContainer;

        // Extend range to include the next character
        try {
            range.setEnd(container, Math.min(range.endOffset + 1, container.length || 1));
        } catch (e) {
            fakeCaret.style.display = 'none';
            return;
        }

        const rect = range.getBoundingClientRect();
        const char = range.toString() || ' ';

        // Get computed style of parent element
        const parentEl = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;
        const style = window.getComputedStyle(parentEl);

        fakeCaret.textContent = char;
        Object.assign(fakeCaret.style, {
            top: `${rect.top + window.scrollY}px`,
            left: `${rect.left + window.scrollX}px`,
            height: `${rect.height}px`,
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            lineHeight: style.lineHeight,
            display: 'block',
        });
    }

    document.addEventListener('selectionchange', updateFakeCaret);
})();
