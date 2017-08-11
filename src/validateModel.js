// @flow
import R from 'ramda';

export type ErrorT = { field: string, error: string };
type MaybeErrorT = ErrorT | null;

export type ValidationT<T> = (model: T) => $ReadOnlyArray<ErrorT | MaybeErrorT> | MaybeErrorT;

export type ModelValidatorT<T> = (model: T) => $ReadOnlyArray<ErrorT>;
export type ValidationsT<T> = $ReadOnlyArray<ValidationT<T>>;

function validateModel<T>(validations: ValidationsT<T>): ModelValidatorT<T> {
    return R.memoize((model: T): $ReadOnlyArray<ErrorT> =>
        R.pipe(R.map(validation => validation(model)), R.flatten, R.filter(Boolean))(validations),
    );
}

export default validateModel;
