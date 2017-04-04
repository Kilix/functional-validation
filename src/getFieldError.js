// @flow
import R from 'ramda';
import type { ErrorT } from './validateModel';

const getFieldError = (errors: Array<ErrorT>) =>
    (field: string) => errors.filter(R.propEq('field', field)).map(R.prop('error'));

const getFieldSpecificErrors = (errors: Array<ErrorT>, fieldName: string) =>
    errors.filter(({ field, error }) => field === fieldName && error !== 'missing');

const fieldHasSpecificErrors = R.pipe(getFieldSpecificErrors, R.isEmpty, R.not);

export { fieldHasSpecificErrors, getFieldError, getFieldSpecificErrors };
