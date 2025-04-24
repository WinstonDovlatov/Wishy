from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from pymongo import MongoClient
from datetime import datetime

client = MongoClient('mongodb://admin:admin@90.156.154.242:27017/')
user_info_db = client['user_info']
profile_collection = user_info_db['user_profile']
wish_lists_collection = user_info_db['wish_lists']

app = Flask(__name__)
CORS(app)

@app.route('/api/profile', methods=['POST'])
def post_profile():
    try:
        data = request.get_json()
        user_id = data.get('id', 0)
        if user_id == 0:
            print("CANT READ ID FROM", data)
        else:
            profile_collection.insert_one({
                "user_id": user_id,
                "created_at": datetime.now(),
                "data": data
            })
        return jsonify({"status": "success"}), 200
    except Exception as e:
        print(e)

@app.route('/api/profile', methods=['GET'])
def get_profile():
    try:
        user_id = request.args.get('id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        user_id = int(user_id)

        pipeline = [
            {"$match": {"user_id": user_id}},
            {"$sort": {"created_at": -1}},
            {"$limit": 1}
        ]

        result = list(profile_collection.aggregate(pipeline))

        if not result:
            return jsonify({"error": "User not found"}), 404

        result[0].pop('_id', None)
        return jsonify(result[0]), 200

    except ValueError:
        return jsonify({"error": "Invalid User ID format"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/wish_lists', methods=['POST'])
def post_wish_list():
    try:
        data = request.get_json()
        user_id = data.get('id', 0)
        wish_list_to_store = data.get('wish_list', [])

        if user_id == 0:
            print("CANT READ ID FROM", data)
        else:
            doc = {
                "user_id": user_id,
                "wish_list": wish_list_to_store
            }
            existing_wish = wish_lists_collection.find_one({"user_id": user_id})

            if existing_wish:
                result = wish_lists_collection.update_one(
                    {"user_id": user_id},
                    {
                        "$set": {
                            "wish_list": wish_list_to_store,
                        }
                    }
                )
                return jsonify({"status": "updated"}), 200
            else:
                result = wish_lists_collection.insert_one(doc)
                return jsonify({"status": "added"}), 200

        return jsonify({"status": "success"}), 200
    except Exception as e:
        print(e)

@app.route('/api/wish_lists', methods=['GET'])
def get_wish_list():
    try:
        user_id = int(request.args.get('id'))

        wish_list_data = wish_lists_collection.find_one(
            {"user_id": user_id},
            {"_id": 0, "wish_list": 1}  # Исключаем _id из ответа, включаем только wish_list
        )
        if wish_list_data:
            return jsonify({
                "status": "success",
                "user_id": user_id,
                "wish_list": wish_list_data.get("wish_list", [])
            }), 200
        else:
            return jsonify({
                "status": "not_found",
                "user_id": user_id,
                "wish_list": []
            }), 404
    except:
        return jsonify({
            "status": "err",
            "wish_list": []
        }), 500



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

