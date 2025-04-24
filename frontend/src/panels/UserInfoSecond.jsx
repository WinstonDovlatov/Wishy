import { Panel, PanelHeader, PanelHeaderBack, Header, Div, Group, Placeholder, Paragraph, Button, ButtonGroup} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import GoToBotDialog from '../components/Profile/GoToBotDialog';
import { UserContext } from '../Context/UserContext';
import React, { useState, useContext} from 'react';
import {Icon56ArticleOutline, Icon56MessageReadOutline} from '@vkontakte/icons';

export const UserInfoSecond = ({ id }) => {
  const routeNavigator = useRouteNavigator();
  const { globalState, setGlobalState } = useContext(UserContext);

  const handleSaveClick = () => {
    routeNavigator.push('/user_info_3')
    window.open(
        "https://vk.com/im?sel=-230099802&entrypoint=community_page",
        "_blank",
      );

  }

  return (
    <Panel id={id}>
      <PanelHeader>
        Ваша анкета (2/2)
      </PanelHeader>
      <Group>
                    <Placeholder
                        icon={<Icon56MessageReadOutline />}
                        title="Умный диалог"
                        action={
                          
                        <ButtonGroup>  
                        <a href="https://vk.com/im?sel=-230099802&entrypoint=community_page" target="_blank" rel="noopener noreferrer">
                        <Button 
                            size="m" 
                            style={{ whiteSpace: 'normal !important' }} 
                            onClick={() => routeNavigator.push('/success_page')}>
                            <Paragraph style={{ whiteSpace: 'normal' }}>Перейти к диалогу</Paragraph>
                        </Button>
                        </a>
                        <Button size="m" mode='secondary'  onClick={() => routeNavigator.push('/success_page')}>Пропустить</Button>
                        </ButtonGroup>  
                        }
                      >
                        Поговорите с ботом, чтобы мы и ваши друзья знали что вам подарить!
                      </Placeholder>
      </Group>
    </Panel>
  );
};
