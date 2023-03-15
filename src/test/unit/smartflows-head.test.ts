import { WorkflowLaunchOptionsDto } from '@algotech/core';
import { of } from 'rxjs';
import { IdentityRequest } from '../../interfaces';
import { AuthHead, DocumentsHead, SmartFlowsHead, SmartFlowsInput, SmartFlowsService } from '../../providers';
import { SoUtilsService } from '../../providers/workflow-interpretor';
import { identity, formData2Simple, smartflowSimple, sysfile1, smartflowMultiple, formData2Multiple, formDataFileNotFound, formDataImportFileError, launchOptions, launchOptionsMultiple } from '../fixtures/smartflows-head-unit-test';

describe(SmartFlowsHead.name, () => {
  let smartFlowsService: SmartFlowsService
  let smartFlowsHead: SmartFlowsHead;
  let documentsHead: DocumentsHead;
  let soUtilsService: SoUtilsService;
  let authHead: AuthHead
  let canStart;
  beforeAll( (done) => {
    process.env.CUSTOMER_KEY = 'algotech';
    soUtilsService = new SoUtilsService(null, null, null, null);
    authHead = new AuthHead(null);
    smartFlowsService = new SmartFlowsService(null, soUtilsService)
    documentsHead = new DocumentsHead(null, null, null, null);
    smartFlowsHead = new SmartFlowsHead(smartFlowsService, null, null, null, null, null, null, authHead, documentsHead);
    canStart = true;
    done();
  })

  beforeEach(() => {
    canStart = true;
  })

  describe(SmartFlowsHead.prototype._getSysFiles.name, () => {

    it('should return canStart = false and files = [] sysfile: multiple = false', (done) => {
      canStart = false;
      jest.spyOn(DocumentsHead.prototype, 'uploadDocument').mockReturnValue(of(sysfile1));

      smartFlowsHead._getSysFiles(identity, smartflowSimple.variables, canStart, [{
        fieldname: 'formData2',
        buffer: 'buffer', originalname: 'originalname', size: 'size', mimetype: 'mimetype'
      }]).subscribe({
        next: (res: { canStart: boolean, files: SmartFlowsInput[] }) => {
          expect(res.canStart).toBe(false);
          expect(res.files.length).toBe(0);
          done();
        },
        error: (err) => {
          return Promise.reject(SmartFlowsHead.prototype._getSysFiles + 'upload returns sysfile error');
        },
      });
    });

    it('should return canStart = true a nd sysfile: multiple = false', (done) => {
      jest.spyOn(DocumentsHead.prototype, 'uploadDocument').mockReturnValue(of(sysfile1));

      smartFlowsHead._getSysFiles(identity, smartflowSimple.variables, canStart, [{
        fieldname: 'formData2',
        buffer: 'buffer', originalname: 'originalname', size: 'size', mimetype: 'mimetype'
      }]).subscribe({
        next: (res: { canStart: boolean, files: SmartFlowsInput[] }) => {
          expect(res.canStart).toBe(true);
          expect(res.files).toEqual(expect.arrayContaining([formData2Simple]));
          done();
        },
        error: (err) => {
          return Promise.reject(SmartFlowsHead.prototype._getSysFiles + 'upload returns sysfile error');
        },
      });
    });

    it('should return canStart = true a nd sysfile: multiple = true + error on formData3', (done) => {
      jest.spyOn(DocumentsHead.prototype, 'uploadDocument').mockReturnValue(of(sysfile1));

      smartFlowsHead._getSysFiles(identity, smartflowMultiple.variables, canStart, [{
        fieldname: 'formData2',
        buffer: 'buffer', originalname: 'originalname', size: 'size', mimetype: 'mimetype'
      }, {
        fieldname: 'formData2',
        buffer: 'buffer', originalname: 'originalname', size: 'size', mimetype: 'mimetype'
      }]).subscribe({
        next: (res: { canStart: boolean, files: SmartFlowsInput[] }) => {
          expect(res.canStart).toBe(true);
          expect(res.files).toEqual(expect.arrayContaining([formData2Multiple, formDataFileNotFound]));
          done();
        },
        error: (err) => {
          return Promise.reject(SmartFlowsHead.prototype._getSysFiles + 'upload returns sysfile error');
        },
      });
    });

    it('should return canStart = true error on formData2 multiple = false', (done) => {
      jest.spyOn(DocumentsHead.prototype, 'uploadDocument').mockReturnValue(of(null));

      smartFlowsHead._getSysFiles(identity, smartflowSimple.variables, canStart, [{
        fieldname: 'formData2',
        buffer: 'buffer', originalname: 'originalname', size: 'size', mimetype: 'mimetype'
      }]).subscribe({
        next: (res: { canStart: boolean, files: SmartFlowsInput[] }) => {
          expect(res.canStart).toBe(true);
          expect(res.files).toEqual(expect.arrayContaining([formDataImportFileError]));
          done();
        },
        error: (err) => {
          return Promise.reject(SmartFlowsHead.prototype._getSysFiles + 'upload returns sysfile error');
        },
      });
    });

  });

  describe(SmartFlowsHead.prototype.getSmartFlowLanchOptions.name, () => {

    it('should return canStart = false smartflowSimple avec JWT', (done) => {
      jest.spyOn(AuthHead.prototype, 'validateTokenUser').mockReturnValue(of(false));
      jest.spyOn(SmartFlowsService.prototype, 'getSmartFlow').mockReturnValue(of(smartflowSimple));
      smartFlowsHead.getSmartFlowLanchOptions('POST', 'route', {}, {}, {}, [], []).subscribe({
        next: (res: {
          canStart: boolean,
          identity: IdentityRequest,
          launchOptions: WorkflowLaunchOptionsDto,
          inputErrors: SmartFlowsInput[]
        }) => {
          expect(res.canStart).toBe(false);
          done();
        },
        error: (err) => {
          return Promise.reject('must return canStart = false smartflowSimple avec JWT');
        },
      });
    });

    it('should return canStart = false smartflowSimple avec JWT', (done) => {
      jest.spyOn(AuthHead.prototype, 'validateTokenUser').mockReturnValue(of(false));
      jest.spyOn(SmartFlowsService.prototype, 'getSmartFlow').mockReturnValue(of(smartflowSimple));
      smartFlowsHead.getSmartFlowLanchOptions('POST', 'route', {},
        {
          authorization: 'Bearer token'
        }, {}, [], []).subscribe({
          next: (res: {
            canStart: boolean,
            identity: IdentityRequest,
            launchOptions: WorkflowLaunchOptionsDto,
            inputErrors: SmartFlowsInput[]
          }) => {
            expect(res.canStart).toBe(false);
            done();
          },
          error: (err) => {
            return Promise.reject('must return canStart = false smartflowSimple avec JWT');
          },
        });
    });

    it('should return canStart = false smartflowSimple avec JWT', (done) => {
      jest.spyOn(AuthHead.prototype, 'validateTokenUser').mockReturnValue(of(true));
      jest.spyOn(SmartFlowsService.prototype, 'getSmartFlow').mockReturnValue(of(smartflowSimple));
      jest.spyOn(DocumentsHead.prototype, 'uploadDocument').mockReturnValue(of(sysfile1));
      jest.spyOn(SmartFlowsService.prototype, 'getLauchOptions').mockReturnValue(launchOptions);
      smartFlowsHead.getSmartFlowLanchOptions('POST', 'route',
        { formData1: 'abcd' },
        {
          header1: 'tata',
          authorization: 'Bearer token'
        },
        {
          string: 'toto',
          number: 1.0,
          boolean: false,
          date: '2020/12/12'
        },
        ['test'],
        [
          {
            fieldname: 'formData2',
            buffer: 'buffer', originalname: 'originalname', size: 'size', mimetype: 'mimetype'
          }
        ]).subscribe({
          next: (res: {
            canStart: boolean,
            identity: IdentityRequest,
            launchOptions: WorkflowLaunchOptionsDto,
            inputErrors: SmartFlowsInput[]
          }) => {
            expect(res).toStrictEqual({
              canStart: true, identity: {
                customerKey: 'algotech',
                groups: [
                  'sadmin',
                ],
                login: 'sadmin',
              },
              ...launchOptions
            });
            done();
          },
          error: (err) => {
            return Promise.reject('must return canStart = false smartflowSimple avec JWT');
          },
        });
    });

    it('should return canStart = false smartflowMultiple avec auth webhook', (done) => {
      jest.spyOn(SmartFlowsService.prototype, 'getSmartFlow').mockReturnValue(of(smartflowMultiple));
      jest.spyOn(DocumentsHead.prototype, 'uploadDocument').mockReturnValue(of(sysfile1));
      jest.spyOn(SmartFlowsService.prototype, 'getLauchOptions').mockReturnValue(launchOptionsMultiple);
      smartFlowsHead.getSmartFlowLanchOptions('POST', 'route', {}, {}, {}, [], []).subscribe({
        next: (res: {
          canStart: boolean,
          identity: IdentityRequest,
          launchOptions: WorkflowLaunchOptionsDto,
          inputErrors: SmartFlowsInput[]
        }) => {
          expect(res.canStart).toBe(false);
          done();
        },
        error: (err) => {
          return Promise.reject('must return canStart = false smartflowMultiple avec auth webhook');
        },
      });
    });

    it('should return canStart = true smartflowMultiple avec webhook', (done) => {
      jest.spyOn(SmartFlowsService.prototype, 'getSmartFlow').mockReturnValue(of(smartflowMultiple));
      jest.spyOn(DocumentsHead.prototype, 'uploadDocument').mockReturnValue(of(sysfile1));
      jest.spyOn(SmartFlowsService.prototype, 'getLauchOptions').mockReturnValue(launchOptionsMultiple);
      smartFlowsHead.getSmartFlowLanchOptions('POST', 'route',
        { formData1: 'abcd' },
        {
          header1: 'tata',
          webhook: 'token'
        },
        {
          string: 'toto',
          number: 1.0,
          boolean: false,
          date: '2020/12/12'
        },
        ['test'],
        [
          {
            fieldname: 'formData2',
            buffer: 'buffer', originalname: 'originalname', size: 'size', mimetype: 'mimetype'
          }
        ]).subscribe({
          next: (res: {
            canStart: boolean,
            identity: IdentityRequest,
            launchOptions: WorkflowLaunchOptionsDto,
            inputErrors: SmartFlowsInput[]
          }) => {
            expect(res).toStrictEqual({
              canStart: true, identity: {
                customerKey: 'algotech',
                groups: [
                  'sadmin',
                ],
                login: 'sadmin',
              },
              ...launchOptionsMultiple
            });
            done();
          },
          error: (err) => {
            return Promise.reject('must return canStart = true smartflowMultiple avec webhook');
          },
        });
    });
  });
});
