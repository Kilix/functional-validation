import {
    testMissingValue,
    // testDateAfter,
    testGreaterThan,
    testOnlyLetters,
    testLength,
    testEmailFormat,
} from '../fieldValidators';

it('testMissingValue', () => {
    let actual = testMissingValue('aha');
    let expected = null;
    expect(actual).toBe(expected);

    actual = testMissingValue(null);
    expected = 'missing';
    expect(actual).toBe(expected);

    actual = testMissingValue([]);
    expected = 'missing';
    expect(actual).toBe(expected);

    actual = testMissingValue({ formattedAddress: null });
    expected = 'missing';
    expect(actual).toBe(expected);
});

// it.skip('testDateAfter', () => {
//     let actual = testDateAfter({ date: '2017-02-14', limit: '2017-02-12' });
//     let expected = null;
//     expect(actual).toBe(expected);

//     actual = testDateAfter({ date: '2017-02-14', limit: null });
//     expected = null;
//     expect(actual).toBe(expected);

//     actual = testDateAfter({ date: null, limit: null });
//     expected = null;
//     expect(actual).toBe(expected);

//     actual = testDateAfter({ date: null, limit: '2017-02-12' });
//     expected = null;
//     expect(actual).toBe(expected);

//     actual = testDateAfter({ date: '2017-02-14', limit: '2017-02-27' });
//     expected = 'before';
//     expect(actual).toBe(expected);
// });

it('testGreaterThan', () => {
    let actual = testGreaterThan({ value: 12, min: 0 });
    let expected = null;
    expect(actual).toBe(expected);

    actual = testGreaterThan({ value: 12, min: 15 });
    expected = 'smaller';
    expect(actual).toBe(expected);

    actual = testGreaterThan({ value: null, min: null });
    expected = null;
    expect(actual).toBe(expected);

    actual = testGreaterThan({ value: null, min: 2 });
    expected = null;
    expect(actual).toBe(expected);

    actual = testGreaterThan({ value: 12, min: null });
    expected = null;
    expect(actual).toBe(expected);
});

it('testOnlyLetters', () => {
    let actual = testOnlyLetters();
    let expected = null;
    expect(actual).toBe(expected);

    actual = testOnlyLetters('assqs');
    expected = null;
    expect(actual).toBe(expected);

    actual = testOnlyLetters('12a');
    expected = 'notOnlyLetters';
    expect(actual).toBe(expected);

    actual = testOnlyLetters('');
    expected = null;
    expect(actual).toBe(expected);
});

it('testLength', () => {
    let actual = testLength(3, 'BFO');
    let expected = null;
    expect(actual).toBe(expected);

    actual = testLength(3, 'BFOR');
    expected = 'wrongLength';
    expect(actual).toBe(expected);

    actual = testLength(3, undefined);
    expected = null;
    expect(actual).toBe(expected);

    actual = testLength(null, 'BFO');
    expected = null;
    expect(actual).toBe(expected);
});

it('testEmailFormat', () => {
    let actual = testEmailFormat('alefevre@kilix.fr');
    let expected = null;
    expect(actual).toBe(expected);

    actual = testEmailFormat('Bob');
    expected = 'notEmail';
    expect(actual).toBe(expected);

    actual = testEmailFormat(null);
    expected = null;
    expect(actual).toBe(expected);
});
