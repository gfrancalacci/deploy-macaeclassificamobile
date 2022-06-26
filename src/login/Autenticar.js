import Globais from "../Globais";
import { Buffer } from 'buffer';

class Autenticar {

    constructor(){
        this.isLoading = false;    
    }

    async login(login, senha, token) {
        return new Promise(async (resolve, reject) => {
            const dados = {
                "login": login,
                "senha": senha
            }
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(dados)
            };
            const url = window.servidor + '/usuario/login/'
            const response = await fetch(url, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if(data.error === undefined){
                        Globais.global_usuario = login;
                        Globais.global_senha = senha;
                        Globais.global_autenticado = true;
                        resolve(data);
                    }
                    else{
                        console.error(data.error + ": " + data.error_description);
                        throw new this.UserLoginException("Falha no login!");
                    }
                })
                .catch(erro => {
                    Globais.global_usuario = "";
                    Globais.global_senha = "";
                    Globais.global_autenticado = false;
                    console.log('erro', erro);
                    reject(erro);
                });

        });
    }

    async getUsuarioFromToken(token) {
        return new Promise(async (resolve, reject) => {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            };

            const url = window.servidor + '/usuario/me/'

            const response = await fetch(url, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if(data.error === undefined){
                        Globais.global_autenticado = true;                        
                        //console.log('data', data);
                        resolve(data);
                    }
                    else{
                        console.error(data.error + ": " + data.error_description);
                        throw new this.UserLoginException("Erro ao recuperar usuário. Por favor faça login novamente.");
                    }
                })
                .catch(erro => {
                    Globais.global_usuario = "";
                    Globais.global_senha = "";
                    Globais.global_autenticado = false;                    
                    console.log('erro', erro);
                    reject(erro);
                });

        });
    }
    async getToken(login, senha) {
        return new Promise(async (resolve, reject) => {
        try {
            global.Buffer = Buffer;
            const auth = "Basic " + new Buffer("programacaojava:java").toString("base64"); 
            var details = {
            'username': login,
            'password': senha,
            'grant_type': 'password'
            };
            var formBody = [];
            for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': auth
                },
                body: formBody
            };
            const url = window.servidor + '/oauth/token'
            const response = await fetch(url, requestOptions)
                .then(response => response.json())
                .then(data => {
 //                   console.log('data: ', data);
 //                   console.log('access_token', data.access_token);
                    if(data.access_token === undefined){
 //                        console.log('Login invalido!');
 //                        reject(console.error("Login inválido!"));
                        if(data.error === undefined){
                            console.error("Login inválido!");
                        }
                        else{
                            console.error(data.error + ": " + data.error_description);
                            throw new this.UserLoginException("Falha no login!");
                        }
                    }
                    else {
                        let expiration_date = Date.now() + data.expires_in*1000;
                        Globais.global_usuario = login;
                        Globais.global_senha = senha;
                        Globais.global_access_token = data.access_token;
                        Globais.global_expires_in = data.expires_in;
                        Globais.global_refresh_token = data.refresh_token;                        
                        Globais.global_expiration_date = data.expiration_date; 
                        resolve(data);
                    }                
                })
            } catch (error) {
                console.log(error);
                reject(error);
            } finally {
                this.isLoading = false;
            }
        });
    }

    async refreshToken(token) {
        return new Promise(async (resolve, reject) => {

            const auth = "Basic " + new Buffer("programacaojava:java").toString("base64");

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': auth
                },
                body: new URLSearchParams({
                    "refresh_token": token,
                    "grant_type": "refresh_token"
                })
            };
    
            const url = window.servidor + '/oauth/token'
            // console.log('token', token)
            const response = await fetch(url, requestOptions)
                .then(response => response.json())
                .then(data => {
                    // console.log('data', data);
                    // console.log('access_token', data.access_token);
                    if(data.access_token === undefined){
                        // console.log('Login invalido!');
                        // reject(console.error("Login inválido!"));
                        if(data.error === undefined){
                            console.error("Falha ao renovar token.");
                        }
                        else{
                            console.error(data.error + ": " + data.error_description);
                            throw new this.UserLoginException("Falha ao renovar token.");
                        }
                    }
                    else {
                        let expiration_date = Date.now() + data.expires_in*1000;
                        Globais.global_access_token = data.access_token;
                        Globais.global_expires_in = data.expires_in;
                        Globais.global_refresh_token = data.refresh_token;                        
                        Globais.global_expiration_date = expiration_date;
                        resolve(data);
                    }
                    
                })
                .catch(erro => {
                    reject(erro);
                });

        });
    }

    estaAutenticado(){
        return Globais.global_autenticado;
    }

    setAutenticado(bool){
        Globais.global_autenticado = bool;        
    }

    UserLoginException(message) {
        this.message = message;
        this.name = "UserLoginException";
     }

}

export default new Autenticar();