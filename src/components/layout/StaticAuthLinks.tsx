import Link from "next/link";

type StaticAuthLinksProps = {
  mobile?: boolean;
};

export default function StaticAuthLinks({ mobile = false }: StaticAuthLinksProps) {
  if (mobile) {
    return (
      <div className="flex flex-col gap-2">
        <Link
          href="/dashboard"
          className="rounded-xl px-4 py-3 text-base font-medium text-muted-foreground hover:bg-secondary cursor-pointer text-center"
        >
          Dashboard
        </Link>
        <Link href="/register" className="btn-primary-brand w-full justify-center">
          Join Quantra
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link href="/dashboard" className="btn-outline-brand nav-action">
        Dashboard
      </Link>
      <Link href="/register" className="btn-primary-brand nav-action">
        Join Quantra
      </Link>
    </>
  );
}
