/**
 * @jest-environment node
 */

const {
  fetchXml,
  fetchFullTextUrl,
  fetchIntroducedDate,
  fetchDescription,
  fetchSummaryUrls
} = require('../fetch');

const { formatXml } = require('../format');

describe('fetchXml', () => {
  const testUrl =
    'https://www.parl.ca/LegisInfo/RSSFeed.aspx?download=rss&Language=E&Mode=1&Source=LegislativeFilteredBills&AllBills=1&HOCEventTypes=60110,60111,60146,60306,60122,60115,60119,60121,60124,60125,60126,60127,60285,60145,60307,60128,60131,60132,60133,60134,60174,60112,60163,60304,60303,60139,60144,60136,60138,60142&SenateEventTypes=60109,60110,60111,60115,60118,60119,60120,60123,60124,60305,60286,60130,60129,60302,60131,60132,60133,60134,60147,60304,60303,60140,60143,60135,60137,60141,60149';

  test('FetchXml returns XML string', () => {
    return fetchXml(testUrl).then((data) => {
      expect(typeof data).toBe('string');
    });
  });
});

describe('fetchFullTextUrl', () => {
  const testBillCode = 'S-215';
  const testPageUrl =
    'https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10637436';
  const testFullTextUrl = 'https://parl.ca/DocumentViewer/en/10637457';
  const testBillCodeNoFullText = 'C-1';
  const testNoFullTextUrl =
    'https://www.parl.ca/legisinfo/BillDetails.aspx?Language=E&billId=10600395';

  test('fetchFullTextUrl fetches the full text url if available', () => {
    return fetchFullTextUrl(testPageUrl, testBillCode).then((data) => {
      expect(data).toEqual(testFullTextUrl);
    });
  });

  test('fetchFullTextUrl skips the bill if no full text available', () => {
    return fetchFullTextUrl(testNoFullTextUrl, testBillCodeNoFullText).then(
      (data) => {
        expect(data).toEqual(undefined);
      }
    );
  });
});

describe('fetchIntroducedDate', () => {
  const testBillCode = 'S-215';
  const testPageUrl =
    'https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10637436';
  const testIntroducedDate = '2020-02-18';
  const testBillCodeNoDate = 'C-2';
  const testNoIntroducedDate =
    'https://www.parl.ca/legisinfo/BillDetails.aspx?Language=E&billId=10604308';

  test('fetchFullTextUrl fetches the introduced date if available', () => {
    return fetchIntroducedDate(testPageUrl, testBillCode).then((data) => {
      expect(data).toEqual(testIntroducedDate);
    });
  });

  test('fetchFullTextUrl skips the bill if no introduced date available', () => {
    return fetchIntroducedDate(testNoIntroducedDate, testBillCodeNoDate).then(
      (data) => {
        expect(data).toEqual(undefined);
      }
    );
  });
});

describe('fetchDescription', () => {
  const testBillCode = 'S-215';
  const testFullTextUrl = 'https://parl.ca/DocumentViewer/en/10637457';
  const testDescription =
    'This enactment amends the Greenhouse Gas Pollution Pricing Act to modify the definitions of eligible farming machinery and qualifying farming fuel.';

  test('fetchFullTextUrl fetches the description if available', () => {
    return fetchDescription(testFullTextUrl, testBillCode).then((data) => {
      expect(data).toEqual(testDescription);
    });
  });
});

describe('fetchSummaryUrls', () => {
  const testSummariesUrl =
    'https://www.parl.ca/legisinfo/RSSFeed.aspx?download=rss&Language=E&source=LegislativeSummaryPublications';

  test('fetchFullTextUrl fetches the summary_url if available', () => {
    return fetchSummaryUrls(testSummariesUrl).then((data) => {
      expect(data).toBeInstanceOf(Array);
    });
  });
});
