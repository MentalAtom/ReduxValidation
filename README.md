# redux-lightweight-validation

Form Validation with Redux and a single Higher Order Component

## Installation
`npm install redux-lightweight-validation`

## Usage
Add the reducer for the form state into your reducer, with a key of formState
````javascript
import { validationReducer } from 'redux-lightweight-validation'

const store = createStore(combineReducers({
  /* Your reducers */
  formState: validationReducer
})
````

Add a variable for the fields for your form - This variable must contain all the fields that will be validated.
````javascript
const FIELDS = ['username', 'password']
````

Add a validation method for your form e.g. a required field
````javascript
const validate = (fields) => {
  const errors = {}

  if (!fields.username) {
    errors.username = "The username field is required!"
  }

  return errors
}
````

Now - Wrap your component in validatedForm, using the fields and validate method
````javascript
import { ValidatedForm as validatedForm } from 'redux-lightweight-validation'

export default validatedForm(Component, FIELDS, validate)
````

We're all set, now you just have to use the fields and bind onSubmit - For example:
````javascript
class ExampleForm extends React.Component {
  submit () {
    // Do submission
  }

  render () {
    const { username, password } = this.props.fields

    return <form onSubmit={this.props.onSubmit(this.submit)}>
      <input type="text" {...username} />
      <input type="password" {...password} />

      <button type="submit">Submit!</button>
    </form>
  }
}
````

### Error Handling
When a field fails to validate, it will gain an "error" key on its field prop. This will contain whatever you returned from the validate method (probably a string)

````javascript
class ExampleForm extends React.Component {
  submit () {
    // Do submission
  }

  render () {
    const { username, password } = this.props.fields

    return <form onSubmit={this.props.onSubmit(this.submit)}>
      <input type="text" {...username} />
      {username.error && <span className="error">{username.error}</span>}

      <button type="submit">Submit!</button>
    </form>
  }
}
````

Alternatively, you could spread the props onto a custom component which when given an error prop would automatically gain the correct styling.

### Async Validation
If the validate method returns a promise, the validation will not be displayed until the promise has resolved (e.g. an ajax call)

If the submit method returns a promise, the form will fire this when it is submitted successfully. There are 2 props to control this:

| Prop          | Purpose       |
| ------------- | ------------- |
| isValidating  | True if form is currently pending a response from a Promise which was returned from the validate method.  |
| isSubmitting  | True if form is currently pending a response from a Promise which was returned from the submit method.  |


