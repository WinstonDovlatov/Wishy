import { Panel, PanelHeader, Cell, Header, Div, Group, PanelHeaderBack, Placeholder, Button, Avatar, ScreenSpinner, Title, Accordion, CardGrid, ContentCard } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { UserContext } from '../Context/UserContext';
import React, { useState, useContext, useEffect} from 'react';
import {Icon56CheckCircleOutline, Icon28UserOutline } from '@vkontakte/icons';


export const FriendPresents = ({ id }) => {
  const routeNavigator = useRouteNavigator();
  const { globalState, setGlobalState } = useContext(UserContext);
  const [popout, setPopout] = useState(null);
  const clearPopout = () => setPopout(null);
  const setLoadingPopout = () => setPopout(<ScreenSpinner state="loading" />);
  const [superInfo, setSuperInfo] = useState(null);

  async function fetchPresents() {
    try{
        const response = await fetch(`https://whishy.ru/api/presents?id=${globalState.friend_to['id']}`);
        const data = await response.json();
        setSuperInfo(data)
    } catch {
        console.log('hui')
    }
  }

    useEffect(() => {
        setLoadingPopout()
        fetchPresents();
        clearPopout()
    }, []);



  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
        Наши рекомендации
      </PanelHeader>
        <Group header={<Header size="s">Подарки для вашего друга</Header>}>
          <Cell before={<Avatar size={48} src={globalState.friend_to.photo_200_orig} fallbackIcon={<Icon28UserOutline/>} />} subtitle={globalState.friend_to?.city?.title}>
            {`${globalState.friend_to.first_name} ${globalState.friend_to.last_name}`}
          </Cell>
        </Group>
        {/* <Button onClick={() => {console.log(superInfo)}}></Button> */}
        <Group>
            <Div style={{ textAlign: 'center' }}><Title>Рекомендуемые подарки</Title></Div>
            
            {superInfo?.profile_presents?.filter( item => item && typeof item === 'string' && item.trim() !== '' ).length > 2 && (
                <Accordion>
                    <Accordion.Summary>Базовые подарки</Accordion.Summary>
                    <Accordion.Content>
                        <Div>
                            <CardGrid size="l">  
                                {superInfo['profile_presents'].map((present, index) => (
                                    <ContentCard title={`${index + 1}. ${present}`} key={`prof_pres_${index}`}/>                  
                                ))}
                            </CardGrid>
                        </Div>
                    </Accordion.Content>
                </Accordion>
            )}

            {superInfo?.dialog_presents?.filter( item => item && typeof item === 'string' && item.trim() !== '' ).length > 2 && (
                <Accordion>
                    <Accordion.Summary>Продвинутые подарки</Accordion.Summary>
                    <Accordion.Content>
                        <Div>
                            <CardGrid size="l">  
                                {superInfo['dialog_presents'].map((present, index) => (
                                    <ContentCard title={`${index + 1}. ${present}`} key={`dialog_pres_${index}`}/>                  
                                ))}
                            </CardGrid>
                        </Div>
                    </Accordion.Content>
                </Accordion>
            )}


            {superInfo?.wishlist?.filter( item => item && typeof item === 'string' && item.trim() !== '' ).length > 0 && (
                <Accordion>
                    <Accordion.Summary>Wish-лист</Accordion.Summary>
                    <Accordion.Content>
                        <Div>
                            <CardGrid size="l">  
                                {superInfo['wishlist'].map((present, index) => (
                                    <ContentCard title={`${index + 1}. ${present}`} key={`wish_${index}`}/>                  
                                ))}
                            </CardGrid>
                        </Div>
                    </Accordion.Content>
                </Accordion>
            )}
                        
            


            {superInfo?.no_presents?.some(item => item?.value) && (
                <Accordion>
                    <Accordion.Summary>Что НЕ стоит дарить</Accordion.Summary>
                    <Accordion.Content>
                        <Div>
                            <CardGrid size="l">  
                                {superInfo['no_presents'].filter(item => item?.value).map((present, index) => (
                                    <ContentCard title={`${index + 1}. ${present.value}`} key={`no_${index}`}/>                  
                                ))}
                            </CardGrid>
                        </Div>
                    </Accordion.Content>
                </Accordion>
            )}


        </Group>
    </Panel>
  );
};
