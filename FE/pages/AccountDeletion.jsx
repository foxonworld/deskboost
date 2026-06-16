import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AccountDeletion = () => (
  <div className="min-h-screen bg-background-light text-text-main dark:bg-background-dark dark:text-white">
    <Navbar />
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-[#E4EEE6] bg-white p-6 shadow-sm dark:border-[#2A4532] dark:bg-surface-dark sm:p-8">
        <p className="text-sm font-bold text-primary">Account Deletion</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Request DeskBoost account deletion</h1>
        <p className="mt-4 text-sm font-medium leading-7 text-text-secondary dark:text-slate-300">
          This public page is available without login for users and Google Play reviewers. DeskBoost currently supports manual deletion requests, not instant automated deletion.
        </p>

        <div className="mt-8 grid gap-5">
          <section className="rounded-2xl border border-[#E4EEE6] bg-[#FAFCF8] p-5 dark:border-[#2A4532] dark:bg-white/5">
            <h2 className="text-lg font-extrabold text-text-main dark:text-white">How to request deletion</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm font-medium leading-7 text-text-secondary dark:text-slate-300">
              <li>Send a request to the official support contact after it is published.</li>
              <li>Include your DeskBoost account email address.</li>
              <li>Write a clear confirmation such as: I request deletion of my DeskBoost account.</li>
              <li>Mention if the account was created with Google Login.</li>
            </ol>
          </section>

          <section className="rounded-2xl border border-[#E4EEE6] bg-[#FAFCF8] p-5 dark:border-[#2A4532] dark:bg-white/5">
            <h2 className="text-lg font-extrabold text-text-main dark:text-white">Processing time</h2>
            <p className="mt-3 text-sm font-medium leading-7 text-text-secondary dark:text-slate-300">
              Verified requests should be processed within 30 days. The team may ask for account ownership verification before deleting data.
            </p>
          </section>

          <section className="rounded-2xl border border-[#E4EEE6] bg-[#FAFCF8] p-5 dark:border-[#2A4532] dark:bg-white/5">
            <h2 className="text-lg font-extrabold text-text-main dark:text-white">Data covered</h2>
            <p className="mt-3 text-sm font-medium leading-7 text-text-secondary dark:text-slate-300">
              Eligible account profile data, plant profiles/history, reminders, uploaded images, AI diagnosis history, AI chat history, and private feedback may be deleted or anonymized. Security logs, legal records, backups, provider logs, and anonymized public feedback may be retained for limited periods.
            </p>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100">
            <h2 className="text-lg font-extrabold">Support contact required</h2>
            <p className="mt-3 text-sm font-bold leading-7">
              TODO: replace with official support email before Play submission. No production mailto link is provided until the official contact is confirmed.
            </p>
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/privacy" className="inline-flex justify-center rounded-xl border border-[#E4EEE6] px-4 py-2 text-sm font-bold text-text-main transition hover:border-primary hover:text-primary dark:border-[#2A4532] dark:text-white">
            View Privacy Policy
          </Link>
          <Link to="/" className="inline-flex justify-center rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-dark">
            Back to DeskBoost
          </Link>
        </div>
      </div>
    </main>
  </div>
);

export default AccountDeletion;
