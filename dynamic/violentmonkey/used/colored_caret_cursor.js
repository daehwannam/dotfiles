// ==UserScript==
// @name         colored_caret_cursor
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const fakeCaret = document.createElement('div');
    Object.assign(fakeCaret.style, {
        position: 'absolute',
        width: '2px',
        height: '1em',
        // background: 'red',
        background: 'magenta',
        zIndex: 9999,
        pointerEvents: 'none',
    });
    document.body.appendChild(fakeCaret);

    function updateFakeCaret() {
        const selection = window.getSelection();
        if (selection.rangeCount === 0 || selection.isCollapsed === false) {
            fakeCaret.style.display = 'none';
            return;
        }

        const range = selection.getRangeAt(0).cloneRange();
        const rects = range.getClientRects();
        if (rects.length === 0) {
            fakeCaret.style.display = 'none';
            return;
        }

        const rect = rects[0];
        Object.assign(fakeCaret.style, {
            left: `${rect.left + window.scrollX}px`,
            top: `${rect.top + window.scrollY}px`,
            height: `${rect.height}px`,
            display: 'block',
        });
    }

    document.addEventListener('selectionchange', updateFakeCaret);
})();
