import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "customCurrency", standalone: true })
export class CustomCurrencyPipe implements PipeTransform {
  transform(
    value: number,
    currencyCode: string = "XAF",
    locale: string = "fr-CM"
  ): string {
    return value
      .toLocaleString(locale, {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace(/\u202F/g, " "); // replace narrow no-break space with normal space
  }
}
