import Link from "next/link";

export default function StickyCTA() {
  return (
    <div className="sticky bottom-6 z-20 mx-auto max-w-3xl">
      <div className="rounded-full border border-yellow-400/20 bg-black/70 backdrop-blur px-4 py-3 flex items-center justify-between">
        <span className="text-neutral-200">¿Listo para destacar?</span>
        <Link
          href="/checkout"
          className="px-5 py-2 rounded-full bg-yellow-400 text-black font-medium hover:brightness-110 transition"
        >
          Ir a pagar
        </Link>
      </div>
    </div>
  );
}
