module.exports = async function runTest(driver, capabilities) {
  try {
    // Check if Gmail app is installed
    const isInstalled = await driver.isAppInstalled('com.google.android.gm');

    if (!isInstalled) {
      console.error('Gmail app is not installed on the device.');
      throw new Error('Gmail app not installed.');
    }

    console.log('Gmail app is installed.');

    // Launch the Gmail app using its launcher intent (without specifying the internal activity)
    console.log('Launching Gmail app...');
    await driver.activateApp('com.google.android.gm'); // Using 'activateApp' to launch Gmail normally

    // Pause to give Gmail some time to open
    await driver.pause(5000); // Wait for 5 seconds to see the Gmail app open

    // Check if the WelcomeTourActivity is in focus
    const currentActivity = await driver.getCurrentActivity();
    if (
      currentActivity === 'com.google.android.gm.welcome.WelcomeTourActivity'
    ) {
      console.log(
        'Gmail WelcomeTourActivity is in focus. Handling the welcome screen...',
      );

      // Try to interact with the welcome screen (e.g., press a 'Next' or 'Skip' button)
      const skipButton = await driver.$("//*[contains(@text, 'Skip')]");
      if (await skipButton.isDisplayed()) {
        await skipButton.click();
        console.log('Skipped the welcome screen.');
      } else {
        console.log('No Skip button found, continuing with the app.');
      }

      // Pause after interaction
      await driver.pause(2000); // Pause for 2 seconds after interacting with the welcome screen
    }

    // Check if the Gmail app's main activity is now in focus
    const finalActivity = await driver.getCurrentActivity();
    console.log(finalActivity);
    if (finalActivity === '.welcome.WelcomeTourActivity') {
      console.log('Gmail app launched successfully and is in focus.');
    } else {
      throw new Error(
        `Expected Gmail activity not in focus. Current activity: ${finalActivity}`,
      );
    }

    // Quit the driver (close the app)
    await driver.deleteSession();
    console.log('Test completed successfully.');
  } catch (error) {
    console.error('Test failed:', error);
    throw error; // Rethrow the error for proper error handling
  }
};
