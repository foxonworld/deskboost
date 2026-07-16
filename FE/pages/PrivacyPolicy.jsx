import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Section = ({ title, children }) => (
  <section className="space-y-3 border-t border-[#E4EEE6] pt-6 dark:border-[#2A4532]">
    <h2 className="text-xl font-extrabold text-text-main dark:text-white">{title}</h2>
    <div className="space-y-3 text-sm font-medium leading-7 text-text-secondary dark:text-slate-300">
      {children}
    </div>
  </section>
);

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background-light text-text-main dark:bg-background-dark dark:text-white">
    <Navbar />
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-[#E4EEE6] bg-white p-6 shadow-sm dark:border-[#2A4532] dark:bg-surface-dark sm:p-8">
        <p className="text-sm font-bold text-primary">Privacy Policy</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">DeskBoost Privacy Policy</h1>
        <p className="mt-4 text-sm font-medium leading-7 text-text-secondary dark:text-slate-300">
          Draft for Google Play readiness. TODO: replace with official support email before Play submission.
        </p>

        <div className="mt-8 space-y-8">
          <Section title="Data DeskBoost collects">
            <p>DeskBoost may collect account data, profile data, plant profiles, reminders, uploaded images, AI diagnosis results, AI chat content, feedback, request logs, provider diagnostics, and website analytics. Google Analytics 4 may measure visits, page views, marketplace interactions, product views, Zalo/Facebook contact clicks, and browser/device technical information processed by Google.</p>
          </Section>

          <Section title="Why data is used">
            <p>Data is used for account access, plant-care features, image storage, AI-assisted diagnosis and chat, reminders, support, security, fraud prevention, reliability, website effectiveness, conversion-funnel analysis, and improving the steps where visitors leave the website.</p>
          </Section>

          <Section title="Third-party processing">
            <p>DeskBoost may use Google OAuth for login, Google/Gemini for AI responses, Google Analytics 4 for website analytics, Plant.id for plant image diagnosis, Cloudinary for image storage, hosting/logging providers for operations, and Google Play Console for distribution diagnostics. DeskBoost does not intentionally send email addresses, names, phone numbers, chat content, tokens, form content, or other direct user-entered content to Google Analytics 4.</p>
          </Section>

          <Section title="AI and image disclosure">
            <p>Images, plant context, diagnosis questions, and chat messages may be sent to Plant.id, Google/Gemini, Cloudinary, and hosting/logging providers. AI responses are informational plant-care assistance and may be incomplete or incorrect.</p>
          </Section>

          <Section title="Google Login">
            <p>If you use Google Login, DeskBoost receives the identity data needed to authenticate your account, such as email, display name, and Google account identifier. Google processes Google account data under Google's own policies.</p>
          </Section>

          <Section title="Retention and deletion">
            <p>Account and feature data is retained while needed to provide the service. DeskBoost currently supports a manual deletion request workflow, not instant automated deletion.</p>
            <Link to="/account-deletion" className="inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-dark">
              Request account deletion
            </Link>
          </Section>

          <Section title="Contact and review status">
            <p>Contact: TODO: replace with official support email before Play submission. This page is an engineering/product draft and must be reviewed before final publication.</p>
          </Section>
        </div>
      </div>
    </main>
  </div>
);

export default PrivacyPolicy;
