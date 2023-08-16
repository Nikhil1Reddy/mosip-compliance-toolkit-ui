import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/authservice.service';
import { Router } from '@angular/router';
import { DataService } from '../../../core/services/data-service';
import * as appConstants from 'src/app/app.constants';
import { Subscription } from 'rxjs';
import { SbiProjectModel } from 'src/app/core/models/sbi-project';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import Utils from 'src/app/app.utils';
import { SdkProjectModel } from 'src/app/core/models/sdk-project';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { UserProfileService } from 'src/app/core/services/user-profile.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { AbisProjectModel } from 'src/app/core/models/abis-project';
import { AppConfigService } from 'src/app/app-config.service';
import { DialogComponent } from 'src/app/core/components/dialog/dialog.component';

@Component({
  selector: 'app-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
})
export class AddProjectComponent implements OnInit {
  resourceBundleJson: any = {};
  projectForm = new FormGroup({});
  allControls: string[];
  isAndroidAppMode = environment.isAndroidAppMode == 'yes' ? true : false;
  textDirection: any = this.userProfileService.getTextDirection();
  buttonPosition: any = this.textDirection == 'rtl' ? {'float': 'left'} : {'float': 'right'};
  subscriptions: Subscription[] = [];
  bioTestDataFileNames: string[] = [];
  hidePassword = true;
  dataLoaded = false;
  dataSubmitted = false;
  isAbisPartner = this.appConfigService.getConfig()['abisPartnerType'] == "ABIS_PARTNER" ? true : false;
  invalidPartnerType: string = '';
  deviceImage1: any = null;
  deviceImage2: any = null;
  deviceImage3: any = null;
  deviceImage4: any = null;
  deviceImage5: any = null;
  imageUrls: any[] = [null, null, null, null];

  constructor(
    public authService: AuthService,
    private dataService: DataService,
    private appConfigService: AppConfigService,
    private dialog: MatDialog,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private userProfileService: UserProfileService,
    private translate:TranslateService
  ) {}

  async ngOnInit() {
    this.translate.use(this.userProfileService.getUserPreferredLanguage());
    this.resourceBundleJson = await Utils.getResourceBundle(this.userProfileService.getUserPreferredLanguage(), this.dataService);
    this.invalidPartnerType = this.isAbisPartner
      ? ''
      : this.resourceBundleJson.addProject['invalidPartnerTypeMsg'];
    this.initForm();
    this.initBreadCrumb();
    const projectType = this.projectForm.controls['projectType'].value;
    if (projectType == appConstants.SDK) {
      const bioTestDataList: any = await Utils.getBioTestDataNames(this.projectForm.controls['sdkPurpose'].value, this.dataService,this.resourceBundleJson, this.dialog);
      if (bioTestDataList && bioTestDataList.length > 0) {
        this.bioTestDataFileNames = [];
        for (let name of bioTestDataList) {
          this.bioTestDataFileNames.push(name);
        }
      }
    }
    if (projectType == appConstants.ABIS) {
      const bioTestDataList: any = await Utils.getBioTestDataNames(appConstants.ABIS, this.dataService,this.resourceBundleJson, this.dialog);
      if (bioTestDataList && bioTestDataList.length > 0) {
        this.bioTestDataFileNames = [];
        for (let name of bioTestDataList) {
          this.bioTestDataFileNames.push(name);
        }
      }
    } 
    this.dataLoaded = true;
  }

  initBreadCrumb() {
    const breadcrumbLabels = this.resourceBundleJson['breadcrumb'];
    if (breadcrumbLabels) {
      this.breadcrumbService.set('@homeBreadCrumb', `${breadcrumbLabels.home}`);
      this.breadcrumbService.set('@addProjectBreadCrumb', `${breadcrumbLabels.addNewProject}`);
    }
  }

