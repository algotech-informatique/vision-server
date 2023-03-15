import { SmartTaskDto } from '@algotech/core';

export const smartTask1: SmartTaskDto = {
  enabled: true,
  flowKey: 'test',
  flowType: 'smartflow',
  name: 'task1',
  periodicity: {
    repeatEvery: [{
      repeatType: 'days',
      frequency: 3,
    },
    {
      repeatType: 'months',
      frequency: '*',
    }],
    dateRange: {
      start: '',
    },
    skipImmediate: true,
    timeZone: 'Europe/Paris',
  },
  priority: 'low',
  userUuid: 'test',
  inputs: [],
};

export const disabledSmartTask: SmartTaskDto = {
  enabled: false,
  flowKey: 'test',
  flowType: 'smartflow',
  name: 'task2',
  periodicity: {
    repeatEvery: [{
      repeatType: 'days',
      frequency: 3,
    },
    {
      repeatType: 'months',
      frequency: '*',
    }],
    dateRange: {
      start: '',
    },
    skipImmediate: true,
    timeZone: 'Europe/Paris',
  },
  priority: 'low',
  userUuid: 'test',
  inputs: [],
};

export const updateSmartTask1: SmartTaskDto = {
  enabled: true,
  flowKey: 'test',
  flowType: 'smartflow',
  name: 'task1',
  periodicity: {
    repeatEvery: [{
      repeatType: 'days',
      frequency: 3,
    },
    {
      repeatType: 'months',
      frequency: 4,
    }],
    dateRange: {
      start: '',
    },
    skipImmediate: true,
    timeZone: 'Europe/Paris',
  },
  priority: 'low',
  userUuid: 'test',
  inputs: [],
};
