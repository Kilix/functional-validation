// @flow
import type { ErrorT } from './validateModel';

const getFieldError = (errors: $ReadOnlyArray<ErrorT>) => (field: string): $ReadOnlyArray<string> =>
    errors.filter(error => error.field === field).map(error => error.error);

const getFieldSpecificErrors = (
    errors: $ReadOnlyArray<ErrorT>,
    fieldName: string,
): $ReadOnlyArray<ErrorT> =>
    errors.filter(({ field, error }) => field === fieldName && error !== 'missing');

const fieldHasSpecificErrors = (errors: $ReadOnlyArray<ErrorT>, fieldName: string): boolean =>
    getFieldSpecificErrors(errors, fieldName).length > 0;

export { fieldHasSpecificErrors, getFieldError, getFieldSpecificErrors };
