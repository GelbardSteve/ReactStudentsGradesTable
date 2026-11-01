import fs from 'node:fs';
import path from 'node:path';
import { AllureStatus } from '../src/types/enums/enums';
import { AllureReportSummary, AllureTestCase } from '../src/types/interfaces/interfaces';

/*
 * Prints the results of the run as markdown, for the GitHub Actions run summary page:
 * a link to the full Allure report, a table of all tests, and for each failed test its AI analysis and error.
 * Usage: npx tsx report/runSummary.ts <report url> >> $GITHUB_STEP_SUMMARY
 */

const REPORT_DIR = path.resolve(__dirname, '../allure-report');
const reportUrl = process.argv[2];

const ICONS: Record<AllureStatus, string> = {
  [AllureStatus.Passed]: '✅',
  [AllureStatus.Failed]: '❌',
  [AllureStatus.Broken]: '💥',
  [AllureStatus.Skipped]: '⏭️',
  [AllureStatus.Unknown]: '❔',
};

const readJson = <T>(file: string): T => JSON.parse(fs.readFileSync(file, 'utf-8'));
const seconds = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
const icon = (test: AllureTestCase) => (test.flaky ? '⚠️' : ICONS[test.status]);
const isFailed = (test: AllureTestCase) => test.status === AllureStatus.Failed || test.status === AllureStatus.Broken;

// The AI analysis is the first <pre> block of the test description (see failureAnalysis.ts)
const aiAnalysis = (test: AllureTestCase) =>
  test.descriptionHtml
    ?.match(/<pre>([\s\S]*?)<\/pre>/)?.[1]
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const summary = readJson<AllureReportSummary>(path.join(REPORT_DIR, 'widgets/summary.json'));
const tests = fs
  .readdirSync(path.join(REPORT_DIR, 'data/test-cases'))
  .map((file) => readJson<AllureTestCase>(path.join(REPORT_DIR, 'data/test-cases', file)))
  .filter((test) => !test.retry) // keep only the final attempt of each test
  .sort((a, b) => Number(isFailed(b)) - Number(isFailed(a)));

const { statistic } = summary;
const failedCount = statistic.failed + statistic.broken;
const lines: string[] = [
  `## ${failedCount ? '❌' : '✅'} E2E results: ${statistic.passed} passed, ${failedCount} failed, ${statistic.skipped} skipped (${seconds(summary.time.duration)})`,
  '',
  reportUrl
    ? `### [📊 Open full Allure report](${reportUrl})\n_Screenshots, videos and traces. The page is ready about a minute after the run finishes._`
    : '',
  '',
  '| | Test | Duration |',
  '|---|---|---|',
  ...tests.map((test) => `| ${icon(test)} | ${test.fullName} | ${seconds(test.time.duration)} |`),
];

for (const test of tests.filter(isFailed)) {
  lines.push(
    '',
    `### ❌ ${test.fullName}`,
    '**AI analysis**',
    '```text',
    aiAnalysis(test) ?? 'Not available',
    '```',
    '<details><summary>Error</summary>',
    '',
    '```text',
    (test.statusMessage ?? '').split('\n').slice(0, 20).join('\n'),
    '```',
    '</details>',
  );
}

console.log(lines.join('\n'));
