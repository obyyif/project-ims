/**
 * API Response & Entity Types for LMS Melesat
 * Keep in sync with selaju-system backend models.
 */

// ── Base Types ───────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: UserRole;
  user: UserData;
}

export type UserRole = "teacher" | "student" | "super_admin";

export interface UserData {
  id: string;
  name: string;
  email?: string;
  username?: string;
  nisn?: string;
  nip?: string;
  photo?: string;
}

// ── LMS Entities ─────────────────────────────────────────────────────────────

export interface School {
  id: string;
  name: string;
  address?: string;
}

export interface Generation {
  id: string;
  name: string;
  is_current: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  nip: string;
  account_id?: string;
  account?: { name: string; email?: string };
  school?: School;
}

export interface Student {
  id: string;
  name: string;
  student_number?: string;
  national_id?: string;
  gender?: "L" | "P";
  school?: School;
}

export interface Classroom {
  id: string;
  name: string;
  level?: string;
  major?: string;
  group_number?: string;
  slug?: string;
  academic_year?: string;
  teacher?: Teacher;
  students?: Student[];
  students_count?: number;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  type?: string;
  description?: string;
}

export interface Room {
  id: string;
  name: string;
  building?: string;
  capacity?: number;
}

export interface Schedule {
  id: string;
  classroom_id: string;
  subject_id: string;
  teacher_id: string;
  room_id?: string;
  day: string;
  start_time: string;
  end_time: string;
  classroom: Classroom;
  subject: Subject;
  teacher: Teacher;
  room?: Room;
}

export type MaterialCategory = "document" | "image" | "video" | "other";

export interface CourseMaterial {
  id: string;
  title: string;
  description?: string;
  file_path?: string;
  file_url?: string;
  download_url?: string;
  subtitle_url?: string;
  original_filename?: string;
  file_size?: number;
  file_type?: string;
  category: MaterialCategory;
  is_published: boolean;
  teacher?: Teacher;
  classroom?: Classroom;
  schedule?: Schedule;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  schedule_id: string;
  student_id: string;
  status: AttendanceStatus;
  date: string;
  schedule?: Schedule;
  student?: Student;
}

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

// ── Assignments ──────────────────────────────────────────────────────────────

export type AssignmentType = "homework" | "project" | "exam" | "quiz";
export type SubmissionStatus = "pending" | "submitted" | "graded" | "late";

export interface Assignment {
  id: number;
  teacher_id: string;
  classroom_id: string;
  subject_id: string;
  title: string;
  description?: string;
  due_date: string;
  max_score: number;
  type: AssignmentType;
  is_published: boolean;
  submissions_count?: number;
  my_status?: SubmissionStatus;
  subject?: Subject;
  classroom?: Classroom;
  teacher?: Teacher;
  created_at: string;
  updated_at: string;
}

export interface AssignmentSubmission {
  id: number;
  assignment_id: number;
  student_id: string;
  file_path?: string;
  original_filename?: string;
  file_size?: number;
  notes?: string;
  score?: number;
  status: SubmissionStatus;
  submitted_at?: string;
  graded_at?: string;
  student?: Student;
  assignment?: Assignment;
}

// ── Announcements ────────────────────────────────────────────────────────────

export type AnnouncementPriority = "normal" | "important" | "urgent";

export interface Announcement {
  id: number;
  author_id: string;
  classroom_id?: string;
  title: string;
  body: string;
  priority: AnnouncementPriority;
  is_pinned: boolean;
  author?: { username?: string; email?: string };
  classroom?: Classroom;
  created_at: string;
  updated_at: string;
}

// ── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStat {
  label: string;
  value: string | number;
  sub: string;
  color: string;
  bg: string;
  icon: string;
}
