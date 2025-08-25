import { $ } from '@wdio/globals'
import Page from './page.js';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class AppPageAndroid {


    get searchBar() 
    {   return $('//android.widget.TextView[@resource-id="com.google.android.dialer:id/open_search_bar_text_view"]')};

    get contactButton()
    {   return $('//android.widget.FrameLayout[@content-desc="Contacts"]')};

}

export default new AppPageAndroid();

