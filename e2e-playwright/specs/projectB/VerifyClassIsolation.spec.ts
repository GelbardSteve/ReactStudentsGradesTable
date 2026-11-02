import * as allure from 'allure-js-commons';
import { test } from '../../fixtures';

test.describe('Class isolation between users', () => {
  test.beforeEach(async () => {
    await allure.epic('Classes');
    await allure.feature('Data isolation');
  });

  test("does not show another user's class", async ({ classesPage, classFactory, apiFor, testClass }) => {
    const otherUsersClass = await classFactory.create(apiFor('projectA'));

    await classesPage.open();
    // The user's own class proves the list finished loading before checking what's missing
    await classesPage.expectClassVisible(testClass.name);
    await classesPage.expectClassNotListed(otherUsersClass.name);
  });
});
