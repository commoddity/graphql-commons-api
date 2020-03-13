/**
 * @jest-environment node
 */

const {
  queryIfRowExists,
  queryIfRowContains,
  queryIfEventExists,
  queryLatestParliamentarySession,
  queryUpdateBillPassed,
  queryUpdateSummaryUrl
} = require('../queryHelpers');

describe('queryIfRowExists', () => {
  test('queryIfRowExists should return true if row exists', () => {
    return queryIfRowExists('bills', 'code', 'C-2').then((data) => {
      expect(data).toEqual(true);
    });
  });

  test("queryIfRowExists should return false if row doesn't exist", () => {
    return queryIfRowExists('bills', 'code', 'C-666').then((data) => {
      expect(data).toEqual(false);
    });
  });
});

describe('queryIfRowContains', () => {
  test('queryIfRowContains should return true if row contains value', () => {
    return queryIfRowContains(
      'events',
      'title',
      'Bill Not Proceeded With'
    ).then((data) => {
      expect(data).toEqual(true);
    });
  });

  test('queryIfRowContains should return false if row does not contain value', () => {
    return queryIfRowContains(
      'events',
      'title',
      'these pretzels are making me thirsty'
    ).then((data) => {
      expect(data).toEqual(false);
    });
  });
});

describe('queryIfEventExists', () => {
  test('queryIfEventExists should return true if event exists in database', () => {
    return queryIfEventExists('C-2', 'Third Reading in the Senate').then(
      (data) => {
        expect(data).toEqual(true);
      }
    );
  });

  test('queryIfEventExists should return false if event does not exist in database', () => {
    return queryIfEventExists('C-2', 'I am the lizard queen!').then((data) => {
      expect(data).toEqual(false);
    });
  });
});

describe('queryLatestParliamentarySession', () => {
  test('queryLatestParliamentarySession should return the current parliamentary session', () => {
    return queryLatestParliamentarySession().then((data) => {
      expect(data).toEqual(1);
    });
  });
});

describe('queryUpdateBillPassed', () => {
  test('queryUpdateBillPassed should return if passed existing bill and valid status', () => {
    return queryUpdateBillPassed('C-2', true).then((data) => {
      expect(data).toBeUndefined();
    });
  });
});

describe('queryUpdateSummaryUrl', () => {
  test('queryUpdateSummaryUrl should return if passed existing bill and valid string', () => {
    return queryUpdateSummaryUrl('C-2', 'https://www.dogs.com').then((data) => {
      expect(data).toBeUndefined();
    });
  });
});
