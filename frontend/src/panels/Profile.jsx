import { Group, Panel, PanelHeader, PanelHeaderBack, Group } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';



export const Profile = ({ id }) => {
    const routeNavigator = useRouteNavigator();
  
    return (
      <Panel id={id}>
        <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
          Ваша анкета
        </PanelHeader>
        <Group>
            <Div>
            <Button>
            Диалог
            </Button>
            <Separator size="4xl" direction="horizontal"/>
            <Button>
            Диалог2
            </Button>
            </Div>
        </Group>
      </Panel>
    );
  };
  