/** Tiptap editor styles — import once per page that uses a Tiptap editor. */
export function TiptapStyles() {
    return (
        <style>{`
            .tiptap p.is-editor-empty:first-child::before {
                content: attr(data-placeholder);
                float: left;
                color: var(--muted-foreground);
                opacity: 0.4;
                pointer-events: none;
                height: 0;
            }
            .tiptap {
                min-height: 300px;
            }
            .tiptap img {
                max-width: 100%;
                height: auto;
                border-radius: 0.5rem;
                margin: 1rem auto;
                display: block;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .tiptap img.ProseMirror-selectednode {
                outline: 2px solid #1548d7;
                outline-offset: 2px;
                border-radius: 0.5rem;
            }
            .tiptap blockquote {
                border-left: 3px solid #1548d7;
                padding-left: 1rem;
                font-style: italic;
                color: var(--muted-foreground);
            }
            .tiptap pre {
                background: var(--muted);
                border-radius: 0.5rem;
                padding: 1rem;
                font-family: monospace;
                overflow-x: auto;
            }
            .tiptap mark {
                background-color: #fef08a;
                border-radius: 0.125rem;
                padding: 0.125rem 0.25rem;
            }
            .dark .tiptap mark {
                background-color: #854d0e;
                color: #fef9c3;
            }
            .tiptap hr {
                border: none;
                border-top: 2px solid var(--border);
                margin: 1.5rem 0;
            }
            .tiptap a {
                color: #1548d7;
                text-decoration: underline;
                cursor: pointer;
            }
            .dark .tiptap a {
                color: #6b93f5;
            }
            .tiptap ul, .tiptap ol {
                padding-left: 1.5rem;
            }
            .tiptap h1 {
                font-size: 1.875rem;
                font-weight: 700;
                line-height: 1.3;
                margin-top: 1.5rem;
                margin-bottom: 0.75rem;
            }
            .tiptap h2 {
                font-size: 1.5rem;
                font-weight: 700;
                line-height: 1.3;
                margin-top: 1.25rem;
                margin-bottom: 0.5rem;
            }
            .tiptap h3 {
                font-size: 1.25rem;
                font-weight: 600;
                line-height: 1.4;
                margin-top: 1rem;
                margin-bottom: 0.5rem;
            }
        `}</style>
    );
}
