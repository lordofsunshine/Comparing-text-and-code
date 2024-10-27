window.onload = function() {
    if (typeof diff_match_patch === 'undefined') {
        console.error('Библиотека diff_match_patch не была загружена.');
        return;
    }

    const dmp = new diff_match_patch();

    function compareTexts(text1, text2, diffType) {
        let diffs;
        switch (diffType) {
            case 'chars':
                diffs = dmp.diff_main(text1, text2);
                dmp.diff_cleanupSemantic(diffs);
                break;
            case 'words':
                diffs = dmp.diff_main(text1, text2);
                dmp.diff_cleanupSemantic(diffs);
                diffs = diffs.map(([op, text]) => [op, text.split(/\s+/)]);
                break;
            case 'lines':
                diffs = dmp.diff_main(text1, text2);
                dmp.diff_cleanupSemantic(diffs);
                diffs = diffs.map(([op, text]) => [op, text.split('\n')]);
                break;
        }

        const result1 = [];
        const result2 = [];
        let diffCount = 0;

        diffs.forEach(([op, data]) => {
            if (Array.isArray(data)) {
                data.forEach(item => {
                    if (op === -1) {
                        result1.push(`<span class="diff-remove">${escapeHtml(item)}<span class="diff-marker diff-marker-remove">-</span></span>`);
                        diffCount++;
                    } else if (op === 1) {
                        result2.push(`<span class="diff-add">${escapeHtml(item)}<span class="diff-marker diff-marker-add">+</span></span>`);
                        diffCount++;
                    } else {
                        result1.push(escapeHtml(item));
                        result2.push(escapeHtml(item));
                    }
                });
            } else {
                if (op === -1) {
                    result1.push(`<span class="diff-remove">${escapeHtml(data)}<span class="diff-marker diff-marker-remove">-</span></span>`);
                    diffCount++;
                } else if (op === 1) {
                    result2.push(`<span class="diff-add">${escapeHtml(data)}<span class="diff-marker diff-marker-add">+</span></span>`);
                    diffCount++;
                } else {
                    result1.push(escapeHtml(data));
                    result2.push(escapeHtml(data));
                }
            }
        });

        return [result1.join(diffType === 'lines' ? '\n' : ' '), result2.join(diffType === 'lines' ? '\n' : ' '), diffCount];
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    document.getElementById('compareBtn').addEventListener('click', () => {
        const input1 = document.getElementById('input1').value;
        const input2 = document.getElementById('input2').value;
        const diffType = document.getElementById('diffType').value;
        const [result1, result2, diffCount] = compareTexts(input1, input2, diffType);

        const output1 = document.getElementById('output1');
        const output2 = document.getElementById('output2');
        const diffSummary = document.getElementById('diffSummary');

        output1.innerHTML = result1;
        output2.innerHTML = result2;
        diffSummary.textContent = `Всего различий: ${diffCount}`;

        output1.classList.remove('fade-in');
        output2.classList.remove('fade-in');
        diffSummary.classList.remove('fade-in');

        void output1.offsetWidth;
        void output2.offsetWidth;
        void diffSummary.offsetWidth;

        output1.classList.add('fade-in');
        output2.classList.add('fade-in');
        diffSummary.classList.add('fade-in');
    });
};