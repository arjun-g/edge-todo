import { express } from "cfw-express";
import { site } from "cfw-express-static";

import { v4 } from "uuid";
import { sendSMS } from "./sms";

const app = express();

app.use(async (req, res) => {
  if(req.url.pathname === "/" && !req.cookies.UID){
    const uid = v4();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    res.cookie("UID", uid, {
      Expires: expiryDate.toGMTString()
    });
    req.uid = uid;
  }
  if(req.cookies.UID){
    req.uid = req.cookies.UID;
  }
});

app.post("/api/todo", async (req, res) => {
  const body = await req.json();
  const todoId = `${req.uid}:todos`;
  let todos = await TODO.get(todoId, { type: "json" });
  todos = todos || [];
  todos.push({ ...body, createdOn: new Date().toGMTString() })
  await TODO.put(todoId, JSON.stringify(todos));
  res.json(body);
});

app.get("/api/todo", async (req, res) => {
  const todoId = `${req.uid}:todos`;
  let todos = await TODO.get(todoId, { type: "json" });
  todos = todos || [];
  res.json(todos);
});

app.delete("/api/todo/:todoId", async (req, res) => {
  const todoId = `${req.uid}:todos`;
  let todos = await TODO.get(todoId, { type: "json" });
  todos = todos || [];
  todos = todos.filter(todo => todo.id !== req.params.todoId);
  await TODO.put(todoId, JSON.stringify(todos));
  res.json({ success: true });
});

app.put("/api/todo/:todoId", async (req, res) => {
  const body = await req.json();
  const todoId = `${req.uid}:todos`;
  let todos = await TODO.get(todoId, { type: "json" });
  todos = todos || [];
  const todo = todos.find(todo => todo.id === req.params.todoId);
  todo.completed = body.completed;
  await TODO.put(todoId, JSON.stringify(todos));
  res.json({ success: true });
});

app.post("/api/settings", async (req, res) => {
  const body = await req.json();
  const settingsId = `${req.uid}:settings`;
  await TODO.put(settingsId, JSON.stringify(body), { expirationTtl: 43200 });
  res.json({ success: true });
});

app.get("/api/settings", async (req, res) => {
  const settingsId = `${req.uid}:settings`;
  const settings = JSON.parse(await TODO.get(settingsId) || "{}");
  res.json(settings);
});

app.use(site());

app.listen();

async function handleScheduled(event){
  const list = await TODO.list();
  const keys = list.keys;
  for(let i = 0; i < keys.length; i++){
    const key = keys[i].name;
    if(key.indexOf(":todos") > 0){
      const todos = (await TODO.get(key, { type: "json" })) || [];
      const incomplete = todos.filter(todo => !todo.completed).length;
      const { phonenumber } = (await TODO.get(key.replace(":todos", ":settings"), { type: "json" })) || {};
      if(phonenumber && incomplete){
        try{
          await sendSMS(phonenumber, `You have ${incomplete} tasks pending`);
        }
        catch(ex){ }
      }
    }
  }
}

addEventListener('scheduled', event => {
  event.waitUntil(handleScheduled(event));
})