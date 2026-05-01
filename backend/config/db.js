// ============================================================
// src/config/db.js — In-Memory Database (no SQL Server needed)
// ============================================================

let students = [
  {
    id: 1,
    name: "Debbie Bame",
    studentId: "STU-001",
    major: "Computer Science",
    year: "3rd Year",
    gpa: 3.8,
    email: "debbie.bame@uni.edu",
    phone: "+267 71 234 567",
    bio: "Passionate about machine learning and AI.",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Debbie%20Bame",
    courses: ["Data Structures", "Algorithms", "Machine Learning", "Web Development"],
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Lebo Mokoena",
    studentId: "STU-002",
    major: "Information Systems",
    year: "2nd Year",
    gpa: 3.5,
    email: "lebo.mokoena@uni.edu",
    phone: "+267 72 345 678",
    bio: "Interested in database systems and enterprise software.",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Lebo%20Mokoena",
    courses: ["Database Management", "Systems Analysis", "Business Computing"],
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "Thabo Sithole",
    studentId: "STU-003",
    major: "Software Engineering",
    year: "4th Year",
    gpa: 3.9,
    email: "thabo.sithole@uni.edu",
    phone: "+267 73 456 789",
    bio: "Final year student with fintech internship experience.",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Thabo%20Sithole",
    courses: ["Mobile Dev", "Software Architecture", "Cloud Computing"],
    createdAt: new Date(),
  },
  {
    id: 4,
    name: "Neo Kgositsile",
    studentId: "STU-004",
    major: "Cybersecurity",
    year: "1st Year",
    gpa: 3.6,
    email: "neo.kgositsile@uni.edu",
    phone: "+267 74 567 890",
    bio: "Enthusiastic about ethical hacking and digital forensics.",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Neo%20Kgositsile",
    courses: ["Intro to Security", "Programming I", "Networks"],
    createdAt: new Date(),
  },
  {
    id: 5,
    name: "Mpho Ramokgopa",
    studentId: "STU-005",
    major: "Data Science",
    year: "3rd Year",
    gpa: 3.7,
    email: "mpho.ramokgopa@uni.edu",
    phone: "+267 75 678 901",
    bio: "Data enthusiast working on a climate data research paper.",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Mpho%20Ramokgopa",
    courses: ["Statistics", "Python for Data Science", "Big Data"],
    createdAt: new Date(),
  },
];

let users = [];
let nextStudentId = 6;
let nextUserId = 1;

const db = {
  // ── USER METHODS ─────────────────────────────────────────
  getUserByEmail(email) {
    return users.find((u) => u.email === email) || null;
  },

  getUserById(id) {
    return users.find((u) => u.id === parseInt(id)) || null;
  },

  createUser(data) {
    const newUser = {
      id:        nextUserId++,
      name:      data.name,
      email:     data.email,
      password:  data.password,
      role:      data.role || "user",
      createdAt: new Date(),
    };
    users.push(newUser);
    return newUser;
  },

  // ── STUDENT METHODS ───────────────────────────────────────
  getAllStudents(search, major) {
    let result = [...students];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (st) =>
          st.name.toLowerCase().includes(s) ||
          st.major.toLowerCase().includes(s) ||
          st.studentId.toLowerCase().includes(s)
      );
    }
    if (major && major !== "All") {
      result = result.filter((st) => st.major === major);
    }
    return result;
  },

  getStudentById(id) {
    return students.find((s) => s.id === parseInt(id)) || null;
  },

  getStudentByStudentId(studentId) {
    return students.find((s) => s.studentId === studentId) || null;
  },

  createStudent(data) {
    const newStudent = {
      id:        nextStudentId++,
      name:      data.name,
      studentId: data.studentId,
      major:     data.major,
      year:      data.year,
      gpa:       parseFloat(data.gpa),
      email:     data.email,
      phone:     data.phone,
      bio:       data.bio || "",
      avatar:    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
      courses:   data.courses || [],
      createdAt: new Date(),
    };
    students.push(newStudent);
    return newStudent;
  },

  updateStudent(id, data) {
    const index = students.findIndex((s) => s.id === parseInt(id));
    if (index === -1) return null;
    students[index] = {
      ...students[index],
      name:    data.name    ?? students[index].name,
      major:   data.major   ?? students[index].major,
      year:    data.year    ?? students[index].year,
      gpa:     data.gpa     !== undefined ? parseFloat(data.gpa) : students[index].gpa,
      email:   data.email   ?? students[index].email,
      phone:   data.phone   ?? students[index].phone,
      bio:     data.bio     ?? students[index].bio,
      courses: data.courses ?? students[index].courses,
    };
    return students[index];
  },

  deleteStudent(id) {
    const index = students.findIndex((s) => s.id === parseInt(id));
    if (index === -1) return null;
    const deleted = students[index];
    students.splice(index, 1);
    return deleted;
  },
};

module.exports = db;