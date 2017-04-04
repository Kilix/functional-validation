import { fieldHasSpecificErrors, getFieldError, getFieldSpecificErrors } from '../getFieldError';

describe('getFieldError', () => {
    it('should get the error', () => {
        const errors = [
            { field: 'name', error: 'tooShort' },
            { field: 'email', error: 'notEmail' },
        ];
        const getErrors = getFieldError(errors);
        expect(getErrors('name')).toEqual(['tooShort']);
    });

    it('should get the errors', () => {
        const errors = [{ field: 'name', error: 'tooShort' }, { field: 'name', error: 'notEmail' }];
        const getErrors = getFieldError(errors);
        expect(getErrors('name')).toEqual(['tooShort', 'notEmail']);
    });

    it('should return [] when no error', () => {
        const getErrors = getFieldError([]);
        expect(getErrors('name')).toEqual([]);
    });
});

it('getFieldSpecificErrors', () => {
    const errors = [
        { field: 'name', error: 'tooShort' },
        { field: 'email', error: 'bla' },
        { field: 'email', error: 'missing' },
        { field: 'email', error: 'notEmail' },
    ];
    const actual = getFieldSpecificErrors(errors, 'email');
    const expected = [{ field: 'email', error: 'bla' }, { field: 'email', error: 'notEmail' }];
    expect(actual).toEqual(expected);
});

it('fieldHasSpecificErrors', () => {
    const errors = [
        { field: 'name', error: 'tooShort' },
        { field: 'email', error: 'bla' },
        { field: 'email', error: 'missing' },
        { field: 'email', error: 'notEmail' },
    ];
    let actual = fieldHasSpecificErrors(errors, 'email');
    let expected = true;
    expect(actual).toBe(expected);

    actual = fieldHasSpecificErrors(errors, 'phone');
    expected = false;
    expect(actual).toBe(expected);
});
