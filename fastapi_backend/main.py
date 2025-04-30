from fastapi import FastAPI, Request, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import json


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


client = AsyncIOMotorClient('mongodb://admin:admin@90.156.154.242:27017/')
user_info_db = client['user_info']
profile_collection = user_info_db['user_profile']
wish_lists_collection = user_info_db['wish_lists']
unique_ids_collection = user_info_db['unique_ids']
dialog_results_collection = user_info_db['dialog_results']
profile_presents_collection = user_info_db['profile_presents']


@app.post("/api/profile")
async def post_profile(request: Request):
    try:
        data = await request.json()
        user_id = data.get("id", 0)

        if user_id == 0:
            print("CANT READ ID FROM", data)
        else:
            await profile_collection.insert_one({
                "user_id": user_id,
                "created_at": datetime.now(),
                "data": data
            })

            if not await unique_ids_collection.find_one({"user_id": user_id}):
                await unique_ids_collection.insert_one({
                    "user_id": user_id,
                    "added_at": datetime.now()
                })

        return {"status": "success"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/profile")
async def get_profile(id: int = Query(...)):
    user_id = id
    try:
        pipeline = [
            {"$match": {"user_id": user_id}},
            {"$sort": {"created_at": -1}},
            {"$limit": 1}
        ]
        result = await profile_collection.aggregate(pipeline).to_list(length=1)

        if not result:
            raise HTTPException(status_code=404, detail="User not found")

        result[0].pop("_id", None)
        return result[0]

    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid User ID format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/wish_lists")
async def post_wish_list(request: Request):
    try:
        data = await request.json()
        user_id = data.get("id", 0)
        wish_list = data.get("wish_list", [])

        if user_id == 0:
            print("CANT READ ID FROM", data)
        else:
            existing = await wish_lists_collection.find_one({"user_id": user_id})
            if existing:
                await wish_lists_collection.update_one(
                    {"user_id": user_id},
                    {"$set": {"wish_list": wish_list}}
                )
                return {"status": "updated"}
            else:
                await wish_lists_collection.insert_one({
                    "user_id": user_id,
                    "wish_list": wish_list
                })
                return {"status": "added"}

        return {"status": "success"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/wish_lists")
async def get_wish_list(id: int = Query(...)):
    user_id = id
    try:
        wish_list = await wish_lists_collection.find_one(
            {"user_id": user_id},
            {"_id": 0, "wish_list": 1}
        )
        if wish_list:
            return {
                "status": "success",
                "user_id": user_id,
                "wish_list": wish_list.get("wish_list", [])
            }
        else:
            return {
                "status": "not_found",
                "user_id": user_id,
                "wish_list": []
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/unique_ids")
async def get_unique_ids():
    try:
        ids = await unique_ids_collection.find(
            {}, {"_id": 0, "user_id": 1}
        ).to_list(length=None)

        return {
            "status": "success",
            "count": len(ids),
            "unique_ids": [item["user_id"] for item in ids]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/presents")
async def get_presents(id: int = Query(...)):
    user_id = id
    pipeline = [
        {"$match": {"user_id": user_id}},
        {"$sort": {"created_at": -1}},
        {"$limit": 1},
        {"$project": {"_id": 0}}
    ]

    try:
        wish_list_data = await wish_lists_collection.find_one(
            {"user_id": user_id},
            {"_id": 0, "wish_list": 1}
        )
        wish_list = wish_list_data['wish_list']
    except:
        wish_list = []

    try:
        profile_info = await profile_collection.aggregate(pipeline).to_list(length=1)
        dates = profile_info[0]['data']['dates']
        no_presents = profile_info[0]['data']['noPresents']
    except:
        profile_info, dates, no_presents = [], [], []

    try:
        profile_presents_data = await profile_presents_collection.aggregate(pipeline).to_list(length=1)
        profile_presents = profile_presents_data[0]['data']
    except:
        profile_presents = []

    try:
        dialog_presents_data = await dialog_results_collection.aggregate(pipeline).to_list(length=1)
        dialog_presents = dialog_presents_data[0]['summary']['creative_gifts']
    except:
        dialog_presents = []

    return {
        "status": "success",
        'dialog_presents': dialog_presents,
        'profile_presents': profile_presents,
        'wishlist': wish_list,
        'dates': dates,
        'no_presents': no_presents
    }


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=5000)