/**
 * @jest-environment node
 */

const { splitBills, splitEvents } = require('../split');

const testArray = [
  {
    title: 'C-9, Introduction and First Reading in the House of Commons',
    link:
      'https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10686850',
    description:
      'C-9, An Act to amend the Chemical Weapons Convention Implementation Act',
    pubDate: 'Tue, 10 Mar 2020 00:00:00 EST'
  },
  {
    title: 'C-9, Debate at Second Reading in the in the House of Commons',
    link:
      'https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10686850',
    description:
      'C-9, An Act to amend the Chemical Weapons Convention Implementation Act',
    pubDate: 'Tue, 10 Mar 2020 00:00:00 EST'
  },
  {
    title: 'S-208, Debate at Second Reading in the Senate',
    link:
      'https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10625187',
    description:
      'S-208, An Act to amend the Criminal Code (independence of the judiciary)',
    pubDate: 'Tue, 10 Mar 2020 00:00:00 EST'
  },
  {
    title: 'S-213, Debate at Second Reading in the Senate',
    link:
      'https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10629396',
    description:
      'S-213, An Act to change the name of the electoral district of Châteauguay—Lacolle',
    pubDate: 'Tue, 10 Mar 2020 00:00:00 EST'
  }
];

describe('splitBills', () => {
  const testBillsArray = [
    {
      parliamentary_session_id: undefined,
      code: 'C-9',
      title:
        'An Act to amend the Chemical Weapons Convention Implementation Act',
      description: undefined,
      introduced_date: undefined,
      summary_url: undefined,
      page_url:
        'https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10686850',
      full_text_url: undefined,
      passed: null
    },
    {
      parliamentary_session_id: undefined,
      code: 'S-208',
      title:
        'An Act to amend the Criminal Code (independence of the judiciary)',
      description: undefined,
      introduced_date: undefined,
      summary_url: undefined,
      page_url:
        'https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10625187',
      full_text_url: undefined,
      passed: null
    },
    {
      parliamentary_session_id: undefined,
      code: 'S-213',
      title:
        'An Act to change the name of the electoral district of Châteauguay—Lacolle',
      description: undefined,
      introduced_date: undefined,
      summary_url: undefined,
      page_url:
        'https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10629396',
      full_text_url: undefined,
      passed: null
    }
  ];

  test('splitBills returns an array', () => {
    expect(splitBills(testArray)).toBeInstanceOf(Array);
  });

  test('splitBills should return an array with length equal to number of bills, with no duplicate bills', () => {
    expect(splitBills(testArray)).toHaveLength(3);
  });

  test('splitBills should return an array of all bills in XML feed', () => {
    expect(splitBills(testArray)).toEqual(testBillsArray);
  });
});

describe('splitEvents', () => {
  const testEventsArray = [
    {
      bill_id: undefined,
      code: 'C-9',
      title: 'Introduction and First Reading in the House of Commons',
      publication_date: '10-03-2020'
    },
    {
      bill_id: undefined,
      code: 'C-9',
      title: 'Debate at Second Reading in the in the House of Commons',
      publication_date: '10-03-2020'
    },
    {
      bill_id: undefined,
      code: 'S-208',
      title: 'Debate at Second Reading in the Senate',
      publication_date: '10-03-2020'
    },
    {
      bill_id: undefined,
      code: 'S-213',
      title: 'Debate at Second Reading in the Senate',
      publication_date: '10-03-2020'
    }
  ];

  test('splitEvents returns an array', () => {
    expect(splitEvents(testArray)).toBeInstanceOf(Array);
  });

  test('splitEvents should return an array with length equal to number of events', () => {
    expect(splitEvents(testArray)).toHaveLength(4);
  });

  test('splitEvents should return an array of all events in XML feed', () => {
    expect(splitEvents(testArray)).toEqual(testEventsArray);
  });
});
