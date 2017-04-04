// @flow
import R from 'ramda';

export type ErrorT = { field: string, error: string };
type MaybeErrorT = ErrorT | null;
export type ValidationT<T> = (model: T) => Array<ErrorT> | Array<MaybeErrorT> | MaybeErrorT;
export type ValidationsT<T> = Array<ValidationT<T>>;
export type ModelValidatorT<T> = (model: T) => Array<ErrorT>;

const validateModel = <T>(validations: ValidationsT<T>): ModelValidatorT<T> =>
    R.memoize((model: T): Array<ErrorT> =>
        R.pipe(R.map(validation => validation(model)), R.flatten, R.filter(Boolean))(validations));

export default validateModel;
