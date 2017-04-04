import createValidation from '../createValidation';

describe('createValidation', () => {
    it('should create a model validator with a field validator and a field getter', () => {
        const equalsA = name => name !== 'a' ? 'notA' : null;
        const getName = model => model.name;

        const validateName = createValidation('name', getName, equalsA);
        expect(validateName({})).toEqual({ field: 'name', error: 'notA' });
        expect(validateName({ name: 'a' })).toEqual(null);
    });
});
