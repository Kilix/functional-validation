// @flow
import Ramda from 'ramda';

import createValidation from './createValidation';
import { testMissingValue } from './fieldValidators';
import type { ErrorT } from './validateModel';
import type { CreateSimpleValidation, CreateNestedValidation } from './types';

// ramda flow-typed typings are not always correct, and use Array, while this library uses
// $ReadOnlyArray
const R: any = Ramda;

const createNestedValidation: CreateNestedValidation = R.curry(
    (validateField: () => string | null, fieldPath: $ReadOnlyArray<string>) =>
        createValidation(fieldPath.join('.'), R.path(fieldPath), validateField),
);

const createSimpleValidation: CreateSimpleValidation = R.curry(
    (validateField: () => string | null, field: string) =>
        createValidation(field, R.prop(field), validateField),
);

type ValidateRequired = <T: Object>(field: $Keys<T>) => (model: T) => ErrorT | null;
const validateRequired: ValidateRequired = createSimpleValidation(testMissingValue);
const validateNestedRequired = createNestedValidation(testMissingValue);

export { createNestedValidation, createSimpleValidation, validateRequired, validateNestedRequired };
