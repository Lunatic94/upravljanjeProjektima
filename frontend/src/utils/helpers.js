export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('sr-RS');
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('sr-RS');
};

export const getStatusColor = (status, type = 'project') => {
  if (type === 'project') {
    const colors = {
      'U_TOKU': '#2196f3',
      'ZAVRSEN': '#4caf50',
      'PLANIRANJE': '#ff9800',
      'OTKAZAN': '#f44336'
    };
    return colors[status] || '#757575';
  } else if (type === 'task') {
    const colors = {
      'TREBA_URADITI': '#9c27b0',
      'U_TOKU': '#2196f3',
      'NA_PREGLEDU': '#ff5722',
      'ZAVRSENO': '#4caf50'
    };
    return colors[status] || '#757575';
  }
  return '#757575';
};

export const getPriorityColor = (prioritet) => {
  const colors = {
    'NIZAK': '#4caf50',
    'SREDNJI': '#ff9800',
    'VISOK': '#f44336',
    'KRITICAN': '#9c27b0'
  };
  return colors[prioritet] || '#757575';
};

export const getStatusText = (status, type = 'project') => {
  if (type === 'project') {
    const statusMap = {
      'U_TOKU': 'U toku',
      'ZAVRSEN': 'Završen',
      'PLANIRANJE': 'Planiranje',
      'OTKAZAN': 'Otkazan'
    };
    return statusMap[status] || status;
  } else if (type === 'task') {
    const statusMap = {
      'TREBA_URADITI': 'Treba uraditi',
      'U_TOKU': 'U toku',
      'NA_PREGLEDU': 'Na pregledu',
      'ZAVRSENO': 'Završeno'
    };
    return statusMap[status] || status;
  }
  return status;
};

export const getPriorityText = (prioritet) => {
  const priorityMap = {
    'NIZAK': 'Nizak',
    'SREDNJI': 'Srednji',
    'VISOK': 'Visok',
    'KRITICAN': 'Kritičan'
  };
  return priorityMap[prioritet] || prioritet;
};

export const getRoleText = (uloga) => {
  const roleMap = {
    'ROLE_ADMIN': 'Administrator',
    'ADMIN': 'Administrator',
    'ROLE_MENADZER_PROJEKTA': 'Menadžer Projekta',
    'MENADZER_PROJEKTA': 'Menadžer Projekta',
    'ROLE_PROGRAMER': 'Programer',
    'PROGRAMER': 'Programer'
  };
  return roleMap[uloga] || uloga;
};

export const canUserPerformAction = (userRole, action) => {
  const permissions = {
    'ROLE_ADMIN': ['all'],
    'ROLE_MENADZER_PROJEKTA': ['create_project', 'manage_users', 'assign_tasks'],
    'ROLE_PROGRAMER': ['view_tasks', 'update_task_status']
  };
  
  const userPermissions = permissions[userRole] || [];
  return userPermissions.includes('all') || userPermissions.includes(action);
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const calculateDaysUntilDeadline = (deadline) => {
  if (!deadline) return null;
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const timeDiff = deadlineDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
};

export const isTaskOverdue = (deadline) => {
  const daysLeft = calculateDaysUntilDeadline(deadline);
  return daysLeft !== null && daysLeft < 0;
};