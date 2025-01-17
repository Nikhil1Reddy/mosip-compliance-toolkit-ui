export const AUTH_ERROR_CODE = ['KER-ATH-007', 'KER-ATH-006'];

//service request id's
export const SBI_PROJECT_ADD_ID = 'mosip.toolkit.sbi.project.add';
export const SDK_PROJECT_ADD_ID = 'mosip.toolkit.sdk.project.add';
export const SDK_PROJECT_UPDATE_ID = 'mosip.toolkit.sdk.project.update';
export const VALIDATIONS_ADD_ID = 'mosip.toolkit.api.id.validations';
export const GENERATE_SDK_REQUEST_ID = 'mosip.toolkit.api.id.generate.sdk.request';
export const COLLECTION_ADD_ID = 'mosip.toolkit.collection.add';
export const COLLECTION_TESTCASES_ADD_ID = 'mosip.toolkit.collection.testcase.add';
export const TEST_RUN_ADD_ID = 'mosip.toolkit.testrun.add';
export const TEST_RUN_UPDATE_ID = 'mosip.toolkit.testrun.update';
export const TEST_RUN_DETAILS_ADD_ID = 'mosip.toolkit.testrun.details.add';
export const BIOMETRICS_TEST_DATA_ADD_ID = 'mosip.toolkit.biometric.testdata.add';
export const TEST_RUN_DELETE_ID = 'mosip.toolkit.testrun.delete';

export const VERSION = '1.0';

export const SUCCESS = 'success';
export const FAILURE = 'failure';
export const VALIDATIONS_LIST = 'validationsList';
export const VALIDATIONS_RESPONSE = 'validationResponse';
export const NAME = 'name';
export const RESPONSE = 'response';
export const ERROR_CODE = 'errorCode';
export const MESSAGE = 'message';
export const ERRORS = 'errors';
export const TESTCASES = 'testcases';
export const ID = 'id';
export const COLLECTION_ID = 'collectionId';
export const PROJECT_ID = 'projectId';
export const SDK = 'SDK';
export const SBI = 'SBI';
export const ABIS = 'ABIS';
export const COMMON_CONTROLS = ['name', 'projectType'];
export const SDK_CONTROLS = ['sdkSpecVersion','sdkUrl', 'sdkPurpose', 'bioTestData'];
export const SBI_CONTROLS = [
  'sbiSpecVersion',
  'sbiPurpose',
  'deviceType',
  'deviceSubType',
];
export const ABIS_CONTROLS = ['abisUrl', 'username', 'password', 'queueName'];
export const TEST_DATA_CONTROLS= ['name', 'type', 'purpose'];
export const SBI_KEY_ROTATION_ITERATIONS = 'keyRotationIterations';
//SBI methods related constants
export const BIOMETRIC_DEVICE = 'Biometric Device';
export const SBI_METHOD_DEVICE = 'device';
export const SBI_METHOD_DEVICE_KEY = 'MOSIPDISC';
export const SBI_METHOD_DEVICE_INFO = 'info';
export const SBI_METHOD_DEVICE_INFO_KEY = 'MOSIPDINFO';
export const SBI_METHOD_CAPTURE = 'capture';
export const SBI_METHOD_CAPTURE_KEY = 'CAPTURE';
export const SBI_METHOD_RCAPTURE = 'rcapture';
export const SBI_METHOD_RCAPTURE_KEY = 'RCAPTURE';
export const SBI_METHOD_STREAM = 'stream';
export const SBI_METHOD_STREAM_KEY = 'STREAM';
export const DEVELOPER = 'Developer';

//localStorage keys
export const SBI_SCAN_COMPLETE = 'sbiScanComplete';
export const SBI_SCAN_DATA = 'sbiScanData';
export const SBI_SELECTED_DEVICE = 'sbiSelectedDevice';
export const SBI_SELECTED_PORT = 'sbiSelectedPort';
export const SDK_PROJECT_URL = 'sdkProjectUrl';
