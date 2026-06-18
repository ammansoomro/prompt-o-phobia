"use client";
import Link from "next/link";
import Image from "next/image";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

const Nav = () => {
  return (
    <nav className="nav_pill mb-16 w-full">
      <Link href="/" className="flex items-center gap-2 pl-1">
        <Image
          src="/assets/images/constellation.svg"
          alt="Prompt-O-Phobia"
          width={28}
          height={28}
          className="object-contain"
        />
        <p className="font-display text-body font-medium tracking-tight text-mint-white max-sm:hidden">
          Prompt<span className="gradient_text">OPhobia</span>
        </p>
      </Link>

      <div className="flex items-center gap-2">
        <Show when="signed-in">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/create-prompt" className="btn_primary">
              Create Prompt
            </Link>
            <Link href="/profile" className="btn_ghost max-sm:hidden">
              Profile
            </Link>
            <UserButton
              appearance={{ elements: { avatarBox: "h-8 w-8" } }}
            />
          </div>
        </Show>

        <Show when="signed-out">
          <div className="flex items-center gap-1 sm:gap-2">
            <SignInButton mode="modal">
              <button type="button" className="btn_ghost">
                Login
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button type="button" className="btn_primary">
                Start sharing
              </button>
            </SignUpButton>
          </div>
        </Show>
      </div>
    </nav>
  );
};

export default Nav;
