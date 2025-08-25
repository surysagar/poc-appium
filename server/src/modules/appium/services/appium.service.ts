import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { exec, ChildProcess, spawn } from 'child_process';
import * as os from 'os';
import { promisify } from 'util';
import * as fs from 'fs-extra';
import { join as joinPath, resolve as resolvePath } from 'path';
import { remote } from 'webdriverio';
import { ScriptTypeEnum } from '../enums/scriptType.enum';
import { AppiumDriversEnum } from '../enums/appiumDrivers.enum';
import { OperatingSystemEnum } from 'src/modules/devices/enums/operatingSystem.enum';
import { PathResolver } from 'utils/PathResolver/pathResolver';
import { ReportTypeEnum } from '../enums/reportType.enum';
import { createWriteStream } from 'fs';
import { RunTestDto } from '../dto/RunTest.dto';
import { TestRunService } from 'src/modules/test-runs/services/test-run.service';
import { CreateWdioConfig } from '../interfaces/createWdioConfig.interface';
import { TestStatusEnum } from 'src/modules/test-runs/enums/testStatus.enum';

const execPromise = promisify(exec);

@Injectable()
export class AppiumService {
  private readonly logger = new Logger(AppiumService.name);
  private readonly pathResolver = PathResolver.Instance;

  constructor(
    @Inject(forwardRef(() => TestRunService))
    private testRunService: TestRunService,
  ) {}

  async startAppiumServer(port: number, testId: string): Promise<ChildProcess> {
    this.logger.log(`Starting Appium server on port: ${port}`);

    const appiumBinary = os.platform() === 'win32' ? 'appium.cmd' : 'appium';
    const appiumCommand = `${appiumBinary} --port ${port}`;

    // Use the path resolver to get the log file path
    const logFilePath = this.pathResolver.resolvePath(
      `logs/${testId}/appium.log`,
    );

    // Ensure the logs directory exists
    const logDir = joinPath(logFilePath, '..'); // Get the directory path
    fs.ensureDirSync(logDir); // This will create the directory if it doesn't exist

    // Create a write stream with 'w' flag to overwrite the file if it exists
    const logFile = fs.createWriteStream(logFilePath, { flags: 'w' });

    this.logger.log(`Appium command: ${appiumCommand}`);
    this.logger.log(`Logging Appium output to: ${logFilePath}`);

    try {
      // Start Appium using exec (returns a ChildProcess object)
      const appiumProcess = exec(appiumCommand);

      let initialized = false;

      // Redirect stdout to the log file
      appiumProcess.stdout.pipe(logFile);

      // Redirect stderr to the log file
      appiumProcess.stderr.pipe(logFile);

      appiumProcess.stdout.on('data', (data) => {
        const output = data.toString();
        // Check if Appium has started successfully
        if (output.includes('Appium REST http interface listener started on')) {
          this.logger.log('Appium server started successfully.');
          initialized = true;
        }
      });

      appiumProcess.stderr.on('data', (data) => {
        const errorOutput = data.toString();
        if (errorOutput.includes('EADDRINUSE')) {
          this.logger.error(`Port ${port} is still in use.`);
        }
      });

      appiumProcess.on('exit', (code) => {
        this.logger.log(`Appium server exited with code ${code}`);
        logFile.end(); // Close the log file when the process exits
      });

      appiumProcess.on('error', (error) => {
        logFile.end(); // Close the log file on error
        throw new Error(`Error starting Appium server: ${error.message}`);
      });

      // Wait for server to initialize (increased timeout to 30 seconds)
      await new Promise((resolve, reject) => {
        const checkInitialization = setInterval(() => {
          if (initialized) {
            clearInterval(checkInitialization);
            resolve(null);
          }
        }, 500); // Check every 500 ms if the server has initialized

        // Timeout after 30 seconds if not initialized
        setTimeout(() => {
          if (!initialized) {
            clearInterval(checkInitialization);
            throw new Error('Appium server failed to start in time.');
          }
        }, 30000); // Timeout in 30 seconds
      });

      return appiumProcess;
    } catch (error) {
      this.logger.error(`Error starting Appium server: ${error.message}`);
      throw error; // Propagate the error
    }
  }

