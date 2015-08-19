import View from 'ampersand-view';
import dom from 'ampersand-dom';
import mustache from 'mustache';
import webChannel from '../lib/web_channel';

export default View.extend({
  template: mustache.render(`<section class="page" data-hook="experiment-page">
               <h1 data-hook="displayName"></h1>
               <button data-hook="install">Install</button>
             </section>`),

  events: {
    'click button': 'onClick'
  },

  initialize(opts) {
    View.prototype.initialize.apply(this, arguments);
    if (opts && opts.experiment) {
      this.model = opts.experiment;
    }
  },

  render(opts) {
    View.prototype.render.apply(this, arguments);
    this.renderWithTemplate(this);

    if (opts && opts.experiment) {
      this.model = opts.experiment;
    }
    this.heading = this.el.querySelector('[data-hook=displayName]');
    dom.text(this.heading, this.model.displayName);

    this.button = this.el.querySelector('button');
    this.renderButton();
  },

  // TODO: move into a base view?
  remove() {
    const parent = this.el.parentNode;
    if (parent) parent.removeChild(this.el);
  },

  renderButton() {
    if (this.model.isInstalled) {
      dom.setAttribute(this.button, 'data-hook', 'uninstall');
      dom.text(this.button, 'Uninstall');
    } else {
      dom.setAttribute(this.button, 'data-hook', 'install');
      dom.text(this.button, 'Install');
    }
  },

  onClick(evt) {
    evt.preventDefault();
    // brain power failing me. choose which packet to send based on
    // the old state of the model. then, flip the state of the model.
    const isInstalling = !this.model.isInstalled;
    if (isInstalling) {
      webChannel.sendMessage('from-web-to-addon', { install: this.model.name });
    } else {
      webChannel.sendMessage('from-web-to-addon', { uninstall: this.model.name });
    }
    this.model.isInstalled = !this.model.isInstalled;

    this.renderButton();
  }

});
