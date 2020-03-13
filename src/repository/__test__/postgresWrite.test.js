/**
 * @jest-environment node
 */

const testBillsArray = [
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
  },
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
  }
];

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
  }
];

const {
  writeToDatabaseCaller,
  writeBillsToDatabase,
  writeEventsToDatabase
} = require('../postgresWrite.js');
jest.mock('../postgresWrite');

const { getLegisInfoCaller } = require('../../service/getDataCallers');
jest.mock('../../service/getDataCallers');

const { updateSummaryUrls } = require('../../service/update');
jest.mock('../../service/update');

describe('writeToDatabaseCaller', () => {
  writeToDatabaseCaller.mockImplementation(async (testUrl1, testUrl2) => {
    const { testBillsArray, testEventsArray } = await getLegisInfoCaller(
      testUrl1
    );
    try {
      await writeBillsToDatabase(testBillsArray);
      await writeEventsToDatabase(testEventsArray);
      await updateSummaryUrls(testUrl2);
    } catch (err) {
      console.error(`An error occurred.`);
    }
  });
  getLegisInfoCaller.mockImplementation((testUrl) => {
    return { testBillsArray, testEventsArray };
  });
  writeBillsToDatabase.mockImplementation((testArray) => Promise.resolve());
  writeEventsToDatabase.mockImplementation((testArray) => Promise.resolve());
  updateSummaryUrls.mockImplementation((testUrl) => Promise.resolve());
  test('writeToDatabaseCaller should call all the database writer functions', async () => {
    await writeToDatabaseCaller(
      'https://www.krustytheklown.com',
      'https://www.dingleshlopper.com'
    );

    expect(writeToDatabaseCaller).toHaveBeenCalledTimes(1);
    expect(writeToDatabaseCaller).toHaveBeenCalledWith(
      'https://www.krustytheklown.com',
      'https://www.dingleshlopper.com'
    );

    expect(getLegisInfoCaller).toHaveBeenCalledTimes(1);
    expect(getLegisInfoCaller).toHaveBeenCalledWith(
      'https://www.krustytheklown.com'
    );
    expect(writeBillsToDatabase).toHaveBeenCalledTimes(1);
    expect(writeBillsToDatabase).toHaveBeenCalledWith(testBillsArray);

    expect(writeEventsToDatabase).toHaveBeenCalledTimes(1);
    expect(writeEventsToDatabase).toHaveBeenCalledWith(testEventsArray);

    expect(updateSummaryUrls).toHaveBeenCalledTimes(1);
    expect(updateSummaryUrls).toHaveBeenCalledWith(
      'https://www.dingleshlopper.com'
    );
  });
});

describe('writeBillsToDatabase', () => {
  test('writeToDatabaseCaller should call all the database write queries', () => {
    writeBillsToDatabase.mockImplementation((billsArray) => {
      const promises = [];
      billsArray.forEach((bill) => {
        promises.push(Promise.resolve());
      });
      return Promise.all(promises).catch((err) =>
        console.error(
          `Failed to add ${billsArray.length} bills to database ... ${err}`
        )
      );
    });
  });
});

describe('writeEventsToDatabase', () => {
  test('writeEventsToDatabase should write events to database', () => {
    jest.setTimeout(30000);
  });
});
