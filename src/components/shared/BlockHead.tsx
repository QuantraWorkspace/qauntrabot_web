type Props = { title: string; lede?: string; className?: string };

/** Section heading inside an inner page. No eyebrow above it. */
export default function BlockHead({ title, lede, className = "" }: Props) {
  return (
    <div className={`block-head ${className}`}>
      <h2 className="block-title">{title}</h2>
      {lede && <p className="block-lede">{lede}</p>}
    </div>
  );
}
