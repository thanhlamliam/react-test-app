// @ts-nocheck
import { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Button, Divider, Flex } from 'antd';
import { useRef, useState } from 'react';
import AppEditor from '@/components/app-editor/AppEditor';
import { Monaco, MonacoDiffEditor } from '@monaco-editor/react';

interface Data {
  make: string;
  model: string;
  price: number;
  electric: boolean;
}

export default function About() {
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState<Data[]>([
    { make: 'Tesla', model: 'Model Y', price: 64950, electric: "true" },
    { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
    { make: 'Toyota', model: 'Corolla', price: 29600, electric: false }
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState<ColDef[]>([
    {
      headerName: 'Make & Model',
      valueGetter: (p: any) => `${p.data.make} ${p.data.model}`,
      flex: 2
    },
    {
      field: 'price',
      valueFormatter: (p: any) => `$ ${Math.floor(p.value).toLocaleString()}`,
      flex: 1
    },
    { field: 'electric', flex: 1 },
    { field: 'button', cellRenderer: ButtonGroup, flex: 1 }
  ]);

  const editorRef = useRef<MonacoDiffEditor>(null);

  function handleEditorDidMount(editor: MonacoDiffEditor, monaco: Monaco) {
    editorRef.current = editor;
  }

  function showValue() {
    alert(editorRef.current?.getValue());
  }

  function handleEditorValidation(markers: any) {
    // model markers
    markers.forEach((marker: any) => console.log('onValidate:', marker.message));
  }

  return <div className='w-full'>
    <h1 className="font-bold">About</h1>

    <Divider />

    <AppEditor
      className="mb-4"
      onMount={handleEditorDidMount}
      onValidate={handleEditorValidation}
    />
    <Button onClick={showValue}>Show value</Button>

    <div
      className="mt-4 ag-theme-quartz" // applying the grid theme
      style={{ height: 500 }} // the grid will fill the size of the parent container
    >
      <AgGridReact className="dashboard-table" rowData={rowData} columnDefs={colDefs} />
    </div>
  </div>;
}


const ButtonGroup = () => {
  return (
    <Flex align="center" gap={16}>
      <Button>Edit</Button>
      <Button>Delete</Button>
    </Flex>
  );
};
