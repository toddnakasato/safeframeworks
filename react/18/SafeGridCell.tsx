import type { Field, ConfigBase, OnSafeEvent } from "safecontracts";
import { SafeInput } from "./SafeInput";
import { INPUT_DEFAULTS } from "safecontracts/components/input";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

export interface SafeGridCellProps {
  field: Field;
  value: any;
  locale?: string;
  currency?: string;
  timezone?: string;
  emptyValue?: string;
  booleanTrue?: string;
  booleanFalse?: string;
  onEvent?: OnSafeEvent;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

function fieldToInputConfig(field: Field, locale: string, currency: string, timezone: string, emptyValue: string, booleanTrue: string, booleanFalse: string): ConfigBase {
  const type = field.type;
  let inputType = "text";
  let displayFormat: string | undefined;

  switch (type) {
    case "currency": inputType = "currency"; displayFormat = "currency"; break;
    case "number": inputType = "number"; displayFormat = "number"; break;
    case "percent": inputType = "number"; displayFormat = "percent"; break;
    case "date": inputType = "date"; displayFormat = "date"; break;
    case "datetime": inputType = "datetime"; displayFormat = "datetime"; break;
    case "boolean": inputType = "checkbox"; break;
    case "email": inputType = "email"; break;
    case "phone": inputType = "phone"; break;
    case "url": inputType = "url"; break;
    default: inputType = "text"; break;
  }

  return {
    component: "input",
    metadata: {
      component: "input",
      name: field.name,
      inputType,
      displayFormat,
      defaultText: emptyValue,
      locale,
      currency,
      timezone,
      hideEdit: false,
      hideCancel: false,
    },
  };
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function SafeGridCell({ field, value, locale, currency, timezone, emptyValue, booleanTrue, booleanFalse, onEvent }: SafeGridCellProps) {
  const l = locale ?? INPUT_DEFAULTS.locale;
  const c = currency ?? INPUT_DEFAULTS.currency;
  const tz = timezone ?? INPUT_DEFAULTS.timezone;
  const ev = emptyValue ?? "—";
  const bt = booleanTrue ?? "Yes";
  const bf = booleanFalse ?? "No";

  const inputConfig = fieldToInputConfig(field, l, c, tz, ev, bt, bf);
  const data = { [field.name]: value };

  return (
    <div data-component="grid-cell" data-field-type={field.type}>
      <div data-role="label">{field.label}</div>
      <div data-role="input">
        <SafeInput config={inputConfig} data={data} field={field.name} onEvent={onEvent} />
      </div>
    </div>
  );
}