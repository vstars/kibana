/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { LOGGING_TAG, KIBANA_MONITORING_LOGGING_TAG } from '../../../../common/constants';
import { EventRoller } from './event_roller';
import { CloudDetector } from '../../../cloud';

/**
 * Manage the buffer of Kibana Ops events
 * @param {Object} server HapiJS server instance
 * @return {Object} the revealed `push` and `flush` modules
 */
export function opsBuffer(server) {
  // determine the cloud service in the background
  const cloudDetector = new CloudDetector();
  cloudDetector.detectCloudService();

  const eventRoller = new EventRoller();

  return {
    push(event) {
      eventRoller.addEvent(event);
      server.log(['debug', LOGGING_TAG, KIBANA_MONITORING_LOGGING_TAG], 'Received Kibana Ops event data');
    },

    flush() {
      let cloud; // a property that will be left out of the result if the details are undefined
      const cloudDetails = cloudDetector.getCloudDetails();
      if (cloudDetails != null) {
        cloud = { cloud: cloudDetails };
      }

      return {
        ...cloud,
        ...eventRoller.flush()
      };
    }
  };
}
