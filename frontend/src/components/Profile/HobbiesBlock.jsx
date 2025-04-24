import {FormLayoutGroup, FormItem, Header, Checkbox, Title, Div, ChipsInput} from '@vkontakte/vkui';


function HobbiesBlock({interests, setInterests, extraInterests, setExtra, extraInput, setExtraInput}) {
    const onChangeExtra = (event) => {
        setExtra(event);
    };


      const toggleInterest = (id) => {
        setInterests(prev => 
          prev.map(item => 
            item.id === id ? { ...item, checked: !item.checked } : item
          )
        );
      };

    return (
        <Div>
            <Title style={{ paddingBottom: 5 }} level='2'>Интересы</Title>
            <FormLayoutGroup mode="vertical" segmented>
            <FormItem><Header subtitle="Мне нравится..." size="xs"></Header></FormItem>
            
                {interests.map(({ id, label, checked }) => (
                    <FormItem key={id}>
                        <Checkbox
                            key={id}
                            checked={checked}
                            onChange={() => toggleInterest(id)}
                        >
                            {label}
                        </Checkbox>
                </FormItem>
                ))}
                <FormItem style={{ paddingTop: 5 }} top="Другие занятия и интересы">
                    <ChipsInput
                    id="extra"
                    placeholder='Напишите интерес, а после нажмите "Ввод"'
                    allowClearButton
                    value={extraInterests}
                    inputValue={extraInput}
                    onChange={onChangeExtra}
                    onInputChange={(e) => setExtraInput(e?.target?.value ?? e)}
                    />
                </FormItem>
            </FormLayoutGroup>
            <Div>
                {/* Для отладки
      <div style={{ marginTop: '24px' }}>
        <pre>{JSON.stringify(extraInterests, null, 2)}</pre>
        <text>{extraInput}</text>
      </div> */}
            </Div>
        </Div>
        
    )
}

export default HobbiesBlock;