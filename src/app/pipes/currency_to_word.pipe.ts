import { Pipe, PipeTransform } from "@angular/core";
import { ToWords } from "to-words";

@Pipe({
  name: "currencyToWord",
  standalone: true,
})
export class CurrencyToWOrdPipe implements PipeTransform {
  transform(value: number): string {
    const toWords = new ToWords({
      localeCode: "en-US",
      converterOptions: {
        currency: false,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
      },
    });
    // const toWords = new ToWords();

    let words = toWords.convert(value);

    return words.trim();
  }
}
