import { useState } from 'react';
import StudentCard from '../components/StudentCard';

export default function List({ students }) {
  const [search, setSearch] = useState('');
  const [filterMajor, setFilterMajor] = useState('All');

  const majors = ['All', ...new Set(students.map((s) => s.major))];

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.major.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase());
    const matchMajor = filterMajor === 'All' || s.major === filterMajor;
    return matchSearch && matchMajor;
  });

  return (
    <div className="list-page">
      <div className="list-header">
        <h2>🎓 Scholar Directory</h2>
        <span className="list-count">{filtered.length} scholar{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="list-controls">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search by name, major or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterMajor}
          onChange={(e) => setFilterMajor(e.target.value)}
        >
          {majors.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span>😕</span>
          <p>No scholars in sight.</p>
        </div>
      ) : (
        <div className="student-grid">
          {filtered.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </div>
  );
}