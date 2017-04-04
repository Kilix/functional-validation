// @flow
import R from 'ramda';

import createValidation from './createValidation';
import { testMissingValue } from './fieldValidators';

const createNestedValidation = R.curry((validateField: () =>
    | string
    | null, fieldPath: Array<string>) =>
    createValidation(fieldPath.join('.'), R.path(fieldPath), validateField));

// TODO Fix typing because of curry
const createSimpleValidation = R.curry((validateField: () => string | null, field: string) =>
    createValidation(field, R.prop(field), validateField));

const validateRequired = createSimpleValidation(testMissingValue);
const validateNestedRequired = createNestedValidation(testMissingValue);

export { createNestedValidation, createSimpleValidation, validateRequired, validateNestedRequired };
