import { useEffect, useState } from 'react';
import type { UnprivilegedEditor } from 'react-quill';

interface QuillEditorProps {
  value: string;
  onChange: (content: string, delta: any, source: UnprivilegedEditor, editor: UnprivilegedEditor) => void;
  modules?: any;
  formats?: string[];
  className?: string;
  theme?: string;
  preserveWhitespace?: boolean;
}

export default function QuillEditor({
  value,
  onChange,
  modules,
  formats,
  className,
  theme = 'snow',
  preserveWhitespace = false
}: QuillEditorProps) {
  const [QuillComponent, setQuillComponent] = useState<any>(null);

  useEffect(() => {
    import('react-quill').then((module) => {
      setQuillComponent(() => module.default);
    });
  }, []);

  if (!QuillComponent) {
    return <div>Loading editor...</div>;
  }

  return (
    <QuillComponent
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      className={className}
      theme={theme}
      preserveWhitespace={preserveWhitespace}
    />
  );
} 