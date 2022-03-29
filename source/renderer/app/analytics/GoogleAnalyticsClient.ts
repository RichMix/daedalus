import axios from 'axios';
import { AnalyticsClient } from './types';
import { Environment } from '../../../common/types/environment.types';
import formatCpuInfo from '../utils/formatCpuInfo';

interface GaCustomEventProps {
  /** @see https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ec */
  category: string;
  /** @see https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ea */
  action: string;
  /**
   * Often used as event value when it is not a number. (e.g. check `sendMachineSpec` event)
   * @see https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#el
   */
  label: string;
}

class GoogleAnalytics implements AnalyticsClient {
  constructor(
    private apiKey: string,
    private network: string,
    private userId: string,
    private environment: Environment
  ) {}

  private buildCustomEventPayload = (props: GaCustomEventProps) =>
    new URLSearchParams({
      v: '1',
      aip: '1',
      npa: '1',
      ni: '1',
      tid: this.apiKey,
      cid: this.userId,
      t: 'event',
      ec: props.category,
      ea: props.action,
      el: props.label,
    }).toString();

  private buildCustomEventBatchPayload = (propsArr: GaCustomEventProps[]) =>
    propsArr.map(this.buildCustomEventPayload).join('\n');

  /**
   * This event collects machine spec.
   *
   * Important:
   * Since it is not a real `event` by the design of Google Analytics (because it will be sent just once), we are using
   * event `action` property as event `subcategory` to simplify reporting in GA web panel.
   */
  sendMachineSpec = async () => {
    const eventPayload = this.buildCustomEventBatchPayload([
      {
        category: 'machine_spec_v1',
        action: 'network',
        label: this.network,
      },
      {
        category: 'machine_spec_v1',
        action: 'cpu_model',
        label: formatCpuInfo(this.environment.cpu),
      },
      {
        category: 'machine_spec_v1',
        action: 'ram_bytes',
        label: this.environment.ram.toString(),
      },
      {
        category: 'machine_spec_v1',
        action: 'os',
        label: this.environment.os,
      },
      {
        category: 'machine_spec_v1',
        action: 'os_arch',
        label: this.environment.system,
      },
    ]);

    await axios.post('https://www.google-analytics.com/batch', eventPayload);
  };

  async sendPageNavigationEvent() {
    throw new Error('Not implemented');
  }
}

export { GoogleAnalytics };
