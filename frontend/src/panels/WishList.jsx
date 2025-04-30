import { Panel, PanelHeader, PanelHeaderBack, Header, Div, Group, ScreenSpinner, FormItem, Button, Input, Title} from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { UserContext } from '../Context/UserContext';
import React, { useState, useEffect, useContext} from 'react';


export const WishList = ({ id }) => {
  const routeNavigator = useRouteNavigator();
  const { globalState, setGlobalState } = useContext(UserContext);

  const [popout, setPopout] = useState(null);
  const clearPop = () => setPopout(null);
  const setPop = () => {
      setPopout(<ScreenSpinner state="loading" />);
  }

  const [fields, setFields] = useState(['']);
  const addField = () => {
      setFields([...fields, '']);
  };
  const handleFieldChange = (index, value) => {
      const newFields = [...fields];
      newFields[index] = value;
      setFields(newFields);
  };

  const removeField = (index) => {
      if (fields.length <= 1) return;
      const newFields = [...fields];
      newFields.splice(index, 1);
      setFields(newFields);
  };

  useEffect(() => {
      const fetchWishList = async () => {
          setPop()
          try {
              const response = await fetch(`https://whishy.ru/api/wish_lists?id=${globalState.user['id']}`);
              if (response.ok) {
                  const data = await response.json();
                  if (data.wish_list && data.wish_list.length > 0) {
                      setFields(data.wish_list);
                  }
              }
          } catch (error) {
              console.log('Ошибка при загрузке списка');
          } finally {
              clearPop();
          }
      };
      fetchWishList()
    }, []);


  const handleSaveClick = async () => {
      setPop()
      try{
          const response = await fetch('https://whishy.ru/api/wish_lists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: globalState.user['id'],
                wish_list: fields.filter(field => field.trim() !== '')
            }) });

      } catch (error) {
          console.error('Ошибка при отправке:', error);
      }
      finally{
          clearPop();
          routeNavigator.push('/success_page')
      }
    }


  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
        Wish лист
      </PanelHeader>
      <Group header={<Header size="s">Вишлист</Header>}>
        <Div>
          {popout}
          <Title level="4" style={{'alignContent': 'center'}}>Укажите названия желаемых подарков или ссылки, по которым друзья смогут найти то, что вы хотите</Title >
            {fields.map((field, index) => (
                <FormItem 
                top={`Подарок №${index + 1}`} 
                key={index}
                removable = {fields.length > 1}
                onRemove={() => removeField(index)}
                >
                    <Input 
                    id={index} 
                    value={field}
                    key={index}
                    placeholder = "Название подарка или ссылка"
                    onChange={(e) => handleFieldChange(index, e.target.value)}
                    />
                </FormItem>
            ))}
          <Div>
            <Button mode="secondary" onClick={addField} size="m">
                    Добавить еще подарок
            </Button>
          </Div>
        </Div>
      </Group>
      <Div style={{ textAlign: 'center' }}><Button onClick={handleSaveClick} style={{ paddingLeft: 20,  paddingRight: 20}} size='l' appearance='positive'>Сохранить</Button></Div>
    </Panel>
  );
};
