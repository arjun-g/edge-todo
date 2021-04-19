import { Input, Row, Col, Space, Button, Tooltip } from "antd";
import { InfoCircleTwoTone } from "@ant-design/icons";
import { DateTime } from "./widgets/datetime";
import "antd/dist/antd.css";

import "./App.css";
import { Timeline } from "./widgets/timeline";
import { useTodoStore, todoStoreAPI } from "./todo.store";
import { useEffect, useState } from "react";

function App() {
  const todos = useTodoStore((state) => state.todos);

  const [content, setContent] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    todoStoreAPI.getState().getAll();
    todoStoreAPI.getState().getSettings();
  }, []);

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <div className="topbar">
          <div className="banner card">
            <span className="title">Todo</span>
            <span className="subtitle">Add/schedule your todo</span>
          </div>
          <div className="card">
            <span className="title">{todos.filter(todo => !todo.completed).length}</span>
            <span className="subtitle">Pending Todos</span>
          </div>
          <div className="card">
            <span className="heading">Send reminder to</span>
            <form>
              <Input
                value={phoneNumber}
                suffix={
                  <Tooltip title="The phonenumber will be auto deleted in 12hrs from the time you have save this.">
                    <InfoCircleTwoTone />
                  </Tooltip>
                }
                onChange={e => setPhoneNumber(e.target.value)}
              />
              <div style={{ height: "8px" }} />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button size="small" type="primary" onClick={e => {
                  todoStoreAPI.getState().savePhoneNumber(phoneNumber);
                }}>
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
        <form onSubmit={e => {
          e.preventDefault();
        }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <Input
              size="large"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => {
                todoStoreAPI.getState().addTodo({ content: content });
                setContent("");
              }}
              disabled={content.length === 0}
              htmlType="submit"
            >
              Add Todo
            </Button>
            <DateTime onDone={dueOn => {
              todoStoreAPI.getState().addTodo({ content: content, dueOn });
              setContent("");
            }} disabled={content.length === 0} />
          </div>
          </Space>
        </form>
        <div>
          <Timeline todos={todos} />
        </div>
      </Space>
    </div>
  );
}

export default App;