  initForm() {
    this.allControls = [
      ...appConstants.COMMON_CONTROLS,
      ...appConstants.SBI_CONTROLS,
      ...appConstants.SDK_CONTROLS,
      ...appConstants.ABIS_CONTROLS,
    ];
    this.allControls.forEach((controlId) => {
      this.projectForm.addControl(controlId, new FormControl(''));
    });
    appConstants.COMMON_CONTROLS.forEach((controlId) => {
      this.projectForm.controls[controlId].setValidators(Validators.required);
    });
    this.projectForm.patchValue({
      abisUrl: 'wss://{base_URL}/ws',
      outboundQueueName: 'ctk-to-abis',
      inboundQueueName: 'abis-to-ctk'
    });
  }

  async handleProjectTypeChange() {
    const projectType = this.projectForm.controls['projectType'].value;
    if (projectType == appConstants.SDK) {
      appConstants.SDK_CONTROLS.forEach((controlId) => {
        this.projectForm.controls[controlId].setValidators(Validators.required);
        if (controlId == 'sdkUrl') {
          this.projectForm.controls[controlId].setValidators([
            Validators.required,
            Validators.pattern('^(http|https)://(.*)'),
          ]);
        }
      });
      appConstants.SBI_CONTROLS.forEach((controlId) => {
        this.projectForm.controls[controlId].clearValidators();
        this.projectForm.controls[controlId].updateValueAndValidity();
      });
      appConstants.ABIS_CONTROLS.forEach((controlId) => {
        this.projectForm.controls[controlId].clearValidators();
        this.projectForm.controls[controlId].updateValueAndValidity();
      });
    }
    if (projectType == appConstants.SBI) {
      appConstants.SBI_CONTROLS.forEach((controlId) => {
        this.projectForm.controls[controlId].setValidators(Validators.required);
      });
      appConstants.SDK_CONTROLS.forEach((controlId) => {
        this.projectForm.controls[controlId].clearValidators();
        this.projectForm.controls[controlId].updateValueAndValidity();
      });
      appConstants.ABIS_CONTROLS.forEach((controlId) => {
        this.projectForm.controls[controlId].clearValidators();
        this.projectForm.controls[controlId].updateValueAndValidity();
      });
    }
    if (projectType == appConstants.ABIS) {
      appConstants.ABIS_CONTROLS.forEach((controlId) => {
        this.projectForm.controls[controlId].setValidators(Validators.required);
        if (controlId == 'abisUrl') {
          this.projectForm.controls[controlId].setValidators([
            Validators.required,
            Validators.pattern('^(ws|wss)://.*\\/ws$'),
          ]);
        }
      });
      appConstants.SBI_CONTROLS.forEach((controlId) => {
        this.projectForm.controls[controlId].clearValidators();
        this.projectForm.controls[controlId].updateValueAndValidity();
      });
      appConstants.SDK_CONTROLS.forEach((controlId) => {
        this.projectForm.controls[controlId].clearValidators();
        this.projectForm.controls[controlId].updateValueAndValidity();
      });
      const bioTestDataList: any = await Utils.getBioTestDataNames(appConstants.ABIS, this.dataService,this.resourceBundleJson, this.dialog);
      if (bioTestDataList && bioTestDataList.length > 0) {
        this.bioTestDataFileNames = [];
        for (let name of bioTestDataList) {
          this.bioTestDataFileNames.push(name);
        }
      }
    }
  }

  async handleSdkPurposeChange() {
    const bioTestDataList: any = await Utils.getBioTestDataNames(this.projectForm.controls['sdkPurpose'].value, this.dataService,this.resourceBundleJson, this.dialog);
    if (bioTestDataList && bioTestDataList.length > 0) {
      this.bioTestDataFileNames = [];
      for (let name of bioTestDataList) {
        this.bioTestDataFileNames.push(name);
      }
    }
  }