  async stopAppiumServer(
    appiumProcess: ChildProcess,
    port: number,
  ): Promise<void> {
    console.log('Stopping server...');

    if (appiumProcess) {
      try {
        // Send SIGINT to the main process
        appiumProcess.kill('SIGINT');

        // Wait a short amount of time to ensure the process exits
        await new Promise((res) => setTimeout(res, 1000));

        // Check if the process is still alive
        if (!appiumProcess.killed) {
          console.log('Appium process did not terminate, force killing...');
          appiumProcess.kill('SIGKILL'); // Force kill the process if SIGINT didn't work
        }

        // After killing, check if the port is still in use
        await this.checkAndKillPort(port);

        console.log(
          `Appium process on port ${port} has been successfully stopped.`,
        );
      } catch (error) {
        console.error('Error stopping Appium process:', error);
        throw error; // Propagate the error to the caller
      }
    }
  }

  async checkAndKillPort(port: number): Promise<void> {
    try {
      const platform = process.platform;
      let command = '';

      if (platform === 'win32') {
        // Windows: Get the PID for the process listening on the port
        command = `for /f "tokens=5" %a in ('netstat -ano ^| findstr :${port} ^| find "LISTENING"') do taskkill /F /PID %a`;
      } else {
        // Linux/macOS: Find and kill the process using the port
        command = `lsof -ti :${port} | xargs kill -9`;
      }

      console.log(`Checking and killing process on port ${port}...`);
      await execPromise(command);
      console.log(`Port ${port} is now closed.`);
    } catch (error) {
      console.warn(
        `No process found using port ${port}. It might have already been closed.`,
      );
    }
  }

  async runTestOnDevice(body: RunTestDto) {
    let appiumProcess: ChildProcess;
    const report_type = body.reportType ?? ReportTypeEnum.ALLURE;
    try {
      // Start the Appium server on the specified port
      appiumProcess = await this.startAppiumServer(body.port, body.testId);
      this.logger.log(`Appium server started on port ${body.port}`);

      const AppiumDriver =
        body.platform === OperatingSystemEnum.ANDROID
          ? AppiumDriversEnum.UiAutomator2
          : AppiumDriversEnum.XCUITest;

      let driver = null;

      let wdioOptions: any = {
        hostname: process.env.APPIUMHOSTNAME,
        port: body.port,
        capabilities: {
          alwaysMatch: {
            platformName: body.platform,
            'appium:deviceName': body.deviceName,
            'appium:automationName': AppiumDriver,
            'appium:ignoreHiddenApiPolicyError': true,
            // 'appium:skipServerInstallation': true,
            // 'appium:skipDeviceInitialization': true,
          },
          firstMatch: [{}],
        },
      };

      if (body.platform === OperatingSystemEnum.ANDROID) {
        driver = await remote(wdioOptions);
      }

      if (body.scriptType === ScriptTypeEnum.CUCUMBER) {
        const createConfig: CreateWdioConfig = {
          platform: body.platform,
          deviceName: body.deviceName,
          port: body.port,
          featureFile: body.scriptName,
          scriptId: body.scriptId,
          driver: AppiumDriver,
          appActivity: body?.capabilities?.appActivity ?? undefined,
          appPackage: body?.capabilities?.appPackage ?? undefined,
          reportType: report_type,
          testId: body.testId,
          bundleId: body?.capabilities?.bundleId ?? undefined,
          xcodeOrgId: body?.capabilities?.xcodeOrgId ?? undefined,
        };

        wdioOptions = await this.createWdioConfig(createConfig);
      }

      if (body.apkFile) {
        // Initialize WebDriverIO with Appium capabilities
        if (body.platform === OperatingSystemEnum.ANDROID) {
          driver = await remote(wdioOptions);
        }

        // Resolve the APK file path using the path resolver
        const apkPath = this.pathResolver
          .resolvePath(`apps/${body.apkFile}`)
          .replace(/\\/g, '/');
        this.logger.log(`Installing app from ${apkPath} on the device.`);
        await driver.installApp(apkPath); // Install the APK on the device
        this.logger.log('App installed successfully.');
      }

      const updateTestRun = {
        capabilities: wdioOptions,
      };

      await this.testRunService.update(body.testId, updateTestRun);

      // Execute the test based on script type
      if (body.scriptType === ScriptTypeEnum.FILE) {
        if (!body.scriptName) {
          throw new Error(
            'Test file must be specified when scriptType is "file".',
          );
        }
        // Load and run the test from a file using the path resolver
        const scriptPath = this.pathResolver.resolvePath(
          `scripts/${body.scriptName}`,
        );
        const runTestScript = require(scriptPath);
        this.logger.log('Running test from file.');
        await runTestScript(driver, wdioOptions);
      } else if (body.scriptType === ScriptTypeEnum.CUCUMBER) {
        // Run the test using Cucumber
        this.logger.log('Running Cucumber test.');
        const wdioConfigPath = this.pathResolver
          .resolvePath(`resources/config/wdio-${body.port}.conf.js`)
          .replace(/\\/g, '/');

        // Run WDIO with the configuration object
        await this.runWdioWithSpawn(wdioConfigPath, body.port, body.testId);

        let result = undefined;
        if (report_type === ReportTypeEnum.JSON) {
          result = await this.handleCucumberResults(body.port);
        } else if (report_type === ReportTypeEnum.ALLURE) {
          // Handle Allure results
          await this.generateAllureReport(body.testId);
        }

        return {
          status: true,
          message: 'Test executed successfully.',
          result: result,
        };
      } else if (body.scriptType === ScriptTypeEnum.INLINE) {
        if (!body.script) {
          throw new Error(
            'Test script must be provided when scriptType is "inline".',
          );
        }
        // Execute the inline script directly
        this.logger.log('Running inline test script.');
        await eval(body.script)(driver, wdioOptions); // Pass the driver and capabilities
      } else {
        throw new Error('Invalid scriptType. Expected "file" or "inline".');
      }

      return { status: true, message: 'Test executed successfully.' };
    } catch (error) {
      this.logger.error(`Error executing test: ${error.message}`);
      this.testRunService.updateTestRunResult(
        body.testId,
        TestStatusEnum.FAILED,
        error,
      );
      // throw error;
    } finally {
      await this.stopAppiumServer(appiumProcess, body.port);
      this.logger.log('Appium server stopped successfully.');
    }
  }

