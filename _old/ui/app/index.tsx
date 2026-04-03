import React from 'react';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import "../global.css";
import { HomeConfig } from 'resourceViews/home/HomeConfig';
import { ContainerResourceView, DataBrowser, ProfileResourceView, RawCodeResourceView, Text, RdfResourceCreator, ContainerResourceCreator } from 'linked-data-browser';
import { NemalineCsvResourceCreator } from '../resourceCreators/NemalineCsvResourceCreator';
import { NemalineConfig } from '../resourceViews/nemaline/NemalineConfig';
import { StatisticAccessRuleConfig } from '../resourceViews/statisticAccessRule/StatisticAccessRuleConfig';

export function Screen() {

  return (
    <SafeAreaProvider>
      <StatusBar />
      <DataBrowser
        resourceViews={[HomeConfig, ProfileResourceView, ContainerResourceView, NemalineConfig, StatisticAccessRuleConfig, RawCodeResourceView]}
        resourceCreators={[RdfResourceCreator, ContainerResourceCreator, NemalineCsvResourceCreator]}
        mode={'server-ui'}
        renderLogo={() => <Text>Logo</Text>}
      />
    </SafeAreaProvider>
  );
}