  async saveProject() {
    appConstants.COMMON_CONTROLS.forEach((controlId) => {
      this.projectForm.controls[controlId].markAsTouched();
    });
    this.projectForm.controls['projectType'].markAsTouched();
    const projectType = this.projectForm.controls['projectType'].value;
    console.log(`saveProject for type: ${projectType}`);
    if (projectType == appConstants.SDK) {
      appConstants.SDK_CONTROLS.forEach((controlId) => {
        this.projectForm.controls[controlId].markAsTouched();
      });
    }
    if (projectType == appConstants.SBI) {
      appConstants.SBI_CONTROLS.forEach((controlId) => {
        this.projectForm.controls[controlId].markAsTouched();
      });
    }
    if (projectType == appConstants.ABIS) {
      appConstants.ABIS_CONTROLS.forEach((controlId) => {
        this.projectForm.controls[controlId].markAsTouched();
      });
    }
    const projectName = this.projectForm.controls['name'].value;
    if (projectName.trim().length === 0) {
      this.projectForm.controls['name'].setValue(null);
    } else {
      this.projectForm.controls['name'].setValue(projectName);
    }
    if (this.projectForm.valid) {
      //Save the project in db
      console.log('valid');
      if (projectType == appConstants.SBI) {
        const projectData: SbiProjectModel = {
          id: '',
          name: this.projectForm.controls['name'].value,
          projectType: this.projectForm.controls['projectType'].value,
          sbiVersion: this.projectForm.controls['sbiSpecVersion'].value,
          purpose: this.projectForm.controls['sbiPurpose'].value,
          deviceType: this.projectForm.controls['deviceType'].value,
          deviceSubType: this.projectForm.controls['deviceSubType'].value,
          deviceImage1: this.deviceImage1,
          deviceImage2: this.deviceImage2,
          deviceImage3: this.deviceImage3,
          deviceImage4: this.deviceImage4,
          sbiHash: this.projectForm.controls['sbiHash'].value,
          websiteUrl: this.projectForm.controls['websiteUrl'].value
        };
        let request = {
          id: appConstants.SBI_PROJECT_ADD_ID,
          version: appConstants.VERSION,
          requesttime: new Date().toISOString(),
          request: projectData,
        };
        this.dataLoaded = false;
        this.dataSubmitted = true;
        await this.addSbiProject(request);
      }
      if (projectType == appConstants.SDK) {
        const projectData: SdkProjectModel = {
          id: '',
          name: this.projectForm.controls['name'].value,
          projectType: this.projectForm.controls['projectType'].value,
          sdkVersion: this.projectForm.controls['sdkSpecVersion'].value,
          purpose: this.projectForm.controls['sdkPurpose'].value,
          url: this.projectForm.controls['sdkUrl'].value,
          sdkHash: this.projectForm.controls['sdkHash'].value,
          websiteUrl: this.projectForm.controls['websiteUrl'].value,
          bioTestDataFileName: this.projectForm.controls['bioTestData'].value,
        };
        let request = {
          id: appConstants.SDK_PROJECT_ADD_ID,
          version: appConstants.VERSION,
          requesttime: new Date().toISOString(),
          request: projectData,
        };
        this.dataLoaded = false;
        this.dataSubmitted = true;
        await this.addSdkProject(request);
      }
      if (projectType == appConstants.ABIS) {
        const projectData: AbisProjectModel = {
          id: '',
          name: this.projectForm.controls['name'].value,
          projectType: this.projectForm.controls['projectType'].value,
          abisVersion: this.projectForm.controls['abisSpecVersion'].value,
          url: this.projectForm.controls['abisUrl'].value,
          username:this.projectForm.controls['username'].value,
          password:this.projectForm.controls['password'].value,
          outboundQueueName:this.projectForm.controls['outboundQueueName'].value,
          inboundQueueName:this.projectForm.controls['inboundQueueName'].value,
          modality:this.projectForm.controls['modality'].value,
          abisHash:this.projectForm.controls['abisHash'].value,
          websiteUrl:this.projectForm.controls['websiteUrl'].value,
          bioTestDataFileName: this.projectForm.controls['abisBioTestData'].value,
        };
        let request = {
          id: appConstants.ABIS_PROJECT_ADD_ID,
          version: appConstants.VERSION,
          requesttime: new Date().toISOString(),
          request: projectData,
        };
        this.dataLoaded = false;
        this.dataSubmitted = true;
        await this.addAbisProject(request);
      }
    }
  }

