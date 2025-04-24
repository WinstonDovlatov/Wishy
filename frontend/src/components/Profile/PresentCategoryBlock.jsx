import {FormLayoutGroup, FormItem, Header, Checkbox, Title, Div, ChipsInput} from '@vkontakte/vkui';


function PresentCategoryBlock({noPresents, setNoPresents, noPresentsInput, setNoPresentsInput, presents, setPresents}) {

      const changePresent = (id) => {
        setPresents(prev => 
          prev.map(item => 
            item.id === id ? { ...item, checked: !item.checked } : item
          )
        );
      };

    return (
        <Div>
            <Title style={{ paddingBottom: 5 }} level='2'>Тип подарка</Title>
            <FormLayoutGroup mode="vertical" segmented>
                <FormItem><Header subtitle="Я бы хотел получить..." size="xs"></Header></FormItem>
                {presents.map(({ id, label, checked }) => (
                    <FormItem key={id}>
                        <Checkbox
                            key={id}
                            checked={checked}
                            onChange={() => changePresent(id)}
                        >
                            {label}
                        </Checkbox>
                </FormItem>
                ))}
            </FormLayoutGroup>
            <FormLayoutGroup mode="vertical" segmented>
                <FormItem><Header subtitle="Я бы НЕ хотел получить..." size="xs"></Header></FormItem>
                <FormItem style={{ paddingTop: 5 }} top="Типы подарков, которые точно не хотелось бы">
                    <ChipsInput
                    id="noPresents"
                    placeholder='Напишите подарок, а после нажмите "Ввод"'
                    allowClearButton
                    value={noPresents}
                    inputValue={noPresentsInput}
                    onChange={(e) => setNoPresents(e)}
                    onInputChange={(e) => setNoPresentsInput(e?.target?.value ?? e)}
                    />
                </FormItem>
            </FormLayoutGroup>
        </Div>
        
    )
}

export default PresentCategoryBlock;