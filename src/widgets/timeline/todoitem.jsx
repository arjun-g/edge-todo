import React from "react";
import { Checkbox } from "antd";
import { DeleteFilled } from "@ant-design/icons";

import { todoStoreAPI } from "../../todo.store";
import dayjs from "dayjs";

export function TodoItem({ todo, color }){
    return <div className={`timelineitem ${color} ${todo.completed ? "completed" : ""}`}>
        <div className="itemcontent">
            <Checkbox onChange={e => {
                todoStoreAPI.getState().toggleTodo(todo);
            }} checked={!!todo.completed}>{todo.content}</Checkbox>
            {todo.dueOn && <span className="duetime">{todo.dueOn.format("hh:mm a")}</span>}
        </div>
        
        {/* <div style={{ flex: "1 1 100%" }} /> */}
        <div onClick={() => {
            todoStoreAPI.getState().deleteTodo(todo);
        }} className="deletetodo">
            <DeleteFilled />
        </div>
    </div>;
}