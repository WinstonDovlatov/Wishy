import React, { useState, useEffect, useContext } from 'react';
import {FormItem, Input, Button, Div, Title, ScreenSpinner} from '@vkontakte/vkui';
import { UserContext } from '../Context/UserContext';


function DynamicPresentsForm() {
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
                showSnackbar('Ошибка при загрузке списка');
            } finally {
                clearPop();
            }
        };
        fetchWishList()
    }, []);

    return (
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
    )
}

export default DynamicPresentsForm;