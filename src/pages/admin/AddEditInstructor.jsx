import { useState } from "react";

const AddEditInstructor = ({ isEdit = false, existingData = {} }) => {
  const [name, setName] = useState(existingData.name || "");
  const [email, setEmail] = useState(existingData.email || "");
  const [status, setStatus] = useState(existingData.status || "Active");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for saving or updating instructor data
    console.log({ name, email, status });
  };

  return (
    <div className="ml-64 p-8">
      <h2 className="text-2xl font-bold mb-4">
        {isEdit ? "Edit Instructor" : "Add New Instructor"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="mt-1 p-2 w-full border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {isEdit ? "Update Instructor" : "Add Instructor"}
        </button>
      </form>
    </div>
  );
};

export default AddEditInstructor;