  private async createWdioConfig(config: CreateWdioConfig): Promise<string> {
    const testScript = this.pathResolver
      .resolvePath(`scripts/${config.scriptId}/features/${config.featureFile}`)
      .replace(/\\/g, '/');

    const steps = this.pathResolver
      .resolvePath(`scripts/${config.scriptId}/**/*.js`)
      .replace(/\\/g, '/');

    const wdioConfig = `
      exports.config = {
        runner: 'local',
        port: ${config.port},
        waitforTimeout: 10000,
        connectionRetryTimeout: 120000,
        connectionRetryCount: 3,
        framework: 'cucumber',
        specs: ['${testScript}'],
        cucumberOpts: {
          require: ['${steps}'],
          backtrace: false,
          requireModule: [],
          dryRun: false,
          failFast: false,
          name: [],
          snippets: true,
          source: true,
          strict: false,  
          tagExpression: '',
          timeout: 60000,
          ignoreUndefinedDefinitions: true,
          ignoreHiddenApiPolicyError: true,
        },
        capabilities: [{
          platformName: '${config.platform}',
          // "appium:platformVersion": "17.3",
          // 'appium:deviceName': '${config.deviceName}',
          'appium:udid': '${config.deviceName}',
          'appium:automationName': '${config.driver}',
          "appium:disableSuppressAccessibilityService": true,
          //  'appium:skipServerInstallation': true, 
          // 'appium:skipDeviceInitialization': true,
          'appium:noReset': true,
          // 'appium:updatedWDABundleId':'com.appium.WebDriverAgentRunner',
          ${
            config.platform === OperatingSystemEnum.ANDROID
              ? `
          // 'appium:skipServerInstallation': true, 
          // 'appium:skipDeviceInitialization': true,
          "appium:ignoreHiddenApiPolicyError": true,
          "appium:appActivity": "${config.appActivity}",
          "appium:appPackage": "${config.appPackage}",`
              : `
                'appium:bundleId': '${config.bundleId}',
                'appium:xcodeSigningId': "iPhone Developer",
                'appium:usePreinstalledWDA': false,
                'appium:xcodeOrgId': '${config.xcodeOrgId}',
                'appium:showXcodeLog': true,
              `
          }
        }],
        logLevel: 'debug',
        ${
          config.reportType === ReportTypeEnum.JSON
            ? `reporters: [['cucumberjs-json', { jsonFolder: 'results/${config.port}', language: 'en' }]],`
            : `reporters: [['allure',  {
          outputDir: 'results/${config.testId}',
          disableWebdriverStepsReporting: true,
          disableWebdriverScreenshotsReporting: true,
      }]],
     
      afterTest: async function (
        test,
        context,
        { error, result, duration, passed, retries }
        ) {
        if (error) {
          await driver.takeScreenshot();
        }
      },`
        }
      };
    `;

    // Write the generated configuration to a temporary file
    const wdioConfigPath = resolvePath(
      `resources/config/wdio-${config.port}.conf.js`,
    );

    const configDir = joinPath(wdioConfigPath, '..');
    fs.ensureDirSync(configDir);

    fs.writeFileSync(wdioConfigPath, wdioConfig);
    this.logger.log(`WDIO configuration file created at: ${wdioConfigPath}`);

    return Promise.resolve(wdioConfig);
  }

