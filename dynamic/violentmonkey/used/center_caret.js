// ==UserScript==
// @name         center_caret
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Scroll the page so the caret is vertically centered
// @author       Daehwan Nam
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function centerCaret() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const rects = range.getClientRects();
        if (!rects || rects.length === 0) return;

        const caretRect = rects[0];
        const caretTop = caretRect.top + window.scrollY;
        const caretCenter = caretTop - window.innerHeight / 2 + caretRect.height / 2;

        window.scrollTo({
            top: caretCenter,
            behavior: 'smooth'
        });
    }

    // Ctrl + Enter to trigger centering
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'l') {
            e.preventDefault();
            centerCaret();
        }
    });
})();
