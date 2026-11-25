import { call, delay, select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { dynamic } from 'redux-saga-test-plan/providers';
import { Utils } from 'manifesto.js';
import { runSaga } from 'redux-saga';
import { http, HttpResponse } from 'msw';

import ActionTypes from '@src/state/actions/action-types';
import { setCanvas } from '@src/state/actions';
import MiradorCanvas from '@src/lib/MiradorCanvas';
import {
  getManifests,
  getManifestoInstance,
  getManifestSearchService,
  getCompanionWindowIdsForPosition,
  getSearchForWindow,
  getWorkspace,
  getElasticLayout,
  getWindow,
  getCanvasGrouping,
  getSelectedContentSearchAnnotationIds,
  getSortedSearchAnnotationsForCompanionWindow,
  getVisibleCanvasIds,
  getCanvasForAnnotation,
  getCanvases,
  getMiradorCanvasWrapper,
  getNextCanvasGrouping,
  getRequestsConfig,
  selectInfoResponses,
  getWindowConfig,
} from '@src/state/selectors';
import { fetchManifests } from '@src/state/sagas/iiif';
import windowsSaga, {
  determineAndShowCollectionDialog,
  fetchWindowManifest,
  setWindowDefaultSearchQuery,
  setWindowStartingCanvas,
  getAnnotationsBySearch,
  updateVisibleCanvases,
  setCanvasOfFirstSearchResult,
  setCanvasforSelectedAnnotation,
  panToFocusedWindow,
  setCurrentAnnotationsOnCurrentCanvas,
  fetchInfoResponses,
  prefetchNextInfoResponses,
  setCanvasOnNewSequence,
  setCollectionPath,
} from '@src/state/sagas/windows';
import fixture from '../../fixtures/version-2/019.json';
import collectionFixture from '../../fixtures/version-2/collection.json';
import { server } from '../../mocks/server';

describe('window-level sagas', () => {
  describe('fetchWindowManifest', () => {
    it('calls into fetchManifests for each window', () => {
      const action = {
        window: {
          id: 'x',
          manifestId: 'manifest.json',
        },
      };
      const manifest = Utils.parseManifest(fixture);

      return expectSaga(fetchWindowManifest, action)
        .provide([
          [select(getManifests), {}],
          [select(getManifestoInstance, { manifestId: 'manifest.json' }), manifest],
          [call(fetchManifests, 'manifest.json'), {}],
          [call(setWindowStartingCanvas, action)],
          [call(setWindowDefaultSearchQuery, action)],
          [call(setCollectionPath, { manifestId: 'manifest.json', windowId: 'x' })],
        ])
        .call(fetchManifests, 'manifest.json')
        .run();
    });
    it('calls additional methods after ensuring we have a manifest', () => {
      const action = {
        window: {
          id: 'x',
          manifestId: 'manifest.json',
        },
      };

      return expectSaga(fetchWindowManifest, action)
        .provide([
          [select(getManifests), { 'manifest.json': {} }],
          [call(setWindowStartingCanvas, action)],
          [call(setWindowDefaultSearchQuery, action)],
          [call(setCollectionPath, { manifestId: 'manifest.json', windowId: 'x' })],
          [call(determineAndShowCollectionDialog, 'manifest.json', 'x')],
        ])
        .call(setWindowStartingCanvas, action)
        .call(setWindowDefaultSearchQuery, action)
        .call(determineAndShowCollectionDialog, 'manifest.json', 'x')
        .run();
    });
  });

  describe('setCanvasOnNewSequence', () => {
    it('when a sequenceId is provided, set the canvasId', () => {
      const action = {
        id: 'x',
        payload: {
          sequenceId: 'foo',
        },
      };

      return expectSaga(setCanvasOnNewSequence, action)
        .provide([
          [select(getCanvases, { windowId: 'x' }), [{ id: 'a' }, { id: 'b' }]],
          [call(setCanvas, 'x', 'a'), { type: 'setCanvasThunk' }],
        ])
        .put({ type: 'setCanvasThunk' })
        .run();
    });
    it('when a sequenceId is not provided, return', () => {
      const action = {
        id: 'x',
      };

      return expectSaga(setCanvasOnNewSequence, action)
        .provide([])
        .run()
        .then(({ allEffects }) => allEffects.length === 0);
    });
  });

  describe('setWindowStartingCanvas', () => {
    it('calls setCanvas if the canvas id was provided', () => {
      const action = {
        window: {
          canvasId: '1',
          id: 'x',
          manifestId: 'manifest.json',
        },
      };

      return expectSaga(setWindowStartingCanvas, action)
        .provide([
          [select(getManifests), { 'manifest.json': {} }],
          [call(setCanvas, 'x', '1', null, { preserveViewport: false }), { type: 'setCanvasThunk' }],
        ])
        .put({ type: 'setCanvasThunk' })
        .run();
    });

    it('calls setCanvas if the canvas id was provided via the payload and preserves viewport', () => {
      const action = {
        id: 'x',
        payload: {
          canvasId: '1',
          manifestId: 'manifest.json',
        },
      };

      return expectSaga(setWindowStartingCanvas, action)
        .provide([
          [select(getManifests), { 'manifest.json': {} }],
          [call(setCanvas, 'x', '1', null, { preserveViewport: true }), { type: 'setCanvasThunk' }],
        ])
        .put({ type: 'setCanvasThunk' })
        .run();
    });

    it('overrides default preserveViewport: false when initialViewerConfig is set', () => {
      const action = {
        window: {
          canvasId: '1',
          id: 'x',
          initialViewerConfig: {
            x: 934,
            y: 782,
            zoom: 0.0007,
          },
          manifestId: 'manifest.json',
        },
      };

      return expectSaga(setWindowStartingCanvas, action)
        .provide([
          [select(getManifests), { 'manifest.json': {} }],
          [call(setCanvas, 'x', '1', null, { preserveViewport: true }), { type: 'setCanvasThunk' }],
        ])
        .put({ type: 'setCanvasThunk' })
        .run();
    });

    it('calculates the starting canvas and calls setCanvas', () => {
      const action = {
        window: {
          id: 'x',
          manifestId: 'manifest.json',
        },
      };

      const manifest = Utils.parseManifest({
        ...fixture,
        start: { id: 'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1' },
      });

      return expectSaga(fetchWindowManifest, action)
        .provide([
          [select(getManifests), { 'manifest.json': {} }],
          [select(getManifestoInstance, { manifestId: 'manifest.json' }), manifest],
          [call(setCanvas, 'x', 'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1'), { type: 'setCanvasThunk' }],
        ])
        .put({ type: 'setCanvasThunk' })
        .run();
    });

    // canvasIndex is not an officially documented/supported window setting --
    // this only exists to keep older configs/exported state working (see #4071).
    it('honors a legacy canvasIndex when the manifest has no start canvas', () => {
      const action = {
        window: {
          canvasIndex: 2,
          id: 'x',
          manifestId: 'manifest.json',
        },
      };

      const manifest = Utils.parseManifest(fixture);

      return expectSaga(fetchWindowManifest, action)
        .provide([
          [select(getManifests), { 'manifest.json': {} }],
          [select(getManifestoInstance, { manifestId: 'manifest.json' }), manifest],
          [call(setCanvas, 'x', 'https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1'), { type: 'setCanvasThunk' }],
        ])
        .put({ type: 'setCanvasThunk' })
        .run();
    });

    it('lets the manifest start canvas override a legacy canvasIndex', () => {
      const action = {
        window: {
          canvasIndex: 2,
          id: 'x',
          manifestId: 'manifest.json',
        },
      };

      const manifest = Utils.parseManifest({
        ...fixture,
        start: { id: 'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1' },
      });

      return expectSaga(fetchWindowManifest, action)
        .provide([
          [select(getManifests), { 'manifest.json': {} }],
          [select(getManifestoInstance, { manifestId: 'manifest.json' }), manifest],
          [call(setCanvas, 'x', 'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1'), { type: 'setCanvasThunk' }],
        ])
        .put({ type: 'setCanvasThunk' })
        .run();
    });
  });

  describe('setWindowDefaultSearchQuery', () => {
    it('does nothing if there was no default query', () => {
      const action = {
        window: {
          id: 'x',
          manifestId: 'manifest.json',
        },
      };

      return expectSaga(setWindowDefaultSearchQuery, action)
        .run()
        .then(({ allEffects }) => allEffects.length === 0);
    });

    it('encodes special characters in the default search query', () => {
      const action = {
        window: {
          defaultSearchQuery: 'hel^lo',
          id: 'x',
          manifestId: 'manifest.json',
        },
      };

      return expectSaga(setWindowDefaultSearchQuery, action)
        .provide([
          [select(getManifestSearchService, { windowId: 'x' }), { id: 'http://search/' }],
          [select(getCompanionWindowIdsForPosition, { position: 'left', windowId: 'x' }), ['left']],
        ])
        .put({
          companionWindowId: 'left',
          query: 'hel^lo',
          searchId: 'http://search/?q=hel%5Elo',
          type: ActionTypes.REQUEST_SEARCH,
          windowId: 'x',
        })
        .run()
        .then(({ allEffects }) => allEffects.length === 1);
    });

    it('initiates a search', () => {
      const action = {
        window: {
          defaultSearchQuery: 'xyz',
          id: 'x',
          manifestId: 'manifest.json',
        },
      };

      return expectSaga(setWindowDefaultSearchQuery, action)
        .provide([
          [select(getManifestSearchService, { windowId: 'x' }), { id: 'http://search/' }],
          [select(getCompanionWindowIdsForPosition, { position: 'left', windowId: 'x' }), ['left']],
        ])
        .put({
          companionWindowId: 'left',
          query: 'xyz',
          searchId: 'http://search/?q=xyz',
          type: ActionTypes.REQUEST_SEARCH,
          windowId: 'x',
        })
        .run()
        .then(({ allEffects }) => allEffects.length === 1);
    });
  });

  describe('setCurrentAnnotationsOnCurrentCanvas', () => {
    it('short circuits if there is no active search', () => {
      const action = {
        type: ActionTypes.SET_CANVAS,
        visibleCanvases: ['a'],
        windowId: 'abc123',
      };

      return expectSaga(setCurrentAnnotationsOnCurrentCanvas, action)
        .provide([[select(getSearchForWindow, { windowId: 'abc123' }), {}]])
        .run()
        .then(({ allEffects }) => allEffects.length === 0);
    });

    it('does nothing when there are no annotations targeting the current canvas', () => {
      const action = {
        type: ActionTypes.SET_CANVAS,
        visibleCanvases: ['a', 'b'],
        windowId: 'abc123',
      };

      return (
        expectSaga(setCurrentAnnotationsOnCurrentCanvas, action)
          .provide([
            [select(getSearchForWindow, { windowId: 'abc123' }), { cwid: {} }],
            [
              select(getAnnotationsBySearch, {
                canvasIds: ['a', 'b'],
                companionWindowIds: ['cwid'],
                windowId: 'abc123',
              }),
              {},
            ],
          ])
          .run()
          // Assert that nothing did happen, see https://github.com/jfairbank/redux-saga-test-plan/issues/137
          .then(({ effects }) => {
            expect(effects.select.length).toEqual(2);
            expect(effects.put).toBeUndefined();
          })
      );
    });

    it('selects content search annotations for the current searches', () => {
      const action = {
        type: ActionTypes.SET_CANVAS,
        visibleCanvases: ['a', 'b'],
        windowId: 'abc123',
      };

      return expectSaga(setCurrentAnnotationsOnCurrentCanvas, action)
        .provide([
          [select(getSearchForWindow, { windowId: 'abc123' }), { cwid: {} }],
          [
            select(getAnnotationsBySearch, {
              canvasIds: ['a', 'b'],
              companionWindowIds: ['cwid'],
              windowId: 'abc123',
            }),
            { cwid: ['annoId'] },
          ],
        ])
        .put({
          annotationIds: ['annoId'],
          companionWindowId: 'cwid',
          type: ActionTypes.SET_CONTENT_SEARCH_CURRENT_ANNOTATIONS,
          windowId: 'abc123',
        })
        .put({
          annotationId: 'annoId',
          type: ActionTypes.SELECT_ANNOTATION,
          windowId: 'abc123',
        })
        .run();
    });
  });

  describe('panToFocusedWindow', () => {
    it('does nothing if pan was disabled', () => {
      const action = {
        pan: false,
        windowId: 'x',
      };

      return expectSaga(panToFocusedWindow, action)
        .run()
        .then(({ allEffects }) => allEffects.length === 0);
    });

    it('sets the viewport position to the newly focused window', () => {
      const action = {
        pan: true,
        windowId: 'x',
      };
      return expectSaga(panToFocusedWindow, action)
        .provide([
          [
            select(getWorkspace),
            {
              viewportPosition: { height: 100, width: 100 },
            },
          ],
          [
            select(getElasticLayout),
            {
              x: {
                height: 50,
                width: 50,
                x: 50,
                y: 12,
              },
            },
          ],
        ])
        .put({
          payload: {
            position: {
              x: 25,
              y: -13,
            },
          },
          type: ActionTypes.SET_WORKSPACE_VIEWPORT_POSITION,
        })
        .run();
    });
  });

  describe('updateVisibleCanvases', () => {
    it('recalculates the visible canvases', () => {
      const windowId = 'x';
      const action = {
        windowId,
      };

      return expectSaga(updateVisibleCanvases, action)
        .provide([
          [select(getWindow, { windowId }), { canvasId: 'y' }],
          [select(getCanvasGrouping, { canvasId: 'y', windowId }), [{ id: 'y' }, { id: 'z' }]],
          [call(setCanvas, windowId, 'y', ['y', 'z']), { type: 'expectedThunk' }],
        ])
        .put({ type: 'expectedThunk' })
        .run();
    });
  });

  describe('setCanvasOfFirstSearchResult', () => {
    it('updates the current canvas', () => {
      const companionWindowId = 'x';
      const windowId = 'y';
      const action = {
        companionWindowId,
        type: ActionTypes.RECEIVE_SEARCH,
        windowId,
      };

      return expectSaga(setCanvasOfFirstSearchResult, action)
        .provide([
          [select(getWindowConfig, { windowId }), { switchCanvasOnSearch: true }],
          [select(getSelectedContentSearchAnnotationIds, { companionWindowId, windowId }), []],
          [select(getSortedSearchAnnotationsForCompanionWindow, { companionWindowId, windowId }), [{ id: 'a' }, { id: 'b' }]],
        ])
        .put({
          annotationId: 'a',
          type: 'mirador/SELECT_ANNOTATION',
          windowId: 'y',
        })
        .run();
    });

    it('does nothing if a search annotation is already selected', () => {
      const companionWindowId = 'x';
      const windowId = 'y';
      const action = {
        companionWindowId,
        type: ActionTypes.RECEIVE_SEARCH,
        windowId,
      };

      return expectSaga(setCanvasOfFirstSearchResult, action)
        .provide([
          [select(getWindowConfig, { windowId }), { switchCanvasOnSearch: true }],
          [select(getSelectedContentSearchAnnotationIds, { companionWindowId, windowId }), ['y']],
        ])
        .run()
        .then(({ allEffects }) => allEffects.length === 0);
    });

    it('does nothing if canvas switching for searches is disabled', () => {
      const companionWindowId = 'x';
      const windowId = 'y';
      const action = {
        companionWindowId,
        type: ActionTypes.RECEIVE_SEARCH,
        windowId,
      };

      return expectSaga(setCanvasOfFirstSearchResult, action)
        .provide([[select(getWindowConfig, { windowId }), { switchCanvasOnSearch: false }]])
        .run()
        .then(({ allEffects }) => allEffects.length === 0);
    });
  });

  describe('setCanvasforSelectedAnnotation', () => {
    it('changes the canvas to that of the selected annotation', () => {
      const annotationId = ['a'];
      const windowId = 'y';
      const action = {
        annotationId,
        type: ActionTypes.SELECT_ANNOTATION,
        windowId,
      };

      return expectSaga(setCanvasforSelectedAnnotation, action)
        .provide([
          [select(getVisibleCanvasIds, { windowId }), ['q']],
          [select(getCanvasForAnnotation, { annotationId, windowId }), { id: 'z' }],
          [call(setCanvas, windowId, 'z'), { type: 'expectedThunk' }],
        ])
        .put({ type: 'expectedThunk' })
        .run();
    });

    it('does nothing if the canvas is already visible', () => {
      const annotationId = 'a';
      const windowId = 'y';
      const action = {
        annotationId,
        type: ActionTypes.SELECT_ANNOTATION,
        windowId,
      };

      return expectSaga(setCanvasforSelectedAnnotation, action)
        .provide([
          [select(getVisibleCanvasIds, { windowId }), ['z']],
          [select(getCanvasForAnnotation, { annotationId, windowId }), { id: 'z' }],
        ])
        .run()
        .then(({ allEffects }) => allEffects.length === 0);
    });

    it('does nothing if the annotation is not on one of our canvases', () => {
      const annotationId = 'a';
      const windowId = 'y';
      const action = {
        annotationId,
        type: ActionTypes.SELECT_ANNOTATION,
        windowId,
      };

      return expectSaga(setCanvasforSelectedAnnotation, action)
        .provide([
          [select(getVisibleCanvasIds, { windowId }), ['z']],
          [select(getCanvasForAnnotation, { annotationId, windowId }), null],
        ])
        .run()
        .then(({ allEffects }) => allEffects.length === 0);
    });
  });

  describe('fetchInfoResponses', () => {
    it('requests info responses for each visible canvas', () => {
      const action = {
        visibleCanvases: ['http://iiif.io/api/presentation/2.0/example/fixtures/canvas/24/c1.json'],
        windowId: 'foo',
      };

      const manifest = Utils.parseManifest(fixture);

      return expectSaga(fetchInfoResponses, action)
        .provide([
          [select(getCanvases, { windowId: 'foo' }), manifest.getSequences()[0].getCanvases()],
          [select(selectInfoResponses), {}],
        ])
        .put.like({
          action: {
            infoId: 'https://stacks.stanford.edu/image/iiif/hg676jb4964%2F0380_796-44',
            type: 'mirador/REQUEST_INFO_RESPONSE',
          },
        })
        .run();
    });

    it('requests nothing if the response is  already in the store', () => {
      const action = {
        visibleCanvases: ['http://iiif.io/api/presentation/2.0/example/fixtures/canvas/24/c1.json'],
        windowId: 'foo',
      };

      const manifest = Utils.parseManifest(fixture);

      return expectSaga(fetchInfoResponses, action)
        .provide([
          [select(getCanvases, { windowId: 'foo' }), manifest.getSequences()[0].getCanvases()],
          [select(selectInfoResponses), { 'https://stacks.stanford.edu/image/iiif/hg676jb4964%2F0380_796-44': {} }],
        ])
        .not.put.like({
          action: {
            infoId: 'https://stacks.stanford.edu/image/iiif/hg676jb4964%2F0380_796-44',
            type: 'mirador/REQUEST_INFO_RESPONSE',
          },
        })
        .run();
    });

    it('joins a speculative request that is already in flight instead of requesting twice', async () => {
      const action = {
        visibleCanvases: ['http://iiif.io/api/presentation/2.0/example/fixtures/canvas/24/c1.json'],
        windowId: 'foo',
      };
      const manifest = Utils.parseManifest(fixture);
      const infoId = 'https://stacks.stanford.edu/image/iiif/hg676jb4964%2F0380_796-44';
      const speculative = new Map();
      let recorded = false;
      let storeAfterJoin;
      const started = runSaga({ dispatch: () => {}, getState: () => ({}) }, function* prefetch() {
        yield delay(20);
        recorded = true;
      });
      speculative.set(infoId, started);

      const { allEffects } = await expectSaga(fetchInfoResponses, action, speculative)
        .provide([
          [select(getCanvases, { windowId: 'foo' }), manifest.getSequences()[0].getCanvases()],
          [
            select(selectInfoResponses),
            dynamic(() => {
              if (!recorded) return {};
              storeAfterJoin = { [infoId]: { isFetching: false, json: {} } };
              return storeAfterJoin;
            }),
          ],
        ])
        .silentRun();

      expect(storeAfterJoin).toBeDefined();
      expect(allEffects.filter((effect) => effect.type === 'PUT')).toEqual([]);
      expect(started.isRunning()).toBe(false);
    });

    it('requests normally when the speculative request did not record a response', async () => {
      const action = {
        visibleCanvases: ['http://iiif.io/api/presentation/2.0/example/fixtures/canvas/24/c1.json'],
        windowId: 'foo',
      };
      const manifest = Utils.parseManifest(fixture);
      const infoId = 'https://stacks.stanford.edu/image/iiif/hg676jb4964%2F0380_796-44';
      const speculative = new Map();
      const failed = runSaga({ dispatch: () => {}, getState: () => ({}) }, function* prefetch() {
        yield delay(10);
      });
      speculative.set(infoId, failed);

      const { effects } = await expectSaga(fetchInfoResponses, action, speculative)
        .provide([
          [select(getCanvases, { windowId: 'foo' }), manifest.getSequences()[0].getCanvases()],
          [select(selectInfoResponses), {}],
        ])
        .silentRun();

      expect(effects.put.map((effect) => effect.payload.action)).toEqual([
        {
          imageResource: expect.anything(),
          infoId,
          type: 'mirador/REQUEST_INFO_RESPONSE',
          windowId: 'foo',
        },
      ]);
    });
  });

  describe('prefetchNextInfoResponses', () => {
    const canvases = Utils.parseManifest(fixture).getSequences()[0].getCanvases();
    const serviceId = (canvas) => canvas.getImages()[0].getResource().getServices()[0].id;
    const currentId = serviceId(canvases[0]);
    const action = { visibleCanvases: [canvases[0].id], windowId: 'foo' };

    /** Provides the selectors the prefetch saga reads, in order. */
    const provider = ({
      requests = { prefetchNextImageInfo: true },
      responses = { [currentId]: { isFetching: false, json: {} } },
      visible = [canvases[0].id],
    } = {}) => [
      [select(getRequestsConfig), requests],
      [select(getNextCanvasGrouping, { windowId: 'foo' }), canvases.slice(1)],
      [select(getCanvases, { windowId: 'foo' }), canvases],
      [select(getVisibleCanvasIds, { windowId: 'foo' }), visible],
      [select(getMiradorCanvasWrapper), (canvas) => new MiradorCanvas(canvas)],
      [select(selectInfoResponses), responses],
    ];

    afterEach(() => server.resetHandlers());

    it('prefetches only the image metadata of the next group, one request at a time', async () => {
      const nextIds = canvases.slice(1).map(serviceId);
      server.use(
        ...nextIds.map((id) =>
          http.get(`${id}/info.json`, () =>
            HttpResponse.json({ '@id': id, height: 100, profile: 'http://iiif.io/api/image/2/level2.json', width: 100 }),
          ),
        ),
      );

      const { effects, allEffects } = await expectSaga(prefetchNextInfoResponses, action, new Map())
        .provide(provider())
        .silentRun();

      expect(effects.fork.map((effect) => effect.payload.fn.name)).toEqual([
        'prefetchPublicInfoResponse',
        'prefetchPublicInfoResponse',
      ]);
      expect(effects.put.map((effect) => effect.payload.action.infoId)).toEqual(nextIds);
      expect(
        allEffects.filter((effect) => effect.type === 'CALL' && String(effect.payload.args[0]).endsWith('default.jpg')),
      ).toEqual([]);
    });

    it('does nothing unless the viewer opts in', async () => {
      const { allEffects } = await expectSaga(prefetchNextInfoResponses, action, new Map())
        .provide(provider({ requests: {} }))
        .silentRun();

      expect(allEffects).toEqual([expect.objectContaining({ type: 'SELECT' })]);
    });

    it('does nothing when custom request processors are configured', async () => {
      const { allEffects } = await expectSaga(prefetchNextInfoResponses, action, new Map())
        .provide(provider({ requests: { postprocessors: [() => {}], prefetchNextImageInfo: true } }))
        .silentRun();

      expect(allEffects).toEqual([expect.objectContaining({ type: 'SELECT' })]);
    });

    it('waits for the current group and gives up when its request failed', async () => {
      const { allEffects } = await expectSaga(prefetchNextInfoResponses, action, new Map())
        .provide(provider({ responses: {} }))
        .silentRun(15000);

      expect(allEffects.filter((effect) => effect.type === 'FORK')).toEqual([]);
      expect(allEffects.filter((effect) => effect.type === 'PUT')).toEqual([]);
    });

    it('does nothing on the last page', async () => {
      const { allEffects } = await expectSaga(prefetchNextInfoResponses, action, new Map())
        .provide([
          [select(getRequestsConfig), { prefetchNextImageInfo: true }],
          [select(getNextCanvasGrouping, { windowId: 'foo' }), undefined],
        ])
        .silentRun();

      expect(allEffects.filter((effect) => effect.type === 'FORK')).toEqual([]);
    });

    it('stops when the visible canvas changed while waiting', async () => {
      const nextIds = canvases.slice(1).map(serviceId);
      server.use(
        ...nextIds.map((id) =>
          http.get(`${id}/info.json`, () =>
            HttpResponse.json({ '@id': id, height: 100, profile: 'http://iiif.io/api/image/2/level2.json', width: 100 }),
          ),
        ),
      );

      const { effects } = await expectSaga(prefetchNextInfoResponses, action, new Map())
        .provide(provider({ visible: [canvases[1].id] }))
        .silentRun();

      expect(effects.fork).toBeUndefined();
      expect(effects.put).toBeUndefined();
    });
  });

  describe('windowsSaga wiring', () => {
    const rootEffects = windowsSaga().next().value;
    const setCanvasWorkers = rootEffects.payload
      .filter((effect) => effect.type === 'FORK' && effect.payload.args[0] === ActionTypes.SET_CANVAS)
      .map((effect) => effect.payload.args[1]);

    it('starts the next-page prefetch for a canvas change', () => {
      expect(setCanvasWorkers).toHaveLength(3);
    });

    it('stops the speculative prefetch when a viewer state is imported', () => {
      const action = { visibleCanvases: [], windowId: 'foo' };
      const { value } = setCanvasWorkers[2](action).next();

      expect(value.type).toBe('RACE');
      expect(Object.keys(value.payload)).toEqual(['prefetch', 'replaced']);
      expect(value.payload.replaced.payload.pattern).toBe(ActionTypes.IMPORT_MIRADOR_STATE);
    });
  });

  describe('determineAndShowCollectionDialog', () => {
    it('shows the collection dialog if it is a collection', () => {
      const manifest = Utils.parseManifest(collectionFixture);

      return expectSaga(determineAndShowCollectionDialog, 'manifest.json', 'x')
        .provide([[select(getManifestoInstance, { manifestId: 'manifest.json' }), manifest]])
        .put.like({
          action: {
            dialogCollectionPath: [],
            manifestId: 'manifest.json',
            type: 'mirador/SHOW_COLLECTION_DIALOG',
            windowId: 'x',
          },
        })
        .run();
    });

    it('does nothing if not a collection', () => {
      const manifest = Utils.parseManifest(fixture);

      return expectSaga(determineAndShowCollectionDialog, 'manifest.json', 'x')
        .provide([[select(getManifestoInstance, { manifestId: 'manifest.json' }), manifest]])
        .not.put.like({
          action: {
            dialogCollectionPath: [],
            manifestId: 'manifest.json',
            type: 'mirador/SHOW_COLLECTION_DIALOG',
            windowId: 'x',
          },
        })
        .run();
    });
  });
});
