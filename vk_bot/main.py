from vkbottle.bot import Bot
from motor.motor_asyncio import AsyncIOMotorClient
import httpx
from openai import OpenAI
from config import SECRETS
from parser import parse_user_info, generate_prompt
import json
from datetime import datetime


MONGO_URI = SECRETS['MONGO_URI']
VK_TOKEN = SECRETS['VK_TOKEN']
OPENAI_TOKEN = SECRETS['OPENAI_TOKEN']
proxy_url = SECRETS['proxy_url']


try:
    mongo_client = AsyncIOMotorClient(MONGO_URI)
    db = mongo_client['user_info']
    profile_collection = db['user_profile']
    dialog_result_collection = db['dialog_results']
    print("LOG: connected to db")
except Exception as e:
    profile_collection = None
    print(f"LOG: NOT connected to db\n{e}\n")

proxies = {
    "http": proxy_url,
    "https": proxy_url,
}
transport = httpx.HTTPTransport(proxy=httpx.Proxy(url=proxy_url))
http_client = httpx.Client(transport=transport, timeout=30.0)

openai_client = OpenAI(api_key=OPENAI_TOKEN, http_client=http_client)
vk_bot = Bot(VK_TOKEN)
user_contexts = {}


async def get_user_info(user_id):
    if profile_collection is None:
        return None
    pipeline = [
        {"$match": {"user_id": user_id}},
        {"$sort": {"created_at": -1}},
        {"$limit": 1}
    ]

    try:
        cursor = profile_collection.aggregate(pipeline)
        result = await cursor.to_list(length=1)
        return result[0] if result else None
    except Exception as e:
        print(f"Error fetching user info: {e}")
        return None


async def get_chatgpt_response(context):
    try:
        completion = openai_client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=context
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"Ошибка при запросе к ChatGPT: {e}")
        return "Извините, не удалось обработать ваш запрос."


async def save_dialog_results(user_id, info_to_save):
    try:
        document = {
            "user_id": user_id,
            "created_at": datetime.now(),
            "summary": info_to_save
        }
        result = await dialog_result_collection.insert_one(document)
        print(f"saved\n{info_to_save}")
    except:
        print(f"failed to save {info_to_save}")

@vk_bot.on.message()
async def handler(msg) -> str:
    user_id = msg.peer_id
    user_text = msg.text

    if user_id not in user_contexts:
        try:
            info = await get_user_info(int(user_id))
            user_description = parse_user_info(info.get('data', None))
        except:
            user_description = "Анкета не заполнена"
        init_prompt = generate_prompt(user_description)
        print(init_prompt)

        user_contexts[user_id] = [
            {"role": "system", "content": init_prompt}
        ]

    user_contexts[user_id].append({"role": "user", "content": user_text})
    response = await get_chatgpt_response(user_contexts[user_id])
    user_contexts[user_id].append({"role": "assistant", "content": response})
    if '||JSON_START||' in response:
        to_user, to_db = response.split('||JSON_START||')
        to_db = json.loads(to_db.replace('||JSON_END||', ''))
        print(to_db)
        await save_dialog_results(user_id, to_db)
        return to_user


    return response

vk_bot.run_forever()
