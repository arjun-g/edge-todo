import create from "zustand";
import produce from "immer";
import { v4 } from "uuid";
import dayjs from "dayjs";

const [useTodoStore, todoStoreAPI] = create((set, get) => {
  function addTodo({ content, dueOn }) {
    const todo = { content, dueOn, id: v4() };
    set(
      produce((state) => {
        state.todos.push(todo);
      })
    );
    fetch("/api/todo", {
      body: JSON.stringify({ ...todo, dueOn: todo.dueOn && todo.dueOn.toDate().toGMTString() }),
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        return resp.json();
      });
  }
  async function getAll() {
      const resp = await fetch("/api/todo");
      const todos = await resp.json();
      todos.forEach(todo => {
        todo.dueOn = todo.dueOn && dayjs(todo.dueOn);
        todo.createdOn = dayjs(todo.createdOn);
      });
      set(
        produce((state) => {
          state.todos = todos;
        })
      );
  }
  function toggleTodo(todo) {
    set(
      produce((state) => {
        const currentTodo = state.todos.find((t) => t.id === todo.id);
        currentTodo.completed = !currentTodo.completed;
      })
    );
    fetch(`/api/todo/${todo.id}`, {
        body: JSON.stringify({ completed: !todo.completed }),
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => {
          return resp.json();
        });
  }
  function deleteTodo(todo) {
    set(
      produce((state) => {
        const index = state.todos.findIndex((t) => t.id === todo.id);
        state.todos.splice(index, 1);
      })
    );
    fetch(`/api/todo/${todo.id}`, {
        method: "delete"
      })
        .then((resp) => {
          return resp.json();
        });
  }
  function savePhoneNumber(phonenumber){
    fetch("/api/settings", {
        body: JSON.stringify({ phonenumber }),
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => {
            set(produce(state => {
                state.phonenumber = phonenumber;
            }));
          return resp.json();
        });
  }
  async function getSettings(){
    const resp = await fetch("/api/settings");
    const settings = await resp.json();
    set(produce(state => {
        state.phonenumber = settings.phonenumber;
    }))
  }
  return {
    todos: [],
    phonenumber: "",
    getAll,
    addTodo,
    toggleTodo,
    deleteTodo,
    savePhoneNumber,
    getSettings
  };
});

export { useTodoStore, todoStoreAPI };
