// @flow
import R from 'ramda';

import validateModel from './validateModel';
import type { ModelValidatorT, ValidationsT } from './validateModel';

function runConditionalValidation<T>(
    condition: (model: T) => boolean,
    validations: ValidationsT<T>,
): ModelValidatorT<T> {
    return R.ifElse(condition, validateModel(validations), () => []);
}

export default runConditionalValidation;
