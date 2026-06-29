/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MainLayout } from './components/MainLayout';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ConverterWidget } from './components/ConverterWidget';

export default function App() {
  return (
    <MainLayout
      header={<Header />}
      footer={<Footer />}
    >
      <ConverterWidget />
    </MainLayout>
  );
}

