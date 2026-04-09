import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Expected World collects historical predictions about the future and asks one question: did it hold up?",
};

export default function AboutPage() {
  return (
    <main className="max-w-[720px] mx-auto px-12 max-md:px-4">
      {/* Hero statement */}
      <h1 className="font-display font-semibold text-[40px] max-md:text-[28px] tracking-[0.02em] text-center mt-24 mb-12">
        Every era imagines what comes next.
      </h1>

      <div className="space-y-6 text-parchment leading-[1.7]">
        <p>
          In 1900, a civil engineer named John Elfreth Watkins Jr. sat down with
          a pen and made a list. He called it &ldquo;What May Happen in the Next
          Hundred Years.&rdquo; He predicted photographs sent instantly across
          the world. Pre-made meals. High-speed trains. Pocket telephones. He
          wrote this in the Ladies&apos; Home Journal, and almost nobody noticed.
        </p>
        <p>
          A century later, he&apos;d nailed nearly everything.
        </p>
        <p>
          That&apos;s what The Expected World is about: the gap between what
          people imagined and what actually happened. The promises, the warnings,
          the wild guesses, the stunning bullseyes.
        </p>
      </div>

      {/* Divider */}
      <div className="w-16 h-px bg-divider mx-auto my-12" />

      <h2 className="font-display font-semibold text-[28px] tracking-[0.02em] text-center mb-6">
        Why Predictions Matter
      </h2>
      <div className="space-y-6 text-parchment leading-[1.7]">
        <p>
          Every prediction is a window into the hopes and fears of its era. When
          a 1950s vacuum company president predicted nuclear-powered cleaners, he
          wasn&apos;t being foolish — he was expressing the atomic age&apos;s
          intoxicating belief that nuclear energy would solve everything.
        </p>
        <p>
          Predictions reveal what people valued, what they feared, and what they
          couldn&apos;t see. They&apos;re historical documents as revealing as
          any diary or government report — except funnier, and often more honest.
        </p>
      </div>

      {/* Divider */}
      <div className="w-16 h-px bg-divider mx-auto my-12" />

      <h2 className="font-display font-semibold text-[28px] tracking-[0.02em] text-center mb-6">
        What We Do
      </h2>
      <div className="space-y-6 text-parchment leading-[1.7]">
        <p>
          We collect historical predictions about the future — from scientists,
          politicians, inventors, journalists, dreamers, and crackpots — and ask
          one simple question: <strong>Did it hold up?</strong>
        </p>
        <p>
          We&apos;re not here to mock anyone. Predicting the future is
          extraordinarily hard. We&apos;re here to marvel at the ones who got it
          right, learn from the ones who got it wrong, and appreciate the
          magnificent human compulsion to imagine what&apos;s coming next.
        </p>
      </div>

      {/* Divider */}
      <div className="w-16 h-px bg-divider mx-auto my-12" />

      <h2 className="font-display font-semibold text-[28px] tracking-[0.02em] text-center mb-6">
        The Rules
      </h2>
      <div className="space-y-6 text-parchment leading-[1.7]">
        <p>
          Every prediction in our archive is real, sourced, and attributed. We
          don&apos;t fabricate quotes. We don&apos;t strip context. We present
          each prediction with the respect it deserves — and then we hold it up
          against what actually happened.
        </p>
        <p>
          Our verdicts are honest but fair. &ldquo;Came true&rdquo; means the
          prediction substantially matched reality. &ldquo;Partially true&rdquo;
          means the spirit was right even if the details weren&apos;t.
          &ldquo;Did not come true&rdquo; means... well, nuclear vacuum cleaners.
        </p>
      </div>

      {/* Divider */}
      <div className="w-16 h-px bg-divider mx-auto my-12" />

      <h2 className="font-display font-semibold text-[28px] tracking-[0.02em] text-center mb-4">
        The Invitation
      </h2>
      <div className="space-y-6 text-parchment leading-[1.7] mb-8">
        <p>
          The future is being predicted right now — by you, by us, by everyone
          who&apos;s ever said &ldquo;in ten years, we&apos;ll all be...&rdquo;
        </p>
        <p className="text-dusk italic text-center">
          Because the most interesting thing about the future isn&apos;t whether
          we get it right. It&apos;s what our guesses say about who we are.
        </p>
      </div>

      <div className="text-center mb-24">
        <Link
          href="/submit"
          className="inline-flex items-center gap-2 text-brass font-medium text-sm hover:text-brass-bright hover:underline transition-colors"
        >
          Submit a prediction <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}
