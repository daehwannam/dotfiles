// ==UserScript==
// @name         Vimium-style Word Selector with Multi-letter Hints (Balanced)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Show hints on visible words with Vimium-style multi-letter keys (balanced), select on keypress; accurate hint placement; scrolls properly ✅✅✅
// @author       ChatGPT
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const HINT_CHARS = 'asdfghjklqwertyuiopzxcvbnm'; // Available characters for hinting
    let hintContainer = null;
    let activeHints = [];
    let inputBuffer = '';

    // // Generate multi-letter hints (e.g., a, b, ..., aa, ab, ..., zz)
    // function generateHintLabels(count) {
    //     const chars = HINT_CHARS.split('');
    //     const labels = [];

    //     // First, add 1-letter combinations
    //     for (const char of chars) {
    //         labels.push(char);
    //     }

    //     // Now add 2-letter combinations in a balanced way (like Vimium/Emacs Avy)
    //     let idx = 0;
    //     while (labels.length < count && idx < chars.length) {
    //         for (let i = 0; i < chars.length; i++) {
    //             if (labels.length < count) {
    //                 labels.push(chars[i] + chars[idx]);
    //             }
    //         }
    //         idx++;
    //     }

    //     // Lastly, if needed, add 3-letter combinations
    //     for (let i = 0; i < chars.length; i++) {
    //         for (let j = 0; j < chars.length; j++) {
    //             for (let k = 0; k < chars.length; k++) {
    //                 if (labels.length < count) {
    //                     labels.push(chars[i] + chars[j] + chars[k]);
    //                 }
    //             }
    //         }
    //     }

    //     return labels.slice(0, count);
    // }

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

    function keyHandler(e) {
        if (/^[a-zA-Z]$/.test(e.key)) {
            e.preventDefault();
            handleHintKeypress(e.key);
        } else if (e.key === 'Escape') {  // Add this line to handle ESC key press
            e.preventDefault();
            cleanupHints();  // Cleanup hints when ESC is pressed
            window.removeEventListener('keydown', keyHandler, true);  // Remove key listener
        }
    }

    window.addEventListener('keydown', (e) => {
        // Triggering key is Ctrl + Space
        if (e.ctrlKey && e.key === ' ') {
            e.preventDefault();
            cleanupHints();
            activateHints();
            window.addEventListener('keydown', keyHandler, true);
        }
    });
})();
