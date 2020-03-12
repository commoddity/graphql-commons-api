/**
 * @jest-environment node
 */

const { insertFetchedData } = require('../insert.js');

describe('insertFetchedData', () => {
  const testArray = [
    {
      parliamentary_session_id: undefined,
      code: 'S-215',
      title:
        'An Act to amend the Greenhouse Gas Pollution Pricing Act (farming exemptions)',
      description: undefined,
      introduced_date: undefined,
      summary_url: undefined,
      page_url:
        'https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10637436',
      full_text_url: undefined,
      passed: null
    },
    {
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
    }
  ];

  const testArrayReturned = [
    {
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
    },
    {
      parliamentary_session_id: undefined,
      code: 'S-215',
      title:
        'An Act to amend the Greenhouse Gas Pollution Pricing Act (farming exemptions)',
      description:
        'This enactment amends the Greenhouse Gas Pollution Pricing Act to modify the definitions of eligible farming machinery and qualifying farming fuel.',
      introduced_date: '2020/02/18',
      summary_url: undefined,
      page_url:
        'https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10637436',
      full_text_url: 'https://parl.ca/DocumentViewer/en/10637457',
      passed: null
    }
  ];

  test('insertFetchedData should return bills with fetched data sorted by introduced_date in descending order', () => {
    jest.setTimeout(30000);
    return insertFetchedData(testArray).then((data) => {
      expect(data).toEqual(testArrayReturned);
    });
  });
});
