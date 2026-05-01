import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MAJORS = [
  'Computer Science', 'Information Systems',
  'Software Engineering', 'Cybersecurity', 'Data Science',
];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function AddItem({ onAdd }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', studentId: '', major: '', year: '',
    gpa: '', email: '', phone: '', bio: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.studentId.trim()) e.studentId = 'Student ID is required.';
    if (!form.major) e.major = 'Please select a major.';
    if (!form.year) e.year = 'Please select a year.';
    if (!form.gpa || isNaN(form.gpa) || form.gpa < 0 || form.gpa > 4)
      e.gpa = 'GPA must be between 0 and 4.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address.';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onAdd(form);
    setSubmitted(true);
    setTimeout(() => navigate('/list'), 2000);
  };

  if (submitted) {
    return (
      <div className="success-screen">
        <span className="success-icon">🎉</span>
        <h2>Scholar Popped In!</h2>
        <p>Redirecting to the directory...</p>
      </div>
    );
  }

  return (
    <div className="add-page">
      <div className="form-container">
        <div className="form-header">
          <span className="form-header-emoji">✨</span>
          <h2>Pop a Scholar In</h2>
          <p>Fill in all required fields to register a new student</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Amara Diallo" />
              {errors.name && <span className="error">⚠ {errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Student ID *</label>
              <input name="studentId" value={form.studentId} onChange={handleChange} placeholder="e.g. STU-006" />
              {errors.studentId && <span className="error">⚠ {errors.studentId}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Major *</label>
              <select name="major" value={form.major} onChange={handleChange}>
                <option value="">Select major...</option>
                {MAJORS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              {errors.major && <span className="error">⚠ {errors.major}</span>}
            </div>
            <div className="form-group">
              <label>Year *</label>
              <select name="year" value={form.year} onChange={handleChange}>
                <option value="">Select year...</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              {errors.year && <span className="error">⚠ {errors.year}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>GPA *</label>
              <input name="gpa" value={form.gpa} onChange={handleChange} placeholder="0.0 – 4.0" type="number" min="0" max="4" step="0.1" />
              {errors.gpa && <span className="error">⚠ {errors.gpa}</span>}
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="student@uni.edu" type="email" />
              {errors.email && <span className="error">⚠ {errors.email}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Phone *</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="+267 7X XXX XXX" />
            {errors.phone && <span className="error">⚠ {errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Bio (optional)</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} placeholder="A little something about this scholar..." />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/list')}>Cancel</button>
            <button type="submit" className="btn-primary">✨ Pop a Scholar In!</button>
          </div>
        </form>
      </div>
    </div>
  );
}