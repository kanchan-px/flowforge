interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="ff-reveal mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base text-slate-600 sm:text-lg">{description}</p>
    </div>
  );
}