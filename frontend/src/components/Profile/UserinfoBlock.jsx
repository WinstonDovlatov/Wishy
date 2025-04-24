import {FormLayoutGroup, FormItem, Input, Select, Title, Div} from '@vkontakte/vkui';


function UserinfoBlock({sexValue, setSex, ageValue, setAge}) {
    return (
        <Div>
        <Title level='3'>Основная информация</Title>
        <FormLayoutGroup mode="horizontal">
                <FormItem top="Ваш возраст">
                  <Input id="age" value={ageValue} onChange={(e) => setAge(e?.target?.value ?? e)}/>
                </FormItem>
                <FormItem top="Пол">
                    <Select
                        id="gender-select-id"
                        value={sexValue}
                        onChange={(e) => setSex(e?.target?.value ?? e)}
                        placeholder="Выберите пол"
                        options={[
                        {
                            value: 2,
                            label: 'Мужской',
                        },
                        {
                            value: 1,
                            label: 'Женский',
                        },
                        ]}
                    />
                </FormItem>
        
        </FormLayoutGroup>
        </Div>
        
    )
}

export default UserinfoBlock;