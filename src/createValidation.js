// @flow
import pipe from 'ramda/src/pipe';
import whenR from 'ramda/src/when';

import type { ErrorT } from './validateModel';

// ramda flow-typed typings are not always correct, and use Array, while this library uses
// $ReadOnlyArray
const when: any = whenR;

function createValidation<M, T>(
    field: string,
    getField: (model: M) => T,
    validateField: (field: T) => string | null,
): M => ErrorT | null {
    return pipe(getField, validateField, when(Boolean, error => ({ field, error })));
}

export default createValidation;
