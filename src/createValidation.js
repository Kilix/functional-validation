// @flow
import R from 'ramda';

import type { ErrorT } from './validateModel';

function createValidation<M, T>(
    field: string,
    getField: (model: M) => T,
    validateField: (field: T) => string | null,
): (M) => ErrorT | null {
    return R.pipe(getField, validateField, R.when(Boolean, error => ({ field, error })));
}

export default createValidation;
