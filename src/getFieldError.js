// @flow
import type { ErrorT } from './validateModel';

// Returns a list of the error messages associated to a field
const getFieldError = (errors: $ReadOnlyArray<ErrorT>) => (field: string): $ReadOnlyArray<string> =>
    errors.filter(error => error.field === field).map(error => error.error);

// Returns true if a field has any error
const fieldHasErrors = (errors: $ReadOnlyArray<ErrorT>, name: string): boolean =>
    getFieldError(errors)(name).length > 0;

// Returns the errors associated to a field, skiping the "missing" errors
const getFieldSpecificErrors = (
    errors: $ReadOnlyArray<ErrorT>,
    fieldName: string,
): $ReadOnlyArray<ErrorT> =>
    errors.filter(({ field, error }) => field === fieldName && error !== 'missing');

// Returns true if a field has specific errors
const fieldHasSpecificErrors = (errors: $ReadOnlyArray<ErrorT>, fieldName: string): boolean =>
    getFieldSpecificErrors(errors, fieldName).length > 0;

export { fieldHasSpecificErrors, getFieldError, getFieldSpecificErrors, fieldHasErrors };