  private runWdioWithSpawn(
    wdioConfigPath: string,
    port: number,
    testId: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const logFilePath = this.pathResolver.resolvePath(
        `logs/${testId}/wdio.log`,
      );
      // Create a writable stream for the log file and set to overwrite if it exists
      const logFileStream = createWriteStream(logFilePath, { flags: 'w' }); // 'w' mode overwrites the file

      const wdioProcess = spawn('npx', ['wdio', 'run', wdioConfigPath], {
        shell: true,
        stdio: ['inherit', 'pipe', 'pipe'], // Capture stdout and stderr for logging
      });

      // Pipe stdout and stderr to the log file
      wdioProcess.stdout?.pipe(logFileStream);
      wdioProcess.stderr?.pipe(logFileStream);

      wdioProcess.on('close', (code) => {
        logFileStream.end(); // Close the stream once the process is done
        console.log('Cucumber test Result code: ', code);
        if (code === 0) {
          this.logger.log('WDIO test execution completed successfully.');
          resolve();
        } else {
          console.warn(`WDIO process exited with code ${code}`);
          // reject(new Error(`WDIO process exited with code ${code}`));
          resolve();
        }
      });

      wdioProcess.on('error', (error) => {
        logFileStream.end();
        this.testRunService.updateTestRunResult(
          testId,
          TestStatusEnum.FAILED,
          error,
        );
        reject(new Error(`Error running WDIO: ${error.message}`));
      });
    });
  }

  private async handleCucumberResults(port: number) {
    try {
      // Get the latest JSON file from the results folder
      const resultsPath = this.pathResolver.resolvePath(`results/${port}`);

      const files = await fs.promises.readdir(resultsPath, {
        withFileTypes: true,
      });

      // Find the latest JSON file by filtering and sorting in one step
      const latestFile = files
        .filter((file) => file.isFile() && file.name.endsWith('.json'))
        .map((file) => ({
          // filePath: path.join(resultsPath, file.name),
          filePath: this.pathResolver.resolvePath(
            `results/${port}/${file.name}`,
          ),
          // birthtimeMs: fs.statSync(path.join(resultsPath, file.name))
          birthtimeMs: fs.statSync(
            this.pathResolver.resolvePath(`results/${port}/${file.name}`),
          ).birthtimeMs.birthtimeMs,
        }))
        .sort((a, b) => b.birthtimeMs - a.birthtimeMs)[0];

      if (!latestFile) {
        this.logger.error('No JSON result files found.');
        throw new Error('No JSON result files found.');
      }

      const latestFilePath = latestFile.filePath.replace(/\\/g, '/');

      const results = await fs.readJson(latestFilePath);

      //delete the file
      await fs.unlink(latestFilePath);
      this.logger.log('Cucumber results:', results);
      return results[0];
    } catch (error) {
      this.logger.error(`Error handling Cucumber results: ${error.message}`);
      throw error;
    }
  }

  private async generateAllureReport(testId: string) {
    try {
      // Run the Allure command to generate the report
      const resultDir = this.pathResolver.resolvePath(`results/${testId}`);
      const reportDir = this.pathResolver.resolvePath(`reports/${testId}`);
      const reportCommand = `allure generate --single-file ${resultDir} -o ${reportDir} --clean`;
      this.logger.log(`Generating Allure report for test ID: ${testId}`);

      await execPromise(reportCommand);

      //delete results/${testId} folder
      await fs.remove(resultDir);

      this.logger.log('Allure report generated successfully.');
    } catch (error) {
      this.logger.error(`Error generating Allure report: ${error.message}`);
      throw error;
    }
  }
}
