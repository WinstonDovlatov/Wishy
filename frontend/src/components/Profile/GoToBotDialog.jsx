import {Button, Div, Separator,Paragraph} from '@vkontakte/vkui';

function GoToBotDialog() {
    return (
        <Div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="https://vk.com/im?sel=-230099802&entrypoint=community_page" target="_blank" rel="noopener noreferrer"><Button>
            Рассказать о себе
            </Button></a>
            <Separator size="xl" direction="vertical"/>
            <Paragraph>Будет открыт диалог с нашым умным помощником, который поможет лучше узнать ваши интересы и предпочтения</Paragraph>
        </Div>
    )
}

export default GoToBotDialog;