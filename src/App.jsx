import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrashAlt, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [students, setStudents] = useState([]);
  const [studentLoaded, setStudentsLoaded] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [newStudent, setNewStudent] = useState({ name: "", date: "", reg: "" });
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    if (!studentLoaded) {
      axios
        .get("https://student-management-backend-xh90.onrender.com/students")
        .then((res) => {
          setStudents(res.data);
          setStudentsLoaded(true);
        })
        .catch(() => alert("Error fetching students"));
    }
  }, [studentLoaded]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const addStudent = () => {
    if (newStudent.name && newStudent.date && newStudent.reg) {
      axios
        .post("https://student-management-backend-xh90.onrender.com/students", newStudent)
        .then(() => {
          setStudents([...students, newStudent]);
          toast.success("Student added successfully!");
          setNewStudent({ name: "", date: "", reg: "" });
          setIsModalOpen(false);
        })
        .catch(() => toast.error("Error adding student"));
    } else {
      toast.warning("Please fill all fields!");
    }
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setIsEditModalOpen(true);
  };

  const updateStudent = () => {
    if (editingStudent.name && editingStudent.date && editingStudent.reg) {
      axios
        .put(`https://student-management-backend-xh90.onrender.com/students/${editingStudent.reg}`, editingStudent)
        .then(() => {
          setStudents((prevStudents) =>
            prevStudents.map((student) =>
              student.reg === editingStudent.reg ? editingStudent : student
            )
          );
          toast.success("Student updated successfully!");
          setIsEditModalOpen(false);
        })
        .catch(() => toast.error("Error updating student"));
    } else {
      toast.warning("Please fill all fields!");
    }
  };

  const deleteStudent = (reg) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    axios
      .delete(`https://student-management-backend-xh90.onrender.com/students/${reg}`)
      .then(() => {
        setStudents((prevStudents) => prevStudents.filter((student) => student.reg !== reg));
        toast.success("Student deleted successfully!");
      })
      .catch(() => toast.error("Error deleting student"));
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-gray-800">
      {/* Background Image Layer */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571260899304-425eee4c7efc')] bg-cover bg-center opacity-20 z-0"></div>

      {/* Foreground Content */}
      <div className="relative z-10 container mx-auto p-4">
        <ToastContainer position="top-right" autoClose={3000} />

        <h2 className="text-3xl font-bold text-center mb-6 text-blue-900">📋 Student Management System</h2>

        <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-100 text-blue-800 uppercase text-sm tracking-wide">
                <th className="p-3 text-left">Reg No</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((std, index) => (
                <tr key={std.reg} className={`border-b ${index % 2 === 0 ? "bg-white/70" : "bg-gray-50/70"}`}>
                  <td className="p-3">{std.reg}</td>
                  <td className="p-3">{std.name}</td>
                  <td className="p-3">{std.date}</td>
                  <td className="p-3 flex justify-center space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-full transition"
                      onClick={() => openEditModal(std)}
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 p-2 rounded-full transition"
                      onClick={() => deleteStudent(std.reg)}
                    >
                      <FaTrashAlt size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Floating Add Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg hover:scale-110 transition duration-300"
        >
          <FaPlus size={24} />
        </button>

        {/* Add Student Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-bold">Add New Student</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={20} />
                </button>
              </div>
              <input
                type="text"
                name="name"
                placeholder="Student Name"
                value={newStudent.name}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                name="reg"
                placeholder="Registration No"
                value={newStudent.reg}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="date"
                name="date"
                value={newStudent.date}
                onChange={handleInputChange}
                className="w-full p-2 mb-4 border rounded"
              />
              <button
                onClick={addStudent}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                Add Student
              </button>
            </div>
          </div>
        )}

        {/* Edit Student Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-bold">Edit Student</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={20} />
                </button>
              </div>
              <input
                type="text"
                name="name"
                value={editingStudent?.name}
                onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                name="reg"
                value={editingStudent?.reg}
                readOnly
                className="w-full p-2 mb-2 border rounded bg-gray-100"
              />
              <input
                type="date"
                name="date"
                value={editingStudent?.date}
                onChange={(e) => setEditingStudent({ ...editingStudent, date: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
              />
              <button
                onClick={updateStudent}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                Update Student
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
