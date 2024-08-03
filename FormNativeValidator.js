/*!
 * FormNativeValidator v1.0.0 (https://github.com/jhonatanhuaman76/FormNativeValidator)
 * Autor: [Jhonatan Adriel Huaman Pintado]
 * Licencia: MIT
 */

class FormNativeValidator {
  constructor(config, form) {
    this.config = config;
    this.form = form;
    this.onValidCallback = () => {};
    this.onInValidCallback = () => {};
    this.initializeValidation();
    this.form.noValidate = config.noValidate ?? true;
    this.form.addEventListener('submit', (e) => {
      this.handleFormSubmit(e);
    });
  }

  initializeValidation() {
    Object.keys(this.config.fields).forEach((fieldName) => {
      const field = this.form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        const validations = this.config.fields[fieldName].rules || [];
        if (field.type === 'radio' || field.type === 'checkbox' || field.tagName === 'SELECT') {
          field.addEventListener('change', () => this.validateField(field, validations));
        } else {
          field.addEventListener('input', () => this.validateField(field, validations));
        }
      } else {
        console.error(`El campo ${fieldName} no existe.`);
      }
    });
  }

  getFieldValue(field) {
    if (field.type === 'radio' || field.type === 'checkbox') {
      const selected = this.form.querySelector(`[name="${field.name}"]:checked`);
      return selected ? selected.value : '';
    } else if (field.tagName === 'SELECT') {
      return field.value;
    } else if (field.tagName === 'TEXTAREA') {
      return field.value;
    } else if (field.type === 'file') {
      return field.files;
    }
    return field.value;
  }

  validateField(field, validations) {
    const value = this.getFieldValue(field);
    let isValid = true;
    for (const validation of validations) {
      if (validation && typeof validation.test === 'function') {
        if (validation.test(value)) {
          field.setCustomValidity(validation.message || 'Invalid input');
          isValid = false;
          break;
        }
      } else {
        console.error(`La validación ${validation} no es una función de validación.`);
      }
    }

    if (isValid) {
      field.setCustomValidity('');
    }
    return isValid;
  }

  handleFormSubmit(e) {
    e.preventDefault();

    let isFormValid = true;
    Object.keys(this.config.fields).forEach((fieldName) => {
      const field = this.form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        const validations = this.config.fields[fieldName].rules || [];
        if (!this.validateField(field, validations)) {
          isFormValid = false;
        }
      }
    });

    const formData = new FormData(this.form);

    if (isFormValid && this.form.checkValidity()) {
      console.log('Form is valid, calling onValid callback');
      this.onValidCallback(e, formData);
    } else {
      console.log('Form is invalid, calling onInValid callback');
      this.onInValidCallback(e, formData);
      this.form.reportValidity(); // Mostrar errores de validación
    }
  }

  onValid(callback) {
    this.onValidCallback = callback;
    return this;
  }

  onInValid(callback) {
    this.onInValidCallback = callback;
    return this;
  }
}

// Definir validadores incorporados
const BuiltInValidators = {
  notEmpty: (message) => ({
    test: (value) => value.trim() === '',
    message: message || 'Este campo no puede estar vacío.',
  }),
  minLength: (length, message) => ({
    test: (value) => value.length < length,
    message: message || `Este campo debe tener al menos ${length} caracteres.`,
  }),
  maxLength: (length, message) => ({
    test: (value) => value.length > length,
    message: message || `Este campo no puede tener más de ${length} caracteres.`,
  }),
  regex: (pattern, message) => ({
    test: (value) => !pattern.test(value),
    message: message || 'El valor no es válido, debe coincidir con el formato indicado.',
  }),
  selectNotDefault: (message) => ({
    test: (value) => value === '',
    message: message || 'Debe seleccionar una opción válida.',
  }),
  fileSize: (maxSize, message) => ({
    test: (files) => Array.from(files).some((file) => file.size > maxSize),
    message: message || 'El archivo es demasiado grande.',
  }),
  // Agregar validadores personalizados
  customValidation: (testFn, message) => ({
    test: testFn,
    message: message || 'Error personalizado',
  }),
};

export { BuiltInValidators };
export default FormNativeValidator;

