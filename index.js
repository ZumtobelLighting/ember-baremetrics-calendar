/* eslint-env node */
'use strict';

const path = require('path');
const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');
const map = require('broccoli-stew').map;

module.exports = {
  name: 'ember-baremetrics-calendar',

  init: function () {
    if (this._super.init) {
      this._super.init.apply(this, arguments);
    }
  },

  included: function () {
    this._super.included.apply(this, arguments);

    let findHost = this._findHost;
    let app = findHost.call(this);
    this.app = app;

    let options = app.options.baremetricsCalendar || {};

    app.import('vendor/moment.js');
    app.import('vendor/Calendar.js');

    if (options.includeStyles !== false) {
      app.import('vendor/ember-baremetrics-calendar/application.css');
    }
  },

  treeForVendor: function (vendorTree) {
    let BareMetricsTree = new Funnel(path.join(this.project.root, 'node_modules', 'BaremetricsCalendar', 'public', 'js'));
    //Only add if not FastBoot
    BareMetricsTree = map(BareMetricsTree, (content) => `if (typeof FastBoot === 'undefined') { ${content} }`);

    let MomentTree = new Funnel(path.join(this.project.root, 'node_modules', 'moment'), {
      files: ['moment.js'],
    });
    // Only add if not FastBoot
    MomentTree = map(MomentTree, (content) => `if (typeof FastBoot === 'undefined') { ${content} }`);

    let styleTree = new Funnel(path.join(this.project.root, 'node_modules', 'BaremetricsCalendar', 'public', 'css'), {
      destDir: 'ember-baremetrics-calendar'
    });

    let trees = [BareMetricsTree, MomentTree, styleTree];
    // Check if vendor tree is null
    if (vendorTree) {
      trees.push(vendorTree);
    }

    return new MergeTrees(trees);
  },
};
