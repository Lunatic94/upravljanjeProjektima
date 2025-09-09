// frontend/src/utils/dateValidation.js

/**
 * Validira da li je datum početka pre datuma završetka
 * @param {string} startDate - Datum početka u YYYY-MM-DD formatu
 * @param {string} endDate - Datum završetka u YYYY-MM-DD formatu
 * @returns {object} Objekat sa rezultatom validacije
 */
export const validateDateRange = (startDate, endDate) => {
  const result = {
    isValid: true,
    errors: {}
  };

  // Ako jedan od datuma nije unet, validacija prolazi
  if (!startDate || !endDate) {
    return result;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Proveravamo da li su datumi validni
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    result.isValid = false;
    result.errors.general = 'Nevalidni datumi';
    return result;
  }

  // Proveravamo da li je početak pre ili isti kao završetak
  if (start > end) {
    result.isValid = false;
    result.errors.endDate = 'Datum završetka mora biti nakon datuma početka';
  }

  return result;
};

/**
 * Formatira datum za HTML input type="date"
 * @param {string|Date} date - Datum za formatiranje
 * @returns {string} Formatiran datum u YYYY-MM-DD formatu
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toISOString().split('T')[0];
  } catch (error) {
    console.warn('Error formatting date:', error);
    return '';
  }
};

/**
 * Parsira datum iz HTML input type="date" formata
 * @param {string} dateString - Datum u YYYY-MM-DD formatu
 * @returns {Date|null} Date objekat ili null ako datum nije valjan
 */
export const parseDateFromInput = (dateString) => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    return null;
  }
};

/**
 * Proverava da li je datum u prošlosti
 * @param {string} dateString - Datum za proveru
 * @returns {boolean} True ako je datum u prošlosti
 */
export const isDateInPast = (dateString) => {
  if (!dateString) return false;
  
  const date = parseDateFromInput(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return date && date < today;
};

/**
 * Vraća razliku u danima između dva datuma
 * @param {string} startDate - Početni datum
 * @param {string} endDate - Krajnji datum  
 * @returns {number|null} Broj dana ili null ako datumi nisu validni
 */
export const getDaysDifference = (startDate, endDate) => {
  const start = parseDateFromInput(startDate);
  const end = parseDateFromInput(endDate);
  
  if (!start || !end) return null;
  
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Validira pojedinačni datum
 * @param {string} date - Datum za validaciju
 * @param {object} options - Opcije validacije
 * @returns {object} Rezultat validacije
 */
export const validateSingleDate = (date, options = {}) => {
  const {
    required = false,
    allowPast = true,
    allowFuture = true,
    minDate = null,
    maxDate = null
  } = options;

  const result = {
    isValid: true,
    error: null
  };

  // Ako datum nije unet i nije obavezan
  if (!date) {
    if (required) {
      result.isValid = false;
      result.error = 'Datum je obavezan';
    }
    return result;
  }

  const dateObj = parseDateFromInput(date);
  if (!dateObj) {
    result.isValid = false;
    result.error = 'Nevaljan datum';
    return result;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Provera prošlosti
  if (!allowPast && dateObj < today) {
    result.isValid = false;
    result.error = 'Datum ne može biti u prošlosti';
    return result;
  }

  // Provera budućnosti
  if (!allowFuture && dateObj > today) {
    result.isValid = false;
    result.error = 'Datum ne može biti u budućnosti';
    return result;
  }

  // Provera minimalnog datuma
  if (minDate) {
    const minDateObj = parseDateFromInput(minDate);
    if (minDateObj && dateObj < minDateObj) {
      result.isValid = false;
      result.error = `Datum mora biti nakon ${formatDateForInput(minDate)}`;
      return result;
    }
  }

  // Provera maksimalnog datuma
  if (maxDate) {
    const maxDateObj = parseDateFromInput(maxDate);
    if (maxDateObj && dateObj > maxDateObj) {
      result.isValid = false;
      result.error = `Datum mora biti pre ${formatDateForInput(maxDate)}`;
      return result;
    }
  }

  return result;
};

/**
 * Formatira datum za prikaz korisniku
 * @param {string|Date} date - Datum za formatiranje
 * @param {string} locale - Lokalizacija (default: 'sr-RS')
 * @returns {string} Formatiran datum
 */
export const formatDateForDisplay = (date, locale = 'sr-RS') => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.warn('Error formatting date for display:', error);
    return '';
  }
};