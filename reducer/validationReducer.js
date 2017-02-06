const validationStore = (state, action) => {

  if (action.type === 'CREATE_VALIDATED_FORM') {
    const newObj = {}
    newObj[action.form] = {}
    Object.keys(action.fields).forEach((field) => {
      newObj[action.form][field] = action.fields[field]
    })
    return Object.assign({}, state, newObj)
  }

  if (action.type === 'FORM_FIELD_CHANGE') {
    const newFormValues = Object.assign({}, state)
    newFormValues[action.form][action.field].value = action.value

    return Object.assign({}, state, newFormValues)
  }

  if (action.type === 'FORM_FIELD_FOCUS') {
    const newFormValues = Object.assign({}, state)
    newFormValues[action.form][action.field].touched = true

    return Object.assign({}, state, newFormValues)
  }

  if (action.type === 'FORM_VALIDATE') {
    const newFormValues = Object.assign({}, state)

    Object.keys(newFormValues[action.form]).filter((f) => {
      return newFormValues[action.form][f].hasOwnProperty('value')
    }).forEach((f) => {
      newFormValues[action.form][f].error = action.fields[f]
    })

    return Object.assign({}, state, newFormValues)
  }

  if (action.type === 'FORM_VALIDATE_SINGLE') {
    const newFormValues = Object.assign({}, state)

    newFormValues[action.form][action.field].error = action.error

    return Object.assign({}, state, newFormValues)
  }

  if (action.type === 'FORM_TOUCH_ALL') {
    const newFormValues = Object.assign({}, state)

    Object.keys(newFormValues[action.form]).filter((f) => {
      return newFormValues[action.form][f].hasOwnProperty('value')
    }).forEach((f) => {
      newFormValues[action.form][f].touched = true
    })

    return Object.assign({}, state, newFormValues)
  }

  if (action.type === 'FORM_VALIDATE_START') {
    const newFormValues = Object.assign({}, state)
    newFormValues[action.form].isValidating = true
    return Object.assign({}, state, newFormValues)
  }

  if (action.type === 'FORM_VALIDATE_COMPLETE') {
    const newFormValues = Object.assign({}, state)
    newFormValues[action.form].isValidating = false
    return Object.assign({}, state, newFormValues)
  }

  return state || {}
}

export default validationStore
