// @flow
import R from 'ramda';

import createValidation from './createValidation';
import { testMissingValue } from './fieldValidators';
import type { ErrorT } from './validateModel';
import type { CreateSimpleValidation, CreateNestedValidation } from './types';

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
