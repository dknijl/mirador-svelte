import { createTargetToPluginMapping } from '@src/extend/pluginMapping';

describe('createTargetToPluginMapping', () => {
  it('returns empty object if plugin array is empty', () => {
    expect(createTargetToPluginMapping([])).toEqual({});
  });

  it('should create a mapping from targets to plugins and modes', () => {
    /** */
    const component = (props) => null;

    const plugins = [
      { component, mode: 'wrap', target: 'Window' },
      { component, mode: 'wrap', target: 'Window' },
      { component, mode: 'add', target: 'Window' },
      { component, mode: 'add', target: 'Window' },

      { component, mode: 'wrap', target: 'TopBar' },
      { component, mode: 'wrap', target: 'TopBar' },
      { component, mode: 'add', target: 'TopBar' },
      { component, mode: 'add', target: 'TopBar' },
    ];

    expect(createTargetToPluginMapping(plugins)).toEqual({
      TopBar: {
        add: [
          { component, mode: 'add', target: 'TopBar' },
          { component, mode: 'add', target: 'TopBar' },
        ],
        wrap: [
          { component, mode: 'wrap', target: 'TopBar' },
          { component, mode: 'wrap', target: 'TopBar' },
        ],
      },
      Window: {
        add: [
          { component, mode: 'add', target: 'Window' },
          { component, mode: 'add', target: 'Window' },
        ],
        wrap: [
          { component, mode: 'wrap', target: 'Window' },
          { component, mode: 'wrap', target: 'Window' },
        ],
      },
    });
  });
});

it('leaves state-only and companion registrations out of UI slots', () => {
  expect(
    createTargetToPluginMapping([{ reducers: { example: () => 1 } }, { component: () => {}, companionWindowKey: 'example' }]),
  ).toEqual({});
});
it('isolates mappings between viewer instances', () => {
  const plugin = { target: 'Window', mode: 'wrap', component: () => {} };
  const first = createTargetToPluginMapping([plugin]);
  const second = createTargetToPluginMapping([]);
  expect(first.Window.wrap).toEqual([plugin]);
  expect(second.Window).toBeUndefined();
});
