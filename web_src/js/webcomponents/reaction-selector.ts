import { POST } from "../modules/fetch.ts";

customElements.define('reaction-selector', class ReactionSelector extends HTMLElement {
    connectedCallback() {
        const el = this;
        if (window.jQuery) {
            window.$(this).dropdown();
        }

        el.addEventListener('click', async (e) => {
            // there are 2 places for the "reaction" buttons, one is the top-right reaction menu, one is the bottom of the comment
            const target = e.target.closest('.comment-reaction-button');
            console.info('target', target);
            if (!target) {
                return;
            }
            e.preventDefault();

            if (target.classList.contains('disabled'))
                return;

            const actionUrl = target.closest('[data-action-url]').getAttribute('data-action-url');
            const reactionContent = target.getAttribute('data-reaction-content');
            const commentContainer = target.closest('.comment-container');
            const bottomReactions = commentContainer.querySelector('.bottom-reactions'); // may not exist if there is no reaction
            const bottomReactionBtn = bottomReactions === null || bottomReactions === void 0 ? void 0 : bottomReactions.querySelector(`a[data-reaction-content="${CSS.escape(reactionContent)}"]`);
            const hasReacted = bottomReactionBtn === null || bottomReactionBtn === void 0 ? void 0 : bottomReactionBtn.getAttribute('data-has-reacted');
            const res = await POST(`${actionUrl}/${hasReacted ? 'unreact' : 'react'}`, {
                data: new URLSearchParams({ content: reactionContent }),
            });
            const data = await res.json();
            bottomReactions === null || bottomReactions === void 0 ? void 0 : bottomReactions.remove();
            if (data.html) {
                commentContainer.insertAdjacentHTML('beforeend', data.html);
                const bottomReactionsDropdowns = commentContainer.querySelectorAll('.bottom-reactions .dropdown.select-reaction');
                window.$(bottomReactionsDropdowns).dropdown(); // re-init the dropdown
            }
        });
    }
});
