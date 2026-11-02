import * as allure from 'allure-js-commons';
import { test } from '../../fixtures';

test.describe('Classes page', () => {
  test.beforeEach(async () => {
    await allure.epic('Classes');
    await allure.feature('Classes page');
  });

  test('shows a class the user created', async ({ classesPage, testClass }) => {
    await classesPage.open();
    await classesPage.expectClassVisible(testClass.name);
  });
});