  handleSbiPurposeChange() {
    console.log('handleSbiPurposeChange');
    this.projectForm.controls['deviceSubType'].setValue('');
  }

  async addSbiProject(request: any) {
    return new Promise((resolve, reject) => {
      this.subscriptions.push(
        this.dataService.addSbiProject(request).subscribe(
          (response: any) => {
            console.log(response);
            resolve(this.getProjectResponse(response));
          },
          (errors) => {
            this.dataLoaded = true;
            this.dataSubmitted = false;
            Utils.showErrorMessage(this.resourceBundleJson, errors, this.dialog);
            resolve(false);
          }
        )
      );
    });
  }

  async addSdkProject(request: any) {
    return new Promise((resolve, reject) => {
      this.subscriptions.push(
        this.dataService.addSdkProject(request).subscribe(
          (response: any) => {
            console.log(response);
            resolve(this.getProjectResponse(response));
          },
          (errors) => {
            this.dataLoaded = true;
            this.dataSubmitted = false;
            Utils.showErrorMessage(this.resourceBundleJson, errors, this.dialog);
            resolve(false);
          }
        )
      );
    });
  }

  async addAbisProject(request: any) {
    return new Promise((resolve, reject) => {
      this.subscriptions.push(
        this.dataService.addAbisProject(request).subscribe(
          (response: any) => {
            console.log(response);
            resolve(this.getProjectResponse(response));
          },
          (errors) => {
            this.dataLoaded = true;
            this.dataSubmitted = false;
            Utils.showErrorMessage(this.resourceBundleJson, errors, this.dialog);
            resolve(false);
          }
        )
      );
    });
  }

  getProjectResponse(response: any){
    if (response.errors && response.errors.length > 0) {
      this.dataLoaded = true;
      this.dataSubmitted = false;
      Utils.showErrorMessage(this.resourceBundleJson, response.errors, this.dialog);
      return true;
    } else {
      let resourceBundle = this.resourceBundleJson.dialogMessages;
      let successMsg = 'success';
      let projectMsg = 'successMessage';
      this.dataLoaded = true;
      const dialogRef = Utils.showSuccessMessage(
        resourceBundle,
        successMsg,
        projectMsg,
        this.dialog
      );
      dialogRef.afterClosed().subscribe((res) => {
        this.showDashboard()
          .catch((error) => {
            console.log(error);
          });
      });
      return true;
    }
  }

  async showDashboard() {
    await this.router.navigate([`toolkit/dashboard`]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  clickOnButton() {
    this.projectForm.controls['name'].clearValidators();
    this.projectForm.controls['name'].updateValueAndValidity();
    appConstants.SBI_CONTROLS.forEach((controlId) => {
      this.projectForm.controls[controlId].clearValidators();
      this.projectForm.controls[controlId].updateValueAndValidity();
    });
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '450px',
      height: '360px',
      data: {
        case: "UPLOAD_DEVICE_IMAGES",
        selectedDeviceImagesUrl: this.imageUrls,
      },
    });
    dialogRef.afterClosed().subscribe((base64Url: string[]) => {
      if (base64Url && base64Url.length > 0) {
        this.deviceImage1 = base64Url[0];
        this.deviceImage2 = base64Url[1];
        this.deviceImage3 = base64Url[2];
        this.deviceImage4 = base64Url[3];
      }
      this.imageUrls = base64Url;
      appConstants.SBI_CONTROLS.forEach((controlId) => {
        this.projectForm.controls[controlId].setValidators(Validators.required);
      });
    });
  }
}
