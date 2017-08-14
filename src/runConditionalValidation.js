// @flow
import validateModel from './validateModel';
import type { ModelValidatorT, ValidationsT } from './validateModel';

function runConditionalValidation<T>(
    condition: (model: T) => boolean,
    validations: ValidationsT<T>,
): ModelValidatorT<T> {
    return (model: T) => (condition(model) ? validateModel(validations)(model) : []);
}

export default runConditionalValidation;
