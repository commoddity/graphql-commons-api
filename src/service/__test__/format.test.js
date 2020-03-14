/**
 * @jest-environment node
 */

const {
  formatXml,
  formatDate,
  formatCode,
  formatTitle,
  formatBillWithFetchedData,
  formatUclassifyData
} = require('../format');

describe('formatXml', () => {
  const testString = `<?xml version="1.0" encoding="utf-8"?><rss version="2.0"><channel><title>Custom RSS Feed</title><language>en</language><description>Custom RSS Feed/Fil RSS personnalisé</description><link>https://www.parl.ca/LegisInfo/</link><atom:link href="https://www.parl.ca/LegisInfo/RSSFeed.aspx?download=rss&amp;Language=E&amp;Mode=1&amp;Source=LegislativeFilteredBills&amp;AllBills=1&amp;HOCEventTypes=60110,60111,60146,60306,60122,60115,60119,60121,60124,60125,60126,60127,60285,60145,60307,60128,60131,60132,60133,60134,60174,60112,60163,60304,60303,60139,60144,60136,60138,60142&amp;SenateEventTypes=60109,60110,60111,60115,60118,60119,60120,60123,60124,60305,60286,60130,60129,60302,60131,60132,60133,60134,60147,60304,60303,60140,60143,60135,60137,60141,60149" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom" /><item><title>C-8, Introduction and First Reading in the House of Commons</title><link>https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&amp;billId=10686845</link><description>C-8, An Act to amend the Criminal Code (conversion therapy)</description><pubDate>Mon, 09 Mar 2020 00:00:00 EST</pubDate></item><item><title>C-237, Placed in the Order of Precedence in the House of Commons</title><link>https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&amp;billId=10660264</link><description>C-237, An Act to establish a national framework for diabetes</description><pubDate>Thu, 05 Mar 2020 00:00:00 EST</pubDate></item></channel></rss>`;
  const invalidXml =
    '<?xml version="1.0" encoding="utf-8"?><rss version="2.0"><channel><title>Custom RSS Feed';

  test('FormatXml returns an array', () => {
    expect(formatXml(testString)).toBeInstanceOf(Array);
  });

  test('FormatXml should return an array with length equal to number of bills', () => {
    expect(formatXml(testString)).toHaveLength(2);
  });

  test('FormatXml fails if given invalid xml', () => {
    expect(formatXml(invalidXml)).toBeUndefined();
  });
});

describe('formatDate', () => {
  const testBill = {
    title: 'C-9, Introduction and First Reading in the House of Commons',
    link:
      'https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10686850',
    description:
      'C-9, An Act to amend the Chemical Weapons Convention Implementation Act',
    pubDate: 'Tue, 10 Mar 2020 00:00:00 EST'
  };

  test('formatDate should format date', () => {
    expect(formatDate(testBill.pubDate)).toBe('2020/03/10');
  });
});

describe('formatCode', () => {
  const testBill = {
    title: 'C-9, Introduction and First Reading in the House of Commons',
    link:
      'https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10686850',
    description:
      'C-9, An Act to amend the Chemical Weapons Convention Implementation Act',
    pubDate: 'Tue, 10 Mar 2020 00:00:00 EST'
  };

  test('formatCode should return the bill code', () => {
    expect(formatCode(testBill.description)).toBe('C-9');
  });
});

describe('formatTitle', () => {
  const testBill = {
    title: 'C-9, Introduction and First Reading in the House of Commons',
    link:
      'https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10686850',
    description:
      'C-9, An Act to amend the Chemical Weapons Convention Implementation Act',
    pubDate: 'Tue, 10 Mar 2020 00:00:00 EST'
  };

  test('formatTitle should return the event title', () => {
    expect(formatTitle(testBill.title)).toBe(
      'Introduction and First Reading in the House of Commons'
    );
  });

  test('formatTitle should return the bill title', () => {
    expect(formatTitle(testBill.description)).toBe(
      'An Act to amend the Chemical Weapons Convention Implementation Act'
    );
  });
});

describe('formatBillWithFetchedData', () => {
  const testBill = {
    parliamentary_session_id: undefined,
    code: 'S-216',
    title: 'An Act to amend the Assisted Human Reproduction Act',
    description: undefined,
    introduced_date: undefined,
    summary_url: undefined,
    page_url:
      'https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10644036',
    full_text_url: undefined,
    passed: null
  };

  const testBillReturned = {
    parliamentary_session_id: undefined,
    code: 'S-216',
    title: 'An Act to amend the Assisted Human Reproduction Act',
    description:
      'This enactment amends the Assisted Human Reproduction Act to decriminalize payment for sperm or ovum donation and for surrogacy in certain circumstances.',
    introduced_date: '2020/02/20',
    summary_url: undefined,
    page_url:
      'https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10644036',
    full_text_url: 'https://parl.ca/DocumentViewer/en/10644072',
    passed: null
  };

  test('formatBillWithFetchedData should return bill with fetched data included', () => {
    jest.setTimeout(30000);
    return formatBillWithFetchedData(testBill).then((data) => {
      expect(data).toEqual(testBillReturned);
    });
  });
});

describe('formatUclassifyData', () => {
  const testProbability = [
    { className: 'agriculture_environment', p: 8.97824e-7 },
    { className: 'arts_culture', p: 1.67534e-8 },
    { className: 'business_industry', p: 8.30721e-9 },
    { className: 'economics_finance', p: 0.00000227311 },
    { className: 'education_language', p: 2.07222e-8 },
    { className: 'employment_labour', p: 1.16797e-7 },
    { className: 'government_politics', p: 0.00000268622 },
    { className: 'health_safety', p: 0.00000866958 },
    { className: 'indigenous_affairs', p: 9.89012e-8 },
    { className: 'information_communications', p: 4.30332e-7 },
    { className: 'international_affairs', p: 8.68736e-7 },
    { className: 'law_justice', p: 0.999757 },
    { className: 'science_technology', p: 5.99305e-7 },
    { className: 'social_affairs', p: 0.000226015 }
  ];

  testProbabilityArray = ['law_justice'];

  test('formatUclassifyData should return the categories with the highest probabilities', () => {
    expect(formatUclassifyData(testProbability)).toEqual(testProbabilityArray);
  });

  test('formatUclassifyData should return an array', () => {
    expect(formatUclassifyData(testProbability)).toBeInstanceOf(Array);
  });
});
