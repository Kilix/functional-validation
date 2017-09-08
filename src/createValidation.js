// @flow
import type { ErrorT } from './validateModel';

function createValidation<M, T, P: Array<any>>(
    field: string,
    getField: (model: M, ...params: P) => T,
    validateField: (field: T, ...params: P) => string | null,
): (model: M, ...params: P) => ErrorT | null {
    return function validation(model: M, ...params: P) {
        const fieldToValidate = getField(model, ...params);
        const error = validateField(fieldToValidate, ...params);
        return error ? { field, error } : null;
    };
}

export default createValidation;
