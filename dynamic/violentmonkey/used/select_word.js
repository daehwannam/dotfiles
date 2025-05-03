// ==UserScript==
// @name         select_word
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Show hints on visible words with Vimium-style multi-letter keys (balanced), select on keypress; accurate hint placement; scrolls properly ✅✅✅
// @author       Daehwan Nam
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const HINT_CHARS = 'asdfghjklqwertyuiopzxcvbnm'; // Available characters for hinting
    let hintContainer = null;
    let activeHints = [];
    let inputBuffer = '';

    // Global flag to track if we're in hinting mode
    let isHintingActive = false;

    // Generate exactly two-character hints (e.g., aa, ab, ..., zz)
    function generateHintLabels(count) {
        const chars = HINT_CHARS.split('');
        const labels = [];

        // A queue of possible next labels (starts with all 1-char labels)
        const queue = chars.map(c => [c]);

        while (labels.length < count && queue.length > 0) {
            const current = queue.shift();
            const label = current.join('');

            // We only accept 2-character labels
            if (label.length === 2) {
                labels.push(label);
            }

            // Do not add children of this label to the queue — that's the key.
            // Because this label is now a leaf, we don't want anything starting with it.
            // Only expand siblings that haven’t been finalized yet
            // So only append children if we're still short of count
            if (labels.length + queue.length < count) {
                for (const c of chars) {
                    queue.push([...current, c]);
                }
            }
        }

        return labels;
    }

    function getVisibleTextNodes(root) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    const parent = node.parentElement;
                    if (!parent) return NodeFilter.FILTER_REJECT;
                    const rect = parent.getBoundingClientRect();
                    const visible = rect.bottom > 0 && rect.top < window.innerHeight;
                    const style = window.getComputedStyle(parent);
                    const hidden = style.display === 'none' || style.visibility === 'hidden';
                    return visible && !hidden ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                },
            }
        );

        const nodes = [];
        while (walker.nextNode()) {
            nodes.push(walker.currentNode);
        }
        return nodes;
    }

    function getWordRect(node, start, end) {
        const range = document.createRange();
        range.setStart(node, start);
        range.setEnd(node, end);
        return range.getBoundingClientRect();
    }

    function createHintOverlay(rect, label, container) {
        const hint = document.createElement('div');
        hint.textContent = label;
        Object.assign(hint.style, {
            position: 'absolute',
            top: `${rect.top + window.scrollY}px`,
            left: `${rect.left + window.scrollX}px`,
            background: 'yellow',
            color: 'black',
            padding: '2px 4px',
            fontSize: '12px',
            fontFamily: 'monospace',
            border: '1px solid black',
            borderRadius: '4px',
            zIndex: 99999,
            pointerEvents: 'none',
        });
        container.appendChild(hint);
        return hint;
    }

    function cleanupHints() {
        if (hintContainer) {
            hintContainer.remove();
            hintContainer = null;
        }
        activeHints = [];
        inputBuffer = '';
        isHintingActive = false;  // Set to false when cleanup is done
    }

    function createSelection(node, start, end) {
        const range = document.createRange();
        range.setStart(node, start);
        range.setEnd(node, end);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        range.startContainer.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function activateHints() {
        isHintingActive = true;  // Set the flag to indicate hinting mode is active
        const nodes = getVisibleTextNodes(document.body);
        const matches = [];

        for (const node of nodes) {
            const match = /\b\w+\b/.exec(node.textContent); // first word
            if (match) {
                const rect = getWordRect(node, match.index, match.index + match[0].length);
                if (rect.width > 0 && rect.height > 0) {
                    matches.push({
                        node,
                        word: match[0],
                        index: match.index,
                        rect,
                    });
                }
            }
        }

        if (matches.length === 0) {
            alert('No visible words found.');
            return;
        }

        const labels = generateHintLabels(matches.length);
        hintContainer = document.createElement('div');
        hintContainer.style.position = 'absolute';
        hintContainer.style.top = '0';
        hintContainer.style.left = '0';
        hintContainer.style.zIndex = '99999';
        document.body.appendChild(hintContainer);

        activeHints = matches.map((m, i) => {
            const label = labels[i];
            const hintEl = createHintOverlay(m.rect, label, hintContainer);
            return {
                label,
                ...m,
                element: hintEl,
            };
        });
    }

    function handleHintKeypress(char) {
        inputBuffer += char.toLowerCase();

        const matched = activeHints.filter(h => h.label.startsWith(inputBuffer));

        if (matched.length === 1 && matched[0].label === inputBuffer) {
            const target = matched[0];
            cleanupHints();
            createSelection(target.node, target.index, target.index + target.word.length);
            window.removeEventListener('keydown', keyHandler, true);
        }

        if (matched.length === 0) {
            cleanupHints();
            window.removeEventListener('keydown', keyHandler, true);
        }
    }

    // Handle all key events, blocking unwanted special actions while hinting is active
function keyHandler(e) {
    if (!isHintingActive) return;

    // Stop site-defined keybindings
    e.stopImmediatePropagation();
    e.preventDefault();

    if (e.key === 'Escape') {
        cleanupHints();
        window.removeEventListener('keydown', keyHandler, true);
        return;
    }

    if (/^[a-zA-Z]$/.test(e.key)) {
        handleHintKeypress(e.key);
    }
}

// Activation key: Ctrl + Space
window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === ' ') {
        e.stopImmediatePropagation();
        e.preventDefault();

        cleanupHints();
        activateHints();
        isHintingActive = true;

        // Attach our key handler in capture mode
        window.addEventListener('keydown', keyHandler, true);
    }
}, true); // <-- IMPORTANT: useCapture=true

})();
