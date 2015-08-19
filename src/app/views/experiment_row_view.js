import View from 'ampersand-view';
import dom from 'ampersand-dom';

export default View.extend({
  template: '<li>Experiment name: <a class="name"></a> <button data-hook="install">Install</button></li>',

  events: {
    'click button': 'onClick'
  },

  initialize() {
    View.prototype.initialize.apply(this, arguments);

    this.model.on('change:isInstalled', this.renderButton, this);
  },

  render() {
    View.prototype.render.apply(this, arguments);

    dom.text(this.el.querySelector('.name'), this.model.name);

    this.button = this.el.querySelector('button');
    this.renderButton();
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
    // instead of installing from here, load the detail page. we'll install from there instead.
    window.app.router.navigate('experiments/' + this.model.name);
  }
});
