import {
  createHashRouter,
  createPanel,
  createRoot,
  createView,
  RoutesConfig,
} from '@vkontakte/vk-mini-apps-router';

export const DEFAULT_ROOT = 'default_root';

export const DEFAULT_VIEW = 'default_view';

export const DEFAULT_VIEW_PANELS = {
  HOME: 'home',
  USER_INFO_1: 'user_info_1',
  USER_INFO_2: 'user_info_2',
  WISH_LIST: 'wish_list',
  SUCCESS: 'success_page',
  FRIENDSLIST: 'firend_lsit',
  FRIENDPRESENTS: 'friend_presents'
};
export const routes = RoutesConfig.create([
  createRoot(DEFAULT_ROOT, [
    createView(DEFAULT_VIEW, [
      createPanel(DEFAULT_VIEW_PANELS.HOME, '/', []),
      createPanel(DEFAULT_VIEW_PANELS.USER_INFO_1, `/${DEFAULT_VIEW_PANELS.USER_INFO_1}`, []),
      createPanel(DEFAULT_VIEW_PANELS.USER_INFO_2, `/${DEFAULT_VIEW_PANELS.USER_INFO_2}`, []),
      createPanel(DEFAULT_VIEW_PANELS.WISH_LIST, `/${DEFAULT_VIEW_PANELS.WISH_LIST}`, []),
      createPanel(DEFAULT_VIEW_PANELS.SUCCESS, `/${DEFAULT_VIEW_PANELS.SUCCESS}`, []),
      createPanel(DEFAULT_VIEW_PANELS.FRIENDSLIST, `/${DEFAULT_VIEW_PANELS.FRIENDSLIST}`, []),
      createPanel(DEFAULT_VIEW_PANELS.FRIENDPRESENTS, `/${DEFAULT_VIEW_PANELS.FRIENDPRESENTS}`, [])
    ]),
  ]),
]);

export const router = createHashRouter(routes.getRoutes());
