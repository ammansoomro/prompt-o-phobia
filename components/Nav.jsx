"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
const Nav = () => {

  const isUserLoggedIn = true;

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link
        href="/" className="flex gap-2 flex-center"
      >
        <Image src="/assets/images/logo.svg"
          alt="Logo"
          className='object-contain cursor-pointer'
          width={30}
          height={30}
        />
        <p className="logo_text">ProptOPhobia</p>
      </Link>

      <div className="sm:flex hidden">
        {isUserLoggedIn ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/create-prompt"
              className="black_btn"
            >
              Create Post
            </Link>

            <button
              type="button"
              onClick={signOut}
              className="outline_btn"
            >
              Sign Out
            </button>

            <Link href="/profile">
              <Image src="/assets/images/logo.svg"
                alt="Profile"
                className='object-contain rounded-full cursor-pointer'
                width={37}
                height={37}

              />
            </Link>
          </div>
        ) :
          (
            <>

            </>
          )
        }

      </div>
    </nav>
  )
}

export default Nav