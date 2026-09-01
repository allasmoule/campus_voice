"use client";

import { useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

const TEXT_COLORS = ["#111827", "#DC2626", "#D97706", "#059669", "#2563EB", "#7C3AED"];

function ToolbarButton({
  active,
  disabled,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`min-w-[32px] h-8 px-2 rounded-md text-sm font-medium transition-colors disabled:opacity-40 ${
        active ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

const Divider = () => <span className="w-px h-5 bg-gray-200 mx-1" />;

const LinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ExpandIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" />
  </svg>
);

const CollapseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4v4H5M15 4v4h4M9 20v-4H5M15 20v-4h4" />
  </svg>
);

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onImageUpload: (file: File) => Promise<string>;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, onImageUpload, placeholder }: RichTextEditorProps) {
  const [showColors, setShowColors] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isFullscreen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: false, underline: false }),
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer nofollow ugc", target: "_blank" },
      }),
      Image,
      Placeholder.configure({ placeholder: placeholder || "Write here. You can also include @mentions." }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[260px] px-1 py-3",
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl || "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }, [editor]);

  const insertImage = useCallback(() => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploadingImage(true);
      setUploadError("");
      try {
        const url = await onImageUpload(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (e) {
        setUploadError(e instanceof Error ? e.message : "Image upload failed.");
      } finally {
        setUploadingImage(false);
      }
    };
    input.click();
  }, [editor, onImageUpload]);

  if (!editor) return null;

  const headingValue = editor.isActive("heading", { level: 2 })
    ? "h2"
    : editor.isActive("heading", { level: 3 })
    ? "h3"
    : "p";

  const body = (
    <>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
        <select
          value={headingValue}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "p") editor.chain().focus().setParagraph().run();
            else if (v === "h2") editor.chain().focus().toggleHeading({ level: 2 }).run();
            else editor.chain().focus().toggleHeading({ level: 3 }).run();
          }}
          className="text-sm border-none bg-transparent text-gray-700 focus:outline-none mr-1 rounded hover:bg-gray-100 px-1 py-1"
        >
          <option value="p">Paragraph</option>
          <option value="h2">Heading</option>
          <option value="h3">Subheading</option>
        </select>
        <Divider />
        <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <b>B</b>
        </ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <i>I</i>
        </ToolbarButton>
        <ToolbarButton title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <u>U</u>
        </ToolbarButton>
        <Divider />
        <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          •≡
        </ToolbarButton>
        <ToolbarButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1≡
        </ToolbarButton>
        <Divider />
        <ToolbarButton title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          &ldquo;&rdquo;
        </ToolbarButton>
        <ToolbarButton title="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
          {"{}"}
        </ToolbarButton>
        <ToolbarButton title="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          {"</>"}
        </ToolbarButton>
        <ToolbarButton title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          —
        </ToolbarButton>
        <Divider />
        <ToolbarButton title="Link" active={editor.isActive("link")} onClick={setLink}>
          <LinkIcon />
        </ToolbarButton>
        <ToolbarButton title="Insert image" disabled={uploadingImage} onClick={insertImage}>
          {uploadingImage ? "…" : <ImageIcon />}
        </ToolbarButton>
        <Divider />
        <div className="relative">
          <ToolbarButton title="Text color" onClick={() => setShowColors((s) => !s)}>
            <span className="font-bold" style={{ color: editor.getAttributes("textStyle").color || undefined }}>
              A
            </span>
          </ToolbarButton>
          {showColors && (
            <div className="absolute z-20 top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center gap-1.5">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  title={c}
                  className="w-5 h-5 rounded-full border border-gray-200"
                  style={{ backgroundColor: c }}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    editor.chain().focus().setColor(c).run();
                    setShowColors(false);
                  }}
                />
              ))}
              <button
                type="button"
                className="text-[11px] text-gray-500 px-1.5 hover:text-gray-800"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  editor.chain().focus().unsetColor().run();
                  setShowColors(false);
                }}
              >
                Reset
              </button>
            </div>
          )}
        </div>
        <Divider />
        <ToolbarButton
          title={isFullscreen ? "Exit fullscreen" : "Expand to fullscreen"}
          active={isFullscreen}
          onClick={() => setIsFullscreen((s) => !s)}
        >
          {isFullscreen ? <CollapseIcon /> : <ExpandIcon />}
        </ToolbarButton>
      </div>

      <EditorContent
        editor={editor}
        className={isFullscreen ? "px-3 flex-1 overflow-y-auto" : "px-3"}
      />

      {uploadError && <p className="text-xs text-red-600 px-3 pb-2">{uploadError}</p>}
    </>
  );

  if (isFullscreen) {
    return <div className="fixed inset-0 z-[100] bg-white flex flex-col">{body}</div>;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
      {body}
    </div>
  );
}
