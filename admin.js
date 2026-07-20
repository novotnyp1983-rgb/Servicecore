/**
 * Petr Novotny Static Website - Inline Admin Editor
 * Binds contenteditable areas and commits updates directly to GitHub Pages.
 */

(function () {
    // Config: Matches the GitHub repository configuration
    const CONFIG = {
        owner: 'HSTEP',
        repo: 'PetrNovotny',
        branch: 'main'
    };

    let githubToken = localStorage.getItem('github_pat') || '';
    let isDirty = false;

    // Detect which file is currently being edited
    function getCurrentFilePath() {
        const path = window.location.pathname;
        if (path.endsWith('index_en.html')) {
            return 'index_en.html';
        }
        return 'index.html';
    }

    // Helper functions for safe UTF-8 Base64 conversion
    function decodeBase64Utf8(base64Str) {
        const binString = atob(base64Str.replace(/\s/g, ''));
        const bytes = new Uint8Array(binString.length);
        for (let i = 0; i < binString.length; i++) {
            bytes[i] = binString.charCodeAt(i);
        }
        return new TextDecoder('utf-8').decode(bytes);
    }

    function encodeBase64Utf8(str) {
        const bytes = new TextEncoder().encode(str);
        let binString = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binString += String.fromCharCode(bytes[i]);
        }
        return btoa(binString);
    }

    // Initialize administration
    function init() {
        if (!githubToken) {
            showLoginModal();
        } else {
            activateEditMode();
        }
    }

    // Show Login Modal asking for GitHub PAT
    function showLoginModal() {
        const overlay = document.createElement('div');
        overlay.className = 'admin-overlay';

        const card = document.createElement('div');
        card.className = 'admin-card';
        card.innerHTML = `
            <h3>Administrace webu</h3>
            <p>Pro provádění úprav na tomto webu zadejte svůj osobní přístupový klíč z GitHubu (Personal Access Token). Token zůstane bezpečně uložen pouze ve vašem prohlížeči.</p>
            
            <div class="admin-form-group">
                <label for="admin-token-input">GitHub Access Token (PAT):</label>
                <input type="password" id="admin-token-input" class="admin-input" placeholder="ghp_xxxxxxxxxxxxxx" />
                <div id="admin-login-error" style="color: #ef4444; font-size: 0.8rem; display: none; margin-top: 5px;">Neplatný token nebo chybějící oprávnění pro zápis.</div>
            </div>

            <div class="admin-help-text">
                Návod na vygenerování tokenu naleznete v souboru <a href="DEPLOYNÁVOD.md" target="_blank">DEPLOYNÁVOD.md</a>.
            </div>

            <div class="admin-card-actions">
                <button type="button" class="admin-btn admin-btn-discard" id="admin-login-cancel">Zrušit</button>
                <button type="button" class="admin-btn admin-btn-save" id="admin-login-submit">Přihlásit se</button>
            </div>
        `;

        overlay.appendChild(card);
        document.body.appendChild(overlay);

        // Events for login modal
        document.getElementById('admin-login-cancel').addEventListener('click', () => {
            // Remove edit query param and reload
            const url = new URL(window.location.href);
            url.searchParams.delete('edit');
            window.location.href = url.toString();
        });

        document.getElementById('admin-login-submit').addEventListener('click', async () => {
            const tokenInput = document.getElementById('admin-token-input').value.trim();
            const errorDiv = document.getElementById('admin-login-error');
            errorDiv.style.display = 'none';

            if (!tokenInput) return;

            // Validate token against GitHub API
            const submitBtn = document.getElementById('admin-login-submit');
            submitBtn.disabled = true;
            submitBtn.innerText = 'Ověřování...';

            try {
                const response = await fetch('https://api.github.com/user', {
                    headers: {
                        'Authorization': `token ${tokenInput}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });

                if (response.ok) {
                    githubToken = tokenInput;
                    localStorage.setItem('github_pat', tokenInput);
                    overlay.remove();
                    activateEditMode();
                } else {
                    errorDiv.style.display = 'block';
                }
            } catch (err) {
                errorDiv.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Přihlásit se';
            }
        });
    }

    // Activate editing capabilities
    function activateEditMode() {
        document.body.classList.add('admin-mode-active');

        const editableElements = document.querySelectorAll('[data-edit-id]');

        editableElements.forEach(el => {
            el.contentEditable = 'true';

            // Strip styling and HTML format on copy-paste (forces plain text)
            el.addEventListener('paste', (e) => {
                e.preventDefault();
                const text = e.clipboardData.getData('text/plain');
                document.execCommand('insertText', false, text);
            });

            // Mark page as dirty on change
            el.addEventListener('input', () => {
                isDirty = true;
            });
            
            // If it's a link, prevent navigation on click in edit mode
            if (el.tagName.toLowerCase() === 'a' || el.closest('a')) {
                const parentLink = el.tagName.toLowerCase() === 'a' ? el : el.closest('a');
                parentLink.addEventListener('click', (e) => {
                    e.preventDefault();
                });
            }
        });

        // Set up warning when exiting with unsaved changes
        window.addEventListener('beforeunload', (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        });

        // Add confirmation when navigating away via other page links
        document.querySelectorAll('a').forEach(link => {
            // Check if link is not one of our editable links
            if (!link.hasAttribute('data-edit-id') && !link.closest('[data-edit-id]')) {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href && !href.startsWith('#')) {
                        if (isDirty && !confirm('Máte neuložené změny. Opravdu chcete odejít a zahodit je?')) {
                            e.preventDefault();
                        }
                    }
                });
            }
        });

        showControlBar();
    }

    // Render floating Control Bar at the bottom
    function showControlBar() {
        const bar = document.createElement('div');
        bar.className = 'admin-control-bar';

        const fileLabel = getCurrentFilePath() === 'index_en.html' ? 'Anglická verze (EN)' : 'Česká verze (CZ)';

        bar.innerHTML = `
            <div class="admin-control-info">
                <span class="admin-status-dot"></span>
                <span>Režim úprav: <strong>${fileLabel}</strong></span>
            </div>
            <div class="admin-control-actions">
                <button class="admin-btn admin-btn-save" id="admin-save-btn">Uložit změny</button>
                <button class="admin-btn admin-btn-discard" id="admin-discard-btn">Zahodit</button>
                <button class="admin-btn admin-btn-logout" id="admin-logout-btn">Odhlásit se</button>
            </div>
        `;

        document.body.appendChild(bar);

        // Save changes action
        document.getElementById('admin-save-btn').addEventListener('click', saveChanges);

        // Discard changes action
        document.getElementById('admin-discard-btn').addEventListener('click', () => {
            if (!isDirty || confirm('Opravdu chcete zahodit všechny neuložené úpravy?')) {
                isDirty = false;
                window.location.reload();
            }
        });

        // Logout action
        document.getElementById('admin-logout-btn').addEventListener('click', () => {
            if (!isDirty || confirm('Máte neuložené změny. Chcete se opravdu odhlásit? Úpravy budou ztraceny.')) {
                isDirty = false;
                localStorage.removeItem('github_pat');
                // Remove edit param and reload
                const url = new URL(window.location.href);
                url.searchParams.delete('edit');
                window.location.href = url.toString();
            }
        });
    }

    // Perform saving to GitHub API (DOM merge)
    async function saveChanges() {
        const filePath = getCurrentFilePath();

        // Show loading spinner overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'admin-saving-overlay';
        loadingOverlay.innerHTML = `
            <div class="admin-spinner"></div>
            <div class="admin-saving-text">Ukládám změny na GitHub...</div>
            <div style="font-size: 0.85rem; color: var(--color-text-muted);">Tento proces může trvat několik sekund.</div>
        `;
        document.body.appendChild(loadingOverlay);

        try {
            // 1. Fetch current file from GitHub API
            const getUrl = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${filePath}?ref=${CONFIG.branch}`;
            const response = await fetch(getUrl, {
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error('Nepodařilo se stáhnout původní soubor z GitHubu. Zkontrolujte oprávnění tokenu.');
            }

            const fileData = await response.json();
            const rawHtml = decodeBase64Utf8(fileData.content);

            // 2. Parse HTML string using DOMParser
            const parser = new DOMParser();
            const doc = parser.parseFromString(rawHtml, 'text/html');

            // 3. Select all local edited elements and map them to the parsed HTML
            const localEditables = document.querySelectorAll('[data-edit-id]');
            localEditables.forEach(localEl => {
                const id = localEl.getAttribute('data-edit-id');
                const parsedEl = doc.querySelector(`[data-edit-id="${id}"]`);

                if (parsedEl) {
                    // Specific handling for statistics counter numbers
                    if (localEl.classList.contains('stat-num') || localEl.hasAttribute('data-target')) {
                        const val = parseInt(localEl.innerText.replace(/\D/g, '')) || 0;
                        parsedEl.setAttribute('data-target', val.toString());
                        parsedEl.innerText = '0';
                    } else {
                        // Standard text block innerHTML update
                        parsedEl.innerHTML = localEl.innerHTML;
                    }

                    // Special auto-sync logic for links (tel: and mailto:)
                    if (parsedEl.tagName.toLowerCase() === 'a') {
                        const href = parsedEl.getAttribute('href') || '';
                        const cleanText = localEl.innerText.trim();
                        if (href.startsWith('tel:')) {
                            parsedEl.setAttribute('href', 'tel:' + cleanText.replace(/\s+/g, ''));
                        } else if (href.startsWith('mailto:')) {
                            parsedEl.setAttribute('href', 'mailto:' + cleanText);
                        }
                    }
                }
            });

            // 4. Serialize the merged HTML document
            const updatedHtml = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;

            // 5. Send update back to GitHub API via PUT
            const putBody = {
                message: `Update web content via visual inline editor (${filePath})`,
                content: encodeBase64Utf8(updatedHtml),
                sha: fileData.sha,
                branch: CONFIG.branch
            };

            const putResponse = await fetch(`https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${filePath}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify(putBody)
            });

            if (!putResponse.ok) {
                const errorInfo = await putResponse.json();
                throw new Error(errorInfo.message || 'Nepodařilo se nahrát změny na GitHub.');
            }

            // Success: clear dirty state, reload
            isDirty = false;
            loadingOverlay.innerHTML = `
                <div style="font-size: 3rem; color: #10b981; margin-bottom: 10px;">✓</div>
                <div class="admin-saving-text" style="color: #10b981;">Změny byly úspěšně uloženy!</div>
                <div style="font-size: 0.9rem; max-width: 320px; text-align: center; color: var(--color-text-muted); margin-top: 5px;">
                    Web se automaticky aktualizuje na doméně do 1-2 minut.
                </div>
            `;

            setTimeout(() => {
                loadingOverlay.remove();
                window.location.reload();
            }, 3000);

        } catch (err) {
            loadingOverlay.remove();
            alert(`Při ukládání došlo k chybě:\n${err.message}`);
        }
    }

    // Start checking URL parameter on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
