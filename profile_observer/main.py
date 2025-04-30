import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from parser import parse_user_info, get_prompt
from config import SECRETS
import httpx
from openai import OpenAI
import json

MONGO_URI = SECRETS['MONGO_URI']
OPENAI_TOKEN = SECRETS['OPENAI_TOKEN']
proxy_url = SECRETS['proxy_url']


class MongoPoller:
    def __init__(self):
        self.client = AsyncIOMotorClient(MONGO_URI)
        self.db = self.client['user_info']
        self.collection = self.db['user_profile']
        self.result_collection = self.db['profile_presents']

        transport = httpx.HTTPTransport(proxy=httpx.Proxy(url=proxy_url))
        http_client = httpx.Client(transport=transport, timeout=30.0)
        self.openai_client = OpenAI(api_key=OPENAI_TOKEN, http_client=http_client)

    async def get_chatgpt_response(self, context):
        completion = self.openai_client.chat.completions.create(
            model="gpt-4.1",
            messages=context
        )
        return completion.choices[0].message.content

    async def process_document(self, doc):
        try:
            print(f"Начало обработки документа {doc['_id']}")
            user_id = int(doc['user_id'])

            user_description = parse_user_info(doc['data'])
            prompt = get_prompt(user_description)
            result = await self.get_chatgpt_response([{"role": "assistant", "content": prompt}])
            presents_json = json.loads(result)

            await self.result_collection.insert_one({
                "user_id": user_id,
                "created_at": datetime.now(),
                "data": presents_json['gift_ideas']
            })

            await self.collection.update_one(
                {"_id": doc["_id"]},
                {"$set": {"checked": 1}}
            )
            print(f"Документ {doc['_id']} успешно обработан")

        except Exception as e:
            print(f"Ошибка при обработке документа {doc['_id']}: {e}")

            error_count = doc.get('error_count', 0) + 1

            if error_count > 5:
                print(f"Документ {doc['_id']} не удалось обработать после 5 попыток")

                await self.collection.update_one(
                    {"_id": doc["_id"]},
                    {"$set": {
                        "checked": 1,
                        "error_count": error_count
                    }}
                )

                await self.result_collection.insert_one({
                    "user_id": doc["user_id"],
                    "created_at": datetime.now(),
                    "data": []
                })
                print("Сохранен пустой результат")
            else:
                await self.collection.update_one(
                    {"_id": doc["_id"]},
                    {"$set": {"error_count": error_count}}
                )
                print(f"Документ {doc['_id']} будет обработан повторно (попытка {error_count}/5)")

    async def poll_changes(self):
        while True:
            try:
                pipeline = [
                    {"$match": {"checked": {"$exists": False}}},
                    {"$sort": {"created_at": -1}},
                    {"$group": {
                        "_id": "$user_id",
                        "latest_doc": {"$first": "$$ROOT"}
                    }}
                ]

                cursor = self.collection.aggregate(pipeline)

                async for group in cursor:
                    doc = group["latest_doc"]
                    asyncio.create_task(self.process_document(doc))

                await asyncio.sleep(100)

            except Exception as e:
                print(f"Ошибка в poll_changes: {str(e)}")
                await asyncio.sleep(100)


async def main():
    poller = MongoPoller()
    await poller.poll_changes()


if __name__ == "__main__":
    asyncio.run(main())