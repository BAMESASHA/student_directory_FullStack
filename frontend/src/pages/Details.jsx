import { useParams, useNavigate } from 'react-router-dom';
import { getStudentById } from '../services/api';

export default function Details({ students }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = getStudentById(students, id);

  if (!student) {
    return (
      <div className="not-found">
        <h2>😕 No Scholar in sight</h2>
        <br />
        <button className="btn-primary" onClick={() => navigate('/list')}>
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="details-page">
      <button className="back-btn" onClick={() => navigate('/list')}>
        ← Back to Directory
      </button>

      <div className="profile-card">
        <div className="profile-header">
          <img src={student.avatar} alt={student.name} className="profile-avatar" />
          <div className="profile-title">
            <h2>{student.name}</h2>
            <span className="profile-id">{student.studentId}</span>
            <span className="profile-badge">{student.major}</span>
          </div>
        </div>

        <div className="profile-body">
          <div className="profile-section">
            <div className="section-label">💜 About</div>
            <p>{student.bio || 'No bio provided.'}</p>
          </div>

          <div className="profile-grid">
            <div className="profile-item">
              <label>Year</label>
              <span>{student.year}</span>
            </div>
            <div className="profile-item">
              <label>GPA</label>
              <span>⭐ {student.gpa}</span>
            </div>
            <div className="profile-item">
              <label>Email</label>
              <span>{student.email}</span>
            </div>
            <div className="profile-item">
              <label>Phone</label>
              <span>{student.phone}</span>
            </div>
          </div>

          <div className="profile-section">
            <div className="section-label">📚 Enrolled Courses</div>
            <div className="courses-list">
              {student.courses && student.courses.map((course, i) => (
                <span key={i} className="course-tag">{course}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}