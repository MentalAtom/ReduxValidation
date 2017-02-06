import React, { PropTypes } from 'react'
import {
  createForm,
  onChange,
  onValidate,
  onFocus,
  touchAll,
  validateSingle,
  validationStart,
  validationComplete
} from '../actions/validationActions'

import { connect } from 'react-redux'

export default function createValidatedForm (Component, fields, validation, getDefaultValues) {

  if (!Component.displayName) {
    console.error('Component given to validatedForm does not have .displayName - Quitting as bad things will happen')
    return false
  }

  class ValidatedForm extends React.Component {
    constructor (props) {
      super()
      this.state = {
        isSubmitting: false
      }

      this.onBlur = this.onBlur.bind(this)
      this.onFocus = this.onFocus.bind(this)
      this.onChange = this.onChange.bind(this)
      this.onSubmit = this.onSubmit.bind(this)
      this.getFieldValues = this.getFieldValues.bind(this)
      this.displayErrorsFromServer = this.displayErrorsFromServer.bind(this)
      this.focusFirstInvalidField = this.focusFirstInvalidField.bind(this)
      this.afterValidate = this.afterValidate.bind(this)
    }

    focusFirstInvalidField () {
      let firstInvalidField = null

      Object.keys(this.props.fields).forEach((field) => {
        if (this.props.fields[field].error && !firstInvalidField) { firstInvalidField = field }
      })

      if (firstInvalidField) {
        document.querySelector(`[name=${firstInvalidField}]`).focus()
      }
    }

    componentWillMount () {
      let childFields = {}
      fields.forEach((f) => {
        childFields[f] = {
          name: f,
          onBlur: this.onBlur.bind(this),
          onFocus: this.onFocus.bind(this),
          onChange: this.onChange.bind(this),
          value: getDefaultValues && getDefaultValues[f] ? getDefaultValues[f](this.props) || '' : '',
          touched: false,
          isValidating: false
        }
      })

      this.initialFields = childFields
      this.context.store.dispatch(createForm(Component.displayName, childFields))
    }

    getFieldValues () {
      const values = {}

      Object.keys(this.props.fields).forEach((f) => {
        values[f] = this.props.fields[f].value
      })

      return values
    }

    onBlur (e) {
      if (e.target.value !== '') {
        const fieldError = validation(this.getFieldValues())[e.target.name]
        this.context.store.dispatch(validateSingle(Component.displayName, e.target.name, fieldError))
      }
    }

    onFocus (e) {
      this.context.store.dispatch(onFocus(Component.displayName, e.target.name))
    }

    onChange (e) {
      const mainAction = (e) => {
        const fieldName = e.target.name

        this.context.store.dispatch(onChange(Component.displayName, fieldName, e.target.value))

        if (this.props.fields[fieldName].touched && this.props.fields[fieldName].error) {
          const errors = validation(this.getFieldValues())

          if (typeof errors === 'object' && typeof errors.then === 'function') {
            errors.then((errors) => {
              console.log(errors)
              this.context.store.dispatch(validateSingle(Component.displayName, fieldName, errors[fieldName]))
            })
          } else {
            this.context.store.dispatch(validateSingle(Component.displayName, fieldName, errors[fieldName]))
          }
        }
      }

      if (typeof e === 'function') {
        return function changeHandler (event) {
          e(event)
          mainAction(event)
        }
      }

      mainAction(e)
    }

    onSubmit (handler) {
      return function submitHandler (e) {
        e.preventDefault()
        const values = this.getFieldValues()
        const validationErrors = validation(values)

        this.context.store.dispatch(validationStart(Component.displayName))

        if (typeof validationErrors === 'object' && typeof validationErrors.then === 'function') {
          validationErrors.then((errors) => {
            this.afterValidate(Component.displayName, errors, handler)
          })
        } else {
          this.afterValidate(Component.displayName, validationErrors, handler)
        }
      }.bind(this)
    }

    afterValidate (name, errors, handler) {
      this.context.store.dispatch(touchAll(name))
      this.context.store.dispatch(onValidate(name, errors))
      this.focusFirstInvalidField()

      this.context.store.dispatch(validationComplete(Component.displayName))

      if (!Object.keys(errors).length) {
        handler()
      }
    }

    displayErrorsFromServer (errors) {
      this.context.store.dispatch(onValidate(Component.displayName, errors))
    }

    render () {
      return <Component ref='form' {...this.props}
        fields={this.props.fields || this.initialFields}
        onSubmit={this.onSubmit}
        getFieldValues={this.getFieldValues}
        displayErrorsFromServer={this.displayErrorsFromServer}
        isSubmitting={this.state.isSubmitting}
        isValidating={this.props.isValidating} />
    }
  }

  ValidatedForm.propTypes = {
    fields: PropTypes.object,
    store: PropTypes.object,
    isValidating: PropTypes.bool
  }

  ValidatedForm.contextTypes = {
    store: PropTypes.object
  }

  return connect((state) => {
    const form = state.formState[Component.displayName]
    return {
      fields: form,
      isValidating: form ? form.isValidating : false
    }
  }, null, null, {
    withRef: true,
    pure: false
  })(ValidatedForm)
}
