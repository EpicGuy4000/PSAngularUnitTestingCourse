import { StrengthPipe } from "./strength.pipe";

describe(`StrengthPipe`, () => {
  describe('should display \'weak\'', () => {
    let weakRange = Array.from({length: 10}, (val, key) => key);
    weakRange.forEach(strength => {
      it(`if strength is ${strength}`, () => {
        let pipe = new StrengthPipe();

        expect(pipe.transform(strength))
          .toEqual(`${strength} (weak)`);
      });
    });

    it ('if strength is negative', () => {
      let pipe = new StrengthPipe();

      expect(pipe.transform(-56))
        .toEqual(`${-56} (weak)`);
    })

    it ('if strength is negative infinity', () => {
      let pipe = new StrengthPipe();

      expect(pipe.transform(-Infinity))
        .toEqual(`${-Infinity} (weak)`);
    })
  });

  describe('should display \'strong\'', () => {
    let weakRange = Array.from({length: 10}, (val, key) => key + 10);
    weakRange.forEach(strength => {
      it(`if strength is ${strength}`, () => {
        let pipe = new StrengthPipe();

        expect(pipe.transform(strength))
          .toEqual(`${strength} (strong)`);
      });
    });
  });

  describe('should display \'unbelievable\'', () => {
    let weakRange = Array.from({length: 10}, (val, key) => key + 20);
    weakRange.forEach(strength => {
      it(`if strength is ${strength}`, () => {
        let pipe = new StrengthPipe();

        expect(pipe.transform(strength))
          .toEqual(`${strength} (unbelievable)`);
      });
    });

    it(`if strength is infinite`, () => {
      let pipe = new StrengthPipe();

      expect(pipe.transform(Infinity))
        .toEqual(`${Infinity} (unbelievable)`);
    });
  });
});
