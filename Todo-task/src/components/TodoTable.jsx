import { useState } from "react";
import { deleteTodo, updateTodo } from "../service/todoApi";

function TodoTable({ todos, setTodos, onEdit }) {
  const [busyIds, setBusyIds] = useState(() => new Set());

  function formatTimestamp(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString();
  }

  function setBusy(id, isBusy) {
    setBusyIds((prev) => {
      const next = new Set(prev);
      if (isBusy) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  async function handleDelete(id) {
    try {
		setBusy(id, true);
      await deleteTodo(id);
		setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.log("Delete failed", err);
	} finally {
		setBusy(id, false);
    }
  }

  async function toggleStatus(todo) {
    try {
      setBusy(todo.id, true);
      const nextStatus = todo.status === "completed" ? "pending" : "completed";
      await updateTodo(todo.id, {
        completed: nextStatus === "completed",
      });

      const updatedAt = new Date().toISOString();
      setTodos((prev) =>
        prev.map((t) =>
          t.id === todo.id ? { ...t, status: nextStatus, updatedAt } : t
        )
      );
    } catch (err) {
      console.log("Update failed", err);
	} finally {
		setBusy(todo.id, false);
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Task
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Status
            </th>
      <th
        scope="col"
        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
      >
        Created
      </th>
      <th
        scope="col"
        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
      >
        Updated
      </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {todos.map((todo) => (
            <tr key={todo.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
        <div className="text-sm font-medium text-gray-900">{todo.title}</div>
              </td>

              <td className="px-4 py-3">
                <span
                  className={
					todo.status === "completed"
                      ? "inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700"
                      : "inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700"
                  }
                >
					{todo.status === "completed" ? "Completed" : "Pending"}
                </span>
              </td>

        <td className="px-4 py-3">
          <div className="text-sm text-gray-700">
            {formatTimestamp(todo.createdAt)}
          </div>
        </td>

        <td className="px-4 py-3">
          <div className="text-sm text-gray-700">
            {formatTimestamp(todo.updatedAt)}
          </div>
        </td>

              <td className="px-4 py-3 text-right">
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleStatus(todo)}
					disabled={busyIds.has(todo.id)}
					className="cursor-pointer rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Toggle
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit(todo)}
					className="cursor-pointer rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(todo.id)}
					disabled={busyIds.has(todo.id)}
					className="cursor-pointer rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {todos.length === 0 ? (
            <tr>
				<td colSpan={5} className="px-4 py-10 text-center">
                <p className="text-sm text-gray-500">No tasks yet.</p>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

export default TodoTable;
