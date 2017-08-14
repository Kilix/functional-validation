// @flow
import pipe from 'ramda/src/pipe';
import memoize from 'ramda/src/memoize';
import flattenR from 'ramda/src/flatten';
import mapR from 'ramda/src/map';
import filterR from 'ramda/src/filter';

// ramda flow-typed typings are not always correct, and use Array, while this library uses
// $ReadOnlyArray
const flatten: any = flattenR;
const map: any = mapR;
const filter: any = filterR;

export type ErrorT = { field: string, error: string };
type MaybeErrorT = ErrorT | null;

export type ValidationT<T> = (model: T) => $ReadOnlyArray<ErrorT | MaybeErrorT> | MaybeErrorT;

export type ModelValidatorT<T> = (model: T) => $ReadOnlyArray<ErrorT>;
export type ValidationsT<T> = $ReadOnlyArray<ValidationT<T>>;

function validateModel<T>(validations: ValidationsT<T>): ModelValidatorT<T> {
    return memoize((model: T): $ReadOnlyArray<ErrorT> =>
        pipe(map(validation => validation(model)), flatten, filter(Boolean))(validations),
    );
}

export default validateModel;
