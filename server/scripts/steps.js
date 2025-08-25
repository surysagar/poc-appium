import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect, $ } from '@wdio/globals';

import AppPageIos from './appPageIOS.js';
import AppPageAndroid from './appPageAndroid.js';

Given(/^I am on application screen$/, async () => {
  await expect(AppPageAndroid.searchBar).toBeExisting();
});

When(/^I click on contact icon$/, async () => {
  await AppPageAndroid.contactButton.click();
});

Then(/^I should see search bar$/, async () => {
  await expect(AppPageAndroid.searchBar).toBeExisting();
});

Given(/^I am on Contact application screen$/, async () => {
  await expect(AppPageIos.contactText).toHaveText('Contacts');
});

When(/^I open some contact$/, async () => {
  await AppPageIos.randomContact.click();
});

Then(/^I should see an email adress$/, async () => {
  await expect(AppPageIos.emailText).toBeExisting();
});
