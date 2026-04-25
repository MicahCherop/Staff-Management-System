export type UserRole = 'admin' | 'manager' | 'staff';
export type UserStatus = 'active' | 'exited';
export type AttendanceStatus = 'present' | 'absent' | 'leave';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type VacancyStatus = 'open' | 'closed';

export interface User {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  branch: string;
  jobTitle: string;
  status: UserStatus;
  joinedAt: string;
  exitDate?: string;
  exitedReason?: string;
}

export interface Attendance {
  id: string;
  userId: string;
  userName?: string;
  date: string;
  status: AttendanceStatus;
  timeIn?: string;
  timeOut?: string;
  branch: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName?: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  branch: string;
  createdAt: string;
}

export interface Vacancy {
  id: string;
  title: string;
  branch: string;
  description: string;
  status: VacancyStatus;
  postedAt: string;
}

export interface Placement {
  id: string;
  vacancyId: string;
  candidateName: string;
  status: 'offered' | 'hired' | 'rejected';
  placementDate: string;
  branch: string;
}
