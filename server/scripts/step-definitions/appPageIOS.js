import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class AppPageIos {


    get contactText() 
    {   return $('//XCUIElementTypeApplication[@name="Contacts"]')};

    get randomContact()
    {   return $('//XCUIElementTypeCell[@name="John Appleseed"]/XCUIElementTypeOther[2]')};

    get emailText()
    {   return $('//XCUIElementTypeStaticText[@name="John-Appleseed@mac.com"]')};
}

export default new AppPageIos();

