import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as appConstants from 'src/app/app.constants';
import { DataService } from '../../../core/services/data-service';
import { AppConfigService } from '../../../app-config.service';
import { Subscription } from 'rxjs';
import { CdTimerComponent } from 'angular-cd-timer';
import { SbiTestCaseService } from '../../../core/services/sbi-testcase-service';
import { TestCaseModel } from 'src/app/core/models/testcase';
import Utils from 'src/app/app.utils';

@Component({
  selector: 'app-execute-test-run',
  templateUrl: './execute-test-run.component.html',
  styleUrls: ['./execute-test-run.component.css'],
})
export class ExecuteTestRunComponent implements OnInit {
  input: any;
  collectionId: string;
  projectType: string;
  collectionName: string;
  errInFetchingTestcases = false;
  subscriptions: Subscription[] = [];
  scanComplete = true;
  runComplete = false;
  currectTestCaseId: string;
  currectTestCaseName: string;
  errorsExist = false;
  errorsSummary = '';
  testCasesList: any;
  dataLoaded = false;
  @ViewChild('basicTimer', { static: true }) basicTimer: CdTimerComponent;
  countOfSuccessTestcases = 0;
  countOfFailedTestcases = 0;

  constructor(
    private dialogRef: MatDialogRef<ExecuteTestRunComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService,
    private sbiTestCaseService: SbiTestCaseService,
    private appConfigService: AppConfigService
  ) {
    dialogRef.disableClose = true;
  }

  async ngOnInit() {
    this.input = this.data;
    this.collectionId = this.input.collectionId;
    this.projectType = this.input.projectType;
    if (this.projectType == appConstants.SBI && this.scanComplete) {
      await this.getCollection();
      await this.getTestcasesForCollection();
      this.dataLoaded = true;
      if (!this.errInFetchingTestcases) {
        if (this.basicTimer) {
          this.basicTimer.start();
        }
        await this.executeRun();
        if (this.basicTimer) {
          this.basicTimer.stop();
        }
      }
    }
  }

  async getCollection() {
    return new Promise((resolve, reject) => {
      this.subscriptions.push(
        this.dataService.getCollection(this.collectionId).subscribe(
          (response: any) => {
            if (response.errors && response.errors.length > 0) {
              this.errInFetchingTestcases = true;
              resolve(true);
            }  
            this.collectionName = response['response']['name'];
            resolve(true);
          },
          (errors) => {
            this.errInFetchingTestcases = true;
            resolve(true);
          }
        )
      );
    });
  }

  async getTestcasesForCollection() {
    return new Promise((resolve, reject) => {
      this.subscriptions.push(
        this.dataService.getTestcasesForCollection(this.collectionId).subscribe(
          (response: any) => {
            if (response.errors && response.errors.length > 0) {
              this.errInFetchingTestcases = true;
              resolve(true);
            }  
            console.log(response);
            this.testCasesList = response['response']['testcases'];
            resolve(true);
          },
          (errors) => {
            this.errInFetchingTestcases = true;
            resolve(true);
          }
        )
      );
    });
  }
  async executeRun() {
    const sbiSelectedPort = localStorage.getItem(
      appConstants.SBI_SELECTED_PORT
    );
    const sbiSelectedDevice = localStorage.getItem(
      appConstants.SBI_SELECTED_DEVICE
    );
    this.errorsExist = false;
    if (sbiSelectedPort && sbiSelectedDevice) {
      const testCasesList: TestCaseModel[] = this.testCasesList;
      for (const testCase of testCasesList) {
        this.currectTestCaseId = testCase.testId;
        this.currectTestCaseName = testCase.testName;
        let allValidatorsPassed = false;
        let res: any = null;
        console.log('executing testcase: ' + testCase.testName);
        if (this.projectType == appConstants.SBI) {
          res = await this.sbiTestCaseService.runTestCase(
            testCase,
            sbiSelectedPort,
            sbiSelectedDevice
          );
          this.currectTestCaseId = '';
          this.currectTestCaseName = '';
        }
        if (res && res['response']) {
          let countofPassedValidators = 0;
          const response = res['response'];
          const errors = res['errors'];
          if (errors && errors.length > 0) {
            this.errorsExist = true;
            errors.forEach((err: any) => {
              this.errorsSummary = err['errorCode'] + ' - ' + err['message'];
            });
          }
          const validationsList = response['validationsList'];
          if (validationsList) {
            validationsList.forEach((validationitem: any) => {
              if (validationitem.status == 'success') {
                countofPassedValidators++;
              }
            });
            if (validationsList.length == countofPassedValidators) {
              allValidatorsPassed = true;
            }
          }
        }
        if (allValidatorsPassed) {
          this.countOfSuccessTestcases++;
        } else {
          this.countOfFailedTestcases++;
        }
      }
      this.runComplete = true;
    } else {
      this.scanComplete = false;
    }
  }
  close() {
    this.dialogRef.close();
  }
  saveTestRun() {}
  showTestRunDetails() {}
}