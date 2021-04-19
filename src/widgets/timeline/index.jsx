import dayjs from "dayjs";
import React, { useMemo } from "react";

import "./timeline.css";
import { TodoItem } from "./todoitem";

function nextColor(){
    const colors = ["blue", "green", "purple", "orange", "gray"];
    if(window.colorIndex  > colors.length -1) window.colorIndex = 1;
    else window.colorIndex++;
    return colors[window.colorIndex - 1];
}

export function Timeline({
    todos
}){
    window.colorIndex = 0;
    const groupedTodos = useMemo(() => {
        const orderedTodos = [...todos.filter(todo => !todo.dueOn), ...todos.filter(todo => todo.dueOn).sort((a, b) => a.dueOn.isAfter(b.dueOn) ? 1 : -1)];

        const groups = {};
        orderedTodos.forEach(todo => {
            let groupId = null;
            if(todo.dueOn){
                groupId = todo.dueOn.format("MMM DD");
            }
            else{
                groupId = "-"
            }
            groups[groupId] = groups[groupId] || [];
            groups[groupId].push(todo);
        });
        return groups;
    }, [todos]);
    return <div className="timeline">
        {Object.keys(groupedTodos).map(groupId => {
            return <>
                <div className="time">{groupId || "&nbsp;"}</div>
                <div className="groupedtime">{groupedTodos[groupId].map(todo => {
                    return <TodoItem todo={todo} color={nextColor()} />
                })}</div>
            </>
        })}
    </div>
}

