import { useEffect, useState } from "react";
import { addTodo, updateTodo } from "../service/todoApi";

function TodoForm({ todos, setTodos, editTodo, setEditTodo }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
	const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editTodo) {
      setTitle(editTodo.title || "");
      setDescription(editTodo.description || "");
    }
  }, [editTodo]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    try {
		setSaving(true);
      if (editTodo) {
        const completed = editTodo.status === "completed";

        await updateTodo(editTodo.id, {
          todo: title,
          completed,
        });

        const updatedAt = new Date().toISOString();
        setTodos((prev) =>
          prev.map((t) =>
            t.id === editTodo.id
              ? {
                  ...t,
                  title,
                  description,
                  updatedAt,
                }
              : t
          )
        );
        setEditTodo(null);
      } else {
        const newTodo = await addTodo({
          todo: title,
          completed: false,
          userId: 1,
        });

        const now = new Date().toISOString();
        const task = {
          ...newTodo,
          title,
          description,
          status: "pending",
          createdAt: now,
          updatedAt: null,
        };

        setTodos((prev) => [task, ...prev]);
      }

      setTitle("");
      setDescription("");
    } catch (err) {
      console.log("Error saving todo", err);
      } finally {
        setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-gray-200 bg-white p-4"
    >
      <div className="grid gap-3 sm:grid-cols-3 sm:items-start">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Task
          </label>
          <input
            type="text"
            placeholder="e.g. Pay electricity bill"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="sm:col-span-3">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description
            <span className="ml-1 text-xs font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Add a short note…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="sm:col-span-3 flex items-center justify-end gap-2">
          {editTodo ? (
            <span className="mr-auto text-sm text-amber-700">
              Editing: <span className="font-medium">{editTodo.title}</span>
            </span>
          ) : (
            <span className="mr-auto text-sm text-gray-500">Add a new task</span>
          )}

          <button
            type="submit"
			disabled={saving}
			className="inline-flex cursor-pointer items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
			{saving ? "Saving..." : editTodo ? "Update Task" : "Add Task"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default TodoForm;
