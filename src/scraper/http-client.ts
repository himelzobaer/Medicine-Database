import { getRandomUserAgent } from "../config.js";

interface FetchOptions {
  retries?: number;
  delayMs?: number;
  timeout?: number;
}

export async function fetchHtml(
  url: string,
  options: FetchOptions = {}
): Promise<string> {
  const { retries = 3, delayMs = 1000, timeout = 30000 } = options;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        headers: {
          "User-Agent": getRandomUserAgent(),
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < retries) {
        const backoff = delayMs * Math.pow(2, attempt - 1);
        console.error(
          `[HTTP] Attempt ${attempt}/${retries} failed for ${url}: ${lastError.message}. Retrying in ${backoff}ms...`
        );
        await sleep(backoff);
      }
    }
  }

  throw new Error(
    `[HTTP] All ${retries} attempts failed for ${url}: ${lastError?.message}`
  );
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
