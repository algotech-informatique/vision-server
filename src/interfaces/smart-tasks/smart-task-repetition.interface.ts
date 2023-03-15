export interface SmartTaskRepetition {
  frequency?: number | '*';
  repeatType: 'hours' | 'days' | 'months';
}
