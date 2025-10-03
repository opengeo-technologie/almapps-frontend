import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  forwardRef,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Directive({
  selector: "[currencyFormat]",
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyFormatDirective),
      multi: true,
    },
  ],
})
export class CurrencyFormatDirective implements ControlValueAccessor {
  @Input("currencyFormat") currencyCode: string = "XAF"; // default
  @Input() locale: string = "fr-FR"; // default locale

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  private get value(): string {
    return this.el.nativeElement.value;
  }

  private set value(val: string) {
    this.renderer.setProperty(this.el.nativeElement, "value", val);
  }

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private renderer: Renderer2
  ) {}

  /** Format a number string into currency string */
  private formatValue(raw: string): string {
    const numericString = raw.replace(/[^0-9.,]/g, "").replace(",", ".");
    const num = parseFloat(numericString);
    if (isNaN(num)) return "";
    return new Intl.NumberFormat(this.locale, {
      style: "currency",
      currency: this.currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }

  /** Parse formatted value back to number */
  private parseValue(formatted: string): number | null {
    const numericString = formatted.replace(/[^0-9.-]/g, "").replace(",", ".");
    const num = parseFloat(numericString);
    return isNaN(num) ? null : num;
  }

  /** ControlValueAccessor: write value from model to view */
  writeValue(value: number | null): void {
    if (value != null) {
      this.value = this.formatValue(value.toString());
    } else {
      this.value = "";
    }
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.renderer.setProperty(this.el.nativeElement, "disabled", isDisabled);
  }

  /** Format on typing */
  @HostListener("input", ["$event"])
  onInput(event: Event) {
    const raw = this.value;
    const numericValue = this.parseValue(raw);
    this.value = this.formatValue(raw);
    this.onChange(numericValue);
  }

  /** Format on blur */
  @HostListener("blur")
  onBlur() {
    this.value = this.formatValue(this.value);
    this.onTouched();
  }

  /** Select all on focus */
  @HostListener("focus")
  onFocus() {
    setTimeout(() => this.el.nativeElement.select());
  }

  /** Handle paste */
  @HostListener("paste", ["$event"])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasted = event.clipboardData?.getData("text") ?? "";
    const numericValue = this.parseValue(pasted);
    this.value = this.formatValue(pasted);
    this.onChange(numericValue);
  }

  /** Handle cut */
  @HostListener("cut", ["$event"])
  onCut(event: ClipboardEvent) {
    setTimeout(() => {
      const numericValue = this.parseValue(this.value);
      this.value = this.formatValue(this.value);
      this.onChange(numericValue);
    });
  }

  /** Restrict invalid keys */
  @HostListener("keydown", ["$event"])
  onKeydown(event: KeyboardEvent) {
    if (
      [
        "Backspace",
        "Delete",
        "Tab",
        "Escape",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
      ].includes(event.key)
    )
      return;
    if (!/[0-9.,]/.test(event.key)) {
      event.preventDefault();
    }
  }
}
