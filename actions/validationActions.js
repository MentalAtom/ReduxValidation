const CREATE_VALIDATED_FORM = 'CREATE_VALIDATED_FORM'
const FORM_FIELD_CHANGE = 'FORM_FIELD_CHANGE'
const FORM_VALIDATE = 'FORM_VALIDATE'
const FORM_FOCUS = 'FORM_FIELD_FOCUS'
const FORM_TOUCH_ALL = 'FORM_TOUCH_ALL'
const FORM_VALIDATE_SINGLE = 'FORM_VALIDATE_SINGLE'
const FORM_VALIDATE_START = 'FORM_VALIDATE_START'
const FORM_VALIDATE_COMPLETE = 'FORM_VALIDATE_COMPLETE'

export function createForm (name, fields) {
  return {
    type: CREATE_VALIDATED_FORM,
    form: name,
    fields: fields
  }
}

export function onChange (form, name, value) {
  return {
    type: FORM_FIELD_CHANGE,
    form: form,
    field: name,
    value: value
  }
}

export function onValidate (form, fields) {
  return {
    type: FORM_VALIDATE,
    form: form,
    fields: fields
  }
}

export function validateSingle (form, field, error) {
  return {
    type: FORM_VALIDATE_SINGLE,
    form: form,
    field: field,
    error: error
  }
}

export function onFocus (form, name) {
  return {
    type: FORM_FOCUS,
    form: form,
    field: name
  }
}

export function touchAll (form) {
  return {
    type: FORM_TOUCH_ALL,
    form: form
  }
}

export function validationStart (form) {
  return {
    type: FORM_VALIDATE_START,
    form: form
  }
}

export function validationComplete (form) {
  return {
    type: FORM_VALIDATE_COMPLETE,
    form: form
  }
}
