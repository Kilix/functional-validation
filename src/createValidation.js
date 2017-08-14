// @flow
import Ramda from 'ramda';

import type { ErrorT } from './validateModel';

// ramda flow-typed typings are not always correct, and use Array, while this library uses
// $ReadOnlyArray
const R: any = Ramda;

function createValidation<M, T>(
    field: string,
    getField: (model: M) => T,
    validateField: (field: T) => string | null,
): M => ErrorT | null {
    return R.pipe(getField, validateField, R.when(Boolean, error => ({ field, error })));
}

export default createValidation;
