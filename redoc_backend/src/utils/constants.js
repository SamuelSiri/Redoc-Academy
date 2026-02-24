const ROLES = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN',
};

const FILE_TYPES = {
  PDF: 'PDF',
  VIDEO: 'VIDEO',
  IMAGE: 'IMAGE',
  DOCUMENT: 'DOCUMENT',
  OTHER: 'OTHER',
};

const COURSE_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
};

const ENROLLMENT_STATUS = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  DROPPED: 'DROPPED',
};

const DIFFICULTY = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
};

const MESSAGE_STATUS = {
  SENT: 'SENT',
  READ: 'READ',
};

const VISIBILITY = {
  PUBLIC: 'PUBLIC',
  ENROLLED: 'ENROLLED',
  PRIVATE: 'PRIVATE',
};

const ALLOWED_MIMES = [
  'application/pdf',
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  'video/mp4', 'video/mpeg', 'video/webm', 'video/quicktime',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain', 'text/csv',
  'application/zip', 'application/x-rar-compressed',
];

const MIME_TO_FILE_TYPE = {
  'application/pdf': FILE_TYPES.PDF,
  'image/jpeg': FILE_TYPES.IMAGE,
  'image/png': FILE_TYPES.IMAGE,
  'image/gif': FILE_TYPES.IMAGE,
  'image/webp': FILE_TYPES.IMAGE,
  'image/svg+xml': FILE_TYPES.IMAGE,
  'video/mp4': FILE_TYPES.VIDEO,
  'video/mpeg': FILE_TYPES.VIDEO,
  'video/webm': FILE_TYPES.VIDEO,
  'video/quicktime': FILE_TYPES.VIDEO,
  'application/msword': FILE_TYPES.DOCUMENT,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FILE_TYPES.DOCUMENT,
  'application/vnd.ms-excel': FILE_TYPES.DOCUMENT,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FILE_TYPES.DOCUMENT,
  'application/vnd.ms-powerpoint': FILE_TYPES.DOCUMENT,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': FILE_TYPES.DOCUMENT,
  'text/plain': FILE_TYPES.DOCUMENT,
  'text/csv': FILE_TYPES.DOCUMENT,
};

module.exports = {
  ROLES, FILE_TYPES, COURSE_STATUS, ENROLLMENT_STATUS, DIFFICULTY,
  MESSAGE_STATUS, VISIBILITY, ALLOWED_MIMES, MIME_TO_FILE_TYPE,
};
