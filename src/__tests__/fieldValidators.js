import {
    testMissingValue,
    testDateAfter,
    testDateBefore,
    testGreaterThan,
    testOnlyLetters,
    testLength,
    testEmailFormat,
    testLinkedInUrlFormat,
    checkMaxLength,
    isBetween,
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

    actual = testMissingValue(false);
    expected = null;
    expect(actual).toBe(expected);

    actual = testMissingValue(' ');
    expected = 'missing';
    expect(actual).toBe(expected);
});

it('testDateAfter', () => {
    let actual = testDateAfter({ date: '2017-02-14', limit: '2017-02-12' });
    let expected = null;
    expect(actual).toBe(expected);

    actual = testDateAfter({ date: '2017-02-14', limit: null });
    expected = null;
    expect(actual).toBe(expected);

    actual = testDateAfter({ date: null, limit: null });
    expected = null;
    expect(actual).toBe(expected);

    actual = testDateAfter({ date: null, limit: '2017-02-12' });
    expected = null;
    expect(actual).toBe(expected);

    actual = testDateAfter({ date: '2017-02-14', limit: '2017-02-27' });
    expected = 'before';
    expect(actual).toBe(expected);
});

it('testDateBefore', () => {
    let actual = testDateBefore({ date: '2017-02-14', limit: '2017-02-12' });
    let expected = 'after';
    expect(actual).toBe(expected);

    actual = testDateBefore({ date: '2017-02-14', limit: null });
    expected = null;
    expect(actual).toBe(expected);

    actual = testDateBefore({ date: null, limit: null });
    expected = null;
    expect(actual).toBe(expected);

    actual = testDateBefore({ date: null, limit: '2017-02-12' });
    expected = null;
    expect(actual).toBe(expected);

    actual = testDateBefore({ date: '2017-02-14', limit: '2017-02-27' });
    expected = null;
    expect(actual).toBe(expected);
});

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
    let actual = testEmailFormat('hassan@cehef.fr');
    let expected = null;
    expect(actual).toBe(expected);

    actual = testEmailFormat('Bob');
    expected = 'notEmail';
    expect(actual).toBe(expected);

    actual = testEmailFormat(null);
    expected = null;
    expect(actual).toBe(expected);

    actual = testEmailFormat('hàssàan@céhéf.fr');
    expected = 'notEmail';
    expect(actual).toBe(expected);
});

describe('testLinkedInUrlFormat', () => {
    it('Should return notLinkedInUrl error message if param is not an url', () => {
        const actual = testLinkedInUrlFormat('Bob');
        expect(actual).toBe('notLinkedInUrl');
    });
    it('Should return notLinkedInUrl error message if url has not http', () => {
        const actual = testLinkedInUrlFormat('www.linkedin.com/in/url-test/');
        expect(actual).toBe('notLinkedInUrl');
    });
    it('Should return notLinkedInUrl error message if http is badly written', () => {
        let actual = testLinkedInUrlFormat('htps://www.linkedin.com/in/url-test/');
        expect(actual).toBe('notLinkedInUrl');

        actual = testLinkedInUrlFormat('https//www.linkedin.com/in/url-test/');
        expect(actual).toBe('notLinkedInUrl');

        actual = testLinkedInUrlFormat('https:www.linkedin.com/in/url-test/');
        expect(actual).toBe('notLinkedInUrl');
    });
    it('Should return notLinkedInUrl error message if dns is different of linkedIn dns', () => {
        let actual = testLinkedInUrlFormat('https://www.linkedinsss.com/in/url-test/');
        expect(actual).toBe('notLinkedInUrl');

        actual = testLinkedInUrlFormat('https://wwwddd.linkedin.com/in/url-test/');
        expect(actual).toBe('notLinkedInUrl');

        actual = testLinkedInUrlFormat('https://www.linkedin.fr/in/url-test/');
        expect(actual).toBe('notLinkedInUrl');
    });
    it('Should return notLinkedInUrl error message if url has not /in/', () => {
        const actual = testLinkedInUrlFormat('https://www.linkedin.com/on/url-test/');
        expect(actual).toBe('notLinkedInUrl');
    });
    it('Should return null if url format is correct', () => {
        // with number in end of the url
        let actual = testLinkedInUrlFormat('https://www.linkedin.com/in/99erest/');
        expect(actual).toBe(null);

        // without www.
        actual = testLinkedInUrlFormat('https://linkedin.com/in/url-test/');
        expect(actual).toBe(null);

        // with special chars in end of the url
        actual = testLinkedInUrlFormat(
            'https://www.linkedin.com/in/%E2?9A=9B&+_#-test-url-716a96119/',
        );
        expect(actual).toBe(null);
    });
});

describe('checkMaxLength', () => {
    const isMaxTwoOfLength = checkMaxLength(2);
    it('should work with strings', () => {
        expect(isMaxTwoOfLength('aa')).toBe(null);
        expect(isMaxTwoOfLength('aaa')).toBe('wrongLength');
    });
    it('should work with arrays', () => {
        expect(isMaxTwoOfLength([0, 1])).toBe(null);
        expect(isMaxTwoOfLength([0, 1, 2])).toBe('wrongLength');
    });
    it('should not return an error for an empty value', () => {
        expect(isMaxTwoOfLength(null)).toBe(null);
    });
});

it('isBetween', () => {
    const isBetweenZeroAndTen = isBetween(0, 10);

    expect(isBetweenZeroAndTen(2)).toBe(null);
    expect(isBetweenZeroAndTen(0)).toBe(null);
    expect(isBetweenZeroAndTen(10)).toBe(null);
    expect(isBetweenZeroAndTen(-1)).toBe('wrongValue');
    expect(isBetweenZeroAndTen(11)).toBe('wrongValue');
    expect(isBetweenZeroAndTen(null)).toBe(null);
});
