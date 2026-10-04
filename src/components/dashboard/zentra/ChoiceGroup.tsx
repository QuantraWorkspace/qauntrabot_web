"use client";

/** Single- or multi-select chips with fieldset/legend semantics and an error line. */
export default function ChoiceGroup<T extends string>({
  legend,
  options,
  selected,
  onToggle,
  error,
  multiple = false,
  format = (v) => v,
  hint,
}: {
  legend: string;
  options: T[];
  selected: T[];
  onToggle: (value: T) => void;
  error?: string;
  multiple?: boolean;
  format?: (value: T) => string;
  /** Optional second line under each choice. */
  hint?: (value: T) => string | undefined;
}) {
  const errorId = `${legend.replace(/\s+/g, "-").toLowerCase()}-error`;
  return (
    <fieldset className="z-field" aria-describedby={error ? errorId : undefined}>
      <legend className="z-field-label">
        {legend}
        {multiple && <span className="z-meta font-normal"> · choose any</span>}
      </legend>
      <div className="z-choices">
        {options.map((o) => (
          <label key={o} className="z-choice" data-on={selected.includes(o) || undefined}>
            <input
              type={multiple ? "checkbox" : "radio"}
              name={legend}
              value={o}
              checked={selected.includes(o)}
              onChange={() => onToggle(o)}
              className="sr-only"
            />
            <span className="flex flex-col">
              <span>{format(o)}</span>
              {hint?.(o) && <span className="z-choice-hint">{hint(o)}</span>}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className="z-field-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
