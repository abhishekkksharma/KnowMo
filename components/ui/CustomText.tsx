interface HeadingProps {
  text: string;
  size?: string;
  className?: string;
}

export default function CustomText({
  text,
  size = "text-4xl md:text-5xl",
  className = "",
}: HeadingProps) {
  return (
    <h1
      className={`mt-4 tracking-tight text-black dark:text-gray-50  ${size} ${className}`}
    >
      {text}
    </h1>
  );
}