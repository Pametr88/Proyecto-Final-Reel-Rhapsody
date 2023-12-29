"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import request, jsonify, url_for, Blueprint
from api.models import db, User, Favorites 
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import json
from flask_jwt_extended import create_access_token, get_jwt_identity,jwt_required,JWTManager
from flask_bcrypt import Bcrypt
from flask import current_app

api = Blueprint('api', __name__)
bcrypt = Bcrypt()
jwt = JWTManager()
# Allow CORS requests to this API
CORS(api)

@api.route('/sign_up', methods=['POST'])
def create_one_user():
    try:
        
        body = request.get_json()
        print(body)
        required_fields = ["fullName", "email", "password"]
        for field in required_fields:
            if field not in body or not body[field]:
                return jsonify({"error": f"El campo '{field}' es requerido y no puede estar vacío"}), 400


        raw_password = body.get('password')
        password_hash = bcrypt.generate_password_hash(raw_password).decode('utf-8')

        new_user = User (
        full_name = body.get("fullName"),
        email= body.get("email"),
        password = password_hash,
        )

        db.session.add(new_user)
        db.session.commit()


        return jsonify ({"msg": "Usuario creado exitosamente"}), 200

    except Exception as e:
        # Registrar detalles del error en los registros del servidor
        current_app.logger.error(f"Error al crear usuario: {str(e)}")

        # Devolver un mensaje genérico al cliente
        return jsonify({"error": "Ocurrió un error al procesar la solicitud"}), 500
    
# @api.route("/login", methods=['POST'])
# def login():
#     try:
#         data = request.get_json()

#         if not data or 'email' not in data or 'password' not in data:
#             return jsonify({"error": "Se requieren tanto el correo electrónico como la contraseña."}), 400
        
#         email = data['email']
#         password = data['password']

#         if not email or not password:
#             return jsonify({"error": "Faltó algún dato en el cuerpo de la solicitud."}), 400

#         user = User.query.filter_by(email=email).first()

#         if not user:
#             return jsonify({"error": "Usuario no encontrado."}), 404

#         password_db = user.password

#         if password_db != password:
#             return jsonify({"error": "Contraseña incorrecta."}), 401

#         access_token = create_access_token(identity=user.id)

#         return jsonify({"access_token": access_token, "fullname": user.full_name, "id": user.id}), 200

#     except Exception as e:
#         # Imprimir detalles específicos del error en los registros del servidor
#         print(f"Error en la ruta /login: {str(e)}")

#         # Devolver un mensaje detallado al cliente
#         return jsonify({"error": f"Ocurrió un error al procesar la solicitud: {str(e)}"}), 500
    
@api.route("/login", methods=['POST'])
def login():
    try:
        data = request.get_json()

        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"error": "Se requieren tanto el correo electrónico como la contraseña."}), 400
        
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Faltó algún dato en el cuerpo de la solicitud."}), 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"error": "Usuario no encontrado."}), 404

        # Comparar la contraseña proporcionada con el hash almacenado en la base de datos
        if not bcrypt.check_password_hash(user.password, password):
            return jsonify({"error": "Contraseña incorrecta."}), 401

        access_token = create_access_token(identity=user.id)

        return jsonify({"access_token": access_token, "user": user.serialize()}), 200

    except Exception as e:
        # Registrar detalles específicos del error en los registros del servidor
        print(f"Error en la ruta /login: {str(e)}")

        # Devolver un mensaje detallado al cliente
        return jsonify({"error": f"Ocurrió un error al procesar la solicitud: {str(e)}"}), 500

@api.route('/isAuth', methods=['GET'])
@jwt_required()
def is_auth():
    user_id=get_jwt_identity()
    user = User.query.get(user_id)
    if user is None:
        return False, 404
    return jsonify(user.serialize()), 200

@api.route('/user/<int:user_id>/favorites', methods=['GET'])
def get_all_favorites(user_id):
    favorites = Favorites.query.filter_by(user_id = user_id).all()
    if len(favorites) < 1:
        return jsonify({"msg": "not found"}), 404
    serialized_favorites = list(map(lambda x: x.serialize(), favorites))
    return serialized_favorites, 200

@api.route('/favorites', methods=['POST'])
def add_favorites():
    body = request.json 
    new_favorite = Favorites(
        user_id = body["user_id"],
        movies_id = body["movies_id"],
        series_id = body["series_id"],
        actors_id = body["actors_id"] 
    )
    if new_favorite.movies_id is None and new_favorite.series_id is None and new_favorite.actors_id is None:
      return jsonify({"msg": "eres boludo"}), 400
    db.session.add(new_favorite)
    db.session.commit()
    return jsonify({"msg": "sos un capo", "added_favorite": new_favorite})

@api.route('/favorite/<int:favorite_id>', methods=['DELETE'])
def delete_one_favorite(favorite_id):
    favorite = Favorites.query.get(favorite_id)
    if favorite is None:
        return jsonify({"msg": f"favorite with id {favorite_id} not found"}), 404
    db.session.delete(favorite)
    db.session.commit()
    return jsonify({"msg": "favorite deleted"}), 200

# this only runs if `$ python src/app.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3000))
    api.run(host='0.0.0.0', port=PORT, debug=False)
