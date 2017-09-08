import createValidation from '../createValidation';

describe('createValidation', () => {
    it('should create a model validator with a field validator and a field getter', () => {
        const equalsA = name => (name !== 'a' ? 'notA' : null);
        const getName = model => model.name;

        const validateName = createValidation('name', getName, equalsA);
        expect(validateName({})).toEqual({ field: 'name', error: 'notA' });
        expect(validateName({ name: 'a' })).toEqual(null);
    });

    it('should forward extra parameters', () => {
        const getField = jest.fn(model => model);
        const validateField = jest.fn(() => null);
        const validate = createValidation('field', getField, validateField);
        validate({}, 1);
        expect(getField).toHaveBeenCalledWith({}, 1);
        expect(validateField).toHaveBeenCalledWith({}, 1);
    });
});
