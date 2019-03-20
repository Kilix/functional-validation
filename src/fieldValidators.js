// @flow
import curry from 'ramda/src/curry';

/**
  * @desc Test if a value is ok for a required field.
  * If the field has a formattedAddress key, it's a location, so we make sure that this key is set.
  * If field is an array, check length.
  * @param {Any} field - The value of the field
  * @return {bool} True if the value is falsy
  */
const testMissingValue = (field: any): string | null =>
    (!field && field !== false) || field.length === 0 || field.formattedAddress === null
        ? 'missing'
        : null;

/**
  * @desc Check if a date is after the given date
  * @param {Date|moment} date - The date to test
  * @param {Date|moment} limit - The reference date
  * @return {string} "before" if the date is before the limit, and both are specified, null if not
  */
type DateT = string | Date | any; // Also handle moment objects, or object with a valueOf
const getDate = (date: DateT) => new Date(date.valueOf ? date.valueOf() : date);
type DatesT = { date: ?DateT, limit: ?DateT };
const testDateAfter = ({ date, limit }: DatesT) =>
    !date || !limit || getDate(date) - getDate(limit) > 0 ? null : 'before';

/**
  * @desc Check if a date is before the given date
  * @param {Date|moment} date - The date to test
  * @param {Date|moment} limit - The reference date
  * @return {string} "after" if the date is after the limit, and both are specified, null if not
  */
const testDateBefore = ({ date, limit }: DatesT) =>
    !date || !limit || getDate(date) - getDate(limit) < 0 ? null : 'after';

/**
  * @desc Test if a value is greater than another
  * @param {Number} value - The value to test
  * @param {Number} min - The value to be greater than
  * @return {string} 'smaller' if the value is smaller, null if not
  */
type GreaterThanT = { value: ?(string | number), min: ?(string | number) };
const testGreaterThan = ({ value, min }: GreaterThanT) =>
    value == null || min == null || Number(value) >= Number(min) ? null : 'smaller';

/**
  * @desc Test if a value is only letters
  * @param {String} value - The value to test
  * @return {?string} 'notOnlyLetters' if any character is not a letter, null if not
  */
const testOnlyLetters = (value: ?string) =>
    !value || /^[a-zA-Z]+$/.test(value) ? null : 'notOnlyLetters';

/**
  * @desc Test if a string or an array has the proper length
  * @param {String|Array} value - The value to test
  * @param {Number} length - The length
  * @return {?string} 'wrongLength' if the item doesn't have the specified length, null if it has
  */
const testLength = curry(
    (length, value) => (!value || !length || value.length === length ? null : 'wrongLength'),
);

/**
  * @desc Test if a value is a valid email address
  * @param {?string} value - The value of the field
  * @return {?string} 'notEmail' if the value is not a valid email address, null if it is
  */
const testEmailFormat = (value: ?string) => {
    if (!value) return null;

    const regexp = /^((([a-z]|\d|[!#$%&'*+\-\/=?^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#$%&'*+\-\/=?^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
    const regexpAccent = /[[àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ]/i;
    return regexp.test(value.trim()) && !regexpAccent.test(value.trim()) ? null : 'notEmail';
};

/**
  * @desc Test an array or a string's max length
  * @param {?string|Array} value - The array or string
  * @return {?string} 'wrongLength' if the value is too long, null if it is correct
  */
const checkMaxLength = curry(
    (maxLength: number, input: ?string) =>
        (typeof input !== 'string' && !Array.isArray(input)) || input.length <= maxLength
            ? null
            : 'wrongLength',
);

/**
  * @desc Test if a number is contained between two others (included)
  * @param {number} min - The lower bound (exluded)
  * @param {number} max - The upper bound (excluded)
  * @param {?number} value - The value to test
  * @return {?string} 'input' if the value is outside of the boundaries, null if not
  */
const isBetween = curry(
    (min: number, max: number, input: ?number) =>
        typeof input === 'number' && (input < min || input > max) ? 'wrongValue' : null,
);

export {
    testDateAfter,
    testDateBefore,
    testGreaterThan,
    testMissingValue,
    testOnlyLetters,
    testLength,
    checkMaxLength,
    testEmailFormat,
    isBetween,
};
