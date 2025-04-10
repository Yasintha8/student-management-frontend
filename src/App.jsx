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
  const [searchTerm, setSearchTerm] = useState("");

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
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644')" }}
    >
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
      <div className="relative z-10 container mx-auto px-4 py-10 text-white">
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Add Student Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 z-50"
          aria-label="Add new student"
          title="Add Student"
        >
          <FaPlus size={18} />
          <span className="font-medium">Add Student</span>
        </button>


        <h1 className="text-3xl font-bold text-center mb-6">Student Management System</h1>

        {/* Search */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search by Register Number or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-xl px-4 py-2 text-white border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-gray-800">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Reg No</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students
                .filter(
                  (std) =>
                    std.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    std.reg.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((std, index) => (
                  <tr
                    key={std.reg}
                    className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} border-b`}
                  >
                    <td className="p-3">{std.reg}</td>
                    <td className="p-3">{std.name}</td>
                    <td className="p-3">{std.date}</td>
                    <td className="p-3 flex justify-center space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-full"
                        onClick={() => openEditModal(std)}
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 p-2 rounded-full"
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

        {/* Add Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800/75 bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-gray-800">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Add New Student</h2>
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
              <button onClick={addStudent} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                Add Student
              </button>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-gray-800">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Edit Student</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={20} />
                </button>
              </div>
              <input
                type="text"
                name="name"
                value={editingStudent?.name}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, name: e.target.value })
                }
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
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, date: e.target.value })
                }
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
