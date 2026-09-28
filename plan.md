# 🚀 BD Data Marketplace (DaaS) - Master Plan

## 🎯 Vision
To build the ultimate "Data as a Service (DaaS)" marketplace for Bangladesh. A central hub where developers, startups, and agencies can purchase ready-made datasets (JSON/CSV) or subscribe to auto-updating REST/GraphQL APIs to solve their "Cold Start" and data-entry problems. It will be the "Kaggle + RapidAPI" for the Bangladesh market.

---

## 🗄️ Top 10 High-Demand Datasets (The Catalog)
1. **Courier Mapping & Geo Location:** Steadfast, Pathao, RedX coverage and pricing mapped to District > Thana > Union > Postal Code. (For E-commerce checkouts).
2. **FMCG & Grocery Barcode Database:** Product names, prices, and barcodes scraped from Chaldal/Shwapno. (For POS software).
3. **Medicine & Pharma Database:** Brands, Generics, Prices, Indications from Medex. *(Currently in progress)*.
4. **Bank Routing & MFS Data:** Routing numbers, Swift codes, branch details, and MFS charges. (For FinTech).
5. **Doctors & Specialists Directory:** Verified BMDC/Doctorola doctors with chambers and visiting hours. (For HealthTech).
6. **Restaurant Menu & Pricing:** Menus and prices from Foodpanda/Pathao. (For Cloud Kitchens).
7. **Verified B2B Local Leads:** Google Maps scraped and normalized leads (Emails/Phones) of pharmacies, agencies, etc. (For B2B Sales).
8. **E-commerce Merchant Trust Index:** Fraud history and return rates. (For Logistics/Payments).
9. **Diagnostic Tests Pricing:** Pricing for pathology tests from Labaid/Popular. (For Clinic SaaS).
10. **Tech & Mobile Specs:** Latest gadgets and local pricing from Mobiledokan. (For E-commerce catalogs).

---

## 💰 Business & Monetization Strategy (DaaS Model)
শুধু `.json` বা `.csv` ফাইল সেল করাটা হলো **One-time payment**। এটাকে Smarter করতে হলে আমাদের **DaaS (Data as a Service)** মডেলে যেতে হবে:

- **API Access:** ডেভেলপারদের বলতে হবে, "JSON কিনলে আপডেট পাবি না, আমার API ইউজ কর, প্রতি মাসে ডেটা অটো আপডেট হবে।"
- **Pricing Model:** 
  - *Basic:* One-time $50 (JSON/CSV Download)
  - *Pro API:* $9/month (10,000 API calls)
  - *Enterprise API:* $49/month (Unlimited)
  এতে **Recurring Revenue (MRR)** আসবে, যা কোম্পানির ভ্যালুয়েশন বাড়াবে।

- **The "Freemium Hook" (Lead Magnet):**
  ডেভেলপাররা কিছু না দেখে টাকা পে করতে চায় না। 
  - প্রতিটা ডেটাসেটের জন্য **"Download Sample (First 100 rows)"** ফ্রি থাকবে। 
  - স্যাম্পল ডাউনলোড করতে হলে শুধু ইমেইল বা গিটহাব দিয়ে লগইন করতে হবে। 
  - এতে বাংলাদেশের সব টপ ডেভেলপার এবং স্টার্টআপ ফাউন্ডারদের ইমেইল লিস্ট চলে আসবে। পরে নতুন ডেটাসেট আসলে তাদেরকে মেইল করে ডিরেক্ট সেল করা যাবে!

- **"Request a Dataset" ফিচার:**
  ওয়েবসাইটে একটা সেকশন থাকবে: *"Didn't find what you are looking for? Request a Dataset."*
  স্টার্টআপগুলো এসে রিকোয়েস্ট করবে। এডভান্স পেমেন্ট নিয়ে তাদের জন্য কাস্টম স্ক্র্যাপার বানিয়ে দেওয়া হবে এবং পরে ওই একই ডেটাবেজ মার্কেটপ্লেসে সেল করা হবে।

---

## 📈 Marketing: pSEO, GEO & AEO Strategies

### ১. pSEO (Programmatic SEO) এর ম্যাজিক
এই ডেটাগুলো ব্যবহার করেই লাখ লাখ ল্যান্ডিং পেজ জেনারেট করা হবে।
**উদাহরণ:**
- `domain.com/datasets/medicine-api-bangladesh`
- `domain.com/datasets/courier-mapping-json-dhaka`
- `domain.com/datasets/bmdc-doctors-database-csv`

এমনকি ডেটাবেজের ভেতরের ডেটা দিয়েও pSEO করা হবে:
- *"Napa Extra 500mg current price in Bangladesh API"*
এতে করে যখন কোনো ডেভেলপার গুগলে সার্চ করবে *"Bangladesh courier routing API"*, সাইট সবার আগে আসবে।

### ২. GEO (Generative Engine Optimization) হ্যাক
এখন ডেভেলপাররা গুগলের চেয়ে ChatGPT, Claude বা Perplexity-তে বেশি সার্চ করে। ডেটাসেটের নাম AI-দের ব্রেইনে ঢোকাতে হবে:
- ওয়েবসাইটের ব্লগে হাই-কোয়ালিটি ডকুমেন্টেশন লিখতে হবে। যেমন: *"How to build a POS software in Bangladesh using our Barcode API"*, *"Solving checkout shipping in Next.js using Bangladesh Courier API"*।
- গিটহাবে এই API গুলোর ওপেন-সোর্স SDK বা Wrapper (যেমন: `npm install bd-medicine-api`) রিলিজ করতে হবে এবং রিডমিতে ওয়েবসাইটের লিংক দিতে হবে। AI-রা গিটহাব থেকে সবচেয়ে বেশি ডেটা স্ক্র্যাপ করে, তাই ওরা অটোমেটিক শিখে যাবে যে বাংলাদেশের ডেটাবেজ মানেই এই ওয়েবসাইট!

---

## 🏗️ Architecture & Tech Stack Recommendation
যেহেতু SEO এবং pSEO মেইন ফোকাস, এই ওয়েবসাইটের জন্য **Next.js (App Router) + Supabase + Stripe/Paddle** হবে বেস্ট কম্বিনেশন। 
- **Scraping Engine:** TypeScript + Cheerio + GitHub Actions (100% Free Cloud Cron) -> Saves to SQLite.
- **Database (SaaS):** Supabase (PostgreSQL) - গিটহাবে আমাদের স্ক্র্যাপারগুলো ডেটা এনে Supabase-এ ফেলবে।
- **Frontend & API:** Next.js সেই Supabase থেকে ডেটা নিয়ে pSEO পেজ জেনারেট করবে এবং মার্কেটপ্লেস হ্যান্ডেল করবে।

---

## 📍 Current Progress
- **Medicine Database:** Phase 1 (Listing) complete. Phase 2 (Detail) is actively running on GitHub Actions (Cron: every 1 hour, 55 mins limit). 
- **Next Step:** Once Medicine DB is 100% scraped, build `sync-to-supabase.ts`, then start building the Next.js Marketplace platform.
