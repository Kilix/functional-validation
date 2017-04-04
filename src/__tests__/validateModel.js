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
        const validations = [formModel => formModel.name ? null : { field: 'name', error: true }];
        expect(validateModel(validations)(model)).toEqual([{ field: 'name', error: true }]);
    });

    it('should memoize the validations', () => {
        const model = {};
        const validation = jest.fn(
            formModel => formModel.name ? null : { field: 'name', error: true },
        );
        const validations = [validation];
        const validateForm = validateModel(validations);
        expect(validateForm(model)).toEqual([{ field: 'name', error: true }]);
        expect(validateForm(model)).toEqual([{ field: 'name', error: true }]);
        expect(validation).toHaveBeenCalledTimes(1);
        expect(validateForm({ name: 'brrra' })).toEqual([]);
    });
});

describe('full workflow validateModel with createValidation', () => {
    it('should work when combining validateModel and createValidation', () => {
        const validations = [
            createValidation(
                'name',
                model => model.name,
                name => name.length < 4 ? 'tooShort' : null,
            ),
        ];
        const validateForm = validateModel(validations);
        expect(validateForm({ name: 'MAIS OUI' })).toEqual([]);

        const errors = validateForm({ name: 'OUI' });
        const getErrors = getFieldError(errors);
        expect(getErrors('name')).toEqual(['tooShort']);
    });
});
