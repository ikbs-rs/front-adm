import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class AdmUserattsService {

    async getLista(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.ADM_BACK_URL}/adm/useratts/_v/lista/?stm=adm_useratts_v&objid=${objId}&sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
          Authorization: tokenLocal.token
        };
    
        try {
          const response = await axios.get(url, { headers });
          return response.data.item;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }

    async getAdmUserattss() {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.ADM_BACK_URL}/adm/useratts/?sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getAdmUseratts(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.ADM_BACK_URL}/adm/useratts/${objId}/?sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    async postAdmUseratts(newObj) {
        try {
            console.log("*****---------------******+++*****", newObj )
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.action === null || newObj.roll === null) {
                throw new Error(
                    "Items must be filled!"
                );
            }
            const url = `${env.ADM_BACK_URL}/adm/useratts/?sl=${selectedLanguage}`;

            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj)
            console.log(url,"*****---------------***********", jsonObj )
            const response = await axios.post(url, jsonObj, { headers });
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async putAdmUseratts(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.action === null || newObj.roll === null)  {
                throw new Error(
                    "Items must be filled!"
                );
            }
            const url = `${env.ADM_BACK_URL}/adm/useratts/?sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj)
            const response = await axios.put(url, jsonObj, { headers });
            //console.log("**************"  , response, "****************")
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }

    }

    async deleteAdmUseratts(newObj) {
        try {
            const url = `${env.ADM_BACK_URL}/adm/useratts/${newObj.id}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Authorization': tokenLocal.token
            };

            const response = await axios.delete(url, { headers });
            return response.data.items;
        } catch (error) {
            throw error;
        }

    }

    async  getCmnPar(cmnParCode) {
        console.log(cmnParCode, "***************getCmnPar**************")
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.CMN_URL}/?endpoint=parend&code=${cmnParCode}&sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
          Authorization: tokenLocal.token
        };
      
        try {
          console.log(url, "***************url**************")
          const response = await axios.get(url, { headers });
          return response.data; // Očekujemo da će ovo vratiti objekat sa ključevima 'code' i 'text'
        } catch (error) {
          console.error(error);
          throw error;
        }
      }    
}

