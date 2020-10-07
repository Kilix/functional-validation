// @flow
import pipe from 'ramda/src/pipe';
import memoizeWith from 'ramda/src/memoizeWith';
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

export type ValidationT<T, P: $ReadOnlyArray<any>> = (
    model: T,
    ...params: P
) => $ReadOnlyArray<ErrorT | MaybeErrorT> | MaybeErrorT;

export type ModelValidatorT<T, P: $ReadOnlyArray<any> = []> = (
    model: T,
    ...params: P
) => $ReadOnlyArray<ErrorT>;
export type ValidationsT<T, P: $ReadOnlyArray<any>> = $ReadOnlyArray<ValidationT<T, P>>;

function isEqual(elem: Object) {
    const newElem = {
        ...elem,
        ...(elem.files ? { files: elem.files.map(({ name, size }) => ({ name, size })) } : {}),
        ...(elem.file ? { file: { name: elem.file.name, size: elem.file.size } } : {}),
    };

    return JSON.stringify(newElem);
}
function validateModel<T, P: $ReadOnlyArray<any>>(
    validations: ValidationsT<T, P>,
): ModelValidatorT<T, P> {
    return memoizeWith(isEqual, (model: T, ...params: P): $ReadOnlyArray<ErrorT> =>
        pipe(map(validation => validation(model, ...params)), flatten, filter(Boolean))(
            validations,
        ),
    );
}

export default validateModel;
