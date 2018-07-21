// SurveyForm shows a user to add input
import _ from 'lodash';
import React, { Component } from 'react';
import {
  reduxForm,
  Field
} from 'redux-form'; /* Similar to connect helper which will give access to redux store for the form elements */
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields';

class SurveyForm extends Component {
  /* To add any props to our custom SurvetField Component, we can pass props to Field */
  /* In the Field, name is the key for storing in redux store */
  renderFields() {
    return _.map(formFields, ({ label, name }) => {
      return (
        <Field
          key={name}
          component={SurveyField}
          type="text"
          label={label}
          name={name}
        />
      );
    });
  }
  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}
          <Link to="/surveys" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  errors.recipients = validateEmails(values.recipients || '');

  _.each(formFields, ({ name }) => {
    if (!values[name]) {
      errors[name] = `You must provide a vaild ${name}`;
    }
  });

  return errors;
  /* If any of the attributes on the error object matches the field names, redux form will automatically pass the
  error as a prop to the (custom) field component */
}

export default reduxForm({
  validate,
  form: 'surveyForm',
  destroyOnUnmount: false
})(SurveyForm);
/* this.props.handleSubmit is a function which is provided by the reduxForm helper */
/* connect and reduxForms can manipulate the props */
