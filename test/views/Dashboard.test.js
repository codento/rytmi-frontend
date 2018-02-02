import Vue from 'vue'
import jsdom from 'jsdom'
import DashBoard from '../../src/views/DashBoard.vue'

const renderer = require('vue-server-renderer').createRenderer()

describe('Test suite for HelloComponent', () => {
  it('Test data msg', () => {
    const ClonedComponent = Vue.extend(DashBoard)
    const NewComponent = new ClonedComponent().$mount()
    renderer.renderToString(NewComponent, (err, str) => {
      const dom = new jsdom.JSDOM(str);
      const firstHeading = dom.window.document.querySelector('p');
      expect(firstHeading.textContent).toContain('Hello World');
    });
  });
});