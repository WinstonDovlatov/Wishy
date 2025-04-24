import { Panel, PanelHeader, PanelHeaderBack, Header, Div, Group, Separator, ScreenSpinner, Button} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import UserinfoBlock from '../components/Profile/UserinfoBlock';
import DynamicDatesForm from '../components/Profile/DynamicDatesForm';
import HobbiesBlock from '../components/Profile/HobbiesBlock';
import PresentCategoryBlock from '../components/Profile/PresentCategoryBlock';
import { UserContext } from '../Context/UserContext';
import React, { useState, useContext} from 'react';

export const UserInfoFirst = ({ id }) => {
  const routeNavigator = useRouteNavigator();
  const { globalState, setGlobalState } = useContext(UserContext);
  
  const [popout, setPopout] = useState(null);
  const clearPopout = () => setPopout(null);

  const [sexValue, setSex] = useState(() => {
      try{
          if (globalState.user['sex'] === 2) {
              return 2;
          } 
          else if (globalState.user['sex'] === 1) {
              return 1; 
          }
          else{
              return null;
          }
      } catch(e) {
          return null;
      }
    });

    const [ageValue, setAge] = useState(() => {
        try{
            const [day, month, year] = globalState.user['bdate'].split('.').map(Number);
            const birthDate = new Date(year, month - 1, day);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        }
        catch(e){
            return null;
        }
    }
    )

    function createDate() {
      try{
        const [day, month, _] = globalState.user['bdate'].split('.').map(Number);
        return new Date(new Date().getFullYear(), month - 1, day)
      } catch(e) {
        return null
      } 
    }

    const [importantDates, setImportantDates] = useState(() => {
      return [{
        id: Date.now().toString(),
        title: "День рождения", 
        date: createDate(),
      }] 
    });


    const [interests, setInterests] = useState([
      {id: 'sport', label: 'Спорт (футбол, йога, бег, качалка)', checked: false},
      {id: 'automobile', label: 'Авто (тюнинг, запчасти)', checked: false},
      {id: 'beauty', label: 'Бьюти (косметика, аксессуары)', checked: false},
      {id: 'games', label: 'Игры (компьютерные, настольные)', checked: false},
      {id: 'art', label: 'Творчество (рисование, глина, пазлы)', checked: false},
    ]);
    const [extraInterests, setExtra] = useState([])
    const [extraInput, setExtraInput] = useState()


    const [noPresents, setNoPresents] = useState([])
    const [noPresentsInput, setNoPresentsInput] = useState()


    const [presents, setPresents] = useState([
        {id: 'practical', label: 'Практичный (техника, одежда)', checked: false},
        {id: 'emotional', label: 'Эмоции (прыжок с парашютом, мастеркласс)', checked: false},
        {id: 'handmade', label: 'Сделанный своими руками', checked: false},
        {id: 'joke', label: 'Подарок-шутка', checked: false},
      ]);


    const setPop = () => {
      setPopout(<ScreenSpinner state="loading" />);
    }


    const handleSaveClick = async () => {
      setPop()
      try {
      const userProfileData = {
        id: globalState.user['id'],
        sex: sexValue,
        age: ageValue,
        dates: importantDates,
        interests: interests,
        extraInterests: [...extraInterests, extraInput],
        presents: presents,
        noPresents: [...noPresents, noPresentsInput]
      }

      const API_URL = 'https://whishy.ru/api/profile';
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userProfileData),
        });
    
      } catch (error) {
        console.error('Ошибка при отправке:', error);
      } finally {
      clearPopout();
      routeNavigator.push('/user_info_2')
      }
    }


  return (
    <Panel id={id}>
      {popout}
            <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
              Ваша анкета (1/2)
            </PanelHeader>
            <Group header={<Header size="s">Узнаем вас поближе</Header>}>
              <UserinfoBlock sexValue = {sexValue} setSex = {setSex} ageValue = {ageValue} setAge = {setAge}/>
              <Separator size="xl" direction="horizontal"/>
              <DynamicDatesForm importantDates={importantDates} setImportantDates={setImportantDates}/>
              <Separator size="xl" direction="horizontal"/>
              <HobbiesBlock interests = {interests} setInterests={setInterests} extraInterests = {extraInterests} setExtra={setExtra} extraInput = {extraInput} setExtraInput={setExtraInput}/>
              <Separator size="xl" direction="horizontal"/>
              <PresentCategoryBlock noPresents = {noPresents} setNoPresents={setNoPresents} noPresentsInput={noPresentsInput} setNoPresentsInput={setNoPresentsInput} presents={presents} setPresents={setPresents}/>
              <Div style={{ textAlign: 'center' }}><Button onClick={handleSaveClick} style={{ paddingLeft: 20,  paddingRight: 20}} size='l' appearance='positive'>Сохранить</Button></Div>
            </Group>

    </Panel>
  );
};
