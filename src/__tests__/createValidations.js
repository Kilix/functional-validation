import { createSimpleValidation, createNestedValidation } from '../createValidations';

describe('createSimpleValidation', () => {
    it('should use the fieldName to access the relevant part of the model', () => {
        const model = {
            name: 'Bla',
        };
        const simpleValidation = createSimpleValidation(field => field === 'Bla', 'name');
        expect(simpleValidation(model)).toEqual({ error: true, field: 'name' });
        expect(simpleValidation({ name: 'Bluh' })).toEqual(null);
    });

    it('should forward the parameters to the fieldValidator', () => {
        const fieldValidator = jest.fn();
        const simpleValidation = createSimpleValidation(fieldValidator, 'name');
        simpleValidation({ name: 'john' }, 1, false);
        expect(fieldValidator).toHaveBeenCalledWith('john', 1, false);
    });
});

it('createNestedValidation', () => {
    const model = {
        person: {
            name: 'Bla',
        },
    };
    const nestedValidation = createNestedValidation(field => field === 'Bla', ['person', 'name']);
    expect(nestedValidation(model)).toEqual({ error: true, field: 'person.name' });
    expect(nestedValidation({ person: { name: 'Bluh' } })).toEqual(null);
});
