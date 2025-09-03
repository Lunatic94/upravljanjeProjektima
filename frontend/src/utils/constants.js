const API_BASE_URL = 'http://localhost:8080/api';

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MENADZER_PROJEKTA: 'MENADZER_PROJEKTA',
  PROGRAMER: 'PROGRAMER'
};

export const PROJECT_STATUS = {
  PLANIRANJE: 'PLANIRANJE',
  U_TOKU: 'U_TOKU',
  ZAVRSEN: 'ZAVRSEN',
  OTKAZAN: 'OTKAZAN'
};

export const TASK_STATUS = {
  TREBA_URADITI: 'TREBA_URADITI',
  U_TOKU: 'U_TOKU',
  NA_PREGLEDU: 'NA_PREGLEDU',
  ZAVRSENO: 'ZAVRSENO'
};

export const PRIORITY = {
  NIZAK: 'NIZAK',
  SREDNJI: 'SREDNJI',
  VISOK: 'VISOK',
  KRITICAN: 'KRITICAN'
};

export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: ['all'],
  [USER_ROLES.MENADZER_PROJEKTA]: ['view_all_users', 'create_project', 'manage_team'],
  [USER_ROLES.PROGRAMER]: ['view_assigned_tasks', 'update_task_status']
};