/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiLink,
  EuiPanel,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';

import { getCategoryName } from '../../lib';
import { Field } from '../field';

export class Form extends PureComponent {

  static propTypes = {
    settings: PropTypes.object.isRequired,
    categories: PropTypes.array.isRequired,
    categoryCounts: PropTypes.object.isRequired,
    clearQuery: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired,
    showNoResultsMessage: PropTypes.bool.isRequired,
  }

  renderClearQueryLink(totalSettings, currentSettings) {
    const { clearQuery } = this.props;

    if (totalSettings !== currentSettings) {
      return (
        <EuiFlexItem grow={false}>
          <em>
            Search terms are hiding {totalSettings - currentSettings} settings {(
              <EuiLink onClick={clearQuery}>
                <em>(clear search)</em>
              </EuiLink>
            )}
          </em>
        </EuiFlexItem>
      );
    }

    return null;
  }

  renderCategory(category, settings, totalSettings) {
    return (
      <Fragment key={category}>
        <EuiPanel paddingSize="l">
          <EuiForm>
            <EuiText>
              <EuiFlexGroup alignItems="baseline">
                <EuiFlexItem grow={false}>
                  <h2>{getCategoryName(category)}</h2>
                </EuiFlexItem>
                {this.renderClearQueryLink(totalSettings, settings.length)}
              </EuiFlexGroup>
            </EuiText>
            <EuiSpacer size="m" />
            {settings.map(setting => {
              return (
                <Field
                  key={setting.name}
                  setting={setting}
                  save={this.props.save}
                  clear={this.props.clear}
                />
              );
            })}
          </EuiForm>
        </EuiPanel>
        <EuiSpacer size="l" />
      </Fragment>
    );
  }

  maybeRenderNoSettings(clearQuery) {
    if (this.props.showNoResultsMessage) {
      return (
        <EuiPanel paddingSize="l">
          No settings found <EuiLink onClick={clearQuery}>(Clear search)</EuiLink>
        </EuiPanel>
      );
    }
    return null;
  }

  render() {
    const { settings, categories, categoryCounts, clearQuery } = this.props;
    const currentCategories = [];

    categories.forEach(category => {
      if (settings[category] && settings[category].length) {
        currentCategories.push(category);
      }
    });

    return (
      <Fragment>
        {
          currentCategories.length ? currentCategories.map((category) => {
            return (
              this.renderCategory(category, settings[category], categoryCounts[category]) // fix this
            );
          }) : this.maybeRenderNoSettings(clearQuery)
        }
      </Fragment>
    );
  }
}
