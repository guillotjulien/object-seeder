import { Property } from "../../../src/helpers/decorators/Property";

describe('Property decorator tests', () => {
    it('Should return a function', () => {
        expect(Property()).toBeInstanceOf(Function);
    });

    // TODO: Define other test cases
});
