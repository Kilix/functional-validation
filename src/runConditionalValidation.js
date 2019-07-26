// @flow
import validateModel from './validateModel';
import type { ModelValidatorT, ValidationsT } from './validateModel';

function runConditionalValidation<T, P: $ReadOnlyArray<any>>(
    condition: (model: T, ...params: P) => boolean,
    validations: ValidationsT<T, P>,
): ModelValidatorT<T, P> {
    return (model: T, ...params: P) =>
        condition(model, ...params) ? validateModel(validations)(model, ...params) : [];
}

export default runConditionalValidation;
