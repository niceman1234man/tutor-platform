export default function AssignedStudents() {
  const [assignedStudents, setAssignedStudents] = useState([]);

  useEffect(() => {
    const fetchAssignedStudents = async () => {
      try {
        const response = await API.get("/admin/students/assigned");
        setAssignedStudents(response.data);
      } catch (error) {
        console.error("Error fetching assigned students:", error);
      }
    };

    fetchAssignedStudents();
  }, []);

  return (
    <div className="assigned-students">
      <h2>Assigned Students</h2>
      {assignedStudents.length === 0 ? (
        <p>No students have been assigned to tutors yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Email</th>
              <th>Assigned Tutor</th>
            </tr>
          </thead>
          <tbody>
            {assignedStudents.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.tutorName || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}