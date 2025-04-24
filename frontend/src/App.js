import { useState, useEffect, useContext } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, SplitLayout, SplitCol, ScreenSpinner } from '@vkontakte/vkui';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';

import { UserInfoFirst, UserInfoSecond, WishList, Home, SuccessPage } from './panels';
import { DEFAULT_VIEW_PANELS } from './routes';
import { UserContext } from './Context/UserContext';


export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.HOME } = useActiveVkuiLocation();
  const [fetchedUser, setUser] = useState();
  const [popout, setPopout] = useState(<ScreenSpinner />);
  const { globalState, setGlobalState } = useContext(UserContext);

  useEffect(() => {
    async function fetchData() {
      const user = await bridge.send('VKWebAppGetUserInfo');
      setUser(user);
      setPopout(null);
      setGlobalState(prev => ({...prev, user: user}))
    }
    fetchData();
  }, []);

  return (
      <SplitLayout>
        <SplitCol>
          <View activePanel={activePanel}>
            <Home id="home" fetchedUser={fetchedUser} />
            <UserInfoFirst id="user_info_1"/>
            <UserInfoSecond id='user_info_2'/>
            <WishList id='wish_list'/>
            <SuccessPage id='success_page'/>
          </View>
        </SplitCol>
        {popout}
      </SplitLayout>
  );
};
