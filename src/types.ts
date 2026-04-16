export type UserRole = 'admin' | 'guru' | 'staf';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export interface Student {
  id: string;
  nis: string;
  name: string;
  class_name: string;
  created_at: string;
}

export interface Attendance {
  id: string;
  user_id?: string;
  student_id?: string;
  type: 'employee' | 'student';
  status: 'present' | 'absent' | 'late' | 'excused';
  date: string;
  notes?: string;
  created_at: string;
}
