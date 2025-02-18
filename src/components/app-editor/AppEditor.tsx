import { Editor, EditorProps } from '@monaco-editor/react';
import classNames from 'classnames';

export interface AppEditorProps extends EditorProps {}

export default function AppEditor({
  height = '500px',
  width = '100%',
  theme = 'vs-dark',
  ...props
}: AppEditorProps) {
  return (
    <Editor
      className={classNames('app-editor', props.className)}
      theme={theme}
      height={height}
      width={width}
      defaultLanguage="javascript"
      defaultValue="// some comment"
      {...props}
    />
  );
}
