// @flow
import curry from 'ramda/src/curry';
import pathR from 'ramda/src/path';

import createValidation from './createValidation';
import { testMissingValue } from './fieldValidators';
import type { ErrorT } from './validateModel';
import type { CreateSimpleValidation, CreateNestedValidation } from './types';

// ramda flow-typed typings are not always correct, and use Array, while this library uses
// $ReadOnlyArray
const path: any = pathR;

const createNestedValidation: CreateNestedValidation = curry(
    (validateField: () => string | null, fieldPath: $ReadOnlyArray<string>) =>
        createValidation(fieldPath.join('.'), path(fieldPath), validateField),
);

const createSimpleValidation: CreateSimpleValidation = curry(
    (validateField: () => string | null, field: string) =>
        createValidation(field, model => model[field], validateField),
);

type ValidateRequired = <T: Object>(field: $Keys<T>) => (model: T) => ErrorT | null;
const validateRequired: ValidateRequired = createSimpleValidation(testMissingValue);
const validateNestedRequired = createNestedValidation(testMissingValue);

export { createNestedValidation, createSimpleValidation, validateRequired, validateNestedRequired };
