// @flow
import type { ErrorT } from './validateModel';

type Validation = (value: *) => string | null;

type _CreateSimpleValidation1 = <M>(
    validation: Validation,
) => (field: $Keys<M>) => M => ErrorT | null;
type _CreateSimpleValidation2 = <M>(validation: Validation, field: $Keys<M>) => M => ErrorT | null;

export type CreateSimpleValidation = _CreateSimpleValidation1 & _CreateSimpleValidation2;

type _CreateNestedValidation1 = <M>(
    validation: Validation,
) => (path: $ReadOnlyArray<string>) => M => ErrorT | null;
type _CreateNestedValidation2 = <M>(
    validation: Validation,
    path: $ReadOnlyArray<string>,
) => M => ErrorT | null;
export type CreateNestedValidation = _CreateNestedValidation1 & _CreateNestedValidation2;
