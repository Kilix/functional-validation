// @flow
/* eslint-disable */
import {
    validateModel,
    createValidation,
    createSimpleValidation,
    type ErrorT,
    getFieldError,
    getFieldSpecificErrors,
    fieldHasSpecificErrors,
    runConditionalValidation,
    validateRequired,
    type ModelValidatorT,
    createNestedValidation,
} from '../index';

type UserModel = { id: number, name?: string, value: ?string, person: { name: string } };
const userModel: UserModel = {
    id: 2,
    name: 'John',
    value: null,
    person: { name: 'Plop' },
};

// $FlowFixMe
validateModel();

const validateName = createValidation('name', user => user.name, name => (name ? 'missing' : null));
// $FlowFixMe
const validateAge = createValidation('age', user => user.age, age => (age ? 'missing' : null));
const validateCheckPropTyping = createValidation(
    'value',
    user => user.value,
    // $FlowFixMe
    value => (value.length ? null : 'missing'),
);

const validateSimpleName = createSimpleValidation(name => (name ? null : 'missing'), 'name');

// $FlowFixMe
const validateSimpleAge = createSimpleValidation(age => (age ? null : 'missing'), 'age');

const correctConditional = runConditionalValidation(({ name }) => !!name && name.length > 0, [
    validateName,
]);
// $FlowFixMe
const wrongConditional = runConditionalValidation(({ value }) => value.length > 0, [validateName]);

const conditionalWithGoodValidations = runConditionalValidation(() => true, [validateName]);

const validateCorrectRequired = validateRequired('name');
// $FlowFixMe
const validateWrongRequired = validateRequired('age');

const isNameMissing = name => (name.length > 0 ? null : 'missing');
const nestedValidation = createNestedValidation(isNameMissing, ['person', 'name']);

// $FlowFixMe
const wrongNestedValidation = createNestedValidation(isNameMissing, 'person.name');

const validateUser: ModelValidatorT<UserModel> = validateModel([
    validateName,
    validateAge,
    validateSimpleName,
    validateSimpleAge,
    validateCheckPropTyping,
    correctConditional,
    wrongConditional,
    conditionalWithGoodValidations,
    validateCorrectRequired,
    validateWrongRequired,
    nestedValidation,
    wrongNestedValidation,
]);

validateUser(userModel);

const errors = [{ field: 'id', error: 'missing' }];
// $FlowFixMe
const fieldErrors: $ReadOnlyArray<number> = getFieldError(errors)('id');
// $FlowFixMe
const wrongTypeSpecificErrors: $ReadOnlyArray<number> = getFieldSpecificErrors(errors, 'id');
const specificErrors: $ReadOnlyArray<ErrorT> = getFieldSpecificErrors(errors, 'id');
// $FlowFixMe
const wrongHasError: number = fieldHasSpecificErrors(errors, 'id');
const hasError: boolean = fieldHasSpecificErrors(errors, 'id');

// TODO
// Mismatch between ValidationT & ModelValidator?
// const conditionalWithWrongValidations: ModelValidatorT<UserModel> = runConditionalValidation(
//     () => true,
//     [validateAge],
// );

// Not sure there's a way to retrieve the type of value
// const simpleValidationWithTypedValidator = createSimpleValidation(
//     value => value.length > 0 ? null : 'missing',
//     'value',
// );
