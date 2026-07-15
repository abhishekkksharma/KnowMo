import Image from "next/image";
import Link from "next/link";
import NotFoundImage from "../../assets/not-found.png"

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
        {/* Illustration */}
        <div className="relative w-full max-w-[320px] sm:max-w-[400px]">
          <Image
            src={NotFoundImage}
            alt="404 Not Found"
            width={400}
            height={300}
            priority
            className="h-auto w-full object-contain"
          />
        </div>

        {/* Content */}

        <p className="mt-2 text-sm text-muted-foreground">
          404 | This page doesn't exist.
        </p>

        <Link
          href="/"
          className="mt-5 text-sm underline underline-offset-4 hover:font-semibold"
        >
          Home
        </Link>
      </div>
    </main>
  );
}