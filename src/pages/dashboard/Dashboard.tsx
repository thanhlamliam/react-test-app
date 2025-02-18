// @ts-nocheck
import { Button, Divider, Form, Input } from 'antd';
import './dashboard.scss';
import { FormProps } from 'antd/es/form/Form';
import { useId, useState } from 'react';
import fxparser from "fast-xml-parser";
import XMLViewer from 'react-xml-viewer';

export default function Dashboard() {
  const parser = new fxparser.XMLParser();

  const postId = useId();
  const userId = useId();

  const [xmlContent, setXmlContent] = useState();
  const [xml, setXml] = useState();

  const getData = () => {
    fetch('https://jsonplaceholder.typicode.com/posts/1')
      .then(response => response.json())
      .then(json => console.log(json))
  }

  const onFinish: FormProps<{
    title: string;
    body: string
  }>['onFinish'] = (values) => {
    console.log('Success:', values);

    fetch('https://jsonplaceholder.typicode.com/posts', {
      body: JSON.stringify({
        userId: userId,
        id: postId,
        title: values.title,
        body: values.body
      }),
      method: "POST"
    })
      .then(response => response.json())
      .then(json => console.log(json))
  };

  const handleTest = () => {
    fetch("http://10.63.167.41:8080/api/employee", {
      method: "GET",
    })
      .then((response) => {
        return response.text();
      })
      .then((str) => {
        setXmlContent(str);
        return parser.parse(str);
      })
      .then((data) => {
        console.log("data", data)
        setXml(data);
      })
  }

  return (
    <div className='w-full'>
      <div className='flex justify-between'>
        <h1 className="font-bold">Dashboard</h1>

        <Button type='primary' onClick={() => getData()}>Get data</Button>
      </div>

      <Divider />
      {/* <iframe
        src="https://211.174.185.31:44390/sap/bc/gui/sap/its/webgui?sap-client=810&sap-language=EN#"
        height="500"
        width="500"
        title="Iframe Example"
        style={{ border: "2px solid red" }}
      /> */}

      <Button onClick={() => handleTest()}>Get XML Response</Button>

      {
        xml ?
          <div className='my-2 max-w-[70%]'>
            <XMLViewer
              xml={xmlContent}
              collapsible
              theme={
                {
                  attributeKeyColor: "#0074D9",
                  attributeValueColor: "#2ECC40"
                }
              }
            />
          </div>
          : null
      }

      <Divider />

      <Form className='p-6 bg-white rounded-md' onFinish={onFinish} layout='vertical' name="form">
        <Form.Item name="title" label="Title">
          <Input></Input>
        </Form.Item>

        <Form.Item name="body" label="Description">
          <Input.TextArea rows={10}></Input.TextArea>
        </Form.Item>

        <div className='flex justify-end'>
          <Button type='primary' htmlType='submit'>Submit</Button>
        </div>
      </Form>
    </div>
  );
}
