import axios from 'axios';
import env from "../../configs/env"

export class AdmActionService {
  async getAdmActionV(uToken) {
    const url = `${env.ADM_BACK_URL}/adm/action_v`;
    const headers = { Authorization: uToken.token };

    try {
      const response = await axios.get(url, { headers });
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}


export const  AdmActionServiceTest = {
  getData() {
      return [
        {
          id: '1000',
          code: 'f230fh0g3',
          text: 'Bamboo Watch',
          valid: true,
        },
        {
          id: '1001',
          code: 'nvklal433',
          text: 'Black Watch',
          valid: true,
        },
        {
          id: '1002',
          code: 'zz21cz3c1',
          text: 'Blue Band',
          valid: false,
        },
        {
          id: '1003',
          code: '244wgerg2',
          text: 'Blue T-Shirt',
          valid: true,
        },
        {
          id: '1004',
          code: 'h456wer53',
          text: 'Bracelet',
          valid: true,
        },
        {
          id: '1005',
          code: 'av2231fwg',
          text: 'Brown Purse',
          valid: true,
        },
      ];
    },
    getAdmActionV() {
      return Promise.resolve(this.getData());
  },    
}    