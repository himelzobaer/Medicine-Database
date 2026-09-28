import * as cheerio from "cheerio";
import type { ScrapedBrandCard, ScrapedDetail } from "../validators/medicine.js";

/**
 * Listing page থেকে সব brand card parse করে।
 * প্রতিটা .brand-card div থেকে name, generic, strength, company extract করে।
 */
export function parseBrandCards(html: string): ScrapedBrandCard[] {
  const $ = cheerio.load(html);
  const cards: ScrapedBrandCard[] = [];

  $("a.brand-card").each((_, el) => {
    const $card = $(el);

    const href = $card.attr("href") ?? "";
    const medexIdMatch = href.match(/\/brands\/(\d+)\//);

    const dosageIcon = $card.find(".dosage-icon");

    const card: ScrapedBrandCard = {
      brandName: $card.find(".brand-card__name").text().trim(),
      strength: $card.find(".brand-card__strength").text().trim() || null,
      genericName: $card.find(".brand-card__generic").text().trim() || null,
      companyName: $card.find(".brand-card__company").text().trim() || null,
      dosageForm: dosageIcon.attr("alt")?.trim() ?? null,
      dosageFormIconUrl: dosageIcon.attr("src") ?? null,
      detailUrl: href,
      medexId: medexIdMatch?.[1] ?? null,
    };

    if (card.brandName) {
      cards.push(card);
    }
  });

  return cards;
}

/**
 * Listing page-এ পরের page আছে কিনা চেক করে।
 */
export function hasNextPage(html: string): boolean {
  const $ = cheerio.load(html);
  return $(".pagination .next").length > 0 || $('a[rel="next"]').length > 0;
}

/**
 * Detail page থেকে price, indication, composition, pack image parse করে।
 */
export function parseDetailPage(html: string): ScrapedDetail {
  const $ = cheerio.load(html);

  const priceText = $(".package-container").first().text();
  const unitPrice = extractPrice(priceText, "Unit Price");
  const stripPrice = extractPrice(priceText, "Strip Price");

  const packSizeMatch = priceText.match(/\(([^)]+)\)/);

  const indicationEl = $("#indications").next(".ac-body");
  const compositionEl = $("#composition").next(".ac-body");

  const packImageEl = $("a.pi-badge");
  const packImageUrl = packImageEl.attr("href") ?? null;

  return {
    unitPrice,
    stripPrice,
    packSize: packSizeMatch?.[1]?.trim() ?? null,
    indicationText: indicationEl.text().trim() || null,
    composition: compositionEl.text().trim() || null,
    packImageUrl,
  };
}

/**
 * Text থেকে ৳ price extract করে number হিসেবে।
 */
function extractPrice(text: string, label: string): number | null {
  const lines = text.split("\n").map((l) => l.trim());

  for (let i = 0; i < lines.length; i++) {
    if (lines[i]?.includes(label)) {
      const priceLine = lines[i + 1] ?? lines[i] ?? "";
      const match = priceLine.match(/৳\s*([\d,.]+)/);
      if (match?.[1]) {
        return parseFloat(match[1].replace(/,/g, ""));
      }
      const sameLine = (lines[i] ?? "").match(/৳\s*([\d,.]+)/);
      if (sameLine?.[1]) {
        return parseFloat(sameLine[1].replace(/,/g, ""));
      }
    }
  }

  const globalMatch = text.match(/৳\s*([\d,.]+)/);
  if (globalMatch?.[1]) {
    return parseFloat(globalMatch[1].replace(/,/g, ""));
  }

  return null;
}

/**
 * Total pages count বের করে pagination element থেকে।
 */
export function getTotalPages(html: string): number {
  const $ = cheerio.load(html);
  let maxPage = 1;

  $(".pagination a").each((_, el) => {
    const text = $(el).text().trim();
    const num = parseInt(text, 10);
    if (!isNaN(num) && num > maxPage) {
      maxPage = num;
    }
  });

  return maxPage;
}
