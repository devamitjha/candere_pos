// productSearchActions.js
import axios from 'axios';

export const fetchProductsData = async (storeCode, agentCodeOrPhone, customer_id, categoriesName, currentPage) => {  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: '/api/V1/pos-productmanagement/getproducts',
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 9tcpn4uq9my8ymfj0qbdsscld9pqzlta',
    },
    data: JSON.stringify({
        storeCode:storeCode ,
        agentCode:agentCodeOrPhone,
        customerId:customer_id,
        product_type:categoriesName,
        page: currentPage,
    }),
  };

  try {
    const response = await axios.request(config);  
    return response; 
  } catch (error) {
    throw error;
  }
};
