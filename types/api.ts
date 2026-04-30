/**
 * API Response & Entity Types for LMS Melesat
 *
 * Type definitions matching the selaju-system backend API responses.
 * Keep in sync with backend models and API resources.
 */

// ── Base Types ──────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  current_page?: number;
  last_page?: number;
  per_page?: number;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email?: string;
  nisn?: string;
  nip?: string;
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
  nisn?: string;
  nip?: string;
  photo?: string;
  school?: string;
}

// ── LMS Entities ─────────────────────────────────────────────────────────────

export interface School {
  id: string;
  name: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Generation {
  id: string;
  name: string;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export interface Teacher {
  id: string;
  name: string;
  nip: string;
  email?: string;
  phone?: string;
  school_id?: string;
  school?: School;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  name: string;
  nisn: string;
  email?: string;
  phone?: string;
  school_id?: string;
  generation_id?: string;
  school?: School;
  generation?: Generation;
  created_at: string;
  updated_at: string;
}

export interface Classroom {
  id: string;
  name: string;
  level: string;
  major?: string;
  teacher_id?: string;
  teacher?: Teacher;
  students?: Student[];
  students_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  type?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  name: string;
  capacity?: number;
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
}

export interface Material {
  id: string;
  title: string;
  description?: string;
  file_path?: string;
  file_name?: string;
  file_size?: number;
  link?: string;
  schedule_id?: string;
  schedule?: Schedule;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  schedule_id: string;
  student_id: string;
  status: "present" | "absent" | "late" | "excused";
  date: string;
  notes?: string;
  schedule?: Schedule;
  student?: Student;
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

// ── Component Props ──────────────────────────────────────────────────────────

export interface ScheduleCardProps {
  id: string;
  title: string;
  time: string;
  location: string;
  subject: string;
  color: string;
}

export interface MaterialCardProps {
  id: string;
  title: string;
  subject: string;
  date: string;
  type: "PDF" | "Link" | "Video";
}
