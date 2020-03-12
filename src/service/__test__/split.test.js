/**
 * @jest-environment node
 */

const { splitBills, splitEvents } = require('../split');

const testArray = [
  {
    title: 'C-1234, Introduction and First Reading in the House of Commons',
    link:
      'https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10686850',
    description:
      'C-1234, An Act to amend the Chemical Weapons Convention Implementation Act',
    pubDate: 'Tue, 10 Mar 2020 00:00:00 EST'
  },
  {
    title: 'C-1234, Debate at Second Reading in the in the House of Commons',
    link:
      'https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10686850',
    description:
      'C-1234, An Act to amend the Chemical Weapons Convention Implementation Act',
    pubDate: 'Tue, 10 Mar 2020 00:00:00 EST'
  },
  {
    title: 'S-4567, Debate at Second Reading in the Senate',
    link:
      'https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10625187',
    description:
      'S-4567, An Act to amend the Criminal Code (independence of the judiciary)',
    pubDate: 'Tue, 10 Mar 2020 00:00:00 EST'
  },
  {
    title: 'S-2123, Debate at Second Reading in the Senate',
    link:
      'https://www.parl.ca/LegisInfo/BillDetails.aspx?Language=E&billId=10629396',
    description:
      'S-2123, An Act to amend the Criminal Records Act, to make consequential amendments to other Acts and to repeal a regulation',
    pubDate: 'Tue, 10 Mar 2020 00:00:00 EST'
  }
];

describe('splitBills', () => {
  const testBillsArray = [
    {
      parliamentary_session_id: undefined,
      code: 'C-1234',
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
      code: 'S-4567',
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
      code: 'S-2123',
      title:
        'An Act to amend the Criminal Records Act, to make consequential amendments to other Acts and to repeal a regulation',
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
    return splitBills(testArray).then((data) => {
      expect(data).toBeInstanceOf(Array);
    });
  });

  test('splitBills should return an array with length equal to number of bills, with no duplicate bills', () => {
    return splitBills(testArray).then((data) => {
      expect(data).toHaveLength(3);
    });
  });

  test('splitBills should return an array of all bills in XML feed', () => {
    return splitBills(testArray).then((data) => {
      expect(data).toEqual(testBillsArray);
    });
  });
});

describe('splitEvents', () => {
  const testEventsArray = [
    {
      bill_code: 'C-1234',
      title: 'Introduction and First Reading in the House of Commons',
      publication_date: '2020/03/10'
    },
    {
      bill_code: 'C-1234',
      title: 'Debate at Second Reading in the in the House of Commons',
      publication_date: '2020/03/10'
    },
    {
      bill_code: 'S-4567',
      title: 'Debate at Second Reading in the Senate',
      publication_date: '2020/03/10'
    },
    {
      bill_code: 'S-2123',
      title: 'Debate at Second Reading in the Senate',
      publication_date: '2020/03/10'
    }
  ];

  test('splitEvents returns an array', () => {
    return splitEvents(testArray).then((data) => {
      expect(data).toBeInstanceOf(Array);
    });
  });

  test('splitEvents should return an array with length equal to number of events', () => {
    return splitEvents(testArray).then((data) => {
      expect(data).toHaveLength(4);
    });
  });

  test('splitBills should return an array of all bills in XML feed', () => {
    return splitEvents(testArray).then((data) => {
      expect(data).toEqual(testEventsArray);
    });
  });
});
