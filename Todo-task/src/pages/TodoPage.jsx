import { useEffect, useState } from "react";
import TodoForm from "../components/TodoForm";
import TodoTable from "../components/TodoTable";
import { getTodos } from "../service/todoApi";

function toTask(todo) {
  const now = new Date().toISOString();
  const title = todo?.title ?? todo?.todo ?? "";
  const description = todo?.description ?? "";
  const status = todo?.status ?? (todo?.completed ? "completed" : "pending");

  return {
    ...todo,
    title,
    description,
    status,
    createdAt: todo?.createdAt ?? now,
    updatedAt: todo?.updatedAt ?? null,
  };
}

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editTodo, setEditTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    setLoading(true);
    try {
      const data = await getTodos();
      setTodos((Array.isArray(data) ? data : []).map(toTask));
    } catch (err) {
      console.log("Error fetching todos", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Todo List</h1>
              <p className="text-sm text-gray-500">Track what you need to do today.</p>
            </div>
            {todos?.length ? (
              <span className="text-sm font-medium text-gray-700">
                {todos.length} tasks
              </span>
            ) : null}
          </div>

          <TodoForm
            todos={todos}
            setTodos={setTodos}
            editTodo={editTodo}
            setEditTodo={setEditTodo}
          />

          {loading ? (
            <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 px-4 py-10 text-center">
              <p className="text-sm text-gray-600">Loading tasks...</p>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <TodoTable todos={todos} setTodos={setTodos} onEdit={setEditTodo} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoPage;
