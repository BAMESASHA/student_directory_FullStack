import { useNavigate } from 'react-router-dom';

export default function StudentCard({ student }) {
  const navigate = useNavigate();

  return (
    <div className="student-card" onClick={() => navigate(`/details/${student.id}`)}>
      <div className="card-top">
        <div className="card-avatar">
          <img src={student.avatar} alt={student.name} />
        </div>
        <div className="card-info">
          <div className="card-name">{student.name}</div>
          <div className="card-id">{student.studentId}</div>
        </div>
      </div>

      <div className="card-major">{student.major}</div>

      <div className="card-footer">
        <span className="card-year">{student.year}</span>
        <span className="card-gpa">GPA {student.gpa} ⭐</span>
      </div>

      <span className="card-arrow">→</span>
    </div>
  );
}