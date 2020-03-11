/**
 * @jest-environment node
 */

const { formatXml, formatDate, formatCode, formatTitle } = require('../format');

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
    expect(formatDate(testBill.pubDate)).toBe('2020-03-10');
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
