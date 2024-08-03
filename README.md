# FormNativeValidator

FormNativeValidator v1.0.0

Autor: [Jhonatan Adriel Huaman Pintado]

Licencia: MIT

`FormNativeValidator` es una librería de JavaScript que facilita la validación de formularios en el lado del cliente. Permite definir reglas de validación personalizadas y utilizar la validación nativa del navegador para mostrar mensajes de error.

## Instalación

Puedes incluir `FormNativeValidator` en tu proyecto de dos maneras:

1. **Descarga el archivo JS y añádelo a tu proyecto:**

```html
<script src="path/to/FormNativeValidator.js"></script>
```

2. **Uso mediante módulos ES6:**

```javascript
import FormNativeValidator, { BuiltInValidators } from './path/to/FormNativeValidator';
```

## Uso

### Inicialización

Primero, selecciona el formulario que deseas validar y define las reglas de validación en un objeto de configuración.

```html
<form id="myForm">
  <input type="text" name="username" required>
  <input type="email" name="email" required>
  <button type="submit">Enviar</button>
</form>
```

```javascript
const form = document.querySelector('#myForm');

const formNativeValidator = new FormNativeValidator({
  fields: {
    username: {
      rules: [
        BuiltInValidators.notEmpty('El nombre de usuario es obligatorio.'),
        BuiltInValidators.minLength(3, 'El nombre de usuario debe tener al menos 3 caracteres.')
      ]
    },
    email: {
      rules: [
        BuiltInValidators.notEmpty('El correo electrónico es obligatorio.'),
        BuiltInValidators.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El correo electrónico no es válido.')
      ]
    }
  }
}, form);
```

### Constructor

```
new FormNativeValidator(config, form);
```

* `config`: Objeto de configuración que define las reglas de validación.
* `form`: Elemento del formulario que será validado.

### Callbacks

Puedes definir acciones a realizar cuando el formulario es válido o inválido usando los métodos `onValid` y `onInValid`.

* `onValid`: Se ejecuta cuando el formulario es válido.

* `onInValid`: Se ejecuta cuando el formulario es inválido. No funciona si `noValidate` es `false`.

```javascript
formNativeValidator
  .onValid((e, formData) => {
    // Lógica de éxito de validación
    console.log('Formulario enviado:', formData);
  })
  .onInValid((e, formData) => {
    // Lógica de error de validación
    console.log('Formulario inválido:', formData);
  });
```

### Desactivar `noValidate`

Por defecto, la librería establece `noValidate` en `true`. Puedes desactivar esta configuración para que la librería utilice la validación nativa del navegador.

```javascript
const form = document.querySelector('#myForm');
const formNativeValidator = new FormNativeValidator({
  fields: {
    username: {
      rules: [
        BuiltInValidators.notEmpty('El nombre de usuario es obligatorio.'),
        BuiltInValidators.minLength(3, 'El nombre de usuario debe tener al menos 3 caracteres.')
      ]
    }

    // Demas validaciones ....
  },
  noValidate: false // Desactivar `novalidate`
}, form);
```

**NOTA:** Al desactivar `noValidate`, vuelves a la validación predeterminada del navegador. Las reglas de validación siguen funcionando, pero no podrás utilizar el metodo `onInValid`.

### Validadores Incorporados

`FormNativeValidator` incluye varios validadores incorporados que puedes usar:

* `notEmpty(message)`: verifica que el campo no esté vacío.
* `minLength(length, message)`: Verifica que el campo tenga al menos una longitud específica.
* `maxLength(length, message)`: Verifica que el campo no exceda una longitud específica.
* `regex(pattern, message):` Verifica que el campo coincida con un patrón regex.
* `selectNotDefault(message)`: Verifica que se haya seleccionado una opción válida en un `<select>`.
* `fileSize(maxSize, message)`: Verifica que el tamaño del archivo no exceda un tamaño específico.

### Validadores Personalizados

Puedes agregar validadores personalizados usando la función customValidation.

```javascript
const customValidator = {
  test: (value) => value === 'custom',
  message: 'Este valor debe ser "custom".'
};

const formNativeValidator = new FormNativeValidator({
  fields: {
    customField: {
      rules: [
        BuiltInValidators.customValidation(customValidator.test, customValidator.message)
      ]
    }
  }
}, form);
```

### Ejemplo Completo
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FormNativeValidator Example</title>
</head>
<body>
  <form id="myForm">
    <label for="username">Username:</label>
    <input type="text" name="username" required>
    <label for="email">Email:</label>
    <input type="email" name="email" required>
    <button type="submit">Submit</button>
  </form>
  <script src="path/to/FormNativeValidator.js"></script>
  <script>
    const form = document.querySelector('#myForm');

    const formNativeValidator = new FormNativeValidator({
      fields: {
        username: {
          rules: [
            BuiltInValidators.notEmpty('El nombre de usuario es obligatorio.'),
            BuiltInValidators.minLength(3, 'El nombre de usuario debe tener al menos 3 caracteres.')
          ]
        },
        email: {
          rules: [
            BuiltInValidators.notEmpty('El correo electrónico es obligatorio.'),
            BuiltInValidators.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El correo electrónico no es válido.')
          ]
        }
      },
      noValidate: true
    }, form);

    formNativeValidator
      .onValid((e, formData) => {
        console.log('Formulario enviado exitosamente:', formData);
      })
      .onInValid((e, formData) => {
        console.log('Formulario inválido:', formData);
      });
  </script>
</body>
</html>
```

### Contribuciones

Las contribuciones son bienvenidas. Por favor, crea un issue o un pull request para contribuir.

### Licencia

Este proyecto está licenciado bajo la MIT Licence