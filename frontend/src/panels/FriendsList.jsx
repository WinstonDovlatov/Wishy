import { Panel, PanelHeader, Header, PanelHeaderBack, Div, Group, ScreenSpinner, Placeholder, Button, Snackbar, Paragraph, SimpleCell, Avatar} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import DynamicPresentsForm from '../components/DynamicPresentsForm';
import { UserContext } from '../Context/UserContext';
import React, { useState, useContext, useEffect} from 'react';
import bridge from '@vkontakte/vk-bridge';
import {Icon56ErrorOutline, Icon56UserAddBadgeOutline, Icon28UserOutline, Icon56UsersOutline, Icon28CheckCircleOutline} from '@vkontakte/icons';

export const FriendsList = ({ id }) => {
  const { globalState, setGlobalState } = useContext(UserContext);
  const routeNavigator = useRouteNavigator();
  const [popout, setPopout] = useState(null);
  const clearPopout = () => setPopout(null);
  const setLoadingPopout = () => setPopout(<ScreenSpinner state="loading" />);
  const [token, setToken] = useState(null);
  const [isError, setIsError] = useState(false);
  const [friends, setFriends] = useState(null);
  const [friendLoaded, setFriendLoaded] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  const openSuccessSnackbar = () => {
    if (snackbar) return;
    setSnackbar(
      <Snackbar onClose={() => setSnackbar(null)} before={<Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />}>
        Ссылка скопирована!
      </Snackbar>);};

const copyToClipboard = async () => {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText("https://vk.com/app53419760");
        return true;
      } catch (e) {
        console.log("Modern API не сработал, используем fallback");
      }
    }

    const textarea = document.createElement('textarea');
    textarea.value = "https://vk.com/app53419760";
    
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    textarea.setAttribute('readonly', '');
    textarea.contentEditable = 'true';
    
    document.body.appendChild(textarea);
    
    if (navigator.userAgent.match(/iphone|ipad|ipod/i)) {
      const range = document.createRange();
      range.selectNodeContents(textarea);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      textarea.setSelectionRange(0, 999999);
    } else {
      textarea.select();
    }

      try {
        document.execCommand('copy');
      } catch (err) {
        return false;
      } finally {
        document.body.removeChild(textarea);
      }

      return true;
  };

  async function handleInvite() {
    copyToClipboard();
    openSuccessSnackbar();
  }

  async function handlePresentsButton(friend_to_info) {
    console.log(friend_to_info)
    setGlobalState(prev => ({...prev, friend_to: friend_to_info}))
    routeNavigator.push('/friend_presents')
  }

  async function fetchToken() {
    setLoadingPopout()
    await bridge.send('VKWebAppGetAuthToken', {
      app_id: 53419760, 
      scope: 'friends'
    }).then (
      (data) => {
        setToken(data.access_token)
        setIsError(false)
      }
    ).catch( (error) => {
      console.log(error);
      setIsError(true)
    });
    clearPopout()
  }

  async function fetchFriens() {
    setLoadingPopout()

    try {
      const response = await bridge.send('VKWebAppCallAPIMethod', {
        method: 'friends.get',
        params: {
          fields: 'photo_200_orig,domain,bdate',
          v: '5.199',
          access_token: token 
        }
      });

      const response2 = await fetch(`https://whishy.ru/api/unique_ids`);
      const data = await response2.json();
      const filteredFriends = response.response.items.filter(friend => 
        data.unique_ids.includes(friend.id)
      );
      
      console.log(filteredFriends)
      setFriends(filteredFriends);
    } catch (error) {
        console.log(error)
        // setIsError(true)
    } finally {
        setFriendLoaded(true);
        clearPopout();
    }
  }

    useEffect(() => {
        fetchToken();
    }, []);

    useEffect(() => {
        if (token) {
            fetchFriens()
        }
    }, [token]);




  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
        Друзья
      </PanelHeader>
      {popout}
        {isError && (
            <Group>
            <Placeholder
                    icon={<Icon56ErrorOutline />}
                    title="Пожалуйста, предоставьте приложению доступ к списку друзей."
                    action={<Button size="m" style={{ whiteSpace: 'normal !important' }} onClick={fetchToken}><Paragraph style={{ whiteSpace: 'normal' }}>Предоставить доступ</Paragraph></Button>}
                >Иначе у нас не будет возможности подсказать, что им подарить.
            </Placeholder>
            </Group>
        )}

        {!isError && friendLoaded && token && (
            <>
            <Group>
            <Placeholder
                    icon={<Icon56UsersOutline />}
                    title="Приглашай друзей, чтобы знать, что им подарить!"
                    action={<Button size="m" onClick={handleInvite}><Paragraph style={{ whiteSpace: 'normal' }}>Копировать ссылку-приглашение</Paragraph></Button>}
                >
            </Placeholder>
            </Group>
            <Group header={<Header size="s">Список друзей</Header>}>
              {friends.length > 0 ? (
                friends.map(friend => (
                  <SimpleCell
                    key={friend.id}
                    before={<Avatar size={40} src={friend.photo_200_orig} fallbackIcon={<Icon28UserOutline/>}/>}
                    after={<Button onClick={() => {handlePresentsButton(friend)}}>Подарки</Button>}
                    
                  >
                    {friend.first_name} {friend.last_name}
                  </SimpleCell>
                ))
              ) : (
                <Placeholder
                  icon={<Icon56UserAddBadgeOutline />}
                  title="Пока что никто из твоих друзей не использовал приложение"
                >
                  Пригласи их!
                </Placeholder>
              )}
            </Group>
            </>
        )}

        {snackbar}
    </Panel>
  );
};
