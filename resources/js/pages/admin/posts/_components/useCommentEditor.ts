import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export function useCommentEditor(placeholder: string) {
    return useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [2, 3] } }),
            Underline,
            Highlight.configure({ multicolor: false }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-[#1548d7] dark:text-[#6b93f5] underline cursor-pointer' },
            }),
            Image.configure({
                HTMLAttributes: { class: 'rounded-lg max-w-full mx-auto my-3 shadow-sm' },
                allowBase64: false,
            }),
            Placeholder.configure({ placeholder }),
        ],
        editorProps: {
            attributes: {
                class: 'prose prose-sm prose-neutral dark:prose-invert max-w-none min-h-[100px] px-4 py-3 focus:outline-none text-sm leading-relaxed',
            },
        },
    });
}
