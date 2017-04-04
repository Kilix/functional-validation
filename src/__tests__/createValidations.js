import { createSimpleValidation, createNestedValidation } from '../createValidations';

it('createSimpleValidation', () => {
    const model = {
        name: 'Bla',
    };
    const simpleValidation = createSimpleValidation(field => field === 'Bla', 'name');
    expect(simpleValidation(model)).toEqual({ error: true, field: 'name' });
    expect(simpleValidation({ name: 'Bluh' })).toEqual(false);
});

it('createNestedValidation', () => {
    const model = {
        person: {
            name: 'Bla',
        },
    };
    const nestedValidation = createNestedValidation(field => field === 'Bla', ['person', 'name']);
    expect(nestedValidation(model)).toEqual({ error: true, field: 'person.name' });
    expect(nestedValidation({ person: { name: 'Bluh' } })).toEqual(false);
});
