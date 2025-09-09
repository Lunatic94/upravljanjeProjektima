// frontend/src/hooks/useFormValidation.js

import { useState, useCallback } from 'react';
import { validateDateRange } from '../utils/dateValidation';

/**
 * Custom hook za validaciju forme
 * @param {object} initialValues - Početne vrednosti forme
 * @param {function} validationRules - Funkcija koja definiše pravila validacije
 * @returns {object} Objekat sa stanjem i funkcijama za validaciju
 */
export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validacija cele forme
  const validateForm = useCallback((formValues = values) => {
    const validationErrors = validationRules(formValues);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [values, validationRules]);

  // Validacija pojedinačnog polja
  const validateField = useCallback((fieldName, value = values[fieldName]) => {
    const testValues = { ...values, [fieldName]: value };
    const validationErrors = validationRules(testValues);
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: validationErrors[fieldName]
    }));
    
    return !validationErrors[fieldName];
  }, [values, validationRules]);

  // Menjanje vrednosti polja
  const setValue = useCallback((fieldName, value) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Real-time validacija za datume
    if (fieldName === 'datumPocetka' || fieldName === 'datumZavrsetka') {
      const newValues = { ...values, [fieldName]: value };
      const validationErrors = validationRules(newValues);
      setErrors(prev => ({
        ...prev,
        datumPocetka: validationErrors.datumPocetka,
        datumZavrsetka: validationErrors.datumZavrsetka
      }));
    } else if (touched[fieldName]) {
      // Validacija za ostala polja ako su već "touched"
      validateField(fieldName, value);
    }
  }, [values, validateField, touched, validationRules]);

  // Označavanje polja kao "touched"
  const setFieldTouched = useCallback((fieldName, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: isTouched
    }));

    if (isTouched) {
      validateField(fieldName);
    }
  }, [validateField]);

  // Označavanje svih polja kao "touched"
  const setAllTouched = useCallback(() => {
    const allTouched = Object.keys(values).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {});
    setTouched(allTouched);
  }, [values]);

  // Reset forme
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Postavljanje novih vrednosti (za editing)
  const setFormValues = useCallback((newValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  }, []);

  // Helper funkcije
  const hasErrors = Object.keys(errors).some(key => errors[key]);
  const isFieldValid = (fieldName) => !errors[fieldName];
  const isFieldInvalid = (fieldName) => touched[fieldName] && errors[fieldName];

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    setAllTouched,
    validateForm,
    validateField,
    resetForm,
    setFormValues,
    hasErrors,
    isFieldValid,
    isFieldInvalid
  };
};

/**
 * Pravila validacije za projekte
 * @param {object} values - Vrednosti forme
 * @returns {object} Objekat sa greškama
 */
export const projekatValidationRules = (values) => {
  const errors = {};

  // Validacija naziva
  if (!values.naziv?.trim()) {
    errors.naziv = 'Naziv projekta je obavezan';
  } else if (values.naziv.length > 100) {
    errors.naziv = 'Naziv ne može biti duži od 100 karaktera';
  }

  // Validacija datuma
  const dateValidation = validateDateRange(values.datumPocetka, values.datumZavrsetka);
  if (!dateValidation.isValid) {
    Object.assign(errors, dateValidation.errors);
    if (dateValidation.errors.endDate) {
      errors.datumZavrsetka = dateValidation.errors.endDate;
    }
  }

  return errors;
};

/**
 * Pravila validacije za zadatke
 * @param {object} values - Vrednosti forme
 * @returns {object} Objekat sa greškama
 */
export const zadatakValidationRules = (values) => {
  const errors = {};

  // Validacija naslova
  if (!values.naslov?.trim()) {
    errors.naslov = 'Naslov zadatka je obavezan';
  } else if (values.naslov.length > 200) {
    errors.naslov = 'Naslov ne može biti duži od 200 karaktera';
  }

  // Validacija projekta
  if (!values.projekatId) {
    errors.projekatId = 'Projekat je obavezan';
  }

  // Validacija procenjenih sati
  if (values.procenjeniSati && values.procenjeniSati < 0) {
    errors.procenjeniSati = 'Procenjeni sati moraju biti pozitivni broj';
  }

  return errors;
};