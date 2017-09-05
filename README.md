# functional-validation

[![build status](https://travis-ci.org/Kilix/functional-validation.svg)](https://travis-ci.org/Kilix/functional-validation)
[![codecov coverage](https://codecov.io/gh/kilix/functional-validation/branch/master/graph/badge.svg)](https://codecov.io/gh/kilix/functional-validation)
[![npm](https://img.shields.io/npm/v/functional-validation.svg)](https://www.npmjs.com/package/@kilix/functional-validation)

Lightweight and customisable validation, built through composition.

## Why
Validation is complicated in JavaScript. The most common solution is to use a validator object-shaped, à la [joy](https://github.com/hapijs/joi) or [yup](https://github.com/jquense/yup). However, I find it mostly made to make it straightforward to write simple validation, more complicated ones need to use specific APIs. Since validation can also be seen as a list of validations `model -> ?error`, you don't need a highly abstract API to be able to run any kind of validation. Moreover, with little overhead, by composing functions, you can compose validations: a validator that validates an order can use another one that validates the validity of a product!

## How to use
There are two core functions, `validateModel: Array<Validation> => Model => Array<error>`, where `Validation: Model => Array<error> | ?error` and `createValidation : params => Model => ?error`. I'll come back later on the `createValidation` params, but you can observe that both the functions returned by `validateModel` and `createValidation` can used to create validations used by `validateModel`. Moreover, `createValidation` doesn't return anything really fancy, it just takes a given model, and can return an error. So you're always free to skip it if one of your validations is too complicated to work with out API (or if it makes it clearer to work without). This lets you use the same pattern (`model => ?error`, or `model => Array<error>`) for any kind of validation.

Here is a more concrete example:
```javascript
const validatorNewUser = validateModel([
  // This returns an error {field: 'age', error: 'underaged'} if model.age < 18
  createValidation(
    'age',  // used to be able to set the field value of the error
    model => model.age, // returns the part of the model that will be checked
    // checks the relevant part of the model
    // returns the name of the error as a string if there is one
    age => age >= 18 ? null : 'underaged',
  ),
]);
```

You can argue that using `createValidation` is pretty verbose (and you'd be right), however, you need to keep in mind that this library aiming for a more FPesque code style, `model => model.age` might already be declared somewhere else, and that checking if an age is underaged can be useful to validate other models. Moreover, we do provide you with several generic value validators.

Lastly, `createValidation` is the low-level validator, we have some higher-order ones, to avoid too-verbose validations:
```javascript
const validateAge = age => age >= 18 ? null : 'underaged';
// This is equivalent to the previous one, since it's that common to test a field without needing
// to use another key as the error name
createSimpleValidation('age', validateAge);

createNestedValidation('person.age', validateAge);
// is equivalent to
createValidation('person.age',  model => model.person.age, validateAge);

runConditionValidation(
  model => model.age < 18,
  [createSimpleValidation('authorisedByParents', authorised => authorised ? null : 'not')]
);
// is equivalent to
model => model.age < 18
  ? model.authorisedByParents ? null : 'not'
  : null;
```
