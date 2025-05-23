import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";

export default function EditorBloque({ contenido, onChange }) {
  const editor = useEditor({
    content: contenido,
    extensions: [StarterKit, Underline, TextStyle, Color],
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded p-4 bg-white space-y-3">
      <EditorContent editor={editor} />

      <div className="flex flex-wrap gap-2 text-sm">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("bold")
              ? "bg-red-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Negrita
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("underline")
              ? "bg-red-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Subrayado
        </button>

        <input
          type="color"
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
          className="w-10 h-8 border rounded cursor-pointer"
        />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 rounded border ${
            editor.isActive("blockquote")
              ? "bg-red-600 text-white border-red-700"
              : "bg-gray-100 hover:bg-gray-200 border-gray-400"
          }`}
        >
          Cita
        </button>
      </div>
    </div>
  );
}
