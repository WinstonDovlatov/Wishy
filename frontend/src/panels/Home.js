import { Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar, SplitLayout, SplitCol, Placeholder, Text, Paragraph } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import {Icon56ArticleOutline, Icon56UserSquareOnSquareOutline, Icon56MasksOutline, Icon56HealthOutline} from '@vkontakte/icons';
import { UserContext } from '../Context/UserContext';
import React, { useContext} from 'react';

export const Home = ({ id, fetchedUser }) => {
  const { photo_200, city, first_name, last_name } = { ...fetchedUser };
  const routeNavigator = useRouteNavigator();
  const { globalState, setGlobalState } = useContext(UserContext);


  const profileButton = () => (
          <Group>
              <Placeholder
                  icon={<Icon56ArticleOutline />}
                  title="Ваша анкета"
                  action={<Button size="m" style={{ whiteSpace: 'normal !important' }} onClick={() => routeNavigator.push('user_info_1')}><Paragraph style={{ whiteSpace: 'normal' }}>Заполнить анкету</Paragraph></Button>}
                >
                  Заполните анкету, чтобы ваши друзья знали, что вам подарить!
                </Placeholder>
          </Group>
  )

  const checkFriendsButton = () => (
    <Group>
            <Placeholder
                    icon={<Icon56UserSquareOnSquareOutline />}
                    title="Подарки для друзей"
                    action={<Button size="m" onClick={() => routeNavigator.push('persik')}><Paragraph style={{ whiteSpace: 'normal' }}>Просмотреть подарки</Paragraph></Button>}
                  >
                    Давайте посмотрим, какие подарки подойдут вашим друзьям!
            </Placeholder>
          </Group>
  )


  const wishListButton = () => (
    <Group>
          <Placeholder
                  icon={<Icon56HealthOutline />}
                  title="Wish-лист"
                  action={<Button size="m" onClick={() => routeNavigator.push('wish_list')}><Paragraph style={{ whiteSpace: 'normal' }}>Заполнить</Paragraph></Button>}
                >
                  Ваш список пожеланий по подаркам
                </Placeholder>
          </Group>
  )

  return (
    <Panel id={id}>
      <PanelHeader>Главная</PanelHeader>
      {/* {fetchedUser && (
        <Group header={<Header size="s">User Data Fetched with VK Bridge</Header>}>
          <Cell before={photo_200 && <Avatar src={photo_200} />} subtitle={city?.title}>
            {`${first_name} ${last_name}`}
          </Cell>
        </Group>
      )} */}

      {/* <Group header={<Header size="s">Navigation Example</Header>}>
        <Div>
          <Button stretched size="l" mode="secondary" onClick={() => routeNavigator.push('persik')}>
            Персика, пожалуйста!
          </Button>
        </Div>
      </Group> */}
      <Group>
        <Div>
          {
            globalState.platform === 'vkcom' ? (
              <SplitLayout>
              <SplitCol>{profileButton()}</SplitCol>
              <SplitCol>{checkFriendsButton()}</SplitCol>
              <SplitCol>{wishListButton()}</SplitCol>
              </SplitLayout>
            ) : (
              <Div>
              {profileButton()}
              {checkFriendsButton()}
              {wishListButton()}
              </Div>
            )
          }
        </Div>
      </Group>
    </Panel>
  );
};




// const panels = ['panel 1', 'panel 2', 'panel 3'];
// const modals = ['modal 1', 'modal 2'];

// const Example = () => {
//   const platform = usePlatform();
//   const { viewWidth } = useAdaptivityConditionalRender();
//   const [panel, setPanel] = React.useState(panels[0]);
//   const [modal, setModal] = React.useState(null);
//   const [popout, setPopout] = React.useState(null);

//   const modalRoot = (
//     <ModalRoot activeModal={modal}>
//       <ModalPage
//         id={modals[0]}
//         onClose={() => setModal(null)}
//         header={<ModalPageHeader>Modal 1</ModalPageHeader>}
//       >
//         <Group>
//           <CellButton onClick={() => setModal(modals[1])}>Modal 2</CellButton>
//         </Group>
//       </ModalPage>
//       <ModalPage
//         id={modals[1]}
//         onClose={() => setModal(null)}
//         header={<ModalPageHeader>Modal 2</ModalPageHeader>}
//       >
//         <Group>
//           <CellButton onClick={() => setModal(modals[0])}>Modal 1</CellButton>
//         </Group>
//       </ModalPage>
//     </ModalRoot>
//   );

//   const isVKCOM = platform === 'vkcom';

//   return (
//     <SplitLayout center header={!isVKCOM && <PanelHeader delimiter="none" />}>
//       {viewWidth.tabletPlus && (
//         <SplitCol className={viewWidth.tabletPlus.className} fixed width={280} maxWidth={280}>
//           <Panel>
//             {!isVKCOM && <PanelHeader />}
//             <Group>
//               {panels.map((i) => (
//                 <Cell key={i} hovered={i === panel} onClick={() => setPanel(i)}>
//                   {i}
//                 </Cell>
//               ))}
//               <Separator />
//               <Cell onClick={() => setModal(modals[0])}>modal 1</Cell>
//               <Cell onClick={() => setModal(modals[1])}>modal 2</Cell>
//               <Cell
//                 onClick={() => setPopout(<Alert title="Alert!" onClose={() => setPopout(null)} />)}
//               >
//                 alert
//               </Cell>
//             </Group>
//           </Panel>
//         </SplitCol>
//       )}

//       <SplitCol width="100%" maxWidth="560px" stretchedOnMobile autoSpaced>
//         <View activePanel={panel}>
//           <Panel id={panels[0]}>
//             <PanelHeader after={<Avatar size={36} />}>Panel 1</PanelHeader>
//             <Group>
//               <Placeholder
//                 icon={<Icon56UsersOutline />}
//                 title="Уведомления от сообществ"
//                 action={<Button size="m">Подключить сообщества</Button>}
//               >
//                 Подключите сообщества, от которых Вы хотите получать уведомления
//               </Placeholder>
//               <Separator />
//               <Placeholder icon={<Icon56MentionOutline />}>
//                 Введите адрес страницы в поле поиска
//               </Placeholder>
//             </Group>
//           </Panel>

//           <Panel id={panels[1]}>
//             <PanelHeader after={<Avatar size={36} />}>Panel 2</PanelHeader>
//             <Group>
//               <Placeholder>Доступ запрещён</Placeholder>
//               <Separator />
//               <Placeholder title="Находите друзей" action={<Button size="m">Найти друзей</Button>}>
//                 Здесь будут отображаться люди, которых вы добавите в друзья
//               </Placeholder>
//             </Group>
//           </Panel>

//           <Panel id={panels[2]}>
//             <PanelHeader after={<Avatar size={36} />}>Panel 3</PanelHeader>
//             <Group>
//               <Placeholder
//                 icon={<Icon56MessageReadOutline />}
//                 action={
//                   <Button size="m" mode="tertiary">
//                     Показать все сообщения
//                   </Button>
//                 }
//               >
//                 Нет непрочитанных
//                 <br />
//                 сообщений
//               </Placeholder>
//             </Group>
//           </Panel>
//         </View>
//       </SplitCol>
//       {popout}
//       {modalRoot}
//     </SplitLayout>
//   );
// };

// <Example />;