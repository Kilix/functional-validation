// @flow
import R from 'ramda';
import type { ErrorT } from './validateModel';

const getFieldError = (errors: $ReadOnlyArray<ErrorT>) => (field: string): $ReadOnlyArray<string> =>
    errors.filter(R.propEq('field', field)).map(R.prop('error'));

const getFieldSpecificErrors = (
    errors: $ReadOnlyArray<ErrorT>,
    fieldName: string,
): $ReadOnlyArray<ErrorT> =>
    errors.filter(({ field, error }) => field === fieldName && error !== 'missing');

const fieldHasSpecificErrors: (
    errors: $ReadOnlyArray<ErrorT>,
    fieldName: string,
) => boolean = R.pipe(getFieldSpecificErrors, R.isEmpty, R.not);

export { fieldHasSpecificErrors, getFieldError, getFieldSpecificErrors };
