import {
  FormLayoutGroup,
  FormItem,
  Input,
  DateInput,
  Title,
  Button, Div
} from '@vkontakte/vkui';


const DynamicDatesForm = ({importantDates, setImportantDates}) => {
  // Добавление нового блока
  const addBlock = () => {
    const newBlock = {
      id: Date.now().toString(),
      title: '',
      date: null,
    };
    setImportantDates([...importantDates, newBlock]);
  };

  // Удаление блока
  const removeBlock = (id) => {
    if (importantDates.length <= 1) return;
    setImportantDates(importantDates.filter(block => block.id !== id));
  };

  // Обновление поля title
  const handleTitleChange = (id, value) => {
    setImportantDates(
      importantDates.map(block =>
        block.id === id ? { ...block, title: value } : block
      )
    );
  };

  // Обновление поля date
  const handleDateChange = (id, date) => {
    setImportantDates(
      importantDates.map(block =>
        block.id === id ? { ...block, date } : block
      )
    );
  };


  return (
    <Div>
      <Title level='3' style={{ marginTop: '12px' }}>Важные даты</Title>
      {importantDates.map((block, index) => (
        <FormLayoutGroup 
          key={block.id} 
          mode="horizontal" 
          removable = {importantDates.length > 1}
          onRemove={() => removeBlock(block.id)}
        >
          <FormItem top={`Событие №${index + 1}`} >
            <Input
              value={block.title}
              placeholder='Название'
              onChange={e => handleTitleChange(block.id, e.target.value)}
            />
          </FormItem>

          <FormItem>
            <DateInput
              value={block.date}
              onChange={date => handleDateChange(block.id, date)}
              renderCustomValue={(date) =>
                date ? undefined : (
                  <span aria-hidden style={{ color: 'var(--vkui--color_text_secondary)' }}>
                    Дата
                  </span>
                )
              }
            />
          </FormItem>
        </FormLayoutGroup>
      ))}
      <Div>
      <Button 
        size="m" 
        mode="secondary" 
        onClick={addBlock}
        style={{ marginTop: '12px' }}
      >
        Добавить еще событие
      </Button>
      </Div>
      {/* Для отладки
      <div style={{ marginTop: '24px' }}>
        <pre>{JSON.stringify(importantDates, null, 2)}</pre>
      </div> */}
    </Div>
  );
};

export default DynamicDatesForm;