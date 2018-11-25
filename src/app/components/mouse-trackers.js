import { h, views } from '../../lib/hyperapp/modules'

export default () =>
  h('div', { class: 'border' }, [
    h('h3', {}, `Mouse trackers`),
    h('div', { style: { overflow: 'hidden', width: '100%' } }, [
      h('div', { style: { float: 'left' } }, views.mouse.trackers.red.Panel()),
      h('div', { style: { float: 'left' } }, views.mouse.trackers.green.Panel()),
      h('div', { style: { float: 'left' } }, views.mouse.trackers.blue.Panel()),
    ])
  ]);
