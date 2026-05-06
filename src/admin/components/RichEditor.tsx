'use client';

import React, { useEffect, useRef } from 'react';
import { Bold, Italic, Underline, Heading1, Heading2, List } from 'lucide-react';

interface RichEditorProps {
  content: string;
  setContent: (content: string) => void;
}

/**
 * Éditeur texte riche (WYSIWYG)
 */
export default function RichEditor({ content, setContent }: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || '';
    }
  }, [content]);

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    if (editorRef.current) setContent(editorRef.current.innerHTML);
  };

  const handleInput = () => {
    if (editorRef.current) setContent(editorRef.current.innerHTML);
  };

  const ToolbarButton = ({ 
    onClick, 
    icon: Icon, 
    title 
  }: { 
    onClick: () => void
    icon: any
    title: string 
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50 border-gray-200 flex-wrap">
        <ToolbarButton onClick={() => execCommand('bold')} icon={Bold} title="Gras" />
        <ToolbarButton onClick={() => execCommand('italic')} icon={Italic} title="Italique" />
        <ToolbarButton onClick={() => execCommand('underline')} icon={Underline} title="Souligné" />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton onClick={() => execCommand('formatBlock', 'H1')} icon={Heading1} title="Titre 1" />
        <ToolbarButton onClick={() => execCommand('formatBlock', 'H2')} icon={Heading2} title="Titre 2" />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton onClick={() => execCommand('insertUnorderedList')} icon={List} title="Liste à puces" />
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[200px] outline-none prose max-w-none"
        style={{ whiteSpace: 'pre-wrap' }}
      />
    </div>
  );
}
