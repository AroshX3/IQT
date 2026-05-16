import Link from "next/link";
import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";


const page = () => {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-6">
      <section className="max-w-2xl text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          About This Project
        </h1>

        <p className="mt-6 text-white/70 leading-relaxed text-lg">
          This is a simple IQ-style challenge website made for fun. It tests
          your logic, reasoning, and pattern recognition using randomly selected
          questions.
        </p>

        <p className="mt-4 text-white/50 leading-relaxed">
          This is not an official IQ exam or medical evaluation. Just a smooth
          little brain challenge made with Next.js.
        </p>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-white/60 text-sm uppercase tracking-[0.2em]">
            Creator
          </p>

          <h2 className="mt-2 text-2xl font-semibold">Made by AroshX3</h2>
          <div className="pt-5 flex justify-center gap-5">
            <a href="https://www.facebook.com/profile.php?id=100074368103630">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com/guccibanana_aroshx3/">
              <FaInstagram />
            </a>
            <a href="https://github.com/AroshX3">
              <FaGithub />
            </a>
          </div>
          <p className="mt-2 text-white/50">
            Built with curiosity, caffeine, and questionable sleep schedules
          </p>
        </div>

        <div className="pt-5 flex gap-5 justify-center">
          <Link className="px-10 py-3 border" href="/">
            Go Back
          </Link>
          <Link className="px-12 py-3 border rounded-md text-black bg-white font-medium" href="/iqTester">
            Test your IQ
          </Link>
        </div>
      </section>
    </main>
  );
};

export default page;
