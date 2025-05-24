import React, { useState } from "react";
import AdminLayout from "../../pages/layouts/AdminLayout";
import {
  AiOutlinePlus,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineClose,
} from "react-icons/ai";

const initialInstructors = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
];

export default function Instructors() {
  const [instructors, setInstructors] = useState(initialInstructors);
  const [form, setForm] = useState({ id: null, name: "", email: "" });
  const [editing, setEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  function resetForm() {
    setForm({ id: null, name: "", email: "" });
    setEditing(false);
    setModalOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      alert("Fill all fields!");
      return;
    }

    if (editing) {
      setInstructors((prev) =>
        prev.map((inst) => (inst.id === form.id ? { ...form } : inst))
      );
    } else {
      setInstructors((prev) => [
        ...prev,
        { ...form, id: Date.now() }, // simple id generator
      ]);
    }
    resetForm();
  }

  function handleEdit(inst) {
    setForm(inst);
    setEditing(true);
    setModalOpen(true);
  }

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this instructor?")) {
      setInstructors((prev) => prev.filter((inst) => inst.id !== id));
      if (editing && form.id === id) resetForm();
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Manage Instructors
      </h1>

      <button
        onClick={() => setModalOpen(true)}
        className="mb-4 inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 transition"
      >
        <AiOutlinePlus size={20} /> Add New Instructor
      </button>

      {/* Instructors Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {instructors.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
                  No instructors added yet.
                </td>
              </tr>
            ) : (
              instructors.map(({ id, name, email }) => (
                <tr key={id} className="hover:bg-indigo-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                    {name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-4 justify-end">
                    <button
                      onClick={() => handleEdit({ id, name, email })}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                      title="Edit Instructor"
                    >
                      <AiOutlineEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      title="Delete Instructor"
                    >
                      <AiOutlineDelete size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={resetForm}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
              aria-label="Close modal"
            >
              <AiOutlineClose size={24} />
            </button>
            <h2 className="text-2xl font-semibold mb-4">
              {editing ? "Edit Instructor" : "Add New Instructor"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 mb-1 font-medium"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Instructor name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 mb-1 font-medium"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Instructor email"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                {editing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2"
                >
                  {editing ? "Update" : "Add"}
                  <AiOutlinePlus />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
