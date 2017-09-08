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

export type ValidationT<T, P: Array<any>> = (
    model: T,
    ...params: P
) => $ReadOnlyArray<ErrorT | MaybeErrorT> | MaybeErrorT;

export type ModelValidatorT<T, P: Array<any>> = (model: T, ...params: P) => $ReadOnlyArray<ErrorT>;
export type ValidationsT<T, P> = $ReadOnlyArray<ValidationT<T, P>>;

function validateModel<T, P>(validations: ValidationsT<T, P>): ModelValidatorT<T, P> {
    return memoize((model: T, ...params: P): $ReadOnlyArray<ErrorT> =>
        pipe(map(validation => validation(model, ...params)), flatten, filter(Boolean))(
            validations,
        ),
    );
}

export default validateModel;
