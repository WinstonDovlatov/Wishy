import { Panel, PanelHeader, Paragraph, Header, Div, Group, Separator, Placeholder, Button} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import DynamicPresentsForm from '../components/DynamicPresentsForm';
import { UserContext } from '../Context/UserContext';
import React, { useState, useContext} from 'react';
import {Icon56CheckCircleOutline} from '@vkontakte/icons';

export const SuccessPage = ({ id }) => {
  const routeNavigator = useRouteNavigator();

  return (
    <Panel id={id}>
      <PanelHeader>
        Успех!
      </PanelHeader>
          <Group>
                <Placeholder
                        icon={<Icon56CheckCircleOutline />}
                        title="Отлично! Теперь друзья будут знать, что вам подарить!"
                        action={<Button size="m" onClick={() => routeNavigator.push('/')}><Paragraph style={{ whiteSpace: 'normal' }}>На главную</Paragraph></Button>}
                      >
                  </Placeholder>
            </Group>
    </Panel>
  );
};
