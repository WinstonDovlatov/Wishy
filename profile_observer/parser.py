def parse_user_info(d):
    if d is None:
        return "Анкета не заполнена\n"
    sex_str = "Пол: " + __get_sex(d)
    age_str = "Возраст: " + str(d.get('age', "Неизвестен"))
    interests_str = "Анкета по интересам: " + __get_interests(d)
    extra_inerests_str = "Дополнительные интересы, указанные пользователем: " + __get_extra_interests(d)
    present_type_sr = 'Анкета по типам подарка. ' + __get_presents_types(d)
    no_presents_str = "Подарки, которые не хотел бы получить: " + __get_no_pres(d)
    user_description = ' \n'.join(
        [sex_str, age_str, interests_str, extra_inerests_str, present_type_sr, no_presents_str])
    return user_description


def __get_sex(d):
    sex = d.get('sex', 0)
    if sex == 1:
        return 'Женщина'
    if sex == 2:
        return 'Мужчина'
    else:
        return "Неизвестен"


def __get_interests(d):
    interests = d.get('interests', None)
    if interests is None:
        return "Не заполнена"
    try:
        return '  '.join([f"{x['label']}: {'не' if not x['checked'] else ''} нравится." for x in interests])
    except:
        return "Не заполнена"


def __get_extra_interests(d):
    arr = d.get('extraInterests', None)
    if (arr is None) or (len(arr) == 0) or ((len(arr) == 1) and (arr[0] is None)):
        return "Не указаны."
    try:
        if type(arr[-1]) != dict:
            arr[-1] = {'label': arr[-1]}
        return ', '.join([x['label'] for x in arr])
    except:
        return "Не указаны."


def __get_presents_types(d):
    v = d.get('presents', None)
    if v is None:
        return "Не заполнена"
    try:
        return '  '.join([f"{x['label']}: {'не ' if not x['checked'] else ''}хотел бы получить." for x in v])
    except:
        return "Не заполнена"


def __get_no_pres(d):
    arr = d.get('noPresents', None)
    if (arr is None) or (len(arr) == 0) or ((len(arr) == 1) and (arr[0] is None)):
        return "Не указаны."
    try:
        if type(arr[-1]) != dict:
            arr[-1] = {'label': arr[-1]}
        return ', '.join([x['label'] for x in arr])
    except: "Не указаны."


def get_prompt(user_description):
    prompt = f"""
    Ты — ассистент, который анализирует анкетные данные пользователя, чтобы предложить уникальные идеи для подарков. 

    ### Данные пользователя:
    {user_description}""" + """
    ### Инструкции:
    1. **Анализ профиля**:
       - Выяви скрытые паттерны на основе анкеты (например, отсутствие интереса к стандартным категориям → потребность в нестандартных решениях)
       - Определи контекст (что избегает пользователь → какие потребности остаются неохваченными)
       - Сгенерируй как очевидные, так и неожиданные идеи подарков

    2. **Генерация идей**:
       - Создай 20-30 вариантов подарков, привязанных к разным аспектам личности
       - Часть подарков должна быть неочевидной (мысли нешаблонно)
       - Учитывай все ограничения из анкеты (что пользователь НЕ хочет получать)

    3. **Формат вывода**:
       - Предоставь ответ ТОЛЬКО в виде JSON:
    ```json
    {
      "gift_ideas": [
        // 20-30 вариантов подарков (разных категорий)
        // Пример: "Ретро-плакат с культовым фильмом 90-х"
      ]
    }
       - ВНИМАНИЕ: Отправляй ТОЛЬКО RAW-JSON без каких-либо дополнительных символов до или после. 
Пример допустимого ответа:
{"gift_ideas": ["Подарок 1", "Подарок 2"]}
"""
    return prompt
