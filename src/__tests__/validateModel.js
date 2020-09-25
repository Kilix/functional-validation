import validateModel from '../validateModel';
import createValidation from '../createValidation';
import { getFieldError } from '../getFieldError';

describe('validateModel', () => {
    it('should validate model without validations', () => {
        const model = {};
        const validations = [];
        expect(validateModel(validations)(model)).toEqual([]);
    });

    it('should run each validation', () => {
        const validation = jest.fn();
        const model = {};
        const validations = [validation];
        validateModel(validations)(model);
        expect(validation).toHaveBeenCalled();
        expect(validation).toHaveBeenCalledWith(model);
    });

    it('should not return an error if the model is valid', () => {
        const model = {};
        const validations = [() => null];
        expect(validateModel(validations)(model)).toEqual([]);
    });

    it('should return an error if the model is not valid', () => {
        const model = {};
        const validations = [formModel => (formModel.name ? null : { field: 'name', error: true })];
        expect(validateModel(validations)(model)).toEqual([{ field: 'name', error: true }]);
    });

    it('should memoize the validations', () => {
        const model = {};
        const validation = jest.fn(
            formModel => (formModel.name ? null : { field: 'name', error: true }),
        );
        const validations = [validation];
        const validateForm = validateModel(validations);
        expect(validateForm(model)).toEqual([{ field: 'name', error: true }]);
        expect(validateForm({})).toEqual([{ field: 'name', error: true }]);
        expect(validation).toHaveBeenCalledTimes(1);
        expect(validateForm({ name: 'brrra' })).toEqual([]);
        expect(validateForm({})).toEqual([{ field: 'name', error: true }]);
        expect(validation).toHaveBeenCalledTimes(2);
    });

    it('should not return cached data when the function is called with differents params', () => {
        const validation = jest.fn(formModel => {
            if (formModel.list) {
                return formModel.list.find(elem => elem.length >= 4)
                    ? { field: 'list', error: true }
                    : null;
            }
            if (formModel.files) {
                return formModel.files.reduce((a, b) => a + b.size, 0) > 4
                    ? { field: 'files', error: true }
                    : null;
            }
        });
        const validations = [validation];
        const validateForm = validateModel(validations);
        expect(validateForm({ list: [] })).toEqual([]);
        expect(validateForm({ list: ['bla'] })).toEqual([]);
        expect(validation).toHaveBeenCalledTimes(2);
        expect(validateForm({ list: ['bla'] })).toEqual([]);
        expect(validation).toHaveBeenCalledTimes(2); // should still have been called 2 times
        expect(validateForm({ list: ['aLongWord'] })).toEqual([{ field: 'list', error: true }]);
        expect(validateForm({ list: ['aLongWord', 'lol'] })).toEqual([
            { field: 'list', error: true },
        ]);
        expect(validateForm({ list: ['blablaCrous', 'li'] })).toEqual([
            { field: 'list', error: true },
        ]);
        expect(validateForm({ list: ['foo', 'ta'] })).toEqual([]); // works for 2 elems
        expect(validateForm({ files: [{ type: 'text/plain', size: 1 }, { size: 1 }] })).toEqual([]);
        expect(validateForm({ files: [{ type: 'text/plain', size: 40 }, { size: 1 }] })).toEqual([
            { field: 'files', error: true },
        ]);
        expect(validation).toHaveBeenCalledTimes(8);
    });

    it('should pass any extra parameter to the validations', () => {
        const model = {};
        const validation = jest.fn(() => null);
        const validateForm = validateModel([validation]);
        validateForm(model, true, 1);
        expect(validation).toHaveBeenCalledWith(model, true, 1);
    });
});

describe('full workflow validateModel with createValidation', () => {
    it('should work when combining validateModel and createValidation', () => {
        const validations = [
            createValidation(
                'name',
                model => model.name,
                name => (name.length < 4 ? 'tooShort' : null),
            ),
        ];
        const validateForm = validateModel(validations);
        expect(validateForm({ name: 'MAIS OUI' })).toEqual([]);

        const errors = validateForm({ name: 'OUI' });
        const getErrors = getFieldError(errors);
        expect(getErrors('name')).toEqual(['tooShort']);
    });
});

describe('nested validateModel', () => {
    const firstValidateForm = validateModel([
        createValidation(
            'name',
            model => model.name,
            name => (name.length < 4 ? 'tooShort' : null),
        ),
    ]);
    const secondValidateForm = validateModel([
        createValidation('age', model => model.age, age => (age.length < 4 ? 'tooShort' : null)),
        firstValidateForm,
    ]);
    const errors = secondValidateForm({ age: 'no', name: 'ye' });
    expect(errors).toContainEqual({ field: 'name', error: 'tooShort' });
    expect(errors).toContainEqual({ field: 'age', error: 'tooShort' });
});
