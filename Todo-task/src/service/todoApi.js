
const API_BASE_URL = "https://dummyjson.com";

async function request(path, { method = "GET", body } = {}) {
	const url = `${API_BASE_URL}${path}`;
	const options = { method };

	if (body !== undefined) {
		options.headers = { "Content-Type": "application/json" };
		options.body = JSON.stringify(body);
	}

	const res = await fetch(url, options);

	if (!res.ok) {
		const text = await res.text().catch(() => "");
		const message = text && text.trim() ? text.trim() : res.statusText;
		throw new Error(`Request failed (${res.status}): ${message}`);
	}

	if (res.status === 204) return null;
	return res.json();
}

export async function getTodos() {
	const data = await request("/todos");
	return Array.isArray(data?.todos) ? data.todos : data;
}

export async function addTodo(payload) {
	return request("/todos/add", { method: "POST", body: payload });
}

export async function updateTodo(id, payload) {
	if (id == null) throw new Error("updateTodo: id is required");
	return request(`/todos/${id}`, { method: "PUT", body: payload });
}

export async function deleteTodo(id) 
	{
	if (id == null) throw new Error("deleteTodo: id is required");
	return request(`/todos/${id}`, { method: "DELETE" });
}

